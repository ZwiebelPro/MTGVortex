// Tabs
const searchTab = document.getElementById("searchTab");
const metaTab = document.getElementById("metaTab");
const searchView = document.getElementById("searchView");
const metaView = document.getElementById("metaView");

// Search elements
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// Card panel
const cardPanel = document.getElementById("cardPanel");
const panelImage = document.getElementById("panelImage");
const panelLegalities = document.getElementById("panelLegalities");
const closePanel = document.getElementById("closePanel");

// -------------------
// Tab switching
// -------------------
searchTab.addEventListener("click", () => {
  searchTab.classList.add("active");
  metaTab.classList.remove("active");
  searchView.classList.remove("hidden");
  metaView.classList.add("hidden");
});

metaTab.addEventListener("click", () => {
  metaTab.classList.add("active");
  searchTab.classList.remove("active");
  metaView.classList.remove("hidden");
  searchView.classList.add("hidden");
});

// -------------------
// Search function
// -------------------
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      resultsDiv.innerHTML = "<p>No cards found.</p>";
      return;
    }

    displayResults(data.data);
  } catch (err) {
    resultsDiv.innerHTML = "<p>Error fetching cards.</p>";
    console.error(err);
  }
});

// -------------------
// Display search results
// -------------------
function displayResults(cards) {
  resultsDiv.innerHTML = "";
  cards.forEach(card => {
    const imgUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal;
    if (!imgUrl) return;

    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = card.name;

    const name = document.createElement("h4");
    name.textContent = card.name;

    cardDiv.appendChild(img);
    cardDiv.appendChild(name);

    cardDiv.addEventListener("click", () => openCardPanel(card));

    resultsDiv.appendChild(cardDiv);
  });
}

// -------------------
// Open Card Panel with colored legalities
// -------------------
function openCardPanel(card) {
  const imgUrl = card.image_uris?.large || card.card_faces?.[0]?.image_uris?.large;
  if (!imgUrl) return;

  panelImage.src = imgUrl;
  panelImage.alt = card.name;

  panelLegalities.innerHTML = "";

  for (const [format, status] of Object.entries(card.legalities)) {
    const div = document.createElement("div");
    div.textContent = `${format}: ${status}`;

    switch (status.toLowerCase()) {
      case "legal": div.className = "legal-green"; break;
      case "not_legal": div.className = "legal-purple"; break;
      case "banned": div.className = "legal-red"; break;
      case "restricted": div.className = "legal-yellow"; break;
      case "gc": div.className = "legal-blue"; break;
      default: div.className = "";
    }

    panelLegalities.appendChild(div);
  }

  cardPanel.classList.remove("hidden");
}

// Close panel
closePanel.addEventListener("click", () => cardPanel.classList.add("hidden"));
