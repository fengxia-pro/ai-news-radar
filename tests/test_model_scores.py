from copy import deepcopy
from datetime import datetime, timezone
import json
from unittest.mock import Mock

import pytest
import requests

from scripts.update_model_scores import FIELDS, build_snapshot, refresh

NOW = datetime(2026, 9, 20, tzinfo=timezone.utc)


def previous():
    return {
        "generated_at": "2026-07-25T00:00:00Z", "items": [{"id": "old"}],
        "research_metrics": [{"id": key, "label": key, "title": key, "items": [{"model": "Old", "score": 10}]} for key in FIELDS],
    }


def source_html(missing=None):
    models = [{"title": f"Model {i}", **{field: 80 + i for field in FIELDS.values() if field != missing}} for i in range(6)]
    # Invalid values cannot outrank verified numeric scores. Zero remains valid.
    models += [{"title": "Invalid", **{field: True for field in FIELDS.values()}},
               {"title": "Out of range", **{field: 999 for field in FIELDS.values()}}]
    data = json.dumps({"models": models})
    # Production pages split React data across script chunks.
    chunks = [data[:37], data[37:]]
    return '<div class="leaderboard-updated">updated Sep 4</div>' + "".join(
        f'<script>self.__next_f.push({json.dumps([1, chunk])})</script>' for chunk in chunks)


def test_refresh_six_pinned_benchmarks_without_mutating_previous():
    old = previous()
    unchanged = deepcopy(old)
    result = build_snapshot(old, source_html(), NOW)
    assert old == unchanged
    assert len(result["items"]) == 30
    assert result["generated_at"] == "2026-09-20T00:00:00Z"
    assert result["updated_label"] == "updated Sep 4"
    for metric in result["research_metrics"]:
        assert metric["items"][0] == {"model": "Model 5", "score": 85}
        assert len(metric["items"]) == 5
        assert metric["source_field"] == FIELDS[metric["id"]]
    assert all(item["published_at"] is None for item in result["items"])


@pytest.mark.parametrize("html", ["<html>Blocked</html>", source_html(missing=FIELDS["aime"])])
def test_incomplete_source_cannot_be_published_as_current(html):
    with pytest.raises(ValueError):
        build_snapshot(previous(), html, NOW)


@pytest.mark.parametrize("failure", [requests.HTTPError("403"), None])
def test_failed_refresh_keeps_original_capture_date_and_all_scores(tmp_path, failure):
    path = tmp_path / "model-scores.json"
    path.write_text(json.dumps(previous()), encoding="utf-8")
    get = Mock(side_effect=failure) if failure else Mock(return_value=Mock(text="<html>Changed layout</html>"))
    result = refresh(path, NOW, get=get)
    assert result["generated_at"] == previous()["generated_at"]
    assert result["research_metrics"] == previous()["research_metrics"]
    assert result["items"] == previous()["items"]
    assert result["refresh_status"]["ok"] is False
    assert json.loads(path.read_text(encoding="utf-8")) == result


def test_daily_refresh_runs_once_and_force_can_retry(tmp_path):
    path = tmp_path / "model-scores.json"
    path.write_text(json.dumps(previous()), encoding="utf-8")
    get = Mock(return_value=Mock(text=source_html()))
    refresh(path, NOW, get=get)
    refresh(path, NOW, get=get)
    assert get.call_count == 1
    assert json.loads(path.read_text(encoding="utf-8"))["refresh_status"]["ok"] is True
    refresh(path, NOW, force=True, get=get)
    assert get.call_count == 2
