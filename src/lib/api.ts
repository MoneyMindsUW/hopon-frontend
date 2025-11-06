export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type HopOnEvent = {
  id: number;
  name: string;
  sport: string;
  location: string;
  notes?: string | null;
  max_players: number;
  current_players: number;
  event_date?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  skill_level?: string | null;
  host_user_id?: number | null;
  distance_km?: number | null;
  host?: { id: number; username: string; avatar_url?: string | null } | null;
};

export type HopOnUser = {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  gender?: string | null;
  rating?: number | null;
  location?: string | null;
  sports?: string[] | null;
  eventsCount?: number | null;
  events_count?: number | null;
  avatar_url?: string | null;
  is_following?: boolean;
  isFollowing?: boolean;
};

type UnauthorizedHandler = () => Promise<boolean>;

let accessToken: string | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function registerUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

function buildHeaders(inputHeaders?: HeadersInit, body?: RequestInit["body"]) {
  const headers = new Headers(inputHeaders);
  if (body instanceof FormData) {
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return headers;
}

async function http<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const options: RequestInit = {
    credentials: "include",
    ...init,
  };
  options.headers = buildHeaders(init?.headers, init?.body);

  const res = await fetch(`${API_BASE_URL}${path}`, options);
  if (res.status === 401 && unauthorizedHandler && retry) {
    const refreshed = await unauthorizedHandler();
    if (refreshed) {
      return http<T>(path, init, false);
    }
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API ${res.status}: ${msg || res.statusText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const Api = {
  async session() {
    return http<{
      authenticated: boolean;
      user?: HopOnUser;
      access_token?: string;
    }>("/auth/session", { method: "GET" });
  },
  getGoogleLoginUrl(nextUrl: string) {
    const url = new URL("/auth/google/login", API_BASE_URL);
    url.searchParams.set("next", nextUrl);
    return url.toString();
  },
  async logout() {
    await http<{ message: string }>("/auth/logout", { method: "POST" });
  },
  async refreshAccessToken() {
    return http<{ access_token: string; user: HopOnUser }>("/auth/refresh", {
      method: "POST",
    });
  },
  async nearbyEvents(params?: { lat?: number; lng?: number }) {
    const query = params?.lat && params?.lng ? `?lat=${params.lat}&lng=${params.lng}` : "";
    return http<HopOnEvent[]>(`/events/nearby${query}`);
  },
  async createEvent(payload: Partial<HopOnEvent>) {
    return http<{ message: string; event: HopOnEvent }>(`/events`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async myEvents(userId?: number) {
    const suffix = typeof userId === "number" ? `?user_id=${userId}` : "";
    return http<{ joined: HopOnEvent[]; hosted: HopOnEvent[] }>(`/me/events${suffix}`);
  },
  async playersNearby() {
    return http<HopOnUser[]>(`/users/nearby`);
  },
  async follow(userId: number, followerId?: number) {
    return http<{ message: string }>(`/users/${userId}/follow`, {
      method: "POST",
      body: followerId ? JSON.stringify({ follower_id: followerId }) : undefined,
    });
  },
  async unfollow(userId: number, followerId?: number) {
    const options: RequestInit = followerId
      ? {
          method: "DELETE",
          body: JSON.stringify({ follower_id: followerId }),
        }
      : { method: "DELETE" };
    return http<{ message: string }>(`/users/${userId}/follow`, options);
  },
  async joinEvent(eventId: number, payload: { player_name?: string; team?: string; guest_token?: string }) {
    return http<{ message: string; event: HopOnEvent; guest_token?: string }>(`/events/${eventId}/join`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async leaveEvent(eventId: number, payload: { guest_token?: string }) {
    return http<{ message: string }>(`/events/${eventId}/leave`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
