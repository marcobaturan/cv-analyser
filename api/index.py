from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import pdfplumber
import io
import os
import json
import httpx
from typing import Dict, Any

app = FastAPI()

def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
        
    if not text.strip():
        raise ValueError("PDF text extraction returned empty content.")
        
    return text.strip()

async def call_llm(cv_text: str, job_description: str) -> Dict[str, Any]:
    prompt = f"""You are a senior technical recruiter. Analyse the following CV against the job description.

Return ONLY a valid JSON object with this exact structure:
{{
  "fit_score": <integer 0-100>,
  "summary": <string, max 150 words>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "recommendations": [<string>, ...],
  "missing_keywords": [<string>, ...]
}}

Do not include any text outside the JSON object.

CV:
{cv_text}

Job Description:
{job_description}"""

    # Primary: OpenRouter
    openrouter_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("cv-analyser-openrouter") or os.getenv("CV_ANALYSER_OPENROUTER")
    if openrouter_key:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {openrouter_key}"},
                    json={
                        "model": "meta-llama/llama-3.3-70b-instruct:free",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3
                    },
                    timeout=30.0
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    return parse_llm_json(content)
        except Exception as e:
            print(f"OpenRouter failed: {e}")

    # Fallback: Groq
    groq_key = os.getenv("GROQ_API_KEY") or os.getenv("cv-analyser-groq") or os.getenv("CV_ANALYSER_GROQ")
    if groq_key:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_key}"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.3
                    },
                    timeout=30.0
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    return parse_llm_json(content)
        except Exception as e:
            print(f"Groq failed: {e}")
            
    raise ValueError("All AI API providers failed or are unconfigured.")

def parse_llm_json(content: str) -> Dict[str, Any]:
    # Strip markdown code blocks if the LLM wrapped the JSON
    content = content.replace("```json", "").replace("```", "").strip()
    try:
        parsed = json.loads(content)
        # Validate fields
        required_keys = ["fit_score", "summary", "strengths", "weaknesses", "recommendations", "missing_keywords"]
        for key in required_keys:
            if key not in parsed:
                raise ValueError(f"Missing key in JSON: {key}")
        if not isinstance(parsed["fit_score"], int) or not (0 <= parsed["fit_score"] <= 100):
            parsed["fit_score"] = 0 # Default if validation fails
        return parsed
    except json.JSONDecodeError:
        raise ValueError("Failed to parse JSON from AI response")

@app.post("/api/analyse")
async def analyse(
    request: Request,
    cv: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not job_description or len(job_description.strip()) < 50:
        return JSONResponse(status_code=400, content={"success": False, "error": "Job description is missing or too short (min 50 chars)."})
        
    if cv.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"success": False, "error": "CV must be a PDF file."})
        
    cv_content = await cv.read()
    if len(cv_content) > 5 * 1024 * 1024:
        return JSONResponse(status_code=400, content={"success": False, "error": "CV file exceeds 5MB."})

    try:
        cv_text = extract_text_from_pdf(cv_content)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"success": False, "error": str(e)})

    try:
        analysis_result = await call_llm(cv_text, job_description)
        return {"success": True, "data": analysis_result}
    except ValueError as e:
        return JSONResponse(status_code=502, content={"success": False, "error": str(e)})
