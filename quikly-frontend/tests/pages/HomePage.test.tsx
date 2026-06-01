import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import HomePage from "@/pages/HomePage";

describe("HomePage", () => {
  it("renders the hero section", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Shorten your URLs/i)).toBeInTheDocument();
  });

  it("renders the shorten form", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByPlaceholderText(/example\.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /shorten/i })).toBeInTheDocument();
  });

  it("shows validation error for invalid URL", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    const input = screen.getByPlaceholderText(/example\.com/i);
    await user.type(input, "not-a-url");
    await user.click(screen.getByRole("button", { name: /shorten/i }));

    expect(await screen.findByText(/valid URL/i)).toBeInTheDocument();
  });
});
