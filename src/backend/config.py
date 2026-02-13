import os


def get_env(name: str, default: str | None = None) -> str:
    value = os.getenv(name, default)
    if value is None:
        raise RuntimeError(f"Missing required env var: {name}")
    return value


class Settings:
    def __init__(self) -> None:
        self.database_url = get_env("DATABASE_URL", "sqlite+pysqlite:///./grok_ui.db")
        self.master_key = get_env("GROK_MASTER_KEY", "dev-master-key")
        self.cors_allow_origins = os.getenv("CORS_ALLOW_ORIGINS", "*")
        self.grok_api_base_url = os.getenv("GROK_API_BASE_URL", "https://api.x.ai")
        self.grok_api_key = os.getenv("GROK_API_KEY", os.getenv("XAI_API_KEY", ""))
        self.grok_text_model = os.getenv("GROK_TEXT_MODEL", "grok-4-0709")


def get_settings() -> Settings:
    return Settings()
