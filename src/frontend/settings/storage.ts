import { DEFAULT_SETTINGS, type Theme, type UiSettings } from "./types";

const DB_NAME = "grok-ui";
const DB_VERSION = 1;
const STORE_NAME = "settings";
const SETTINGS_KEY = "ui";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function clampThumbnailSize(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_SETTINGS.thumbnailSize;
  }
  return Math.min(256, Math.max(64, Math.round(parsed)));
}

function normalizeSettings(input: Partial<UiSettings>): UiSettings {
  const nowIso = new Date().toISOString();
  return {
    version: Number.isFinite(input.version) ? Math.max(1, Math.round(input.version)) : DEFAULT_SETTINGS.version,
    theme: isTheme(input.theme) ? input.theme : DEFAULT_SETTINGS.theme,
    thumbnailSize: clampThumbnailSize(input.thumbnailSize),
    updatedAt: typeof input.updatedAt === "string" && input.updatedAt.length > 0 ? input.updatedAt : nowIso,
    activeCredentialId: typeof input.activeCredentialId === "string" ? input.activeCredentialId : null,
  };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = run(store);

    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

export async function getSettings(): Promise<UiSettings> {
  try {
    const stored = await withStore<UiSettings | undefined>("readonly", (store) => store.get(SETTINGS_KEY));
    return normalizeSettings({ ...DEFAULT_SETTINGS, ...(stored ?? {}) });
  } catch {
    return normalizeSettings(DEFAULT_SETTINGS);
  }
}

export async function setSettings(settings: UiSettings): Promise<void> {
  const normalized = normalizeSettings(settings);
  await withStore("readwrite", (store) => store.put(normalized, SETTINGS_KEY));
}

export async function updateSettings(patch: Partial<UiSettings>): Promise<UiSettings> {
  const current = await getSettings();
  const next = normalizeSettings({
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  await setSettings(next);
  return next;
}
