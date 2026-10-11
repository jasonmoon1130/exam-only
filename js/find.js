// Find schools page: search by county, city or ZIP code, show schools and
// study links, write the email, and save each sent email to My schools.

// ---------- Page elements ----------
const searchForm = document.getElementById("search-form");
const examSelect = document.getElementById("exam-select");
const placeInput = document.getElementById("place-input");
const countyList = document.getElementById("county-list");
const formError = document.getElementById("form-error");
const startState = document.getElementById("start-state");
const resultsHead = document.getElementById("results-head");
const resultsTitle = document.getElementById("results-title");
const resultsSub = document.getElementById("results-sub");
const schoolList = document.getElementById("school-list");
const study = document.getElementById("study");
const studyTitle = document.getElementById("study-title");
const studyLinks = document.getElementById("study-links");
const studyFree = document.getElementById("study-free");
const emailPanel = document.getElementById("email-panel");
const backdrop = document.getElementById("sheet-backdrop");
const panelTips = document.getElementById("panel-tips");
const composer = document.getElementById("composer");
const pickedSchool = document.getElementById("picked-school");
const closePanel = document.getElementById("close-panel");
const contactSelect = document.getElementById("contact-select");
const toNameInput = document.getElementById("to-name");
const toEmailInput = document.getElementById("to-email");
const findPerson = document.getElementById("find-person");
const callScript = document.getElementById("call-script");
const nameInput = document.getElementById("name-input");
const gradeInput = document.getElementById("grade-input");
const mySchoolInput = document.getElementById("myschool-input");
const subjectPreview = document.getElementById("subject-preview");
const emailPreview = document.getElementById("email-preview");
const emailButton = document.getElementById("email-button");
const copySubjectButton = document.getElementById("copy-subject");
const copyButton = document.getElementById("copy-button");
const sentCheck = document.getElementById("sent-check");
const sentYes = document.getElementById("sent-yes");
const sentNo = document.getElementById("sent-no");
const emailNote = document.getElementById("email-note");

// The school the student chose to email, and the row it's shown in.
let chosenSchool = null;
let chosenRow = null;
// The button that opened the email, so focus can return to it on close.
let openedFrom = null;

// How far to look around a ZIP code or city, in miles, and how many schools to show.
const MAX_MILES = 40;
const MAX_NEARBY = 25;

// Schools whose names suggest they aren't a regular high school.
const SPECIALTY = /middle college|early college|career|technical|tech center|alternative|adult/i;

// On narrow screens the email opens as a sheet over the page.
const narrowScreen = window.matchMedia("(max-width: 1000px)");

// ---------- Dropdowns ----------
function addOption(parent, value, text) {
  const option = document.createElement("option");
  option.value = value;
  if (text) option.textContent = text;
  parent.appendChild(option);
}

function fillDropdowns() {
  EXAMS.forEach(exam => addOption(examSelect, exam, "AP " + exam));
  COUNTIES.forEach(county => addOption(countyList, county + " County"));
  Object.keys(CONTACTS).forEach(key => addOption(contactSelect, key, CONTACTS[key].label));
}

// ---------- Reading the place box ----------
// Turns what the student typed into a county, a ZIP code, or a city.
// Returns { county }, { zip, point }, { city, point }, or { error }.
function readPlace(text) {
  const typed = text.trim();

  if (/^\d{5}$/.test(typed)) {
    const point = TN_ZIPS[typed];
    if (!point) return { error: typed + " isn't a Tennessee ZIP code we know. Try your county or city instead." };
    return { zip: typed, point };
  }

  const cleaned = typed.toLowerCase().replace(/\s+county$/, "").replace(/,?\s*(tn|tennessee)$/, "");
  const county = COUNTIES.find(name => name.toLowerCase() === cleaned);
  if (county) return { county };

  // A city: center the search on the average location of its schools.
  const inCity = SCHOOLS.filter(school => school.city.toLowerCase() === cleaned);
  if (inCity.length > 0) {
    const lat = inCity.reduce((sum, school) => sum + school.lat, 0) / inCity.length;
    const lon = inCity.reduce((sum, school) => sum + school.lon, 0) / inCity.length;
    return { city: inCity[0].city, point: [lat, lon] };
  }

  return { error: "Type a Tennessee county (Montgomery), a city with a public high school (Clarksville), or a 5-digit ZIP code." };
}

