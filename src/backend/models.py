import datetime as dt
import uuid

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Credential(Base):
    __tablename__ = "credentials"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    label: Mapped[str] = mapped_column(String(120))
    encrypted_api_key: Mapped[str] = mapped_column(String(512))
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=dt.datetime.utcnow)
    updated_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default=dt.datetime.utcnow)
