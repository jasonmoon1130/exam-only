// Shared by every page: the menu, the footer, the deadline, and the
// student's saved info and school list (stored on this device only).

// ---------- Menu and footer ----------
const PAGES = [
  { href: "find.html", label: "Find schools" },
  { href: "my-schools.html", label: "My schools" },
  { href: "guide.html", label: "The guide" },
  { href: "study.html", label: "Study" },
  { href: "faq.html", label: "FAQ" }
];

const LOGO_ICON = `<svg viewBox="0 0 30 26" aria-hidden="true">
  <path d="M17 2.5C8 1.5 2.5 6.5 3 13.5s7 10.5 14 9.8 10.5-5.5 10-11.3S22 3.5 13 4" fill="none" stroke="#1a62e6" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M9 13.5l4.2 4L21 8.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function buildNav() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const here = currentPage();
  const links = PAGES.map(page => {
    const current = page.href === here ? ' aria-current="page"' : "";
    const count = page.href === "my-schools.html" ? '<span class="count" id="nav-count" hidden></span>' : "";
    return `<li><a href="${page.href}"${current}>${page.label}${count}</a></li>`;
  }).join("");
  nav.className = "nav";
  nav.innerHTML = `<div class="wrap">
    <a class="wordmark" href="index.html">${LOGO_ICON}EXAM ONLY</a>
    <nav aria-label="Main"><ul class="nav-links">${links}</ul></nav>
  </div>`;
  updateNavCount();
}

function buildFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  const links = PAGES.map(page => `<li><a href="${page.href}">${page.label}</a></li>`).join("");
  footer.className = "footer";
  footer.innerHTML = `<div class="wrap">
    <div>
      <a class="wordmark" href="index.html">${LOGO_ICON}EXAM ONLY</a>
      <p>Made by Jason Moon, Christian Moon, Henry Joo and Ishan Chakrabarti.</p>
      <p>School list: U.S. Department of Education, 2023–24. ZIP codes: U.S. Census Bureau. AP courses: College Board. Call the school to confirm fees and dates before you pay.</p>
    </div>
    <ul>${links}</ul>
  </div>`;
}

// ---------- Deadline ----------
// College Board exam ordering deadline: Nov 13, 2026, 11:59 pm ET.
const ORDER_DEADLINE = new Date("2026-11-13T23:59:00-05:00");

function deadlineText() {
  const msLeft = ORDER_DEADLINE - new Date();
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  if (daysLeft >= 1) {
    return daysLeft + (daysLeft === 1 ? " day" : " days") + " until schools order AP exams (November 13).";
  }
  if (msLeft > 0) return "Schools order AP exams today.";
  return "The on-time order date has passed. Schools can still order late, until March 12, 2027.";
}

// ---------- Saved student info ----------
const STUDENT_KEY = "examonly-student";

function loadStudent() {
  try {
    return JSON.parse(localStorage.getItem(STUDENT_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveStudent(info) {
  try {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(info));
  } catch (error) {
    // Saving is a convenience; the site works without it.
  }
}

// ---------- My schools (the outreach tracker) ----------
// Each entry: { id, name, city, phone, exam, contact, toName, toEmail, status, sentAt }
// status is "sent", "yes" or "no". sentAt is a timestamp in milliseconds.
// toName and toEmail are the person the student wrote to (may be empty).
const TRACKER_KEY = "examonly-tracker";
const FOLLOW_UP_DAYS = 3;

function loadTracker() {
  try {
    return JSON.parse(localStorage.getItem(TRACKER_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveTracker(entries) {
  try {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(entries));
  } catch (error) {
    // Nothing else to do; the list just won't be remembered.
  }
  updateNavCount();
}

function trackerId(school, exam) {
  return school.name + "|" + school.city + "|" + exam;
}

// Adds a school to My schools, or refreshes it if it's already there.
// Only called after the student says they sent the email.
function trackSchool(school, exam, contact, recipient) {
  const entries = loadTracker();
  const id = trackerId(school, exam);
  const existing = entries.find(entry => entry.id === id);
  if (existing) {
    existing.contact = contact;
    existing.toName = recipient.name;
    existing.toEmail = recipient.email;
    if (existing.status === "sent") existing.sentAt = Date.now();
  } else {
    entries.push({
      id, exam, contact,
      name: school.name,
      city: school.city,
      phone: school.phone || "",
      toName: recipient.name,
      toEmail: recipient.email,
      status: "sent",
      sentAt: Date.now()
    });
  }
  saveTracker(entries);
}

function daysSince(timestamp) {
  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
}

function needsFollowUp(entry) {
  return entry.status === "sent" && daysSince(entry.sentAt) >= FOLLOW_UP_DAYS;
}

function updateNavCount() {
  const badge = document.getElementById("nav-count");
  if (!badge) return;
  const total = loadTracker().length;
  const grew = total > Number(badge.textContent || 0);
  badge.textContent = total;
  badge.hidden = total === 0;
  // A small pop when a school is added, so the student sees where it went.
  if (grew && badge.dataset.ready) {
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }
  badge.dataset.ready = "1";
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------- Filling in {words} ----------
function fillWords(text, values) {
  return text.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

buildNav();
buildFooter();
