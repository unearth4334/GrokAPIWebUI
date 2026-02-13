import { useState } from "react";
import { generateText } from "../api/grok";
import "./styles/chat-shell.css";

interface ChatShellProps {
  thumbnailSize: number;
}

export function ChatShell({ thumbnailSize }: ChatShellProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isSending) {
      return;
    }

    setIsSending(true);
    setStatus(null);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setPrompt("");

    try {
      const response = await generateText({
        prompt: trimmed,
        previous_response_id: previousResponseId,
      });
      setMessages((current) => [...current, { role: "assistant", content: response.outputText }]);
      setPreviousResponseId(response.id || null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to generate text.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="chat-shell">
      <section className="chat-shell__history">
        {messages.length === 0 ? (
          <div className="chat-shell__hero">
            <div className="chat-shell__logo" style={{ width: thumbnailSize, height: thumbnailSize }}>
              <span>G</span>
            </div>
            <h1>Start a conversation</h1>
            <p>Enter a prompt below to begin a Grok chat session.</p>
          </div>
        ) : (
          <div className="chat-shell__messages">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`chat-shell__message chat-shell__message--${message.role}`}>
                <span className="chat-shell__role">{message.role === "user" ? "You" : "Grok"}</span>
                <p>{message.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="chat-shell__composer">
        <label className="chat-shell__label" htmlFor="prompt-input">
          Message
        </label>
        <div className="chat-shell__input-row">
          <textarea
            id="prompt-input"
            placeholder="Ask Grok anything..."
            rows={2}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <button type="button" onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending" : "Send"}
          </button>
        </div>
        {status ? <p className="chat-shell__status">{status}</p> : null}
      </section>
    </main>
  );
}
