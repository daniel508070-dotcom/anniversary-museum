import type { RelationshipData } from "@/types/relationship";

const labels: Record<string, string> = {
  photo: "Photo placeholders",
  video: "Videos",
  sticker: "Stickers",
  gif: "GIFs",
  audio: "Audio"
};
const details: Record<string, string> = {
  photo: "Counted from WhatsApp image placeholders in the exported text.",
  video: "Counted from WhatsApp video placeholders.",
  sticker: "Counted separately from saved photos.",
  gif: "Counted from GIF placeholders.",
  audio: "Includes audio and voice-note placeholders from the export."
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
