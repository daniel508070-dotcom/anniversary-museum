import { formatMonth } from "@/lib/text";
import type { RelationshipData } from "@/types/relationship";

export function CommunicationStats({ data }: { data: RelationshipData }) {
  const topYears = data.activity.byYear.slice(-5);
  const activeHour = [...data.activity.byHour].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="communication">
      <article>
        <h3>The years that kept us talking</h3>
        {topYears.map((year) => (
          <div className="mini-row" key={year.year}>
            <span>{year.year}</span>
            <strong>{year.total.toLocaleString()}</strong>
          </div>
        ))}
      </article>
      <article>
        <h3>The day we could not stop</h3>
        <strong>{data.activity.mostActiveDay?.day ?? "Pending"}</strong>
        <p>{data.activity.mostActiveDay?.count.toLocaleString() ?? 0} messages, all in one day.</p>
      </article>
      <article>
        <h3>The month that overflowed</h3>
        <strong>{data.activity.mostActiveMonth ? formatMonth(data.activity.mostActiveMonth.month) : "Pending"}</strong>
        <p>{data.activity.mostActiveMonth?.count.toLocaleString() ?? 0} messages across one season of closeness.</p>
      </article>
      <article>
        <h3>The hour that knew us best</h3>
        <strong>{activeHour ? `${String(activeHour.hour).padStart(2, "0")}:00` : "Pending"}</strong>
        <p>{activeHour?.count.toLocaleString() ?? 0} messages gathered around that time of day.</p>
      </article>
    </div>
  );
}