// ---------- Distance ----------
// Miles between two [latitude, longitude] points (haversine formula).
function milesBetween([lat1, lon1], [lat2, lon2]) {
  const toRad = degrees => degrees * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(a));
}

// ---------- Finding schools ----------
// Splits schools into two lists:
//   offers:    schools the Ledger says teach this AP
//   unchecked: schools we haven't looked up yet (they might!)
// Schools we checked that don't teach the AP are left out.
function splitByExam(schools, exam) {
  const offers = schools.filter(school => school.exams.includes(exam));
  const unchecked = schools.filter(school => school.exams.length === 0);
  return { offers, unchecked };
}

function schoolsInCounty(county) {
  return SCHOOLS.filter(school => school.county === county);
}

// Closest schools to a point, each with a .miles number, nearest first.
function schoolsNear(point) {
  return SCHOOLS
    .map(school => ({ ...school, miles: milesBetween(point, [school.lat, school.lon]) }))
    .filter(school => school.miles <= MAX_MILES)
    .sort((a, b) => a.miles - b.miles)
    .slice(0, MAX_NEARBY);
}

function websiteLink(school) {
  if (school.website) return school.website;
  const query = school.name + " " + school.city + " TN";
  return "https://www.google.com/search?q=" + encodeURIComponent(query);
}

function trackedEntry(school, exam) {
  return loadTracker().find(entry => entry.id === trackerId(school, exam));
}

// The status tag under a school's name.
function statusFor(school, offersExam, exam) {
  const tracked = trackedEntry(school, exam);
  if (tracked && tracked.status === "yes") return { text: "Said yes", className: "status status-yes" };
  if (tracked && tracked.status === "no") return { text: "Said no", className: "status status-no" };
  if (tracked) return { text: "Emailed " + formatDate(tracked.sentAt), className: "status status-sent" };
  if (offersExam) return { text: "Teaches AP " + exam, className: "status status-teaches" };
  // Unchecked schools get no tag; the line above the list already says to call.
  return { text: "", className: "status" };
}

function setRowStatus(row, school, offersExam, exam) {
  const status = row.querySelector(".status");
  const { text, className } = statusFor(school, offersExam, exam);
  status.className = className;
  status.textContent = text;
  status.hidden = text === "";
  row.classList.toggle("is-no", className.includes("status-no"));
}

// Builds one row in the school list.
function makeSchoolItem(school, offersExam, exam) {
  const item = document.createElement("li");
  item.className = "school";

  const main = document.createElement("div");

  const name = document.createElement("h3");
  name.className = "school-name";
  name.textContent = school.name;

  const meta = document.createElement("p");
  meta.className = "school-meta";
  const place = document.createElement("span");
  place.textContent = school.miles !== undefined
    ? school.city + ", " + school.miles.toFixed(1) + " miles"
    : school.city;
  meta.append(place);
  if (school.phone) {
    const phone = document.createElement("a");
    phone.href = "tel:" + school.phone.replace(/[^0-9]/g, "");
    phone.textContent = school.phone;
    meta.append(phone);
  }
  const site = document.createElement("a");
  site.href = websiteLink(school);
  site.target = "_blank";
  site.rel = "noopener";
  site.textContent = "Website";
  meta.append(site);

  const tags = document.createElement("p");
  tags.className = "school-tags";
  const status = document.createElement("span");
  status.className = "status";
  tags.append(status);
  if (SPECIALTY.test(school.name)) {
    const specialty = document.createElement("span");
    specialty.className = "specialty";
    specialty.textContent = "Specialty school: check that it gives AP exams";
    tags.append(specialty);
  }

  main.append(name, meta, tags);

  const button = document.createElement("button");
  button.className = "btn btn-line btn-small";
  button.type = "button";
  button.textContent = "Write email";
  button.setAttribute("aria-label", "Write email to " + school.name);
  button.addEventListener("click", () => chooseSchool(school, offersExam, item, button));

  item.append(main, button);
  setRowStatus(item, school, offersExam, exam);
  return item;
}

