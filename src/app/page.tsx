"use client";
import Link from "next/link";
import { ShieldAlert, MessageSquareHeart, NotebookPen, HeartHandshake, GraduationCap, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/home");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

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
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center gap-3">
            <Link href="/register" className="w-full sm:w-auto rounded-lg bg-primary text-primary-foreground px-6 py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Get Started – Free</Link>
            <Link href="/login" className="w-full sm:w-auto rounded-lg border-2 border-primary px-6 py-4 font-medium hover:bg-primary/5 transition-colors">Already have an account?</Link>
            <Link href="/crisis" className="rounded-md border px-5 py-3">Immediate Crisis Support</Link>
            <div className="ml-2 hidden w-px self-stretch bg-border sm:block" />
            <p className="text-sm text-muted-foreground sm:text-base">
              Login to access personalized chat and journal. Your data stays private and secure.
            </p>
          </div>

          {/* Trust/Stats */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-background/70 p-6 backdrop-blur hover:shadow-md transition-shadow">
              <p className="text-2xl font-semibold">100% private</p>
              <p className="text-sm text-muted-foreground">We never share chats. You control what you save.</p>
            </div>
            <div className="rounded-xl border bg-background/70 p-6 backdrop-blur hover:shadow-md transition-shadow">
              <p className="text-2xl font-semibold">India‑aware</p>
              <p className="text-sm text-muted-foreground">Culturally sensitive guidance for exams, family, and friendships.</p>
            </div>
            <div className="rounded-xl border bg-background/70 p-6 backdrop-blur hover:shadow-md transition-shadow">
              <p className="text-2xl font-semibold">Crisis ready</p>
              <p className="text-sm text-muted-foreground">Detects urgent risk and points to immediate help (112, KIRAN).</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">What ZetaZen offers you</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquareHeart className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Empathetic AI Chat</h3>
            </div>
            <p className="text-muted-foreground">Judgement‑free space to vent, reflect, and get gentle, actionable suggestions.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <NotebookPen className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Mood Journal</h3>
            </div>
            <p className="text-muted-foreground">Log feelings in seconds and notice patterns that actually matter.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Crisis Detection</h3>
            </div>
            <p className="text-muted-foreground">Flags risk phrases and guides you to immediate help if needed.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <HeartHandshake className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Self‑care Micro‑steps</h3>
            </div>
            <p className="text-muted-foreground">Breathing, grounding, and tiny actions you can do right now.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Study & Exam Support</h3>
            </div>
            <p className="text-muted-foreground">Plan realistic study blocks and reduce stress around marks.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Culturally Aware Resources</h3>
            </div>
            <p className="text-muted-foreground">Guides for talking with family, friends, and teachers in India.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 pb-12 md:pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">How it helps — in 3 simple steps</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <p className="text-sm font-medium text-muted-foreground">Step 1</p>
            <h3 className="mt-2 font-semibold">Share what you're feeling</h3>
            <p className="text-muted-foreground">Type a few lines — exams, friendships, family pressure, anything.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <p className="text-sm font-medium text-muted-foreground">Step 2</p>
            <h3 className="mt-2 font-semibold">Get a gentle, relevant reply</h3>
            <p className="text-muted-foreground">ZetaZen reflects your feelings and suggests one tiny next step.</p>
          </div>
          <div className="rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
            <p className="text-sm font-medium text-muted-foreground">Step 3</p>
            <h3 className="mt-2 font-semibold">Track your mood</h3>
            <p className="text-muted-foreground">Quick‑log emotions and notice patterns that help you grow.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
          <Link href="/register" className="w-full sm:w-auto rounded-lg bg-primary text-primary-foreground px-6 py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-300">Start Your Journey</Link>
          <Link href="/resources" className="w-full sm:w-auto rounded-lg border px-6 py-4 font-medium hover:bg-accent transition-colors">Learn More</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-6 py-16 bg-gradient-to-b from-background to-secondary/10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What young users are saying</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border p-6 bg-card/80 backdrop-blur hover:shadow-lg transition-all">
            <p className="text-lg leading-relaxed italic mb-4">"ZetaZen gets the pressure of JEE prep and family expectations. The AI actually listens without judging—it's helped me open up more."</p>
            <p className="text-sm font-medium text-primary">— Aarav, 17, Mumbai</p>
          </div>
          <div className="rounded-2xl border p-6 bg-card/80 backdrop-blur hover:shadow-lg transition-all">
            <p className="text-lg leading-relaxed italic mb-4">"During a tough time with friends, the mood journal showed me patterns I didn't notice. Plus, the breathing tips are simple but work."</p>
            <p className="text-sm font-medium text-primary">— Priya, 16, Delhi</p>
          </div>
          <div className="rounded-2xl border p-6 bg-card/80 backdrop-blur hover:shadow-lg transition-all">
            <p className="text-lg leading-relaxed italic mb-4">"I was scared to talk about anxiety, but ZetaZen made it easy. The crisis resources gave me numbers I actually called."</p>
            <p className="text-sm font-medium text-primary">— Karan, 18, Bangalore</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-2xl border p-8 bg-secondary/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <p className="text-xl md:text-2xl leading-relaxed italic">
            "I used to keep everything inside during boards. ZetaZen helped me name what I was feeling
            and take small steps like short walks and box breathing. I feel lighter and more in control."
          </p>
          <p className="mt-6 text-sm text-muted-foreground font-medium">— Class 12 student, Pune</p>
        </div>
      </section>
    </div>
  );
}