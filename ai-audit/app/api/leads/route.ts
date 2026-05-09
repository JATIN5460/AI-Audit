import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendAuditConfirmation } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, role, teamSize, auditSlug, monthlySavings, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ ok: true }); // silently reject bots
    }

    if (!email || !auditSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get audit id
    const { data: audit } = await supabaseAdmin
      .from("audits")
      .select("id")
      .eq("slug", auditSlug)
      .single();

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Store lead
    const { error } = await supabaseAdmin.from("leads").insert({
      audit_id: audit.id,
      email,
      company: company || null,
      role: role || null,
      team_size: teamSize || null,
    });

    if (error) throw error;

    // Send confirmation email
    await sendAuditConfirmation(email, auditSlug, monthlySavings ?? 0);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lead capture failed" }, { status: 500 });
  }
}