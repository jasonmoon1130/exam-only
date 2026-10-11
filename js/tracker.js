// My schools page: the list of schools the student has emailed, their
// replies, and follow-up emails for schools that haven't answered.

const trackerList = document.getElementById("tracker");
const summary = document.getElementById("summary");
const emptyTracker = document.getElementById("empty-tracker");
const undoBar = document.getElementById("undo-bar");

const STATUSES = [
  { key: "sent", label: "Waiting" },
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" }
];

const CONTACT_NAMES = {
  coordinator: "AP coordinator",
  counselor: "counselor",
  teacher: "AP teacher",
  principal: "principal",
  office: "front office"
};

// The last school removed, so the student can undo it.
let lastRemoved = null;

function plural(count, word) {
  return count + " " + word + (count === 1 ? "" : "s");
}

// "You've emailed 12 schools. 1 said yes, 4 said no. 3 need a follow-up."
function writeSummary(entries) {
  const yes = entries.filter(entry => entry.status === "yes").length;
  const no = entries.filter(entry => entry.status === "no").length;
  const waiting = entries.filter(entry => entry.status === "sent").length;
  const due = entries.filter(needsFollowUp).length;

  summary.innerHTML = "";
  summary.append("You've emailed " + plural(entries.length, "school") + ". ");

  const replies = [];
  if (yes > 0) replies.push(yes + " said yes");
  if (no > 0) replies.push(no + " said no");
  if (replies.length > 0) {
    const strong = document.createElement("strong");
    strong.textContent = replies.join(", ") + ".";
    summary.append(strong, " ");
  }

  if (due > 0) {
    summary.append(plural(due, "school") + " need" + (due === 1 ? "s" : "") + " a follow-up.");
  } else if (yes === 0 && waiting === 0) {
    // Every school answered no: point to more schools.
    const link = document.createElement("a");
    link.href = "find.html";
    link.textContent = "Find more schools nearby";
    summary.append("Keep going. ", link, ".");
  } else if (waiting > 0) {
    summary.append("No follow-ups due yet.");
  }
}

function setStatus(id, status) {
  const entries = loadTracker();
  const entry = entries.find(item => item.id === id);
  entry.status = status;
  saveTracker(entries);
  render();
}

function removeEntry(id) {
  const entries = loadTracker();
  lastRemoved = entries.find(entry => entry.id === id);
  saveTracker(entries.filter(entry => entry.id !== id));
  render();
  showUndo();
}

function showUndo() {
  undoBar.innerHTML = "";
  undoBar.append("Removed " + lastRemoved.name + ". ");
  const undo = document.createElement("button");
  undo.type = "button";
  undo.className = "link-btn";
  undo.textContent = "Undo";
  undo.addEventListener("click", () => {
    const entries = loadTracker();
    entries.push(lastRemoved);
    saveTracker(entries);
    lastRemoved = null;
    undoBar.hidden = true;
    render();
  });
  undoBar.append(undo);
  undoBar.hidden = false;
}

// Opens a follow-up email to the same person and restarts the three-day clock.
function followUp(entry) {
  const student = loadStudent();
  const words = {
    name: student.name || "[your name]",
    exam: entry.exam,
    hostSchool: entry.name,
    sentDate: formatDate(entry.sentAt)
  };
  let body = fillWords(FOLLOW_UP, words);
  if (entry.toName) body = body.replace(/^[^\n]*/, "Dear " + entry.toName + ",");

  const entries = loadTracker();
  entries.find(item => item.id === entry.id).sentAt = Date.now();
  saveTracker(entries);

  window.location.href =
    "mailto:" + encodeURIComponent(entry.toEmail || "") +
    "?subject=" + encodeURIComponent(fillWords(FOLLOW_UP_SUBJECT, words)) +
    "&body=" + encodeURIComponent(body);
  render();
}

function whoText(entry) {
  const role = CONTACT_NAMES[entry.contact] || "school";
  return entry.toName ? entry.toName + " (" + role + ")" : "the " + role;
}

