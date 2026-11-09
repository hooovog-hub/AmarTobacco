# Design notes

Source: `AMAR_Presentation_3.pdf` (product presentation, June 2026).

## Visual language

| Element    | From the deck                                | On the site                                |
| ---------- | -------------------------------------------- | ------------------------------------------ |
| Colors     | Deep black, AMAR red, metallic gold, white   | Tokens in `src/styles/global.css`          |
| Wordmark   | Serif "AMAR" with gold gradient              | `Wordmark.astro` (`gold` / `bright` tones) |
| Crest      | Rearing horses, crown, red shield            | `assets/images/crest.png`                  |
| Headings   | Heavy geometric sans, all caps               | Montserrat 800 (Noto Sans Armenian for HY) |
| Panels     | Color blocks with very large rounded corners | `--radius-panel`, `FeatureSection.astro`   |
| Page marks | Red numbered badge with a gold crown         | `SectionBadge.astro`                       |

## Page map (slide → section)

1. Cover / slide 3 → Hero (red panel + B&W portrait) + key numbers
2. What is AMAR? → About + product lines (Exclusive 1/0.1, Premium Black 4/0.4)
3. The Blend → FeatureSection (black, left)
4. Paper → FeatureSection (red, right)
5. Filters → FeatureSection (white, product cut-out)
6. Manufacturing → FeatureSection (black, left)
7. Packaging → FeatureSection (red, right, product cut-out)
8. Technical specifications → Specs (table over pack grid)
9. Own your ritual → Ritual
10. Partner with AMAR (slides 10–11) → Partner (inquiry form + contacts)

## Content changes vs. the deck

- "Diacel" corrected to **Daicel** (the Japanese acetate tow manufacturer).
- Russian and Armenian copy are new translations — have a native speaker proofread before launch.
