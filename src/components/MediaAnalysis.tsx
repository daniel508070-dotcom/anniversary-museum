import type { RelationshipData } from "@/types/relationship";

const labels: Record<string, string> = {
  photo: "Photos",
  video: "Videos",
  sticker: "Stickers",
  gif: "GIFs",
  audio: "Audio"
};
const details: Record<string, string> = {
  photo: "Photos that framed little pieces of our history.",
  video: "Moving moments that kept the day alive for a little longer.",
  sticker: "Tiny reactions with big personality, sent when words needed a face.",
  gif: "Little bursts of motion that made the conversation smile.",
  audio: "Voice and sound kept close, like hearing the day breathe."
};
const visibleKinds = new Set(["photo", "video", "sticker", "gif", "audio"]);

export function MediaAnalysis({ data }: { data: RelationshipData }) {
  return (
    <div className="media-analysis">
      {Object.entries(data.totals.mediaBySender).filter(([kind]) => visibleKinds.has(kind)).map(([kind, totals]) => {
        const total = totals.Daniel + totals.Isabella;
        const daniel = total ? (totals.Daniel / total) * 100 : 0;
        const isabella = total ? (totals.Isabella / total) * 100 : 0;
        return (
          <article key={kind}>
            <div>
              <h3>{labels[kind] ?? kind}</h3>
              <p>{total.toLocaleString()} total</p>
              <small>{details[kind]}</small>
            </div>
            <div className="split-meter" aria-label={`${labels[kind] ?? kind} by sender`}>
              <span style={{ width: `${daniel}%` }} />
              <span style={{ width: `${isabella}%` }} />
            </div>
            <footer>
              <span>Daniel {totals.Daniel.toLocaleString()}</span>
              <span>Isabella {totals.Isabella.toLocaleString()}</span>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
