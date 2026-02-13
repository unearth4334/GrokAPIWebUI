import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///./test.db")
os.environ.setdefault("GROK_MASTER_KEY", "test-master-key")

from fastapi.testclient import TestClient

from src.backend.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
