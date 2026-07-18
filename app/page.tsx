"use client";

import {
  Activity, AlertTriangle, BarChart3, Check, CheckCircle2, ChevronRight, ClipboardList,
  Clock3, FileText, FlaskConical, Info, Pencil, Play, RotateCcw, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Fact = { label: string; value: string; source_quote: string };
type Evidence = { reason: string; source_quote: string; rule: string };
type Analysis = {
  urgency: "Emergency" | "Urgent" | "Routine" | "Insufficient information";
  timeframe: string; confidence: number; summary: string; facts: Fact[]; evidence: Evidence[];
  missing_information: string[]; suggested_pathway: string; safety_note: string;
  demoMode?: boolean; model?: string; fallbackReason?: string;
};

const cases = [
  {
    id: "REF-SYN-04157", label: "Iron-deficiency anaemia", expected: "Urgent",
    text: "58-year-old man with iron-deficiency anaemia. Hb 9.8 g/dL, MCV 76 fL, ferritin 8 µg/L. Intermittent dark stools for 6 weeks, no haemodynamic instability. No prior OGD or colonoscopy. Not taking anticoagulants or antiplatelets.",
  },
  {
    id: "REF-SYN-04158", label: "Active GI bleeding", expected: "Emergency",
    text: "67-year-old with large-volume haematemesis today, dizzy and haemodynamically unstable. Blood pressure 82/48 mmHg and pulse 122/min. Requires immediate acute assessment.",
  },
  {
    id: "REF-SYN-04159", label: "Stable reflux", expected: "Routine",
    text: "36-year-old with intermittent heartburn after meals for 4 months. Symptoms improve with antacid. No dysphagia, weight loss, bleeding, anaemia, vomiting or family history of upper gastrointestinal cancer.",
  },
];

const initialAnalysis: Analysis = {
  urgency: "Urgent", timeframe: "Within 2 weeks", confidence: 0.91,
  summary: "Adult male with iron-deficiency anaemia and possible gastrointestinal blood loss warrants expedited evaluation.",
  facts: [
    { label: "Presenting problem", value: "Iron-deficiency anaemia", source_quote: "iron-deficiency anaemia" },
    { label: "Haemoglobin", value: "9.8 g/dL", source_quote: "Hb 9.8 g/dL" },
    { label: "Ferritin", value: "8 µg/L", source_quote: "ferritin 8 µg/L" },
  ],
  evidence: [
    { reason: "Iron-deficiency anaemia in an adult male is a gastrointestinal alarm feature.", source_quote: "58-year-old man with iron-deficiency anaemia", rule: "Synthetic rule GI-IDA-01" },
    { reason: "Dark stools raise concern for gastrointestinal blood loss.", source_quote: "Intermittent dark stools", rule: "Synthetic rule GI-BLEED-02" },
    { reason: "No previous endoscopic evaluation is documented.", source_quote: "No prior OGD or colonoscopy", rule: "Synthetic rule GI-IDA-03" },
  ],
  missing_information: ["Repeat full blood count trend", "Haemodynamic observations"],
  suggested_pathway: "Expedited bidirectional endoscopic assessment",
  safety_note: "Clinician review is required before any action.", demoMode: true,
};

function highlightedText(text: string, quote?: string) {
  if (!quote) return text;
  const index = text.toLowerCase().indexOf(quote.toLowerCase());
  if (index < 0) return text;
  return <>{text.slice(0, index)}<mark>{text.slice(index, index + quote.length)}</mark>{text.slice(index + quote.length)}</>;
}

export default function Home() {
  const [view, setView] = useState<"workspace" | "evaluation" | "safety">("workspace");
  const [caseIndex, setCaseIndex] = useState(0);
  const [text, setText] = useState(cases[0].text);
  const [analysis, setAnalysis] = useState<Analysis | null>(initialAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeEvidence, setActiveEvidence] = useState<number | null>(null);
  const [decision, setDecision] = useState<"approved" | "edited" | "rejected" | null>(null);
  const [audit, setAudit] = useState<string[]>([]);

  const selectedQuote = activeEvidence === null ? undefined : analysis?.evidence[activeEvidence]?.source_quote;
  const confidence = useMemo(() => analysis ? Math.round(analysis.confidence * 100) : 0, [analysis]);

  function chooseCase(index: number) {
    setCaseIndex(index); setText(cases[index].text); setAnalysis(null); setDecision(null); setError("");
  }

  async function analyse() {
    setLoading(true); setError(""); setDecision(null); setActiveEvidence(null);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ referralText: text }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed.");
      setAnalysis(data);
      setAudit((items) => [`${new Date().toLocaleTimeString()} — analysis generated (${data.demoMode ? "demo" : data.model})`, ...items]);
    } catch (err) { setError(err instanceof Error ? err.message : "Analysis failed."); }
    finally { setLoading(false); }
  }

  function record(action: "approved" | "edited" | "rejected") {
    setDecision(action);
    setAudit((items) => [`${new Date().toLocaleTimeString()} — clinician ${action} recommendation`, ...items]);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><div className="brandmark"><Activity size={20} /></div><div><h1>Clinical Referral Copilot</h1><span>Transparent triage decision support</span></div></div>
        <div className="synthetic"><FlaskConical size={15} /> Synthetic data only</div>
        <div className="privacy"><ShieldCheck size={18} /><span><b>Privacy:</b> identifier guard active</span><i /></div>
      </header>

      <nav className="navtabs" aria-label="Primary navigation">
        <button className={view === "workspace" ? "active" : ""} onClick={() => setView("workspace")}><ClipboardList size={16} />Workspace</button>
        <button className={view === "evaluation" ? "active" : ""} onClick={() => setView("evaluation")}><BarChart3 size={16} />Evaluation</button>
        <button className={view === "safety" ? "active" : ""} onClick={() => setView("safety")}><ShieldCheck size={16} />Safety case</button>
      </nav>

      {view === "workspace" && <div className="workspace">
        <aside className="steps" aria-label="Workflow stages">
          <div className="step complete"><span><Check size={16} /></span><div><b>Intake</b><small>Complete</small></div></div>
          <div className={`step ${analysis ? "complete" : "current"}`}><span>{analysis ? <Check size={16} /> : "2"}</span><div><b>Analysis</b><small>{analysis ? "Complete" : "Ready"}</small></div></div>
          <div className={`step ${decision ? "complete" : analysis ? "current" : ""}`}><span>{decision ? <Check size={16} /> : "3"}</span><div><b>Review</b><small>{decision ? "Recorded" : "Clinician"}</small></div></div>
        </aside>

        <section className="card intake">
          <div className="cardtitle"><div><FileText size={20} /><h2>Referral intake</h2></div><button className="reset" onClick={() => chooseCase(caseIndex)}><RotateCcw size={14} />Reset</button></div>
          <div className="casepicker" role="tablist" aria-label="Synthetic cases">
            {cases.map((item, index) => <button key={item.id} className={caseIndex === index ? "active" : ""} onClick={() => chooseCase(index)}>{item.label}</button>)}
          </div>
          <div className="meta"><div><small>Referral ID</small><b>{cases[caseIndex].id}</b></div><div><small>Source</small><b>Synthetic GP referral</b></div><div><small>Specialty</small><b>Gastroenterology</b></div></div>
          <label className="fieldlabel" htmlFor="referral">Referral narrative</label>
          <div className="editorwrap">
            {selectedQuote && <div className="highlightpreview" aria-hidden="true">{highlightedText(text, selectedQuote)}</div>}
            <textarea id="referral" value={text} onChange={(e) => { setText(e.target.value); setAnalysis(null); setDecision(null); }} maxLength={6000} spellCheck={false} />
          </div>
          <div className="editorfooter"><span><ShieldCheck size={14} />Synthetic cases only. Potential identifiers are blocked.</span><span>{text.length} / 6000</span></div>
          {error && <div className="error"><AlertTriangle size={16} />{error}</div>}
          <button className="analyse" onClick={analyse} disabled={loading || text.length < 20}>{loading ? <><span className="spinner" />Analysing with GPT‑5.6…</> : <><Sparkles size={18} />Analyse referral<ChevronRight size={17} /></>}</button>
        </section>

        <section className="card results" aria-live="polite">
          <div className="cardtitle"><div><Sparkles size={20} /><h2>Copilot analysis</h2></div>{analysis && <span className="mode">{analysis.demoMode ? "Demo engine" : analysis.model}</span>}</div>
          {!analysis ? <div className="empty"><div><Sparkles size={28} /></div><h3>Ready to analyse</h3><p>Review the synthetic narrative, then generate a structured, traceable recommendation.</p></div> : <>
            <div className={`verdict ${analysis.urgency.toLowerCase().replace(" ", "-")}`}>
              <div><Clock3 size={30} /><span><small>Urgency assessment</small><strong>{analysis.urgency} — {analysis.timeframe}</strong></span></div>
              <div className="confidence"><span>{confidence}%</span><small>confidence</small></div>
            </div>
            <p className="summary">{analysis.summary}</p>
            <div className="sectionhead"><h3>Evidence and rationale</h3><span>Select a reason to trace it</span></div>
            <div className="evidence">
              {analysis.evidence.map((item, index) => <button key={`${item.rule}-${index}`} className={activeEvidence === index ? "active" : ""} onClick={() => setActiveEvidence(activeEvidence === index ? null : index)}>
                <span className="evidenceicon"><CheckCircle2 size={18} /></span><span><b>{item.reason}</b><small>“{item.source_quote}”</small><code>{item.rule}</code></span><ChevronRight size={16} />
              </button>)}
            </div>
            <div className="safety"><AlertTriangle size={20} /><div><b>Clinician review required</b><span>{analysis.safety_note} No action is taken until you confirm.</span></div></div>
            <div className="pathway"><div><small>Suggested pathway</small><b>{analysis.suggested_pathway}</b></div><span>Advisory only</span></div>
            <div className="actions"><span>Clinician decision</span><div>
              <button className={decision === "approved" ? "selected approve" : "approve"} onClick={() => record("approved")}><Check size={17} />{decision === "approved" ? "Approved" : "Approve"}</button>
              <button className={decision === "edited" ? "selected edit" : "edit"} onClick={() => record("edited")}><Pencil size={16} />Edit</button>
              <button className={decision === "rejected" ? "selected reject" : "reject"} onClick={() => record("rejected")}><X size={17} />Reject</button>
            </div></div>
          </>}
        </section>

        <aside className="audit card"><div className="cardtitle"><div><ShieldCheck size={18} /><h2>Audit trail</h2></div></div>{audit.length ? audit.slice(0, 4).map((item) => <p key={item}>{item}</p>) : <p>No decisions recorded in this session.</p>}<small>Referral text is never written to the audit trail.</small></aside>
      </div>}

      {view === "evaluation" && <Evaluation />}
      {view === "safety" && <Safety />}

      <footer><Info size={16} /><span>Synthetic demonstration only. AI-generated insight for clinician review; clinical judgment prevails.</span><b>Clinician in the loop</b></footer>
    </main>
  );
}

