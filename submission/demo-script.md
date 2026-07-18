# Clinical Referral Copilot — demo script

Target duration: approximately 1 minute 52 seconds. All cases shown are synthetic.

| Time | Screen | Voiceover |
|---|---|---|
| 00:00–00:08 | Project thumbnail | Referral triage is high stakes. This copilot offers a pattern: AI structures; clinicians decide. |
| 00:08–00:23 | Workspace | Using only synthetic gastroenterology referrals, a clinician reviews the narrative and asks for a structured urgency recommendation. The analysis runs securely on the server, so the API key never reaches the browser. |
| 00:23–00:42 | Evidence trace | GPT five point six uses the OpenAI Responses API with strict Structured Outputs and no storage. It returns urgency, confidence, facts, missing information, and reasons. Selecting a reason highlights the exact source phrase and its synthetic rule. |
| 00:42–00:54 | Clinician decision | The model cannot take clinical action. A clinician must approve, edit, or reject every recommendation, while the audit records that decision without storing the underlying referral narrative. |
| 00:54–01:07 | Evaluation | The evaluation view separates evidence from persuasion. This tiny synthetic gold set is illustrative: four labels agree, while one disagreement remains visible. |
| 01:07–01:22 | Safety case / blocked input | Identifiers, phone numbers, email addresses, and high-confidence prompt-injection patterns are blocked before any model call. Evidence appears only when every quoted phrase is verified for exact matching against the supplied narrative. |
| 01:22–01:37 | Codex collaboration | Codex helped turn the clinical concept into a clean-room Next.js build, shape the clinician-in-the-loop boundary, harden identifier and prompt-injection guards, and verify the API and browser workflow. |
| 01:37–01:52 | Project thumbnail | This is not a medical device and makes no clinical-performance claim. It is a Build Week prototype demonstrating transparent, clinician-in-the-loop reasoning: synthetic data, inspectable evidence, deliberately bounded agency, and final human authority. |

## Recording notes

- Keep the browser zoom at 100% and use a 16:9 viewport.
- Pause briefly on the phrase-to-evidence highlight and the recorded clinician decision.
- Do not enter or display an API key, real patient data, Vercel settings, or OpenAI account details.
- The final uploaded video should remain under three minutes and use selectable English captions rather than burned-in text.
- The narration uses OpenAI `gpt-4o-mini-tts` with the `cedar` voice and must be disclosed as AI-generated in the publication copy.
