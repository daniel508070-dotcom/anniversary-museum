import { AnimatedSection } from "@/components/AnimatedSection";
import { ArtifactCard } from "@/components/ArtifactCard";
import { ChapterTimeline } from "@/components/ChapterTimeline";
import { CommunicationStats } from "@/components/CommunicationStats";
import { EmojiGlass } from "@/components/EmojiGlass";
import { EvolutionChart } from "@/components/EvolutionChart";
import { Heatmap } from "@/components/Heatmap";
import { MediaAnalysis } from "@/components/MediaAnalysis";
import { MediaScrapbook } from "@/components/MediaScrapbook";
import { MetricReliquary } from "@/components/MetricReliquary";
import { PhraseComparison } from "@/components/PhraseComparison";
import { ScrollProgress } from "@/components/ScrollProgress";
import { formatMonth } from "@/lib/text";
import type { RelationshipData } from "@/types/relationship";

export function CathedralExperience({ data }: { data: RelationshipData }) {
  const isSample = data.source.mode === "sample";
  const mostActiveMonth = data.activity.mostActiveMonth ? formatMonth(data.activity.mostActiveMonth.month) : "one unforgettable month";

  return (
    <main className="museum">
      <ScrollProgress />
      <div className="living-backdrop" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <section className="hero">
        <div className="hero__ornament" aria-hidden="true" />
        <div className="hero__halo" aria-hidden="true" />
        <div className="hero__ticker" aria-hidden="true">
          <span>te amo</span>
          <span>i love you</span>
          <span>isaokay</span>
          <span>forever</span>
        </div>
        <p className="eyebrow">A private museum for our nineteenth month</p>
        <h1>Daniel & Isabella</h1>
        <p>
          A walk through the words we left for each other: the first sparks, the days we
          could barely stop talking, the quiet stretch apart, the return, the promise, and
          the morning-after feeling of becoming husband and wife.
        </p>
        <div className="hero__stats" aria-label="Archive summary">
          <span><strong>{data.totals.messages.toLocaleString()}</strong> little pieces of us</span>
          <span><strong>{data.totals.daysActive.toLocaleString()}</strong> days we reached for each other</span>
          <span><strong>{mostActiveMonth}</strong> when the screen could not keep up</span>
        </div>
        {isSample && (
          <p className="sample-note">
            Sample data is active. Generate from the WhatsApp `_chat.txt` export to reveal the real archive.
          </p>
        )}
      </section>

      <AnimatedSection className="chapter-band">
        <div className="section-heading">
          <p className="eyebrow">The nave opens</p>
          <h2>Six rooms in the story of finding our way here</h2>
          <p>
            Each chapter keeps its own light: curiosity, warmth, silence, return, promise,
            and finally the cathedral doors of marriage.
          </p>
        </div>
        <ChapterTimeline chapters={data.chapters} milestones={data.milestones} />
      </AnimatedSection>

      <AnimatedSection className="wrapped-panel">
        <p className="eyebrow">The scale of us</p>
        <h2>{data.totals.messages.toLocaleString()}</h2>
        <p>
          Not just messages. Invitations, jokes, apologies, prayers, plans, late nights,
          check-ins, and proof that love can build a home out of ordinary words.
        </p>
        <div className="metrics-grid">
          <MetricReliquary title="Daniel" value={data.totals.bySender.Daniel.toLocaleString()} detail="times he reached across the day" />
          <MetricReliquary title="Isabella" value={data.totals.bySender.Isabella.toLocaleString()} detail="times she answered with her own light" />
          <MetricReliquary title="Longest streak" value={`${data.activity.longestStreak.days}`} detail="days we kept the thread unbroken" />
          <MetricReliquary title="Most active month" value={mostActiveMonth} detail="when we spent the most time together through a screen" />
        </div>
      </AnimatedSection>

      <AnimatedSection className="story-section emoji-section">
        <div className="section-heading">
          <p className="eyebrow">The words that kept returning</p>
          <h2>Love learned how to speak in both languages</h2>
          <p>
            Some phrases are simple on paper, but they carried whole rooms inside them.
            Especially Te Amo, which deserved to stand on its own.
          </p>
        </div>
        <PhraseComparison phrases={data.phrases} />
      </AnimatedSection>

      <AnimatedSection className="story-section">
        <div className="section-heading">
          <p className="eyebrow">The pulse</p>
          <h2>The months rose and fell like candlelight</h2>
          <p>
            The tallest columns are the seasons when neither of us seemed ready to let
            the conversation end.
          </p>
        </div>
        <EvolutionChart data={data.evolution} chapters={data.chapters} />
      </AnimatedSection>

      <AnimatedSection className="story-section">
        <div className="section-heading">
          <p className="eyebrow">The illuminated calendar</p>
          <h2>The days that glowed because we were talking</h2>
          <p>
            Every lit square is a day when one of us showed up. Some days became tiny
            candles. Some became stained glass.
          </p>
        </div>
        <CommunicationStats data={data} />
        <Heatmap days={data.activity.heatmap} />
      </AnimatedSection>

      <AnimatedSection className="story-section">
        <div className="section-heading">
          <p className="eyebrow">The little relics</p>
          <h2>Stickers, photos, audio, and all the things words could not hold</h2>
          <p>
            Every photo, sound, sticker, and tiny moving thing became another way of
            saying stay with me for a second longer.
          </p>
        </div>
        <MediaAnalysis data={data} />
      </AnimatedSection>

      <AnimatedSection className="gallery-section">
        <div className="section-heading">
          <p className="eyebrow">First relics</p>
          <h2>The first times the archive caught something changing</h2>
          <p>
            A first message. A first I love you. A first Te Amo. The small hinges that
            opened enormous doors.
          </p>
        </div>
        <div className="artifact-grid">
          {data.firsts.map((message) => (
            <ArtifactCard key={`${message.id}-${message.label}`} message={message} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="story-section">
        <div className="section-heading">
          <p className="eyebrow">Stained glass</p>
          <h2>The tiny symbols that kept sneaking in</h2>
          <p>
            Some feelings arrived as words. Others arrived as a single glowing mark.
          </p>
        </div>
        <EmojiGlass emoji={data.emoji} />
      </AnimatedSection>

      <AnimatedSection className="gallery-section">
        <div className="section-heading">
          <p className="eyebrow">Message hall of fame</p>
          <h2>Messages that asked to be framed</h2>
          <p>
            Chosen by the archive: the first romantic spark, the middle of the story,
            Isaokay, and the first heart Isabella sent.
          </p>
        </div>
        <div className="artifact-grid">
          {data.hallOfFame.map((message) => (
            <ArtifactCard key={`${message.id}-${message.label}`} message={message} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="story-section">
        <div className="section-heading">
          <p className="eyebrow">Scrapbook</p>
          <h2>The last pages before this gift</h2>
          <p>
            The recent months still feel close enough to touch: what we said, what we sent,
            and how often love found a way into the day.
          </p>
        </div>
        <MediaScrapbook memories={data.monthlyMemories} />
      </AnimatedSection>

      <AnimatedSection className="facts">
        {data.funFacts.map((fact) => (
          <MetricReliquary key={fact.title} title={fact.title} value={fact.value} detail={fact.detail} />
        ))}
      </AnimatedSection>

      <section className="finale">
        <p className="eyebrow">Benediction</p>
        <h2>After distance, after return, after the promise, there is us</h2>
        <p>
          We were not just lucky to find each other again. We chose it. We came back,
          carried the story through engagement, and walked it into marriage. This archive
          is not the ending. It is the chapel before the rest of our life.
        </p>
      </section>
    </main>
  );
}
