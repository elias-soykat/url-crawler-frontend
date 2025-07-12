import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { AuthProvider } from "../context/AuthContext";

// Mock data
export const mockURLItem = {
  id: 1,
  address: "https://example.com",
  title: "Example Site",
  html_version: "HTML5",
  heading_counts: { h1: 1, h2: 3, h3: 5 },
  internal_links: 10,
  external_links: 5,
  broken_links: 2,
  broken_list: [
    { url: "https://example.com/broken1", code: "404", type: "internal" },
    { url: "https://example.com/broken2", code: "500", type: "external" },
  ],
  has_login_form: true,
  status: "done" as const,
  error: "",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
};

export const mockURLList = [
  mockURLItem,
  {
    ...mockURLItem,
    id: 2,
    address: "https://example2.com",
    title: "Example Site 2",
    status: "running" as const,
  },
];

export const mockAuthContext = {
  token: "mock-token",
  login: vi.fn(),
  logout: vi.fn(),
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  withAuth?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialEntries = ["/"], withAuth = true, ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = withAuth ? (
      <AuthProvider>{children}</AuthProvider>
    ) : (
      children
    );

    return <BrowserRouter>{content}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock API responses
export const mockApiResponses = {
  login: { token: "mock-token" },
  fetchURLs: {
    data: mockURLList,
    page: 1,
    size: 10,
    total: 2,
  },
  fetchURLDetails: mockURLItem,
  addURL: mockURLItem,
};

// Helper to mock API calls
export const mockApiCall = (returnValue: any, shouldReject = false) => {
  return vi.fn().mockImplementation(() => {
    if (shouldReject) {
      return Promise.reject(new Error("API Error"));
    }
    return Promise.resolve(returnValue);
  });
};

// Helper to wait for async operations
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));
