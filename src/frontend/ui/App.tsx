import { useEffect, useState } from "react";
import { Toolbar } from "./Toolbar";
import { ChatShell } from "./ChatShell";
import { SettingsPopover } from "./SettingsPopover";
import { getSettings, updateSettings } from "../settings/storage";
import type { UiSettings } from "../settings/types";
import "./styles/app.css";

const FALLBACK_SETTINGS: UiSettings = {
  version: 1,
  theme: "system",
  thumbnailSize: 128,
  updatedAt: "1970-01-01T00:00:00Z",
  activeCredentialId: null,
};

export function App() {
  const [settings, setSettings] = useState<UiSettings>(FALLBACK_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSettings().then((loaded) => {
      if (mounted) {
        setSettings(loaded);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSettingsSave = async (next: UiSettings) => {
    const saved = await updateSettings(next);
    setSettings(saved);
  };

  return (
    <div className="app-shell" data-theme={settings.theme}>
      <Toolbar onOpenSettings={() => setSettingsOpen(true)} />
      <ChatShell thumbnailSize={settings.thumbnailSize} />
      <SettingsPopover
        isOpen={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
}
