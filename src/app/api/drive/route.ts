import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accessToken, post } = await request.json().catch(() => ({}));
  if (!accessToken || !post) return NextResponse.json({ error: "Google Drive authorization is required." }, { status: 401 });
  const content = new Blob([JSON.stringify(post, null, 2)], { type: "application/json" });
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ name: `captionly-${post.id}.json`, mimeType: "application/json" })], { type: "application/json" }));
  form.append("file", content, `captionly-${post.id}.json`);
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });
  if (!response.ok) return NextResponse.json({ error: "Google Drive could not save this draft." }, { status: 502 });
  return NextResponse.json({ saved: true, file: await response.json() });
}
