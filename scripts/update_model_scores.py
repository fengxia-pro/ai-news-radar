"""Refresh the existing Vellum charts, retaining the last snapshot on failure."""
from __future__ import annotations

import argparse
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import json
import math
from pathlib import Path
import re

import requests
from bs4 import BeautifulSoup

SOURCE_URL = "https://www.vellum.ai/llm-leaderboard"
# Pin benchmark versions: AIME 2025 must never silently become AIME 2026.
FIELDS = {
    "gpqa": "gpqaReasoningNum",
    "aime": "numAime2025MathCompetition",
    "arc-agi": "numArcAgi2",
    "work-automations": "numAutomationBench",
    "computer-use": "numOsworldVerified",
    "terminal-use": "numTerminalBench2",
}


# Pin a single evaluation cohort per chart: never pool incompatible setups.
COHORTS = {
    "gpqa": ("gpqa-diamond", "gpqa-diamond-aa", "GPQA Diamond · AA"),
    "work-automations": ("automationbench", "automationbench-zapier-1-0-6", "AutomationBench 1.0.6"),
    "computer-use": ("osworld", "osworld-2-1-full", "OSWorld 2.1 · full set"),
    "terminal-use": ("terminal-bench", "terminal-bench-4-0", "Terminal-Bench 4.0"),
}


def parse_source(html: str) -> tuple[list[dict], list[dict], str]:
    soup = BeautifulSoup(html, "html.parser")
    chunks = []
    prefix = "self.__next_f.push("
    for script in soup.find_all("script"):
        raw = script.get_text().strip().rstrip(";")
        if not raw.startswith(prefix) or not raw.endswith(")"):
            continue
        try:
            chunk = json.loads(raw[len(prefix):-1])
        except (ValueError, TypeError):
            continue
        if isinstance(chunk, list) and len(chunk) > 1 and chunk[0] == 1 and isinstance(chunk[1], str):
            chunks.append(chunk[1])
    data = "".join(chunks)
    def arrays(key):
        found = []
        for match in re.finditer(r'"' + key + r'"\s*:\s*\[', data):
            try:
                value, _ = json.JSONDecoder().raw_decode(data[match.end()-1:])
            except ValueError:
                continue
            if value and all(isinstance(row, dict) for row in value):
                found.append(value)
        return found
    models = max((v for v in arrays("models") if all("name" in x and "id" in x for x in v)), key=len, default=[])
    benchmarks = max((v for v in arrays("benchmarks") if all("cohorts" in x for x in v)), key=len, default=[])
    if not models or not benchmarks:
        raise ValueError("Vellum model/cohort data not found")
    label = re.search(r"Data as of:\s*([A-Za-z]+ \d{1,2}, \d{4})", soup.get_text(" ", strip=True))
    return models, benchmarks, label.group(1) if label else ""


