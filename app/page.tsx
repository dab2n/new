"use client";

import { useState, useEffect, useCallback } from "react";
import InputPanel from "@/components/InputPanel";
import LoadingView from "@/components/LoadingView";
import ResultView from "@/components/ResultView";
import HistoryPanel, { HistoryItem } from "@/components/HistoryPanel";
import { SkyboxStyle } from "@/lib/blockade";

type Phase = "input" | "loading" | "result" | "error";

const HISTORY_KEY = "panorama_history";
const MAX_HISTORY = 5;
const POLL_INTERVAL = 3000;

function loadHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<SkyboxStyle>("realistic");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const pollJob = useCallback(async (jobId: number): Promise<string> => {
    const poll = async (): Promise<string> => {
      const res = await fetch(`/api/generate?jobId=${jobId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Poll failed");

      if (data.status === "complete" && data.file_url) {
        return data.file_url as string;
      }
      if (data.status === "error") {
        throw new Error(data.error_message ?? "Generation failed");
      }

      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
      return poll();
    };

    return poll();
  }, []);

  const handleGenerate = useCallback(async (finalPrompt: string, finalStyle: SkyboxStyle) => {
    setPrompt(finalPrompt);
    setStyle(finalStyle);
    setPhase("loading");
    setStartTime(Date.now());
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, style: finalStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start generation");

      const url = await pollJob(data.jobId);
      setImageUrl(url);

      const item: HistoryItem = {
        id: String(data.jobId),
        prompt: finalPrompt,
        style: finalStyle,
        imageUrl: url,
        createdAt: Date.now(),
      };
      setHistory((prev) => {
        const next = [item, ...prev.filter((h) => h.id !== item.id)].slice(0, MAX_HISTORY);
        saveHistory(next);
        return next;
      });

      setPhase("result");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
      setPhase("error");
    }
  }, [pollJob]);

  const handleReset = () => {
    setPhase("input");
    setImageUrl("");
    setErrorMsg("");
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setStyle(item.style as SkyboxStyle);
    setImageUrl(item.imageUrl);
    setPhase("result");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Panorama Studio
          </h1>
          <p className="text-zinc-500 text-sm">
            AI로 생성하는 360° 파노라마 · 프로젝션 월 전용
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(["input", "loading", "result"] as const).map((step, i) => {
            const labels = ["입력", "생성 중", "결과"];
            const isActive =
              (step === "input" && (phase === "input" || phase === "error")) ||
              step === phase;
            const isDone =
              (step === "input" && (phase === "loading" || phase === "result")) ||
              (step === "loading" && phase === "result");
            return (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`w-8 h-px ${isDone || isActive ? "bg-violet-500/60" : "bg-white/10"}`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isDone
                        ? "bg-violet-600 text-white"
                        : isActive
                        ? "bg-violet-500/30 border border-violet-500 text-violet-300"
                        : "bg-white/5 border border-white/10 text-zinc-600"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs ${
                      isActive ? "text-zinc-300" : isDone ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {labels[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-8 min-h-[400px]">
          {phase === "input" && (
            <InputPanel onGenerate={handleGenerate} isLoading={false} />
          )}

          {phase === "loading" && <LoadingView startTime={startTime} />}

          {phase === "result" && (
            <ResultView
              imageUrl={imageUrl}
              prompt={prompt}
              style={style}
              onReset={handleReset}
            />
          )}

          {phase === "error" && (
            <div className="flex flex-col items-center justify-center gap-6 py-20">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
                ⚠️
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-medium">이미지 생성 실패</p>
                <p className="text-zinc-400 text-sm max-w-sm">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleGenerate(prompt, style)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
                >
                  다시 시도
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
                >
                  처음으로
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        {(phase === "input" || phase === "error") && (
          <HistoryPanel history={history} onSelect={handleHistorySelect} />
        )}
      </div>
    </main>
  );
}
