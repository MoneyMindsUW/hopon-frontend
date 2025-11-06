"use client";

import Link from "next/link";

const primaryLinks = [
  { href: "/signup", label: "Sign Up" },
  { href: "/discover", label: "View Games as Guest" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="mx-auto max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Welcome to HopOn</h1>
        <p className="text-neutral-400">
          Find pickup games nearby, connect with players, and keep your schedule in sync. Choose how you
          want to get started below.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold text-neutral-100 transition hover:border-red-400 hover:text-red-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
