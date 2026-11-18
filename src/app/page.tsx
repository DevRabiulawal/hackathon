"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Post = { id: string; caption: string; platform: string; scheduledFor: string; createdAt: string; synced?: boolean };
declare global { interface Window { google?: { accounts: { oauth2: { initTokenClient: (options: { client_id: string; scope: string; callback: (response: { access_token?: string; error?: string }) => void }) => { requestAccessToken: (options?: { prompt?: string }) => void } } } } } }

const nav = [["⌘", "Overview"], ["◫", "Analytics"], ["◷", "Schedule"], ["▣", "Content library"], ["◎", "Community"]];
const bars = [38, 64, 48, 76, 55, 86, 69];
const storageKey = "captionly-posts";

export default function Home() {
  const [prompt, setPrompt] = useState("A calm behind-the-scenes look at our creative process");
  const [captions, setCaptions] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [driveToken, setDriveToken] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [scheduledFor, setScheduledFor] = useState("");
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState(true);
  const [notice, setNotice] = useState("");
  const weekLabel = useMemo(() => new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date()), []);

  useEffect(() => { const saved = localStorage.getItem(storageKey); if (saved) setPosts(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(posts)); }, [posts]);
  function message(text: string) { setNotice(text); window.setTimeout(() => setNotice(""), 4500); }
  async function createCaptions(event: FormEvent) {
    event.preventDefault(); setIsGenerating(true);
    try { const response = await fetch("/api/captions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setCaptions(data.captions); setSelected(0); if (data.warning) message(data.warning); }
    catch (error) { message(error instanceof Error ? error.message : "Could not generate captions."); }
    finally { setIsGenerating(false); }
  }
  function connectDrive() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) return message("Google sign-in is loading. Please try again in a moment.");
    const client = window.google.accounts.oauth2.initTokenClient({ client_id: clientId, scope: "https://www.googleapis.com/auth/drive.file", callback: (response) => { if (response.access_token) { setDriveToken(response.access_token); message("Google Drive connected."); } else message("Google Drive connection was cancelled."); } });
    client.requestAccessToken({ prompt: driveToken ? "" : "consent" });
  }
  async function schedulePost() {
    const caption = captions[selected]; if (!caption) return message("Generate and select a caption first."); if (!scheduledFor) return message("Choose when the post should be scheduled.");
    const post: Post = { id: crypto.randomUUID(), caption, platform, scheduledFor, createdAt: new Date().toISOString() }; let synced = false;
    if (driveToken) { try { const response = await fetch("/api/drive", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken: driveToken, post }) }); synced = response.ok; } catch { /* local queue remains available */ } }
    post.synced = synced; setPosts((current) => [post, ...current]);
    if (notify && email) { try { const response = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, caption, scheduledFor }) }); const result = await response.json(); message(result.sent ? "Post saved and confirmation email sent." : "Post scheduled. Add Resend keys to enable email delivery."); } catch { message("Post scheduled. Notification could not be sent."); } }
    else message(synced ? "Post scheduled and saved to Google Drive." : "Post scheduled locally. Connect Google Drive to sync it.");
    setCaptions([]); setScheduledFor("");
  }
  function removePost(id: string) { setPosts((current) => current.filter((post) => post.id !== id)); message("Post removed from the schedule."); }
  function editPost(post: Post) { const caption = window.prompt("Edit caption", post.caption); if (caption?.trim()) setPosts((current) => current.map((item) => item.id === post.id ? { ...item, caption: caption.trim() } : item)); }
  const formatted = (date: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));

  return <main className="shell">
    <aside className="sidebar"><a className="brand" href="#top"><span className="brand-mark">✦</span>captionly</a><button className="new-post" onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}>＋ New post</button><nav aria-label="Main navigation"><p className="nav-label">WORKSPACE</p>{nav.map(([icon, label], index) => <a className={index === 0 ? "nav-item active" : "nav-item"} href={index === 2 ? "#schedule" : "#top"} key={label}><span>{icon}</span>{label}</a>)}<p className="nav-label second">ACCOUNT</p><a className="nav-item" href="#settings"><span>⚙</span>Settings</a></nav><div className="profile"><div className="avatar">MS</div><div><strong>Maria Santos</strong><small>Creator plan</small></div><span className="dots">⋮</span></div></aside>
    <section className="content" id="top"><header className="topbar"><div><p className="eyebrow">TUESDAY, {weekLabel.toUpperCase()}</p><h1>Good morning, Maria <span>✦</span></h1></div><div className="top-actions"><button className={driveToken ? "connected" : "date-button"} onClick={connectDrive}>{driveToken ? "✓ Drive connected" : "Connect Drive"}</button><button className="date-button">▣ This week</button></div></header>
      <section className="stat-grid" aria-label="Performance summary">{[["Total followers", "24,890", "+8.4%", "across all channels"], ["Post reach", "142.8K", "+12.6%", "last 30 days"], ["Engagement", "6.8%", "+1.2%", "above average"], ["Scheduled", String(posts.length), `${posts.length} in queue`, "ready to publish"]].map(([label, value, change, detail]) => <article className="stat-card" key={label}><div className="stat-heading"><span>{label}</span><button aria-label={`More ${label} options`}>•••</button></div><strong>{value}</strong><p><b>{change}</b> {detail}</p></article>)}</section>
      <section className="workspace-grid"><article className="panel generator" id="generator"><div className="panel-title"><div><p className="eyebrow">AI ASSISTANT</p><h2>Create your next caption</h2></div><span className="spark">✦</span></div><p className="muted">Gemini turns a quick idea into ready-to-use captions.</p><form onSubmit={createCaptions}><label htmlFor="prompt">What are you posting about?</label><textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={280} /><div className="form-footer"><small>{prompt.length}/280</small><button className="primary" type="submit" disabled={isGenerating}>{isGenerating ? "Writing…" : "Generate captions"} <span>→</span></button></div></form>
        {captions.length > 0 && <div className="caption-results" aria-live="polite">{captions.map((caption, index) => <button className={selected === index ? "caption-option selected" : "caption-option"} onClick={() => setSelected(index)} type="button" key={caption}><span>{selected === index ? "✓" : "○"}</span>{caption}</button>)}<div className="schedule-form"><label>Publish on<select value={platform} onChange={(event) => setPlatform(event.target.value)}><option>Instagram</option><option>LinkedIn</option><option>X</option><option>Facebook</option></select></label><label>Schedule for<input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} /></label><label className="check"><input type="checkbox" checked={notify} onChange={(event) => setNotify(event.target.checked)} /> Email me</label>{notify && <input className="email-input" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />}</div><button className="save-caption" onClick={schedulePost}>Schedule selected caption →</button></div>}</article>
        <article className="panel activity"><div className="panel-title"><div><p className="eyebrow">PERFORMANCE</p><h2>Profile momentum</h2></div><button className="small-select">Last 7 days⌄</button></div><div className="metric-line"><strong>18.4K</strong><span>↑ 14.2% from last week</span></div><div className="chart" aria-label="Weekly engagement chart">{bars.map((height, index) => <div className="bar-wrap" key={height}><div className={index === 5 ? "bar highlighted" : "bar"} style={{ height: `${height}%` }} /><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>)}</div><div className="legend"><span><i className="dot violet" />Reach</span><span><i className="dot lavender" />Engagement</span></div></article></section>
      <section className="lower-grid" id="schedule"><article className="panel schedule"><div className="panel-title"><div><p className="eyebrow">CONTENT QUEUE</p><h2>Scheduled posts</h2></div><span className="queue-count">{posts.length} drafts</span></div><div className="post-list">{posts.length === 0 ? <p className="empty">Your scheduled posts will appear here.</p> : posts.map((post) => <div className="post-row" key={post.id}><div className="post-icon">✦</div><div className="post-main"><strong>{post.caption}</strong><span>{post.platform} · <b>{post.synced ? "Synced to Drive" : "Local draft"}</b></span></div><time>{formatted(post.scheduledFor)}</time><button onClick={() => editPost(post)} aria-label="Edit post">✎</button><button onClick={() => removePost(post.id)} aria-label="Delete post">×</button></div>)}</div></article><article className="panel goals" id="settings"><p className="eyebrow">WEEKLY FOCUS</p><h2>Stay in the flow</h2><div className="ring"><div><strong>{posts.length}/6</strong><span>posts planned</span></div></div><p className="muted">Create six thoughtful posts to complete your weekly rhythm.</p><button className="secondary" onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })}>Plan a post</button></article></section>
      {notice && <div className="toast" role="status">{notice}<button aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}</section>
  </main>;
}
