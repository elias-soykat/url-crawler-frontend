import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock environment variables
Object.defineProperty(window, "import", {
  value: {
    meta: {
      env: {
        VITE_API_URL: "http://localhost:8080",
      },
    },
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.location
delete (window as any).location;
(window as any).location = {
  href: "http://localhost:3000/",
  origin: "http://localhost:3000",
  pathname: "/",
  search: "",
  hash: "",
  reload: vi.fn(),
  assign: vi.fn(),
  replace: vi.fn(),
};

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
