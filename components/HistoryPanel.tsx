"use client";

export interface HistoryItem {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: number;
}

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryPanel({ history, onSelect }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        최근 생성 이력
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex-shrink-0 w-36 group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="p-2 bg-zinc-900">
              <p className="text-xs text-zinc-400 truncate">{item.prompt}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                {new Date(item.createdAt).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