function groupHeading(text) {
  const item = document.createElement("li");
  item.className = "group-head";
  item.textContent = text;
  return item;
}

function showSchools() {
  const exam = examSelect.value;
  if (!exam) {
    formError.textContent = "Choose an AP exam first.";
    examSelect.focus();
    return;
  }

  const place = readPlace(placeInput.value);
  if (place.error) {
    formError.textContent = place.error;
    placeInput.focus();
    return;
  }
  formError.textContent = "";

  // Keep the search in the address bar so it can be shared or reloaded.
  const params = new URLSearchParams({ exam, place: placeInput.value.trim() });
  history.replaceState(null, "", "?" + params);

  const found = place.county ? schoolsInCounty(place.county) : schoolsNear(place.point);
  const { offers, unchecked } = splitByExam(found, exam);
  const total = offers.length + unchecked.length;
  const where = place.county
    ? " in " + place.county + " County"
    : " within " + MAX_MILES + " miles of " + (place.zip || place.city);

  startState.hidden = true;
  resultsHead.hidden = false;
  closeEmail();
  showStudy(exam);
  schoolList.innerHTML = "";

  resultsTitle.textContent = total + (total === 1 ? " school" : " schools") + where;
  resultsSub.textContent = offers.length > 0
    ? offers.length + (offers.length === 1 ? " teaches" : " teach") + " AP " + exam + ". Call the rest to check."
    : "We haven't confirmed which of these give the AP " + exam + " exam yet. Call or email to ask.";

  if (total === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = place.county
      ? "We don't list a school here yet. Try a neighboring county or your ZIP code, or call " +
        "AP Services at 888-225-5427 and ask who tests outside students nearby."
      : "We don't list a school within " + MAX_MILES + " miles. Try your county name, or call " +
        "AP Services at 888-225-5427 and ask who tests outside students nearby.";
    schoolList.appendChild(empty);
    return;
  }

  const items = [];
  if (offers.length > 0) items.push(groupHeading("On the AP Course Ledger for AP " + exam));
  offers.forEach(school => items.push(makeSchoolItem(school, true, exam)));
  if (offers.length > 0 && unchecked.length > 0) items.push(groupHeading("Not checked yet"));
  unchecked.forEach(school => items.push(makeSchoolItem(school, false, exam)));
  items.forEach((item, i) => {
    item.style.setProperty("--i", Math.min(i, 12));
    schoolList.appendChild(item);
  });
}

// ---------- Study links ----------
function addStudyLink(href, text) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = text;
  studyLinks.appendChild(link);
}

function showStudy(exam) {
  studyTitle.textContent = "Study for AP " + exam;
  studyLinks.innerHTML = "";

  const page = "https://apstudents.collegeboard.org/courses/" + COURSE_PAGES[exam];
  addStudyLink(page, "Course units");
  addStudyLink(page + "/assessment", "Exam format and past questions");
  addStudyLink(
    "https://www.khanacademy.org/search?page_search_query=" + encodeURIComponent("AP " + exam),
    "Khan Academy lessons"
  );
  addStudyLink("study.html", "More study resources");

  const free = AP_ACCESS_FOR_ALL[exam];
  studyFree.hidden = !free;
  if (free) {
    studyFree.innerHTML = "";
    const link = document.createElement("a");
    link.href = "https://tnapaccessforall.org/course-listing/";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "AP Access for ALL";
    studyFree.append(
      "Free class: Tennessee teaches AP " + exam + " online through ", link,
      ". " + free.when + ". Prerequisites: " + free.needs + ". Ask your counselor to sign you up."
    );
  }

  study.hidden = false;
}

