import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { hasGroundedSourceQuotes } from "../../lib/analysis-validation";
import { modelFailureAudit } from "../../lib/audit-log";
import { checkRateLimit } from "../../lib/rate-limit";
import { detectPotentialIdentifier, guardInput } from "../../lib/security";

export const runtime = "nodejs";

const MAX_LENGTH = 6000;

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["urgency", "timeframe", "confidence", "summary", "facts", "evidence", "missing_information", "suggested_pathway", "safety_note"],
  properties: {
    urgency: { type: "string", enum: ["Emergency", "Urgent", "Routine", "Insufficient information"] },
    timeframe: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    summary: { type: "string" },
    facts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value", "source_quote"],
        properties: { label: { type: "string" }, value: { type: "string" }, source_quote: { type: "string" } },
      },
    },
    evidence: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["reason", "source_quote", "rule"],
        properties: { reason: { type: "string" }, source_quote: { type: "string" }, rule: { type: "string" } },
      },
    },
    missing_information: { type: "array", items: { type: "string" } },
    suggested_pathway: { type: "string" },
    safety_note: { type: "string" },
  },
} as const;

function demoAnalysis(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("haemodynamic") && lower.includes("unstable")) {
    return {
      urgency: "Emergency", timeframe: "Immediate emergency assessment", confidence: 0.96,
      summary: "Active gastrointestinal bleeding with physiological instability requires emergency care.",
      facts: [{ label: "Instability", value: "Reported", source_quote: "haemodynamically unstable" }],
      evidence: [{ reason: "Instability in suspected gastrointestinal bleeding is an emergency feature.", source_quote: "haemodynamically unstable", rule: "Safety rule: active bleeding + instability → emergency" }],
      missing_information: ["Current observations", "Resuscitation status"], suggested_pathway: "Emergency department / acute medical assessment", safety_note: "Do not delay emergency care for referral processing.", demoMode: true,
    };
  }
  if (lower.includes("iron-deficiency") || lower.includes("iron deficiency") || lower.includes("ferritin 8")) {
    return {
      urgency: "Urgent", timeframe: "Within 2 weeks", confidence: 0.91,
      summary: "Adult male with iron-deficiency anaemia and possible gastrointestinal blood loss warrants expedited evaluation.",
      facts: [
        { label: "Presenting problem", value: "Iron-deficiency anaemia", source_quote: "iron-deficiency anaemia" },
        { label: "Haemoglobin", value: "9.8 g/dL", source_quote: "Hb 9.8 g/dL" },
        { label: "Ferritin", value: "8 µg/L", source_quote: "ferritin 8 µg/L" },
      ],
      evidence: [
        { reason: "Iron-deficiency anaemia in an adult male is a gastrointestinal alarm feature.", source_quote: "58-year-old man with iron-deficiency anaemia", rule: "Synthetic rule GI-IDA-01" },
        { reason: "Dark stools raise concern for gastrointestinal blood loss.", source_quote: "Intermittent dark stools", rule: "Synthetic rule GI-BLEED-02" },
        { reason: "No previous endoscopic evaluation is documented.", source_quote: "No prior OGD or colonoscopy", rule: "Synthetic rule GI-IDA-03" },
      ],
      missing_information: ["Repeat full blood count trend", "Haemodynamic observations"], suggested_pathway: "Expedited bidirectional endoscopic assessment", safety_note: "Clinician review is required before any action.", demoMode: true,
    };
  }
  return {
    urgency: "Routine", timeframe: "Routine appointment", confidence: 0.72,
    summary: "No emergency or urgent synthetic rule was identified in the supplied referral.",
    facts: [{ label: "Referral", value: "Stable presentation", source_quote: text.slice(0, 80) }],
    evidence: [{ reason: "No documented instability or alarm feature matched the demonstration rules.", source_quote: text.slice(0, 80), rule: "Synthetic rule GI-ROUTINE-01" }],
    missing_information: ["Confirm symptom duration", "Confirm alarm features"], suggested_pathway: "Routine specialist review", safety_note: "A clinician must verify completeness and urgency.", demoMode: true,
  };
}

export async function POST(request: NextRequest) {
  let body: { referralText?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const text = body.referralText?.trim() || "";
  if (text.length < 20 || text.length > MAX_LENGTH) return NextResponse.json({ error: `Referral must contain 20–${MAX_LENGTH} characters.` }, { status: 400 });

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const rateLimit = checkRateLimit(clientKey);
  if (!rateLimit.allowed) {
    console.warn(JSON.stringify({ event: "request_blocked", reasonCode: "rate-limit" }));
    return NextResponse.json(
      { error: "Too many analysis requests. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const injection = guardInput({ referralText: text });
  if (injection.blocked) {
    console.warn(JSON.stringify({ event: "input_blocked", field: injection.field, reasonCode: injection.reasonCode }));
    return NextResponse.json({ error: "Instruction-like content detected. This demonstration accepts synthetic clinical narratives only." }, { status: 422 });
  }

  const identifier = detectPotentialIdentifier(text);
  if (identifier.blocked) {
    console.warn(JSON.stringify({ event: "input_blocked", field: "referralText", reasonCode: identifier.reasonCode }));
    return NextResponse.json({ error: "Potential personal identifier detected. This demonstration accepts synthetic data only." }, { status: 422 });
  }

  if (!process.env.OPENAI_API_KEY) return NextResponse.json(demoAnalysis(text));

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-5.6";
    console.info(JSON.stringify({ event: "model_call", model }));
    const response = await client.responses.create({
      model,
      reasoning: { effort: "medium" },
      max_output_tokens: 4000,
      store: false,
      instructions: `You are a clinician-facing referral triage copilot operating only on synthetic gastroenterology referrals. Extract only facts explicitly present. Apply the synthetic demonstration policy below; do not cite real institutional policy. Never claim to replace clinician judgment. If emergency instability is present choose Emergency. Adult male/postmenopausal iron-deficiency anaemia, overt GI bleeding without instability, progressive dysphagia, or strongly concerning cancer features may be Urgent. Stable symptoms without alarm features may be Routine. If crucial information is absent choose Insufficient information. Every evidence item must include an exact short source quote and a transparent synthetic rule label.`,
      input: `Analyse this synthetic referral:\n\n${text}`,
      text: { format: { type: "json_schema", name: "referral_triage", strict: true, schema } },
    });
    const parsed = JSON.parse(response.output_text);
    if (!hasGroundedSourceQuotes(parsed, text)) {
      console.warn(JSON.stringify({ event: "model_output_rejected", reasonCode: "ungrounded-source-quote" }));
      return NextResponse.json({ ...demoAnalysis(text), fallbackReason: "Live output failed evidence-grounding validation; deterministic demonstration shown." });
    }
    return NextResponse.json({ ...parsed, demoMode: false, model: response.model });
  } catch (error) {
    console.error(JSON.stringify(modelFailureAudit(error)));
    return NextResponse.json({ ...demoAnalysis(text), fallbackReason: "Live model unavailable; deterministic demonstration shown." });
  }
}
