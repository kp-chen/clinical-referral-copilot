# Run log

## 2026-07-18 — Build Week publication and deployment

- Status: blocked-awaiting-input
- Scope: harden, verify, publish, deploy, and prepare submission artifacts.
- Privacy boundary: synthetic data only; no patient data used.
- Source destination: public repository `kp-chen/clinical-referral-copilot`; application commit `ce9ba96e88ebb9282b6c2aed02f00be912e2f694` was pushed to `main`.
- Deployment destination: at `2026-07-18 10:00 +08:00`, `https://clinical-referral-copilot.vercel.app` resolved to deployment `dpl_8fNkqjLTh5k4E8RFFp1cHjXn7HqV` for commit `ce9ba96e88ebb9282b6c2aed02f00be912e2f694`; Vercel reported `READY`, a clean build, and no alias error. Health returned HTTP 200 with `liveModelAvailable: true`; safe analysis returned HTTP 200 using the labelled fallback; identifier and prompt-injection probes returned HTTP 422; the attempted OpenAI call returned HTTP 429 `insufficient_quota`.
- Current evidence: 17 tests passed; ESLint passed; production build passed; npm audit reports 0 vulnerabilities; desktop and 390 px browser checks passed with no console errors or horizontal overflow; clinician decision, traceability, evaluation, safety, and blocked-input flows were browser-verified.
- Submission artifacts: 1280×720 thumbnail destination-verified; 97-second 1920×1080 H.264/AAC draft demo destination-verified; captions, timed script, YouTube copy, and Devpost copy prepared.
- Current runtime: `OPENAI_API_KEY` is present and `/api/health` reports `liveModelAvailable: true`, but the upstream OpenAI request returned HTTP 429 `insufficient_quota`; the public app therefore correctly returned its labelled deterministic fallback with `demoMode: true`.
- Safety follow-up: replaced full SDK-error logging with a content-free `{event,status,code}` audit record and added regression coverage. Repeating the production failure produced only `{"event":"model_call_failed","status":429,"code":"insufficient_quota"}` in the runtime log; the prior upstream messages and headers were absent.
- Pending on KP: provide an OpenAI Platform key from a project with available API quota or enable quota for the current project. After quota is available: prove `demoMode: false`, replace the demo-engine capture with live-model proof, decide analytics, upload the video, add its URL to Devpost, and submit.
