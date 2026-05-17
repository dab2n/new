"use client";

import dynamic from "next/dynamic";
import { SkyboxStyle } from "@/lib/blockade";

const PanoramaViewer = dynamic(() => import("./PanoramaViewer"), { ssr: false });

interface Props {
  imageUrl: string;
  prompt: string;
  style: SkyboxStyle;
  onReset: () => void;
}

const STYLE_LABELS: Record<SkyboxStyle, string> = {
  realistic: "사실적",
  anime: "애니메이션",
  "digital-art": "디지털 아트",
};

export default function ResultView({ imageUrl, prompt, style, onReset }: Props) {
  const handleDownload = async () => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `panorama_${Date.now()}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black" style={{ height: "60vh" }}>
        <PanoramaViewer imageUrl={imageUrl} />
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <p className="text-white font-medium truncate max-w-xl">{prompt}</p>
          <p className="text-xs text-zinc-500">
            스타일: {STYLE_LABELS[style]} &nbsp;·&nbsp; 마우스로 드래그해 360° 탐색
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white text-sm font-medium transition-all"
          >
            ⬇ 다운로드
          </button>
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all"
          >
            + 새로 생성
          </button>
        </div>
      </div>
    </div>
  );
}
