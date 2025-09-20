"use client";
import Link from "next/link";
import { ShieldAlert, MessageSquareHeart, NotebookPen, HeartHandshake, GraduationCap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1600&auto=format&fit=crop"
          alt="Teens supporting each other"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,_rgba(99,102,241,0.25)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Made for Indian youth — private & stigma‑free</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
            ZetaZen: Confidential support for your feelings
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            An empathetic AI that listens, helps you name what you feel, suggests simple next steps, and connects you with the right resources.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/chat" className="rounded-md bg-primary text-primary-foreground px-5 py-3">Start chat</Link>
            <Link href="/register" className="rounded-md border px-5 py-3">Create account</Link>
            <Link href="/crisis" className="rounded-md border px-5 py-3">Crisis support</Link>
            <div className="ml-2 hidden w-px self-stretch bg-border sm:block" />
            <p className="text-sm text-muted-foreground">
              Login first to access chat. Your data stays private.
            </p>
          </div>

          {/* Trust/Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-background/70 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">100% private</p>
              <p className="text-sm text-muted-foreground">We never share chats. You control what you save.</p>
            </div>
            <div className="rounded-lg border bg-background/70 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">India‑aware</p>
              <p className="text-sm text-muted-foreground">Culturally sensitive guidance for exams, family, and friendships.</p>
            </div>
            <div className="rounded-lg border bg-background/70 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Crisis ready</p>
              <p className="text-sm text-muted-foreground">Detects urgent risk and points to immediate help (112, KIRAN).</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">What you can do with Bloom</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Empathetic AI chat</h3>
            </div>
            <p className="mt-2 text-muted-foreground">Judgement‑free space to vent, reflect, and get gentle, actionable suggestions.</p>
          </div>
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <NotebookPen className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Mood journal</h3>
            </div>
            <p className="mt-2 text-muted-foreground">Log feelings in seconds and notice patterns that actually matter.</p>
          </div>
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Crisis detection</h3>
            </div>
            <p className="mt-2 text-muted-foreground">Flags risk phrases and guides you to immediate help if needed.</p>
          </div>
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Self‑care micro‑steps</h3>
            </div>
            <p className="mt-2 text-muted-foreground">Breathing, grounding, and tiny actions you can do right now.</p>
          </div>
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Study & exam support</h3>
            </div>
            <p className="mt-2 text-muted-foreground">Plan realistic study blocks and reduce stress around marks.</p>
          </div>
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Culturally aware resources</h3>
            </div>
            <p className="mt-2 text-muted-foreground">Guides for talking with family, friends, and teachers in India.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 pb-12 md:pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold">How it helps — in 3 simple steps</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-5">
            <p className="text-sm font-medium text-muted-foreground">Step 1</p>
            <h3 className="mt-1 font-semibold">Share what you're feeling</h3>
            <p className="mt-2 text-muted-foreground">Type a few lines — exams, friendships, family pressure, anything.</p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="text-sm font-medium text-muted-foreground">Step 2</p>
            <h3 className="mt-1 font-semibold">Get a gentle, relevant reply</h3>
            <p className="mt-2 text-muted-foreground">Bloom reflects your feelings and suggests one tiny next step.</p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="text-sm font-medium text-muted-foreground">Step 3</p>
            <h3 className="mt-1 font-semibold">Track your mood</h3>
            <p className="mt-2 text-muted-foreground">Quick‑log emotions and notice patterns that help you grow.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/chat" className="rounded-md bg-primary text-primary-foreground px-5 py-3">Open chat</Link>
          <Link href="/resources" className="rounded-md border px-5 py-3">Explore resources</Link>
          <Link href="/journal" className="rounded-md border px-5 py-3">Open mood journal</Link>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-xl border p-6 md:p-8 bg-secondary/40">
          <p className="text-lg md:text-xl leading-relaxed">
            "I used to keep everything inside during boards. Bloom helped me name what I was feeling
            and take small steps like short walks and box breathing. I feel lighter and more in control."
          </p>
          <p className="mt-4 text-sm text-muted-foreground">— Class 12 student, Pune</p>
        </div>
      </section>
    </div>
  );
}