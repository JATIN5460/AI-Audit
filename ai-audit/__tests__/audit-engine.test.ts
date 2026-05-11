import { test, expect } from "@jest/globals";
import { runAudit } from "@/lib/audit-engine";
import { auditTool } from "@/lib/audit-engine/rules";
import { AuditInput } from "@/lib/audit-engine/types";

// 1. Cursor Business with <=3 seats should flag downgrade
test("cursor business <=3 seats recommends Pro downgrade", () => {
  const result = auditTool(
    { tool: "cursor", plan: "business", seats: 2, monthlySpend: 80 },
    2,
    "coding"
  );
  expect(result.savings).toBeGreaterThan(0);
  expect(result.recommendedAction).toContain("Downgrade");
});

// 2. Cursor Pro at correct price → no action
test("cursor pro at correct price returns no savings", () => {
  const result = auditTool(
    { tool: "cursor", plan: "pro", seats: 2, monthlySpend: 40 },
    2,
    "coding"
  );
  expect(result.savings).toBe(0);
});

// 3. Claude Max with team < 5 should recommend Pro
test("claude max for small team recommends Pro", () => {
  const result = auditTool(
    { tool: "claude", plan: "max", seats: 2, monthlySpend: 200 },
    3,
    "writing"
  );
  expect(result.savings).toBeGreaterThan(0);
  expect(result.recommendedAction).toContain("Pro");
});

// 4. Anthropic API > $500/mo should flag Credex credits
test("anthropic api high spend flags credex", () => {
  const result = auditTool(
    { tool: "anthropic-api", plan: "usage-based", seats: 1, monthlySpend: 800 },
    5,
    "coding"
  );
  expect(result.credexApplicable).toBe(true);
  expect(result.savings).toBeGreaterThan(0);
});

// 5. Anthropic API < $500/mo → no action
test("anthropic api low spend no action", () => {
  const result = auditTool(
    { tool: "anthropic-api", plan: "usage-based", seats: 1, monthlySpend: 200 },
    2,
    "coding"
  );
  expect(result.savings).toBe(0);
});

// 6. runAudit totals are sum of individual savings
test("runAudit totalMonthlySavings is sum of all tool savings", () => {
  const input: AuditInput = {
    tools: [
      { tool: "cursor", plan: "business", seats: 2, monthlySpend: 80 },
      { tool: "claude", plan: "max", seats: 2, monthlySpend: 200 },
    ],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input, "test-slug");
  const expectedTotal = result.results.reduce((sum: number, r: any) => sum + r.savings, 0);
  expect(result.totalMonthlySavings).toBe(expectedTotal);
});

// 7. Annual savings = monthly * 12
test("annual savings equals monthly * 12", () => {
  const input: AuditInput = {
    tools: [{ tool: "cursor", plan: "business", seats: 3, monthlySpend: 120 }],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(input, "slug-2");
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});