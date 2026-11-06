"use client";
import { useState } from "react";

const faqs = [
  "What is an AI prompt generator?",
  "Is this prompt generator free?",
  "What should I include in a prompt?",
  "Can it write prompts for coding?",
  "Can it write prompts for email?",
  "Can it make a study prompt?",
  "Do I need an account?",
  "Are prompts saved?",
  "Can I use the result in another AI tool?",
  "Why was my prompt too general?",
  "Should I include private information?",
];

const answers: Record<string, string> = {
  "What is an AI prompt generator?": "It turns a plain-language goal into a structured instruction that an AI assistant can follow more consistently. You provide the task, audience, and preferred format; the tool returns a ready-to-copy prompt.",
  "Is this prompt generator free?": "Yes. You can use it without registration. Free access is subject to daily usage limits so the service remains available to everyone.",
  "What should I include in a prompt?": "Include the desired outcome, relevant context, audience or skill level, constraints, examples, and the output format. If a detail is unknown, say so instead of inventing it.",
  "Can it write prompts for coding?": "Yes. State the language, framework, existing code, error message, expected behavior, and whether you want an explanation, patch, tests, or a complete example.",
  "Can it write prompts for email?": "Yes. Specify who will receive the email, your relationship, the purpose, tone, important facts, and the action you want the reader to take. You can request a subject line and a short version too.",
  "Can it make a study prompt?": "Yes. Include the subject, learner's current level, exam or goal, available time, topics to cover, and a preferred format such as a daily plan, quiz, flashcards, or worked examples.",
  "Do I need an account?": "No. The generator works without an account or sign-up. Usage is limited per day, and you should copy any prompt you want to keep.",
  "Are prompts saved?": "No. Prompts and generated results are not presented as a permanent personal library. Save useful results locally before leaving or refreshing the page.",
  "Can I use the result in another AI tool?": "Yes. The output is plain text, so you can copy it into ChatGPT, Gemini, Claude, DeepSeek, or another assistant. You may need to adjust model-specific features or limits.",
  "Why was my prompt too general?": "The request probably did not include enough context or a concrete deliverable. Add the intended audience, source material, constraints, examples, and a precise output format, then generate again.",
  "Should I include private information?": "No. Never enter passwords, API keys, confidential business data, medical records, financial details, or identifying information. Replace sensitive values with placeholders such as [COMPANY] or [CUSTOMER].",
};

const examples: Record<string, string> = {
  "What is an AI prompt generator?": 'Input: "Help my team summarize long articles" → Output: "Act as a concise editor. Summarize the article below into 5 bullet points for a busy product team, keeping only decisions and action items."',
  "Is this prompt generator free?": 'Open the tool and generate — no account needed. Sample output: "Rewrite the paragraph below for a 10th-grade reading level, keeping the meaning unchanged."',
  "What should I include in a prompt?": 'Input: "Write a product description" → Output: "Write a 60-word product description for [PRODUCT], for first-time buyers, friendly tone, highlight [BENEFIT]. One paragraph."',
  "Can it write prompts for coding?": 'Input: "Fix my React loop" → Output: "Act as a senior React engineer. Explain why the useEffect below causes an infinite loop, then give a corrected version with comments."',
  "Can it write prompts for email?": 'Input: "Decline a meeting" → Output: "Write a polite email to a client declining a Friday meeting and proposing Monday 10:00 instead. Under 80 words, professional tone."',
  "Can it make a study prompt?": 'Input: "Learn Spanish in a week" → Output: "Create a 7-day beginner Spanish plan, 30 minutes a day, with daily vocab, one dialogue, and a quiz on day 7."',
  "Do I need an account?": 'No sign-up required. Sample output: "Turn my bullet to-do list into a prioritized schedule with time blocks for today."',
  "Are prompts saved?": 'Results are not stored, so copy what you want to keep. Sample output: "Draft a 3-sentence reply to a customer asking about a delayed shipment."',
  "Can I use the result in another AI tool?": 'Copy the output into ChatGPT, Gemini, Claude, or DeepSeek. Sample output: "Act as a careful proofreader. Fix grammar and tighten the text below without changing its meaning."',
  "Why was my prompt too general?": 'Input: "Help with marketing" → Improved: "Write 5 Instagram captions for a coffee shop\'s autumn latte, playful tone, each under 20 words, with 2 emoji."',
  "Should I include private information?": 'Use placeholders instead. Input: "Email my client about the contract" → Output: "Write an email to [CLIENT] about [CONTRACT] status, professional tone, 3 bullet points, no real identifiers."',
};

