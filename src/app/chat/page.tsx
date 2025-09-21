"use client";
import ChatAssistant from "@/components/ChatAssistant";
import { Shield, MessageCircle, Zap, Heart } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-50/20 to-purple-50/20">
      {/* Hero/Welcome */}
      <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-4">
            Chat with ZetaZen
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your confidential space to share feelings, get gentle support, and take small steps forward. I'm here—no judgment, just listening.
          </p>
        </div>

        {/* Quick Guidelines */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-8">
          <div className="rounded-xl border bg-card/80 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">100% Private</h3>
              <p className="text-sm text-muted-foreground">Chats stay between us. Delete anytime. No one sees your words.</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card/80 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <MessageCircle className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Empathetic Listening</h3>
              <p className="text-sm text-muted-foreground">I'll reflect what you feel and suggest tiny, doable next steps tailored for you.</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card/80 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <Zap className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Quick & Simple</h3>
              <p className="text-sm text-muted-foreground">Start chatting now. Use voice if easier, or type your thoughts.</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card/80 p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4">
            <Heart className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Crisis Support</h3>
              <p className="text-sm text-muted-foreground">If things feel urgent, I'll guide you to immediate help like KIRAN helpline.</p>
            </div>
          </div>
        </div>

        {/* Chat Component */}
        <div className="max-w-4xl mx-auto">
          <ChatAssistant />
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Not ready to chat? Explore <Link href="/journal" className="text-primary hover:underline">Mood Journal</Link> or{" "}
            <Link href="/resources" className="text-primary hover:underline">Resources</Link>.
          </p>
          <Link 
            href="/crisis" 
            className="inline-flex items-center gap-2 rounded-full bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            Need Urgent Help? Crisis Resources
          </Link>
        </div>
      </section>
    </div>
  );
}