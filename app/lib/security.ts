// Focused TypeScript port of the canonical KP Phase 7 injection guard.
// The model is the target, not the security boundary.

const INJECTION_PATTERNS: ReadonlyArray<{ code: string; pattern: RegExp }> = [
  { code: "ignore-previous", pattern: /ignore\s+(all\s+)?previous\s+instructions/i },
  { code: "ignore-prior", pattern: /ignore\s+(all\s+)?prior\s+instructions/i },
  { code: "disregard", pattern: /disregard\s+(all|your|previous)/i },
  { code: "forget-instructions", pattern: /forget\s+(?:(?:all|your|previous|prior)\s+){1,4}instructions/i },
  { code: "mode-switch", pattern: /you\s+are\s+now\s+in\s+\w+\s+mode/i },
  { code: "diagnostic-mode", pattern: /diagnostic\s+mode/i },
  { code: "override-mode", pattern: /override\s+mode/i },
  { code: "developer-mode", pattern: /developer\s+mode/i },
  { code: "dan-mode", pattern: /DAN\s+mode/i },
  { code: "jailbreak", pattern: /jailbreak/i },
  { code: "system-prompt", pattern: /system\s+prompt/i },
  { code: "reveal-hidden", pattern: /reveal\s+(your|the)\s+(system|hidden|secret)/i },
  { code: "output-prompt", pattern: /output\s+(your|the)\s+(system|complete|full)\s+prompt/i },
  { code: "repeat-instructions", pattern: /repeat\s+(back\s+)?(the\s+)?(full\s+)?text\s+of\s+(your\s+)?instructions/i },
  { code: "extract-setup", pattern: /(include|output|show|display|print).{0,50}(setup|initial|original)\s+instructions/i },
  { code: "extract-hidden", pattern: /(include|output|show|display|print)\s+(your|the|all)\s+(system|hidden|secret|complete|full)/i },
  { code: "pretend", pattern: /pretend\s+you\s+are/i },
  { code: "act-as-if", pattern: /act\s+as\s+if\s+you\s+are/i },
  { code: "admin-escalation", pattern: /admin\s+(code|override|access)/i },
  { code: "qa-framing", pattern: /quality\s+assurance.{0,30}(verify|check|audit).{0,30}(config|instruction|prompt)/i },
  { code: "standard-audit", pattern: /standard\s+audit\s+procedure/i },
  { code: "verify-deployment", pattern: /verify\s+deployment\s+consistency/i },
  { code: "fake-transcript", pattern: /assistant:\s+.{0,50}(admin|override|credential|connection|password|secret|key)/i },
  { code: "transcript-poison", pattern: /transcript\s+of\s+(our\s+)?previous\s+conversation/i },
  { code: "fulltext-instructions", pattern: /(full\s+text|full\s+content).{0,30}(setup|initial|original|your)\s+instructions/i },
  { code: "also-important", pattern: /ALSO\s+IMPORTANT/i },
  { code: "important-verb", pattern: /IMPORTANT.{0,40}(output|include|reveal|disregard|forget|ignore)/i },
];

const IDENTIFIER_PATTERNS: ReadonlyArray<{ code: string; pattern: RegExp }> = [
  { code: "singapore-id", pattern: /\b[STFGM]\d{7}[A-Z]\b/i },
  { code: "singapore-phone", pattern: /\b(?:\+?65[\s-]?)?[689]\d{3}[\s-]?\d{4}\b/ },
  { code: "email", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
];

const TOOL_CALL_KEYS = new Set(["action", "tool", "function", "method"]);

export type GuardResult = { blocked: boolean; field?: string; reasonCode?: string };

export function detectPromptInjection(text: string): Omit<GuardResult, "field"> {
  for (const candidate of INJECTION_PATTERNS) {
    if (candidate.pattern.test(text)) return { blocked: true, reasonCode: candidate.code };
  }
  return detectEmbeddedJsonToolCall(text)
    ? { blocked: true, reasonCode: "embedded-json-tool-call" }
    : { blocked: false };
}

export function guardInput(fields: Record<string, string>): GuardResult {
  for (const [field, value] of Object.entries(fields)) {
    const result = detectPromptInjection(value);
    if (result.blocked) return { ...result, field };
  }
  return { blocked: false };
}

export function detectPotentialIdentifier(text: string): Omit<GuardResult, "field"> {
  for (const candidate of IDENTIFIER_PATTERNS) {
    if (candidate.pattern.test(text)) return { blocked: true, reasonCode: candidate.code };
  }
  return { blocked: false };
}

function detectEmbeddedJsonToolCall(text: string): boolean {
  const stripped = text.trim();
  if (!stripped.startsWith("{") && !stripped.startsWith("｛")) return false;

  const normalised = stripped
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/｛/g, "{")
    .replace(/｝/g, "}");

  try {
    const parsed: unknown = JSON.parse(normalised);
    return Boolean(parsed && typeof parsed === "object" && !Array.isArray(parsed)
      && Object.keys(parsed).some((key) => TOOL_CALL_KEYS.has(key)));
  } catch {
    return false;
  }
}
