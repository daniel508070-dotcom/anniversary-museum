import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const defaultChatPath = "C:\\Users\\Daniel C\\Downloads\\WhatsApp Chat - Amor♥️\\_chat.txt";
const outputPath = path.resolve(projectRoot, "data/generated/relationship.json");

const people = ["Daniel", "Isabella"];
const mediaKinds = ["text", "photo", "video", "voice", "sticker", "gif", "audio", "document"];
const chapters = [
  { id: "before-dating", title: "Before Dating", dateRange: "First messages - February 2023", tone: "The first light through old glass.", description: "The earliest conversations, before the relationship had a name.", color: "#9bddff", start: "2022-01-01", end: "2023-02-28" },
  { id: "first-relationship", title: "First Relationship", dateRange: "March 2023 - January 2024", tone: "A chapter of becoming.", description: "The first official season, with all its intensity and discovery.", color: "#ff4f8b", start: "2023-03-01", end: "2024-01-31" },
  { id: "time-apart", title: "Time Apart", dateRange: "February 2024 - August 2024", tone: "The quiet nave.", description: "The months when distance became part of the story.", color: "#a8dfff", start: "2024-02-01", end: "2024-08-31" },
  { id: "reconciliation", title: "Reconciliation", dateRange: "September 2024 - January 1, 2026", tone: "Finding each other again in the same halls.", description: "The return that began with the first week of school in the same college.", color: "#4ca8ff", start: "2024-09-01", end: "2026-01-01" },
  { id: "engagement", title: "Engagement", dateRange: "January 2, 2026 - May 26, 2026", tone: "A promise set in color.", description: "The season of choosing forever out loud.", color: "#ff6b6b", start: "2026-01-02", end: "2026-05-26" },
  { id: "marriage", title: "Marriage", dateRange: "May 27, 2026 - Present", tone: "The doors open.", description: "The beginning of the chapter that keeps unfolding.", color: "#f45f73", start: "2026-05-27" }
];
const milestones = [
  { date: "2022-04-24", title: "First Conversations", chapter: "before-dating", body: "The archive begins with two voices learning the shape of each other." },
  { date: "2023-03-01", title: "Began Dating", chapter: "first-relationship", body: "The story became a relationship." },
  { date: "2024-02-01", title: "A Time Apart", chapter: "time-apart", body: "A quiet interval entered the record." },
  { date: "2024-09-01", title: "Same College, Same Beginning Again", chapter: "reconciliation", body: "The first week of school became a doorway back." },
  { date: "2026-01-02", title: "Engaged", chapter: "engagement", body: "A promise took form." },
  { date: "2026-05-27", title: "Married", chapter: "marriage", body: "The love story became a covenant." }
];
const phraseDefinitions = [
  { key: "i-love-you", label: "I love you", pattern: /\bi love you\b/g },
  { key: "love-you", label: "Love you", pattern: /(?<!\bi )\blove you\b/g },
  { key: "te-amo", label: "Te Amo", pattern: /\bte amo+\b/g },
  { key: "te-quiero", label: "Te quiero", pattern: /\bte quiero+\b/g, validator: isRomanticTeQuiero }
];
const emojiPattern = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;
const linePattern = /^[\u200e\u200f]*\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s+([^\]]+)\]\s+(.+)$/u;
const senderPattern = /^([^:]+):\s*([\s\S]*)$/u;
const systemPatterns = [
  /mensajes y las llamadas estan cifrados/,
  /messages and calls are end-to-end encrypted/,
  /cambiaste tu codigo de seguridad/,
  /changed their phone number/,
  /security code changed/
];
const teQuieroNonRomanticNextWords = new Set([
  "ayudar",
  "preguntar",
  "decir",
  "contar",
  "pedir",
  "mostrar",
  "mandar",
  "enviar",
  "explicar",
  "hablar",
  "ver",
  "dar",
  "hacer",
  "invitar",
  "recordar",
  "avisar",
  "comentar",
  "consultar",
  "aclarar",
  "ensenar",
  "presentar",
  "llevar",
  "traer",
  "llamar",
  "buscar",
  "molestar"
]);

function cliValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function stripControls(value = "") {
  return String(value).replace(/[\u200e\u200f\u202a-\u202e]/g, "").trim();
}

function normalizeText(value = "") {
  return stripControls(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function isRomanticTeQuiero(text, matchIndex) {
  const normalized = normalizeText(text);
  const after = normalized.slice(matchIndex + "te quiero".length).trim();
  const nextWord = after.match(/^[a-zñ]+/)?.[0] ?? "";
  if (teQuieroNonRomanticNextWords.has(nextWord)) return false;
  if (/^(que|porque|pa|para|por)\b/.test(after)) return false;
  return true;
}

function parseTimestamp(monthOrDay, dayOrMonth, yearValue, timeValue) {
  const first = Number(monthOrDay);
  const second = Number(dayOrMonth);
  const year = Number(yearValue.length === 2 ? `20${yearValue}` : yearValue);
  let month = first;
  let day = second;
  if (first > 12 && second <= 12) {
    day = first;
    month = second;
  }

  const time = normalizeText(timeValue).replace(/\s+/g, " ");
  const ampmMatch = time.match(/([ap])\.?\s*m\.?|([ap])m/);
  const timeNumbers = time.match(/\d{1,2}/g) ?? [];
  let hour = Number(timeNumbers[0] ?? 0);
  const minute = Number(timeNumbers[1] ?? 0);
  const secondValue = Number(timeNumbers[2] ?? 0);
  const meridiem = ampmMatch?.[1] ?? ampmMatch?.[2];
  if (meridiem === "p" && hour < 12) hour += 12;
  if (meridiem === "a" && hour === 12) hour = 0;

  const date = new Date(year, month - 1, day, hour, minute, secondValue);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Unable to parse timestamp: ${monthOrDay}/${dayOrMonth}/${yearValue}, ${timeValue}`);
  }
  return date.toISOString();
}

function senderName(rawSender) {
  const normalized = normalizeText(rawSender);
  if (normalized.includes("daniel")) return "Daniel";
  return "Isabella";
}

function detectMediaKind(rawText) {
  const text = normalizeText(rawText);
  if (text.includes("<media omitted>") || text.includes("multimedia omitido")) return "unknown";
  if (text.includes("sticker omitido") || text.includes("sticker omitted")) return "sticker";
  if (text.includes("imagen omitida") || text.includes("image omitted") || text.includes("foto omitida") || text.includes("photo omitted")) return "photo";
  if (text.includes("video omitido") || text.includes("video omitted")) return "video";
  if (text.includes("audio omitido") || text.includes("audio omitted")) return "audio";
  if (text.includes("gif omitido") || text.includes("gif omitted")) return "gif";
  if (text.includes("documento omitido") || text.includes("document omitted")) return "document";
  if (text.includes(".opus") || text.includes(".m4a") || text.includes(".mp3")) return "voice";
  if (text.includes(".jpg") || text.includes(".jpeg") || text.includes(".png") || text.includes(".heic") || text.includes(".webp")) return "photo";
  if (text.includes(".mp4") || text.includes(".mov")) return "video";
  return "text";
}

function isSystemMessage(text) {
  const normalized = normalizeText(text);
  return systemPatterns.some((pattern) => pattern.test(normalized));
}

function parseChatExport(chatPath) {
  const content = fs.readFileSync(chatPath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/);
  const messages = [];
  const systemMessages = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    current.text = stripControls(current.text);
    current.mediaKind = detectMediaKind(current.text);
    if (isSystemMessage(current.text)) systemMessages.push(current);
    else messages.push(current);
  }

  for (const line of lines) {
    const match = stripControls(line).match(linePattern);
    if (!match) {
      if (current && line.trim()) current.text += `\n${stripControls(line)}`;
      continue;
    }
    pushCurrent();
    const [, a, b, year, time, rest] = match;
    const senderMatch = rest.match(senderPattern);
    if (!senderMatch) {
      systemMessages.push({
        id: `system-${systemMessages.length + 1}`,
        sender: "Isabella",
        senderRaw: "system",
        timestamp: parseTimestamp(a, b, year, time),
        text: stripControls(rest),
        mediaKind: "text",
        system: true
      });
      current = null;
      continue;
    }
    const [, rawSender, text] = senderMatch;
    current = {
      id: `message-${messages.length + systemMessages.length + 1}`,
      sender: senderName(rawSender),
      senderRaw: stripControls(rawSender),
      timestamp: parseTimestamp(a, b, year, time),
      text: stripControls(text),
      mediaKind: "text"
    };
  }
  pushCurrent();
  return { messages, systemMessages };
}

function chapterForDate(value) {
  const time = new Date(value).getTime();
  return chapters.find((chapter) => {
    const start = new Date(`${chapter.start}T00:00:00`).getTime();
    const end = chapter.end ? new Date(`${chapter.end}T23:59:59`).getTime() : Number.POSITIVE_INFINITY;
    return time >= start && time <= end;
  })?.id ?? "before-dating";
}

function monthKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function dayKey(value) {
  return value.slice(0, 10);
}

function emptyTotals() {
  return { Daniel: 0, Isabella: 0 };
}

function increment(map, key, sender, amount = 1) {
  const totals = map.get(key) ?? emptyTotals();
  totals[sender] += amount;
  map.set(key, totals);
}

function countPhrase(text, definition) {
  const normalized = normalizeText(text);
  const matches = normalized.matchAll(definition.pattern);
  let count = 0;
  for (const match of matches) {
    const index = match.index ?? 0;
    if (definition.validator && !definition.validator(text, index)) continue;
    count += 1;
  }
  return count;
}

function hasAffection(text) {
  return phraseDefinitions.some((definition) => countPhrase(text, definition) > 0);
}

function extractEmoji(text) {
  return stripControls(text).match(emojiPattern) ?? [];
}

function hasHeartEmoji(text) {
  return /[❤♥💕💖💗💘💞💓💝💟❣]/u.test(stripControls(text));
}

function excerpt(text, max = 240) {
  const clean = stripControls(text).replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}...` : clean;
}

function toFeatured(message, label) {
  return {
    id: message.id,
    label,
    sender: message.sender,
    timestamp: message.timestamp,
    text: excerpt(message.text),
    chapter: chapterForDate(message.timestamp)
  };
}

function longestStreak(days) {
  const uniqueDays = [...new Set(days)].sort();
  if (!uniqueDays.length) return { start: "", end: "", days: 0 };
  let bestStart = uniqueDays[0], bestEnd = uniqueDays[0], currentStart = uniqueDays[0], best = 1, current = 1;
  let previous = new Date(`${uniqueDays[0]}T00:00:00`);
  for (const day of uniqueDays.slice(1)) {
    const date = new Date(`${day}T00:00:00`);
    const diff = Math.round((date.getTime() - previous.getTime()) / 86400000);
    if (diff === 1) current += 1;
    else { currentStart = day; current = 1; }
    if (current > best) { best = current; bestStart = currentStart; bestEnd = day; }
    previous = date;
  }
  return { start: bestStart, end: bestEnd, days: best };
}

function topWords(messages) {
  const stop = new Set(["the", "and", "you", "que", "por", "para", "con", "pero", "como", "una", "los", "las", "del", "eso", "esta", "este", "have", "that", "this", "jaja", "jajaj", "jajaja", "omitted", "omitido", "sticker"]);
  const counts = new Map();
  for (const message of messages) {
    for (const word of normalizeText(message.text).match(/[a-z0-9ñ]{3,}/g) ?? []) {
      if (stop.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24).map(([phrase, count]) => ({ phrase, count }));
}

function analyze(messages, systemMessages, chatPath) {
  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const bySender = emptyTotals();
  const textBySender = emptyTotals();
  const mediaBySender = Object.fromEntries(mediaKinds.map((kind) => [kind, emptyTotals()]));
  const byYear = new Map(), byMonth = new Map(), byDay = new Map(), byHour = new Map(), emojiCounts = new Map();
  const emojiByPerson = { Daniel: new Map(), Isabella: new Map() };
  const emojiMonthly = new Map(), monthlyMedia = new Map(), monthlyMediaItems = new Map(), affectionByMonth = new Map();

  for (const message of messages) {
    const date = new Date(message.timestamp);
    const year = String(date.getFullYear());
    const month = monthKey(message.timestamp);
    const day = dayKey(message.timestamp);
    bySender[message.sender] += 1;
    if (message.mediaKind === "text") textBySender[message.sender] += 1;
    if (mediaBySender[message.mediaKind]) mediaBySender[message.mediaKind][message.sender] += 1;
    increment(byYear, year, message.sender);
    increment(byMonth, month, message.sender);
    increment(byDay, day, message.sender);
    byHour.set(date.getHours(), (byHour.get(date.getHours()) ?? 0) + 1);
    if (hasAffection(message.text)) affectionByMonth.set(month, (affectionByMonth.get(month) ?? 0) + 1);
    for (const emoji of extractEmoji(message.text)) {
      emojiCounts.set(emoji, (emojiCounts.get(emoji) ?? 0) + 1);
      emojiByPerson[message.sender].set(emoji, (emojiByPerson[message.sender].get(emoji) ?? 0) + 1);
      const monthly = emojiMonthly.get(month) ?? { romantic: 0, playful: 0, total: 0 };
      monthly.total += 1;
      if (emoji.includes("❤") || emoji.includes("♥") || emoji === "💍") monthly.romantic += 1;
      else monthly.playful += 1;
      emojiMonthly.set(month, monthly);
    }
    if (message.mediaKind !== "text") {
      monthlyMedia.set(month, (monthlyMedia.get(month) ?? 0) + 1);
      const items = monthlyMediaItems.get(month) ?? [];
      items.push({ kind: message.mediaKind, sender: message.sender, timestamp: message.timestamp });
      monthlyMediaItems.set(month, items);
    }
  }

  const phraseStats = phraseDefinitions.map((definition) => {
    const monthly = new Map();
    const totals = emptyTotals();
    let first;
    for (const message of messages) {
      const count = countPhrase(message.text, definition);
      if (!count) continue;
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
      monthly: [...monthly.entries()].map(([month, total]) => ({ month, Daniel: total.Daniel, Isabella: total.Isabella }))
    };
  });

  const dayRows = [...byDay.entries()].map(([day, totals]) => ({ day, Daniel: totals.Daniel, Isabella: totals.Isabella, total: totals.Daniel + totals.Isabella }));
  const monthRows = [...byMonth.entries()].map(([month, totals]) => ({ month, Daniel: totals.Daniel, Isabella: totals.Isabella, total: totals.Daniel + totals.Isabella }));
  const maxDay = [...dayRows].sort((a, b) => b.total - a.total)[0];
  const maxMonth = [...monthRows].sort((a, b) => b.total - a.total)[0];
  const streak = longestStreak(dayRows.map((row) => row.day));
  const firsts = [
    messages[0] && toFeatured(messages[0], "First message"),
    phraseStats.find((item) => item.key === "i-love-you")?.first,
    phraseStats.find((item) => item.key === "te-amo")?.first
  ].filter(Boolean);
  const affectionate = messages.filter((message) => hasAffection(message.text));
  const firstIsaokay = messages.find((message) => message.sender === "Isabella" && /\bisa\s*okay\b/i.test(normalizeText(message.text)));
  const firstIsabellaHeart = messages.find((message) => message.sender === "Isabella" && hasHeartEmoji(message.text));
  const hallOfFame = [
    affectionate[0] && toFeatured(affectionate[0], "First Openly Romantic Message"),
    affectionate[Math.floor(affectionate.length / 2)] && toFeatured(affectionate[Math.floor(affectionate.length / 2)], "A Message From The Middle"),
    firstIsaokay && toFeatured(firstIsaokay, "First Isaokay"),
    firstIsabellaHeart && toFeatured(firstIsabellaHeart, "First Heart From Isabella")
  ].filter(Boolean);
  const visibleMediaKinds = new Set(["photo", "video", "sticker", "gif", "audio"]);
  const mediaTotal = Object.entries(mediaBySender).reduce((sum, [kind, totals]) => {
    if (!visibleMediaKinds.has(kind)) return sum;
    return sum + totals.Daniel + totals.Isabella;
  }, 0);
  const affectionateMonth = [...affectionByMonth.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    generatedAt: new Date().toISOString(),
    source: {
      mode: "whatsapp-export",
      contactQuery: "Amor♥️",
      path: chatPath,
      parsedMessages: messages.length,
      skippedSystemMessages: systemMessages.length,
      warnings: mediaTotal ? [] : ["No media placeholders were detected in the export."]
    },
    people, chapters, milestones,
    totals: {
      messages: messages.length,
      daysActive: dayRows.length,
      averagePerActiveDay: dayRows.length ? Number((messages.length / dayRows.length).toFixed(1)) : 0,
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
      mostActiveDay: maxDay && { day: maxDay.day, count: maxDay.total },
      mostActiveMonth: maxMonth && { month: maxMonth.month, count: maxMonth.total },
      longestStreak: streak
    },
    phrases: phraseStats,
    topPhrases: topWords(messages),
    emoji: {
      overall: [...emojiCounts.entries()].map(([emoji, count]) => ({ emoji, count })).sort((a, b) => b.count - a.count).slice(0, 24),
      byPerson: Object.fromEntries(people.map((person) => [person, [...emojiByPerson[person].entries()].map(([emoji, count]) => ({ emoji, count })).sort((a, b) => b.count - a.count).slice(0, 16)])),
      monthly: [...emojiMonthly.entries()].map(([month, value]) => ({ month, ...value }))
    },
    firsts,
    hallOfFame,
    funFacts: [
      { title: "The day we could not stop", value: maxDay?.day ?? "Pending data", detail: `${maxDay?.total ?? 0} messages in a single day.` },
      { title: "The month that overflowed", value: maxMonth?.month ?? "Pending data", detail: `${maxMonth?.total ?? 0} messages across one month together through a screen.` },
      { title: "The thread that stayed alive", value: `${streak.days} days`, detail: streak.start ? `${streak.start} through ${streak.end}.` : "Needs more archive data." },
      { title: "Little keepsakes", value: String(mediaTotal), detail: "Photos, videos, stickers, GIFs, and audio that helped frame the story." },
      { title: "The tenderest month", value: affectionateMonth?.[0] ?? "Pending data", detail: `${affectionateMonth?.[1] ?? 0} messages where affection rose to the surface.` }
    ],
    evolution: monthRows.map((row) => ({ month: row.month, messages: row.total, affection: affectionByMonth.get(row.month) ?? 0, emojis: emojiMonthly.get(row.month)?.total ?? 0, chapter: chapterForDate(`${row.month}-01T00:00:00`) })),
    monthlyMemories: monthRows.map((row) => ({
      month: row.month,
      chapter: chapterForDate(`${row.month}-01T00:00:00`),
      messages: row.total,
      affection: affectionByMonth.get(row.month) ?? 0,
      media: monthlyMedia.get(row.month) ?? 0,
      caption: row.total > 1000 ? "This was one of the months when the conversation kept spilling over." : "A quieter page, but still part of the way back to us.",
      mediaItems: (monthlyMediaItems.get(row.month) ?? []).slice(0, 6)
    }))
  };
}

const chatPath = path.resolve(cliValue("--chat") ?? defaultChatPath);
if (!fs.existsSync(chatPath)) {
  throw new Error(`WhatsApp export not found: ${chatPath}`);
}
const { messages, systemMessages } = parseChatExport(chatPath);
if (!messages.length) {
  throw new Error(`No messages parsed from ${chatPath}`);
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(analyze(messages, systemMessages, chatPath), null, 2)}\n`, "utf8");
console.log(`Parsed ${messages.length} messages and ${systemMessages.length} system messages from ${chatPath}`);
console.log(`Wrote ${outputPath}`);
