import pytest
from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)

def test_analyse_missing_fields():
    # Only sending job description, missing CV
    response = client.post("/api/analyse", data={"job_description": "We need a senior python dev with 5 years experience."})
    assert response.status_code == 422 # FastAPI validation error for missing form field

def test_analyse_short_job_description():
    # Sending dummy PDF but job description is too short
    files = {"cv": ("test.pdf", b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n", "application/pdf")}
    data = {"job_description": "Too short"} # Less than 50 chars
    
    response = client.post("/api/analyse", files=files, data=data)
    assert response.status_code == 400
    assert "too short" in response.json()["error"]

def test_analyse_invalid_file_type():
    # Sending a TXT file instead of PDF
    files = {"cv": ("test.txt", b"this is text", "text/plain")}
    data = {"job_description": "We need a senior python dev with 5 years experience in building APIs."}
    
    response = client.post("/api/analyse", files=files, data=data)
    assert response.status_code == 400
    assert "must be a PDF" in response.json()["error"]
