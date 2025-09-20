"use client";
import ChatAssistant from "@/components/ChatAssistant";

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Chat with Bloom</h1>
      <p className="text-muted-foreground mb-6">This is a confidential, judgement‑free space. I'm here to listen and support you.</p>
      <ChatAssistant />
    </div>
  );
}