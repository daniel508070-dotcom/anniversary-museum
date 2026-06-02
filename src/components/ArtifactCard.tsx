import { formatDate } from "@/lib/text";
import type { FeaturedMessage } from "@/types/relationship";

export function ArtifactCard({ message }: { message: FeaturedMessage }) {
  return (
    <article className="artifact-card">
      <p className="artifact-card__label">{message.label}</p>
      <blockquote>{message.text || "Media message without preserved text."}</blockquote>
      <footer>
        <span>{message.sender}</span>
        <time dateTime={message.timestamp}>{formatDate(message.timestamp)}</time>
      </footer>
    </article>
  );
}