const templates = [
  { label: "Writing", goal: "Write a product launch announcement for my team", audience: "Internal colleagues", format: "Short email, 3 bullet points" },
  { label: "Coding", goal: "Explain and fix a React useEffect infinite loop", audience: "A junior developer", format: "Code explanation with a corrected snippet" },
  { label: "Email", goal: "Politely decline a meeting invitation", audience: "A client", format: "Professional email under 80 words" },
  { label: "Study", goal: "Build a one-week beginner Spanish plan", audience: "A complete beginner", format: "Daily checklist" },
  { label: "Everyday", goal: "Turn my messy weekend to-do list into a plan", audience: "Myself", format: "Numbered schedule" },
];

export default function Page() {
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Create one practical AI prompt for this task. Return only the finished prompt, with no preamble.\nTask: ${goal.trim()}\nAudience: ${audience.trim() || "Not specified"}\nDesired format: ${format.trim() || "Not specified"}`,
          }],
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Unable to generate a prompt");
      setResult(data.text || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "The prompt generator is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Prompt Generator",
    url: "https://geminichat.net/ai-prompt-generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="eyebrow">Free AI Tool · No registration</p>
      <h1>AI Prompt Generator</h1>
      <p className="section-intro">Describe one task and get a clearer prompt for writing, learning, coding, email, or everyday work. Use it free online without an account; daily limits apply.</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, alignItems: "center" }}>
        <span style={{ color: "var(--muted)", fontSize: ".9rem" }}>Start from a template:</span>
        {templates.map((t) => (
          <button
            key={t.label}
            type="button"
            className="button"
            style={{ padding: "8px 14px", fontSize: ".85rem", background: "#eef2ff", color: "var(--blue)" }}
            onClick={() => { setGoal(t.goal); setAudience(t.audience); setFormat(t.format); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="card" style={{ marginTop: 24 }}>
        <label htmlFor="goal"><strong>What do you want the AI to do?</strong></label>
        <textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Example: Help me plan a two-week biology study schedule" maxLength={2500} />
        <label htmlFor="audience"><strong>Who is the result for?</strong></label>
        <input id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Example: A beginner student" maxLength={500} />
        <label htmlFor="format"><strong>What format do you want?</strong></label>
        <input id="format" value={format} onChange={(e) => setFormat(e.target.value)} placeholder="Example: A numbered checklist" maxLength={500} />
        <button className="button" onClick={generate} disabled={loading || !goal.trim()}>{loading ? "Creating..." : "Generate prompt"}</button>
        {error && <p role="alert">{error}</p>}
        {result && (
          <div className="card" style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <h2 style={{ margin: 0 }}>Your prompt</h2>
              <button type="button" className="button" style={{ padding: "6px 14px", fontSize: ".85rem" }} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
            </div>
            <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{result}</p>
          </div>
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>How to get a useful result</h2>
        <div className="grid">
          <div className="card"><h3>Give one clear task</h3><p>Specific goals produce more useful prompts than broad topics.</p></div>
          <div className="card"><h3>Add context</h3><p>Include the audience, level, examples, and constraints that matter.</p></div>
          <div className="card"><h3>Choose a format</h3><p>Ask for a table, checklist, outline, email, code explanation, or another format.</p></div>
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>AI Prompt Generator FAQ</h2>
        <div className="faq">
          {faqs.map((q, i) => (
            <details open={i === 0} key={q}>
              <summary>{q}</summary>
              <p>{answers[q]}</p>
              {examples[q] && (
                <p style={{ marginTop: 10, padding: "10px 12px", background: "var(--soft)", border: "1px solid var(--line)", borderRadius: 10, fontSize: ".92rem" }}>
                  <strong>Example: </strong>{examples[q]}
                </p>
              )}
            </details>
          ))}
        </div>
      </section>

      <p style={{ marginTop: 24 }}>Want a general conversation instead? Visit <a href="/">Chat Gemini Online</a> or read <a href="/how-to-use-gemini-chat">How to use Gemini Chat</a>.</p>
    </main>
  );
}
