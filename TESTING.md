# Testing checklist

For Christian (and anyone on the team). Run through this on a laptop and on a phone before each big change and before recording the demo video. Write down anything that breaks, with the page and what you clicked.

## Every page

- [ ] The menu shows all five links, and the page you're on is highlighted.
- [ ] The footer shows all four team names.
- [ ] Nothing runs off the right edge on a phone.
- [ ] Every outside link opens the right page in a new tab.

## Home

- [ ] The example email shows next to the search (below it on a phone).
- [ ] Search with no exam picked shows "Choose an AP exam first."
- [ ] Search with an exam and "Montgomery" opens Find schools with results.

## Find schools

- [ ] "Montgomery", "montgomery county" and "Montgomery County" all work.
- [ ] A Tennessee ZIP (37040) shows schools with distances, nearest first.
- [ ] A non-Tennessee ZIP (90210) and nonsense text ("Narnia") show clear error messages.
- [ ] A small county (Pickett) shows its one school.
- [ ] The study box shows the right exam, and the AP Access for ALL note appears only for its 22 courses.
- [ ] "Write email" opens the email panel (on a phone it slides up from the bottom).
- [ ] Changing "Writing to" changes the greeting and the ask.
- [ ] Typing your name and school fills them into the email and the call script.
- [ ] "Open in my email" opens your email app with the subject and email filled in.
- [ ] "Copy" copies the email. Paste it somewhere to check.
- [ ] After Open or Copy, the school's line says "Emailed" with today's date.
- [ ] Close (X) hides the email.

## My schools

- [ ] Schools you emailed appear, newest first, with the exam and who you wrote to.
- [ ] The menu count matches the number of schools.
- [ ] Waiting / Yes / No updates the summary sentence.
- [ ] "Follow up" opens a follow-up email that mentions the first email's date.
- [ ] "Remove" takes the school off the list.
- [ ] With no schools, the page says so and links to Find schools.

## Security and privacy (Take9)

- [ ] Type `<b>hi</b>` as your name. The email shows the text `<b>hi</b>`, not bold text.
- [ ] Put a fake address like `carter at school` in "Their email" and press Open in my email. You get a warning and nothing opens.
- [ ] The "Pause before you send" tip shows in the email panel.
- [ ] On My schools, "Clear my info from this device" asks first, then empties the list. Reload Find schools: your name and school are gone.
- [ ] Open the browser's developer console on each page. There are no red "Content Security Policy" errors.

## Results

| Date | Tester | Device and browser | What broke | Fixed? |
|---|---|---|---|---|
| | | | | |
