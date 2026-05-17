import { NextRequest, NextResponse } from "next/server";
import { generateSkybox, pollSkyboxStatus, SkyboxStyle } from "@/lib/blockade";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = (await req.json()) as {
      prompt: string;
      style: SkyboxStyle;
    };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { jobId } = await generateSkybox(prompt.trim(), style ?? "realistic");
    return NextResponse.json({ jobId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  try {
    const job = await pollSkyboxStatus(Number(jobId));
    return NextResponse.json(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
