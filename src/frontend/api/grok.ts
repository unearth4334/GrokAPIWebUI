export interface GrokTextResponse {
  id: string;
  outputText: string;
}

interface GrokTextPayload {
  prompt: string;
  system?: string;
  model?: string;
  previous_response_id?: string | null;
  store?: boolean;
}

interface GrokTextResponseApi {
  id: string;
  output_text: string;
}

export async function generateText(payload: GrokTextPayload): Promise<GrokTextResponse> {
  const response = await fetch("/api/grok/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to generate text");
  }

  const data = (await response.json()) as GrokTextResponseApi;
  return {
    id: data.id,
    outputText: data.output_text,
  };
}
