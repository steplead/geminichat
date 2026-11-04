import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Generator – Free Online Prompt Builder",
  description: "Use an AI prompt generator free online to create clearer prompts for writing, learning, coding, email, and everyday tasks without registration.",
  alternates: { canonical: "/ai-prompt-generator" },
  openGraph: {
    type: "website",
    url: "https://geminichat.net/ai-prompt-generator",
    title: "AI Prompt Generator – Free Online Prompt Builder",
    description: "Create clearer AI prompts for writing, learning, coding, email, and everyday tasks without registration.",
  },
};

const faq=[
  ["What is an AI prompt generator?","It turns a plain-language goal into a structured instruction that an AI assistant can follow more consistently."],
  ["Is this prompt generator free?","Yes. You can use it without registration, subject to daily usage limits."],
  ["What should I include in a prompt?","Include the goal, context, audience, constraints, examples, and desired output format."],
  ["Can it write prompts for coding?","Yes. Include the language, framework, existing code, error, expected behavior, and requested output."],
  ["Can it write prompts for email?","Yes. Include the recipient, purpose, relationship, tone, key facts, and desired action."],
  ["Can it make a study prompt?","Yes. Include the subject, level, exam goal, available time, and whether you want a plan, quiz, or examples."],
  ["Do I need an account?","No account is required. Copy useful results because there is no permanent prompt library."],
  ["Are prompts saved?","No. Do not treat generated prompts as permanently stored; save useful results locally."],
  ["Can I use the result in another AI tool?","Yes. Copy the plain-text prompt into ChatGPT, Gemini, Claude, DeepSeek, or another assistant."],
  ["Why was my prompt too general?","Add context, audience, constraints, examples, and a precise deliverable, then generate again."],
  ["Should I include private information?","No. Never enter passwords, API keys, confidential data, medical records, or personal identifiers."],
];
const schema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faq.map(([name,text])=>({"@type":"Question",name,acceptedAnswer:{"@type":"Answer",text}}))};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />{children}</>;
}
