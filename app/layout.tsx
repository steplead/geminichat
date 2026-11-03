import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Chat Gemini Online - Free AI Chat Assistant", description: "Chat with Gemini online using a simple independent AI chat assistant. Ask questions, write, learn, code, and explore Gemini chat for free.", robots: { index: true, follow: true } };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
