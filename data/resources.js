// Study resources for each AP exam.
//
// COURSE_PAGES: the College Board student page for each course. Every link
// was checked on 2026-10-10. Add "/assessment" for the exam page.
//
// AP_ACCESS_FOR_ALL: the 22 free online courses Tennessee offers through
// AP Access for ALL, from https://tnapaccessforall.org/course-listing/
// (checked 2026-10-10). "when" says which terms you can take it in.

const COURSE_PAGES = {
  "2-D Art and Design": "ap-2-d-art-and-design",
  "3-D Art and Design": "ap-3-d-art-and-design",
  "African American Studies": "ap-african-american-studies",
  "Art History": "ap-art-history",
  "Biology": "ap-biology",
  "Business with Personal Finance": "ap-business-personal-finance",
  "Calculus AB": "ap-calculus-ab",
  "Calculus BC": "ap-calculus-bc",
  "Chemistry": "ap-chemistry",
  "Chinese Language and Culture": "ap-chinese-language-and-culture",
  "Comparative Government and Politics": "ap-comparative-government-and-politics",
  "Computer Science A": "ap-computer-science-a",
  "Computer Science Principles": "ap-computer-science-principles",
  "Cybersecurity": "ap-cybersecurity",
  "Drawing": "ap-drawing",
  "English Language and Composition": "ap-english-language-and-composition",
  "English Literature and Composition": "ap-english-literature-and-composition",
  "Environmental Science": "ap-environmental-science",
  "European History": "ap-european-history",
  "French Language and Culture": "ap-french-language-and-culture",
  "German Language and Culture": "ap-german-language-and-culture",
  "Human Geography": "ap-human-geography",
  "Italian Language and Culture": "ap-italian-language-and-culture",
  "Japanese Language and Culture": "ap-japanese-language-and-culture",
  "Latin": "ap-latin",
  "Macroeconomics": "ap-macroeconomics",
  "Microeconomics": "ap-microeconomics",
  "Music Theory": "ap-music-theory",
  "Physics 1": "ap-physics-1",
  "Physics 2": "ap-physics-2",
  "Physics C: Electricity and Magnetism": "ap-physics-c-electricity-and-magnetism",
  "Physics C: Mechanics": "ap-physics-c-mechanics",
  "Precalculus": "ap-precalculus",
  "Psychology": "ap-psychology",
  "Research": "ap-research",
  "Seminar": "ap-seminar",
  "Spanish Language and Culture": "ap-spanish-language-and-culture",
  "Spanish Literature and Culture": "ap-spanish-literature-and-culture",
  "Statistics": "ap-statistics",
  "U.S. Government and Politics": "ap-united-states-government-and-politics",
  "United States History": "ap-united-states-history",
  "World History: Modern": "ap-world-history-modern"
};

const ANY_TERM = "Fall, spring or a full year";
const FULL_YEAR = "Full year only";

const AP_ACCESS_FOR_ALL = {
  "2-D Art and Design": { when: FULL_YEAR, needs: "Art 1 and Art 2" },
  "3-D Art and Design": { when: FULL_YEAR, needs: "Art 1 and Art 2" },
  "Drawing": { when: FULL_YEAR, needs: "Art 1 and Art 2" },
  "Physics 1": { when: FULL_YEAR, needs: "Geometry, plus Algebra 1 and 2 (Algebra 2 can be at the same time)" },
  "Computer Science A": { when: FULL_YEAR, needs: "Algebra 1 (Algebra 2 recommended)" },
  "Art History": { when: ANY_TERM, needs: "none" },
  "Biology": { when: ANY_TERM, needs: "Biology 1 and Chemistry 1" },
  "Calculus AB": { when: ANY_TERM, needs: "Algebra 1 and 2, Geometry, and Precalculus or Trigonometry. You can test in AB or BC, not both, in one year" },
  "Calculus BC": { when: ANY_TERM, needs: "Algebra 1 and 2, Geometry, and Precalculus or Trigonometry. You can test in AB or BC, not both, in one year" },
  "Computer Science Principles": { when: ANY_TERM, needs: "Algebra 1" },
  "Environmental Science": { when: ANY_TERM, needs: "Algebra 1 and two years of lab science" },
  "Human Geography": { when: ANY_TERM, needs: "none" },
  "English Language and Composition": { when: ANY_TERM, needs: "Juniors and seniors only" },
  "English Literature and Composition": { when: ANY_TERM, needs: "Juniors and seniors only" },
  "Macroeconomics": { when: ANY_TERM, needs: "none (Algebra 1 recommended)" },
  "Microeconomics": { when: ANY_TERM, needs: "none (Algebra 1 recommended)" },
  "Precalculus": { when: ANY_TERM, needs: "Algebra 1 and 2 and Geometry recommended" },
  "Psychology": { when: ANY_TERM, needs: "none" },
  "Spanish Language and Culture": { when: "Spring or a full year", needs: "Spanish 1, 2 and 3 (exceptions for native speakers)" },
  "Statistics": { when: ANY_TERM, needs: "Algebra 1 and 2" },
  "U.S. Government and Politics": { when: ANY_TERM, needs: "none" },
  "United States History": { when: ANY_TERM, needs: "none" }
};
