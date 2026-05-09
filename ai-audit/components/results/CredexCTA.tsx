import { formatCurrency } from "@/lib/utils";

interface Props {
  monthlySavings: number;
}

export default function CredexCTA({ monthlySavings }: Props) {
  return (
    <div className="rounded-2xl bg-slate-900 text-white p-6">
      <p className="text-sm font-medium text-emerald-400 mb-2">You qualify for Credex savings</p>
      <h2 className="text-xl font-bold mb-2">
        Capture {formatCurrency(monthlySavings)}/mo through discounted AI credits
      </h2>
      <p className="text-slate-400 text-sm mb-5">
        Credex sources discounted Cursor, Claude, and ChatGPT Enterprise credits from companies
        that overforecast. The discount is real — typically 15–30% off retail.
      </p>
      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        Book a Credex consultation →
      </a>
    </div>
  );
}