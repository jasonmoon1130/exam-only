// Home page: the search form and the key dates countdowns.

// ---------- Key dates ----------
function setUpTimeline() {
  const today = new Date();
  document.querySelectorAll("#timeline li").forEach(item => {
    // Count to the end of that day, the same way the deadline line does.
    const date = new Date(item.dataset.date + "T23:59:00-05:00");
    const days = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    const chip = item.querySelector(".countdown-chip");
    if (days > 1) chip.textContent = "In " + days + " days";
    else if (days === 1) chip.textContent = "Tomorrow";
    else if (date - today > 0) chip.textContent = "Today";
    else {
      chip.textContent = "Passed";
      item.classList.add("past");
    }
  });
}

// ---------- Search form ----------
function setUpSearch() {
  const examSelect = document.getElementById("exam-select");
  EXAMS.forEach(exam => {
    const option = document.createElement("option");
    option.value = exam;
    option.textContent = "AP " + exam;
    examSelect.appendChild(option);
  });

  const countyList = document.getElementById("county-list");
  COUNTIES.forEach(county => {
    const option = document.createElement("option");
    option.value = county + " County";
    countyList.appendChild(option);
  });

  // Send the search to the Find schools page, but stop it if a box is empty.
  const form = document.getElementById("home-search");
  const error = document.getElementById("form-error");
  const placeInput = document.getElementById("place-input");
  form.addEventListener("submit", event => {
    if (!examSelect.value) {
      event.preventDefault();
      error.textContent = "Choose an AP exam first.";
      examSelect.focus();
    } else if (!placeInput.value.trim()) {
      event.preventDefault();
      error.textContent = "Type your county, city or ZIP code.";
      placeInput.focus();
    }
  });

  document.getElementById("deadline").textContent = deadlineText();
}

setUpTimeline();
setUpSearch();
