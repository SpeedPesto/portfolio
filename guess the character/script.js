const title = document.getElementById('title');
const character_input = document.getElementById('character-input');
const submit_btn = document.getElementById('submit-btn');
const dd = document.getElementById('dd');
const characters = [];
let current_character = null;

load_character();

function load_character() {
  fetch('characters.json')
    .then(response => response.json())
    .then(data => {
      const characters_data = data.characters;
      characters_data.forEach(character => {
        characters.push(character);
      });

      const random_index = Math.floor(Math.random() * characters.length);
      current_character = characters[random_index];
    })
    .catch(error => console.error('Error loading characters:', error));
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
      img.src = character.img_src;
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

  img.src = caracter.img_src;
  img.alt = caracter.name;
  name.textContent = caracter.name;

  const Rank = document.createElement('span');
  const isSameRank = caracter.rank === current_character.rank;
  Rank.classList.add(isSameRank ? 'same' : 'different');
  Rank.textContent = `Rank: ${caracter.rank}`;

  const Village = document.createElement('span');
  const isSameVillage = caracter.village === current_character.village;
  Village.classList.add(isSameVillage ? 'same' : 'different');
  Village.textContent = `Village: ${caracter.village}`;

  const Chakras = document.createElement('span');
  const characterChakras = caracter.chakra.split(',').map(chakra => chakra.trim());
  const currentCharacterChakras = current_character.chakra.split(',').map(chakra => chakra.trim());
  const isSameChakras = characterChakras.length === currentCharacterChakras.length && characterChakras.every(chakra => currentCharacterChakras.includes(chakra));
  const atLeastOneSameChakra = characterChakras.some(chakra => currentCharacterChakras.includes(chakra));

  Chakras.classList.add(isSameChakras ? 'same' : atLeastOneSameChakra ? 'atLeastOne' : 'different');
  Chakras.textContent = `Chakras: ${caracter.chakra}`;

  const Type = document.createElement('span');
  const isSameType = caracter.type === current_character.type;
  Type.classList.add(isSameType ? 'same' : 'different');
  Type.textContent = `Type: ${caracter.type}`;

  const Gender = document.createElement('span');
  const isSameGender = caracter.gender === current_character.gender;
  Gender.classList.add(isSameGender ? 'same' : 'different');
  Gender.textContent = `Gender: ${caracter.gender}`;

  const puissance = document.createElement('span');
  const isLowerPuissance = caracter.puissance < current_character.puissance;
  const isSamePuissance = caracter.puissance === current_character.puissance;
  puissance.classList.add(isSamePuissance ? 'same' : isLowerPuissance ? 'lower' : 'higher');
  puissance.textContent = `Puissance: ${caracter.puissance}`;

  const isSameName = caracter.name === current_character.name;

  if (isSameRank && isSameVillage && isSameChakras && isSameType && isSameGender && isSamePuissance && isSameName) {
    alert("Bravo c'était effectivement : " + caracter.name);
  }else {
    title.textContent = `Guess the character | attempt ${document.getElementById('submit-characters').children.length + 1}`;
  }

  li.appendChild(img);
  li.appendChild(name);
  li.appendChild(Rank);
  li.appendChild(Village);
  li.appendChild(Chakras);
  li.appendChild(Type);
  li.appendChild(Gender);
  li.appendChild(puissance);

  document.getElementById('submit-characters').prepend(li);
});
