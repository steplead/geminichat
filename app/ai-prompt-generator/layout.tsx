import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Prompt Generator Online",
  description: "Create a clearer AI prompt for writing, learning, coding, email, and everyday tasks without registration.",
  alternates: { canonical: "/ai-prompt-generator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
