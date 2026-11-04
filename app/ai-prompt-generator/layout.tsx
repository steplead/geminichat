import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Generator – Free Online Prompt Builder",
  description: "Use an AI prompt generator free online to create clearer prompts for writing, learning, coding, email, and everyday tasks without registration.",
  alternates: { canonical: "/ai-prompt-generator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
