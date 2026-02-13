from pydantic import BaseModel, Field


class CredentialCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=120)
    api_key: str = Field(..., min_length=10)


class CredentialSummary(BaseModel):
    id: str
    label: str
    created_at: str
    updated_at: str
