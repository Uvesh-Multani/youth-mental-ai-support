"use client";
import Link from "next/link";
import { BookOpen, Brain, HeartHandshake, GraduationCap, PhoneCall, Headphones, Search, ArrowRight, MessageSquare } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop"
          alt="Books and headphones"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
          <span className="inline-flex items-center rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Free for ZetaZen members
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
            Wellness Resources, <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">Empowered</span> for Indian Youth
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
            Learn about mental health, coping skills, study stress, family expectations, and where to find help in India.
          </p>

          {/* CTA card inspired by the reference UI */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-card/80 p-3 shadow-[0_10px_40px_-10px_rgb(99_102_241_/_35%)] backdrop-blur">
            <div className="rounded-xl border bg-background/70 p-4 md:p-6">
              <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span className="truncate">Search topics: exam stress, anxiety, sleep, friendships…</span>
                </div>
                <Link
                  href="#resources"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 font-medium text-background shadow hover:opacity-95"
                >
                  Browse Resources
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="resources" className="mx-auto max-w-6xl px-6 py-16 grid gap-12">
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">Key Topics for Your Journey</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-primary/10 bg-card/80 p-6 shadow-sm transition hover:shadow-md hover:border-primary/20">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Understanding Feelings</h2>
              </div>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Emotions are signals, not problems. They tell us what matters.</li>
                <li>It's normal to have ups and downs—especially with exams, friendships, and family expectations.</li>
                <li>Talking helps reduce stigma. You can start with anonymous chats like Bloom.</li>
              </ul>
            </div>

            <div className="rounded-xl border border-primary/10 bg-card/80 p-6 shadow-sm transition hover:shadow-md hover:border-primary/20">
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Coping Strategies</h2>
              </div>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Box breathing: Inhale 4, hold 4, exhale 4, hold 4—repeat 4 times.</li>
                <li>Body reset: wash face, stretch for 2 minutes, sip water, short walk if safe.</li>
                <li>Study blocks: 25 minutes focus + 5 minute break (Pomodoro).</li>
                <li>Low mood days: sunlight, favorite music, small task (make bed, shower).</li>
              </ul>
            </div>

            <div className="rounded-xl border border-primary/10 bg-card/80 p-6 shadow-sm transition hover:shadow-md hover:border-primary/20">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">For Students</h2>
              </div>
              <p className="mt-2 text-muted-foreground">Exam stress is common. Create a realistic study plan, ask teachers for doubt‑clearing, and get enough sleep. You matter beyond marks.</p>
            </div>

            <div className="rounded-xl border border-primary/10 bg-card/80 p-6 shadow-sm transition hover:shadow-md hover:border-primary/20">
              <div className="flex items-center gap-3">
                <HeartHandshake className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Family & Culture</h2>
              </div>
              <p className="mt-2 text-muted-foreground">If talking to family feels hard, start small: "I'm feeling stressed and need your support." You can also speak to a counselor first and invite a family member later.</p>
            </div>
          </div>
        </section>

        <section className="bg-secondary/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <PhoneCall className="h-6 w-6 text-primary" />
            Emergency Support in India
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 bg-card">
              <strong>KIRAN Helpline</strong><br />
              <a href="tel:18005990019" className="text-primary hover:underline">1800-599-0019</a> (24/7)
            </div>
            <div className="rounded-lg border p-4 bg-card">
              <strong>iCall (TISS)</strong><br />
              <a href="tel:9152987821" className="text-primary hover:underline">9152987821</a> | <a href="https://icallhelpline.org" target="_blank" rel="noreferrer" className="text-primary hover:underline">icallhelpline.org</a>
            </div>
            <div className="rounded-lg border p-4 bg-card">
              <strong>AASRA (Suicide Prevention)</strong><br />
              <a href="tel:+919820466726" className="text-primary hover:underline">+91-9820466726</a>
            </div>
            <div className="rounded-lg border p-4 bg-card">
              <strong>Emergency</strong><br />
              Call <a href="tel:112" className="text-destructive hover:underline">112</a> for immediate danger.
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground italic">ZetaZen is not a crisis service—always reach out for urgent support.</p>
        </section>

        <div className="flex flex-wrap gap-3 justify-center mt-12">
          <Link href="/home" className="rounded-md border px-4 py-2 hover:bg-accent">Back to Dashboard</Link>
          <Link href="/journal" className="rounded-md border px-4 py-2 hover:bg-accent">Mood Journal</Link>
          <Link href="/chat" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
            <MessageSquare className="h-4 w-4" /> Talk to AI
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-gradient-to-b from-background to-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <div className="text-xl font-bold">
                <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">ZetaZen</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Your confidential partner in mental wellness.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link href="/resources" className="hover:text-foreground">Resources</Link>
              <Link href="/journal" className="hover:text-foreground">Journal</Link>
              <Link href="/chat" className="hover:text-foreground">Chat</Link>
              <Link href="/crisis" className="hover:text-foreground">Crisis</Link>
            </nav>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} ZetaZen. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}