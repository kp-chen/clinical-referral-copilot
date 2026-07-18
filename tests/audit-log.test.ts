import assert from "node:assert/strict";
import test from "node:test";
import { modelFailureAudit } from "../app/lib/audit-log.js";

test("model failure audits retain only safe status and code", () => {
  const audit = modelFailureAudit({
    status: 429,
    code: "insufficient_quota",
    message: "sensitive upstream message",
    headers: { authorization: "secret", cookie: "secret" },
  });

  assert.deepEqual(audit, {
    event: "model_call_failed",
    status: 429,
    code: "insufficient_quota",
  });
  assert.equal(JSON.stringify(audit).includes("secret"), false);
  assert.equal(JSON.stringify(audit).includes("sensitive"), false);
});

test("model failure audits drop malformed upstream fields", () => {
  assert.deepEqual(modelFailureAudit({ status: "429", code: "quota expired: key=secret" }), {
    event: "model_call_failed",
  });
});
