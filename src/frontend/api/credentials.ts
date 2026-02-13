export interface CredentialSummary {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface CredentialCreateResponse {
  id: string;
  label: string;
  created_at: string;
  updated_at: string;
}

export async function createCredential(apiKey: string, label = "Primary key"): Promise<CredentialSummary> {
  const response = await fetch("/api/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, api_key: apiKey }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to save credential");
  }

  const payload = (await response.json()) as CredentialCreateResponse;
  return {
    id: payload.id,
    label: payload.label,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}
