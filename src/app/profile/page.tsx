"use client";

import WebLayout from "@/components/web-layout";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const { status, user, loginWithGoogle, logout } = useAuth();
  const isAuthenticated = status === "authenticated";

  return (
    <WebLayout title="Profile">
      {isAuthenticated && user ? (
        <div className="mt-2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/80 text-2xl font-semibold uppercase text-white">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-semibold">{user.username}</p>
              <p className="text-neutral-400">{user.email}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-neutral-300">
              Manage your profile information and preferences. More customization options are coming soon.
            </p>
          </div>
          <button
            onClick={() => logout().catch(() => undefined)}
            className="rounded-xl border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-red-400 hover:text-red-300"
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-center">
          <h2 className="text-xl font-semibold text-neutral-100">Create a profile to personalize HopOn</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to manage your bio, view followers, and keep your pickup schedule in sync across devices.
          </p>
          <button
            onClick={() => loginWithGoogle().catch(() => undefined)}
            className="mt-4 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 hover:border-red-400 hover:text-red-300"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </WebLayout>
  );
}
