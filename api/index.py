from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analyse")
async def analyse(request: Request):
    return {"success": True, "data": {}}
