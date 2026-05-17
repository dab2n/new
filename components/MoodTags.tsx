"use client";

const TAGS = [
  { label: "🌿 자연", value: "자연, 숲, 나무, 초원" },
  { label: "🏙️ 도시", value: "도시, 스카이라인, 빌딩, 야경" },
  { label: "🌀 추상", value: "추상적, 환상적, 몽환적" },
  { label: "🌸 봄", value: "봄날, 벚꽃, 따뜻한 햇살" },
  { label: "☀️ 여름", value: "여름, 청명한 하늘, 바다" },
  { label: "🍂 가을", value: "가을, 단풍, 황금빛 들판" },
  { label: "❄️ 겨울", value: "겨울, 눈 내리는, 설경" },
  { label: "🌅 아침", value: "이른 아침, 일출, 안개" },
  { label: "🌆 저녁", value: "저녁노을, 황혼, 오렌지빛 하늘" },
  { label: "🌙 밤", value: "밤하늘, 별빛, 달빛" },
];

interface Props {
  onSelect: (value: string) => void;
}

export default function MoodTags({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => (
        <button
          key={tag.value}
          onClick={() => onSelect(tag.value)}
          className="px-3 py-1.5 rounded-full text-sm bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all duration-150"
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
