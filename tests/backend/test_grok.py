from src.backend.grok import extract_output_text


def test_extract_output_text() -> None:
    payload = {
        "output": [
            {
                "type": "message",
                "role": "assistant",
                "content": [
                    {"type": "output_text", "text": "Hello world"},
                ],
            }
        ]
    }

    assert extract_output_text(payload) == "Hello world"
