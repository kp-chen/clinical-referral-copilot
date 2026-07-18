# Devpost submission draft

## Project name

Clinical Referral Copilot

## Tagline

AI structures. Clinicians decide.

## Repository

https://github.com/kp-chen/clinical-referral-copilot

## Live demo

https://clinical-referral-copilot.vercel.app

## Video

YouTube URL: **pending upload**

Local verified file: `submission/clinical-referral-copilot-demo.mp4` (1 minute 37 seconds, 1920×1080)

## Codex Session ID

`019f72b1-3e62-7ae2-bff0-96a2190338fa`

## Inspiration

Referral triage is cognitively repetitive but clinically consequential. Key facts are buried in narrative text, urgency decisions are difficult to explain consistently, and many AI concepts hide their reasoning behind a polished answer. I wanted to explore a safer interaction pattern for healthcare: the model structures and explains, while a clinician retains authority.

## What it does

Clinical Referral Copilot turns a synthetic gastroenterology referral into a structured urgency recommendation with:

- extracted clinical facts;
- an urgency and timeframe;
- exact source-phrase-to-rationale traceability;
- transparent synthetic rule labels;
- missing information and uncertainty;
- a suggested pathway; and
- an explicit approve, edit, or reject decision.

Selecting a reason cross-highlights the exact supporting phrase in the referral. The product also includes a small illustrative evaluation view and a safety case that makes limitations and boundaries visible.

## How I built it

The app is a fresh Next.js and TypeScript implementation created during OpenAI Build Week. The server route calls GPT-5.6 through the OpenAI Responses API with medium reasoning effort, strict JSON Schema Structured Outputs, a bounded output budget, and `store: false`.

Before a model call, deterministic guards block common Singapore identifiers, phone numbers, email addresses, embedded tool-call payloads, and high-confidence prompt-injection patterns. Model evidence is rendered only when every returned source quote occurs in the submitted narrative. The public demo also has a best-effort per-instance request limit and a deterministic fallback so the complete clinician-review workflow remains inspectable without a key.

Codex was the primary engineering collaborator. It helped inspect prior domain lessons read-only, define the clean-room scope, compare product directions, implement the app, harden the LLM boundary, verify the API and browser flow, publish the repository, deploy to Vercel, and prepare the submission media.

## Challenges

- Preserving an editable referral experience without treating the model as the security boundary.
- Making evidence traceability a real product interaction rather than a generic explanation panel.
- Separating a persuasive demo from evaluation evidence and clinical claims.
- Keeping the public prototype useful while blocking obvious identifiers and prompt-injection attacks before any model call.

## Accomplishments

- Strict structured output through the Responses API.
- Exact phrase-to-rationale cross-highlighting.
- Clinician approve, edit, and reject workflow with a narrative-free session audit.
- Deterministic input guards, rate limiting, and source-quote grounding validation.
- Three synthetic gastroenterology cases, an illustrative evaluation view, and an explicit safety case.
- A responsive public deployment with zero current npm advisories and automated regression checks.

## What I learned

The most useful AI interface is not always the one that appears most autonomous. In a consequential workflow, visible evidence, explicit uncertainty, and a clear human decision point can be more valuable than additional actions. Structured Outputs make the interface predictable, but deterministic validation is still needed around both model input and output.

## What is next

A real clinical pilot would require locally approved referral policies, representative evaluation, clinical safety review, privacy impact assessment, cybersecurity testing, monitoring, accountable governance, and a durable distributed rate limiter. Future evaluation could measure clinician–AI agreement, override reasons, subgroup performance, calibration, and drift without retaining raw referral text.

## Built with

- OpenAI GPT-5.6
- OpenAI Responses API
- OpenAI `gpt-4o-mini-tts` with the Cedar voice
- Structured Outputs / JSON Schema
- Codex
- Next.js 16
- React 19
- TypeScript
- Vercel

## Safety statement

Synthetic demonstration only. Not a medical device. Not for clinical use. The system takes no clinical action; clinician judgment prevails.
