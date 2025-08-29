const fs = require("fs");

function letterToIndex(letter) {
  return letter.toLowerCase().charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1...
}

const input = fs.readFileSync("questions.txt", "utf-8").split("\n");
let output = [];
let passageMode = false;
let passageText = "";
let passageQuestions = [];
let currentQuestion = null;

for (let rawLine of input) {
  let line = rawLine.trim();
  if (!line) continue;

  // Start of MCQ section
  if (line.startsWith("MCQ questions:")) {
    passageMode = false;
    continue;
  }

  // Start of new Passage
  if (line.startsWith("Passage")) {
    if (passageMode && passageQuestions.length > 0) {
      output.push({
        type: "passage",
        passage: passageText,
        questions: passageQuestions,
      });
    }
    passageMode = true;
    passageText = "";
    passageQuestions = [];
    continue;
  }

  // Passage text (inside quotes)
  if (passageMode && (line.startsWith("“") || line.startsWith('"'))) {
    passageText = line.replace(/^["“]|["”]$/g, "").trim();
    continue;
  }

  // Question line (starts with number + ".")
  if (/^\d+\./.test(line)) {
    currentQuestion = {
      question: line.replace(/^\d+\.\s*/, "").trim(),
      options: [],
      answer: null,
      type: "mcq",
    };
    if (!passageMode) output.push(currentQuestion);
    else passageQuestions.push(currentQuestion);
    continue;
  }

  // Option line (starts with a), b), c), d) )
  if (/^[a-d]\)/i.test(line)) {
    currentQuestion?.options.push(line.replace(/^[a-d]\)\s*/, "").trim());
    continue;
  }

  // Answer line
  if (line.startsWith("Answer:")) {
    let answerPart = line.split(":")[1].trim();
    let answerLetter = answerPart[0].toLowerCase(); // e.g., "b"
    let idx = letterToIndex(answerLetter);
    if (currentQuestion) {
      currentQuestion.answer = idx;
    }
    continue;
  }

  // Continuation of passage (multi-line text)
  if (passageMode) {
    passageText += " " + line;
  }
}

// Push the last passage if any
if (passageMode && passageQuestions.length > 0) {
  output.push({
    type: "passage",
    passage: passageText,
    questions: passageQuestions,
  });
}

fs.writeFileSync("public/questions.json", JSON.stringify(output, null, 2));
console.log("✅ questions.json created with", output.length, "entries");
