# Run log

## 2026-07-18 — Build Week publication and deployment

- Status: partial-with-commit
- Scope: harden, verify, publish, deploy, and prepare submission artifacts.
- Privacy boundary: synthetic data only; no patient data used.
- Source destination: public repository `kp-chen/clinical-referral-copilot`; commit `39ea3beafc4a1131b968b79142685b4e8cf3d725` was destination-verified after push.
- Deployment destination: `https://clinical-referral-copilot.vercel.app`; anonymous page and health requests return HTTP 200, safe analysis returns HTTP 200, identifier and prompt-injection probes return HTTP 422, and Vercel reports no runtime errors in the checked window.
- Current evidence: 15 tests passed; ESLint passed; production build passed; npm audit reports 0 vulnerabilities; desktop and 390 px browser checks passed with no console errors or horizontal overflow; clinician decision, traceability, evaluation, safety, and blocked-input flows were browser-verified.
- Submission artifacts: 1280×720 thumbnail destination-verified; 97-second 1920×1080 H.264/AAC draft demo destination-verified; captions, timed script, YouTube copy, and Devpost copy prepared.
- Current runtime: the public deployment is intentionally using the labelled deterministic demo engine because no server-side `OPENAI_API_KEY` is configured in Vercel.
- Pending: add the production key, redeploy and verify `demoMode: false`; replace the demo-engine capture with live-model proof; decide analytics; upload the video; add its URL to Devpost; and submit.
