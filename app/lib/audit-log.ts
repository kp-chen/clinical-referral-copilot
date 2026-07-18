type UpstreamFailure = {
  status?: unknown;
  code?: unknown;
};

export function modelFailureAudit(error: unknown) {
  const failure = error && typeof error === "object" ? error as UpstreamFailure : {};
  const status = typeof failure.status === "number" ? failure.status : undefined;
  const code = typeof failure.code === "string" && /^[a-z0-9_-]{1,64}$/i.test(failure.code)
    ? failure.code
    : undefined;

  return {
    event: "model_call_failed",
    ...(status === undefined ? {} : { status }),
    ...(code === undefined ? {} : { code }),
  };
}
