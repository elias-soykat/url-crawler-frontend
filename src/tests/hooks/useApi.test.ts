import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { APIError } from "../../api/api";
import { useApi } from "../../hooks/useApi";

describe("useApi", () => {
  const mockApiFunction = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useApi(mockApiFunction));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.execute).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("handles successful API call", async () => {
    const mockData = { id: 1, name: "Test" };
    mockApiFunction.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, { onSuccess: mockOnSuccess })
    );

    let executeResult: typeof mockData | undefined;

    await act(async () => {
      executeResult = await result.current.execute("test-arg");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(executeResult).toEqual(mockData);
    expect(mockOnSuccess).toHaveBeenCalledWith(mockData);
    expect(mockApiFunction).toHaveBeenCalledWith("test-arg");
  });

  it("handles API error", async () => {
    const mockError = new APIError(
      "Test error",
      "TEST_CODE",
      "test_field",
      400
    );
    mockApiFunction.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, { onError: mockOnError })
    );

    await act(async () => {
      try {
        await result.current.execute("test-arg");
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Test error");
    expect(mockOnError).toHaveBeenCalledWith(mockError);
  });

  it("handles non-API error", async () => {
    const mockError = new Error("Generic error");
    mockApiFunction.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, { onError: mockOnError })
    );

    await act(async () => {
      try {
        await result.current.execute("test-arg");
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("An unexpected error occurred");
    expect(mockOnError).toHaveBeenCalledWith(expect.any(APIError));
  });

  it("handles unknown error", async () => {
    const mockError = "String error";
    mockApiFunction.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useApi(mockApiFunction, { onError: mockOnError })
    );

    await act(async () => {
      try {
        await result.current.execute("test-arg");
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("An unexpected error occurred");
    expect(mockOnError).toHaveBeenCalledWith(expect.any(APIError));
  });

  it("resets state correctly", () => {
    const { result } = renderHook(() => useApi(mockApiFunction));

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles multiple arguments", async () => {
    const mockData = { result: "success" };
    mockApiFunction.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      await result.current.execute("arg1", "arg2", 123);
    });

    expect(mockApiFunction).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("handles no arguments", async () => {
    const mockData = { result: "success" };
    mockApiFunction.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await act(async () => {
      await result.current.execute();
    });

    expect(mockApiFunction).toHaveBeenCalledWith();
  });
});
