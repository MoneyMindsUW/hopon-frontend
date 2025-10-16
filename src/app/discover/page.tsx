"use client";

import WebLayout from "@/components/web-layout";
import { UserCard } from "@/components/user-card";
import { Search } from "lucide-react";
import { Api, type HopOnUser } from "@/lib/api";
import * as React from "react";

export default function DiscoverPage() {
  const [query, setQuery] = React.useState("");
  const [players, setPlayers] = React.useState<HopOnUser[]>([]);

  React.useEffect(() => {
    Api.playersNearby().then(setPlayers).catch(() => setPlayers([]));
  }, []);

  return (
    <WebLayout title="Discover">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players, sports, locations..."
          className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 pl-11 text-neutral-100 placeholder:text-neutral-500"
        />
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 pb-2">
        {['Nearby', 'Basketball', 'Tennis', 'Badminton'].map((chip, i) => (
          <button
            key={chip}
            className={
              i === 0
                ? "rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-full bg-neutral-900/60 px-4 py-2 text-sm text-neutral-200 border border-neutral-800"
            }
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 pb-8 lg:grid-cols-2">
        {players.length === 0 && (
          <>
            <UserCard
              name="Alex Chen"
              handle="alexchen_sports"
              rating={4.8}
              bio="Basketball enthusiast, love pickup games and meeting new people!"
              location="Downtown"
              eventsCount={15}
              tags={["Basketball", "Tennis"]}
            />
            <UserCard
              name="Sarah Miller"
              handle="sarahm_tennis"
              rating={4.9}
              bio="Tennis coach by day, competitive player by night. Always up for a good match."
              location="Riverside"
              eventsCount={23}
              tags={["Tennis", "Badminton"]}
              isFollowing
            />
          </>
        )}
        {players.map((p) => (
          <UserCard
            key={p.id}
            name={p.username}
            handle={p.username}
            rating={p.rating}
            bio={p.bio}
            location={p.location}
            eventsCount={p.events_count}
            tags={p.sports}
          />
        ))}
      </div>
    </WebLayout>
  );
}
