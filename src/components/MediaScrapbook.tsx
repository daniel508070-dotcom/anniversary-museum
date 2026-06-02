import { formatMonth } from "@/lib/text";
import type { RelationshipData } from "@/types/relationship";

const affectionLines = [
  "little proofs that tenderness kept returning",
  "soft sparks where love came up for air",
  "moments when the message held more than words",
  "tiny lanterns of affection in the middle of the month"
];
const keepsakeLines = [
  "keepsakes that framed another piece of our history",
  "small things we sent because words were not enough",
  "little windows into what the day felt like",
  "pieces of us saved between jokes, plans, and goodnights"
];
const closingLines = [
  "A month with its own color, its own pulse, its own little weather.",
  "Some days were loud, some were quiet, but the thread still felt like us.",
  "A page of ordinary moments that became sweeter because we shared them.",
  "The kind of month that makes the archive feel less like data and more like a room.",
  "A soft chapter of check-ins, laughter, and tiny reasons to come back."
];

export function MediaScrapbook({ memories }: { memories: RelationshipData["monthlyMemories"] }) {
  return (
    <div className="scrapbook">
      {memories.slice(-12).map((memory, index) => {
        const monthNumber = Number(memory.month.slice(5, 7));
        const toneIndex = (monthNumber + index) % closingLines.length;
        return (
          <article key={memory.month} className="scrapbook__page">
            <p>{formatMonth(memory.month)}</p>
            <h3>{memory.messages.toLocaleString()} messages</h3>
            <span>{memory.affection.toLocaleString()} {affectionLines[toneIndex % affectionLines.length]}</span>
            <span>{memory.media.toLocaleString()} {keepsakeLines[(toneIndex + 1) % keepsakeLines.length]}</span>
            <p>{closingLines[toneIndex]}</p>
          </article>
        );
      })}
    </div>
  );
}
