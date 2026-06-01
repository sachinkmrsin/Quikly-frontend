import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import NotFoundPage from "@/pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("renders 404 message", () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("has a link to home page", () => {
    renderWithProviders(<NotFoundPage />);
    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
