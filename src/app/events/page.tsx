"use client";

import WebLayout from "@/components/web-layout";
import { EventCard } from "@/components/event-card";
import * as React from "react";
import { Api, type HopOnEvent } from "@/lib/api";
import { CURRENT_USER } from "@/lib/current-user";

type TabKey = "joined" | "hosted";

export default function EventsPage() {
  const [tab, setTab] = React.useState<TabKey>("joined");
  const [joined, setJoined] = React.useState<HopOnEvent[]>([]);
  const [hosted, setHosted] = React.useState<HopOnEvent[]>([]);
  const [actionEventId, setActionEventId] = React.useState<number | null>(null);

  const loadMyEvents = React.useCallback(async () => {
    try {
      const res = await Api.myEvents(CURRENT_USER.id);
      setJoined(res.joined || []);
      setHosted(res.hosted || []);
    } catch (error) {
      console.error("Failed to load events", error);
      setJoined([]);
      setHosted([]);
    }
  }, []);

  React.useEffect(() => {
    void loadMyEvents();
  }, [loadMyEvents]);

  async function handleLeave(eventId: number) {
    if (actionEventId !== null) {
      return;
    }
    setActionEventId(eventId);
    try {
      await Api.leaveEvent(eventId, { user_id: CURRENT_USER.id });
      await loadMyEvents();
    } catch (error) {
      console.error("Failed to leave event", error);
    } finally {
      setActionEventId(null);
    }
  }

  const stats = [
    { label: "This Month", value: "12" },
    { label: "Upcoming", value: "3" },
    { label: "Total Events", value: "156" },
  ];

  const items = tab === "joined" ? joined : hosted;

  return (
    <WebLayout title="My Events">
      <div className="mt-2 flex gap-2 rounded-2xl bg-neutral-900/60 p-1">
        <button
          className={
            tab === "joined"
              ? "flex-1 rounded-xl bg-red-500 px-4 py-2 text-white"
              : "flex-1 rounded-xl px-4 py-2 text-neutral-300"
          }
          onClick={() => setTab("joined")}
        >
          Joined ({joined.length})
        </button>
        <button
          className={
            tab === "hosted"
              ? "flex-1 rounded-xl bg-red-500 px-4 py-2 text-white"
              : "flex-1 rounded-xl px-4 py-2 text-neutral-300"
          }
          onClick={() => setTab("hosted")}
        >
          Hosted ({hosted.length})
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-extrabold text-red-400">{s.value}</div>
            <div className="text-sm text-neutral-300">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 pb-8 lg:grid-cols-2">
        {items.length === 0 && (
          <>
            <EventCard
              title="Pickup Game"
              sport="Basketball"
              location="Central Park Courts"
              datetime={new Date().toISOString()}
              playersText="7/10"
              rightActionLabel="Leave"
            />
            <EventCard
              title="Singles Match"
              sport="Tennis"
              location="Riverside Tennis Club"
              datetime={new Date(Date.now() + 24 * 3600 * 1000).toISOString()}
              playersText="2/2"
              rightActionLabel="Leave"
            />
          </>
        )}
        {items.map((e) => {
          const isCurrent = actionEventId === e.id;
          const isJoinedTab = tab === "joined";
          return (
            <EventCard
              key={e.id}
              title={e.name}
              sport={e.sport}
              location={e.location}
              datetime={e.event_date || undefined}
              playersText={`${e.current_players}/${e.max_players}`}
              hostName={e.host?.username}
              rightActionLabel={
                isJoinedTab
                  ? isCurrent
                    ? "Leaving..."
                    : "Leave"
                  : "View"
              }
              onRightActionClick={isJoinedTab ? () => handleLeave(e.id) : undefined}
              disabled={isCurrent || (!isJoinedTab && true)}
            />
          );
        })}
      </div>
    </WebLayout>
  );
}
