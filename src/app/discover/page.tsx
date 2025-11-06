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
            <UserCard
              name="Marcus Lee"
              handle="marcuslee_runs"
              rating={4.6}
              bio="Weekend warrior with a passion for fast breaks and friendly competition."
              location="Midtown"
              eventsCount={12}
              tags={["Basketball", "Volleyball"]}
            />
            <UserCard
              name="Priya Patel"
              handle="priyap_smash"
              rating={4.7}
              bio="Always down for doubles and discovering new pickleball courts around town."
              location="Eastside"
              eventsCount={18}
              tags={["Badminton", "Pickleball"]}
              isFollowing
            />
            <UserCard
              name="David Nguyen"
              handle="davidn_footy"
              rating={4.5}
              bio="Midfielder who thrives on quick passes, pickup matches, and post-game banter."
              location="West End"
              eventsCount={20}
              tags={["Soccer"]}
            />
            <UserCard
              name="Emily Carter"
              handle="emilyc_runs"
              rating={4.4}
              bio="Early morning runner seeking new trails and partners for weekend 5Ks."
              location="Harborfront"
              eventsCount={9}
              tags={["Running", "Yoga"]}
            />
            <UserCard
              name="Javier Morales"
              handle="javi_m_baller"
              rating={4.8}
              bio="Community organizer hosting neighborhood scrimmages every Thursday night."
              location="Little Italy"
              eventsCount={27}
              tags={["Soccer", "Basketball"]}
            />
            <UserCard
              name="Mei Tan"
              handle="meitan_spin"
              rating={4.9}
              bio="Table tennis champion who loves coaching newcomers and late-night rallies."
              location="Chinatown"
              eventsCount={14}
              tags={["Table Tennis", "Badminton"]}
              isFollowing
            />
            <UserCard
              name="Liam O'Connor"
              handle="liamocycle"
              rating={4.3}
              bio="Cyclist chasing sunrises and organizing endurance rides across the city."
              location="Waterfront"
              eventsCount={11}
              tags={["Cycling", "Rowing"]}
            />
            <UserCard
              name="Isabella Rossi"
              handle="isarossi_flow"
              rating={4.7}
              bio="Pilates instructor building a community around movement, balance, and breath."
              location="Uptown"
              eventsCount={16}
              tags={["Pilates", "Swimming"]}
            />
            <UserCard
              name="Noah Johnson"
              handle="noahj_altitude"
              rating={4.2}
              bio="Ultimate frisbee captain who cross-trains with weekend climbing sessions."
              location="North Market"
              eventsCount={13}
              tags={["Ultimate Frisbee", "Climbing"]}
            />
            <UserCard
              name="Hana Kim"
              handle="hanak_strike"
              rating={4.6}
              bio="Taekwondo black belt sharing drills and high-intensity interval workouts."
              location="Koreatown"
              eventsCount={19}
              tags={["Taekwondo", "HIIT"]}
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
            eventsCount={p.eventsCount ?? 0}
            tags={p.sports}
          />
        ))}
      </div>
    </WebLayout>
  );
}
