import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { AuditResult } from "@/lib/audit-engine/types";
import AuditHero from "@/components/results/AuditHero";
import ToolBreakdown from "@/components/results/ToolBreakdown";
import AISummary from "@/components/results/AISummary";
import CredexCTA from "@/components/results/CredexCTA";
import LeadCapture from "@/components/results/LeadCapture";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getAudit(slug: string): Promise<AuditResult | null> {
  const { data } = await supabaseAdmin
    .from("audits")
    .select("result")
    .eq("slug", slug)
    .single();
  return data?.result ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const audit = await getAudit(slug);
  if (!audit) return {};

  const savings = audit.totalMonthlySavings;
  const title = savings > 0
    ? AI Spend Audit — $${savings}/mo savings found
    : "AI Spend Audit — Your stack looks optimised";

  return {
    title,
    openGraph: {
      title,
      description: Potential annual savings: $${audit.totalAnnualSavings}. See the full breakdown.,
      url: ${process.env.NEXT_PUBLIC_APP_URL}/results/${slug},
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: $${audit.totalAnnualSavings}/year in potential AI tool savings.,
    },
  };
}

export default async function ResultsPage({ params }: Props) {
  const { slug } = await params;
  const audit = await getAudit(slug);
  if (!audit) notFound();

  const showCredex = audit.totalMonthlySavings > 500;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <AuditHero
          monthlySavings={audit.totalMonthlySavings}
          annualSavings={audit.totalAnnualSavings}
        />
        <AISummary summary={audit.summary} />
        <ToolBreakdown results={audit.results} />
        {showCredex && <CredexCTA monthlySavings={audit.totalMonthlySavings} />}
        <LeadCapture slug={slug} monthlySavings={audit.totalMonthlySavings} />
      </div>
    </main>
  );
}
