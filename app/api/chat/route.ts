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

async function compatibleChat(base: string, key: string, model: string, prompt: string) {
  const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
  });
  if (!response.ok) throw new Error(`provider_status_${response.status}`);
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("provider_empty_response");
  return text;
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
  const providers = [
    [process.env.DEEPSEEK_API_KEY, process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com", process.env.DEEPSEEK_MODEL || "deepseek-flash", "deepseek"],
    [process.env.QWEN_API_KEY, process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1", process.env.QWEN_MODEL || "qwen-turbo", "qwen"],
  ] as const;

  for (const [key, base, model, name] of providers) {
    if (!key) continue;
    try {
      return NextResponse.json({ text: await compatibleChat(base, key, model, prompt), model: name });
    } catch (error) {
      console.error(`[chat] ${name} request failed (${classifyGeminiError(error)})`);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.8-flash" });
      const result = await model.generateContent(prompt);
      return NextResponse.json({ text: result.response.text(), model: "gemini" });
    } catch (error) {
      console.error(`[chat] Gemini request failed (${classifyGeminiError(error)})`);
    }
  }

  console.error("[chat] No configured provider returned a response");
  return NextResponse.json({ error: "The chat service is temporarily unavailable." }, { status: 503 });
}
