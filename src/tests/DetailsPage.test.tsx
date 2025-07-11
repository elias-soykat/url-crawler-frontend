import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DetailsPage from "../pages/DetailsPage";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

describe("DetailsPage", () => {
  it("renders loading state", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DetailsPage />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/loading/i)).toBeDefined();
  });
});