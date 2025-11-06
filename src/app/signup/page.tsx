"use client";

import Link from "next/link";
import WebLayout from "@/components/web-layout";

export default function SignUpPlaceholder() {
  return (
    <WebLayout title="Sign Up">
      <div className="mx-auto max-w-xl space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 text-center">
        <h2 className="text-2xl font-semibold text-neutral-100">Coming Soon</h2>
        <p className="text-neutral-300">
          Account creation and profile management will live here. For now, feel free to browse and join
          games as a guest.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
        >
          View Games
        </Link>
      </div>
    </WebLayout>
  );
}
