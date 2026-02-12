from pydantic import BaseModel, Field


class UiSettings(BaseModel):
    version: int = Field(1, ge=1)
    theme: str = Field("system", pattern="^(light|dark|system)$")
    thumbnail_size: int = Field(128, ge=64, le=256)
    updated_at: str = Field("1970-01-01T00:00:00Z")
    active_credential_id: str | None = None


class UiSettingsPatch(BaseModel):
    theme: str | None = Field(default=None, pattern="^(light|dark|system)$")
    thumbnail_size: int | None = Field(default=None, ge=64, le=256)
    active_credential_id: str | None = None
