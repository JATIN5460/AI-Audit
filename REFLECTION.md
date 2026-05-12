# REFLECTION.md

## 1. Hardest bug this week

The toughest bug was the Next.js hydration mismatch on the spend form. The error message was vague — "A tree hydrated but some attributes didn't match." I initially suspected the ToolRow component because it had conditional rendering based on props. I added console logs to compare server vs client output and noticed the `enabled` state was initializing differently. My hypothesis was that `existing` prop was being evaluated differently server-side. I tried wrapping the whole component in Suspense — didn't help. Then I realized the real issue: localStorage doesn't exist on the server, so any state derived from it causes a mismatch. The fix was a `mounted` state initialized to false, set to true in useEffect, and returning null until mounted. Same pattern needed in both SpendForm and ToolRow. Once I understood the root cause, the fix took 10 minutes. Finding the root cause took 2 hours.

## 2. A decision I reversed mid-week

I initially planned to use the Anthropic API for the AI summary — it was specified in the brief as preferred. But Anthropic's API is paid with no free tier for new accounts. I spent time trying to apply for research credits before realizing I was wasting time. I reversed the decision on Day 4 and switched to Google Gemini API which has a generous free tier via AI Studio. The switch took 20 minutes — same interface pattern, different SDK. The summary quality is comparable for 100-word outputs. I documented this in PROMPTS.md. The lesson was: don't let the brief's preference override practical constraints when you have a working alternative.

## 3. What I'd build in week 2

Week 2 would focus on three things. First, a benchmark mode — "your AI spend per developer is $X, companies your size average $Y" — this requires aggregating anonymized audit data from the database, which is already being stored. Second, a PDF export of the full audit report using a headless browser or React-PDF. This makes the report more shareable in business contexts. Third, embeddable widget — a script tag version that a blogger or SaaS tool could drop into their site, running the same audit engine in an iframe. This is the viral distribution play. I'd also add Razorpay or Stripe integration so Credex could take consultation bookings directly through the tool rather than via an external calendar link.

## 4. How I used AI tools

I used Claude heavily throughout the week — primarily for boilerplate generation, debugging error messages, and drafting the rule logic in rules.ts. For the audit engine rules, I used Claude to generate a first draft then reviewed every rule manually against actual vendor pricing pages before accepting it. I didn't trust the AI for pricing numbers — every single number in pricing.ts was manually verified against official pages. One specific case where AI was wrong: Claude suggested GitHub Copilot Business was $25/user/month. The actual price is $19/user/month. I caught this during manual verification against github.com/features/copilot. I also used Claude for the MD documentation files as drafts, then rewrote sections to reflect actual decisions I made during the week.

## 5. Self-ratings

**Discipline: 7/10** — Commits spread across all 7 days but Day 3 and Day 6 were lighter than planned due to debugging taking longer than expected.

**Code quality: 7/10** — Audit engine is clean and well-typed. Some API routes could be refactored to share validation logic rather than repeating it.

**Design sense: 6/10** — Dark theme looks professional but the results page could use more visual hierarchy and data visualization — a savings chart would help.

**Problem solving: 8/10** — Debugged hydration issues, Next.js 15 params changes, and Supabase schema errors systematically without giving up.

**Entrepreneurial thinking: 7/10** — User interviews were genuine conversations that changed the design. GTM and economics show real thinking, not template-fill.