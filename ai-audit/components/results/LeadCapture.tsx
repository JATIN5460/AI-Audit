"use client";

import { useState } from "react";

interface Props {
  slug: string;
  monthlySavings: number;
}

export default function LeadCapture({ slug, monthlySavings }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLowSavings = monthlySavings < 100;

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, auditSlug: slug, monthlySavings, website }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="font-semibold text-emerald-700">Report sent to {email} ✓</p>
        <p className="text-sm text-slate-500 mt-1">Check your inbox for the full audit.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-800 mb-1">
        {isLowSavings ? "Stay updated on new optimisations" : "Get this report in your inbox"}
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        {isLowSavings
          ? "We'll notify you when new savings apply to your stack."
          : "We'll send you the full breakdown and follow up if we can save you more."}
      </p>

      {/* Honeypot - hidden from real users */}
      <input
        type="text"
        value={website}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Work email *"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Company (optional)"
            value={company}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Role (optional)"
            value={role}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {loading ? "Sending..." : "Send me the report →"}
        </button>
      </div>
    </div>
  );
}