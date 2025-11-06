"use client";

import WebLayout from "@/components/web-layout";
import { EventCard } from "@/components/event-card";
import { Api, type HopOnEvent } from "@/lib/api";
import * as React from "react";
import { FALLBACK_EVENTS } from "@/lib/fallback-data";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const [events, setEvents] = React.useState<HopOnEvent[]>([]);
  const [joinedEventIds, setJoinedEventIds] = React.useState<number[]>([]);
  const [pendingAction, setPendingAction] = React.useState<
    { id: number; type: "join" | "leave" } | null
  >(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedSport, setSelectedSport] = React.useState<string>("All");
  const filterRef = React.useRef<HTMLDivElement | null>(null);
  const [hostedEvents, setHostedEvents] = React.useState<HopOnEvent[]>([]);
  const { status, user, guestName, setGuestName, guestTokens, rememberGuestToken, clearGuestToken } =
    useAuth();

  const loadData = React.useCallback(async () => {
    try {
      const nearby = await Api.nearbyEvents();
      let joined: HopOnEvent[] = [];
      let hosted: HopOnEvent[] = [];
      if (status === "authenticated") {
        const mine = await Api.myEvents();
        joined = mine.joined || [];
        hosted = mine.hosted || [];
      }
      setEvents(nearby);
      if (status === "authenticated") {
        setJoinedEventIds(joined.map((event) => event.id));
        setHostedEvents(hosted);
      } else {
        const guestJoinedIds = Object.keys(guestTokens).map((id) => Number(id));
        setJoinedEventIds(guestJoinedIds);
        setHostedEvents([]);
      }
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to load events", error);
      setEvents([]);
      setJoinedEventIds([]);
      setHostedEvents([]);
      setErrorMessage("Couldn't load events. Check your connection and try again.");
    }
  }, [guestTokens, status]);

  const availableSports = React.useMemo(() => {
    const sportsSource =
      events.length > 0 ? events.map((event) => event.sport) : FALLBACK_EVENTS.map((event) => event.sport);
    const unique = Array.from(new Set(sportsSource));
    return ["All", ...unique];
  }, [events]);

  React.useEffect(() => {
    if (selectedSport !== "All" && !availableSports.includes(selectedSport)) {
      setSelectedSport("All");
    }
  }, [availableSports, selectedSport]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!filterRef.current) return;
      if (!filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleJoin(eventId: number) {
    if (pendingAction !== null) {
      return;
    }
    setPendingAction({ id: eventId, type: "join" });
    try {
      if (status === "authenticated") {
        await Api.joinEvent(eventId, {
          player_name: user?.username,
        });
        await loadData();
      } else {
        let ensuredName = guestName;
        if (!ensuredName && typeof window !== "undefined") {
          const input = window.prompt("Enter your name so other players know who joined:");
          ensuredName = input ? input.trim() : "";
          if (ensuredName) {
            setGuestName(ensuredName);
          }
        }
        if (!ensuredName) {
          return;
        }
        const existingToken = guestTokens[eventId];
        const result = await Api.joinEvent(eventId, {
          player_name: ensuredName,
          guest_token: existingToken,
        });
        if (result.guest_token) {
          rememberGuestToken(eventId, result.guest_token);
        }
        setJoinedEventIds((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
        const refreshed = await Api.nearbyEvents();
        setEvents(refreshed);
      }
    } catch (error) {
      console.error("Failed to join event", error);
      setErrorMessage("Unable to join this event right now. Please try again.");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleLeave(eventId: number) {
    if (pendingAction !== null) {
      return;
    }
    setPendingAction({ id: eventId, type: "leave" });
    try {
      if (status === "authenticated") {
        await Api.leaveEvent(eventId, {});
        await loadData();
      } else {
        const guestToken = guestTokens[eventId];
        if (!guestToken) {
          setErrorMessage("We couldn't verify your spot for this game. Try joining again to refresh access.");
          return;
        }
        await Api.leaveEvent(eventId, { guest_token: guestToken });
        clearGuestToken(eventId);
        setJoinedEventIds((prev) => prev.filter((id) => id !== eventId));
        const refreshed = await Api.nearbyEvents();
        setEvents(refreshed);
      }
    } catch (error) {
      console.error("Failed to leave event", error);
      setErrorMessage("Unable to leave this event right now. Please try again.");
    } finally {
      setPendingAction(null);
    }
  }

  const joinedSet = React.useMemo(() => new Set(joinedEventIds), [joinedEventIds]);
  const filteredEvents = React.useMemo(() => {
    if (selectedSport === "All") {
      return events;
    }
    return events.filter((event) => event.sport === selectedSport);
  }, [events, selectedSport]);
  const filteredFallbackEvents = React.useMemo(() => {
    if (selectedSport === "All") {
      return FALLBACK_EVENTS;
    }
    return FALLBACK_EVENTS.filter((event) => event.sport === selectedSport);
  }, [selectedSport]);
  const noEventsToShow =
    (events.length > 0 && filteredEvents.length === 0) ||
    (events.length === 0 && filteredFallbackEvents.length === 0);
  const nearbyCount = events.length > 0 ? events.length : FALLBACK_EVENTS.length;
  const joinedCount = joinedEventIds.length;
  const hostedCount = hostedEvents.length;

  return (
    <WebLayout>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="h-60 w-full bg-gradient-to-tr from-neutral-800 to-neutral-700" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950/90" />
        <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
          <h2 className="text-3xl font-extrabold">HopOn</h2>
          <p className="text-neutral-300">Find your game</p>
        </div>
        <div className="absolute inset-x-0 bottom-4">
          <div className="mx-6 sm:mx-10 grid grid-cols-3 items-start gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur">
            <Stat label="Nearby" value={nearbyCount.toString()} />
            <Stat label="Joined" value={joinedCount.toString()} />
            <Stat label="Hosted" value={hostedCount.toString()} />
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Nearby Events</h3>
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="rounded-xl border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-700 hover:text-white"
              aria-haspopup="true"
              aria-expanded={isFilterOpen}
            >
              Filter
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-neutral-800 bg-neutral-900/95 p-4 text-sm shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-100">Filters</span>
                  <button
                    type="button"
                    className="text-xs text-neutral-400 hover:text-neutral-200"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(event) => setSelectedSport(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-red-400 focus:outline-none"
                >
                  {availableSports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300"
                  onClick={() => setSelectedSport("All")}
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 pb-8 lg:grid-cols-2">
          {noEventsToShow && (
            <div className="col-span-full rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-8 text-center text-sm text-neutral-400">
              No events match the selected filters yet. Try adjusting your filters or check back soon.
            </div>
          )}
          {!noEventsToShow &&
            (events.length === 0
              ? filteredFallbackEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              : filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.name}
                    sport={event.sport}
                    level={event.skill_level || undefined}
                    location={event.location}
                    datetime={event.event_date || undefined}
                    playersText={`${event.current_players}/${event.max_players} players`}
                    distanceKm={event.distance_km}
                    hostName={event.host?.username}
                    description={event.notes || undefined}
                    onRightActionClick={
                      joinedSet.has(event.id)
                        ? () => handleLeave(event.id)
                        : () => handleJoin(event.id)
                    }
                    rightActionLabel={(() => {
                      const isPending = pendingAction?.id === event.id;
                      if (joinedSet.has(event.id)) {
                        return isPending && pendingAction?.type === "leave" ? "Leaving..." : "Leave";
                      }
                      return isPending && pendingAction?.type === "join" ? "Joining..." : "Join";
                    })()}
                    disabled={pendingAction?.id === event.id}
                  />
                )))}
        </div>
      </div>
    </WebLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-start text-center">
      <div className="text-2xl font-bold text-red-400">{value}</div>
      <div className="text-sm text-neutral-300">{label}</div>
    </div>
  );
}
