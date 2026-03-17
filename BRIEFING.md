# BRIEFING.md — CV Analyser

## Project
Build a web application that analyses a CV (PDF) against a job description
and returns a structured fit report with score, strengths, weaknesses,
and recommendations.

## Purpose
Portfolio project for GetDevWorks. Demonstrates AI integration, fullstack
development, and QA. Deployed publicly as a live demo.

## Target audience
Recruiters and candidates who want a quick, objective CV-to-job fit assessment.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI | OpenRouter API — primary model: meta-llama/llama-3.3-70b-instruct:free |
| AI Fallback | Groq — llama-3.3-70b-versatile |
| PDF parsing | pdfplumber (Python) |
| Deployment | Vercel (frontend) + Vercel Serverless Functions (backend) |

---

## Functional requirements

### Input
1. CV upload — PDF only, max 5MB.
2. Job description — free text input, min 50 characters.

### Processing
1. Extract text from PDF using pdfplumber.
2. Send CV text + job description to LLM with structured prompt.
3. Parse LLM response as JSON.

### Output — structured report
```json
{
  "fit_score": 78,
  "summary": "Strong technical match. Communication skills underrepresented.",
  "strengths": [
    "5+ years Python",
    "Relevant fintech experience",
    "CI/CD and DevOps exposure"
  ],
  "weaknesses": [
    "No mention of team leadership",
    "Missing quantified achievements"
  ],
  "recommendations": [
    "Add metrics to project descriptions",
    "Highlight collaboration and communication examples"
  ],
  "missing_keywords": ["agile", "scrum", "stakeholder management"]
}
```

---

## LLM prompt (use exactly)

```
You are a senior technical recruiter. Analyse the following CV against the job description.

Return ONLY a valid JSON object with this exact structure:
{
  "fit_score": <integer 0-100>,
  "summary": <string, max 150 words>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "recommendations": [<string>, ...],
  "missing_keywords": [<string>, ...]
}

Do not include any text outside the JSON object.

CV:
{cv_text}

Job Description:
{job_description}
```

---

## UI requirements

### Layout
- Single page application.
- Two-column layout on desktop, single column on mobile.
- Left column: inputs (upload + job description textarea).
- Right column: results report.

### Components
1. PDF upload zone (drag and drop + click to browse).
2. Job description textarea (min 4 rows).
3. Analyse button (disabled until both inputs are filled).
4. Loading state (spinner + "Analysing CV..." message).
5. Results card with:
   - Fit score as large number with colour coding (0-49 red, 50-74 amber, 75-100 green).
   - Summary paragraph.
   - Strengths list (green).
   - Weaknesses list (red).
   - Recommendations list (blue).
   - Missing keywords as tags.
6. Error state for failed analysis or invalid PDF.

### Branding
- GetDevWorks colour palette: dark blue #1B3A5C, mid blue #2E6DA4.
- Clean, professional, minimal. No gradients, no shadows.
- Footer: "Built by GetDevWorks · getdevworks.com"

---

## API endpoint

```
POST /api/analyse
Content-Type: multipart/form-data

Fields:
- cv: file (PDF)
- job_description: string
```

Response:
```json
{
  "success": true,
  "data": { ...report object... }
}
```

Error response:
```json
{
  "success": false,
  "error": "descriptive error message"
}
```

---

## Environment variables

```
OPENROUTER_API_KEY=
GROQ_API_KEY=
```

Never hardcode. Load via python-dotenv locally, Vercel environment variables in production.

---

## QA requirements

- Unit test: PDF text extraction returns non-empty string.
- Unit test: LLM response parses correctly as JSON.
- Unit test: fit_score is integer between 0 and 100.
- Integration test: POST /api/analyse returns 200 with valid PDF + job description.
- Integration test: POST /api/analyse returns 400 with missing fields.
- Smoke test: deployed URL responds to GET /.

---

## CI/CD

- GitHub repository: public (portfolio).
- Vercel auto-deploy on push to main.
- GitHub Actions: run tests on pull request to main.

---

## Deployment

- Frontend: Vercel, auto-deploy from GitHub.
- Backend: Vercel Serverless Functions (api/ directory).
- Environment variables set in Vercel dashboard.

---

## HITL checkpoints

- Before any git push to main.
- Before setting environment variables in Vercel.
- Before making the repository public.

---

## Out of scope

- User authentication.
- Saving results to database.
- Multiple CV comparison.
- CV editing suggestions.

---

## Files
- PROJECT.md: project status and task tracking
- STYLE.md: ../../../AI_team/my-company-configuration/STYLE.md
- Rules: ../../../AI_team/my-company-configuration/AG_Structure/.antigravity/rules.md
- Skills: ../../../AI_team/my-company-configuration/AG_Structure/.agent/skills/
- HITL: ../../../AI_team/my-company-configuration/HITL.md
