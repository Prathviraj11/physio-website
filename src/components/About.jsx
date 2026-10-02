const credentials = [
  { icon: "🎓", text: "MPT — Sports Medicine" },
  { icon: "🩺", text: "Full-time practicing physiotherapist" },
  { icon: "🏃", text: "500+ athletes guided through rehab" },
  { icon: "🎯", text: "Sport-specific return-to-play protocols" },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About Dr. [Name]</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              With a <strong>Master of Physiotherapy (MPT) in Sports Medicine</strong>,
              Dr. [Name] brings advanced clinical expertise to every session. She is
              currently practicing as a <strong>full-time sports physiotherapist</strong>,
              helping athletes of every level return to the field with confidence.
            </p>
            <p>
              Her practice blends modern manual therapy, movement science, and
              sport-specific return-to-play protocols — so treatment isn't just
              about fixing an injury, but preventing the next one.
            </p>
          </div>
          <ul className="credential-list">
            {credentials.map((c) => (
              <li key={c.text}>
                <span>{c.icon}</span>
                {c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
