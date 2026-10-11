# AI use log

The Congressional App Challenge requires full disclosure of AI use. This file records what Claude (Anthropic's AI assistant, used through Claude Code) produced for this project, so the team can disclose it accurately. Add to it whenever AI helps.

## Produced by Claude

| Date | What | Files |
|---|---|---|
| 2026-10-09 | First version of the page, styling and all JavaScript (school filter, email generator, copy and mailto buttons, saved student info, deadline countdown) | `index.html`, `style.css`, `app.js` |
| 2026-10-09 | Default email template (placeholder until replaced) | `data/email-template.js` |
| 2026-10-09 | Script that turned federal school data (U.S. Department of Education CCD 2023-24, via the Urban Institute Education Data API) into the school list | `data/schools.js` |
| 2026-10-10 | Rewrote site wording | `index.html`, `app.js` |
| 2026-10-10 | Redesign plan and wireframes (layout A) | `docs/superpowers/specs/2026-10-10-examonly-redesign-design.md` |
| 2026-10-10 | Redesign: new page structure, styling and JavaScript changes | `index.html`, `style.css`, `app.js` |
| 2026-10-10 | "Schools near me": ZIP code search with distances (haversine formula), plus the script that built the ZIP location file from U.S. Census Bureau 2023 Gazetteer data | `app.js`, `data/zips.js` |
| 2026-10-10 | Study resources: College Board course and exam links for all 42 exams (each link checked), AP Access for ALL course list and prerequisites copied from tnapaccessforall.org, Khan Academy search links | `data/resources.js`, `app.js`, `index.html`, `style.css` |
| 2026-10-10 | Who to contact: emails for five kinds of contacts, "how to find the right person" steps, call script | `data/email-template.js`, `app.js`, `index.html`, `style.css` |
| 2026-10-10 | Rebuilt as a seven-page site with a new design (Archivo font, tally-mark graphic, colour bands): Home, Find schools, My schools, The guide, Study, Our story, FAQ. Moved the app code into `js/` and split it by page | `*.html`, `style.css`, `js/*.js` |
| 2026-10-10 | Outreach tracker (My schools): saves emailed schools, reply status, 3-day follow-up flag and follow-up email | `js/tracker.js`, `js/site.js`, `my-schools.html`, `data/email-template.js` |
| 2026-10-10 | Wrote page text from Jason's answers (his story, team roles) and his self-study guide; checked every College Board and AP Access for ALL link | `story.html`, `guide.html`, `faq.html`, `index.html` |
| 2026-10-10 | Testing checklist for the team | `TESTING.md` |
| 2026-10-10 | Decoration pass at Jason's request: hand-drawn doodles (marker circles, squiggles, arrows, tape), graph-paper and notebook-line backgrounds, answer-bubble pattern, highlighter colours | `style.css`, `*.html`, `js/tracker.js` |
| 2026-10-10 | Removed the Our story page at Jason's request (menu, footer and home page link updated) | `js/site.js`, `index.html` |
| 2026-10-10 | Removed the tally-mark graphic and logo at Jason's request. Added three home sections modeled on past Congressional App Challenge winners: a "which way should you take your AP?" recommendation helper (like AP Course Picker), a key dates timeline with countdowns (like Scholarship Star), and Tennessee facts with sources | `index.html`, `js/home.js`, `js/site.js`, `style.css` |
| 2026-10-10 | Rewrote home page and guide text to drop first-person lines ("I emailed...", Jason's byline and quote) at Jason's request | `index.html`, `guide.html` |
| 2026-10-10 | Copy edit with the stop-slop skill across all pages: new headings, Tennessee stats as a sourced paragraph, removed filler and slogan lines | `index.html`, `guide.html`, `study.html`, `faq.html`, `js/tracker.js`, `style.css` |
| 2026-10-10 | New colours at Jason's request (warm greys and one bright blue) and much less decoration: kept only the headline circle and heading squiggles | `style.css`, `*.html`, `js/site.js`, `js/tracker.js` |
| 2026-10-10 | Accessibility fixes from the design checker: guide heading order, button and placeholder contrast, plain photo spots | `style.css`, `guide.html`, `js/site.js` |
| 2026-10-10 | Design critique (two AI reviewers, score 25/40) and the fixes Jason chose: simpler home page with search at the top; "Who are you writing to?" step, To address and named greeting; "Did you send it?" check before saving; city search; specialty-school flag; clearer status tags; study links below results; phone email sheet with pinned send buttons, Escape and backdrop; wrapping menu; 44px tap targets; My schools undo, reply counts and next step after a yes; rewrote the stylesheet without leftovers | `index.html`, `find.html`, `my-schools.html`, `style.css`, `js/find.js`, `js/home.js`, `js/site.js`, `js/tracker.js` |
| 2026-10-11 | Design polish pass at Jason's request: example email beside the home search (fictional student and school, labelled as an example), quieter result rows (no repeated "call to check" tag, outlined Write email buttons), row hover, My schools count pop, phone spacing fix | `index.html`, `style.css`, `js/find.js`, `js/site.js` |
| 2026-10-11 | Security and privacy work for the Take9 pledge: security review, Content Security Policy and no-referrer on every page, inline styles moved to the stylesheet, email address check, "Pause before you send" tip, "Clear my info from this device" button, FAQ answer, SECURITY.md write-up, security tests in TESTING.md | `*.html`, `style.css`, `js/find.js`, `js/tracker.js`, `SECURITY.md`, `TESTING.md` |
| 2026-10-11 | Renamed the site from ExamOnly TN to Exam Only at the team's request | `*.html`, `js/site.js`, `SECURITY.md`, `PRODUCT.md` |
| 2026-10-11 | Changed the name to all capitals, EXAM ONLY, at the team's request | `*.html`, `js/site.js`, `SECURITY.md`, `PRODUCT.md` |
| 2026-10-11 | Fixed a bug from the security work: the "Clear my info" code had been pasted into four other functions by mistake, so each click added another copy of the button's handler | `js/tracker.js` |

## Ideas and decisions by the team

- The problem, the app idea and the self-study process it follows came from Jason Moon's own experience finding a school to take an AP exam, and his self-study and cold emailing guides.
- Jason chose the Tennessee focus, the features, and the design direction (school-tool look, search first, layout A).
- Jason asked for the study resources (including AP Access for ALL), the list of who to contact (AP coordinator, AP teacher, principal, counselor) and the "schools near me" search.

## Written by the team

Roles (from Jason, 2026-10-10): Jason Moon and Ishan Chakrabarti build the app; Henry Joo improves the cold email part; Christian Moon makes sure the site has the features students need and tests it.

(Add each team member's own code, data work and changes here, with dates.)
