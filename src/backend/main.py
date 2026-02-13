import datetime as dt

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import get_settings
from .crypto import encrypt_secret
from .db import Base, get_engine, get_session
from .models import Credential
from .schemas import CredentialCreate, CredentialSummary

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
