# Run log

## 2026-07-18 — Build Week publication and deployment

- Status: blocked-awaiting-input
- Scope: harden, verify, publish, deploy, and prepare submission artifacts.
- Privacy boundary: synthetic data only; no patient data used.
- Source destination: public repository `kp-chen/clinical-referral-copilot`; application commit `3b84f6f` was pushed to `main`.
- Deployment destination: at `2026-07-18 10:10 +08:00`, `https://clinical-referral-copilot.vercel.app` resolved to deployment `dpl_B7vku3MLfSH55EPFiNfKEdrLzhz4` for commit `3b84f6f`; Vercel reported `READY` with the canonical alias attached.
- Live-model proof: `/api/health` returned HTTP 200 with `liveModelAvailable: true`; the synthetic iron-deficiency-anaemia referral returned HTTP 200 with `demoMode: false`, resolved model `gpt-5.6-sol`, urgency `Urgent`, and eight extracted facts. All three returned evidence quotes were exact substrings of the submitted narrative. A prompt-injection probe returned HTTP 422 before model processing.
- Current evidence: 17 tests passed; ESLint passed; production build passed; npm audit reports 0 vulnerabilities; desktop, 1280×720, and 390 px browser checks passed with no console errors or horizontal overflow; clinician decision, exact phrase highlighting, approval recording, evaluation, safety, and blocked-input flows were browser-verified.
- Submission artifacts: 1280×720 thumbnail destination-verified; 97-second 1920×1080 H.264/AAC final demo rebuilt with live-model scenes and OpenAI `gpt-4o-mini-tts` Cedar narration, then destination-verified (SHA-256 `BE2160A5770B495440D998663E4A4D6FF8ABEDAA9CCC2E74E9E6689ADB7DA523`). The seven narration segments exactly match their 8/15/19/12/13/15/15-second scene windows; only segments 1 and 5 use subtle 5.5% and 6% tempo fitting. Burned captions use a dark navy backing; the previously illegible white-on-white frame at 00:12 was reproduced before the change and visually verified after it. Publication copy discloses that the voice is AI-generated.
- Analytics decision: PostHog and Vercel Analytics remain disabled per KP's instruction.
- Safety follow-up: replaced full SDK-error logging with a content-free `{event,status,code}` audit record and added regression coverage. Repeating the production failure produced only `{"event":"model_call_failed","status":429,"code":"insufficient_quota"}` in the runtime log; the prior upstream messages and headers were absent.
- Pending on KP: authorize the external publication step. Then upload the verified video to YouTube, add its URL to Devpost, and submit.
