import { useCallback, useEffect, useState } from "react";
import { addURL, bulkAction, fetchURLs, URLItem } from "../api/api";
import { BulkActionType, URLFormData } from "../types";
import { useApi } from "./useApi";

interface UseURLsState {
  urls: URLItem[];
  total: number;
  page: number;
  size: number;
  searchQuery: string;
  selectedIds: number[];
}

export function useURLs(initialPageSize: number = 10) {
  const [state, setState] = useState<UseURLsState>({
    urls: [],
    total: 0,
    page: 1,
    size: initialPageSize,
    searchQuery: "",
    selectedIds: [],
  });

  const {
    isLoading: isLoadingURLs,
    error: loadError,
    execute: executeFetchURLs,
  } = useApi(fetchURLs);

  const {
    isLoading: isAddingURL,
    error: addError,
    execute: executeAddURL,
  } = useApi(addURL);

  const { isLoading: isBulkActionLoading, execute: executeBulkAction } =
    useApi(bulkAction);

  const loadURLs = useCallback(async () => {
    try {
      const data = await executeFetchURLs(
        state.page,
        state.size,
        state.searchQuery || undefined
      );
      if (data) {
        setState((prev) => ({
          ...prev,
          urls: data.data,
          total: data.total,
        }));
      }
    } catch (error) {
      // Error is already handled by useApi
    }
  }, [executeFetchURLs, state.page, state.size, state.searchQuery]);

  const addNewURL = useCallback(
    async (urlData: URLFormData) => {
      try {
        await executeAddURL(urlData);
        // Refresh the list by calling executeFetchURLs directly
        const data = await executeFetchURLs(
          state.page,
          state.size,
          state.searchQuery || undefined
        );
        if (data) {
          setState((prev) => ({
            ...prev,
            urls: data.data,
            total: data.total,
          }));
        }
      } catch (error) {
        throw error; // Re-throw to allow component to handle
      }
    },
    [executeAddURL, executeFetchURLs, state.page, state.size, state.searchQuery]
  );

  const handleBulkAction = useCallback(
    async (action: BulkActionType) => {
      if (state.selectedIds.length === 0) return;

      try {
        await executeBulkAction(action, state.selectedIds);
        setState((prev) => ({ ...prev, selectedIds: [] }));
        // Refresh the list by calling executeFetchURLs directly
        const data = await executeFetchURLs(
          state.page,
          state.size,
          state.searchQuery || undefined
        );
        if (data) {
          setState((prev) => ({
            ...prev,
            urls: data.data,
            total: data.total,
          }));
        }
      } catch (error) {
        throw error;
      }
    },
    [
      state.selectedIds,
      executeBulkAction,
      executeFetchURLs,
      state.page,
      state.size,
      state.searchQuery,
    ]
  );

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query, page: 1 }));
  }, []);

  const setSelectedIds = useCallback((ids: number[]) => {
    setState((prev) => ({ ...prev, selectedIds: ids }));
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter((selectedId) => selectedId !== id)
        : [...prev.selectedIds, id],
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIds: prev.urls.map((url) => url.id),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedIds: [] }));
  }, []);

  // Load URLs when page, size, or searchQuery changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await executeFetchURLs(
          state.page,
          state.size,
          state.searchQuery || undefined
        );
        if (data) {
          setState((prev) => ({
            ...prev,
            urls: data.data,
            total: data.total,
          }));
        }
      } catch (error) {
        // Error is already handled by useApi
      }
    };

    fetchData();
  }, [state.page, state.size, state.searchQuery, executeFetchURLs]);

  return {
    // State
    urls: state.urls,
    total: state.total,
    page: state.page,
    size: state.size,
    searchQuery: state.searchQuery,
    selectedIds: state.selectedIds,

    // Loading states
    isLoadingURLs,
    isAddingURL,
    isBulkActionLoading,

    // Errors
    loadError,
    addError,

    // Actions
    loadURLs,
    addNewURL,
    handleBulkAction,
    setPage,
    setSearchQuery,
    setSelectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
  };
}
