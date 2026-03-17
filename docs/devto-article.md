---
title: "Building an AI-Powered CV Analyser with React, FastAPI, and OpenRouter"
subtitle: "A practical guide to integrating LLMs into full-stack applications"
domain: "getdevworks.hashnode.dev"
tags: "react, fastapi, ai, python, webdev"
---

## The Problem
Recruitment processes often involve sifting through hundreds of PDFs to find candidates that match a specific job description. While keyword matching tools exist, they lack the nuanced understanding required to evaluate *how* a candidate's experience aligns with the role.

## The Solution
To demonstrate practical AI integration, I built **CV Analyser**, a web application that takes a candidate's CV (PDF) and a target job description, and uses a Large Language Model (LLM) to generate a structured fit report. 

This post walks through the architecture, the technical challenges, and how to build a reliable AI feature.

---

### Tech Stack
-   **Frontend:** React + Vite + Tailwind CSS
-   **Backend:** FastAPI (Python) deployed as Vercel Serverless Functions
-   **AI Integration:** OpenRouter (Llama 3.3 70B) with Groq as a fallback
-   **PDF Parsing:** `pdfplumber`

### System Architecture

The workflow is straightforward but requires careful handling of raw data:
1.  **Upload & Extract:** The React frontend sends a multipart form containing the PDF to the FastAPI backend.
2.  **Parse:** The backend extracts raw text using `pdfplumber`.
3.  **Prompt Engineering:** The text and job description are dynamically injected into a strictly formatted prompt.
4.  **LLM Execution:** The prompt is sent to OpenRouter.
5.  **Validation:** The backend parses the LLM's response, validating it against a predefined JSON schema before returning it to the client.

### 1. Reliable PDF Extraction

Extracting text from PDFs can be notoriously finicky. `pdfplumber` offers a robust balance between accuracy and performance for text-based PDFs. 

```python
import pdfplumber
import io

def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()
```

### 2. Structured LLM Output

The biggest challenge with Generative AI is ensuring consistent, parseable output. We enforce this through strict prompting and backend validation. We ask the LLM to return *only* a JSON object mapping to our required fields: score, summary, strengths, weaknesses, recommendations, and missing keywords.

```python
# Strip markdown wrapping if the LLM adds it
content = content.replace("```json", "").replace("```", "").strip()
parsed = json.loads(content)
```

### 3. Implementing Fallbacks for Resilience 

Relying on a single API provider is a risk. We implemented a primary call to OpenRouter, with a seamless fallback to Groq if the first request fails or times out.

```python
# Primary: OpenRouter
try:
    # Make API call...
except Exception as e:
    print(f"OpenRouter failed: {e}")

# Fallback: Groq
try:
     # Make fallback API call...
except Exception as e:
    raise ValueError("All AI API providers failed.")
```

### Conclusion

Building AI features isn't just about calling an API; it requires robust error handling, input validation, and fallback mechanisms. The CV Analyser demonstrates how to take a raw, unstructured PDF and turn it into actionable, structured data using modern web technologies.

*This project was built as part of the GetDevWorks portfolio. You can view the code on [GitHub](https://github.com/marcobaturan/cv-analyser).*
