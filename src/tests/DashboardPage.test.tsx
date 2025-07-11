import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../pages/DashboardPage";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

describe("DashboardPage", () => {
  it("renders dashboard main elements", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/add/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/enter website url/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/global search/i)).toBeDefined();
  });
});