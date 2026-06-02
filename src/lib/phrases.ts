import { normalizeText } from "@/lib/text";

export const phraseDefinitions = [
  {
    key: "i-love-you",
    label: "I love you",
    patterns: [/\bi love you\b/g]
  },
  {
    key: "love-you",
    label: "Love you",
    patterns: [/(?<!\bi )\blove you\b/g]
  },
  {
    key: "te-amo",
    label: "Te Amo",
    patterns: [/\bte amo+\b/g]
  },
  {
    key: "te-quiero",
    label: "Te quiero",
    patterns: [/\bte quiero+\b/g],
    validator: isRomanticTeQuiero
  }
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

function isRomanticTeQuiero(text: string, matchIndex: number): boolean {
  const normalized = normalizeText(text);
  const after = normalized.slice(matchIndex + "te quiero".length).trim();
  const nextWord = after.match(/^[a-zñ]+/)?.[0] ?? "";
  if (teQuieroNonRomanticNextWords.has(nextWord)) return false;
  if (/^(que|porque|pa|para|por)\b/.test(after)) return false;
  return true;
}

export function countPhraseMatches(text: string, key: string): number {
  const definition = phraseDefinitions.find((item) => item.key === key);
  if (!definition) return 0;
  const normalized = normalizeText(text);
  return definition.patterns.reduce((sum, pattern) => {
    let count = 0;
    for (const match of normalized.matchAll(pattern)) {
      const index = match.index ?? 0;
      if ("validator" in definition && definition.validator && !definition.validator(text, index)) continue;
      count += 1;
    }
    return sum + count;
  }, 0);
}

export function hasAnyAffection(text: string): boolean {
  return phraseDefinitions.some((definition) => countPhraseMatches(text, definition.key) > 0);
}
