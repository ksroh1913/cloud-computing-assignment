import os
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


VERCEL_ORIGIN_REGEX = (
    r"^https://cloud-computing-assignment(?:-[a-z0-9-]+)?\.vercel\.app$"
)


def get_allowed_origins() -> list[str]:
    configured_origins = os.getenv("ALLOWED_ORIGINS", "")
    origins = [origin.strip().rstrip("/") for origin in configured_origins.split(",")]
    origins = [origin for origin in origins if origin]

    if origins:
        return origins

    return [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ]


class ProfileResponse(BaseModel):
    status: str
    message: str
    server_time: datetime
    backend: str


app = FastAPI(
    title="노경수 개인 소개 API",
    description="개인 소개 페이지의 프론트엔드·백엔드 연동을 확인하는 API입니다.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_origin_regex=VERCEL_ORIGIN_REGEX,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/", tags=["service"])
def read_root() -> dict[str, str]:
    return {
        "service": "personal-page-api",
        "message": "API가 정상적으로 실행 중입니다.",
        "docs": "/docs",
    }


@app.get("/health", tags=["service"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/profile", response_model=ProfileResponse, tags=["profile"])
def read_profile() -> ProfileResponse:
    return ProfileResponse(
        status="connected",
        message="Render의 FastAPI가 보낸 응답입니다. 두 서비스가 정상적으로 통신하고 있습니다.",
        server_time=datetime.now(timezone.utc),
        backend="FastAPI on Render",
    )
