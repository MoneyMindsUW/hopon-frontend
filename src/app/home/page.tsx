"use client";

import WebLayout from "@/components/web-layout";
import { EventCard } from "@/components/event-card";
import { Api, type HopOnEvent } from "@/lib/api";
import * as React from "react";

export default function HomePage() {
  const [events, setEvents] = React.useState<HopOnEvent[]>([]);

  React.useEffect(() => {
    Api.nearbyEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

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
            <Stat label="Nearby" value="12" />
            <Stat label="Joined" value="3" />
            <Stat label="Hosted" value="8" />
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Nearby Events</h3>
          <button className="rounded-xl border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300">
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-8 lg:grid-cols-2">
          {events.length === 0 && (
            <EventCard
              title="Pickup Game"
              sport="Basketball"
              level="Intermediate"
              location="Central Park Courts"
              datetime={new Date().toISOString()}
              playersText="6/10 players"
              distanceKm={0.8}
              hostName="Alex Chen"
            />
          )}
          {events.map((e) => (
            <EventCard
              key={e.id}
              title={e.name}
              sport={e.sport}
              level={e.skill_level || undefined}
              location={e.location}
              datetime={e.event_date || undefined}
              playersText={`${e.current_players}/${e.max_players} players`}
              distanceKm={e.distance_km}
              hostName={e.host_user_id}
            />
          ))}
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
