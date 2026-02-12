export type Theme = "light" | "dark" | "system";

export interface UiSettings {
  version: number;
  theme: Theme;
  thumbnailSize: number;
  updatedAt: string;
  activeCredentialId?: string | null;
}

export const DEFAULT_SETTINGS: UiSettings = {
  version: 1,
  theme: "system",
  thumbnailSize: 128,
  updatedAt: "1970-01-01T00:00:00Z",
  activeCredentialId: null,
};
