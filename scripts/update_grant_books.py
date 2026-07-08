from __future__ import annotations

import argparse
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


ALLOWED_GATE_DECISIONS = {"继续深读", "先读局部", "暂不深读"}
ALLOWED_VERSION_STATUS = {"视觉抽样版", "OCR 初读版", "全文精读版"}

GROUPS: tuple[dict[str, str], ...] = (
    {
        "id": "grant_application",
        "title": "国自然申请",
        "description": "围绕国自然申请、项目书结构、申报准备和长期科研积累的书。",
    },
    {
        "id": "scientific_question",
        "title": "科学问题",
        "description": "把技术问题、工程问题或经验想法，压成评审愿意讨论的科学问题。",
    },
    {
        "id": "proposal_writing",
        "title": "项目书写作",
        "description": "训练题目、摘要、立项依据、研究内容、技术路线和研究基础的表达。",
    },
    {
        "id": "paper_writing",
        "title": "论文写作与发表",
        "description": "把研究结果组织成论文故事、IMRaD结构、语言风格、投稿修改和审稿回复。",
    },
    {
        "id": "review_perspective",
        "title": "评审视角",
        "description": "理解函评、会评、形式审查和常见失分点。",
    },
    {
        "id": "teacher_research_capacity",
        "title": "高校教师科研能力",
        "description": "补研究设计、学术写作、项目规划和长期积累能力。",
    },
)

GROUP_ORDER = {group["id"]: index for index, group in enumerate(GROUPS)}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def require_text(record: dict[str, Any], field: str) -> None:
    value = record.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{record.get('id', '<unknown>')} 缺少字段 {field}")


def require_list(record: dict[str, Any], field: str) -> None:
    value = record.get(field)
    if not isinstance(value, list) or not value:
        raise ValueError(f"{record.get('id', '<unknown>')} 字段 {field} 必须是非空列表")


def validate_source_check(record: dict[str, Any]) -> None:
    source_check = record.get("source_check")
    if not isinstance(source_check, dict):
        raise ValueError(f"{record.get('id', '<unknown>')} 缺少 source_check")
    for field in ("source_type", "evidence_boundary", "version_status"):
        require_text(source_check, field)
    require_list(source_check, "evidence_available")
    if source_check.get("version_status") not in ALLOWED_VERSION_STATUS:
        raise ValueError(
            f"{record.get('id', '<unknown>')} version_status 必须是 "
            f"{', '.join(sorted(ALLOWED_VERSION_STATUS))}"
        )


def validate_record(record: dict[str, Any]) -> None:
    for field in (
        "id",
        "title",
        "group",
        "one_sentence_conclusion",
        "real_problem",
        "core_tension",
        "why_for_university_teachers",
        "fit",
        "not_fit",
        "first_reading_route",
        "evidence_boundary",
        "verification_status",
        "source_url",
        "updated_at",
    ):
        require_text(record, field)
    if record["group"] not in GROUP_ORDER:
        raise ValueError(f"{record['id']} 使用了未知分组 {record['group']}")
    if record.get("item_type") != "book":
        raise ValueError(f"{record['id']} 不是书目条目，不能进入高校教师书架")
    if record.get("gate_decision") not in ALLOWED_GATE_DECISIONS:
        raise ValueError(f"{record['id']} gate_decision 必须是固定三选一")
    validate_source_check(record)
    if record.get("deep_read_framework") and not (
        record.get("gate_decision") == "继续深读" or record.get("deep_read_manual_override")
    ):
        raise ValueError(f"{record['id']} Stage 2 只能用于继续深读或人工指定条目")


def public_record(record: dict[str, Any]) -> dict[str, Any]:
    validate_record(record)
    group_id = str(record["group"])
    output = dict(record)
    output.setdefault("site_id", f"grant_books_{group_id}")
    output.setdefault("site_name", "高校教师书架")
    output.setdefault("source", GROUPS[GROUP_ORDER[group_id]]["title"])
    output.setdefault("source_tier", "grant_books")
    output.setdefault("source_tier_label", "教师书架")
    output.setdefault("source_tier_rank", 0)
    output.setdefault("ai_label", "reading_gate")
    output.setdefault("ai_score", 0)
    output.setdefault("url", output.get("source_url", ""))
    output["deep_read_available"] = bool(output.get("deep_read_available"))
    return output


def build_payload(seed: dict[str, Any], *, generated_at: str) -> dict[str, Any]:
    seed_items = list(seed.get("items") or [])
    public_items: list[dict[str, Any]] = []
    candidates = candidate_records(seed)
    for record in seed_items:
        status = record.get("verification_status")
        if status == "verified":
            public_items.append(public_record(record))

    public_items.sort(
        key=lambda item: (
            GROUP_ORDER.get(str(item.get("group")), 99),
            str(item.get("gate_decision") or ""),
            str(item.get("title") or ""),
        )
    )
    groups = []
    for group in GROUPS:
        grouped_items = [item for item in public_items if item.get("group") == group["id"]]
        groups.append({**group, "count": len(grouped_items), "items": grouped_items})

    return {
        "generated_at": generated_at,
        "topic": "高校教师书架",
        "method": "manslow-reading-gate",
        "positioning": "给高校教师看的科研成长书架：国自然、论文写作、科研设计与学术表达，先判断值不值得读，再决定是否深读。",
        "total_items": len(public_items),
        "gate_decisions": sorted(ALLOWED_GATE_DECISIONS),
        "groups": groups,
        "items": public_items,
        "candidate_count": len(candidates),
        "source_status": [
            {
                "site_id": "grant_books_manual_seed",
                "site_name": "人工核验种子表",
                "ok": True,
                "item_count": len(public_items),
                "candidate_count": len(candidates),
                "source_url": seed.get("source_url", ""),
            }
        ],
        "notes": [
            "本专题按慢老师读书方法论组织，先做来源核查和简介门槛，不默认全文深读。",
            "只有 verification_status=verified 的条目进入公开书架。",
            "Stage 2 深读框架只用于继续深读或人工指定条目。",
        ],
    }


def candidate_records(seed: dict[str, Any]) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    for record in seed.get("items") or []:
        if record.get("verification_status") == "verified":
            continue
        candidates.append(
            {
                "id": record.get("id"),
                "title": record.get("title"),
                "group": record.get("group"),
                "verification_status": record.get("verification_status") or "candidate",
                "source_url": record.get("source_url", ""),
                "missing": record.get("missing") or ["source_check", "evidence_boundary"],
            }
        )
    return candidates


def write_payload(
    payload: dict[str, Any],
    output_path: Path,
    candidates_path: Path | None = None,
    candidates: list[dict[str, Any]] | None = None,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if candidates_path:
        candidates_path.parent.mkdir(parents=True, exist_ok=True)
        candidates_path.write_text(json.dumps(candidates, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the public NSFC reading-gate bookshelf payload.")
    parser.add_argument("--seed", type=Path, default=Path("data/grant-books.seed.json"))
    parser.add_argument("--output", type=Path, default=Path("data/grant-books.json"))
    parser.add_argument("--candidates-output", type=Path, default=Path("data/grant-books-candidates.json"))
    parser.add_argument("--generated-at", default=datetime.now(UTC).isoformat().replace("+00:00", "Z"))
    args = parser.parse_args()

    seed = load_json(args.seed)
    payload = build_payload(seed, generated_at=args.generated_at)
    write_payload(payload, args.output, args.candidates_output, candidate_records(seed))
    print(f"Wrote: {args.output} ({len(payload.get('items') or [])} grant book records)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
