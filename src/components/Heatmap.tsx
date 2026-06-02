import type { CSSProperties } from "react";
import type { RelationshipData } from "@/types/relationship";

export function Heatmap({ days }: { days: RelationshipData["activity"]["heatmap"] }) {
  const max = Math.max(1, ...days.map((day) => day.count));
  const topDays = [...days].sort((a, b) => b.count - a.count).slice(0, 5);
  const topDayRanks = new Map(topDays.map((day, index) => [day.day, index + 1]));
  return (
    <div className="conversation-map">
      <div className="heatmap__guide" aria-hidden="true">
        <span>Quieter days</span>
        <div><i /><i /><i /><i /></div>
        <span>Couldn&apos;t-stop-talking days</span>
      </div>
      <div className="heatmap" aria-label="Illuminated conversation calendar">
        {days.map((day) => (
          <div
            key={day.day}
            className={`heatmap__cell${topDayRanks.has(day.day) ? " heatmap__cell--bright" : ""}${day.count === max ? " heatmap__cell--peak" : ""}`}
            style={{ "--glow": 0.18 + (day.count / max) * 0.82 } as CSSProperties}
            title={`${day.day}: ${day.count} messages`}
          >
            {topDayRanks.has(day.day) && <span>{topDayRanks.get(day.day)}</span>}
          </div>
        ))}
      </div>
      <div className="heatmap__legend">
        <h3>Brightest days in the archive</h3>
        {topDays.map((day, index) => (
          <p key={day.day}>
            <span>{index + 1}</span>
            {day.day}: {day.count.toLocaleString()} messages
          </p>
        ))}
      </div>
    </div>
  );
}
