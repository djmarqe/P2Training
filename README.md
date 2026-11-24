# ASE P2 Study Materials

Practice materials for the ASE P2 Automobile Parts Specialist certification test — a self-scoring daily drill app and a written study guide.

## What's here

**`index.html`** — the trainer. One page with 238 questions and no build step or server required. It loads `drills.js` from the same folder to mix fresh questions into sessions, and still works from the bank alone if that file is missing. Open it in any browser, including on a phone. Progress saves locally on the device.

**`study-guide.md`** — the written guide: the official content blueprint with question counts per area, a breakdown of the five ASE question formats, condensed review notes covering the published task list, and a 102-question practice exam with an explained answer key.

**`study-guide.html`** — the same guide as a web page, styled to match the trainer and linked from its home screen. Generated from `study-guide.md`, so edit the markdown and regenerate rather than editing the HTML directly. The night-mode `<script>` and dark color block in its `<head>` were added by hand, so carry them over when regenerating.

**Night mode** — every page opens dark by default. "Switch to light mode" at the bottom of the trainer's home screen changes it for all pages on that device.

**`drills.html`** — fresh drills. Picture-ID questions (bolt heads, micrometer, flares, lug seats, alignment, bulbs, belts, VIN) and no-calculator math, generated new on every run so nothing can be answered from memory. Linked from the trainer's home screen. No progress is saved.

**`drills.js`** — the question generators behind the fresh drills, shared by `drills.html` and the trainer. Run `node drills.js` to self-test them after an edit.

## Using the trainer

Open `index.html` directly from disk, or enable GitHub Pages on this repository (Settings → Pages → deploy from the `main` branch, root folder) and the trainer will be live at your Pages URL. That's the easier option for phone practice — bookmark it to the home screen and it behaves like an app.

Four modes:

- **Daily 20** — a set weighted to match the real blueprint, with previously missed questions pushed to the front. Three of the 20 are fresh generated questions (at least one math), and the mock exam gets 11 of its 75. Fresh questions count toward the accuracy bars but cannot come back in Review misses, since each one exists only once
- **Drill one area** — 15 questions from a single content area
- **Review misses** — a set built only from questions answered wrong
- **Full mock exam** — 75 questions on a 90-minute timer, matching test conditions

The home screen charts accuracy against the actual blueprint, so each bar's width is that content area's real share of the scored test.

## About the test

85 questions, 90 minutes. Ten are unscored research items mixed in unmarked, so every question gets answered. The 75 scored questions break down as: general operations 10, customer relations and sales 11, vehicle systems 40, vehicle identification 3, catalog and information systems 6, inventory management 3, merchandising 2.

Certification also requires two years of relevant parts experience, with appropriate training substituting for up to one year. Passing the test alone does not certify you. Certification lasts five years.

## Accuracy

Questions were written against the published ASE task list and standard industry practice. They are practice material, not actual test items, and no affiliation with or endorsement by ASE is claimed or implied. Verify anything that matters against the official ASE study guide at ase.com.

## Audio episodes

**`podcast/`** — The P2 Counter, five audio episodes of about 15 minutes each that walk the whole blueprint as a two-voice conversation, with a rapid-fire review at the end of each. Linked from the trainer's home screen, or open `podcast/index.html`. The scripts are alongside as markdown and the audio was rendered from them with Windows text-to-speech.
