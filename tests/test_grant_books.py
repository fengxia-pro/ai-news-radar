from __future__ import annotations

import json
from pathlib import Path

import pytest

from scripts.update_grant_books import (
    ALLOWED_GATE_DECISIONS,
    BANNED_ACCESS_DOMAINS,
    build_payload,
    candidate_records,
    candidate_sources,
)


ROOT = Path(__file__).resolve().parents[1]


def load_seed() -> dict:
    return json.loads((ROOT / "data" / "grant-books.seed.json").read_text(encoding="utf-8"))


def test_public_payload_only_contains_verified_items():
    seed = load_seed()
    payload = build_payload(seed, generated_at="2026-07-08T00:00:00Z")

    assert payload["topic"] == "高校教师书架"
    assert payload["candidate_count"] == 1
    assert payload["candidate_sources"]
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


def test_slow_professor_shop_window_is_candidate_source_only():
    seed = load_seed()
    sources = candidate_sources(seed)
    payload = build_payload(seed, generated_at="2026-07-08T00:00:00Z")

    slow_professor_source = next(
        source for source in sources if source["id"] == "slow_professor_shop_window"
    )
    assert slow_professor_source["name"] == "慢教授的科研江湖公众号商品橱窗"
    assert slow_professor_source["status"] == "accepted_candidate_source"
    assert "公开进入书架前" in slow_professor_source["public_boundary"]
    assert any(
        status["site_id"] == "grant_books_candidate_source_slow_professor_shop_window"
        for status in payload["source_status"]
    )


def test_public_access_links_use_legal_sources():
    payload = build_payload(load_seed(), generated_at="2026-07-08T00:00:00Z")
    road_book = next(
        item for item in payload["items"] if item["id"] == "book-nsfc-application-road-phenomena-laws"
    )
    access_links = road_book.get("access_links") or []

    assert road_book["access_note"].startswith("不提供未授权 PDF 下载")
    assert {link["kind"] for link in access_links} >= {"source_review", "legal_purchase", "library_search"}
    checked_urls = [road_book["source_url"], *[link["url"] for link in access_links]]
    assert all(
        banned not in url.lower()
        for url in checked_urls
        for banned in BANNED_ACCESS_DOMAINS
    )
