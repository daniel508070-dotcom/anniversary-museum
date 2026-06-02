import { formatMonth } from "@/lib/text";
import type { RelationshipData } from "@/types/relationship";

export function MediaScrapbook({ memories }: { memories: RelationshipData["monthlyMemories"] }) {
  return (
    <div className="scrapbook">
      {memories.slice(-12).map((memory) => (
        <article key={memory.month} className="scrapbook__page">
          <p>{formatMonth(memory.month)}</p>
          <h3>{memory.messages.toLocaleString()} messages</h3>
          <span>{memory.affection.toLocaleString()} times love made itself visible</span>
          <span>{memory.media.toLocaleString()} little keepsakes beyond text</span>
          <p>{memory.messages > 1000 ? "A month so full it feels like the phone was glowing." : "A quieter page, but still ours."}</p>
        </article>
      ))}
    </div>
  );
}