def build_snapshot(previous: dict, html: str, now: datetime) -> dict:
    models, benchmarks, label = parse_source(html)
    names = {m["id"]: m["name"] for m in models}
    result = deepcopy(previous)
    stamp = now.isoformat().replace("+00:00", "Z")
    metrics = result.get("research_metrics", [])
    if {m["id"] for m in metrics} != set(FIELDS):
        raise ValueError("Expected the six configured benchmark charts")
    updated, retained, records = [], [], []
    for metric in metrics:
        metric.setdefault("generated_at", previous.get("generated_at"))
        try:
            if metric["id"] not in COHORTS:
                raise ValueError("当前来源未提供此测试版本，保留历史数据")
            slug, benchmark_id, title = COHORTS[metric["id"]]
            benchmark = next(b for b in benchmarks if b["slug"] == slug)
            # An empty setup is a distinct upstream comparison cohort.
            cohorts = [c for c in benchmark["cohorts"] if c["benchmarkId"] == benchmark_id and c.get("setup", "") == ""]
            if len(cohorts) != 1:
                raise ValueError("指定测试版本或评测分组缺失")
            cohort = cohorts[0]
            if cohort.get("unit") != "%" or cohort.get("higherIsBetter") is not True:
                raise ValueError("评分单位或排序方向发生变化")
            ranked, seen = [], set()
            for row in cohort["models"]:
                score, model_id = row.get("score"), row.get("id")
                if model_id not in names or model_id in seen:
                    continue
                if isinstance(score, bool) or not isinstance(score, (int, float)) or not math.isfinite(score) or not 0 <= score <= 100:
                    continue
                seen.add(model_id)
                ranked.append({"model": names[model_id], "score": round(score, 2), "source_url": row.get("source"), "settings": row.get("settings", "")})
            if not ranked:
                raise ValueError("该分组没有有效评分")
            ranked.sort(key=lambda row: row["score"], reverse=True)
            metric.update(label=title, items=ranked[:5], source_field=benchmark_id,
                          source_url=f"https://www.vellum.ai/benchmarks/{slug}",
                          evaluation_version=cohort["version"], evaluation_setup=cohort.get("setup", ""),
                          generated_at=stamp, refresh_status={"ok": True, "checked_at": stamp},
                          available_models=len(ranked))
            updated.append(metric["id"])
        except (ValueError, KeyError, StopIteration) as exc:
            metric["refresh_status"] = {"ok": False, "checked_at": stamp, "error": str(exc) or "上游指标缺失"}
            retained.append(metric["id"])
        for rank, entry in enumerate(metric.get("items", []), 1):
            records.append({
                "id": f"vellum-{metric['id']}-{rank}", "site_id": "model_scores",
                "site_name": "Vellum LLM Leaderboard", "source": metric["label"],
                "source_tier": "model_scores", "ai_label": "model_score",
                "ai_score": entry["score"], "model_name": entry["model"],
                "benchmark": metric["label"], "score": entry["score"], "unit": "%", "rank": rank,
                "title": f"{entry['model']} · {metric['label']} {entry['score']}%",
                "title_zh": f"{entry['model']} · {metric['title']}第 {rank}，{entry['score']}%",
                "summary": metric.get("why", ""), "url": metric.get("source_url", SOURCE_URL), "published_at": None,
                "captured_at": metric.get("generated_at"), "historical": not metric["refresh_status"]["ok"],
            })
    if not updated:
        raise ValueError("No benchmark could be refreshed")
    result.update(generated_at=stamp, updated_label=label, source_url=SOURCE_URL,
                  items=records, total_items=len(records), updated_metrics=updated, retained_metrics=retained)
    return result


def refresh(path: Path, now: datetime, force: bool = False, get=requests.get) -> dict:
    previous = json.loads(path.read_text(encoding="utf-8"))
    checked = previous.get("refresh_status", {}).get("checked_at")
    if checked and not force:
        try:
            if timedelta(0) <= now - datetime.fromisoformat(checked.replace("Z", "+00:00")) < timedelta(days=1):
                return previous
        except ValueError:
            pass
    try:
        response = get(SOURCE_URL, timeout=40, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        result = build_snapshot(previous, response.text, now)
        status = {"ok": True, "partial": bool(result.get("retained_metrics")), "updated_metrics": result.get("updated_metrics", []), "retained_metrics": result.get("retained_metrics", [])}
    except (requests.RequestException, ValueError, KeyError, TypeError) as exc:
        result = deepcopy(previous)
        status = {"ok": False, "error": str(exc)[:300]}
    status["checked_at"] = now.isoformat().replace("+00:00", "Z")
    result["refresh_status"] = status
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("data/model-scores.json"))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    snapshot = refresh(args.output, datetime.now(timezone.utc), args.force)
    status = snapshot.get("refresh_status", {})
    print(f"Model scores: {'OK' if status.get('ok') else 'retained previous snapshot'}; captured {snapshot['generated_at']}")
    if not status.get("ok"):
        print(f"::warning::Model scores refresh failed: {status.get('error', 'unknown error')}")
