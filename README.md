# Daniel & Isabella Anniversary Museum

A private static anniversary website generated from a WhatsApp exported chat text file.

The site is intentionally designed as a digital museum and love letter, not as a plain analytics dashboard. It combines relationship chapters, first messages, affection trends, media counts, emoji traces, and a cinematic finale.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Static export for GitHub Pages
- No backend

## First Run

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js. The access PIN is:

```text
****
```

## Generate From WhatsApp Export

The source of truth is the exported WhatsApp `_chat.txt` file:

```text
C:\Users\Daniel C\Downloads\WhatsApp Chat - Amor♥️\_chat.txt
```

Generate the static relationship JSON:

```bash
npm run generate:data
```

Or pass a different export path:

```bash
npm run generate:data -- --chat "C:\path\to\_chat.txt"
```

The parser supports common WhatsApp export formats, including bracketed iPhone/Windows lines, 12-hour or 24-hour timestamps, Spanish `a. m.` / `p. m.` markers, multi-line messages, system messages, and common media placeholders such as `sticker omitido`, `imagen omitida`, `video omitido`, and `audio omitido`.

Review `data/generated/relationship.json` before gifting.

## Build

```bash
npm run build
```

The static site is emitted to:

```text
out/
```

## GitHub Pages

Because `next.config.ts` uses `output: "export"` and unoptimized images, the generated `out/` directory can be deployed to GitHub Pages.

Recommended workflow:

```bash
npm run generate:data
npm run build
```

Then publish `out/` with your preferred GitHub Pages action.

## Regeneration Workflow

Whenever the WhatsApp export changes:

1. Export the WhatsApp chat again.
2. Replace or point to the new `_chat.txt`.
3. Run `npm run generate:data`.
4. Review the generated JSON, especially firsts and Hall of Fame messages.
5. Run `npm run build`.
6. Deploy the new `out/` folder.

## Privacy Notes

The generated JSON may contain private messages. Keep `data/generated/relationship.json` and the original WhatsApp export private unless you intentionally deploy them.

The access screen is romantic, not security. Anyone with the static files can inspect the generated content.

## Chapter Boundaries

- Before Dating: first archive messages through February 2023
- First Relationship: March 2023 through January 2024
- Time Apart: February 2024 through August 2024
- Reconciliation: September 2024 through January 1, 2026
- Engagement: January 2, 2026 through May 26, 2026
- Marriage: May 27, 2026 onward

## Verification

```bash
npm run verify:data
npm run build
```

`verify:data` confirms the generated data has the required top-level structure, the six chapters, and the expected people.
