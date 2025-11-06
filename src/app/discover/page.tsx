"use client";

import WebLayout from "@/components/web-layout";
import { UserCard } from "@/components/user-card";
import { EventCard } from "@/components/event-card";
import { Search } from "lucide-react";
import { Api, type HopOnEvent, type HopOnUser } from "@/lib/api";
import { FALLBACK_EVENTS, FALLBACK_PLAYERS } from "@/lib/fallback-data";
import { useAuth } from "@/context/auth-context";
import * as React from "react";

type PlayerDisplay = {
  id: string;
  backendId?: number;
  name: string;
  handle: string;
  rating?: number;
  bio?: string | null;
  location?: string | null;
  eventsCount?: number;
  tags: string[];
  tagsLower: string[];
  isFollowing?: boolean;
};

type EventDisplay = {
  id: string;
  title: string;
  sport: string;
  level?: string | null;
  location: string;
  datetime?: string | null;
  playersText: string;
  distanceKm?: number | null;
  hostName?: string | null;
  tagsLower: string[];
  description?: string | null;
};

const DEFAULT_FILTER = "Nearby";

export default function DiscoverPage() {
  const [query, setQuery] = React.useState("");
  const [players, setPlayers] = React.useState<HopOnUser[]>([]);
  const [events, setEvents] = React.useState<HopOnEvent[]>([]);
  const [activeFilter, setActiveFilter] = React.useState(DEFAULT_FILTER);
  const { status, user } = useAuth();
  const isAuthenticated = status === "authenticated";
  const [playerOverrides, setPlayerOverrides] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    Api.playersNearby().then(setPlayers).catch(() => setPlayers([]));
  }, []);

  React.useEffect(() => {
    Api.nearbyEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const playerItems = React.useMemo<PlayerDisplay[]>(() => {
    const apiPlayers = players.map((player) => {
        const sports = Array.isArray(player.sports)
          ? player.sports.filter((sport): sport is string => Boolean(sport))
          : [];
        const tagsLower = sports.map((sport) => sport.toLowerCase());
        const eventsCount = player.eventsCount ?? player.events_count ?? undefined;
        const isFollowing = Boolean(
          player.is_following ?? player.isFollowing ?? false
        );
        return {
          id: `api-player-${player.id}`,
          backendId: player.id,
          name: player.username,
          handle: player.username,
          rating: typeof player.rating === "number" ? player.rating : undefined,
          bio: player.bio,
          location: player.location,
          eventsCount,
          tags: sports,
          tagsLower,
          isFollowing,
        };
      });

      const seenHandles = new Set(apiPlayers.map((player) => player.handle.toLowerCase()));

    const fallbackPlayers = FALLBACK_PLAYERS.filter(
      (player) => !seenHandles.has(player.handle.toLowerCase())
        ).map((player, index) => ({
          id: `fallback-player-${index}`,
          backendId: undefined,
          name: player.name,
          handle: player.handle,
          rating: player.rating,
          bio: player.bio,
          location: player.location,
          eventsCount: player.eventsCount,
          tags: player.tags,
          tagsLower: player.tags.map((tag) => tag.toLowerCase()),
          isFollowing: player.isFollowing ?? false,
        }));

    return [...apiPlayers, ...fallbackPlayers].map((player) => ({
      ...player,
      isFollowing: playerOverrides[player.id] ?? player.isFollowing ?? false,
    }));
  }, [players, playerOverrides]);

  const eventItems = React.useMemo<EventDisplay[]>(() => {
    const seenTitles = new Set<string>();

    const normalizedEvents = events.map((event) => {
      const title = event.name;
      const normalizedTitle = title.toLowerCase();
      seenTitles.add(normalizedTitle);
      return {
        id: `api-event-${event.id}`,
        title,
        sport: event.sport,
        level: event.skill_level,
        location: event.location,
        datetime: event.event_date,
        playersText: `${event.current_players}/${event.max_players} players`,
        distanceKm: event.distance_km ?? undefined,
        hostName: event.host?.username ?? null,
        description: event.notes ?? null,
        tagsLower: [event.sport.toLowerCase()],
      };
    });

    const fallbackEvents = FALLBACK_EVENTS.filter(
      (event) => !seenTitles.has(event.title.toLowerCase())
    ).map((event) => ({
      id: event.id,
      title: event.title,
      sport: event.sport,
      level: event.level,
      location: event.location,
      datetime: event.datetime,
      playersText: event.playersText,
      distanceKm: event.distanceKm,
      hostName: event.hostName ?? null,
      description: event.description ?? null,
      tagsLower: [event.sport.toLowerCase()],
    }));

    return [...normalizedEvents, ...fallbackEvents];
  }, [events]);

  const filters = React.useMemo(() => {
    const sportSet = new Set<string>();
    playerItems.forEach((player) => {
      player.tags.forEach((tag) => sportSet.add(tag));
    });
    eventItems.forEach((event) => {
      sportSet.add(event.sport);
    });
    return [DEFAULT_FILTER, ...Array.from(sportSet).sort((a, b) => a.localeCompare(b))];
  }, [playerItems, eventItems]);

  React.useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter(DEFAULT_FILTER);
    }
  }, [filters, activeFilter]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPlayers = React.useMemo(() => {
    return playerItems.filter((player) => {
      const matchesFilter =
        activeFilter === DEFAULT_FILTER ||
        player.tagsLower.includes(activeFilter.toLowerCase());

      if (!matchesFilter) {
        return false;
      }

      if (normalizedQuery.length === 0) {
        return true;
      }

      const haystacks = [
        player.name,
        player.handle,
        player.bio ?? undefined,
        player.location ?? undefined,
      ]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.toLowerCase());

      const matchInText = haystacks.some((value) => value.includes(normalizedQuery));
      const matchInTags = player.tagsLower.some((tag) => tag.includes(normalizedQuery));

      return matchInText || matchInTags;
    });
  }, [playerItems, activeFilter, normalizedQuery]);

  const filteredEvents = React.useMemo(() => {
    return eventItems.filter((event) => {
      const matchesFilter =
        activeFilter === DEFAULT_FILTER ||
        event.tagsLower.includes(activeFilter.toLowerCase());

      if (!matchesFilter) {
        return false;
      }

      if (normalizedQuery.length === 0) {
        return true;
      }

      const haystacks = [
        event.title,
        event.sport,
        event.level ?? undefined,
        event.location,
        event.hostName ?? undefined,
      ]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.toLowerCase());

      return haystacks.some((value) => value.includes(normalizedQuery));
    });
  }, [eventItems, activeFilter, normalizedQuery]);

  React.useEffect(() => {
    setPlayerOverrides({});
  }, [players]);

  const handleFollowToggle = React.useCallback(
    async (player: PlayerDisplay) => {
      if (!player.backendId) {
        return;
      }
      const currentlyFollowing = player.isFollowing ?? false;
      if (isAuthenticated && user) {
        try {
          if (currentlyFollowing) {
            await Api.unfollow(player.backendId, user.id);
          } else {
            await Api.follow(player.backendId, user.id);
          }
        } catch (error) {
          console.error("Failed to toggle follow", error);
          return;
        }
      }
      setPlayerOverrides((prev) => ({
        ...prev,
        [player.id]: !currentlyFollowing,
      }));
    },
    [isAuthenticated, user]
  );

  return (
    <WebLayout title="Discover">
      <div className="relative">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search players, sports, locations..."
          className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 pl-11 text-neutral-100 placeholder:text-neutral-500"
        />
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 pb-2">
        {filters.map((chip) => {
          const isActive = chip === activeFilter;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className={
                isActive
                  ? "rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-neutral-200 hover:border-neutral-700 hover:text-white"
              }
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-10 pb-10">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Players</h2>
            <span className="text-sm text-neutral-400">{filteredPlayers.length} result(s)</span>
          </div>
          {filteredPlayers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-8 text-center text-sm text-neutral-400">
              No players match the current filters. Try a different sport or search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredPlayers.map((player) => (
                <UserCard
                  key={player.id}
                  name={player.name}
                  handle={player.handle}
                  rating={player.rating}
                  bio={player.bio ?? undefined}
                  location={player.location ?? undefined}
                  eventsCount={player.eventsCount}
                  tags={player.tags}
                  isFollowing={player.isFollowing}
                  onToggleFollow={
                    player.backendId ? () => handleFollowToggle(player) : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Games & Events</h2>
            <span className="text-sm text-neutral-400">{filteredEvents.length} result(s)</span>
          </div>
          {filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-8 text-center text-sm text-neutral-400">
              No events match the current filters. Try adjusting your sport or search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  sport={event.sport}
                  level={event.level ?? undefined}
                  location={event.location}
                  datetime={event.datetime ?? undefined}
                  playersText={event.playersText}
                  distanceKm={event.distanceKm ?? undefined}
                  hostName={event.hostName ?? undefined}
                  description={event.description ?? undefined}
                  rightActionLabel="View"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </WebLayout>
  );
}
