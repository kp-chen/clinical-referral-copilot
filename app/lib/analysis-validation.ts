type QuoteBearingItem = { source_quote?: unknown };

export function hasGroundedSourceQuotes(value: unknown, source: string): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { facts?: unknown; evidence?: unknown };
  if (!Array.isArray(candidate.facts) || !Array.isArray(candidate.evidence)) return false;
  if (candidate.facts.length === 0 || candidate.evidence.length === 0) return false;

  const sourceLower = source.toLocaleLowerCase();
  return [...candidate.facts, ...candidate.evidence].every((item: QuoteBearingItem) => {
    if (typeof item?.source_quote !== "string") return false;
    const quote = item.source_quote.trim();
    return quote.length > 0 && sourceLower.includes(quote.toLocaleLowerCase());
  });
}
