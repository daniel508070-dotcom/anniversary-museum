import type { CSSProperties } from "react";
import type { RelationshipData } from "@/types/relationship";

export function EmojiGlass({ emoji }: { emoji: RelationshipData["emoji"] }) {
  return (
    <div className="emoji-glass">
      {emoji.overall.length === 0 ? (
        <p>No emoji found yet.</p>
      ) : (
        emoji.overall.map((item, index) => (
          <span key={`${item.emoji}-${index}`} style={{ "--weight": Math.min(2.2, 1 + item.count / 8) } as CSSProperties}>
            {item.emoji}
          </span>
        ))
      )}
    </div>
  );
}
