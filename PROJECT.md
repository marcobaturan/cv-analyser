# PROJECT.md — CV Analyser

## Status
Not started

## Assignee
Fullstack agent + QA agent

## Repository
https://github.com/marcobaturan/cv-analyser (create — public)

## Live URL
https://cv-analyser.vercel.app (pending deploy)

## Stack
React + Vite + FastAPI + OpenRouter (Llama 3.3 70B free) + Groq fallback + Vercel

## Task list

### Phase 1 — Setup
- [ ] Create GitHub repository (public)
- [ ] Scaffold React + Vite frontend
- [ ] Scaffold FastAPI backend in api/ directory
- [ ] Configure Vercel project
- [ ] Set environment variables in Vercel dashboard

### Phase 2 — Backend
- [ ] Implement PDF text extraction (pdfplumber)
- [ ] Implement OpenRouter API call with structured prompt
- [ ] Implement Groq fallback
- [ ] Implement JSON response parsing and validation
- [ ] Implement POST /api/analyse endpoint
- [ ] Unit tests for extraction and parsing
- [ ] Integration tests for endpoint

### Phase 3 — Frontend
- [ ] PDF upload component (drag and drop)
- [ ] Job description textarea
- [ ] Analyse button with disabled state
- [ ] Loading state
- [ ] Results card with score, strengths, weaknesses, recommendations, keywords
- [ ] Error state
- [ ] Responsive layout
- [ ] GetDevWorks branding and footer

### Phase 4 — QA and deploy
- [ ] Run full test suite
- [ ] Deploy to Vercel
- [ ] Smoke test on production URL
- [ ] Make repository public

### Phase 5 — Content
- [ ] Write Hashnode article documenting the build
- [ ] Cross-post to dev.to

## Known constraints
- OpenRouter free tier: 50 requests/day (1,000 if $10 credits purchased)
- Groq free tier: sufficient for demo volume
- Vercel free tier: sufficient for portfolio demo
- PDF parsing: text-based PDFs only — scanned PDFs not supported (out of scope)

## HITL checkpoints
- Before git push to main
- Before Vercel environment variable configuration
- Before making repository public
