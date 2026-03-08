import { getFirestore, collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();
const templeList = document.getElementById("templeList");

async function loadTemples() {
  templeList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "Temple"));

  snapshot.forEach(docSnap => {
    const div = document.createElement("div");

    div.textContent = docSnap.id.replaceAll("_", " ");
    div.className = "temple-item";

    div.onclick = () => {
      window.location.href =
        "Arproject/details.html?col=Temple&id=" + docSnap.id;
    };

    templeList.appendChild(div);
  });
}

loadTemples();
