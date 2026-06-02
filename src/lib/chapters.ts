import type { Chapter, ChapterId, Milestone } from "@/types/relationship";

export const chapters: Chapter[] = [
  {
    id: "before-dating",
    title: "Before Dating",
    dateRange: "First messages - February 2023",
    tone: "The first light through old glass.",
    description: "The earliest conversations, before the relationship had a name.",
    color: "#9bddff",
    start: "2022-01-01",
    end: "2023-02-28"
  },
  {
    id: "first-relationship",
    title: "First Relationship",
    dateRange: "March 2023 - January 2024",
    tone: "A chapter of becoming.",
    description: "The first official season, with all its intensity and discovery.",
    color: "#ff4f8b",
    start: "2023-03-01",
    end: "2024-01-31"
  },
  {
    id: "time-apart",
    title: "Time Apart",
    dateRange: "February 2024 - August 2024",
    tone: "The quiet nave.",
    description: "The months when distance became part of the story.",
    color: "#a8dfff",
    start: "2024-02-01",
    end: "2024-08-31"
  },
  {
    id: "reconciliation",
    title: "Reconciliation",
    dateRange: "September 2024 - January 1, 2026",
    tone: "Finding each other again in the same halls.",
    description: "The return that began with the first week of school in the same college.",
    color: "#4ca8ff",
    start: "2024-09-01",
    end: "2026-01-01"
  },
  {
    id: "engagement",
    title: "Engagement",
    dateRange: "January 2, 2026 - May 26, 2026",
    tone: "A promise set in color.",
    description: "The season of choosing forever out loud.",
    color: "#ff6b6b",
    start: "2026-01-02",
    end: "2026-05-26"
  },
  {
    id: "marriage",
    title: "Marriage",
    dateRange: "May 27, 2026 - Present",
    tone: "The doors open.",
    description: "The beginning of the chapter that keeps unfolding.",
    color: "#f45f73",
    start: "2026-05-27"
  }
];

export const milestones: Milestone[] = [
  {
    date: "2022-01-01",
    title: "First Conversations",
    chapter: "before-dating",
    body: "The archive begins with two voices learning the shape of each other."
  },
  {
    date: "2023-03-01",
    title: "Began Dating",
    chapter: "first-relationship",
    body: "The story became a relationship."
  },
  {
    date: "2024-02-01",
    title: "A Time Apart",
    chapter: "time-apart",
    body: "A quiet interval entered the record."
  },
  {
    date: "2024-09-01",
    title: "Same College, Same Beginning Again",
    chapter: "reconciliation",
    body: "The first week of school became a doorway back."
  },
  {
    date: "2026-01-02",
    title: "Engaged",
    chapter: "engagement",
    body: "A promise took form."
  },
  {
    date: "2026-05-27",
    title: "Married",
    chapter: "marriage",
    body: "The love story became a covenant."
  }
];

export function chapterForDate(dateValue: string): ChapterId {
  const time = new Date(dateValue).getTime();
  const chapter = chapters.find((item) => {
    const start = new Date(`${item.start}T00:00:00`).getTime();
    const end = item.end ? new Date(`${item.end}T23:59:59`).getTime() : Number.POSITIVE_INFINITY;
    return time >= start && time <= end;
  });
  return chapter?.id ?? "before-dating";
}
