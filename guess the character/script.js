const attemps = document.getElementById('attemps');
const character_input = document.getElementById('character-input');
const submit_btn = document.getElementById('submit-btn');
const dd = document.getElementById('dd');
const characters = [];
const refresh_btn = document.getElementById('refresh-btn');
const rules_btn = document.getElementById('rules-btn');
const reveal_btn = document.getElementById('reveal-btn');
let current_character = null;

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
}

character_input.addEventListener('input', () => {
  const val = character_input.value.toLowerCase();
  dd.innerHTML = '';

  if (val) {
    const filtered_characters = characters.filter(character => character.name.toLowerCase().startsWith(val));
    
    if (filtered_characters.length > 0) {
      open_dropdown();

      filtered_characters.forEach(character => {
       const li = document.createElement('li');
  
      const img = document.createElement('img');
      img.src = character.src;
      img.alt = character.name;

      const span = document.createElement('span');
      span.textContent = character.name;

      li.appendChild(img);
      li.appendChild(span);

      li.addEventListener('click', () => {
        character_input.value = character.name;
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
  if (!dd.contains(event.target) && event.target !== character_input) {
    close_dropdown();
  }else if (event.target === character_input) {
    if (dd.children.length > 0) {
      open_dropdown();
    }
  }
});

function close_dropdown() { dd.classList.remove('show')}
function open_dropdown() { dd.classList.add('show') }

submit_btn.addEventListener('click', () => {
  const user_input = character_input.value.trim();

  if (!characters.find(character => character.name.toLowerCase() === user_input.toLowerCase())) return alert('Personnage invalide ou déjà soumis.');
  const caracter = characters.find(character => character.name.toLowerCase() === user_input.toLowerCase());
  character_input.value = '';

  const li = document.createElement('li');
  const img = document.createElement('img');
  const name = document.createElement('p');

  img.src = caracter.src;
  img.alt = caracter.name;
  name.textContent = caracter.name;


  // GENRE
  const Gender = document.createElement('span');
  const isSameGender = caracter.genre === current_character.genre;
  Gender.classList.add(isSameGender ? 'same' : 'different');
  Gender.textContent = `Gender: ${caracter.genre}`;

  // PUISSANCE
  const puissance = document.createElement('span');
  const isLowerPuissance = caracter.puissance < current_character.puissance;
  const isSamePuissance = caracter.puissance === current_character.puissance;
  puissance.classList.add(isSamePuissance ? 'same' : isLowerPuissance ? 'lower' : 'higher');
  puissance.textContent = `Puissance: ${caracter.puissance}`;

  // TYPE
  const Type = document.createElement('span');
  const isSameType = caracter.type === current_character.type;
  Type.classList.add(isSameType ? 'same' : 'different');
  Type.textContent = `Type: ${caracter.type}`;

  // village
  const Village = document.createElement('span');
  const isSameVillage = caracter.village === current_character.village;
  Village.classList.add(isSameVillage ? 'same' : 'different');
  Village.textContent = `Village: ${caracter.village}`;

  // capacites
  const Capacitys = document.createElement('span');
  const characterCapacitys = caracter.capacites.split(',').map(capacity => capacity.trim());
  const currentCharacterCapacitys = current_character.capacites.split(',').map(capacity => capacity.trim());
  const isSamecapacitys = characterCapacitys.length === currentCharacterCapacitys.length && characterCapacitys.every(capacity => currentCharacterCapacitys.includes(capacity));
  const atLeastOneSameCapacity = characterCapacitys.some(capacity => currentCharacterCapacitys.includes(capacity));

  Capacitys.classList.add(isSamecapacitys ? 'same' : atLeastOneSameCapacity ? 'atLeastOne' : 'different');
  Capacitys.textContent = `Capacity: ${caracter.capacites}`;

  // ROLE
  const Role = document.createElement('span');
  const isSameRole = caracter.role === current_character.role;
  Role.classList.add(isSameRole ? 'same' : 'different');
  Role.textContent = `Role: ${caracter.role}`;


  const isSameName = caracter.name === current_character.name;

  if (isSameRole && isSameVillage && isSamecapacitys && isSameType && isSameGender && isSamePuissance && isSameName) {
    alert("Bravo c'était effectivement : " + caracter.name);
  }else {
    attemps.textContent = `Attempts: ${document.getElementById('submit-characters').children.length + 1}`;
  }

  li.appendChild(img);
  li.appendChild(name);
  li.appendChild(Gender);
  li.appendChild(Type);
  li.appendChild(Capacitys);
  li.appendChild(Role);
  li.appendChild(Village);
  li.appendChild(puissance);

  document.getElementById('submit-characters').prepend(li);
});

refresh_btn.addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  
  random_index = Math.floor(Math.random() * characters.length);
  current_character = characters[random_index];
  character_input.value = '';
  attemps.textContent = 'Attempts: 0';
  dd.innerHTML = '';
  character_input.innerHTML = '';
  document.getElementById('submit-characters').innerHTML = '';
}

rules_btn.addEventListener('click', () => {
  document.getElementById('rules-container').classList.toggle('show');
});

reveal_btn.addEventListener('click', () => {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const name = document.createElement('p');

  img.src = current_character.src;
  img.alt = current_character.name;
  name.textContent = current_character.name;

  li.appendChild(img);
  li.appendChild(name);

  const Gender = document.createElement('span');
  Gender.classList.add('same');
  Gender.textContent = `Gender: ${current_character.genre}`;

  const Puissance = document.createElement('span');
  Puissance.classList.add('same');
  Puissance.textContent = `Puissance: ${current_character.puissance}`;

  const Type = document.createElement('span');
  Type.classList.add('same');
  Type.textContent = `Type: ${current_character.type}`;

  const Village = document.createElement('span');
  Village.classList.add('same');
  Village.textContent = `Village: ${current_character.village}`;

  const Capacitys = document.createElement('span');
  Capacitys.classList.add('same');
  Capacitys.textContent = `Capacity: ${current_character.capacites}`;

  const role = document.createElement('span');
  role.classList.add('same');
  role.textContent = `Role: ${current_character.role}`;

  li.appendChild(Gender);
  li.appendChild(Puissance);
  li.appendChild(Type);
  li.appendChild(Village);
  li.appendChild(Capacitys);
  li.appendChild(role);

  li.style.backgroundColor = '#75b67773';

  document.getElementById('submit-characters').prepend(li);
});