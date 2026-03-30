"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sf_token");
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("sf_token", token);
  }
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sf_token");
  }
};

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

export const apiFetch = async (path: string, options: FetchOptions = {}) => {
  const token = getToken();
  const url = new URL(`${API_BASE_URL}${path}`);
  
  if (options.params) {
    Object.keys(options.params).forEach((key) =>
      url.searchParams.append(key, options.params![key])
    );
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  return response;
};

export const apiGet = (path: string, params?: Record<string, string>) => 
  apiFetch(path, { method: "GET", params });

export const apiPost = (path: string, body: unknown) => 
  apiFetch(path, { method: "POST", body: JSON.stringify(body) });

export const apiPut = (path: string, body: unknown) => 
  apiFetch(path, { method: "PUT", body: JSON.stringify(body) });

export const apiPatch = (path: string, body: unknown) => 
  apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = (path: string) => 
  apiFetch(path, { method: "DELETE" });
