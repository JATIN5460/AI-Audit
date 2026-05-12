# METRICS.md

## North Star Metric

**Qualified leads generated per week** — defined as email captures from audits showing >$100/month in savings.

This is the right North Star because the tool exists to generate leads for Credex. An audit completed with no email capture has zero business value. An audit with email capture but $0 savings is a weak lead. A high-savings audit with email capture is the exact outcome the tool was built for. Everything else is upstream of this.

## 3 Input Metrics

**1. Audit completion rate**
Definition: Users who reach the results page / users who load the form.
Why it matters: Low completion means the form is too long or confusing. Target >60%.

**2. Email capture rate**
Definition: Email submissions / audit results page views.
Why it matters: This is where intent is expressed. Target >20% overall, >40% for audits showing >$500/mo savings.

**3. High-savings audit rate**
Definition: Audits showing >$500/mo savings / total audits completed.
Why it matters: If most audits show $0 savings, the audit engine rules need tuning or we're attracting the wrong users. Target >20% of audits showing meaningful savings.

## What to instrument first

1. Audit form submission event (with tool count and use case)
2. Results page view (with totalMonthlySavings bucket: $0, $1-99, $100-499, $500+)
3. Email capture submission (with savings bucket)
4. Credex CTA click (only shown for >$500 savings)

Use Vercel Analytics or Plausible — both free tier, no cookie banner needed for basic events.

## Pivot trigger number

If email capture rate drops below 10% for 2 consecutive weeks, something is broken — either the audit results aren't credible, the email ask is too early, or the value proposition isn't landing. That's the signal to run user interviews again and revisit the results page design before spending on distribution.

DAU is not a useful metric for this tool — users are expected to use it once or twice, not daily. Weekly qualified leads is the only number that matters at this stage.