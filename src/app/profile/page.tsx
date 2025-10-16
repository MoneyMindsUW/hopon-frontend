"use client";

import WebLayout from "@/components/web-layout";

export default function ProfilePage() {
  return (
    <WebLayout title="Profile">
      <div className="mt-2 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-neutral-800" />
          <div>
            <p className="text-xl font-semibold">You</p>
            <p className="text-neutral-400">@you</p>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-neutral-300">Edit your profile details here.</p>
        </div>
      </div>
    </WebLayout>
  );
}
