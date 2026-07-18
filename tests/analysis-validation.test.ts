import assert from "node:assert/strict";
import test from "node:test";
import { hasGroundedSourceQuotes } from "../app/lib/analysis-validation.js";

const source = "58-year-old man with iron-deficiency anaemia. Ferritin 8 µg/L.";

test("accepts exact source-grounded facts and evidence", () => {
  assert.equal(hasGroundedSourceQuotes({
    facts: [{ source_quote: "iron-deficiency anaemia" }],
    evidence: [{ source_quote: "Ferritin 8 µg/L" }],
  }, source), true);
});

test("rejects a hallucinated source quote", () => {
  assert.equal(hasGroundedSourceQuotes({
    facts: [{ source_quote: "iron-deficiency anaemia" }],
    evidence: [{ source_quote: "Family history of colorectal cancer" }],
  }, source), false);
});
