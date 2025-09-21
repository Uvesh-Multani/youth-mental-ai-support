"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MessageSquare, BookOpen, FileText, User, HeartHandshake } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Header */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-2">
            Welcome back, {session.user.name || "there"}!
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Your personal space for mental wellness. Start with what feels right today.
          </p>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Chat Card */}
          <Link href="/chat" className="group rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="h-6 w-6 bg-primary/10 p-2 rounded-lg text-primary" />
              <h3 className="font-semibold text-foreground">AI Companion</h3>
            </div>
            <p className="text-muted-foreground">Your 24/7 empathetic listener for any feeling.</p>
          </Link>

          {/* Journal Card */}
          <Link href="/journal" className="group rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-6 w-6 bg-green-500/10 p-2 rounded-lg text-green-600" />
              <h3 className="font-semibold text-foreground">Mood Tracker</h3>
            </div>
            <p className="text-muted-foreground">Log emotions and uncover helpful patterns.</p>
          </Link>

          {/* Resources Card */}
          <Link href="/resources" className="group rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 bg-blue-500/10 p-2 rounded-lg text-blue-600" />
              <h3 className="font-semibold text-foreground">Learning Hub</h3>
            </div>
            <p className="text-muted-foreground">Curated guides tailored for Indian youth.</p>
          </Link>

          {/* Profile Card */}
          <Link href="/profile" className="group rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-6 w-6 bg-purple-500/10 p-2 rounded-lg text-purple-600" />
              <h3 className="font-semibold text-foreground">Your Profile</h3>
            </div>
            <p className="text-muted-foreground">Personalize your experience and settings.</p>
          </Link>
        </div>

        {/* Quick Stats or Tips - Optional */}
        <section className="mt-12 bg-secondary/20 rounded-2xl p-6">
          <h4 className="text-xl font-semibold mb-4">Your Recent Activity</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 bg-card">
              <p className="text-sm text-muted-foreground mb-1">Last Chat</p>
              <p className="font-medium">You discussed exam stress – great start!</p>
            </div>
            <div className="rounded-lg border p-4 bg-card">
              <p className="text-sm text-muted-foreground mb-1">Mood Streak</p>
              <p className="font-medium text-green-600">3 days consistent – You're building habits!</p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-gradient-to-r from-green-500/5 p-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
              <HeartHandshake className="h-4 w-4" />
              Daily Tip
            </h4>
            <p className="text-sm">Practice gratitude: Name 3 things you're thankful for today.</p>
          </div>
          <div className="rounded-xl border bg-primary/10 p-6">
            <h4 className="font-semibold mb-2 text-primary">Progress Overview</h4>
            <p className="text-primary/80 text-sm">You've engaged 7 times this week. Keep nurturing your wellness!</p>
          </div>
        </div>
      </section>
    </div>
  );
}