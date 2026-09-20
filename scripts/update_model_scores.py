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


def parse_models(html: str) -> tuple[list[dict], str]:
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
    # Decode data only. Never execute scripts supplied by the source page.
    data = "".join(chunks)
    candidates = []
    for match in re.finditer(r'"models"\s*:\s*\[', data):
        try:
            models, _ = json.JSONDecoder().raw_decode(data[match.end()-1:])
        except ValueError:
            continue
        if models and all(isinstance(model, dict) for model in models):
            candidates.append(models)
    models = max(candidates, key=len, default=[])
    if not models:
        raise ValueError("Vellum model data not found")
    updated = soup.select_one(".leaderboard-updated")
    return models, updated.get_text(" ", strip=True) if updated else ""


def build_snapshot(previous: dict, html: str, now: datetime) -> dict:
    models, label = parse_models(html)
    result = deepcopy(previous)
    metrics = result.get("research_metrics", [])
    if {metric["id"] for metric in metrics} != set(FIELDS):
        raise ValueError("Expected the six configured benchmark charts")
    records = []
    for metric in metrics:
        field = FIELDS[metric["id"]]
        ranked = []
        seen = set()
        for model in models:
            name, score = model.get("title"), model.get(field)
            if not isinstance(name, str) or not name.strip() or name in seen:
                continue
            if isinstance(score, bool) or not isinstance(score, (int, float)) or not math.isfinite(score) or not 0 <= score <= 100:
                continue
            seen.add(name)
            ranked.append({"model": name, "score": score})
        ranked.sort(key=lambda entry: entry["score"], reverse=True)
        if len(ranked) < 5:
            raise ValueError(f"Incomplete Vellum benchmark: {metric['id']}")
        metric["source_field"] = field
        metric["items"] = ranked[:5]
        if metric["id"] == "aime":
            metric["label"] = "AIME 2025"
        if metric["id"] == "arc-agi":
            metric["label"] = "ARC-AGI 2"
        for rank, entry in enumerate(metric["items"], 1):
            records.append({
                "id": f"vellum-{metric['id']}-{rank}", "site_id": "model_scores",
                "site_name": "Vellum LLM Leaderboard", "source": metric["label"],
                "source_tier": "model_scores", "ai_label": "model_score",
                "ai_score": entry["score"], "model_name": entry["model"],
                "benchmark": metric["label"], "score": entry["score"], "unit": "%", "rank": rank,
                "title": f"{entry['model']} · {metric['label']} {entry['score']}%",
                "title_zh": f"{entry['model']} · {metric['title']}第 {rank}，{entry['score']}%",
                "summary": metric.get("why", ""), "url": SOURCE_URL, "published_at": None,
            })
    result.update(generated_at=now.isoformat().replace("+00:00", "Z"), updated_label=label,
                  source_url=SOURCE_URL, items=records, total_items=len(records))
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
        status = {"ok": True}
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
