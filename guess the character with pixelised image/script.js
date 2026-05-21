const game_board = document.getElementById('game-board');
const refresh_button = document.getElementById('refresh-button');
const result = document.getElementById('result');
const pixelated_image = document.getElementById('pixelated-image');
const guess_button = document.getElementById('guess-button');
const guess_input = document.getElementById('guess-input');
const dd = document.getElementById('dd');
const historique_container = document.getElementById('historique-container');
const historique_title = document.getElementById('historique-title');

const characters = [];
let current_character = null;
let current_img = null;
let current_pixelisation = 200;

game_board.style.visibility = 'hidden';

const loader = document.createElement('div');
loader.id = 'loader';
loader.textContent = 'Chargement...';
document.body.appendChild(loader);

load_character();

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function load_character() {
    try {

        await wait(500); // Simulate loading time

        const response = await fetch('characters.json');
        const data = await response.json();

        characters.push(...data.naruto);

        loader.remove();
        game_board.style.visibility = 'visible';
        start_game();

    } catch (error) {
        loader.textContent = 'Erreur de chargement 😕';
        console.error(error);
    }
}

function start_game() {
    const random_index = Math.floor(Math.random() * characters.length);
    current_character = characters[random_index];

    historique_title.textContent = 'Historique des devinettes | attemps : ' + historique_container.children.length;

    new_image();
}

function pixelate(img, taille = 10) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const w = img.naturalWidth;
  const h = img.naturalHeight;

  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(img, 0, 0, w / taille, h / taille);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, w / taille, h / taille, 0, 0, w, h);

  return canvas;
}

function new_image(taille = current_pixelisation) {
    current_img = new Image();
    current_img.crossOrigin = 'anonymous';

    current_img.onload = () => {
        const canvas = pixelate(current_img, taille);
        pixelated_image.src = canvas.toDataURL();
    };

    current_img.src = current_character.src;
}

refresh_button.addEventListener('click', () => {
    historique_container.innerHTML = '';
    guess_input.value = '';
    current_pixelisation = 200;
    start_game();
});

guess_button.addEventListener('click', () => {
    const guess = guess_input.value.trim().toLowerCase();

    const bad_guess = document.createElement('div');
    bad_guess.classList.add('guess');

    const name = document.createElement('p');
    name.textContent = guess_input.value.trim();
        
    const character = characters.find(c => c.nom === guess_input.value.trim());
    const src = character?.src;

    const img = document.createElement('img');
    img.src = src ? src : 'image.webp';

    bad_guess.appendChild(name);
    bad_guess.appendChild(img);

    if (guess !== current_character.nom.toLowerCase()) {
        bad_guess.style.animation = 'shake 0.5s';
        bad_guess.classList.add('bad_guess');
    } else {
        bad_guess.classList.add('good_guess');
    }

    historique_container.prepend(bad_guess);
    historique_title.textContent = 'Historique des devinettes | attemps : ' + historique_container.children.length;
        
    if (guess !== current_character.nom.toLowerCase()) {
        guess_input.value = '';

        if (current_pixelisation > 20) {
            current_pixelisation -= 20;
        }else {
            current_pixelisation = 1;
        }
        new_image(current_pixelisation);
    }else {
        new_image(1);
    }

    dd.innerHTML = '';

});

guess_input.addEventListener('input', () => {
    const val = guess_input.value.toLowerCase();
    dd.innerHTML = '';

    if (val) {
        const filtered_characters = characters.filter(character => character.nom.toLowerCase().startsWith(val));
    
        if (filtered_characters.length > 0) {
            open_dropdown();

            filtered_characters.forEach(character => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = character.nom;

            li.appendChild(span);

            li.addEventListener('click', () => {
                guess_input.value = character.nom;
                close_dropdown();
            });

            dd.appendChild(li);
        });
        } else {
            close_dropdown();
        }
    }else { close_dropdown() }
});

document.addEventListener('click', (event) => {
    if (!dd.contains(event.target) && event.target !== guess_input) {
        close_dropdown();
    } else if (event.target === guess_input) {
        if (dd.children.length > 0) open_dropdown();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        guess_button.click();
    }
});

function close_dropdown() { dd.classList.remove('show')}
function open_dropdown() { dd.classList.add('show') }
