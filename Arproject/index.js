import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAkN3uCB5T1Kiw9fUFNsQvv5ShPmpM18nM",
  authDomain: "temple-ar.firebaseapp.com",
  projectId: "temple-ar",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= DOM ================= */
const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

/* ================= DATA ================= */
const collections = ["Temple", "monuments"];
let allItems = [];

/* ================= FETCH DATA ================= */
async function fetchData() {
  allItems = [];

  for (const col of collections) {
    const snap = await getDocs(collection(db, col));

    snap.forEach(docu => {
      const d = docu.data();

      // show only items with 3D
      if (d.has3D !== true) return;
      if (!d.thumbnail) return;

      allItems.push({
        id: docu.id,
        col,
        name: d.name,
        state: d.State,
        thumbnail: d.thumbnail
      });
    });
  }

  applyFilters();
}

/* ================= DISPLAY ================= */
function displayData(data) {
  list.innerHTML = "";

  if (!data.length) {
    list.innerHTML = "<p>No results found</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.state}</p>
    `;

    card.onclick = () => {
      window.location.href = `details.html?col=${item.col}&id=${item.id}`;
    };

    list.appendChild(card);
  });
}

/* ================= FILTER + SEARCH ================= */
function applyFilters() {
  let data = [...allItems];
  const text = searchInput.value.toLowerCase();
  const type = filterType.value;

  if (text) {
    data = data.filter(item =>
      item.name.toLowerCase().includes(text) ||
      item.state.toLowerCase().includes(text)
    );
  }

  if (type !== "all") {
    data = data.filter(item => item.col === type);
  }

  displayData(data);
}

/* ================= HELP DROPDOWN ================= */
const helpBtn = document.querySelector(".help-btn");
const helpDropdown = document.querySelector(".help-dropdown");
const questions = document.querySelectorAll(".help-question");

helpBtn.addEventListener("click", e => {
  e.stopPropagation();
  helpDropdown.classList.toggle("open");
});

// accordion answers
questions.forEach(q => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;

    document.querySelectorAll(".help-answer").forEach(a => {
      if (a !== answer) a.style.display = "none";
    });

    answer.style.display =
      answer.style.display === "block" ? "none" : "block";
  });
});

// close on outside click
document.addEventListener("click", e => {
  if (!helpDropdown.contains(e.target)) {
    helpDropdown.classList.remove("open");
    document.querySelectorAll(".help-answer").forEach(a => {
      a.style.display = "none";
    });
  }
});

/* ================= EVENTS ================= */
searchInput.addEventListener("input", applyFilters);
filterType.addEventListener("change", applyFilters);

/* ================= START ================= */
fetchData();
