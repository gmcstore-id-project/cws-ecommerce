import { getLoginUrl } from "@/const";
import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://cws-ecommerce-api.nadiracemilan25.workers.dev";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
} | null;

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};

  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data);
      if (data) {
        localStorage.setItem("manus-runtime-user-info", JSON.stringify(data));
      }
    } catch (err) {
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      localStorage.removeItem("manus-runtime-user-info");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    refresh: fetchMe,
    logout,
  };
}
