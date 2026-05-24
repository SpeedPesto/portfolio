import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBsxCYCV29_GLxsguNz07GRctBPiye7olQ",
    authDomain: "superiority-7c914.firebaseapp.com",
    projectId: "superiority-7c914",
    storageBucket: "superiority-7c914.firebasestorage.app",
    messagingSenderId: "721906277131",
    appId: "1:721906277131:web:761b9677fec8b7c958e00e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const message_input = document.getElementById("message-input");
const message_btn = document.getElementById("message-btn");
const messages_container = document.getElementById("messages-container");
const refresh_btn = document.getElementById("refresh");

const characters = document.getElementById("characters");

const maxCharacters = 65;
let histoire_id = 1;

loadMessages();
characters.textContent = `0/${maxCharacters}`;

message_btn.addEventListener("click", () => {
    const message = message_input.value;

    if (localStorage.getItem("last writing date") !== new Date().toDateString()) {
        localStorage.setItem("writing today", "false");
    }

    if (message.trim() !== "") {
        if (localStorage.getItem("writing today") !== "true") {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.textContent = '- ' + message;
            messages_container.appendChild(messageElement);
            message_input.value = "";

            saveMessage(message);
            messages_container.scrollTop = messages_container.scrollHeight;

            localStorage.setItem("writing today", "true");
            localStorage.setItem("last writing date", new Date().toDateString());
        }else {
            alert("Tu as déjà écrit aujourd'hui ! Reviens demain pour écrire à nouveau.");
        }
    }
});

message_input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        message_btn.click();
        return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
        const characterCount = Math.max(0, message_input.value.length - 1);
        characters.textContent = `${characterCount}/${maxCharacters}`;
        return;
    }

    const characterCount = message_input.value.length + 1;
    if (characterCount > maxCharacters) {
        event.preventDefault();
    }

    characters.textContent = `${Math.min(characterCount, maxCharacters)}/${maxCharacters}`;
});

async function saveMessage(message) {
    const key = Date.now().toString();
    const messagesRef = doc(db, "messages", `histoire${histoire_id}`);
    await setDoc(messagesRef, {
        messages: {
            [key]: {
                message: message,
                timestamp: Date.now()
            }
        }
    }, { merge: true });
}

function loadMessages() {
    const messagesRef = doc(db, "messages", `histoire${histoire_id}`);
    getDoc(messagesRef).then((docSnap) => {
        if (docSnap.exists()) {
            const messagesData = docSnap.data();
            const messagesArray = Object.values(messagesData.messages || {})
                .sort((a, b) => a.timestamp - b.timestamp);
            messagesArray.forEach((msg) => {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");
                messageElement.textContent = '- ' + msg.message;
                messages_container.appendChild(messageElement);
            });
            messages_container.scrollTop = messages_container.scrollHeight;
        }
    });
}

refresh_btn.addEventListener("click", () => {
    messages_container.innerHTML = "";
    loadMessages();
});