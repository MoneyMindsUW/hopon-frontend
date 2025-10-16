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
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API ${res.status}: ${msg}`);
  }
  return (await res.json()) as T;
}

export const Api = {
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
  async myEvents(userId: number) {
    return http<{ joined: HopOnEvent[]; hosted: HopOnEvent[] }>(`/me/events?user_id=${userId}`);
  },
  async playersNearby() {
    return http<HopOnUser[]>(`/users/nearby`);
  },
  async follow(userId: number, followerId: number) {
    return http<{ message: string }>(`/users/${userId}/follow`, {
      method: "POST",
      body: JSON.stringify({ follower_id: followerId }),
    });
  },
};

