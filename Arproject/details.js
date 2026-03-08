import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyAkN3uCB5T1Kiw9fUFNsQvv5ShPmpM18nM",
  authDomain: "temple-ar.firebaseapp.com",
  projectId: "temple-ar",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   URL PARAMS
========================= */
const params = new URLSearchParams(window.location.search);

const col = decodeURIComponent(params.get("col") || "").trim();
const id  = decodeURIComponent(params.get("id") || "").trim();

console.log("COL:", col);
console.log("ID:", id);

if (!col || !id) {
  alert("Invalid URL");
  throw new Error("Missing parameters");
}

/* =========================
   FETCH DATA
========================= */
const ref = doc(db, col, id);
const snap = await getDoc(ref);

if (!snap.exists()) {
  alert("Data not found");
  throw new Error("No document");
}

const data = snap.data();
window.templeData = data; // ✅ store once

/* =========================
   LANGUAGE HANDLING
========================= */
let currentLang = "en";
const langSelect = document.getElementById("languageSelect");

if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    renderContent();
  });
}

/* =========================
   RENDER FUNCTION
========================= */
function renderContent() {
  const t = data.translations?.[currentLang] || data;

  document.getElementById("name").innerText = t.name || data.name;
  document.getElementById("state").innerText = t.State || data.State;
  document.getElementById("desc").innerText = t.Description || data.Description;

  document.getElementById("airport").innerText = t.Airport || data.Airport;
  document.getElementById("railway").innerText =
    t["Railway Station"] || data["Railway Station"] || "N/A";
  document.getElementById("bus").innerText =
    t["Bus Stand"] || data["Bus Stand"] || "N/A";

  /* HIGHLIGHTS */
  const highlightsList = document.getElementById("highlightsList");
  highlightsList.innerHTML = "";

  const highlights = t.highlights || data.highlights;
  if (Array.isArray(highlights)) {
    highlights.forEach(point => {
      const li = document.createElement("li");
      li.textContent = point;
      highlightsList.appendChild(li);
    });
  } else {
    highlightsList.innerHTML = "<li>No highlights available</li>";
  }

  document.getElementById("cityDistance").innerText =
    t.city_distance || data.city_distance || "N/A";

  document.getElementById("travelTime").innerText =
    t.travel_time || data.travel_time || "N/A";

  document.getElementById("localTransport").innerText =
    t.local_transport || data.local_transport || "N/A";

  document.getElementById("bestTime").innerText =
    t.best_time || data.best_time || "N/A";

  document.getElementById("visitingHours").innerText =
    t.visiting_hours || data.visiting_hours || "N/A";

  document.getElementById("entryFee").innerText =
    t.entry_fee || data.entry_fee || "N/A";
}

/* =========================
   INITIAL RENDER
========================= */
renderContent();

/* =========================
   IMAGE SLIDER (UNCHANGED)
========================= */
const images = data.ImageUrl || [];
let index = 0;

const imgEl = document.getElementById("sliderImage");
if (images.length > 0) imgEl.src = images[0];

document.getElementById("next").onclick = () => {
  index = (index + 1) % images.length;
  imgEl.src = images[index];
};

document.getElementById("prev").onclick = () => {
  index = (index - 1 + images.length) % images.length;
  imgEl.src = images[index];
};

/* =========================
   VIDEO
========================= */
if (data.VideoUrl) {
  const realVideo = document.getElementById("realVideo");
  const realSource = document.getElementById("realVideoSource");
  realSource.src = data.VideoUrl;
  realVideo.load();
}

/* =========================
   3D MODEL VIDEO
========================= */
if (data["3Dmodel"]) {
  const modelVideo = document.getElementById("templeVideo");
  const modelSource = document.getElementById("videoSource");
  modelSource.src = data["3Dmodel"];
  modelVideo.load();
}

/* =========================
   GOOGLE MAP
========================= */
const lat = parseFloat(data.Latitude);
const lng = parseFloat(data.Longitude);

const mapFrame = document.getElementById("mapFrame");
const navigateBtn = document.getElementById("navigateBtn");

if (!isNaN(lat) && !isNaN(lng)) {
  mapFrame.src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  navigateBtn.onclick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };
} else {
  mapFrame.style.display = "none";
  navigateBtn.style.display = "none";
}
