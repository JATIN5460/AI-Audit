import { formatCurrency } from "@/lib/utils";

interface Props {
  monthlySavings: number;
  annualSavings: number;
}

export default function AuditHero({ monthlySavings, annualSavings }: Props) {
  const isOptimal = monthlySavings === 0;

  return (
    <div className={`rounded-2xl p-8 text-center ${isOptimal ? "bg-blue-50 border border-blue-200" : "bg-emerald-50 border border-emerald-200"}`}>
      {isOptimal ? (
        <>
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">You're spending well</h1>
          <p className="text-slate-500">Your current AI stack looks well-optimised for your team size and use case.</p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-emerald-700 uppercase tracking-wide mb-2">
            Potential savings found
          </p>
          <div className="text-5xl font-bold text-emerald-700 mb-1">
            {formatCurrency(monthlySavings)}
            <span className="text-2xl font-medium text-emerald-600">/mo</span>
          </div>
          <div className="text-lg text-slate-500 mt-1">
            {formatCurrency(annualSavings)} per year
          </div>
        </>
      )}
    </div>
  );
}