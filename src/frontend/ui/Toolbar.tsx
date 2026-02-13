import { GearIcon } from "@primer/octicons-react";
import "./styles/toolbar.css";

interface ToolbarProps {
  onOpenSettings: () => void;
}

export function Toolbar({ onOpenSettings }: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbar__left">
        <span className="toolbar__brand">Grok</span>
        <span className="toolbar__subtitle">Open WebUI Shell</span>
      </div>
      <button className="toolbar__button" type="button" onClick={onOpenSettings} aria-label="Open settings">
        <GearIcon size={16} />
      </button>
    </header>
  );
}
