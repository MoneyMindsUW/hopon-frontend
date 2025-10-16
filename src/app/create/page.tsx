"use client";

import WebLayout from "@/components/web-layout";
import { Api } from "@/lib/api";
import * as React from "react";

export default function CreatePage() {
  const [form, setForm] = React.useState({
    name: "",
    sport: "Basketball",
    location: "",
    event_date: "",
    max_players: 10,
    skill_level: "Intermediate",
  });
  const [result, setResult] = React.useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await Api.createEvent({
        ...form,
        event_date: form.event_date ? new Date(form.event_date).toISOString() : undefined,
      });
      setResult(`Created: ${res.event.name}`);
      setForm({ ...form, name: "", location: "", event_date: "" });
    } catch (err: any) {
      setResult(err.message ?? "Failed to create event");
    }
  }

  return (
    <WebLayout title="Create Event">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Event Name">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
            required
          />
        </Field>
        <Field label="Sport">
          <select
            value={form.sport}
            onChange={(e) => update("sport", e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
          >
            {['Basketball','Tennis','Badminton','Soccer'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
            placeholder="Venue or address"
            required
          />
        </Field>
        <Field label="Date & Time">
          <input
            type="datetime-local"
            value={form.event_date}
            onChange={(e) => update("event_date", e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
          />
        </Field>
        <Field label="Max Players">
          <input
            type="number"
            min={2}
            value={form.max_players}
            onChange={(e) => update("max_players", parseInt(e.target.value || "0", 10))}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
          />
        </Field>
        <Field label="Level">
          <select
            value={form.skill_level}
            onChange={(e) => update("skill_level", e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
          >
            {['Beginner','Intermediate','Advanced'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="submit"
          className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white"
        >
          Create
        </button>
        {result && <p className="text-center text-sm text-neutral-300">{result}</p>}
      </form>
    </WebLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-neutral-300">{label}</div>
      {children}
    </label>
  );
}
