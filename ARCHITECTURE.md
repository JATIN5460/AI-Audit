# ARCHITECTURE.md

## What I Built

An AI Spend Audit web app built with Next.js 14 (App Router) + TypeScript. Users input their AI tool subscriptions, get an instant rule-based audit showing savings opportunities, an AI-generated summary via Anthropic API, and a shareable unique URL.

---

## Stack Choices

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | API routes + SSR in one repo, no separate backend needed |
| Language | TypeScript | Type safety for audit engine logic — fewer runtime bugs |
| Styling | Tailwind + shadcn/ui | Fast, accessible, no pre-built admin templates |
| Database | Supabase (Postgres) | Free tier, real Postgres, built-in RLS, easy setup |
| Email | Resend | Best DX, free tier (3k emails/mo), reliable delivery |
| AI | Anthropic API (claude-haiku-4-5) | Fast, cheap, on-brand for Credex |
| Deploy | Vercel | Zero-config Next.js deploy, edge functions supported |

---

## System Diagram

```mermaid
graph TD
    A[User: Spend Input Form] -->|persisted to localStorage| A
    A -->|POST /api/audit| B[Audit Engine - rule-based]
    B -->|generates audit result| C[Audit Result Object]
    C -->|stored with unique slug| D[(Supabase - audits table)]
    C -->|rendered on screen| E[Results Page]
    E -->|streams summary| F[Anthropic API]
    F -->|fallback on error| G[Templated Summary]
    E -->|user submits email| H[POST /api/leads]
    H -->|store lead + audit ref| D
    H -->|send confirmation| I[Resend Email]
    D -->|slug lookup| J[/audit/slug - Public Shareable URL]
    J -->|OG + Twitter meta tags| K[Link Preview]
```

---

## Data Flow: Input → Audit Result

```
1. User fills form (tools, plan, seats, monthly spend, use case)
   └── Saved to localStorage on every change

2. POST /api/audit
   └── Audit engine runs rule-based checks per tool:
       ├── Is user on the right plan for their seat count?
       ├── Is there a cheaper plan from same vendor?
       ├── Is there a substantially cheaper alternative for their use case?
       └── Are they paying retail when Credex credits apply?

3. Audit result object generated
   └── Stored in Supabase (audits table) with nanoid slug

4. Results page rendered
   └── Anthropic API called for personalized ~100-word summary
       └── On failure → fallback templated summary shown

5. Email gate (after value shown)
   └── POST /api/leads → Supabase (leads table) + Resend email fired

6. Shareable URL: /audit/[slug]
   └── PII stripped (no email, no company name)
   └── OG + Twitter card meta tags for link previews
```
---

## Database Schema (Supabase)

### `audits` table
```sql
id          uuid primary key
slug        text unique not null       -- nanoid, used in public URL
input       jsonb not null             -- form data (tools, plans, seats)
result      jsonb not null             -- per-tool breakdown + savings totals
created_at  timestamptz default now()
```

### `leads` table
```sql
id          uuid primary key
audit_id    uuid references audits(id)
email       text not null
company     text
role        text
team_size   int
created_at  timestamptz default now()
```

---

## Abuse Protection

- **Rate limiting:** Upstash Redis (`@upstash/ratelimit`) — 5 audits/IP/hour
- **Honeypot field:** Hidden `website` field in lead capture form; bots fill it, humans don't
- **Choice rationale:** No CAPTCHA friction before value is shown — rate limit + honeypot covers the abuse surface at this scale

---

## What I'd Change at 10k Audits/Day

1. **Separate audit worker** — Move audit computation to a queue (BullMQ / Inngest) so the API route returns immediately and result is polled
2. **Edge caching** — Cache public `/audit/[slug]` pages at CDN level (Vercel Edge Cache) — they're read-heavy, write-once
3. **Anthropic summary batching** — Queue summary generation async, show templated summary instantly and replace on load
4. **DB indexes** — Add index on `slug` and `leads.email` for lookup performance
5. **Separate read/write DB** — Supabase read replicas or move to PlanetScale for horizontal read scaling
