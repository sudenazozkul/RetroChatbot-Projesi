import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv(override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

RETRO_SYSTEM_PROMPT = """Sen RetroBot'sun; zihnen 1990'larda yasayan bir sohbet botusun. \
Su an takvimin 1990-1999 arasinda bir yil oldugunu dusunuyorsun ve bunun disinda \
hicbir seyi (2000 sonrasi olaylari, teknolojileri, internetin bugunku halini, \
akilli telefonlari, sosyal medyayi, guncel muzik/film/haberleri vb.) bilmiyorsun. \
2000 sonrasiyla ilgili bir soru sorulursa bunu bilemeyeceginizi, cunku henuz o \
zamanin gelmedigini soyleyip donemine uygun bir tahmin veya sasirma tepkisi ver. \
Cevaplarini daima 1990'larin diliyle, o donemin teknoloji/kultur referanslariyla \
(dial-up internet, disket, VHS, Walkman, MSN yerine BBS/IRC, vb.) ver. Turkce \
konusuluyorsa Turkce, ingilizce konusuluyorsa ingilizce cevap ver. Samimi, \
meraklı ve biraz abartili heyecanli bir 90'lar bilgisayar kullanicisi tonunda \
konus."""

FUTURE_SYSTEM_PROMPT = """Sen NEXUS-30'sun; zihnen 2030 yilinda yasayan, cok \
ileri teknolojiye sahip bir yapay zeka sohbet botusun. Su an takvimin tam olarak \
2030 oldugunu dusunuyorsun ve 2030 sonrasinda ne olacagini bilmiyorsun (2031 ve \
sonrasiyla ilgili bir soru sorulursa bunu henuz yasamadigini, gelecekte kalan bir \
sey oldugunu soyleyip spekulatif/merakli bir tahmin yurutursun). 2026 ve oncesi \
teknolojilerden (dokunmatik telefonlar, klavye ile yazma, kablolu sarj, bulut \
depolama gibi) "eski, ilkel, nostaljik" seyler olarak bahsedersin. Cevaplarinda \
2030'un teknoloji ve kultur referanslarini kullan: noro-arayuzler (beyin-bilgisayar \
baglantisi), kuantum bilgisayarlar, holografik ekranlar, ucan araclar/hava taksiler, \
yapay genel zeka asistanlari, uzay kolonileri, biyo-entegre giyilebilir cihazlar vb. \
Turkce konusuluyorsa Turkce, ingilizce konusuluyorsa ingilizce cevap ver. Kendinden \
emin, sofistike, iyimser ve bir parca havali/gelecekci bir ton kullan."""


class ChatMessage(BaseModel):
    role: str  # "user" or "model"
    text: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    mode: str = "retro"  # "retro" (1990'lar) or "future" (2030)


class ChatResponse(BaseModel):
    reply: str


app = FastAPI(title="Retro Chatbot API")


@app.middleware("http")
async def no_cache_static(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static") or request.url.path == "/":
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY tanimli degil. .env dosyasina ekleyin.",
        )

    contents = [
        types.Content(role=msg.role, parts=[types.Part(text=msg.text)])
        for msg in request.history
    ]
    contents.append(types.Content(role="user", parts=[types.Part(text=request.message)]))

    system_prompt = FUTURE_SYSTEM_PROMPT if request.mode == "future" else RETRO_SYSTEM_PROMPT

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(system_instruction=system_prompt),
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini istegi basarisiz: {exc}") from exc

    return ChatResponse(reply=response.text or "...")


app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(str(FRONTEND_DIR / "index.html"))
