import type { CSSProperties } from "react";
import type { Chapter, Milestone } from "@/types/relationship";

export function ChapterTimeline({ chapters, milestones }: { chapters: Chapter[]; milestones: Milestone[] }) {
  return (
    <div className="timeline">
      {chapters.map((chapter, index) => {
        const number = String(index + 1).padStart(2, "0");
        return (
        <article className={`timeline__chapter timeline__chapter--${chapter.id}`} key={chapter.id} style={{ "--chapter-color": chapter.color } as CSSProperties}>
          <div className="timeline__media" aria-hidden="true">
            <img src={`/chapters/${number}.JPG`} alt="" />
          </div>
          <div className="timeline__content">
            <div className="timeline__index">{number}</div>
            <div>
              <p>{chapter.dateRange}</p>
              <h3>{chapter.title}</h3>
              <span>{chapter.tone}</span>
              <p>{chapter.description}</p>
              <ul>
                {milestones.filter((milestone) => milestone.chapter === chapter.id).map((milestone) => (
                  <li key={`${chapter.id}-${milestone.title}`}>
                    <strong>{milestone.title}</strong>
                    <span>{milestone.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      );
      })}
    </div>
  );
}
