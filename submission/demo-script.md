# Clinical Referral Copilot — demo script

Target duration: approximately 1 minute 37 seconds. All cases shown are synthetic.

| Time | Screen | Voiceover |
|---|---|---|
| 00:00–00:08 | Project thumbnail | Referral triage is repetitive, high stakes, and difficult to explain after the decision. Clinical Referral Copilot explores a safer pattern: AI structures; clinicians decide. |
| 00:08–00:23 | Workspace | The demonstration uses only synthetic gastroenterology referrals. A clinician selects a case, reviews the narrative, and asks the copilot for a structured urgency recommendation. The server-side key never reaches the browser. |
| 00:23–00:42 | Evidence trace | GPT-5.6 runs through the OpenAI Responses API with strict Structured Outputs and `store: false`. The response contains an urgency, confidence, extracted facts, missing information, and reasons. Selecting a reason highlights its exact source phrase and shows the synthetic rule behind it. |
| 00:42–00:54 | Clinician decision | The model cannot book, message, order, or take clinical action. A clinician must approve, edit, or reject the recommendation, and the session audit records the decision without storing the referral narrative. |
| 00:54–01:07 | Evaluation | The evaluation view keeps evidence separate from persuasion. This tiny synthetic gold set is explicitly illustrative: four of five urgency labels agree, while one disagreement remains visible for review. |
| 01:07–01:22 | Safety case / blocked input | Safety boundaries are product features. Common Singapore identifiers, phone numbers, email addresses, and high-confidence prompt-injection patterns are blocked before any model call. Model evidence is rendered only when every quoted phrase exists in the supplied narrative. |
| 01:22–01:37 | Project thumbnail | This is not a medical device and makes no clinical-performance claim. It is a Build Week prototype of transparent, clinician-in-the-loop reasoning: synthetic data, inspectable evidence, bounded agency, and human authority. |

## Recording notes

- Keep the browser zoom at 100% and use a 16:9 viewport.
- Pause briefly on the phrase-to-evidence highlight and the recorded clinician decision.
- Do not enter or display an API key, real patient data, Vercel settings, or OpenAI account details.
- The final uploaded video should remain under three minutes.
