export type SkyboxStyle = "realistic" | "anime" | "digital-art";

export interface GenerateRequest {
  prompt: string;
  style: SkyboxStyle;
}

export interface SkyboxJob {
  id: number;
  status: "pending" | "processing" | "complete" | "error";
  file_url: string | null;
  error_message: string | null;
}

const STYLE_ID_MAP: Record<SkyboxStyle, number> = {
  realistic: 2,
  anime: 3,
  "digital-art": 4,
};

export async function generateSkybox(
  prompt: string,
  style: SkyboxStyle
): Promise<{ jobId: number }> {
  const apiKey = process.env.BLOCKADE_API_KEY;
  if (!apiKey) throw new Error("BLOCKADE_API_KEY is not set");

  const res = await fetch("https://backend.blockadelabs.com/api/v1/skybox", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      skybox_style_id: STYLE_ID_MAP[style],
      prompt,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blockade API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return { jobId: data.id };
}

export async function pollSkyboxStatus(jobId: number): Promise<SkyboxJob> {
  const apiKey = process.env.BLOCKADE_API_KEY;
  if (!apiKey) throw new Error("BLOCKADE_API_KEY is not set");

  const res = await fetch(
    `https://backend.blockadelabs.com/api/v1/imagine/requests/${jobId}`,
    {
      headers: { "x-api-key": apiKey },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blockade poll error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return {
    id: data.request.id,
    status: data.request.status,
    file_url: data.request.file_url ?? null,
    error_message: data.request.error_message ?? null,
  };
}
