import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {const base="https://geminichat.net";return ["/","/chat-gemini-ai","/how-to-use-gemini-chat","/gemini-chat-faq","/privacy","/terms","/disclaimer","/contact"].map(url=>({url:base+url,lastModified:new Date()}));}