// ---------- Opening and closing the email ----------
function chooseSchool(school, offersExam, row, button) {
  chosenSchool = { ...school, offersExam };
  chosenRow = row;
  openedFrom = button;
  schoolList.querySelectorAll(".school").forEach(li => li.classList.remove("selected"));
  row.classList.add("selected");

  pickedSchool.textContent = school.name;
  panelTips.hidden = true;
  composer.hidden = false;
  sentCheck.hidden = true;
  emailNote.textContent = "";

  // Reuse the person from a past email to this school, if there is one.
  const tracked = trackedEntry(school, examSelect.value);
  toNameInput.value = tracked && tracked.toName ? tracked.toName : "";
  toEmailInput.value = tracked && tracked.toEmail ? tracked.toEmail : "";
  if (tracked && tracked.contact) contactSelect.value = tracked.contact;

  showFindPerson(school);
  updateEmail();

  if (narrowScreen.matches) {
    emailPanel.classList.add("is-open");
    emailPanel.setAttribute("role", "dialog");
    emailPanel.setAttribute("aria-modal", "true");
    backdrop.hidden = false;
    document.body.classList.add("sheet-open");
  }
  toNameInput.focus();
}

// Where to find the right person at this school.
function showFindPerson(school) {
  findPerson.innerHTML = "";
  const site = document.createElement("a");
  site.href = websiteLink(school);
  site.target = "_blank";
  site.rel = "noopener";
  site.textContent = "the school's website";
  findPerson.append("Look for a staff page on ", site, ", or call ");
  if (school.phone) {
    const phone = document.createElement("a");
    phone.href = "tel:" + school.phone.replace(/[^0-9]/g, "");
    phone.textContent = school.phone;
    findPerson.append(phone);
  } else {
    findPerson.append("the front office");
  }
  findPerson.append(" and ask who coordinates AP testing.");
}

// Hides the email and shows the tips again.
function closeEmail() {
  chosenSchool = null;
  chosenRow = null;
  composer.hidden = true;
  panelTips.hidden = false;
  emailPanel.classList.remove("is-open");
  emailPanel.removeAttribute("role");
  emailPanel.removeAttribute("aria-modal");
  backdrop.hidden = true;
  document.body.classList.remove("sheet-open");
  schoolList.querySelectorAll(".school").forEach(li => li.classList.remove("selected"));
  if (openedFrom && document.body.contains(openedFrom)) openedFrom.focus();
  openedFrom = null;
}

// ---------- Writing the email ----------
function studentWords() {
  return {
    name: nameInput.value.trim() || "[your name]",
    grade: gradeInput.value || "[grade]",
    mySchool: mySchoolInput.value.trim() || "[your school]",
    exam: examSelect.value || "[exam]",
    hostSchool: chosenSchool ? chosenSchool.name : "[school]"
  };
}

function updateEmail() {
  const words = studentWords();
  [...contactSelect.options].forEach(option => {
    option.textContent = fillWords(CONTACTS[option.value].label, words);
  });
  callScript.textContent = fillWords(CALL_SCRIPT, words);
  if (!chosenSchool) return;

  let body = fillWords(CONTACTS[contactSelect.value].body, words);
  // With a name, greet the person directly instead of by role.
  const toName = toNameInput.value.trim();
  if (toName) body = body.replace(/^[^\n]*/, "Dear " + toName + ",");
  emailPreview.value = body;
  subjectPreview.value = fillWords(EMAIL_SUBJECT, words);
}

