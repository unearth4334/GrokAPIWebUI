import base64
import hashlib

from cryptography.fernet import Fernet

from .config import get_settings


def build_fernet() -> Fernet:
    raw = get_settings().master_key.encode("utf-8")
    # Normalize any passphrase into a 32-byte key.
    digest = hashlib.sha256(raw).digest()
    key = base64.urlsafe_b64encode(digest)
    return Fernet(key)


def encrypt_secret(plaintext: str) -> str:
    fernet = build_fernet()
    token = fernet.encrypt(plaintext.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_secret(ciphertext: str) -> str:
    fernet = build_fernet()
    plaintext = fernet.decrypt(ciphertext.encode("utf-8"))
    return plaintext.decode("utf-8")
