from __future__ import annotations

from typing import Any

import httpx


def build_text_request(
    *,
    prompt: str,
    system: str | None,
    model: str,
    previous_response_id: str | None,
    store: bool,
) -> dict[str, Any]:
    messages: list[dict[str, str]] = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload: dict[str, Any] = {
        "model": model,
        "input": messages,
        "store": store,
    }

    if previous_response_id:
        payload["previous_response_id"] = previous_response_id

    return payload


def extract_output_text(response_json: dict[str, Any]) -> str:
    output = response_json.get("output", [])
    if not isinstance(output, list):
        return ""

    for item in output:
        if not isinstance(item, dict):
            continue
        if item.get("type") != "message":
            continue
        content = item.get("content", [])
        if not isinstance(content, list):
            continue
        for content_item in content:
            if not isinstance(content_item, dict):
                continue
            if content_item.get("type") == "output_text":
                text = content_item.get("text", "")
                return text if isinstance(text, str) else ""
    return ""


def create_text_response(
    *,
    base_url: str,
    api_key: str,
    payload: dict[str, Any],
    timeout: float = 60.0,
) -> dict[str, Any]:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    with httpx.Client(base_url=base_url, timeout=timeout) as client:
        response = client.post("/v1/responses", headers=headers, json=payload)
    response.raise_for_status()
    return response.json()
