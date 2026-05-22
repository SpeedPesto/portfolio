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

const guess_input = document.getElementById('guess-input');
const submit_button = document.getElementById('submit-button');
const messages_container = document.getElementById('messages-container');
const bot_writing = document.getElementById('bot-writing');
const historique_container = document.getElementById('historique-container');
const reussites = document.getElementById('reussites-title');
const API_KEY = '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';

let isFinished = false;
let current_character = "un humain";

guess_input.placeholder = `... est plus fort que ${current_character} ?`;
const initCharacter = document.createElement('div');
initCharacter.classList.add('character');

const initCharacterName = document.createElement('p');
initCharacterName.textContent = current_character;
initCharacter.appendChild(initCharacterName);

historique_container.appendChild(initCharacter);

submit_button.addEventListener('click', () => {

    if (isFinished) {
        alert('Hop hop hop, on arrête de tricher (tes chipeur ou koa, ta la ref ? chipeur arrete de chipper takapté ?) ! Rafraîchis la page pour recommencer une partie.');
        return;
    }

    const guess = guess_input.value.trim();
    if (guess === '') {
        alert('Please enter a guess!');
        return;
    }

    const messageText = `${guess} est plus fort que ${current_character} ?`
    const message = document.createElement('div');
    message.classList.add('message');
    message.textContent = messageText;
    messages_container.appendChild(message);
    guess_input.value = '';

    generateResponse(messageText, guess, current_character).then(response => { 
        const responseMessage = document.createElement('div');
        responseMessage.classList.add('bot-message');
        responseMessage.textContent = response;
        messages_container.appendChild(responseMessage);

        const newCharacter = document.createElement('div');
        newCharacter.classList.add('character');
        const characterName = document.createElement('p');
        characterName.textContent = guess;

        const span = document.createElement('span');


        if (response.toLowerCase().startsWith('oui')) {
            span.classList.add('superior');
            newCharacter.style.backgroundColor = '#2b4e3534';
            newCharacter.style.borderColor = '#2b4e3534';

            current_character = guess;
            guess_input.placeholder = `... est plus fort que ${current_character} ?`;

            reussites.textContent = `Réussites: ${historique_container.querySelectorAll('.superior').length + 1}`;
        }else if (response.toLowerCase().startsWith('non')) {
            span.classList.add('inferior');
            newCharacter.style.backgroundColor = '#80323234';
            newCharacter.style.borderColor = '#80323234';

            isFinished = true;
        }

        newCharacter.appendChild(characterName);
        historique_container.appendChild(span);
        historique_container.appendChild(newCharacter);
    });
});

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const prompt = `
Tu es un fin connaisseur de tous les personnages d'animé. Ton but est de dire factuellement si un personnage est plus fort qu'un autre.
Tu dois dire si il est plus fort ou non pas d'équivalent à "oui" ou "non". Si tu ne connais pas un personnage,
tu dois faire des recherches pour trouver sa force et la comparer à l'autre personnage.
L'un des personnages est toujours plus fort que l'autre, il n'y a pas d'égalité.
Prend en compte toutes les techniques et pouvoirs des personnages pour faire ta comparaison, pas seulement leur force brute.
Imagine que tu es un juge dans un tournoi de combat entre tous les personnages d'animé, et que tu dois décider qui est le gagnant de chaque combat.
Tu dois répondre par "oui" ou "non" et expliquer ta réponse en une courte phrase de moins de 500 caractères.
`;

async function generateResponse(userMessage, perso1, perso2) {
    bot_writing.style.display = 'block';

    const cached = await getCombat(perso1, perso2);
    if (cached) {
        await wait(500);
        bot_writing.style.display = 'none';
        return `${cached.gagnant === perso1 ? 'Oui' : 'Non'}, ${cached.explication}`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 1000
        })
    });

    const data = await response.json();
    const reponse = data.choices[0].message.content;

    const gagnant = reponse.toLowerCase().startsWith('oui') ? perso1 : perso2;
    const explication = reponse.replace(/^(oui|non)[,.]?\s*/i, '');
    await saveCombat(perso1, perso2, gagnant, explication);

    const randomDelay = Math.floor(Math.random() * 2000) + 500;
    await wait(randomDelay);
    bot_writing.style.display = 'none';
    return reponse;
}


function combatKey(perso1, perso2) {
    return [perso1, perso2].sort().join('_vs_').toLowerCase().replace(/\s/g, '-');
}

async function saveCombat(perso1, perso2, gagnant, explication) {
    const key = combatKey(perso1, perso2);
    await setDoc(doc(db, "combats", key), {
        perso1, perso2, gagnant, explication
    });
}

async function getCombat(perso1, perso2) {
    const key = combatKey(perso1, perso2);
    const snap = await getDoc(doc(db, "combats", key));
    return snap.exists() ? snap.data() : null;
}