"use client";

import { MapPin, CalendarDays, Star, Check } from "lucide-react";

export type UserCardProps = {
  id?: number | string;
  name: string;
  handle?: string;
  bio?: string;
  location?: string;
  eventsCount?: number;
  tags?: string[];
  rating?: number;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
};

export function UserCard({
  name,
  handle,
  bio,
  location,
  eventsCount,
  tags = [],
  rating,
  isFollowing,
  onToggleFollow,
}: UserCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-neutral-800" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="truncate text-lg font-semibold">{name}</p>
              {handle && (
                <p className="text-neutral-400">@{handle.replace(/^@/, "")}</p>
              )}
            </div>
            <button
              onClick={onToggleFollow}
              className={
                isFollowing
                  ? "rounded-xl border border-neutral-700 px-4 py-1.5 text-sm font-medium text-neutral-200"
                  : "rounded-xl border border-red-500/40 px-4 py-1.5 text-sm font-semibold text-red-400"
              }
            >
              {isFollowing ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="size-4" /> Following
                </span>
              ) : (
                "Follow"
              )}
            </button>
          </div>

          {bio && <p className="mt-3 text-neutral-300">{bio}</p>}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-300">
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 opacity-70" /> {location}
              </div>
            )}
            {typeof eventsCount !== "undefined" && (
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 opacity-70" /> {eventsCount} events
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-red-400">
            {typeof rating !== "undefined" && (
              <span className="inline-flex items-center gap-1 text-sm">
                <Star className="size-4 fill-red-500 text-red-500" /> {rating}
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

