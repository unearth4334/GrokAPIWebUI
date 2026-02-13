import datetime as dt

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import get_settings
from .crypto import encrypt_secret
from .db import Base, get_engine, get_session
from .grok import build_text_request, create_text_response, extract_output_text
from .models import Credential
from .schemas import CredentialCreate, CredentialSummary, GrokTextRequest, GrokTextResponse

app = FastAPI(title="Grok API Web UI")

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_allow_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
)


def get_db():
    db = get_session()
    # Ensure tables exist on first use.
    try:
        Base.metadata.create_all(bind=db.bind)
    except Exception:
        # If table creation fails, continue anyway; it might already exist.
        pass
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    # Tables are created lazily on first query if they don't exist.
    # This avoids blocking startup on database availability.
    pass


@app.get("/health")
def health() -> dict:
    # Simple health check without DB connection.
    return {"status": "ok"}


@app.post("/api/grok/text", response_model=GrokTextResponse)
def generate_text(payload: GrokTextRequest) -> GrokTextResponse:
    if not settings.grok_api_key:
        raise HTTPException(status_code=400, detail="Grok API key is missing")

    request_payload = build_text_request(
        prompt=payload.prompt,
        system=payload.system,
        model=payload.model or settings.grok_text_model,
        previous_response_id=payload.previous_response_id,
        store=True if payload.store is None else payload.store,
    )

    try:
        response_json = create_text_response(
            base_url=settings.grok_api_base_url,
            api_key=settings.grok_api_key,
            payload=request_payload,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    output_text = extract_output_text(response_json)
    response_id = response_json.get("id", "")
    return GrokTextResponse(id=response_id, output_text=output_text)


@app.post("/api/credentials", response_model=CredentialSummary)
def create_credential(payload: CredentialCreate, db: Session = Depends(get_db)) -> CredentialSummary:
    if not payload.api_key.strip():
        raise HTTPException(status_code=400, detail="API key is required")

    now = dt.datetime.utcnow()
    record = Credential(
        label=payload.label,
        encrypted_api_key=encrypt_secret(payload.api_key),
        created_at=now,
        updated_at=now,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return CredentialSummary(
        id=record.id,
        label=record.label,
        created_at=record.created_at.isoformat() + "Z",
        updated_at=record.updated_at.isoformat() + "Z",
    )


@app.get("/api/credentials", response_model=list[CredentialSummary])
def list_credentials(db: Session = Depends(get_db)) -> list[CredentialSummary]:
    records = db.query(Credential).order_by(Credential.created_at.desc()).all()
    return [
        CredentialSummary(
            id=record.id,
            label=record.label,
            created_at=record.created_at.isoformat() + "Z",
            updated_at=record.updated_at.isoformat() + "Z",
        )
        for record in records
    ]
