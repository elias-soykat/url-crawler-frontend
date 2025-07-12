import { AxiosError } from "axios";
import {
  BulkActionRequest,
  LoginFormData,
  SignupFormData,
  URLFormData,
} from "../types";
import axios from "./axios";

export type URLStatus = "queued" | "running" | "done" | "error";

export interface URLItem {
  id: number;
  address: string;
  title: string;
  html_version: string;
  heading_counts: Record<string, number>;
  internal_links: number;
  external_links: number;
  broken_links: number;
  broken_list: Array<{ url: string; code: string; type?: string }>;
  has_login_form: boolean;
  status: URLStatus;
  error: string;
  created_at: string;
  updated_at: string;
}

export interface URLListResponse {
  data: URLItem[];
  page: number;
  size: number;
  total: number;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    username: string;
  };
}

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public field?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Error handler utility
function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data?.error || error.message;
    const statusCode = error.response?.status;
    throw new APIError(apiError, error.code, undefined, statusCode);
  }
  if (error instanceof Error) {
    throw new APIError(error.message);
  }
  throw new APIError("An unexpected error occurred");
}

export async function login(credentials: LoginFormData): Promise<string> {
  try {
    const res = await axios.post<AuthResponse>("/auth/login", credentials);
    return res.data.token;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function signup(credentials: SignupFormData): Promise<string> {
  try {
    const res = await axios.post<AuthResponse>("/auth/signup", credentials);
    return res.data.token;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function addURL(urlData: URLFormData): Promise<URLItem> {
  try {
    const res = await axios.post<URLItem>("/urls", urlData);
    return res.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function fetchURLs(
  page: number,
  size: number,
  query?: string
): Promise<URLListResponse> {
  try {
    const params: Record<string, any> = { page, size };
    if (query?.trim()) {
      params.q = query.trim();
    }
    const res = await axios.get<URLListResponse>("/urls", { params });
    return res.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function fetchURLDetails(id: number | string): Promise<URLItem> {
  try {
    const res = await axios.get<URLItem>(`/urls/${id}`);
    return res.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
}

export async function bulkAction(
  action: BulkActionRequest["action"],
  ids: number[]
): Promise<void> {
  try {
    const payload: BulkActionRequest = { action, ids };
    await axios.post("/urls/bulk", payload);
  } catch (error: unknown) {
    handleApiError(error);
  }
}
