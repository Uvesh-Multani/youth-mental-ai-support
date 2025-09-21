"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

type Mood = "happy" | "okay" | "sad" | "anxious" | "angry" | "stressed" | "lonely" | "tired";

type Entry = { mood: Mood; note?: string; ts: number };

const STORAGE_KEY = "mood_journal_entries";

export default function JournalPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.push("/login");
      return;
    }
  }, [session, sessionPending, router]);

  if (sessionPending || !session?.user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  function getAnonId() {
    try {
      let id = localStorage.getItem("anon_id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("anon_id", id);
        localStorage.setItem("bearer_token", id);
      }
      return id;
    } catch {
      return "anon";
    }
  }

  useEffect(() => {
    const anonId = getAnonId();
    (async () => {
      try {
        const res = await fetch(`/api/moods?range=30d`, {
          headers: { Authorization: `Bearer ${anonId}` },
        });
        if (!res.ok) throw new Error("Failed to load moods");
        const data: Entry[] = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Could not load your mood entries.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const counts: Record<Mood, number> = {
      happy: 0,
      okay: 0,
      sad: 0,
      anxious: 0,
      angry: 0,
      stressed: 0,
      lonely: 0,
      tired: 0,
    };
    for (const e of entries) counts[e.mood]++;
    const max = Math.max(1, ...Object.values(counts));
    return { counts, max };
  }, [entries]);

  async function clearAll() {
    const anonId = getAnonId();
    try {
      const res = await fetch("/api/moods", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${anonId}` },
      });
      if (res.ok) setEntries([]);
    } catch {}
  }

  return (
    <div className="min-h-screen mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Mood Journal</h1>
      <p className="mt-2 text-muted-foreground">Anonymous with a random ID. Your entries are private to your session.</p>

      <section className="mt-8 rounded-lg border p-5">
        <h2 className="text-xl font-semibold">Mood overview</h2>
        {loading && <div className="mt-2 text-sm text-muted-foreground">Loading…</div>}
        {error && <div className="mt-2 text-sm text-destructive">{error}</div>}
        <div className="mt-4 space-y-2">
          {(Object.keys(stats.counts) as Mood[]).map((mood) => (
            <div key={mood} className="flex items-center gap-3">
              <div className="w-24 text-sm capitalize text-muted-foreground">{mood}</div>
              <div className="h-3 flex-1 rounded bg-secondary">
                <div
                  className="h-3 rounded bg-primary"
                  style={{ width: `${(stats.counts[mood] / stats.max) * 100}%` }}
                />
              </div>
              <div className="w-10 text-right text-sm">{stats.counts[mood]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent entries</h2>
          <button onClick={clearAll} className="rounded-md border px-3 py-1.5 text-sm">Clear all</button>
        </div>
        <ul className="mt-4 divide-y">
          {entries.length === 0 && !loading && (
            <li className="py-6 text-muted-foreground">No entries yet. Start by chatting or quick‑logging a mood on the home page.</li>
          )}
          {entries
            .slice()
            .reverse()
            .slice(0, 30)
            .map((e, idx) => (
              <li key={idx} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium capitalize">{e.mood}</div>
                  <div className="text-sm text-muted-foreground">{new Date(e.ts).toLocaleString()}</div>
                </div>
                {e.note && <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>}
              </li>
            ))}
        </ul>
      </section>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-md border px-4 py-2">Back home</Link>
        <Link href="/resources" className="rounded-md border px-4 py-2">Resources</Link>
        <Link href="/crisis" className="rounded-md border px-4 py-2">Crisis support</Link>
      </div>
    </div>
  );
}