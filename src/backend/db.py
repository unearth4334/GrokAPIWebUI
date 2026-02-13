from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


class Base(DeclarativeBase):
    pass


_engine = None
_session_factory = None


def get_engine():
    global _engine
    if _engine is None:
        settings = get_settings()
        _engine = create_engine(settings.database_url, pool_pre_ping=True)
    return _engine


def get_session_factory():
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())
    return _session_factory


def get_session() -> Session:
    factory = get_session_factory()
    return factory()
