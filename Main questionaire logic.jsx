import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const PALETTE = ["#4f46e5", "#22c55e", "#f59e0b", "#06b6d4"];

const QUESTIONS = [
  { id: "horizon", text: "How long do you plan to invest?", options: ["<3 years", "3-7 years", "7-15 years", "15+ years"] },
  { id: "reaction", text: "If your portfolio drops 15%, what do you do?", options: ["Sell", "Hold", "Add some", "Buy more"] },
  { id: "goal", text: "What’s your primary goal?", options: ["Preserve capital", "Income", "Growth & income", "Max growth"] }
];

const PROFILES = [
  { name: "Conservative", maxScore: 3, allocation: { Equities: 20, Bonds: 60, Cash: 20 } },
  { name: "Balanced", maxScore: 6, allocation: { Equities: 50, Bonds: 40, Cash: 10 } },
  { name: "Growth", maxScore: 9, allocation: { Equities: 70, Bonds: 25, Cash: 5 } },
  { name: "Aggressive", maxScore: 12, allocation: { Equities: 90, Bonds: 10, Cash: 0 } }
];

function getProfile(score) {
  return PROFILES.find((p) => score <= p.maxScore) || PROFILES[PROFILES.length - 1];
}

function Chart({ allocation }) {
  const data = Object.entries(allocation).map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={80} label>
          {data.map((entry, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function JointRiskProfiler() {
  const [person1, setPerson1] = useState({});
  const [person2, setPerson2] = useState({});

  const score1 = useMemo(() => Object.values(person1).reduce((a, b) => a + b, 0), [person1]);
  const score2 = useMemo(() => Object.values(person2).reduce((a, b) => a + b, 0), [person2]);
  const jointScore = useMemo(() => Math.round((score1 + score2) / 2), [score1, score2]);

  const profile1 = getProfile(score1);
  const profile2 = getProfile(score2);
  const profileJoint = getProfile(jointScore);

  return (
    <div>
      <h2>Person 1</h2>
      {QUESTIONS.map((q, qi) => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.options.map((opt, oi) => (
            <label key={oi} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name={`p1-${q.id}`}
                onChange={() => setPerson1({ ...person1, [q.id]: oi })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <h2>Person 2</h2>
      {QUESTIONS.map((q, qi) => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.options.map((opt, oi) => (
            <label key={oi} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name={`p2-${q.id}`}
                onChange={() => setPerson2({ ...person2, [q.id]: oi })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <h2>Results</h2>
      <p>Person 1 Profile: <strong>{profile1.name}</strong></p>
      <Chart allocation={profile1.allocation} />
      <p>Person 2 Profile: <strong>{profile2.name}</strong></p>
      <Chart allocation={profile2.allocation} />
      <p>Joint Profile: <strong>{profileJoint.name}</strong></p>
      <Chart allocation={profileJoint.allocation} />
    </div>
  );
}
