"use client";

import { MapPin, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type EventCardProps = {
  id?: number | string;
  title: string;
  sport: string;
  level?: string;
  location: string;
  datetime?: string; // ISO string
  playersText: string; // e.g. "6/10 players"
  distanceKm?: number | null;
  hostName?: string;
  onJoin?: () => void;
  statusColorClass?: string; // optional top-right color
  rightActionLabel?: string;
  onRightActionClick?: () => void;
};

export function EventCard({
  title,
  sport,
  level,
  location,
  datetime,
  playersText,
  distanceKm,
  hostName,
  onJoin,
  rightActionLabel = "Join",
  onRightActionClick,
}: EventCardProps) {
  const distance =
    typeof distanceKm === "number" ? `${distanceKm.toFixed(1)} km` : undefined;
  const dateDisplay = datetime
    ? new Date(datetime).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : undefined;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-neutral-800" />
        <div className="flex-1">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          <p className="mt-1 text-neutral-300">
            {sport}
            {level ? <span> • {level}</span> : null}
          </p>
          <div className="mt-4 space-y-2 text-neutral-300">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 opacity-70" />{" "}
              <span>
                {location}
                {distance ? ` (${distance})` : ""}
              </span>
            </p>
            {dateDisplay && (
              <p className="flex items-center gap-2">
                <Clock className="size-4 opacity-70" /> {dateDisplay}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Users className="size-4 opacity-70" /> {playersText}
            </p>
          </div>

          {hostName && (
            <p className="mt-4 text-sm text-neutral-400">by {hostName}</p>
          )}
        </div>
        <div className="flex min-w-[5.5rem] flex-col items-end gap-2">
          <button
            onClick={onRightActionClick ?? onJoin}
            className={cn(
              "rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white",
              "hover:bg-red-400 active:scale-[0.98]"
            )}
          >
            {rightActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
