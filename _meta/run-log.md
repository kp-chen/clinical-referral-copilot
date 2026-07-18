# Run log

## 2026-07-18 — Build Week publication and deployment

- Status: blocked-awaiting-input
- Scope: harden, verify, publish, deploy, and prepare submission artifacts.
- Privacy boundary: synthetic data only; no patient data used.
- Source destination: public repository `kp-chen/clinical-referral-copilot`; commit `39ea3beafc4a1131b968b79142685b4e8cf3d725` was destination-verified after push.
- Deployment destination: `https://clinical-referral-copilot.vercel.app`; deployment `dpl_4TDRYyomEm2bSGS81qxduBZm4R3Z` is `READY`, owns the canonical alias, and includes the server-side key. Anonymous page and health requests return HTTP 200; safe analysis returns HTTP 200 using the labelled fallback; identifier and prompt-injection probes return HTTP 422; the attempted OpenAI call returned HTTP 429 `insufficient_quota`.
- Current evidence: 17 tests passed; ESLint passed; production build passed; npm audit reports 0 vulnerabilities; desktop and 390 px browser checks passed with no console errors or horizontal overflow; clinician decision, traceability, evaluation, safety, and blocked-input flows were browser-verified.
- Submission artifacts: 1280×720 thumbnail destination-verified; 97-second 1920×1080 H.264/AAC draft demo destination-verified; captions, timed script, YouTube copy, and Devpost copy prepared.
- Current runtime: `OPENAI_API_KEY` is present and `/api/health` reports `liveModelAvailable: true`, but the upstream OpenAI request returned HTTP 429 `insufficient_quota`; the public app therefore correctly returned its labelled deterministic fallback with `demoMode: true`.
- Safety follow-up: replaced full SDK-error logging with a content-free `{event,status,code}` audit record and added regression coverage so upstream messages, headers, cookies, and credentials cannot spill into application logs.
- Pending on KP: provide an OpenAI Platform key from a project with available API quota or enable quota for the current project. After quota is available: prove `demoMode: false`, replace the demo-engine capture with live-model proof, decide analytics, upload the video, add its URL to Devpost, and submit.
