from datetime import datetime, timezone
from unittest.mock import Mock

import requests
import pytest

from scripts.update_news import fetch_ai_breakfast, jina_reader_url, parse_ai_breakfast_html
from scripts.update_news import GRANT_POLICY_SOURCES, fetch_grant_policy_source, parse_sciengine_current_issue_items

NOW = datetime(2026, 9, 20, tzinfo=timezone.utc)
CARD = '<a href="/p/new-model" aria-label="New AI model">Sep 18, 2026 • 8 min read</a>'


def test_breakfast_native_archive_requires_title_date_and_same_host():
    html = CARD + CARD + '''
      <a href="/p/old" aria-label="Old">Jan 1, 2020</a>
      <a href="/p/undated" aria-label="Unknown">8 min read</a>
      <a href="https://other.example/p/news" aria-label="External">Sep 18, 2026</a>
      <a href="/p/heading"><h3>AI research</h3>Sep 19, 2026</a>
    '''
    items = parse_ai_breakfast_html(html, NOW)
    assert [item.title for item in items] == ["New AI model", "AI research"]
    assert items[0].url == "https://aibreakfast.beehiiv.com/p/new-model"
    assert items[0].published_at.day == 18


def test_breakfast_direct_success_does_not_call_bridge():
    session = Mock()
    session.get.return_value.text = CARD
    assert len(fetch_ai_breakfast(session, NOW)) == 1
    assert session.get.call_count == 1


def test_breakfast_falls_back_when_archive_is_blocked():
    session = Mock()
    fallback = Mock(text='[Sep 18, 2026 • 4 min read ### **AI update** AI Breakfast](https://aibreakfast.beehiiv.com/p/update)')
    session.get.side_effect = [requests.HTTPError("403"), fallback]
    assert fetch_ai_breakfast(session, NOW)[0].title == "AI update"
    assert session.get.call_count == 2


def test_reader_url_preserves_original_scheme():
    assert jina_reader_url("https://example.com/issues") == "https://r.jina.ai/https://example.com/issues"
    assert jina_reader_url("http://example.com/issues") == "https://r.jina.ai/http://example.com/issues"


def test_sciengine_open_api_uses_get_and_unwraps_data():
    source = next(s for s in GRANT_POLICY_SOURCES if s["site_id"] == "grant_bnsfc")
    session = Mock()
    session.get.return_value.json.return_value = {"success": True, "data": [
        {"title": "基础研究", "doi": "10.3724/BNSFC-example", "pubDate": 1788778042000},
    ]}
    items, status = fetch_grant_policy_source(session, source, NOW)
    assert status["ok"] and len(items) == 1
    assert items[0].url == "https://www.sciengine.com/doi/10.3724/BNSFC-example"
    session.post.assert_not_called()


def test_sciengine_error_envelope_is_not_an_empty_healthy_source():
    with pytest.raises(ValueError):
        parse_sciengine_current_issue_items({"success": False, "data": None}, {}, NOW)
