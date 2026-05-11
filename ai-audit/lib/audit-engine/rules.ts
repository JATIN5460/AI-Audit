import { ToolInput, ToolResult, UseCase } from "./types";
import { PRICING } from "./pricing";

export function auditTool(input: ToolInput, teamSize: number, useCase: UseCase): ToolResult {
  switch (input.tool) {
    case "cursor":        return auditCursor(input, useCase);
    case "github-copilot": return auditCopilot(input, useCase);
    case "claude":        return auditClaude(input, teamSize);
    case "chatgpt":       return auditChatGPT(input, teamSize);
    case "gemini":        return auditGemini(input, useCase);
    case "windsurf":      return auditWindsurf(input, useCase);
    case "anthropic-api":
    case "openai-api":    return auditAPIUsage(input);
    default:              return noActionResult(input);
  }
}

function auditCursor(input: ToolInput, useCase: UseCase): ToolResult {
  const { seats, monthlySpend, plan } = input;
  const expectedCost = plan === "pro" ? seats * PRICING.cursor.pro : seats * PRICING.cursor.business;
  const overpay = monthlySpend - expectedCost;

  if (plan === "business" && seats <= 3 && useCase === "coding") {
    const savings = seats * (PRICING.cursor.business - PRICING.cursor.pro);
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Cursor Pro",
      savings,
      reason: `Business plan is for teams >5. At ${seats} seats, Pro gives identical coding features for $${PRICING.cursor.pro}/user vs $${PRICING.cursor.business}/user.`,
      credexApplicable: true,
    };
  }

  if (overpay > 20) {
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Review seat count",
      savings: overpay,
      reason: `You're paying $${monthlySpend}/mo but expected cost for ${seats} seats on ${plan} is $${expectedCost}/mo.`,
      credexApplicable: false,
    };
  }

  return noActionResult(input);
}

function auditCopilot(input: ToolInput, useCase: UseCase): ToolResult {
  const { seats, monthlySpend, plan } = input;

  if (useCase === "coding" && plan === "enterprise" && seats < 10) {
    const savings = seats * (PRICING["github-copilot"].enterprise - PRICING["github-copilot"].business);
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Downgrade to GitHub Copilot Business",
      savings,
      reason: `Enterprise adds policy controls useful for 10+ teams. At ${seats} seats, Business covers all coding features at $${PRICING["github-copilot"].business}/user.`,
      credexApplicable: false,
    };
  }

  if (useCase !== "coding") {
    const savings = monthlySpend - seats * PRICING.claude.pro;
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Consider Claude Pro instead",
      savings: savings > 0 ? savings : 0,
      reason: `Copilot is optimised for code completion. For ${useCase} workloads, Claude Pro offers stronger long-context reasoning at similar cost.`,
      alternative: "claude",
      credexApplicable: true,
    };
  }

  return noActionResult(input);
}

function auditClaude(input: ToolInput, teamSize: number): ToolResult {
  const { seats, monthlySpend, plan } = input;

  if (plan === "team" && seats <= 2) {
    const savings = seats * (PRICING.claude.team - PRICING.claude.pro);
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Switch to Claude Pro (individual seats)",
      savings,
      reason: `Claude Team adds admin features irrelevant for ${seats}-person use. Pro at $${PRICING.claude.pro}/user saves $${savings}/mo.`,
      credexApplicable: true,
    };
  }

  if (plan === "max" && teamSize < 5) {
    const savings = seats * (PRICING.claude.max - PRICING.claude.pro);
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Claude Pro",
      savings,
      reason: `Max is for power users hitting Pro limits. For a team of ${teamSize}, Pro limits are rarely reached.`,
      credexApplicable: true,
    };
  }

  return noActionResult(input);
}

function auditChatGPT(input: ToolInput, teamSize: number): ToolResult {
  const { seats, monthlySpend, plan } = input;

  if (plan === "team" && seats <= 2) {
    const savings = seats * (PRICING.chatgpt.team - PRICING.chatgpt.plus);
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Switch to ChatGPT Plus (per seat)",
      savings,
      reason: `Team workspace features aren't useful at ${seats} seats. Plus saves $${savings}/mo.`,
      credexApplicable: false,
    };
  }

  return noActionResult(input);
}

function auditGemini(input: ToolInput, useCase: UseCase): ToolResult {
  const { monthlySpend, plan } = input;

  if (plan === "ultra" && useCase !== "data" && useCase !== "research") {
    const savings = monthlySpend - PRICING.gemini.pro;
    return {
      tool: input.tool, currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Gemini Pro",
      savings: savings > 0 ? savings : 0,
      reason: `Gemini Ultra's advantage is multimodal data/research tasks. For ${useCase}, Gemini Pro delivers comparable results at a fraction of the cost.`,
      credexApplicable: false,
    };
  }

  return noActionResult(input);
}

function auditWindsurf(input: ToolInput, useCase: UseCase): ToolResult {
  if (useCase !== "coding") {
    return {
      tool: input.tool, currentSpend: input.monthlySpend,
      recommendedAction: "Cancel subscription",
      savings: input.monthlySpend,
      reason: `Windsurf is an AI code editor — value drops for ${useCase} workflows. Claude Pro is a better fit.`,
      alternative: "claude",
      credexApplicable: true,
    };
  }
  return noActionResult(input);
}

function auditAPIUsage(input: ToolInput): ToolResult {
  if (input.monthlySpend > 500) {
    return {
      tool: input.tool, currentSpend: input.monthlySpend,
      recommendedAction: "Explore Credex discounted credits",
      savings: Math.round(input.monthlySpend * 0.2),
      reason: `At $${input.monthlySpend}/mo in API spend, Credex credits typically save 15–25%.`,
      credexApplicable: true,
    };
  }
  return noActionResult(input);
}

function noActionResult(input: ToolInput): ToolResult {
  return {
    tool: input.tool, currentSpend: input.monthlySpend,
    recommendedAction: "No change needed",
    savings: 0,
    reason: "Your current plan appears well-matched to your usage and team size.",
    credexApplicable: false,
  };
}