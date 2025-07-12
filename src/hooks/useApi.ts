import { useCallback, useState } from "react";
import { APIError } from "../api/api";
import { LoadingState } from "../types";

interface UseApiOptions<R> {
  onSuccess?: (data: R) => void;
  onError?: (error: APIError) => void;
}

export function useApi<T extends readonly unknown[], R>(
  apiFunction: (...args: T) => Promise<R>,
  options: UseApiOptions<R> = {}
) {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  // Memoize the callbacks to prevent unnecessary re-renders
  const onSuccess = useCallback(
    (data: R) => {
      options.onSuccess?.(data);
    },
    [options.onSuccess]
  );

  const onError = useCallback(
    (error: APIError) => {
      options.onError?.(error);
    },
    [options.onError]
  );

  const execute = useCallback(
    async (...args: T): Promise<R | undefined> => {
      setState({ isLoading: true, error: null });

      try {
        const result = await apiFunction(...args);
        setState({ isLoading: false, error: null });
        onSuccess(result);
        return result;
      } catch (error) {
        const apiError =
          error instanceof APIError
            ? error
            : new APIError("An unexpected error occurred");
        setState({ isLoading: false, error: apiError.message });
        onError(apiError);
        throw apiError;
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  } as const;
}
