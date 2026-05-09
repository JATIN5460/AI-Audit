import SpendForm from "@/components/form/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-16 px-4 text-center">
        <p className="text-sm font-medium text-emerald-600 mb-3 uppercase tracking-wide">
          Free · No login required
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Are you overpaying for AI tools?
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Enter your AI subscriptions and get an instant audit — where you're
          overspending, what to cut, and how much you'd save.
        </p>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <SpendForm />
      </section>
    </main>
  );
}