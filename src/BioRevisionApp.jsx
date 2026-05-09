import React, { useMemo, useState } from "react";

const syllabus = [
  { topic: "Cell Biology", subtopics: ["Cell theory", "Membranes", "Transport", "Cell division"] },
  { topic: "Molecular Biology", subtopics: ["Water", "Carbohydrates/Lipids", "DNA replication", "Protein synthesis"] },
  { topic: "Genetics", subtopics: ["Mendelian inheritance", "Meiosis", "Gene linkage", "Mutations"] },
  { topic: "Ecology", subtopics: ["Communities", "Energy flow", "Carbon cycle", "Climate change"] },
  { topic: "Evolution & Biodiversity", subtopics: ["Selection", "Speciation", "Classification", "Cladistics"] },
  { topic: "Human Physiology", subtopics: ["Digestion", "Gas exchange", "Nervous system", "Immunity"] },
];

const questionBank = [
  { id: 1, topic: "Cell Biology", type: "mcq", prompt: "Which process requires ATP?", choices: ["Osmosis", "Facilitated diffusion", "Active transport", "Simple diffusion"], answer: 2 },
  { id: 2, topic: "Molecular Biology", type: "mcq", prompt: "DNA polymerase synthesizes DNA in which direction?", choices: ["3' to 5'", "5' to 3'", "Both", "Neither"], answer: 1 },
  { id: 3, topic: "Genetics", type: "short", prompt: "State one difference between mitosis and meiosis.", rubric: "Any valid structural/genetic difference." },
  { id: 4, topic: "Ecology", type: "data", prompt: "A population rose from 100 to 145 in one year. Calculate % increase.", rubric: "45%" },
  { id: 5, topic: "Human Physiology", type: "mcq", prompt: "Which cells produce antibodies?", choices: ["T helper cells", "B lymphocytes", "Macrophages", "Neutrophils"], answer: 1 },
];

function ProgressBar({ value }) {
  return (
    <div style={{ background: "#e2e8f0", borderRadius: 999, overflow: "hidden", height: 10 }}>
      <div style={{ width: `${value}%`, background: "#2563eb", height: "100%" }} />
    </div>
  );
}

export default function BioRevisionApp() {
  const [topicFilter, setTopicFilter] = useState("All");
  const [answers, setAnswers] = useState({});
  const [showReport, setShowReport] = useState(false);

  const filteredQuestions = useMemo(
    () => questionBank.filter((q) => topicFilter === "All" || q.topic === topicFilter),
    [topicFilter],
  );

  const topicStats = useMemo(() => {
    return syllabus.map(({ topic }) => {
      const topicQuestions = questionBank.filter((q) => q.topic === topic && q.type === "mcq");
      const attempted = topicQuestions.filter((q) => answers[q.id] !== undefined);
      const correct = attempted.filter((q) => answers[q.id] === q.answer).length;
      const score = attempted.length ? Math.round((correct / attempted.length) * 100) : 0;
      return { topic, attempted: attempted.length, total: topicQuestions.length, score };
    });
  }, [answers]);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <h1>IB Biology Revision Trainer (2026)</h1>
      <p>
        This app is designed for ethical revision: syllabus-aligned practice and performance tracking.
        It does not include leaked exam content or copyrighted paper text dumps.
      </p>

      <section>
        <h2>Syllabus Coverage</h2>
        {syllabus.map((unit) => (
          <details key={unit.topic} style={{ marginBottom: 10 }}>
            <summary><strong>{unit.topic}</strong></summary>
            <ul>{unit.subtopics.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
        ))}
      </section>

      <section>
        <h2>Practice Generator</h2>
        <label>
          Topic:
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} style={{ marginLeft: 8 }}>
            <option>All</option>
            {syllabus.map((s) => <option key={s.topic}>{s.topic}</option>)}
          </select>
        </label>

        <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
          {filteredQuestions.map((q) => (
            <article key={q.id} style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12 }}>
              <p><strong>{q.topic}</strong> · {q.type.toUpperCase()}</p>
              <p>{q.prompt}</p>
              {q.type === "mcq" ? (
                <div style={{ display: "grid", gap: 6 }}>
                  {q.choices.map((c, i) => (
                    <label key={c}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[q.id] === i}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                      /> {c}
                    </label>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#475569" }}>Open response. Suggested markscheme: {q.rubric}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <button onClick={() => setShowReport((v) => !v)}>{showReport ? "Hide" : "Show"} Strength/Weakness Report</button>
        {showReport && (
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {topicStats.map((s) => (
              <div key={s.topic} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{s.topic}</strong>
                  <span>{s.score}% ({s.attempted}/{s.total} MCQ attempted)</span>
                </div>
                <ProgressBar value={s.score} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
