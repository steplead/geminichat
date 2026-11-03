# GeminiChat.net

First-stage MVP for an independent Chat Gemini online tool.

## Run locally

```bash
npm install
cp .env.example .env.local
# add GEMINI_API_KEY to .env.local
npm run dev
```

The first version intentionally uses no database, uploads, email service, or cloud chat history. The `/api/chat` route applies a small in-memory per-IP daily limit for the MVP; production deployment should replace this with an edge-safe rate limiter before public promotion.
