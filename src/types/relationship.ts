export type Person = "Daniel" | "Isabella";

export type ChapterId =
  | "before-dating"
  | "first-relationship"
  | "time-apart"
  | "reconciliation"
  | "engagement"
  | "marriage";

export type MediaKind = "text" | "photo" | "video" | "voice" | "sticker" | "gif" | "audio" | "document" | "unknown";

export interface RawMessage {
  id: string;
  chatJid?: string;
  chatName?: string;
  sender: Person;
  senderRaw?: string;
  timestamp: string;
  text: string;
  mediaKind: MediaKind;
  mediaPath?: string;
  mediaUrl?: string;
  starred?: boolean;
}

export interface Milestone {
  date: string;
  title: string;
  chapter: ChapterId;
  body: string;
}

export interface Chapter {
  id: ChapterId;
  title: string;
  dateRange: string;
  tone: string;
  description: string;
  color: string;
  start: string;
  end?: string;
}

export interface PhraseStat {
  key: string;
  label: string;
  daniel: number;
  isabella: number;
  total: number;
  first?: FeaturedMessage;
  monthly: Array<{ month: string; Daniel: number; Isabella: number }>;
}

export interface FeaturedMessage {
  id: string;
  label: string;
  sender: Person;
  timestamp: string;
  text: string;
  chapter: ChapterId;
}

export interface SenderTotals {
  Daniel: number;
  Isabella: number;
}

export interface RelationshipData {
  generatedAt: string;
  source: {
    mode: "sample" | "whatsapp-export";
    contactQuery: string;
    path?: string;
    parsedMessages?: number;
    skippedSystemMessages?: number;
    warnings: string[];
  };
  people: Person[];
  chapters: Chapter[];
  milestones: Milestone[];
  totals: {
    messages: number;
    daysActive: number;
    averagePerActiveDay: number;
    bySender: SenderTotals;
    textBySender: SenderTotals;
    mediaBySender: Record<Exclude<MediaKind, "unknown">, SenderTotals>;
  };
  activity: {
    byYear: Array<{ year: string; Daniel: number; Isabella: number; total: number }>;
    byMonth: Array<{ month: string; Daniel: number; Isabella: number; total: number }>;
    byDay: Array<{ day: string; Daniel: number; Isabella: number; total: number }>;
    byHour: Array<{ hour: number; count: number }>;
    heatmap: Array<{ day: string; count: number; chapter: ChapterId }>;
    mostActiveDay?: { day: string; count: number };
    mostActiveMonth?: { month: string; count: number };
    longestStreak: { start: string; end: string; days: number };
  };
  phrases: PhraseStat[];
  topPhrases?: Array<{ phrase: string; count: number }>;
  emoji: {
    overall: Array<{ emoji: string; count: number }>;
    byPerson: Record<Person, Array<{ emoji: string; count: number }>>;
    monthly: Array<{ month: string; romantic: number; playful: number; total: number }>;
  };
  firsts: FeaturedMessage[];
  hallOfFame: FeaturedMessage[];
  funFacts: Array<{ title: string; value: string; detail: string }>;
  evolution: Array<{ month: string; messages: number; affection: number; emojis: number; chapter: ChapterId }>;
  monthlyMemories: Array<{
    month: string;
    chapter: ChapterId;
    messages: number;
    affection: number;
    media: number;
    caption: string;
    mediaItems: Array<{ kind: MediaKind; path?: string; sender: Person; timestamp: string }>;
  }>;
}
