# main.py
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import httpx
import requests
from pydantic import BaseModel

app = FastAPI()

# Replace with your actual OpenAI API key
OPENAI_API_KEY = "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"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

class OpenAIRequest(BaseModel):
    prompt: str

@app.post("/generate-text")
async def generate_text(request: OpenAIRequest):

    OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    data = {
        "model": "gpt-3.5-turbo",  # You can use other models supported by OpenAI
        "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": request.prompt}]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENAI_API_URL, json=data, headers=headers)

        if response.status_code == 200:
            result = response.json()
            choices = result.get("choices", [])
            if choices:
                return {"generated_text": choices[0].get("message", {}).get("content", "")}
            else:
                raise HTTPException(status_code=500, detail="Unexpected response format from OpenAI")
        else:
            raise HTTPException(status_code=response.status_code, detail=f"OpenAI API error: {response.text}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level='debug', workers=4, reload=True)
