import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit, resetRateLimitsForTest } from "../app/lib/rate-limit.js";

test("allows requests up to the limit and blocks the next request", () => {
  resetRateLimitsForTest();
  assert.equal(checkRateLimit("test", 1000, 2, 1000).allowed, true);
  assert.equal(checkRateLimit("test", 1001, 2, 1000).allowed, true);
  const blocked = checkRateLimit("test", 1002, 2, 1000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
});

test("resets after the window", () => {
  resetRateLimitsForTest();
  checkRateLimit("test", 1000, 1, 1000);
  assert.equal(checkRateLimit("test", 2000, 1, 1000).allowed, true);
});
