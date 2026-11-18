"use client";

import { FormEvent, useMemo, useState } from "react";

const nav = [
  ["⌘", "Overview"], ["◫", "Analytics"], ["◷", "Schedule"], ["▣", "Content library"], ["◎", "Community"],
];
const posts = [
  { title: "Studio launch behind the scenes", platform: "Instagram", time: "Today · 4:30 PM", tone: "Warm" },
  { title: "The making of a better workflow", platform: "LinkedIn", time: "Tomorrow · 9:00 AM", tone: "Professional" },
  { title: "Five ideas worth saving", platform: "X", time: "Fri · 12:15 PM", tone: "Direct" },
];
const bars = [38, 64, 48, 76, 55, 86, 69];

export default function Home() {
  const [prompt, setPrompt] = useState("A calm behind-the-scenes look at our creative process");
  const [generated, setGenerated] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [notice, setNotice] = useState("");
  const weekLabel = useMemo(() => new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date()), []);

  function createCaptions(event: FormEvent) {
    event.preventDefault();
    const subject = prompt.trim() || "your next post";
    setGenerated([
      `Small moments make the strongest stories. A little look inside ${subject.toLowerCase()}. ✦ #behindthescenes #creativity #socialmedia`,
      `Here’s what ${subject.toLowerCase()} looks like from our side of the desk. Save this for a little creative energy. #makersgonnamake #contentcreator`,
      `Made with intention, shared with you. ${subject} — what part speaks to you? #creativeprocess #community`,
    ]);
    setSelected(0);
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Captionly home"><span className="brand-mark">✦</span>captionly</a>
        <button className="new-post" onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}>＋ New post</button>
        <nav aria-label="Main navigation">
          <p className="nav-label">WORKSPACE</p>
          {nav.map(([icon, label], index) => <a className={index === 0 ? "nav-item active" : "nav-item"} href={index === 2 ? "#schedule" : "#top"} key={label}><span>{icon}</span>{label}</a>)}
          <p className="nav-label second">ACCOUNT</p>
          <a className="nav-item" href="#top"><span>⚙</span>Settings</a>
          <a className="nav-item" href="#top"><span>?</span>Help center</a>
        </nav>
        <div className="profile"><div className="avatar">MS</div><div><strong>Maria Santos</strong><small>Creator plan</small></div><span className="dots">⋮</span></div>
      </aside>

      <section className="content" id="top">
        <header className="topbar"><div><p className="eyebrow">TUESDAY, {weekLabel.toUpperCase()}</p><h1>Good morning, Maria <span>✦</span></h1></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧</button><button className="date-button">▣ This week</button></div></header>

        <section className="stat-grid" aria-label="Performance summary">
          {[['Total followers', '24,890', '+8.4%', 'across all channels'], ['Post reach', '142.8K', '+12.6%', 'last 30 days'], ['Engagement', '6.8%', '+1.2%', 'above average'], ['Scheduled', '12', '3 this week', 'ready to publish']].map(([label, value, change, detail]) => (
            <article className="stat-card" key={label}><div className="stat-heading"><span>{label}</span><button aria-label={`More ${label} options`}>•••</button></div><strong>{value}</strong><p><b>{change}</b> {detail}</p></article>
          ))}
        </section>

        <section className="workspace-grid">
          <article className="panel generator" id="generator"><div className="panel-title"><div><p className="eyebrow">AI ASSISTANT</p><h2>Create your next caption</h2></div><span className="spark">✦</span></div><p className="muted">Give Captionly a starting point and get fresh ideas in seconds.</p>
            <form onSubmit={createCaptions}><label htmlFor="prompt">What are you posting about?</label><textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={280} /><div className="form-footer"><small>{prompt.length}/280</small><button className="primary" type="submit">Generate captions <span>→</span></button></div></form>
            {generated.length > 0 && <div className="caption-results" aria-live="polite">{generated.map((caption, index) => <button className={selected === index ? "caption-option selected" : "caption-option"} onClick={() => setSelected(index)} type="button" key={caption}><span>{selected === index ? "✓" : "○"}</span>{caption}</button>)}<button className="save-caption" onClick={() => setNotice("Caption saved to your scheduled drafts.")}>Save selected caption</button></div>}
          </article>

          <article className="panel activity"><div className="panel-title"><div><p className="eyebrow">PERFORMANCE</p><h2>Profile momentum</h2></div><button className="small-select">Last 7 days⌄</button></div><div className="metric-line"><strong>18.4K</strong><span>↑ 14.2% from last week</span></div><div className="chart" aria-label="Weekly engagement chart">{bars.map((height, index) => <div className="bar-wrap" key={height}><div className={index === 5 ? "bar highlighted" : "bar"} style={{ height: `${height}%` }} /><small>{['M','T','W','T','F','S','S'][index]}</small></div>)}</div><div className="legend"><span><i className="dot violet" />Reach</span><span><i className="dot lavender" />Engagement</span></div></article>
        </section>

        <section className="lower-grid" id="schedule"><article className="panel schedule"><div className="panel-title"><div><p className="eyebrow">CONTENT QUEUE</p><h2>Upcoming posts</h2></div><a href="#schedule">View calendar →</a></div><div className="post-list">{posts.map((post) => <div className="post-row" key={post.title}><div className="post-icon">✦</div><div className="post-main"><strong>{post.title}</strong><span>{post.platform} · <b>{post.tone}</b></span></div><time>{post.time}</time><button aria-label={`More options for ${post.title}`}>•••</button></div>)}</div></article>
          <article className="panel goals"><p className="eyebrow">WEEKLY FOCUS</p><h2>Stay in the flow</h2><div className="ring"><div><strong>4/6</strong><span>posts planned</span></div></div><p className="muted">Two more posts and your weekly rhythm is set.</p><button className="secondary" onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}>Plan a post</button></article></section>
        {notice && <div className="toast" role="status">{notice}<button aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
      </section>
    </main>
  );
}
