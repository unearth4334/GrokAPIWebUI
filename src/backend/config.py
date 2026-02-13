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


def get_settings() -> Settings:
    return Settings()
