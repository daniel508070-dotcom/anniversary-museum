import { chapters, milestones, chapterForDate } from "@/lib/chapters";
import { extractEmoji, isRomanticEmoji } from "@/lib/emoji";
import { countPhraseMatches, hasAnyAffection, phraseDefinitions } from "@/lib/phrases";
import { dayKey, excerpt, monthKey } from "@/lib/text";
import type { FeaturedMessage, MediaKind, Person, RawMessage, RelationshipData, SenderTotals } from "@/types/relationship";

const people: Person[] = ["Daniel", "Isabella"];
const mediaKinds: Array<Exclude<MediaKind, "unknown">> = ["text", "photo", "video", "voice", "sticker", "gif", "audio", "document"];

function emptyTotals(): SenderTotals {
  return { Daniel: 0, Isabella: 0 };
}

function increment(map: Map<string, SenderTotals>, key: string, sender: Person, amount = 1) {
  const item = map.get(key) ?? emptyTotals();
  item[sender] += amount;
  map.set(key, item);
}

function sortMessages(messages: RawMessage[]) {
  return [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function toFeatured(message: RawMessage, label: string): FeaturedMessage {
  return {
    id: message.id,
    label,
    sender: message.sender,
    timestamp: message.timestamp,
    text: excerpt(message.text, 240),
    chapter: chapterForDate(message.timestamp)
  };
}

function hasHeartEmoji(text: string) {
  return /[❤♥💕💖💗💓💞💘💝💟❣]/u.test(text);
}

function longestStreak(days: string[]) {
  const uniqueDays = [...new Set(days)].sort();
  if (uniqueDays.length === 0) return { start: "", end: "", days: 0 };
  let bestStart = uniqueDays[0];
  let bestEnd = uniqueDays[0];
  let currentStart = uniqueDays[0];
  let previous = new Date(`${uniqueDays[0]}T00:00:00`);
  let currentLength = 1;
  let bestLength = 1;

  for (const day of uniqueDays.slice(1)) {
    const date = new Date(`${day}T00:00:00`);
    const diff = Math.round((date.getTime() - previous.getTime()) / 86400000);
    if (diff === 1) {
      currentLength += 1;
    } else {
      currentStart = day;
      currentLength = 1;
    }
    if (currentLength > bestLength) {
      bestLength = currentLength;
      bestStart = currentStart;
      bestEnd = day;
    }
    previous = date;
  }
  return { start: bestStart, end: bestEnd, days: bestLength };
}

function maxEntry<T extends { count: number }>(items: T[]): T | undefined {
  return [...items].sort((a, b) => b.count - a.count)[0];
}

export function analyzeMessages(messagesInput: RawMessage[], sourceMode: RelationshipData["source"]["mode"], warnings: string[] = []): RelationshipData {
  const messages = sortMessages(messagesInput);
  const bySender = emptyTotals();
  const textBySender = emptyTotals();
  const mediaBySender = Object.fromEntries(mediaKinds.map((kind) => [kind, emptyTotals()])) as RelationshipData["totals"]["mediaBySender"];
  const byYear = new Map<string, SenderTotals>();
  const byMonth = new Map<string, SenderTotals>();
  const byDay = new Map<string, SenderTotals>();
  const byHour = new Map<number, number>();
  const emojiCounts = new Map<string, number>();
  const emojiByPerson: Record<Person, Map<string, number>> = { Daniel: new Map(), Isabella: new Map() };
  const emojiMonthly = new Map<string, { romantic: number; playful: number; total: number }>();
  const monthlyMedia = new Map<string, number>();
  const monthlyMediaItems = new Map<string, RelationshipData["monthlyMemories"][number]["mediaItems"]>();

  for (const message of messages) {
    const date = new Date(message.timestamp);
    const year = String(date.getFullYear());
    const month = monthKey(message.timestamp);
    const day = dayKey(message.timestamp);
    bySender[message.sender] += 1;
    if (message.mediaKind === "text") textBySender[message.sender] += 1;
    if (message.mediaKind in mediaBySender) mediaBySender[message.mediaKind as Exclude<MediaKind, "unknown">][message.sender] += 1;
    increment(byYear, year, message.sender);
    increment(byMonth, month, message.sender);
    increment(byDay, day, message.sender);
    byHour.set(date.getHours(), (byHour.get(date.getHours()) ?? 0) + 1);

    const emojis = extractEmoji(message.text);
    const monthlyEmoji = emojiMonthly.get(month) ?? { romantic: 0, playful: 0, total: 0 };
    for (const emoji of emojis) {
      emojiCounts.set(emoji, (emojiCounts.get(emoji) ?? 0) + 1);
      emojiByPerson[message.sender].set(emoji, (emojiByPerson[message.sender].get(emoji) ?? 0) + 1);
      monthlyEmoji.total += 1;
      if (isRomanticEmoji(emoji)) monthlyEmoji.romantic += 1;
      else monthlyEmoji.playful += 1;
    }
    emojiMonthly.set(month, monthlyEmoji);

    if (message.mediaKind !== "text") {
      monthlyMedia.set(month, (monthlyMedia.get(month) ?? 0) + 1);
      const list = monthlyMediaItems.get(month) ?? [];
      list.push({ kind: message.mediaKind, path: message.mediaPath, sender: message.sender, timestamp: message.timestamp });
      monthlyMediaItems.set(month, list);
    }
  }

  const phraseStats = phraseDefinitions.map((definition) => {
    const monthly = new Map<string, SenderTotals>();
    const totals = emptyTotals();
    let first: FeaturedMessage | undefined;
    for (const message of messages) {
      const count = countPhraseMatches(message.text, definition.key);
      if (count === 0) continue;
      totals[message.sender] += count;
      increment(monthly, monthKey(message.timestamp), message.sender, count);
      first ??= toFeatured(message, `First ${definition.label}`);
    }
    return {
      key: definition.key,
      label: definition.label,
      daniel: totals.Daniel,
      isabella: totals.Isabella,
      total: totals.Daniel + totals.Isabella,
      first: ["i-love-you", "te-amo"].includes(definition.key) ? first : undefined,
      monthly: [...monthly.entries()].map(([month, totalsForMonth]) => ({ month, Daniel: totalsForMonth.Daniel, Isabella: totalsForMonth.Isabella }))
    };
  });

  const dayRows = [...byDay.entries()].map(([day, totals]) => ({ day, Daniel: totals.Daniel, Isabella: totals.Isabella, total: totals.Daniel + totals.Isabella }));
  const monthRows = [...byMonth.entries()].map(([month, totals]) => ({ month, Daniel: totals.Daniel, Isabella: totals.Isabella, total: totals.Daniel + totals.Isabella }));
  const firstMessage = messages[0] ? toFeatured(messages[0], "First message") : undefined;
  const firsts = [
    firstMessage,
    phraseStats.find((item) => item.key === "i-love-you")?.first,
    phraseStats.find((item) => item.key === "te-amo")?.first
  ].filter(Boolean) as FeaturedMessage[];
  const affectionate = messages.filter((message) => hasAnyAffection(message.text));
  const firstIsaokay = messages.find((message) => message.sender === "Isabella" && /\bisa\s*okay\b/i.test(message.text));
  const firstIsabellaHeart = messages.find((message) => message.sender === "Isabella" && hasHeartEmoji(message.text));
  const hallOfFame = [
    affectionate[0] && toFeatured(affectionate[0], "First Openly Romantic Message"),
    affectionate[Math.floor(affectionate.length / 2)] && toFeatured(affectionate[Math.floor(affectionate.length / 2)], "A Message From The Middle"),
    firstIsaokay && toFeatured(firstIsaokay, "First Isaokay"),
    firstIsabellaHeart && toFeatured(firstIsabellaHeart, "First Heart From Isabella")
  ].filter(Boolean) as FeaturedMessage[];

  const affectionByMonth = new Map<string, number>();
  for (const message of messages) {
    if (hasAnyAffection(message.text)) affectionByMonth.set(monthKey(message.timestamp), (affectionByMonth.get(monthKey(message.timestamp)) ?? 0) + 1);
  }

  const monthlyMemories = monthRows.map((row) => ({
    month: row.month,
    chapter: chapterForDate(`${row.month}-01T00:00:00`),
    messages: row.total,
    affection: affectionByMonth.get(row.month) ?? 0,
    media: monthlyMedia.get(row.month) ?? 0,
    caption: row.total > 1000 ? "This was one of the months when the conversation kept spilling over." : "A quieter page, but still part of the way back to us.",
    mediaItems: (monthlyMediaItems.get(row.month) ?? []).slice(0, 6)
  }));

  const mostActiveDay = maxEntry(dayRows.map((row) => ({ day: row.day, count: row.total })));
  const mostActiveMonth = maxEntry(monthRows.map((row) => ({ month: row.month, count: row.total })));
  const streak = longestStreak(dayRows.map((row) => row.day));
  const totalMessages = messages.length;
  const activeDays = dayRows.length;
  const visibleMediaKinds = new Set(["photo", "video", "sticker", "gif", "audio"]);
  const mediaTotal = Object.entries(mediaBySender).reduce((sum, [kind, totals]) => {
    if (!visibleMediaKinds.has(kind)) return sum;
    return sum + totals.Daniel + totals.Isabella;
  }, 0);

  return {
    generatedAt: new Date().toISOString(),
    source: {
      mode: sourceMode,
      contactQuery: "Amor♥️ / Amorâ™¥ï¸",
      warnings
    },
    people,
    chapters,
    milestones,
    totals: {
      messages: totalMessages,
      daysActive: activeDays,
      averagePerActiveDay: activeDays ? Number((totalMessages / activeDays).toFixed(1)) : 0,
      bySender,
      textBySender,
      mediaBySender
    },
    activity: {
      byYear: [...byYear.entries()].map(([year, totals]) => ({ year, Daniel: totals.Daniel, Isabella: totals.Isabella, total: totals.Daniel + totals.Isabella })),
      byMonth: monthRows,
      byDay: dayRows,
      byHour: [...byHour.entries()].map(([hour, count]) => ({ hour, count })),
      heatmap: dayRows.map((row) => ({ day: row.day, count: row.total, chapter: chapterForDate(`${row.day}T00:00:00`) })),
      mostActiveDay,
      mostActiveMonth,
      longestStreak: streak
    },
    phrases: phraseStats,
    emoji: {
      overall: [...emojiCounts.entries()].map(([emoji, count]) => ({ emoji, count })).sort((a, b) => b.count - a.count).slice(0, 24),
      byPerson: {
        Daniel: [...emojiByPerson.Daniel.entries()].map(([emoji, count]) => ({ emoji, count })).sort((a, b) => b.count - a.count).slice(0, 16),
        Isabella: [...emojiByPerson.Isabella.entries()].map(([emoji, count]) => ({ emoji, count })).sort((a, b) => b.count - a.count).slice(0, 16)
      },
      monthly: [...emojiMonthly.entries()].map(([month, value]) => ({ month, ...value }))
    },
    firsts,
    hallOfFame,
    funFacts: [
      { title: "The day we could not stop", value: mostActiveDay?.day ?? "Pending data", detail: `${mostActiveDay?.count ?? 0} messages in a single day.` },
      { title: "The month that overflowed", value: mostActiveMonth?.month ?? "Pending data", detail: `${mostActiveMonth?.count ?? 0} messages across one month together through a screen.` },
      { title: "The thread that stayed alive", value: `${streak.days} days`, detail: streak.start ? `${streak.start} through ${streak.end}.` : "Needs more archive data." },
      { title: "Little keepsakes", value: String(mediaTotal), detail: "Photos, videos, stickers, GIFs, and audio that helped frame the story." }
    ],
    evolution: monthRows.map((row) => ({
      month: row.month,
      messages: row.total,
      affection: affectionByMonth.get(row.month) ?? 0,
      emojis: emojiMonthly.get(row.month)?.total ?? 0,
      chapter: chapterForDate(`${row.month}-01T00:00:00`)
    })),
    monthlyMemories
  };
}
