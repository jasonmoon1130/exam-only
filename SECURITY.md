# Security and privacy

How EXAM ONLY handles its users' data, written for the Congressional App Challenge Take9 pledge: what data the app collects, how that data is protected, and how the app is designed to reduce security risks.

Drafted with Claude (see AI-USE.md). Every team member should read this, check it against the code, and be able to explain it.

## What data the app collects

| Data | Why | Where it's kept |
|---|---|---|
| The student's name, grade and school | To fill in the email | The student's own browser (localStorage key `examonly-student`) |
| Schools emailed, who they wrote to (name and email), the date, and the reply status | The My schools tracker | The student's own browser (localStorage key `examonly-tracker`) |
| The AP exam and county, city or ZIP code they search | To show nearby schools | Only in the page address while they use it |

The app has **no server, no database, no accounts and no passwords**. It never sends anything a student types to the team or anyone else. It has no analytics, ads or tracking cookies.

The school list, ZIP code locations and AP course links are public data files that ship with the app (U.S. Department of Education, U.S. Census Bureau, College Board, AP Access for ALL).

## How the data is protected

- **It stays on the device.** Everything is saved in the browser's own storage, which only this site can read, on that one device.
- **The student controls it.** They can remove any school from My schools (with undo), and "Clear my info from this device" on My schools erases everything the site saved. This matters on shared library or school computers.
- **Emails go out from the student's own account.** The app writes the email and hands it to the student's email app (or they copy it). The student reads it and sends it. The app never sends mail and never sees the student's email login.
- **Nothing is marked as sent until the student says so**, so the tracker can't claim something happened that didn't.

## How the app is designed to reduce security risks

- **No code injection.** Text that students type is always inserted into the page as plain text (`textContent`), never as HTML, so a name like `<script>` shows up as words instead of running. The only places the code writes HTML directly are to clear a list or to build the menu from fixed text.
- **A Content Security Policy on every page.** It tells the browser to run scripts only from the app's own files, and to load styles and fonts only from the app and Google Fonts. If someone slipped in a script from another site, the browser would refuse to run it.
- **No referrer leaks.** Every page tells the browser not to pass the page address (which can contain a ZIP code) to other websites when a student clicks a link.
- **Safe links.** Links to other sites open in a new tab with `rel="noopener"`, so those sites can't control the EXAM ONLY tab.
- **Safe email links.** The subject, message and address are encoded before they go into the email link, so special characters can't break or change it.
- **Input checks.** Search only accepts a real Tennessee county, a city with a public high school, or a Tennessee ZIP code. The exam must be one of the 42 real AP exams. The recipient's email must look like an email address before the app opens it.
- **No outside code.** The app uses plain HTML, CSS and JavaScript with no downloaded packages, so there are no third-party libraries that could be hacked or go out of date.

## Helping students stay safe (Take9)

Take9 asks people to pause and think before clicking, downloading or sharing. The app builds that pause into the riskiest moment, sending an email to a stranger's school:

- The email panel says: "Pause before you send. Check that the address ends in the school's real web address. Never email a password, your Social Security number or card numbers. Pay any fee only the way the school's official office tells you to."
- It warns that school Google accounts may block outside email, so students aren't confused by a bounce.
- The FAQ explains what's saved and how to clear it.

## Known limits and next steps

- **Google Fonts.** The font loads from Google's servers, which means Google can see a visitor's IP address. A next step is to download the font files and serve them from the app itself.
- **Hosting.** When the app goes online, it should only be served over HTTPS (GitHub Pages and Cloudflare Pages do this by default).
- **Data accuracy.** School phone numbers come from 2023–24 federal data and can change. The app tells students to check the school's website before calling or paying.
- **Shared computers.** If a student forgets to clear their info, the next person on that browser could see their name and list. The My schools page reminds them.
