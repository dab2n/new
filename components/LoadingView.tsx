"use client";

import { useEffect, useState } from "react";

interface Props {
  startTime: number;
}

export default function LoadingView({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const maxWait = 90;
  const progress = Math.min((elapsed / maxWait) * 100, 95);
  const remaining = Math.max(maxWait - elapsed, 5);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-400 animate-spin"
          style={{ animationDuration: "1.2s" }}
        />
        <div
          className="absolute inset-3 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🌌</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-white font-medium text-lg">파노라마 생성 중...</p>
        <p className="text-zinc-400 text-sm">
          AI가 360° 이미지를 만들고 있어요
        </p>
      </div>

      <div className="w-80 space-y-2">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{elapsed}초 경과</span>
          <span>약 {remaining}초 남음</span>
        </div>
      </div>

      <p className="text-zinc-600 text-xs max-w-xs text-center">
        고해상도 파노라마 생성에는 30~90초가 소요됩니다
      </p>
    </div>
  );
}
