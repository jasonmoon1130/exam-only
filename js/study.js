// Study page: builds the AP Access for ALL table and the list of all exams.

function cell(row, text) {
  const td = document.createElement("td");
  td.textContent = text;
  row.appendChild(td);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildFreeTable() {
  const body = document.getElementById("free-table");
  Object.keys(AP_ACCESS_FOR_ALL).sort().forEach(exam => {
    const course = AP_ACCESS_FOR_ALL[exam];
    const row = document.createElement("tr");
    cell(row, "AP " + exam);
    cell(row, course.when);
    cell(row, capitalize(course.needs));
    body.appendChild(row);
  });
}

function link(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = text;
  return a;
}

function buildExamGrid() {
  const grid = document.getElementById("exam-grid");
  EXAMS.forEach(exam => {
    const page = "https://apstudents.collegeboard.org/courses/" + COURSE_PAGES[exam];

    const row = document.createElement("div");
    row.className = "exam-row";

    const name = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = "AP " + exam;
    name.append(strong);
    if (AP_ACCESS_FOR_ALL[exam]) {
      const free = document.createElement("span");
      free.className = "free";
      free.textContent = "Free in TN";
      name.append(free);
    }

    const links = document.createElement("div");
    links.className = "links";
    links.append(link(page, "Course"), link(page + "/assessment", "Exam"));

    row.append(name, links);
    grid.appendChild(row);
  });
}

buildFreeTable();
buildExamGrid();
