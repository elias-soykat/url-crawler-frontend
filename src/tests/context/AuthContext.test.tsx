import { act, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "../../context/AuthContext";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with token from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("stored-token");

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.token).toBe("stored-token");
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("token");
  });

  it("initializes with null token when localStorage is empty", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.token).toBeNull();
  });

  it("stores token in localStorage when login is called", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("new-token");
    });

    expect(result.current.token).toBe("new-token");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("token", "new-token");
  });

  it("removes token from localStorage when logout is called", () => {
    mockLocalStorage.getItem.mockReturnValue("existing-token");

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("token");
  });

  it("updates localStorage when token changes", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login with first token
    act(() => {
      result.current.login("token-1");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("token", "token-1");

    // Login with second token
    act(() => {
      result.current.login("token-2");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("token", "token-2");
    expect(result.current.token).toBe("token-2");
  });

  it("provides consistent context values", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.logout).toBe("function");
    expect(result.current.token).toBeDefined();
  });

  it("handles multiple login/logout cycles correctly", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initial state
    expect(result.current.token).toBeNull();

    // Login
    act(() => {
      result.current.login("test-token");
    });
    expect(result.current.token).toBe("test-token");

    // Logout
    act(() => {
      result.current.logout();
    });
    expect(result.current.token).toBeNull();

    // Login again
    act(() => {
      result.current.login("another-token");
    });
    expect(result.current.token).toBe("another-token");
  });

  it("maintains token persistence across re-renders", () => {
    mockLocalStorage.getItem.mockReturnValue("persistent-token");

    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.token).toBe("persistent-token");

    rerender();

    expect(result.current.token).toBe("persistent-token");
  });
});
