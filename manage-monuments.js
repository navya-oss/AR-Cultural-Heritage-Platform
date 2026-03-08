import { getFirestore, collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();
const monumentList = document.getElementById("monumentList");

async function loadMonuments() {
  monumentList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "monuments"));

  snapshot.forEach(docSnap => {
    const div = document.createElement("div");

    div.textContent = docSnap.id.replaceAll("_", " ");
    div.className = "monument-item";

    div.onclick = () => {
      window.location.href =
        "Arproject/details.html?col=monuments&id=" + docSnap.id;
    };

    monumentList.appendChild(div);
  });
}

loadMonuments();
