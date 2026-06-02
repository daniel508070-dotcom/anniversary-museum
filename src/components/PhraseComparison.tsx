import type { CSSProperties } from "react";
import type { PhraseStat } from "@/types/relationship";

export function PhraseComparison({ phrases }: { phrases: PhraseStat[] }) {
  const displayedPhrases = phrases.filter((phrase) => ["i-love-you", "te-amo"].includes(phrase.key));

  return (
    <div className="phrase-list">
      {displayedPhrases.map((phrase) => {
        const danielPercent = phrase.total ? (phrase.daniel / phrase.total) * 100 : 50;
        const isabellaPercent = phrase.total ? (phrase.isabella / phrase.total) * 100 : 50;
        const winner = phrase.daniel === phrase.isabella ? "A tie, which feels right." : phrase.daniel > phrase.isabella ? "Daniel said it more." : "Isabella said it more.";
        return (
          <article key={phrase.key} className="phrase-row">
            <div className="phrase-row__intro">
              <h3>{phrase.label}</h3>
              <p>{phrase.total.toLocaleString()} times this phrase found its way into the story</p>
              <strong>{winner}</strong>
            </div>
            <div className="phrase-duel" aria-label={`${phrase.label} comparison`}>
              <div className="phrase-duel__side phrase-duel__side--daniel">
                <span>Daniel</span>
                <strong>{phrase.daniel.toLocaleString()}</strong>
              </div>
              <div className="phrase-duel__center">vs</div>
              <div className="phrase-duel__side phrase-duel__side--isabella">
                <span>Isabella</span>
                <strong>{phrase.isabella.toLocaleString()}</strong>
              </div>
              <div
                className="phrase-duel__meter"
                style={{ "--daniel": `${danielPercent}%`, "--isabella": `${isabellaPercent}%` } as CSSProperties}
              >
                <span />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
