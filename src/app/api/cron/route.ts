import { NextResponse } from "next/server";

// Scheduling is completed in the browser for this prototype. This protected endpoint
// is reserved for a production persistence layer (Vercel Postgres/Blob, Supabase, etc.).
export async function GET(request: Request) {
  const authorized = request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.CRON_SECRET && !authorized) return new NextResponse("Unauthorized", { status: 401 });
  return NextResponse.json({ ok: true, message: "No server-side scheduled posts are pending." });
}
