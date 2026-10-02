const skills = [
  {
    icon: "🦵",
    title: "Knee & Ligament Rehab",
    text: "ACL, MCL & meniscus recovery with progressive return-to-sport training.",
  },
  {
    icon: "🦴",
    title: "Shoulder & Rotator Cuff",
    text: "Repair and impingement rehab for throwers and overhead athletes.",
  },
  {
    icon: "🦶",
    title: "Ankle & Achilles Care",
    text: "Sprain management, taping, and Achilles tendinopathy protocols.",
  },
  {
    icon: "🧍",
    title: "Back & Spine Rehab",
    text: "Low-back and disc injury management with core retraining.",
  },
  {
    icon: "⚡",
    title: "Sports Injury Management",
    text: "Acute first aid, on-field assessment, and post-injury guidance.",
  },
  {
    icon: "📈",
    title: "Performance Recovery",
    text: "Return-to-play testing, load management, and injury prevention plans.",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <h2 className="section-title">Rehabilitation Expertise</h2>
        <div className="skills-grid">
          {skills.map((s) => (
            <div key={s.title} className="card skill-card">
              <h3>
                {s.icon} {s.title}
              </h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
