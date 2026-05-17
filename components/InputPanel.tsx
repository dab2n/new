"use client";

import { useState } from "react";
import MoodTags from "./MoodTags";
import { SkyboxStyle } from "@/lib/blockade";

const DEFAULT_PROMPT = "봄날 오후, 벚꽃이 흩날리는 한강 공원";

const STYLE_OPTIONS: { value: SkyboxStyle; label: string; desc: string }[] = [
  { value: "realistic", label: "사실적", desc: "Realistic" },
  { value: "anime", label: "애니메이션", desc: "Anime" },
  { value: "digital-art", label: "디지털 아트", desc: "Digital Art" },
];

interface Props {
  onGenerate: (prompt: string, style: SkyboxStyle) => void;
  isLoading: boolean;
}

export default function InputPanel({ onGenerate, isLoading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<SkyboxStyle>("realistic");

  const handleSubmit = () => {
    const finalPrompt = prompt.trim() || DEFAULT_PROMPT;
    onGenerate(finalPrompt, style);
  };

  const appendTag = (value: string) => {
    setPrompt((p) => (p ? `${p}, ${value}` : value));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          분위기 태그
        </label>
        <MoodTags onSelect={appendTag} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="prompt"
          className="text-xs font-semibold uppercase tracking-widest text-zinc-500"
        >
          프롬프트
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={DEFAULT_PROMPT}
          rows={3}
          className="w-full bg-white/5 border border-white/10 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 rounded-xl px-4 py-3 text-white placeholder-zinc-600 resize-none outline-none transition-all text-sm"
        />
        <p className="text-xs text-zinc-600">
          비워두면 기본값으로 생성됩니다: &ldquo;{DEFAULT_PROMPT}&rdquo;
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          스타일
        </label>
        <div className="flex gap-3">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStyle(opt.value)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                style === opt.value
                  ? "bg-violet-600/30 border-violet-500/60 text-violet-200"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="block font-semibold">{opt.label}</span>
              <span className="block text-xs mt-0.5 opacity-60">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base transition-all duration-150 shadow-lg shadow-violet-900/30"
      >
        {isLoading ? "생성 중..." : "✨ 파노라마 생성"}
      </button>
    </div>
  );
}
