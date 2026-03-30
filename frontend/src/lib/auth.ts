"use client";

import { clearToken, getToken } from "./api";

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = () => {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
