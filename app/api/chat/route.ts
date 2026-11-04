import { NextResponse } from "next/server";

const DAILY_LIMIT = Number(process.env.DAILY_REQUEST_LIMIT || 5);
const WINDOW_LIMIT = Number(process.env.MINUTE_REQUEST_LIMIT || 10);
const MAX_MESSAGE_CHARS = Number(process.env.MAX_MESSAGE_CHARS || 3000);
const MAX_PROMPT_CHARS = Number(process.env.MAX_PROMPT_CHARS || 12000);
const MAX_OUTPUT_TOKENS = Number(process.env.MAX_OUTPUT_TOKENS || 800);
const COOLDOWN_MS = Number(process.env.REQUEST_COOLDOWN_MS || 2500);
const PROVIDER_TIMEOUT_MS = Number(process.env.PROVIDER_TIMEOUT_MS || 20000);
type Usage = { day: string; dayCount: number; windowStarted: number; windowCount: number; lastRequest: number };
const usage = new Map<string, Usage>();
const active = new Set<string>();
const today = () => new Date().toISOString().slice(0, 10);
const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
function reject(error: string, status: number, retryAfter?: number) {
  const response = NextResponse.json({ error }, { status });
  if (retryAfter) response.headers.set("Retry-After", String(retryAfter));
  return response;
}
export const runtime = "nodejs";
export const maxDuration = 30;

function classifyProviderError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/api key|authentication|unauthenticated|permission|forbidden|401|403/i.test(message)) return "authentication_or_permission";
  if (/quota|rate.?limit|429|resource exhausted/i.test(message)) return "quota_or_rate_limit";
  if (/not found|unsupported|invalid.*model|404/i.test(message)) return "model_unavailable";
  return "provider_request_failed";
}

async function compatibleChat(base: string, key: string, model: string, prompt: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: MAX_OUTPUT_TOKENS }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`provider_status_${response.status}`);
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) throw new Error("provider_empty_response");
    return text;
  } finally { clearTimeout(timeout); }
}

function takeQuota(key: string) {
  const now = Date.now();
  const record: Usage = usage.get(key)?.day === today()
    ? usage.get(key)!
    : { day: today(), dayCount: 0, windowStarted: now, windowCount: 0, lastRequest: 0 };
  if (now - record.windowStarted >= 60_000) { record.windowStarted = now; record.windowCount = 0; }
  if (record.dayCount >= DAILY_LIMIT) return { ok: false as const, reason: "daily", retryAfter: 86400 };
  if (record.windowCount >= WINDOW_LIMIT) return { ok: false as const, reason: "minute", retryAfter: 60 };
  if (now - record.lastRequest < COOLDOWN_MS) return { ok: false as const, reason: "cooldown", retryAfter: Math.ceil((COOLDOWN_MS - now + record.lastRequest) / 1000) };
  record.dayCount++; record.windowCount++; record.lastRequest = now; usage.set(key, record);
  return { ok: true as const };
}

export async function POST(req: Request) {
  if (process.env.CHAT_ENABLED === "false") return reject("The chat service is temporarily disabled.", 503);
  const ip = clientIp(req);
  const quota = takeQuota(ip);
  if (!quota.ok) return reject(quota.reason === "daily" ? "Today's free limit has been reached. Please try again tomorrow." : "Too many requests. Please wait a moment and try again.", 429, quota.retryAfter);
  if (active.has(ip)) return reject("Please wait for your current request to finish.", 429, 3);
  active.add(ip);
  try {
    let body: any;
    try { body = await req.json(); } catch { return reject("Invalid request.", 400); }
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-8) : [];
    if (!messages.length || messages.some((m: any) => !["user", "assistant"].includes(m?.role) || typeof m?.content !== "string" || !m.content.trim() || m.content.length > MAX_MESSAGE_CHARS)) return reject(`Please enter valid messages under ${MAX_MESSAGE_CHARS.toLocaleString()} characters.`, 400);
    const prompt = messages.map((m: any) => `${m.role}: ${m.content.trim()}`).join("\n");
    if (prompt.length > MAX_PROMPT_CHARS) return reject("Your conversation is too long. Please start a new chat.", 413);
  const providers = [
    [process.env.DEEPSEEK_API_KEY, process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com", process.env.DEEPSEEK_MODEL || "deepseek-flash", "deepseek"],
    [process.env.QWEN_API_KEY, process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1", process.env.QWEN_MODEL || "qwen-turbo", "qwen"],
  ] as const;

    for (const [key, base, model, name] of providers) {
      if (!key) continue;
      try { return NextResponse.json({ text: await compatibleChat(base, key, model, prompt) }); }
      catch (error) { console.error(`[chat] ${name} request failed (${classifyProviderError(error)})`); }
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = ai.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3.8-flash" });
        const result = await model.generateContent(prompt);
        return NextResponse.json({ text: result.response.text() });
      } catch (error) { console.error(`[chat] Gemini request failed (${classifyProviderError(error)})`); }
    }

  console.error("[chat] No configured provider returned a response");
    return reject("The chat service is temporarily unavailable.", 503);
  } finally { active.delete(ip); }
}
