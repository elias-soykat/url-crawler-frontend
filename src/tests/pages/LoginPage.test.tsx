import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import * as api from "../../api/api";
import LoginPage from "../../pages/LoginPage";
import { renderWithProviders } from "../utils";

// Mock the API
vi.mock("../../api/api");
const mockApi = api as any;

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("renders login form correctly", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    expect(mockApi.login).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles successful login flow", async () => {
    mockApi.login.mockResolvedValue("mock-token");

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockApi.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles login failure", async () => {
    mockApi.login.mockRejectedValue(new Error("Invalid credentials"));

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows loading state during login", async () => {
    let resolveLogin: (value: string) => void;
    const loginPromise = new Promise<string>((resolve) => {
      resolveLogin = resolve;
    });
    mockApi.login.mockReturnValue(loginPromise);

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText("Logging in...")).toBeInTheDocument();
    });

    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Resolve the login
    resolveLogin!("mock-token");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("clears validation errors when user starts typing", async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: "Login" });
    const usernameInput = screen.getByLabelText("Username");

    // Trigger validation errors
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });

    // Start typing in username field
    fireEvent.change(usernameInput, { target: { value: "u" } });

    await waitFor(() => {
      expect(
        screen.queryByText("Username is required")
      ).not.toBeInTheDocument();
    });
  });

  it("navigates to signup page when link is clicked", () => {
    renderWithProviders(<LoginPage />);

    const signupLink = screen.getByRole("link", { name: "Sign up" });
    expect(signupLink).toHaveAttribute("href", "/signup");
  });

  it("maintains form state during validation", async () => {
    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "" } }); // Empty password
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    // Username should still be there
    expect(usernameInput).toHaveValue("testuser");
  });
});
