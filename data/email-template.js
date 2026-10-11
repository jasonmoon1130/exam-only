// The emails students send, one for each person they might write to.
//
// Replace these with the wording from your Cold Emailing guide that got
// you a testing spot. Keep the {curly} words: the app fills them in.
//
//   {name}        the student's name
//   {grade}       their grade, like "11th"
//   {mySchool}    the school they attend
//   {exam}        the AP exam, like "Psychology"
//   {hostSchool}  the school being emailed

const EMAIL_SUBJECT = "Request to take the AP {exam} exam as an outside student";

// Same opening and request for every email; each contact gets its own
// greeting and closing ask.
const INTRO = `My name is {name}, and I'm in {grade} grade at {mySchool}. I'm self-studying for the AP {exam} exam, but my school doesn't offer it.`;

const REQUEST = `Could {hostSchool} add me to its AP exam order this year as an exam-only student? I'll pay the exam fee and any school fees, and I'll follow your registration steps and deadlines.`;

const CONTACTS = {
  coordinator: {
    label: "AP coordinator",
    body: `Dear AP Coordinator,

${INTRO}

${REQUEST}

Thank you,
{name}`
  },
  counselor: {
    label: "School counselor",
    body: `Dear Counselor,

${INTRO}

${REQUEST}

If someone else handles AP testing, could you pass this along or send me their name?

Thank you,
{name}`
  },
  teacher: {
    label: "AP {exam} teacher",
    body: `Dear AP {exam} Teacher,

${INTRO}

I'd like to ask {hostSchool} about taking the exam there as an outside, exam-only student. Could you tell me who coordinates AP testing at your school?

Thank you,
{name}`
  },
  principal: {
    label: "Principal or assistant principal",
    body: `Dear Principal,

${INTRO}

${REQUEST}

If your AP coordinator handles this, could you forward my email to them?

Thank you,
{name}`
  },
  office: {
    label: "Front office",
    body: `Hello,

Could you please forward this email to your AP coordinator or testing coordinator?

${INTRO}

${REQUEST}

Thank you,
{name}`
  }
};

// What to say if you call instead of email.
const CALL_SCRIPT = `Hi, my name is {name}. I'm in {grade} grade at {mySchool}. I'm self-studying for the AP {exam} exam, and my school doesn't offer it. Who is your AP coordinator, and what's the best way to reach them?`;

// Follow-up for a school that hasn't replied after a few days.
// {sentDate} is the date of the first email.
const FOLLOW_UP_SUBJECT = "Following up: AP {exam} exam as an outside student";

const FOLLOW_UP = `Hello,

I'm following up on my email from {sentDate} about taking the AP {exam} exam at {hostSchool} as an exam-only student. Schools order exams by November 13, so I wanted to check in.

Could you let me know if this is possible, or who I should ask?

Thank you,
{name}`;
