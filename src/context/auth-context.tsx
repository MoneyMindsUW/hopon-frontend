'use client';

import * as React from "react";
import { Api, HopOnUser, registerUnauthorizedHandler, setAccessToken } from "@/lib/api";

type AuthStatus = "loading" | "authenticated" | "guest";

type AuthContextValue = {
  status: AuthStatus;
  user: HopOnUser | null;
  accessToken: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  guestName: string | null;
  setGuestName: (value: string) => void;
  guestTokens: Record<number, string>;
  getGuestToken: (eventId: number) => string | undefined;
  rememberGuestToken: (eventId: number, token: string) => void;
  clearGuestToken: (eventId: number) => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const API_ORIGIN = (() => {
  try {
    return new URL(Api.getGoogleLoginUrl("http://localhost")).origin;
  } catch {
    return "http://localhost:8000";
  }
})();

const LOCAL_STORAGE_KEYS = {
  guestName: "hopon_guest_name",
  guestTokens: "hopon_guest_tokens",
  authPayload: "hoponAuthPayload",
};

const POPUP_FEATURES = "width=500,height=600,noopener,noreferrer";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<HopOnUser | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [guestName, setGuestNameState] = React.useState<string | null>(null);
  const [guestTokens, setGuestTokens] = React.useState<Record<number, string>>({});
  const popupRef = React.useRef<Window | null>(null);
  const loginResolver = React.useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  } | null>(null);

  // Keep API module in sync with access token.
  React.useEffect(() => {
    setAccessToken(token);
  }, [token]);

  const closePopup = React.useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;
  }, []);

  const resetToGuest = React.useCallback(() => {
    setUser(null);
    setToken(null);
    setStatus("guest");
  }, []);

  const applyAuthPayload = React.useCallback((payload: { user?: HopOnUser; access_token?: string | null }) => {
    let nextStatus: AuthStatus | null = null;
    if (payload.user) {
      setUser(payload.user);
      nextStatus = "authenticated";
    }
    if (payload.access_token) {
      setToken(payload.access_token);
      nextStatus = "authenticated";
    }
    if (nextStatus) {
      setStatus(nextStatus);
    }
  }, []);

  // Load guest state from localStorage.
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedName = window.localStorage.getItem(LOCAL_STORAGE_KEYS.guestName);
    if (storedName) {
      setGuestNameState(storedName);
    }
    const storedTokens = window.localStorage.getItem(LOCAL_STORAGE_KEYS.guestTokens);
    if (storedTokens) {
      try {
        const parsed = JSON.parse(storedTokens) as Record<number, string>;
        setGuestTokens(parsed);
      } catch {
        window.localStorage.removeItem(LOCAL_STORAGE_KEYS.guestTokens);
      }
    }
  }, []);

  // Handle payload saved to localStorage (when popup cannot message opener).
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedPayload = window.localStorage.getItem(LOCAL_STORAGE_KEYS.authPayload);
    if (storedPayload) {
      try {
        const parsed = JSON.parse(storedPayload) as {
          user?: HopOnUser;
          access_token?: string;
        };
        applyAuthPayload(parsed);
      } finally {
        window.localStorage.removeItem(LOCAL_STORAGE_KEYS.authPayload);
      }
    }
  }, [applyAuthPayload, closePopup]);

  // Register global unauthorized handler to refresh tokens.
  React.useEffect(() => {
    registerUnauthorizedHandler(async () => {
      try {
        const result = await Api.refreshAccessToken();
        if (result?.access_token && result?.user) {
          applyAuthPayload({ access_token: result.access_token, user: result.user });
          return true;
        }
      } catch {
        // ignore
      }
      resetToGuest();
      return false;
    });
  }, [applyAuthPayload, resetToGuest]);

  // Listen for auth messages from popup.
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    function handleMessage(event: MessageEvent) {
      if (event.origin !== API_ORIGIN) {
        return;
      }
      const data = event.data;
      if (!data || typeof data !== "object" || data.type !== "hopon:auth") {
        return;
      }
      closePopup();
      const payload = data.payload as { user?: HopOnUser; access_token?: string };
      if (!payload?.user || !payload?.access_token) {
        loginResolver.current?.reject(new Error("Invalid authentication payload"));
        loginResolver.current = null;
        return;
      }
      applyAuthPayload(payload);
      loginResolver.current?.resolve();
      loginResolver.current = null;
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [applyAuthPayload, closePopup]);

  // Fetch current session on mount.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await Api.session();
        if (cancelled) {
          return;
        }
        if (result?.authenticated && result.user) {
          if (result.access_token) {
            setToken(result.access_token);
          }
          setUser(result.user);
          setStatus("authenticated");
        } else {
          resetToGuest();
        }
      } catch {
        if (!cancelled) {
          resetToGuest();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resetToGuest]);

  const loginWithGoogle = React.useCallback(() => {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("Window unavailable"));
    }
    const loginUrl = Api.getGoogleLoginUrl(window.location.origin);
    const popup = window.open(loginUrl, "hopon-google-auth", POPUP_FEATURES);
    if (!popup) {
      return Promise.reject(new Error("Unable to open login window"));
    }
    popupRef.current = popup;
    return new Promise<void>((resolve, reject) => {
      loginResolver.current = { resolve, reject };
    });
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await Api.logout();
    } catch {
      // ignore backend errors during logout
    } finally {
      closePopup();
      resetToGuest();
    }
  }, [closePopup, resetToGuest]);

  const setGuestName = React.useCallback((value: string) => {
    setGuestNameState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.guestName, value);
    }
  }, []);

  const rememberGuestToken = React.useCallback((eventId: number, tokenValue: string) => {
    setGuestTokens((prev) => {
      const next = { ...prev, [eventId]: tokenValue };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.guestTokens, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const clearGuestToken = React.useCallback((eventId: number) => {
    setGuestTokens((prev) => {
      if (!(eventId in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[eventId];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.guestTokens, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getGuestToken = React.useCallback(
    (eventId: number) => guestTokens[eventId],
    [guestTokens]
  );

  const contextValue = React.useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken: token,
      loginWithGoogle,
      logout,
      guestName,
      setGuestName,
      guestTokens,
      getGuestToken,
      rememberGuestToken,
      clearGuestToken,
    }),
    [
      status,
      user,
      token,
      loginWithGoogle,
      logout,
      guestName,
      setGuestName,
      guestTokens,
      getGuestToken,
      rememberGuestToken,
      clearGuestToken,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
