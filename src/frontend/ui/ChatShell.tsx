import "./styles/chat-shell.css";

interface ChatShellProps {
  thumbnailSize: number;
}

export function ChatShell({ thumbnailSize }: ChatShellProps) {
  return (
    <main className="chat-shell">
      <section className="chat-shell__history">
        <div className="chat-shell__hero">
          <div className="chat-shell__logo" style={{ width: thumbnailSize, height: thumbnailSize }}>
            <span>G</span>
          </div>
          <h1>Start a conversation</h1>
          <p>Enter a prompt below to begin a Grok chat session.</p>
        </div>
      </section>
      <section className="chat-shell__composer">
        <label className="chat-shell__label" htmlFor="prompt-input">
          Message
        </label>
        <div className="chat-shell__input-row">
          <textarea id="prompt-input" placeholder="Ask Grok anything..." rows={2} />
          <button type="button">Send</button>
        </div>
      </section>
    </main>
  );
}
