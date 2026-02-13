import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChatShell } from "../../src/frontend/ui/ChatShell";

const mockFetch = vi.fn();

describe("ChatShell", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  it("renders an assistant message after sending a prompt", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "resp_123", output_text: "Hello there." }),
    });

    render(<ChatShell thumbnailSize={128} />);

    const input = screen.getByPlaceholderText(/ask grok anything/i);
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText("Hello there.")).toBeInTheDocument();
    });
  });
});
