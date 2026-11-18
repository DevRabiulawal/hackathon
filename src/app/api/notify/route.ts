import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, caption, scheduledFor } = await request.json().catch(() => ({}));
  if (!email || !caption || !scheduledFor) return NextResponse.json({ error: "Missing notification details." }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ sent: false, mode: "demo" });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your Captionly post is scheduled",
      html: `<p>Your post is scheduled for <strong>${new Date(scheduledFor).toLocaleString()}</strong>.</p><p>${caption.replace(/</g, "&lt;")}</p>`,
    }),
  });
  if (!response.ok) return NextResponse.json({ error: "Email provider rejected the notification." }, { status: 502 });
  return NextResponse.json({ sent: true, mode: "resend" });
}
