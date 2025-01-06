// Importando as bibliotecas necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBBRL95tLLS7tZokhzOOkB7hp8r6wqYuSM",
  authDomain: "notfis-69fd5.firebaseapp.com",
  projectId: "notfis-69fd5",
  storageBucket: "notfis-69fd5.firebasestorage.app",
  messagingSenderId: "1042051852096",
  appId: "1:1042051852096:web:0a513011d364284983fca5",
};
// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Referências aos elementos HTML
const loginBtn = document.getElementById("google-login-btn");
const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Logout";
logoutBtn.classList.add("logout-btn");

const appContainer = document.getElementById("app-container");
const loginContainer = document.getElementById("login-container");
const notaForm = document.getElementById("nota-form");
const notasList = document.getElementById("notas-list");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

let currentUser = null;

// Função de login com Google
loginBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      currentUser = result.user;
      showAppContent();
      fetchNotas();
    })
    .catch((error) => {
      console.error("Erro ao fazer login: ", error);
    });
});

// Função para verificar se o usuário está logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    showAppContent();
    fetchNotas();
  } else {
    currentUser = null;
    showLoginPage();
  }
});

// Função para exibir o conteúdo do app após login
function showAppContent() {
  loginContainer.style.display = "none";
  appContainer.style.display = "block";
  appContainer.appendChild(logoutBtn);

  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        loginContainer.style.display = "flex";
        appContainer.style.display = "none";
        currentUser = null;
      })
      .catch((error) => {
        console.error("Erro ao fazer logout: ", error);
      });
  });
}

// Função para exibir a página de login
function showLoginPage() {
  loginContainer.style.display = "flex";
  appContainer.style.display = "none";
}

// Função para adicionar uma nova nota fiscal
notaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cliente = document.getElementById("cliente").value;
  const produto = document.getElementById("produto").value;
  const arquivo = document.getElementById("arquivo").value;

  if (cliente && produto && arquivo && currentUser) {
    try {
      await addDoc(collection(db, "notas"), {
        cliente: cliente,
        produto: produto,
        arquivo: arquivo,
        userId: currentUser.uid, // Associa a nota ao usuário
        createdAt: new Date(),
      });
      fetchNotas(); // Atualiza a lista de notas
      notaForm.reset();
    } catch (error) {
      console.error("Erro ao adicionar nota fiscal: ", error);
    }
  }
});

// Função para buscar notas fiscais
searchBtn.addEventListener("click", async () => {
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm && currentUser) {
    const q = query(
      collection(db, "notas"),
      where("userId", "==", currentUser.uid), // Garante que só o usuário logado veja suas notas
      where("cliente", "==", searchTerm)
    );
    const querySnapshot = await getDocs(q);
    displayNotas(querySnapshot);
  }
});

// Função para buscar todas as notas fiscais do usuário
async function fetchNotas() {
  if (currentUser) {
    const q = query(
      collection(db, "notas"),
      where("userId", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    displayNotas(querySnapshot);
  }
}

// Função para exibir as notas fiscais na tela
function displayNotas(querySnapshot) {
  notasList.innerHTML = ""; // Limpa a lista antes de exibir as notas
  querySnapshot.forEach((doc) => {
    const nota = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
        <span><strong>Cliente:</strong> ${nota.cliente} | <strong>Produto:</strong> ${nota.produto} | <strong>Arquivo:</strong> <a href="${nota.arquivo}" target="_blank">Ver Arquivo</a></span>
        <button class="delete-btn" onclick="deleteNota('${doc.id}')">Excluir</button>
      `;
    notasList.appendChild(li);
  });
}

// Função para excluir uma nota fiscal
window.deleteNota = async (id) => {
  try {
    await deleteDoc(doc(db, "notas", id));
    fetchNotas(); // Atualiza a lista de notas após a exclusão
  } catch (error) {
    console.error("Erro ao excluir nota fiscal: ", error);
  }
};
uploadTask.on(
  "state_changed",
  (snapshot) => {
    // Progresso do upload (opcional)
  },
  (error) => {
    console.error("Erro ao fazer upload do arquivo: ", error);
  },
  async () => {
    // Obter a URL do arquivo após o upload
    const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

    // Adiciona a nota fiscal ao Firestore com o link do arquivo
    await addDoc(collection(db, "notas"), {
      cliente: cliente,
      produto: produto,
      arquivo: fileURL, // Armazena a URL do arquivo
      userId: currentUser.uid, // Associa a nota ao usuário
      createdAt: new Date(),
    });

    fetchNotas(); // Atualiza a lista de notas
    notaForm.reset();
  }
);
/*
        _             _
       / \           / \
      /   \         /   \
     /     \_______/     \
    /  ___           ___  \
   |  / ()\         / ()\  |
   |  \___/         \___/  |
   |           ___         |
   \          |___|        /
    \           |         /
     \      \___|___/    /
      \_               _/
        \_____________/  
           MIAW MIAW


instagram : https://www.instagram.com/maxg1007/
portifolio : https://maxg100707.github.io/Portifolio/

*/
