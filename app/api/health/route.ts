import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    model: process.env.OPENAI_MODEL || "gpt-5.6",
    liveModelAvailable: Boolean(process.env.OPENAI_API_KEY),
    dataPolicy: "synthetic-only",
  });
}
