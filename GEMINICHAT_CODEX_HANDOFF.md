# GeminiChat — Codex Project Handoff

Date: 2026-11-04
Repository: https://github.com/steplead/geminichat
Production platform: Vercel
Project name: geminichat
Owner/team: aquamo's projects
Primary intended domain: geminichat.net

## 1. Project purpose

GeminiChat is an independent third-party online AI chat site. It is not affiliated with or endorsed by Google.

Current MVP:
- Homepage with chat interface
- Gemini Chat page
- How-to-use page
- FAQ page
- Privacy, Terms, Disclaimer, Contact pages
- robots.txt
- Dynamic sitemap.xml
- Server-side chat API at /api/chat

## 2. Current source structure

- app/page.tsx — homepage and chat UI
- app/layout.tsx — metadata and root layout
- app/globals.css — global styling
- app/api/chat/route.ts — Gemini API route and fallback logic
- app/gemini-chat/page.tsx
- app/chat-gemini-ai/page.tsx
- app/how-to-use-gemini-chat/page.tsx
- app/gemini-chat-faq/page.tsx
- app/privacy/page.tsx
- app/terms/page.tsx
- app/disclaimer/page.tsx
- app/contact/page.tsx
- app/sitemap.ts
- app/manifest.ts
- public/robots.txt
- package.json
- package-lock.json
- next.config.ts
- tsconfig.json

Framework:
- Next.js ^15.5.6
- React ^19.1.0
- TypeScript ^5.7.3
- @google/generative-ai ^0.24.1

## 3. Important commits

- c20f949 — added app/api/chat/route.ts; this old deployment caused the original “No Next.js version detected” error.
- 46edd118 — ensured root package.json contains Next.js and build scripts.
- 9d206709 — added missing app/globals.css; this fixed the subsequent build failure caused by layout.tsx importing a nonexistent stylesheet.

The latest deployment built successfully and the site UI is accessible.

## 4. Current production problem

The homepage loads correctly, but sending a chat message returns:

The chat service is temporarily unavailable.

This means:
- Frontend deployment is working.
- /api/chat is reachable.
- The Gemini request is failing or GEMINI_API_KEY is not available to the current Production deployment.
- The current route catches the actual Gemini error and returns a generic 503, so the exact reason is not visible.

## 5. Environment variables

Expected Vercel Production variables:

Required:
- GEMINI_API_KEY

Optional:
- GEMINI_MODEL — default currently gemini-2.5-flash

Existing fallback variables in code:
- DEEPSEEK_API_KEY
- DEEPSEEK_BASE_URL
- DEEPSEEK_MODEL
- QWEN_API_KEY
- QWEN_BASE_URL
- QWEN_MODEL

Never print, commit, expose, or place any secret value in source code, logs, screenshots, README files, or this handoff file.

## 6. Immediate next steps for Codex

1. Inspect the current Vercel Production environment and confirm GEMINI_API_KEY exists for the geminichat project.
2. Confirm the variable is assigned to Production, not only Preview or Development.
3. Confirm the latest deployment was created after the variable was added.
4. Redeploy the latest main commit with the current Production environment.
5. Test the homepage chat with a short prompt.
6. If it still returns 503, inspect server logs and classify the failure:
   - missing environment variable
   - invalid or restricted API key
   - unavailable model
   - quota or rate limit
   - blocked API request
7. Do not expose the key while diagnosing.
8. Use a current supported Gemini model only after confirming availability for this key.
9. Add a safe user-facing error message, but keep detailed diagnostics server-side.

## 7. Data-routing decision

The route currently contains fallback code that may send the user's prompt to DeepSeek or Qwen if Gemini fails.

Before changing or enabling this behavior, obtain explicit owner approval for third-party prompt forwarding. If approval is not explicit:
- remove or disable the DeepSeek/Qwen fallback;
- use Gemini only;
- return a generic service-unavailable message on failure.

Do not silently route user conversations to another provider.

## 8. Vercel settings

Expected:
- Framework Preset: Next.js
- Root Directory: repository root (. or blank)
- Build Command: default / next build
- Install Command: default
- Production branch: main

Cloudflare is not required for Vercel's default deployment domain. It is only needed later for custom-domain DNS.

## 9. Domain

Intended custom domain:
- geminichat.net

After the API works:
1. Add the domain in Vercel Project → Settings → Domains.
2. Configure the DNS records Vercel provides at the domain DNS provider.
3. Verify HTTPS.
4. Test both https://geminichat.net and the Vercel deployment URL.

## 10. Acceptance criteria

The project is considered operational only when all are true:

- Latest Vercel deployment status is Ready.
- Homepage loads without console or build errors.
- A short chat prompt returns a Gemini response.
- API errors do not expose secrets.
- robots.txt returns 200.
- sitemap.xml returns valid XML.
- All legal and information pages return 200.
- Production environment variable is confirmed without revealing its value.
- Custom domain resolves and serves the latest deployment.

## 11. Do not do

- Do not delete the GitHub repository.
- Do not delete the Vercel project unless explicitly requested.
- Do not use the stale c20f949 deployment.
- Do not commit API keys.
- Do not claim the API works until a real chat request succeeds.
- Do not forward user prompts to DeepSeek/Qwen without explicit approval.
