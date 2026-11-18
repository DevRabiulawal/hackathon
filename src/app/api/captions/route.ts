import { NextResponse } from "next/server";

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

function fallbackCaptions(topic: string) {
  const cleanTopic = topic.trim() || "your next idea";
  return [
    `A small look behind ${cleanTopic.toLowerCase()}. The thoughtful details are always our favorite part. ✦ #behindthescenes #creativity #contentcreator`,
    `${cleanTopic} — made with intention and ready to be shared. What would you add? #creativeprocess #community #socialmedia`,
    `Proof that progress can be beautiful. Here’s a closer look at ${cleanTopic.toLowerCase()}. #makersgonnamake #inspiration`,
  ];
}

export async function POST(request: Request) {
  const { prompt } = await request.json().catch(() => ({}));
  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Please describe the post you want to create." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ captions: fallbackCaptions(prompt), source: "demo" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Write exactly 3 concise social-media captions about: ${prompt}. Include relevant hashtags. Separate captions with the delimiter |||. Do not use headings or markdown.` }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 500 },
        }),
      },
    );
    if (!response.ok) throw new Error("Gemini request failed");
    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    const captions = text.split("|||").map((caption) => caption.trim()).filter(Boolean).slice(0, 3);
    return NextResponse.json({ captions: captions.length ? captions : fallbackCaptions(prompt), source: "gemini" });
  } catch {
    return NextResponse.json({ captions: fallbackCaptions(prompt), source: "demo", warning: "Gemini could not be reached, so we created demo captions." });
  }
}
