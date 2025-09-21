use client
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MessageSquare, BookOpen, FileText, User } from "lucide-react";

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Chat Card */}
          <Link href="/chat" className="group rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">AI Chat</h3>
            </div>
            <p className="text-muted-foreground text-sm">Talk to your empathetic AI companion</p>
          </Link>

          {/* Journal Card */}
          <Link href="/journal" className="group rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Mood Journal</h3>
            </div>
            <p className="text-muted-foreground text-sm">Track your feelings and see patterns</p>
          </Link>

          {/* Resources Card */}
          <Link href="/resources" className="group rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Resources</h3>
            </div>
            <p className="text-muted-foreground text-sm">Guides, tips, and support info</p>
          </Link>

          {/* Profile Card */}
          <Link href="/profile" className="group rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Profile</h3>
            </div>
            <p className="text-muted-foreground text-sm">Manage your account and settings</p>
          </Link>
        </div>

        {/* Quick Stats or Tips - Optional */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <h4 className="font-semibold mb-2">Quick Tip</h4>
            <p className="text-muted-foreground text-sm">Take a deep breath: In for 4, hold for 4, out for 4.</p>
          </div>
          <div className="rounded-xl border bg-primary/5 p-6">
            <h4 className="font-semibold mb-2 text-primary">Your Progress</h4>
            <p className="text-primary/80 text-sm">You've logged 5 moods this week. Keep going!</p>
          </div>
        </div>
      </section>
    </div>
  );
}