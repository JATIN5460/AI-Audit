"use client";

import { useState, useEffect } from "react";
import { ToolName, ToolInput } from "@/lib/audit-engine/types";

const TOOL_PLANS: Record<ToolName, string[]> = {
  cursor: ["hobby", "pro", "business", "enterprise"],
  "github-copilot": ["individual", "business", "enterprise"],
  claude: ["free", "pro", "max", "team", "enterprise", "api"],
  chatgpt: ["plus", "team", "enterprise", "api"],
  "anthropic-api": ["usage-based"],
  "openai-api": ["usage-based"],
  gemini: ["pro", "ultra", "api"],
  windsurf: ["free", "pro", "team"],
};

const TOOL_LABELS: Record<ToolName, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

interface Props {
  tool: ToolName;
  existing?: ToolInput;
  onUpdate: (tool: ToolName, plan: string, seats: number, monthlySpend: number) => void;
  onRemove: (tool: ToolName) => void;
}

export default function ToolRow({ tool, existing, onUpdate, onRemove }: Props) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [plan, setPlan] = useState(TOOL_PLANS[tool][0]);
  const [seats, setSeats] = useState(1);
  const [spend, setSpend] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (existing) {
      setEnabled(true);
      setPlan(existing.plan);
      setSeats(existing.seats);
      setSpend(existing.monthlySpend);
    }
  }, []);

  if (!mounted) return null;

  function handleToggle() {
    if (enabled) {
      onRemove(tool);
    } else {
      onUpdate(tool, plan, seats, spend);
    }
    setEnabled((p) => !p);
  }

  function handleChange(newPlan: string, newSeats: number, newSpend: number) {
    setPlan(newPlan);
    setSeats(newSeats);
    setSpend(newSpend);
    if (enabled) onUpdate(tool, newPlan, newSeats, newSpend);
  }

  return (
    <div className={`border rounded-xl p-4 transition-colors ${enabled ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-slate-800">{TOOL_LABELS[tool]}</span>
        <button
          onClick={handleToggle}
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
            enabled
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {enabled ? "Added ✓" : "+ Add"}
        </button>
      </div>

      {enabled && (
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs text-slate-500 mb-1">Plan</label>
            <select
              value={plan}
              onChange={(e) => handleChange(e.target.value, seats, spend)}
              className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {TOOL_PLANS[tool].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label className="block text-xs text-slate-500 mb-1">Seats</label>
            <input
              type="number"
              min={1}
              value={seats}
              onChange={(e) => handleChange(plan, Number(e.target.value), spend)}
              className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs text-slate-500 mb-1">Monthly spend ($)</label>
            <input
              type="number"
              min={0}
              value={spend}
              onChange={(e) => handleChange(plan, seats, Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}