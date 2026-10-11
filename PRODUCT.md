# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS and vanilla JavaScript. No build step. Data lives in `data/schools.js` and `data/email-template.js`.

## Users

Tennessee high school students self-studying for an AP exam their school doesn't offer. Mostly on a laptop, sitting down to plan and send emails. Often feel behind and unsure who to ask.

## Product Purpose

Help a student find a school that will let them take an AP exam as an outside, exam-only student, then write the email asking. Success: the student sends emails to several schools before the College Board ordering deadline (Nov 13, 2026).

## Positioning

Built from the founder's own self-study guide and the cold emails that actually got him a testing spot. Tennessee-specific: points to AP Access for ALL (free state online APs) and local schools. Nobody else lists which nearby schools to ask.

## Operating Context

Students search the College Board AP Course Ledger, call schools, email AP coordinators, and work against the College Board ordering deadline (Nov 13, 2026; late orders until Mar 12, 2027). The student sends every email from their own account; the app never sends mail.

## Capabilities and Constraints

- Pick AP exam and county, see schools (Ledger-confirmed first, unchecked second, confirmed non-offering hidden).
- Phone and website per school; generated email with mailto and copy.
- Saves name, grade and school in the browser only.
- 365 public high schools in all 95 counties from federal CCD 2023-24 data (no private schools yet). AP lists are empty until checked on the Ledger. Visual direction: Khan Academy / Quizlet school-tool look, layout A (see docs/superpowers/specs/2026-10-10-examonly-redesign-design.md).

## Brand Commitments

- Name: EXAM ONLY. Standalone; not a Project Mentor tool. Possible 2026 Congressional App Challenge entry (TN-07).
- Team: Jason Moon, Christian Moon, Henry Joo, Ishan Chakrabarti. All AI help is logged in AI-USE.md.
- Copy: short and plain, no em dashes. Light theme. Lots of colour.

## Evidence on Hand

Jason's self-study guide and Cold Emailing guide (Google Docs). No user testimonials, counts or success stats exist; do not invent any.

## Product Principles

1. Get the student to a sent email fast.
2. Never present unverified data as fact.
3. The student stays in control: they review and send.
4. Make the deadline impossible to miss.
