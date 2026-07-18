# Clinical Referral Copilot — demo script

Target duration: approximately 1 minute 37 seconds. All cases shown are synthetic.

| Time | Screen | Voiceover |
|---|---|---|
| 00:00–00:08 | Project thumbnail | Referral triage is high stakes. Clinical Referral Copilot offers a safer pattern: AI structures; clinicians decide. |
| 00:08–00:23 | Workspace | Using only synthetic gastroenterology referrals, a clinician reviews the narrative and asks for a structured urgency recommendation. The server-side key never reaches the browser. |
| 00:23–00:42 | Evidence trace | GPT five point six uses the OpenAI Responses API with strict Structured Outputs and no storage. It returns urgency, confidence, facts, missing information, and reasons. Selecting a reason highlights the exact source phrase and its synthetic rule. |
| 00:42–00:54 | Clinician decision | The model cannot take clinical action. A clinician approves, edits, or rejects, while the audit records that decision without storing the referral narrative. |
| 00:54–01:07 | Evaluation | The evaluation view separates evidence from persuasion. This tiny synthetic gold set is illustrative: four labels agree, while one disagreement remains visible. |
| 01:07–01:22 | Safety case / blocked input | Identifiers, phone numbers, email addresses, and high-confidence prompt-injection patterns are blocked before any model call. Evidence appears only when every quoted phrase exists in the supplied narrative. |
| 01:22–01:37 | Project thumbnail | This is not a medical device and makes no clinical-performance claim. It is a Build Week prototype of transparent, clinician-in-the-loop reasoning: synthetic data, inspectable evidence, bounded agency, and human authority. |

## Recording notes

- Keep the browser zoom at 100% and use a 16:9 viewport.
- Pause briefly on the phrase-to-evidence highlight and the recorded clinician decision.
- Do not enter or display an API key, real patient data, Vercel settings, or OpenAI account details.
- The final uploaded video should remain under three minutes.
- The narration uses OpenAI `gpt-4o-mini-tts` with the `cedar` voice and must be disclosed as AI-generated in the publication copy.
