"use client";

import * as React from "react";
import TopNav from "@/components/top-nav";

export default function WebLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <TopNav />
      <main className="mx-auto max-w-screen-2xl px-6 py-6">
        {title && <h1 className="mb-4 text-3xl font-semibold">{title}</h1>}
        {children}
      </main>
    </div>
  );
}

