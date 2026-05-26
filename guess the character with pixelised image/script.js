const refresh_button = document.getElementById('refresh-button');
const result = document.getElementById('result');
const pixelated_image = document.getElementById('pixelated-image');
const guess_button = document.getElementById('guess-button');
const guess_input = document.getElementById('guess-input');
const dd = document.getElementById('dd');
const historique_container = document.getElementById('historique-container');
const historique_title = document.getElementById('historique-title');
const start_pixel_input = document.getElementById('start-pixel-input');
const pixel_per_fauts_input = document.getElementById('pixel-per-fautes-input');
const done = document.getElementById('done');

const characters = [];


let current_character = null;
let current_img = null;
let current_pixelisation = 200;
let pixel_per_fautes = 20;

if (localStorage.getItem('pixel_per_fautes')) {
    pixel_per_fautes = parseInt(localStorage.getItem('pixel_per_fautes'));
    pixel_per_fauts_input.value = pixel_per_fautes;
}

if (localStorage.getItem('start_pixel')) {
    current_pixelisation = parseInt(localStorage.getItem('start_pixel'));
    start_pixel_input.value = current_pixelisation;
}

const game_board = document.getElementById('game-board');
game_board.style.visibility = 'hidden';

const loader = document.createElement('div');
loader.id = 'loader';
loader.textContent = 'Aucun deck choisis... OH CHOISIS DU CON !';
document.body.appendChild(loader);

load_character();

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function load_character() {
    while (characters.length === 0) {
        await wait(1000);
    }

    loader.remove();
    game_board.style.visibility = 'visible';
    start_game();
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

function new_image(taille=current_pixelisation) {
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
        
    const character = characters.find(c => c.name === guess_input.value.trim());
    const src = character?.src;

    const img = document.createElement('img');
    img.src = src ? src : '../images/unknow.webp';

    bad_guess.appendChild(name);
    bad_guess.appendChild(img);

    if (guess !== current_character.name.toLowerCase()) {
        bad_guess.style.animation = 'shake 0.5s';
        bad_guess.classList.add('bad_guess');
    } else {
        bad_guess.classList.add('good_guess');
    }

    historique_container.prepend(bad_guess);
    historique_title.textContent = 'Historique des devinettes | attemps : ' + historique_container.children.length;
        
    if (guess !== current_character.name.toLowerCase()) {
        guess_input.value = '';

        if (current_pixelisation > pixel_per_fautes) {
            current_pixelisation -= pixel_per_fautes;
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
        const filtered_characters = characters.filter(character => character.name.toLowerCase().startsWith(val));
    
        if (filtered_characters.length > 0) {
            open_dropdown();

            filtered_characters.forEach(character => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = character.name;

            li.appendChild(span);

            li.addEventListener('click', () => {
                guess_input.value = character.name;
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

start_pixel_input.addEventListener('change', () => {
    const value = parseInt(start_pixel_input.value);
    start_pixel_input.value = value;

    if (value >= 20 && value <= 500) {
        current_pixelisation = value;
        localStorage.setItem('start_pixel', current_pixelisation);
    }
});

pixel_per_fauts_input.addEventListener('change', () => {
    const value = parseInt(pixel_per_fauts_input.value);
    pixel_per_fauts_input.value = value;

    if (value >= 10 && value <= 100) {
        pixel_per_fautes = value;
        localStorage.setItem('pixel_per_fautes', pixel_per_fautes);
    }
});

done.addEventListener('click', () => {
    const start_pixel_input_value = parseInt(start_pixel_input.value);
    const pixel_per_fautes_input_value = parseInt(pixel_per_fauts_input.value);

    current_pixelisation = start_pixel_input_value;
    localStorage.setItem('start_pixel', current_pixelisation);

    pixel_per_fautes = pixel_per_fautes_input_value;
    localStorage.setItem('pixel_per_fautes', pixel_per_fautes);

    new_image();
});
