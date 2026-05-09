import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { monthlySavings, useCase, teamSize, recommendations } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `You are an AI spend analyst. Write a 80-100 word personalized audit summary for a ${teamSize}-person team using AI tools primarily for ${useCase}.
Their total potential monthly savings is $${monthlySavings}.
Top recommendations: ${recommendations?.join(", ") ?? "none"}.
Be direct, specific, and encouraging. No fluff. Don't start with "I".`,
        },
      ],
    });

    const text = (response.content[0] as { text: string }).text;
    return NextResponse.json({ summary: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Summary generation failed" }, { status: 500 });
  }
}