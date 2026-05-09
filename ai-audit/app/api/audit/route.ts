import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { supabaseAdmin } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, useCase } = body;

    if (!tools || !teamSize || !useCase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = generateSlug();
    const auditInput = { tools, teamSize, useCase };
    const result = runAudit(auditInput, slug);

    // Generate AI summary with fallback
    let summary = fallbackSummary(result.totalMonthlySavings, useCase);
    try {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `You are an AI spend analyst. Write a 80-100 word personalized audit summary for a ${teamSize}-person team using AI tools primarily for ${useCase}. 
Their total potential monthly savings is $${result.totalMonthlySavings}. 
Top recommendations: ${result.results
              .filter((r) => r.savings > 0)
              .slice(0, 3)
              .map((r) => r.recommendedAction)
              .join(", ")}.
Be direct, specific, and encouraging. No fluff. Don't start with "I".`,
          },
        ],
      });
      summary = (response.content[0] as { text: string }).text;
    } catch {
      // fallback already set
    }

    result.summary = summary;

    // Store in Supabase
    const { error } = await supabaseAdmin.from("audits").insert({
      slug,
      input: auditInput,
      result,
    });

    if (error) throw error;

    return NextResponse.json({ slug, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}

function fallbackSummary(monthlySavings: number, useCase: string): string {
  if (monthlySavings === 0) {
    return `Your AI stack looks well-optimised for ${useCase} workflows. You're on the right plans for your team size. Keep an eye on usage as your team grows — plan mismatches tend to appear around the 5 and 10 seat marks.`;
  }
  return `Your audit identified $${monthlySavings}/mo in potential savings across your ${useCase} stack. The biggest wins come from plan right-sizing — you're paying for features your team size doesn't need. Acting on these recommendations could save you $${monthlySavings * 12}/year.`;
}