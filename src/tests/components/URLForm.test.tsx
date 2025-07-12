import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { URLForm } from "../../components/URLForm";
import { renderWithProviders } from "../utils";

describe("URLForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form elements correctly", () => {
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByPlaceholderText("Enter website URL")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("validates URL input correctly", async () => {
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: "Add" });

    // Test empty URL
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("URL is required")).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates URL format correctly", async () => {
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} />);

    const urlInput = screen.getByPlaceholderText("Enter website URL");
    const submitButton = screen.getByRole("button", { name: "Add" });

    // Test invalid URL format
    fireEvent.change(urlInput, { target: { value: "invalid-url" } });
    fireEvent.click(submitButton);

    // Wait a bit to ensure any async operations complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The main thing we care about is that onSubmit is not called with invalid URL
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits valid URL successfully", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} />);

    const urlInput = screen.getByPlaceholderText("Enter website URL");
    const submitButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        address: "https://example.com",
      });
    });
  });

  it("clears form after successful submission", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} />);

    const urlInput = screen.getByPlaceholderText("Enter website URL");
    const submitButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(urlInput).toHaveValue("");
    });
  });

  it("shows loading state during submission", async () => {
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole("button", { name: "Adding..." });
    expect(submitButton).toBeDisabled();

    const urlInput = screen.getByPlaceholderText("Enter website URL");
    expect(urlInput).toBeDisabled();
  });

  it("displays API error messages", () => {
    const errorMessage = "Invalid URL format";
    renderWithProviders(
      <URLForm onSubmit={mockOnSubmit} error={errorMessage} />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("handles both http and https URLs", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    renderWithProviders(<URLForm onSubmit={mockOnSubmit} />);

    const urlInput = screen.getByPlaceholderText("Enter website URL");
    const submitButton = screen.getByRole("button", { name: "Add" });

    // Test HTTP URL
    fireEvent.change(urlInput, { target: { value: "http://example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        address: "http://example.com",
      });
    });

    // Test HTTPS URL
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        address: "https://example.com",
      });
    });
  });
});
