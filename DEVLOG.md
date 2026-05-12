# DEVLOG.md

## Day 1 — 2026-05-05
**Hours worked:** 3
**What I did:** Read the assignment brief carefully. Set up Next.js 14 project with TypeScript and Tailwind. Created folder structure — app, components, lib, audit-engine. Initialized git repo with conventional commits.
**What I learned:** Next.js 15 changed how params works in dynamic routes — it's now a Promise. Caught this early.
**Blockers / what I'm stuck on:** Not sure whether to use Supabase or Firebase. Went with Supabase for real Postgres support.
**Plan for tomorrow:** Build the audit engine types and pricing data first before touching UI.

## Day 2 — 2026-05-06
**Hours worked:** 4
**What I did:** Built the full audit engine — types.ts, pricing.ts, rules.ts, index.ts. Wrote rule logic for all 8 tools with defensible reasoning. Added 7 Jest tests covering edge cases.
**What I learned:** Keeping audit engine as pure functions with no side effects made testing trivial. Good architectural call.
**Blockers / what I'm stuck on:** Pricing for Gemini Ultra was hard to verify — found it on Google One AI Premium page eventually.
**Plan for tomorrow:** Build the spend input form with localStorage persistence.

## Day 3 — 2026-05-07
**Hours worked:** 4
**What I did:** Built SpendForm, ToolRow, UseCaseSelect components. Implemented localStorage persistence. Hit hydration mismatch errors because localStorage doesn't exist on server — fixed with mounted state pattern.
**What I learned:** Any component using localStorage must use useEffect + mounted guard to avoid Next.js hydration errors.
**Blockers / what I'm stuck on:** ToolRow initial state was causing hydration issues. Moved all state initialization to useEffect.
**Plan for tomorrow:** Build API routes and Supabase integration.

## Day 4 — 2026-05-08
**Hours worked:** 5
**What I did:** Built /api/audit, /api/leads, /api/summary routes. Set up Supabase with audits and leads tables. Integrated Gemini API for AI summary (switched from Anthropic — free tier). Added honeypot abuse protection on leads endpoint.
**What I learned:** Supabase requires tables to exist before any query — obvious in hindsight but cost 30 minutes debugging PGRST205 error.
**Blockers / what I'm stuck on:** Resend requires domain DNS verification. Used onboarding@resend.dev for now.
**Plan for tomorrow:** Build results page with all components.

## Day 5 — 2026-05-09
**Hours worked:** 4
**What I did:** Built AuditHero, ToolBreakdown, AISummary, CredexCTA, LeadCapture components. Built shareable /results/[slug] page with OG meta tags. Fixed params Promise issue in Next.js 15.
**What I learned:** generateMetadata also receives params as a Promise in Next.js 15 — same fix needed there too.
**Blockers / what I'm stuck on:** AI summary occasionally returns markdown formatting — added text cleanup before displaying.
**Plan for tomorrow:** Polish UI, dark theme, deploy to Vercel.

## Day 6 — 2026-05-10
**Hours worked:** 3
**What I did:** Redesigned landing page with dark theme — gradient hero, stats bar, how-it-works section. Updated all form components to match dark aesthetic. Set up GitHub Actions CI pipeline for lint and tests.
**What I learned:** Tailwind's bg-clip-text with gradient works well for hero headings. Small detail, big visual impact.
**Blockers / what I'm stuck on:** CI was failing because jest config needed moduleNameMapper for @ alias.
**Plan for tomorrow:** Write all MD documentation files, deploy final version.

## Day 7 — 2026-05-11
**Hours worked:** 3
**What I did:** Deployed to Vercel. Set all environment variables in Vercel dashboard. Wrote DEVLOG, REFLECTION, GTM, ECONOMICS, PRICING_DATA, PROMPTS, TESTS, USER_INTERVIEWS, LANDING_COPY, METRICS files. Final review of all 6 MVP features end to end.
**What I learned:** Writing GTM and ECONOMICS forced me to think about the product seriously — not just as a coding exercise.
**Blockers / what I'm stuck on:** DNS verification for aiaudit.com still pending — using test email for now.
**Plan for tomorrow:** Submission done.