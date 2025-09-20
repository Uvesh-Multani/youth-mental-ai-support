import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

function buildSystemPrompt() {
  return `You are Bloom, an empathetic mental wellness assistant for youth in India.
- Be warm, supportive, and judgment‑free. Use simple, clear language.
- Reflect feelings, validate experiences, and suggest small, concrete next steps.
- Stay strictly on-topic: mental health, emotions, coping, study stress, family/peer issues, sleep, self‑care, mindfulness, grounding, help‑seeking.
- If asked for topics outside mental wellness (e.g., coding help, politics, finance, adult content), gently refuse and steer back to wellbeing.
- Avoid medical diagnoses, legal or professional claims. Encourage reaching out to trusted adults or professionals when appropriate.
- If the user indicates imminent risk (suicide, self‑harm), advise immediate help (dial 112 in India) and mention KIRAN 24x7 helpline: 1800-599-0019.
- Keep replies concise (2–6 sentences). Prefer bullet points for steps when helpful.
- Be culturally sensitive to Indian youth (school pressure, entrance exams, family expectations, stigma).
`;
}

function appearsOffTopic(text: string) {
  const t = text.toLowerCase();
  const blocked = [
    "code", "program", "javascript", "python", "leetcode", "stocks", "crypto",
    "politics", "election", "nsfw", "adult", "explicit", "gambling",
  ];
  return blocked.some((k) => t.includes(k));
}

export async function POST(req: NextRequest) {
  try {
    // Optional: lightweight auth check via bearer header (since /chat is middleware-protected)
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      // Still allow if middleware already protects, but you can uncomment to enforce strictly
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages = [], userInput = "" } = await req.json();
    const input = String(userInput || "").slice(0, 4000);

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
    }

    if (!input.trim()) {
      return NextResponse.json({ reply: "" });
    }

    if (appearsOffTopic(input)) {
      return NextResponse.json({
        reply:
          "I'm here to support mental wellbeing. Could we focus on how you're feeling or anything weighing on you? If it helps, we can try a quick grounding exercise or talk through what's on your mind.",
      });
    }

    const historyText: string = (Array.isArray(messages) ? messages : [])
      .slice(-10)
      .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${String(m.content || "").trim()}`)
      .join("\n");

    const prompt = [buildSystemPrompt(), historyText, `User: ${input}`, "Assistant:"].filter(Boolean).join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = result?.response?.text?.() ?? "";

    const reply = text.trim() ||
      "Thank you for sharing. I'm here with you. Would you like a short grounding exercise or to unpack what's weighing on you today?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("/api/gemini error", err);
    return NextResponse.json({
      reply:
        "I'm here to listen. Let's take a slow breath together. Would you like a 30‑second box‑breathing exercise or to share a bit more about how you're feeling?",
    });
  }
}