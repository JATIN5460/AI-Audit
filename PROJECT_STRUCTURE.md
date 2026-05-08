# PROJECT_STRUCTURE.md

## Folder Layout

```
ai-spend-audit/
├── app/
│   ├── page.tsx                  # Landing + input form
│   ├── results/[slug]/page.tsx   # Public shareable audit result
│   ├── api/
│   │   ├── audit/route.ts        # POST - runs audit engine, saves to Supabase
│   │   ├── leads/route.ts        # POST - captures email, fires Resend
│   │   └── summary/route.ts      # POST - Anthropic API summary
│   └── layout.tsx                # OG meta tags base
│
├── components/
│   ├── form/
│   │   ├── SpendForm.tsx         # Main multi-step form
│   │   ├── ToolRow.tsx           # Per-tool input row
│   │   └── UseCaseSelect.tsx     # Coding/writing/data/research/mixed
│   ├── results/
│   │   ├── AuditHero.tsx         # Big savings number (monthly + annual)
│   │   ├── ToolBreakdown.tsx     # Per-tool recommendation card
│   │   ├── AISummary.tsx         # Anthropic summary + loading skeleton
│   │   ├── CredexCTA.tsx         # Shown if savings >$500/mo
│   │   └── LeadCapture.tsx       # Email gate form (honeypot included)
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── audit-engine/
│   │   ├── index.ts              # Main engine entry point
│   │   ├── rules.ts              # Per-tool rule logic
│   │   ├── pricing.ts            # All pricing constants (typed, cited)
│   │   └── types.ts              # AuditInput, AuditResult, ToolResult types
│   ├── supabase.ts               # Supabase client init
│   ├── resend.ts                 # Resend client init
│   └── utils.ts                  # slug gen, formatCurrency, cn helpers
│
├── __tests__/
│   └── audit-engine.test.ts      # ≥5 tests covering audit engine
│
├── .github/
│   └── workflows/
│       └── ci.yml                # lint + test on every push to main
│
├── .env.local                    # secrets — gitignored
├── .env.example                  # template with key names, no values
│
└── docs/                         # all required .md files
    ├── ARCHITECTURE.md
    ├── DEVLOG.md
    ├── REFLECTION.md
    ├── PRICING_DATA.md
    ├── PROMPTS.md
    ├── TESTS.md
    ├── GTM.md
    ├── ECONOMICS.md
    ├── USER_INTERVIEWS.md
    ├── LANDING_COPY.md
    └── METRICS.md
```

---

## Key File Responsibilities

### `lib/audit-engine/types.ts`
All shared TypeScript types:
- `ToolInput` — tool name, plan, seats, monthly spend
- `AuditInput` — array of ToolInputs + team size + use case
- `ToolResult` — current spend, recommended action, savings, reason
- `AuditResult` — array of ToolResults + totals + slug

### `lib/audit-engine/pricing.ts`
Single source of truth for all pricing.
Every number maps to a URL in `PRICING_DATA.md`.

### `lib/audit-engine/rules.ts`
Pure functions — no side effects, fully testable.
Takes `ToolInput` → returns `ToolResult`.

### `lib/audit-engine/index.ts`
Orchestrates: loops tools → calls rules → computes totals → returns `AuditResult`.

### `app/api/audit/route.ts`
- Validates input
- Calls audit engine
- Generates slug (nanoid)
- Stores in Supabase
- Calls Anthropic for summary (with fallback)
- Returns slug + result

### `app/results/[slug]/page.tsx`
- Server component — fetches audit by slug from Supabase
- Sets OG + Twitter card meta tags dynamically
- Renders result with PII stripped

---

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Upstash (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
