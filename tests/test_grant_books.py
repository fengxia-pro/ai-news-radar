from __future__ import annotations

import json
from pathlib import Path

import pytest

from scripts.update_grant_books import (
    ALLOWED_GATE_DECISIONS,
    build_payload,
    candidate_records,
)


ROOT = Path(__file__).resolve().parents[1]


def load_seed() -> dict:
    return json.loads((ROOT / "data" / "grant-books.seed.json").read_text(encoding="utf-8"))


def test_public_payload_only_contains_verified_items():
    seed = load_seed()
    payload = build_payload(seed, generated_at="2026-07-08T00:00:00Z")

    assert payload["topic"] == "高校教师书架"
    assert payload["candidate_count"] == 1
    assert payload["items"]
    assert all(item["verification_status"] == "verified" for item in payload["items"])
    assert "candidate-condense-scientific-question-cases" not in {item["id"] for item in payload["items"]}


def test_every_public_record_has_reading_gate_fields():
    payload = build_payload(load_seed(), generated_at="2026-07-08T00:00:00Z")
    required = {
        "source_check",
        "gate_decision",
        "one_sentence_conclusion",
        "real_problem",
        "core_tension",
        "why_for_university_teachers",
        "fit",
        "not_fit",
        "first_reading_route",
        "evidence_boundary",
    }

    for item in payload["items"]:
        assert required.issubset(item)
        assert item["gate_decision"] in ALLOWED_GATE_DECISIONS
        assert item["item_type"] == "book"
        assert item["source_check"]["evidence_boundary"]
        assert item["source_check"]["version_status"] in {"视觉抽样版", "OCR 初读版", "全文精读版"}


def test_invalid_gate_decision_is_rejected():
    seed = load_seed()
    seed["items"][0]["gate_decision"] = "值得一读"

    with pytest.raises(ValueError, match="gate_decision"):
        build_payload(seed, generated_at="2026-07-08T00:00:00Z")


def test_missing_source_boundary_is_rejected():
    seed = load_seed()
    seed["items"][0]["source_check"]["evidence_boundary"] = ""

    with pytest.raises(ValueError, match="evidence_boundary"):
        build_payload(seed, generated_at="2026-07-08T00:00:00Z")


def test_non_book_record_is_rejected():
    seed = load_seed()
    seed["items"][0]["item_type"] = "official_notice"

    with pytest.raises(ValueError, match="不是书目条目"):
        build_payload(seed, generated_at="2026-07-08T00:00:00Z")


def test_stage_two_requires_continue_or_manual_override():
    seed = load_seed()
    partial = next(item for item in seed["items"] if item.get("gate_decision") == "先读局部")
    partial["deep_read_framework"] = {"plain_logic": "x"}

    with pytest.raises(ValueError, match="Stage 2"):
        build_payload(seed, generated_at="2026-07-08T00:00:00Z")


def test_candidate_records_are_separate_from_public_payload():
    seed = load_seed()
    candidates = candidate_records(seed)

    assert len(candidates) == 1
    assert candidates[0]["verification_status"] == "candidate"
    assert candidates[0]["missing"]
