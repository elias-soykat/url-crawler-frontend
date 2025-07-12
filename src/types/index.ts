// Form data types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  confirmPassword?: string;
}

export interface URLFormData {
  address: string;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

export interface FormErrors {
  [key: string]: string;
}

// Enhanced error types for better type safety
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface NetworkError {
  type: "network";
  message: string;
  originalError?: Error;
}

export interface ServerError {
  type: "server";
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface ClientError {
  type: "client";
  message: string;
  statusCode: number;
  validationErrors?: ValidationError[];
}

export type AppError = NetworkError | ServerError | ClientError;

// Component prop types
export interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  size: number;
  total: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Enhanced loading state with better error typing
export interface EnhancedLoadingState<T = unknown> {
  isLoading: boolean;
  error: AppError | null;
  data: T | null;
  lastFetch?: Date;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// Table selection types
export interface TableSelection {
  selectedIds: number[];
  isAllSelected: boolean;
}

// Bulk action types
export type BulkActionType = "rerun" | "delete";

export interface BulkActionRequest {
  action: BulkActionType;
  ids: number[];
}

// Hook return types for better type safety
export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  isSubmitting: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
  reset: () => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
}

// URL status types for better type safety
export type URLStatus = "queued" | "running" | "done" | "error";

// Component state types
export interface ComponentState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}
