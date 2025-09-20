"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
};

type Mood =
  | "happy"
  | "okay"
  | "sad"
  | "anxious"
  | "angry"
  | "stressed"
  | "lonely"
  | "tired";

const moodKeywords: Record<Mood, string[]> = {
  happy: ["happy", "great", "good", "excited", "proud", "grateful"],
  okay: ["okay", "fine", "alright", "neutral"],
  sad: ["sad", "down", "depressed", "cry", "crying", "empty"],
  anxious: ["anxious", "anxiety", "worried", "panic", "nervous", "scared"],
  angry: ["angry", "mad", "furious", "rage", "annoyed", "irritated"],
  stressed: ["stressed", "overwhelmed", "pressure", "burnt", "burned out", "burnout"],
  lonely: ["lonely", "alone", "isolated"],
  tired: ["tired", "exhausted", "sleepy", "drained", "fatigued"],
};

const crisisKeywords = [
  "suicide",
  "kill myself",
  "end my life",
  "self-harm",
  "self harm",
  "cutting",
  "overdose",
  "harm myself",
];

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

async function upsertSession() {
  const anonId = getAnonId();
  try {
    await fetch("/api/sessions/upsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonId}`,
      },
      body: JSON.stringify({ anon_id: anonId }),
    });
  } catch {}
}

async function saveMoodEntryAPI(entry: { mood: Mood; note?: string; ts?: number }) {
  const anonId = getAnonId();
  try {
    await fetch("/api/moods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonId}`,
      },
      body: JSON.stringify({ mood: entry.mood, note: entry.note ?? "", ts: entry.ts }),
    });
  } catch {}
}

function detectMood(text: string): Mood | null {
  const lower = text.toLowerCase();
  for (const mood of Object.keys(moodKeywords) as Mood[]) {
    if (moodKeywords[mood].some((k) => lower.includes(k))) return mood;
  }
  return null;
}

function containsCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return crisisKeywords.some((k) => lower.includes(k));
}

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! I'm here to listen—no judgement, no sign‑up. How are you feeling right now?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [crisis, setCrisis] = useState(false);
  const [latestMood, setLatestMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function refreshLatestMood() {
    const anonId = getAnonId();
    try {
      const res = await fetch("/api/moods?range=7d", {
        headers: { Authorization: `Bearer ${anonId}` },
      });
      if (!res.ok) return;
      const data: { mood: Mood; ts: number }[] = await res.json();
      if (Array.isArray(data) && data.length) setLatestMood(data[0].mood);
    } catch {}
  }

  async function loadMessages() {
    const anonId = getAnonId();
    try {
      setLoading(true);
      const res = await fetch("/api/messages?limit=200", {
        headers: { Authorization: `Bearer ${anonId}` },
      });
      if (!res.ok) return;
      const rows: { id: number; role: Role; content: string; timestamp: number }[] = await res.json();
      if (rows?.length) {
        const mapped: Message[] = rows.map((r) => ({
          id: String(r.id),
          role: r.role,
          content: r.content,
          timestamp: r.timestamp,
        }));
        setMessages(mapped);
      }
    } catch (e) {
      setError("Could not load previous messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    upsertSession();
    loadMessages();
    refreshLatestMood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    const now = Date.now();
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, timestamp: now };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // persist user message
    const anonId = getAnonId();
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonId}` },
      body: JSON.stringify({ role: "user", content: text, timestamp: now }),
    }).catch(() => {});

    // Crisis detection and mood logging first
    const isCrisis = containsCrisis(text);
    const mood = detectMood(text);
    if (mood) {
      saveMoodEntryAPI({ mood, note: text });
      refreshLatestMood();
    }

    if (isCrisis) {
      setCrisis(true);
      const botNow = Date.now();
      const crisisReply =
        "I'm really glad you told me. Your safety matters most. If you're in immediate danger, call 112 now. You can also reach India's 24x7 KIRAN helpline at 1800-599-0019. I'm with you—let's take one small step together. Would grounding help? Name 5 things you can see, 4 you can touch, 3 you can hear. You can also tap Crisis Support below.";
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: crisisReply,
        timestamp: botNow,
      };
      setMessages((m) => [...m, botMsg]);
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonId}` },
        body: JSON.stringify({ role: "assistant", content: crisisReply, timestamp: botNow }),
      }).catch(() => {});
      return;
    }

    // Call Gemini API for empathetic reply
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content })).slice(-10);
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonId}` },
        body: JSON.stringify({ messages: history, userInput: text }),
      });
      const data = await res.json();
      const replyText: string = res.ok && typeof data?.reply === "string" && data.reply.trim()
        ? data.reply.trim()
        : "Thank you for sharing. I'm here with you. Would you like a small grounding exercise, or to talk about what's weighing on you today?";

      const botNow = Date.now();
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyText,
        timestamp: botNow,
      };
      setMessages((m) => [...m, botMsg]);
      // persist assistant message
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonId}` },
        body: JSON.stringify({ role: "assistant", content: replyText, timestamp: botNow }),
      }).catch(() => {});
    } catch (e) {
      const botNow = Date.now();
      const fallback =
        "I'm here to listen. Let's take a breath together. Would you like a 30-second box breathing or to share a bit more about what's on your mind?";
      const botMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: fallback, timestamp: botNow };
      setMessages((m) => [...m, botMsg]);
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonId}` },
        body: JSON.stringify({ role: "assistant", content: fallback, timestamp: botNow }),
      }).catch(() => {});
    } finally {
      setLoading(false);
    }
  }

  function quickLog(mood: Mood) {
    saveMoodEntryAPI({ mood });
    refreshLatestMood();
    const botMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Noted. Logged a ${mood} moment. I'm here if you'd like to talk about it.`,
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, botMsg]);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Anonymous with a random ID. No personal info required.
        </div>
        {latestMood && (
          <div className="text-sm px-2 py-1 rounded border bg-secondary/60">
            Latest mood: <span className="font-medium capitalize">{latestMood}</span>
          </div>
        )}
      </div>

      {crisis && (
        <div className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
          If you're in immediate danger, call <span className="font-semibold">112</span>. In India, KIRAN: <a className="underline" href="tel:18005990019">1800-599-0019</a>. See <Link className="underline" href="/crisis">Crisis Support</Link>.
        </div>
      )}

      <div className="h-[420px] w-full overflow-y-auto rounded-lg border bg-card p-3 space-y-3">
        {loading && <div className="text-sm text-muted-foreground">Loading previous messages…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg bg-primary text-primary-foreground px-3 py-2 shadow"
                : "mr-auto max-w-[85%] rounded-lg bg-secondary px-3 py-2 shadow"
            }
          >
            <div className="text-xs opacity-70 mb-1">{m.role === "user" ? "You" : "Bloom"} • {formatTime(m.timestamp)}</div>
            <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="mt-3 grid gap-2">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type how you're feeling…"
            className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2"
          />
          <button onClick={handleSend} className="rounded-md bg-primary text-primary-foreground px-4 py-2 disabled:opacity-60" disabled={!input.trim()}>
            Send
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Quick log:</span>
          {(
            [
              ["happy", "😄"],
              ["okay", "🙂"],
              ["stressed", "😵‍💫"],
              ["anxious", "😰"],
              ["sad", "😔"],
              ["angry", "😠"],
              ["lonely", "🫥"],
              ["tired", "🥱"],
            ] as [Mood, string][]
          ).map(([m, icon]) => (
            <button
              key={m}
              onClick={() => quickLog(m)}
              className="rounded-full border px-3 py-1 hover:bg-secondary"
              aria-label={`Log mood ${m}`}
            >
              <span className="mr-1">{icon}</span>
              <span className="capitalize">{m}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/journal" className="underline">View mood journal</Link>
          <Link href="/resources" className="underline">Explore resources</Link>
          <Link href="/crisis" className="underline">Crisis support</Link>
        </div>
      </div>
    </div>
  );
}