from pydantic import BaseModel, Field


class CredentialCreate(BaseModel):
    label: str = Field(..., min_length=1, max_length=120)
    api_key: str = Field(..., min_length=10)


class CredentialSummary(BaseModel):
    id: str
    label: str
    created_at: str
    updated_at: str


class GrokTextRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    system: str | None = None
    model: str | None = None
    previous_response_id: str | None = None
    store: bool | None = None


class GrokTextResponse(BaseModel):
    id: str
    output_text: str