function Evaluation() {
  const rows = [
    ["Iron-deficiency anaemia", "Urgent", "Urgent", "Pass"], ["Active GI bleeding", "Emergency", "Emergency", "Pass"],
    ["Stable reflux", "Routine", "Routine", "Pass"], ["Progressive dysphagia", "Urgent", "Urgent", "Pass"],
    ["Incomplete abdominal pain", "Insufficient", "Routine", "Review"],
  ];
  return <section className="subpage"><div className="pageintro"><span>Evaluation harness</span><h2>Performance you can inspect—not merely trust.</h2><p>A small synthetic gold set makes disagreement visible and keeps evaluation separate from persuasive demo cases.</p></div><div className="metrics"><article><small>Exact urgency agreement</small><strong>80%</strong><span>4 of 5 synthetic cases</span></article><article><small>Emergency sensitivity</small><strong>100%</strong><span>1 of 1 emergency cases</span></article><article><small>Evidence trace coverage</small><strong>100%</strong><span>Every recommendation</span></article><article><small>Silent autonomous actions</small><strong>0</strong><span>Human confirmation required</span></article></div><div className="evaltable card"><div className="tablehead"><h3>Synthetic case results</h3><span>Illustrative baseline</span></div><table><thead><tr><th>Case</th><th>Expected</th><th>Copilot</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><span className={row[3] === "Pass" ? "pass" : "review"}>{row[3]}</span></td></tr>)}</tbody></table></div></section>;
}

function Safety() {
  return <section className="subpage"><div className="pageintro"><span>Safety case</span><h2>Boundaries are product features.</h2><p>The demonstration is designed to show what the system refuses to do, who remains accountable and what evidence supports each recommendation.</p></div><div className="safetygrid"><article className="card"><ShieldCheck /><h3>Synthetic-only boundary</h3><p>Common Singapore identifiers, phone numbers and email addresses are blocked before model processing. The deployed demo must never receive real patient data.</p></article><article className="card"><ClipboardList /><h3>Human authority</h3><p>The copilot recommends. A clinician approves, edits or rejects. No booking, messaging or order is initiated automatically.</p></article><article className="card"><FileText /><h3>Traceable evidence</h3><p>Every reason links to an exact source phrase and a clearly labelled synthetic rule rather than hidden institutional policy.</p></article><article className="card"><AlertTriangle /><h3>Known limitations</h3><p>Referral text may be incomplete, contradictory or clinically ambiguous. Model output requires local validation, monitoring and governance before real use.</p></article></div></section>;
}
