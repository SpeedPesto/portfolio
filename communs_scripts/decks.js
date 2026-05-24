const decks_btn = document.getElementById('decks');
const deck_container = document.getElementById('deck-container');

const naruto_decks = document.getElementById('naruto-decks');
const jojo_decks = document.getElementById('jojo-decks');

const validate_btn = document.getElementById('validate');

// Naruto decks
const naruto_classic_btn = document.getElementById('naruto-classic');
const naruto_7epeistes_btn = document.getElementById('naruto-7epeistes');
const naruto_pain_btn = document.getElementById('naruto-pain');
const naruto_bidjus_et_invocations_btn = document.getElementById('naruto-bidjus-et-invocations');
const naruto_quator_btn = document.getElementById('naruto-quator');

// Jojo decks
const jojo_characters_btn = document.getElementById('jojo-characters');
const jojo_stands_btn = document.getElementById('jojo-stands');

const retour_btn = document.getElementById('retour');

let is_in_Naruto_decks = false;
let is_in_Jojo_decks = false;

naruto_classic_btn.classList.add('hide');
naruto_7epeistes_btn.classList.add('hide');
naruto_pain_btn.classList.add('hide');
naruto_bidjus_et_invocations_btn.classList.add('hide');
naruto_quator_btn.classList.add('hide');

jojo_characters_btn.classList.add('hide');
jojo_stands_btn.classList.add('hide');

retour_btn.classList.add('hide');
let at_least_one_deck_selected = false;

for (const deck of [naruto_classic_btn, naruto_7epeistes_btn, naruto_pain_btn, naruto_bidjus_et_invocations_btn, naruto_quator_btn, jojo_characters_btn, jojo_stands_btn]) {
    if (localStorage.getItem(deck.id) === 'true') {
        deck.classList.add('active');
        at_least_one_deck_selected = true;
    }
}

if (at_least_one_deck_selected) {
    load_deck();
} else {
    fermeture();
}

decks_btn.addEventListener('click', () => {
    fermeture();
});

naruto_decks.addEventListener('click', () => {
    toggleMenu();
    toggleNarutoDecks();
    is_in_Naruto_decks = true;
});

jojo_decks.addEventListener('click', () => {
    toggleMenu();
    toggleJojoDecks();
    is_in_Jojo_decks = true;
});

retour_btn.addEventListener('click', () => {
    toggleMenu();
    if (is_in_Naruto_decks) {
        toggleNarutoDecks();
        is_in_Naruto_decks = false;
    } else if (is_in_Jojo_decks) {
        toggleJojoDecks();
        is_in_Jojo_decks = false;
    }
});

function toggleMenu() {
    naruto_decks.classList.toggle('hide');
    jojo_decks.classList.toggle('hide');
    validate_btn.classList.toggle('hide');
};

function toggleNarutoDecks() {
    naruto_classic_btn.classList.toggle('hide');
    naruto_7epeistes_btn.classList.toggle('hide');
    naruto_pain_btn.classList.toggle('hide');
    naruto_bidjus_et_invocations_btn.classList.toggle('hide');
    naruto_quator_btn.classList.toggle('hide');

    retour_btn.classList.toggle('hide');
};

function toggleJojoDecks() {
    jojo_characters_btn.classList.toggle('hide');
    jojo_stands_btn.classList.toggle('hide');

    retour_btn.classList.toggle('hide');
};

for (const naruto_deck of [naruto_classic_btn, naruto_7epeistes_btn, naruto_pain_btn, naruto_bidjus_et_invocations_btn, naruto_quator_btn]) {
    naruto_deck.style.setProperty('--bg-image', `url('../images/decks/naruto/${naruto_deck.id}.jpg')`);

    naruto_deck.addEventListener('click', () => {
        naruto_deck.classList.toggle('active');
        localStorage.setItem(naruto_deck.id, naruto_deck.classList.contains('active'));
    });
}

for (const jojo_deck of [jojo_characters_btn, jojo_stands_btn]) {
    jojo_deck.style.setProperty('--bg-image', `url('../images/decks/jojo/${jojo_deck.id}.jpg')`);

    jojo_deck.addEventListener('click', () => {
        jojo_deck.classList.toggle('active');
        localStorage.setItem(jojo_deck.id, jojo_deck.classList.contains('active'));
    });
}

validate_btn.addEventListener('click', () => {
    load_deck();
    fermeture();
});


async function load_deck() {
    if (document.title === 'Guess the character') {
        await fetch_characters(true);
    } else {
        await fetch_characters();
    }

    characters.length = 0;

    const map = {
        'naruto-classic': naruto_classic,
        'naruto-7epeistes': naruto_7epeistes,
        'naruto-pain': naruto_pain,
        'naruto-bidjus-et-invocations': naruto_bidjus_et_invocations,
        'naruto-quator': naruto_quator,

        'jojo-characters': jojo_characters,
        'jojo-stands': jojo_stands,
    };

    for (const naruto_deck of [naruto_classic_btn, naruto_7epeistes_btn, naruto_pain_btn, naruto_bidjus_et_invocations_btn, naruto_quator_btn]) {
        if (naruto_deck.classList.contains('active')) {
            characters.push(...map[naruto_deck.id]);
        }
    }

    for (const jojo_deck of [jojo_characters_btn, jojo_stands_btn]) {
        if (jojo_deck.classList.contains('active')) {
            characters.push(...map[jojo_deck.id]);
        }
    }
}

function fermeture() {
    const willOpen = !deck_container.classList.contains('show');

    is_in_Naruto_decks = false;
    is_in_Jojo_decks = false;

    if (!willOpen) {
        naruto_decks.classList.remove('hide');
        jojo_decks.classList.remove('hide');
        validate_btn.classList.remove('hide');

        naruto_classic_btn.classList.add('hide');
        naruto_7epeistes_btn.classList.add('hide');
        naruto_pain_btn.classList.add('hide');
        naruto_bidjus_et_invocations_btn.classList.add('hide');
        naruto_quator_btn.classList.add('hide');

        jojo_characters_btn.classList.add('hide');
        jojo_stands_btn.classList.add('hide');

        retour_btn.classList.add('hide');
    }

    deck_container.classList.toggle('show');
}

