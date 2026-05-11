export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export interface ToolInput {
  tool: ToolName;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolResult {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
  alternative?: string;
  credexApplicable: boolean;
}

export interface AuditResult {
  slug: string;
  input: AuditInput;
  results: ToolResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string;
  createdAt: string;
}