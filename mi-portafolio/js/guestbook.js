import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDhxATCrmdW3kizruwPTL7123LnssshmNk",
  authDomain: "mi-portafolio-guestbook.firebaseapp.com",
  projectId: "mi-portafolio-guestbook",
  storageBucket: "mi-portafolio-guestbook.appspot.com",
  messagingSenderId: "594627823146",
  appId: "1:594627823146:web:009d9aaad41b65016ae553"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias al DOM
const form = document.getElementById("guestbook-form");
const entriesContainer = document.getElementById("guestbook-entries");

// Manejo del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validar honeypot
  if (form.hp.value !== "") return; // posible bot

  // Validar longitud
  if (message.length > 500) {
    alert("El mensaje es demasiado largo (máximo 500 caracteres)");
    return;
  }

  if (name && message) {
    try {
      await addDoc(collection(db, "guestbook"), {
        name,
        message,
        timestamp: serverTimestamp()
      });
      form.reset();
    } catch (error) {
      console.error("Error al guardar mensaje:", error);
    }
  }
});

// Mostrar mensajes en tiempo real
const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  entriesContainer.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${data.name}</strong><p>${data.message}</p>`;
    entriesContainer.appendChild(div);
  });
});
