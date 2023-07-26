const commonWords = [];

// Use Fetch API to load the CSV file
fetch("common_words.csv")
  .then((response) => response.text())
  .then((data) => {
    // Split the CSV data into rows
    const rows = data.trim().split("\n");
    // Assuming the CSV has 'word' and 'frequency' columns
    rows.forEach((row) => {
      const [word, frequency] = row.split(",");
      // Add the word to the commonWords array
      commonWords.push({ word, frequency: parseInt(frequency) });
    });

    console.log("Words have been read and added to the commonWords array.");
    console.log(commonWords);

    // Add the event listeners after the commonWords array is filled
    document
      .getElementById("analyzeButton")
      .addEventListener("click", analyzeText);
    document
      .getElementById("wordStatsButton")
      .addEventListener("click", showWordStatistics);
  });

function analyzeText() {
  const inputText = document.getElementById("inputText").value;
  const words = inputText.toLowerCase().match(/\b\w+\b/g);
  const wordFrequency = {};

  words.forEach((word) => {
    if (wordFrequency[word]) {
      wordFrequency[word]++;
    } else {
      wordFrequency[word] = 1;
    }
  });

  const highlightedText = words
    .map((word) => {
      const wordRank = commonWords.findIndex((item) => item.word === word);
      const color = getWordColor(wordRank);
      const rank = wordRank !== -1 ? wordRank + 1 : undefined; // Add rank if found
      return `<span class="word-${color}" data-rank="${rank}">${word}</span>`;
    })
    .join(" ");

  document.getElementById("highlightedText").innerHTML = highlightedText;
  document.getElementById("outputContainer").style.display = "block";
}

function getWordColor(rank) {
  if (rank === -1) {
    // Word not found in commonWords list
    return "black";
  } else if (rank <= 1000) {
    return "green";
  } else if (rank <= 2000) {
    return "yellow";
  } else if (rank <= 3000) {
    return "orange";
  } else {
    return "red";
  }
}

function showWordStatistics() {
  const highlightedSpans = document.querySelectorAll("#highlightedText span");
  const wordStatsList = document.getElementById("wordStatsOutput");
  const colorStatsList = document.getElementById("colorStatsOutput");

  // Clear any previous content
  wordStatsList.innerHTML = "";
  colorStatsList.innerHTML = "";

  // Initialize word counts for each color
  const wordCounts = {
    green: 0,
    yellow: 0,
    orange: 0,
    red: 0,
  };

  // Iterate through highlighted spans
  highlightedSpans.forEach((span) => {
    const word = span.textContent;
    const rank = span.dataset.rank;
    const color = span.classList[0]; // Get the color class

    // Include words with colors (excluding black) and a valid rank
    if (color !== "word-black" && rank) {
      const listItem = document.createElement("li");
      listItem.textContent = `${word} - Rank: ${rank}`;
      wordStatsList.appendChild(listItem);

      // Count words for each color
      wordCounts[color]++;
    }
  });

  // Display word stats breakdown
  document.getElementById("greenCount").textContent = wordCounts.green;
  document.getElementById("yellowCount").textContent = wordCounts.yellow;
  document.getElementById("orangeCount").textContent = wordCounts.orange;
  document.getElementById("redCount").textContent = wordCounts.red;

  // Show the word statistics container
  document.getElementById("wordStatsContainer").style.display = "block";
}

// Add event listeners to buttons
document.getElementById("analyzeButton").addEventListener("click", analyzeText);
document
  .getElementById("wordStatsButton")
  .addEventListener("click", showWordStatistics);
