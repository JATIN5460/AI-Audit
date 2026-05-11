"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToolName, UseCase, AuditInput } from "@/lib/audit-engine/types";
import ToolRow from "./ToolRow";
import UseCaseSelect from "./UseCaseSelect";

const TOOLS: ToolName[] = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
];

const STORAGE_KEY = "ai-audit-form";

const defaultForm = (): AuditInput => ({
  tools: [],
  teamSize: 1,
  useCase: "coding",
});

export default function SpendForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<AuditInput>(defaultForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fix hydration — only run on client
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setForm(JSON.parse(saved));
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form, mounted]);

  function updateTool(tool: ToolName, plan: string, seats: number, monthlySpend: number) {
    setForm((prev) => {
      const existing = prev.tools.findIndex((t) => t.tool === tool);
      const entry = { tool, plan, seats, monthlySpend };
      if (existing >= 0) {
        const tools = [...prev.tools];
        tools[existing] = entry;
        return { ...prev, tools };
      }
      return { ...prev, tools: [...prev.tools, entry] };
    });
  }

  function removeTool(tool: ToolName) {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.tool !== tool),
    }));
  }

  async function handleSubmit() {
    if (form.tools.length === 0) {
      setError("Add at least one AI tool to audit.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/results/${data.slug}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Team size
          </label>
          <input
            type="number"
            min={1}
            value={form.teamSize}
            onChange={(e) =>
              setForm((p) => ({ ...p, teamSize: Number(e.target.value) }))
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Primary use case
          </label>
          <UseCaseSelect
            value={form.useCase}
            onChange={(v) => setForm((p) => ({ ...p, useCase: v }))}
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Your AI tools
        </h2>
        <div className="space-y-3">
          {TOOLS.map((tool) => (
            <ToolRow
              key={tool}
              tool={tool}
              existing={form.tools.find((t) => t.tool === tool)}
              onUpdate={updateTool}
              onRemove={removeTool}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? "Running audit..." : "Run My Audit →"}
      </button>
    </div>
  );
}