"use client";
import Link from "next/link";

export default function CrisisPage() {
  return (
    <div className="min-h-screen mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Crisis Support</h1>
      <p className="mt-2 text-muted-foreground">If you or someone you know is in immediate danger, call 112 now.</p>

      <section className="mt-6 rounded-lg border p-5 bg-destructive/5">
        <h2 className="text-xl font-semibold">India – 24x7 Helplines</h2>
        <ul className="mt-3 space-y-2">
          <li>
            KIRAN (National Helpline): <a className="underline" href="tel:18005990019">1800‑599‑0019</a>
          </li>
          <li>
            iCall (TISS): <a className="underline" href="tel:9152987821">9152987821</a>
          </li>
          <li>
            AASRA (Suicide Prevention): <a className="underline" href="tel:+919820466726">+91‑9820466726</a>
          </li>
        </ul>
      </section>

      <section className="mt-8 rounded-lg border p-5">
        <h2 className="text-xl font-semibold">Right now: grounding</h2>
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-muted-foreground">
          <li>Look around: name 5 things you can see.</li>
          <li>Touch 4 things: notice texture and temperature.</li>
          <li>Listen for 3 sounds around you.</li>
          <li>Take 2 deep breaths—inhale 4, exhale 6.</li>
          <li>Say 1 kind thing to yourself: “I deserve care.”</li>
        </ol>
      </section>

      <section className="mt-8 rounded-lg border p-5">
        <h2 className="text-xl font-semibold">Safety steps</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground">
          <li>If you have a plan to hurt yourself, consider removing harmful items from reach and stay with someone you trust.</li>
          <li>Text or call a trusted friend, family member, teacher, or counselor.</li>
          <li>Visit the nearest hospital emergency department if needed.</li>
        </ul>
      </section>

      <div className="mt-8 flex gap-3">
        <Link className="rounded-md border px-4 py-2" href="/">Back home</Link>
        <Link className="rounded-md border px-4 py-2" href="/resources">Resources</Link>
      </div>
    </div>
  );
}