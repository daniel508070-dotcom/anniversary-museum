const emojiPattern = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;
const romantic = new Set(["♥", "❤️", "💕", "💖", "💗", "💘", "💞", "💓", "💍", "😘", "🥰", "😍"]);

export function extractEmoji(text: string): string[] {
  return text.match(emojiPattern) ?? [];
}

export function isRomanticEmoji(value: string): boolean {
  return romantic.has(value) || value.includes("❤") || value.includes("♥");
}
