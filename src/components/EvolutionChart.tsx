import { formatMonth } from "@/lib/text";
import type { Chapter, RelationshipData } from "@/types/relationship";

export function EvolutionChart({ data, chapters }: { data: RelationshipData["evolution"]; chapters: Chapter[] }) {
  const max = Math.max(1, ...data.map((point) => point.messages));
  const chapterColors = new Map(chapters.map((chapter) => [chapter.id, chapter.color]));

  return (
    <div className="evolution-chart">
      {data.map((point) => (
        <div className="evolution-chart__bar" key={point.month}>
          <div
            style={{
              height: `${Math.max(8, (point.messages / max) * 100)}%`,
              background: chapterColors.get(point.chapter)
            }}
            title={`${formatMonth(point.month)}: ${point.messages.toLocaleString()} messages, ${point.affection.toLocaleString()} affectionate traces`}
          >
            <span>{point.affection > 0 ? point.affection : point.messages}</span>
          </div>
          <p>{formatMonth(point.month)}</p>
        </div>
      ))}
    </div>
  );
}
