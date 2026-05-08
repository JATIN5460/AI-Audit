import { AuditInput, AuditResult, ToolResult } from "./types";
import { auditTool } from "./rules";

export function runAudit(input: AuditInput, slug: string): AuditResult {
  const results: ToolResult[] = input.tools.map((tool) =>
    auditTool(tool, input.teamSize, input.useCase)
  );

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.savings, 0);

  return {
    slug,
    input,
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    createdAt: new Date().toISOString(),
  };
}