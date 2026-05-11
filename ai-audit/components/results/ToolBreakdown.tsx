import { ToolResult } from "@/lib/audit-engine/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  results: ToolResult[];
}

const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export default function ToolBreakdown({ results }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Per-tool breakdown</h2>
      <div className="space-y-3">
        {results.map((r) => (
          <div
            key={r.tool}
            className={`rounded-xl border p-4 ${
              r.savings > 0
                ? "border-amber-200 bg-amber-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">
                    {TOOL_LABELS[r.tool]}
                  </span>
                  {r.savings > 0 && (
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      Save {formatCurrency(r.savings)}/mo
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">{r.recommendedAction}</p>
                <p className="text-xs text-slate-500">{r.reason}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm text-slate-400">Current</div>
                <div className="font-semibold text-slate-700">
                  {formatCurrency(r.currentSpend)}/mo
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}