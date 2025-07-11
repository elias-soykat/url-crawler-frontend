import axios from "./axios";

export type URLStatus = "queued" | "running" | "done" | "error";

export type URLItem = {
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
};

export type URLListResponse = {
  data: URLItem[];
  page: number;
  size: number;
  total: number;
};

export async function login(username: string, password: string) {
  const res = await axios.post("/auth/login", { username, password });
  return res.data.token;
}

export async function signup(username: string, password: string) {
  const res = await axios.post("/auth/signup", { username, password });
  return res.data.token;
}

export async function addURL(address: string) {
  const res = await axios.post("/urls", { address });
  return res.data;
}

export async function fetchURLs(page: number, size: number, q?: string) {
  const params: any = { page, size };
  if (q && q.trim()) params.q = q.trim();
  const res = await axios.get<URLListResponse>("/urls", { params });
  return res.data;
}

export async function fetchURLDetails(id: number | string) {
  const res = await axios.get<URLItem>("/urls/" + id);
  return res.data;
}

export async function bulkAction(action: "rerun" | "delete", ids: number[]) {
  const res = await axios.post("/urls/bulk", { action, ids });
  return res.data;
}
