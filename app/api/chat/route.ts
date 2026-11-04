import { NextResponse } from "next/server";

const limit = 5;
const counts = new Map<string, { day: string; count: number }>();
const day = () => new Date().toISOString().slice(0, 10);

function classifyGeminiError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/api key|authentication|unauthenticated|permission|forbidden|401|403/i.test(message)) return "authentication_or_permission";
  if (/quota|rate.?limit|429|resource exhausted/i.test(message)) return "quota_or_rate_limit";
  if (/not found|unsupported|invalid.*model|404/i.test(message)) return "model_unavailable";
  return "provider_request_failed";
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const today = day();
  const old = counts.get(ip);
  const used = old?.day === today ? old.count : 0;
  if (used >= limit) return NextResponse.json({ error: "Today's free limit has been reached. Please try again tomorrow." }, { status: 429 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages.slice(-8) : [];
  if (!messages.length || messages.some((m: any) => typeof m?.content !== "string" || m.content.length > 3000)) {
    return NextResponse.json({ error: "Please enter a valid message under 3,000 characters." }, { status: 400 });
  }

  counts.set(ip, { day: today, count: used + 1 });
  const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join("\n");
  if (!process.env.GEMINI_API_KEY) {
    console.error("[chat] Gemini configuration missing: GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "The chat service is temporarily unavailable." }, { status: 503 });
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const model = ai.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return NextResponse.json({ text: result.response.text(), model: "gemini" });
  } catch (error) {
    console.error(`[chat] Gemini request failed (${classifyGeminiError(error)})`);
    return NextResponse.json({ error: "The chat service is temporarily unavailable." }, { status: 503 });
  }
}
