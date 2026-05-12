# TESTS.md

## How to run tests

```bash
npm test
```

All tests are in `__tests__/audit-engine.test.ts` and run via Jest with ts-jest.

## Test list

### 1. cursor business <=3 seats recommends Pro downgrade
**File:** `__tests__/audit-engine.test.ts`
**Covers:** Cursor Business plan flagged for small teams
**What it checks:** savings > 0 and recommendedAction contains "Downgrade"

### 2. cursor pro at correct price returns no savings
**File:** `__tests__/audit-engine.test.ts`
**Covers:** No false positives for correctly priced plans
**What it checks:** savings === 0 for correctly priced Cursor Pro

### 3. claude max for small team recommends Pro
**File:** `__tests__/audit-engine.test.ts`
**Covers:** Claude Max flagged when team < 5
**What it checks:** savings > 0 and recommendedAction contains "Pro"

### 4. anthropic api high spend flags credex
**File:** `__tests__/audit-engine.test.ts`
**Covers:** API spend >$500/mo triggers Credex recommendation
**What it checks:** credexApplicable === true and savings > 0

### 5. anthropic api low spend no action
**File:** `__tests__/audit-engine.test.ts`
**Covers:** No false positives for low API spend
**What it checks:** savings === 0 for spend < $500

### 6. runAudit totalMonthlySavings is sum of all tool savings
**File:** `__tests__/audit-engine.test.ts`
**Covers:** Audit engine aggregation logic
**What it checks:** totalMonthlySavings equals sum of all individual tool savings

### 7. annual savings equals monthly * 12
**File:** `__tests__/audit-engine.test.ts`
**Covers:** Annual savings calculation
**What it checks:** totalAnnualSavings === totalMonthlySavings * 12