function makeRow(entry) {
  const row = document.createElement("div");
  row.className = "track-row" + (needsFollowUp(entry) ? " due" : "") + (entry.status === "no" ? " is-no" : "");

  const info = document.createElement("div");
  const name = document.createElement("h2");
  name.className = "track-name";
  name.textContent = entry.name;
  const meta = document.createElement("p");
  meta.className = "track-meta";
  meta.textContent = "AP " + entry.exam + ". Emailed " + whoText(entry) + " on " + formatDate(entry.sentAt) + ".";
  info.append(name, meta);

  const contact = document.createElement("p");
  contact.className = "track-meta";
  if (entry.toEmail) {
    const email = document.createElement("a");
    email.href = "mailto:" + entry.toEmail;
    email.textContent = entry.toEmail;
    contact.append(email);
  }
  if (entry.phone) {
    const phone = document.createElement("a");
    phone.href = "tel:" + entry.phone.replace(/[^0-9]/g, "");
    phone.textContent = entry.phone;
    contact.append(phone);
  }
  if (contact.childNodes.length > 0) info.append(contact);

  if (entry.status === "yes") {
    const next = document.createElement("p");
    next.className = "track-yes";
    next.textContent = "Today: confirm the exam, the total cost and their payment deadline, then follow their registration steps.";
    info.append(next);
  } else if (needsFollowUp(entry)) {
    const due = document.createElement("p");
    due.className = "track-due";
    due.textContent = "No reply in " + daysSince(entry.sentAt) + " days. Send a follow-up.";
    info.append(due);
  }

  const toggle = document.createElement("div");
  toggle.className = "segmented";
  toggle.setAttribute("role", "group");
  toggle.setAttribute("aria-label", "Reply from " + entry.name);
  STATUSES.forEach(status => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.status = status.key;
    button.textContent = status.label;
    button.setAttribute("aria-pressed", entry.status === status.key);
    button.addEventListener("click", () => setStatus(entry.id, status.key));
    toggle.append(button);
  });

  const actions = document.createElement("div");
  actions.className = "track-actions";
  if (entry.status === "sent") {
    const follow = document.createElement("button");
    follow.type = "button";
    follow.className = needsFollowUp(entry) ? "btn btn-primary btn-small" : "btn btn-line btn-small";
    follow.textContent = "Follow up";
    follow.setAttribute("aria-label", "Follow up with " + entry.name);
    follow.addEventListener("click", () => followUp(entry));
    actions.append(follow);
  }
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "link-btn";
  remove.textContent = "Remove";
  remove.setAttribute("aria-label", "Remove " + entry.name);
  remove.addEventListener("click", () => removeEntry(entry.id));
  actions.append(remove);

  row.append(info, toggle, actions);
  return row;
}

function render() {
  // Yeses first (act on them today), then follow-ups due, then waiting, then no's.
  const order = entry => entry.status === "yes" ? 0 : needsFollowUp(entry) ? 1 : entry.status === "sent" ? 2 : 3;
  const entries = loadTracker().sort((a, b) => order(a) - order(b) || b.sentAt - a.sentAt);

  trackerList.innerHTML = "";
  emptyTracker.hidden = entries.length > 0;
  summary.hidden = entries.length === 0;
  trackerList.hidden = entries.length === 0;
  if (entries.length === 0) return;

  writeSummary(entries);
  entries.forEach(entry => trackerList.append(makeRow(entry)));
}

// Wipes everything this site saved in the browser, after a check.
document.getElementById("clear-info").addEventListener("click", () => {
  if (!confirm("Clear your name, grade, school and saved schools from this browser? This can't be undone.")) return;
  try {
    localStorage.removeItem(TRACKER_KEY);
    localStorage.removeItem(STUDENT_KEY);
  } catch (error) {
    // Nothing was saved, so there's nothing to clear.
  }
  lastRemoved = null;
  undoBar.hidden = true;
  updateNavCount();
  render();
  document.getElementById("clear-note").textContent = "Cleared. Nothing from this site is saved in this browser now.";
});

render();