function emailIsReady() {
  if (!nameInput.value.trim()) {
    emailNote.textContent = "Add your name first.";
    nameInput.focus();
    return false;
  }
  if (!gradeInput.value) {
    emailNote.textContent = "Choose your grade first.";
    gradeInput.focus();
    return false;
  }
  if (!mySchoolInput.value.trim()) {
    emailNote.textContent = "Add your school first.";
    mySchoolInput.focus();
    return false;
  }
  return true;
}

// After the email leaves this page, ask before marking it as sent.
function askIfSent(message) {
  sentCheck.hidden = false;
  emailNote.textContent = message;
}

// A simple shape check: something@something.something, no spaces.
function looksLikeEmail(address) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
}

function openEmail() {
  if (!emailIsReady()) return;
  const to = toEmailInput.value.trim();
  if (to && !looksLikeEmail(to)) {
    emailNote.textContent = "That email address doesn't look right. Check it, or leave it blank and add it in your email app.";
    toEmailInput.focus();
    return;
  }
  askIfSent(to ? "" : "No email address yet, so your email app opens without one. Add it there.");
  window.location.href =
    "mailto:" + encodeURIComponent(to) +
    "?subject=" + encodeURIComponent(subjectPreview.value) +
    "&body=" + encodeURIComponent(emailPreview.value);
}

async function copyText(text, done) {
  try {
    await navigator.clipboard.writeText(text);
    done();
  } catch (error) {
    emailNote.textContent = "Couldn't copy. Select the text and press Ctrl+C.";
  }
}

function copySubject() {
  copyText(subjectPreview.value, () => { emailNote.textContent = "Subject copied."; });
}

function copyMessage() {
  if (!emailIsReady()) return;
  copyText(emailPreview.value, () => askIfSent("Message copied. Paste it into your email."));
}

function markSent() {
  trackSchool(chosenSchool, examSelect.value, contactSelect.value, {
    name: toNameInput.value.trim(),
    email: toEmailInput.value.trim()
  });
  setRowStatus(chosenRow, chosenSchool, chosenSchool.offersExam, examSelect.value);
  sentCheck.hidden = true;
  emailNote.textContent = "Saved to My schools. Next, try another school.";
}

function notSent() {
  sentCheck.hidden = true;
  emailNote.textContent = "Okay. It won't be marked as sent.";
}

// ---------- Start ----------
fillDropdowns();
document.getElementById("deadline").textContent = deadlineText();

const student = loadStudent();
nameInput.value = student.name || "";
gradeInput.value = student.grade || "";
mySchoolInput.value = student.mySchool || "";
updateEmail();

// Run a search passed in from the home page, like find.html?exam=Biology&place=37040
const incoming = new URLSearchParams(location.search);
if (incoming.get("exam") && EXAMS.includes(incoming.get("exam"))) examSelect.value = incoming.get("exam");
if (incoming.get("place")) placeInput.value = incoming.get("place");
if (examSelect.value && placeInput.value) showSchools();

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  showSchools();
});
placeInput.addEventListener("input", () => { formError.textContent = ""; });
examSelect.addEventListener("change", updateEmail);
[contactSelect, toNameInput].forEach(input => input.addEventListener("input", updateEmail));
contactSelect.addEventListener("change", updateEmail);
[nameInput, gradeInput, mySchoolInput].forEach(input => {
  input.addEventListener("input", () => {
    saveStudent({ name: nameInput.value, grade: gradeInput.value, mySchool: mySchoolInput.value });
    updateEmail();
    emailNote.textContent = "";
  });
});
gradeInput.addEventListener("change", () => {
  saveStudent({ name: nameInput.value, grade: gradeInput.value, mySchool: mySchoolInput.value });
  updateEmail();
});
emailButton.addEventListener("click", openEmail);
copySubjectButton.addEventListener("click", copySubject);
copyButton.addEventListener("click", copyMessage);
sentYes.addEventListener("click", markSent);
sentNo.addEventListener("click", notSent);
closePanel.addEventListener("click", closeEmail);
backdrop.addEventListener("click", closeEmail);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !composer.hidden) closeEmail();
});
