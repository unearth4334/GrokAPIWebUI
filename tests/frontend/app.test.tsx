import { render, screen } from "@testing-library/react";
import { App } from "../../src/frontend/ui/App";

describe("App", () => {
  it("renders the prompt input", () => {
    render(<App />);
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });
});
