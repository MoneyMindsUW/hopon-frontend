"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

const nav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

export default function TopNav() {
  const pathname = usePathname();
  const { status, user, logout } = useAuth();
  const isAuthenticated = status === "authenticated" && !!user;

  return (
    <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        <Link href="/home" className="text-xl font-semibold">
          HopOn
        </Link>
        <div className="flex items-center gap-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                  active
                    ? "bg-neutral-900 text-red-400"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="ml-2 flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-sm text-neutral-200 md:flex">
                  <div className="flex size-6 items-center justify-center rounded-full bg-red-500/80 text-xs font-semibold uppercase text-white">
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.username}</span>
                </div>
                <button
                  onClick={() => logout().catch(() => undefined)}
                  className="rounded-xl border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-red-400 hover:text-red-300"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/signup"
                className="rounded-xl border border-red-500/40 px-3 py-1.5 text-sm font-semibold text-red-400 hover:border-red-400 hover:text-red-300"
              >
                Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
