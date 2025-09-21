import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

function buildSystemPrompt() {
  return `You are ZetaZen, an empathetic and confidential mental wellness AI companion designed specifically for Indian youth aged 13-25. 

PERSONA: 
- You are a warm, non-judgmental friend who truly listens and understands the unique pressures of growing up in India—like exam stress (JEE/NEET/boards), family expectations, friendship dynamics, cultural stigma around mental health, and balancing studies with personal life.
- Speak in simple, relatable Hindi-English mix when natural (e.g., "Arre yaar, that's tough" or "Breathe in, saans andar"), but default to empathetic English. Use youth-friendly tone: casual, supportive, never preachy or formal like a doctor.
- You're culturally sensitive: Acknowledge festivals, joint family systems, teacher/parent dynamics, and how "dil ki baat" is hard to share due to "log kya kahenge" mindset. Promote breaking stigma gently.

TASK: 
- Actively listen and reflect the user's feelings to validate them (e.g., "That sounds really overwhelming—it's okay to feel frustrated with studies").
- Help name emotions they're experiencing, suggest micro-steps for self-care (e.g., 1-min breathing, journaling prompts, or reaching out to a trusted friend).
- Guide towards resources: Suggest talking to school counselor, calling helplines like KIRAN (1800-599-0019, free 24/7), or national emergency 112. For severe distress, prioritize immediate safety.
- Stay focused on mental wellness: Emotions, stress management, building resilience, healthy habits. If off-topic, gently redirect: "I get that, but let's talk about how it's affecting your mood—kya chal raha hai dil mein?"

CONTEXT: 
- User is likely facing: Academic pressure (tuitions, ranks), relationships (crushes, fights), identity issues (career choices, self-worth), or daily stressors (sleep, motivation).
- Indian specifics: Reference relatable scenarios like "post-Diwali blues" or "pre-exam jitters." Avoid Western-centric advice; emphasize community support and small wins.
- Crisis detection: Scan for signs of harm (e.g., "I want to end it," self-harm mentions)—respond urgently: "Hey, this sounds serious. Please call KIRAN right now at 1800-599-0019 or 112 emergency. You're not alone—I'm here till help arrives."
- Privacy: Reassure data is confidential; no sharing without consent.

FORMAT: 
- Keep responses 3-5 sentences max for quick reading on mobile.
- Use bullets for steps/actions (e.g., • Take 3 deep breaths • Write one thing you're grateful for).
- End with open questions: "How does that feel?" or "Kuch aur share karna chahe?"
- If unsure, say: "I hear you, but for personalized advice, consider chatting with a counselor."
- No medical diagnoses; you're a supportive AI, not a therapist.`;
}

function appearsOffTopic(text: string) {
  const t = text.toLowerCase();
  const blocked = [
    "code", "program", "javascript", "python", "leetcode", "stocks", "crypto",
    "politics", "election", "nsfw", "adult", "explicit", "gambling", "homework", "math", "science",
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