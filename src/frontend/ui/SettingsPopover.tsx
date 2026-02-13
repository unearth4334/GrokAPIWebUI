import { useEffect, useMemo, useState } from "react";
import "./styles/settings-popover.css";
import type { UiSettings } from "../settings/types";
import { createCredential } from "../api/credentials";

interface SettingsPopoverProps {
  isOpen: boolean;
  settings: UiSettings;
  onClose: () => void;
  onSave: (settings: UiSettings) => void;
}

export function SettingsPopover({ isOpen, settings, onClose, onSave }: SettingsPopoverProps) {
  const [apiKey, setApiKey] = useState("");
  const [theme, setTheme] = useState(settings.theme);
  const [thumbnailSize, setThumbnailSize] = useState(String(settings.thumbnailSize));
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTheme(settings.theme);
      setThumbnailSize(String(settings.thumbnailSize));
      setStatus(null);
    }
  }, [isOpen, settings.theme, settings.thumbnailSize]);

  const canShow = useMemo(() => isOpen, [isOpen]);

  if (!canShow) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      let nextSettings: UiSettings = {
        ...settings,
        theme,
        thumbnailSize: Number(thumbnailSize),
        updatedAt: new Date().toISOString(),
      };

      if (apiKey.trim().length > 0) {
        const credential = await createCredential(apiKey.trim(), "Primary key");
        nextSettings = {
          ...nextSettings,
          activeCredentialId: credential.id,
        };
      }

      await onSave(nextSettings);
      setApiKey("");
      setStatus("Settings saved.");
      onClose();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-popover" role="dialog" aria-modal="true">
      <div className="settings-popover__panel">
        <div className="settings-popover__header">
          <h2>Settings</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="settings-popover__section">
          <label htmlFor="theme-select">Theme</label>
          <select id="theme-select" value={theme} onChange={(event) => setTheme(event.target.value as UiSettings["theme"])}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="settings-popover__section">
          <label htmlFor="thumbnail-size">Thumbnail size</label>
          <input
            id="thumbnail-size"
            type="number"
            min={64}
            max={256}
            value={thumbnailSize}
            onChange={(event) => setThumbnailSize(event.target.value)}
          />
        </div>

        <div className="settings-popover__section">
          <label htmlFor="api-key">Grok API key</label>
          <input
            id="api-key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          <p className="settings-popover__hint">Stored securely on the server.</p>
        </div>

        {status ? <p className="settings-popover__status">{status}</p> : null}

        <div className="settings-popover__actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary" onClick={handleSave} disabled={isSaving}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
