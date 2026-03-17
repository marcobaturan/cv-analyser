import pytest
from api.index import parse_llm_json

def test_parse_llm_json_valid():
    json_str = """
    {
      "fit_score": 85,
      "summary": "Great fit",
      "strengths": ["Python"],
      "weaknesses": ["Java"],
      "recommendations": ["Learn Java"],
      "missing_keywords": ["Spring"]
    }
    """
    result = parse_llm_json(json_str)
    assert result["fit_score"] == 85
    assert result["summary"] == "Great fit"

def test_parse_llm_json_with_markdown():
    json_str = """```json
    {
      "fit_score": 90,
      "summary": "Excellent",
      "strengths": ["React"],
      "weaknesses": ["Vue"],
      "recommendations": ["Learn Vue"],
      "missing_keywords": ["Nuxt"]
    }
    ```"""
    result = parse_llm_json(json_str)
    assert result["fit_score"] == 90
    assert result["summary"] == "Excellent"

def test_parse_llm_json_missing_keys():
    json_str = """
    {
      "fit_score": 85,
      "summary": "Great fit"
    }
    """
    with pytest.raises(ValueError, match="Missing key in JSON"):
        parse_llm_json(json_str)

def test_parse_llm_json_invalid_json():
    json_str = "This is not JSON"
    with pytest.raises(ValueError, match="Failed to parse JSON"):
        parse_llm_json(json_str)
