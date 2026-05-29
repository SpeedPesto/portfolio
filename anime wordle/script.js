let characters = [];
const world_container = document.getElementById("world-container");
let current_world;
let good_letters = [];

let current_ligne_index = 1;
let current_letter_index = 1;

const shake_animation = [
    { transform: "translate(0, 0)" },
    { transform: "translate(-10px, 0)" },
    { transform: "translate(10px, 0)" },
    { transform: "translate(-10px, 0)" },
    { transform: "translate(10px, 0)" },
    { transform: "translate(0, 0)" }
];

const shake_letter_box_animation = [
    { background: '#7e5b5815', border: "1px solid #ad838025" },
    { background: '#7e5b5815', border: "1px solid #ad838025" },
    { background: '#7e5b5815', border: "1px solid #ad838025" },
    { background: '#7e5b5815', border: "1px solid #ad838025" },
    { background: '#7e5b5815', border: "1px solid #ad838025" },
];

const letter_box_apparition_animation = [
    { transform: "scale(1)" },
    { transform: "scale(1.2)" },
    { transform: "scale(1)" },
];

function start_game() {
    const random_index = Math.floor(Math.random() * characters.length);
    current_world = characters[random_index].name;
    
    world_container.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const ligne = document.createElement("div");
        ligne.setAttribute("id", `ligne-${i + 1}`);
        ligne.classList.add("ligne");

        for (let i = 0; i < current_world.length; i++) {
            const letter_box = document.createElement("div");
            letter_box.classList.add("letter-box");
            letter_box.setAttribute("id", `letter-box-${i + 1}`);
            ligne.appendChild(letter_box);
        }

    world_container.appendChild(ligne);
    }


    nextLigne(true);
    console.log(current_world);
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "enter") {
        enter();
    } else if (key === "backspace") {
        backspace();
    } else if(key === " ") {
        letter("space");
     } else if (key === "-") {
        letter("dash");
     } else if (key === "'") {
        letter("apostrophe");
     } else if (key.length === 1 && key.match(/[a-z]/i)) {
        letter(key);
    }
});

const keyboard_buttons = document.querySelectorAll(".keyboard-button");
keyboard_buttons.forEach(button => {
    button.addEventListener("click", () => {
        const key = button.textContent.toLowerCase();
        if (key === "enter") {
            enter();
        } else if (key === "backspace") {
            backspace();
        } else if (key === "space") {
            letter("space");
        } else if (key.length === 1) {
            letter(key);
        }
    });
});

function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function enter() {
    if (current_letter_index === current_world.length + 1) {
        const current_ligne_box = document.getElementById(`ligne-${current_ligne_index}`);
        const letter_boxes = current_ligne_box.querySelectorAll(".letter-box");
        let guess = "";
        letter_boxes.forEach(box => {
            guess += normalize(box.textContent);
        });

        if (guess === normalize(current_world)) {
            alert("Correct!");
            letter_boxes.forEach(box => { box.classList.add('correct') });
        } else {
            const letters = current_world.split("");
            const remaining_letters = current_world.split("").map(l => normalize(l));

            letter_boxes.forEach(box => {
                const letter = box.textContent;
                if (letter === normalize(current_world[box.id.split("-")[2] - 1])) {
                    remaining_letters.splice(remaining_letters.indexOf(letter), 1);
                }
            });

            let i = 1;

            for (const box of letter_boxes) {
                const letter = box.textContent;

                if (letter === normalize(current_world[box.id.split("-")[2] - 1])) {
                    if (!good_letters.includes(i)) { good_letters.push(i);}
                    box.classList.add('correct');
                } else if (remaining_letters.includes(letter)) {
                    remaining_letters.splice(remaining_letters.indexOf(letter), 1);
                    box.classList.add('misplaced');
                } else {
                    box.classList.add('false');
                }

                box.animate(letter_box_apparition_animation, 100);
                await wait(100);

                i ++;
            }
            nextLigne();
        }
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nextLigne(firstTime=false){
    if (!firstTime){ current_ligne_index ++; }
    current_letter_index = 1;

    document.querySelectorAll('.current').forEach(box => {
        box.classList.remove('current');
    });

    const current_ligne = document.getElementById(`ligne-${current_ligne_index}`);
    const letter_box = current_ligne.querySelectorAll('.letter-box');

    if (good_letters.length > 0) {
        good_letters.forEach(index => {
            const current_box = current_ligne.querySelector(`#letter-box-${index}`);
            current_box.textContent = current_world[index - 1];
            current_box.classList.add('good-letter');
        });
    }

    letter_box.forEach(box => {
        box.classList.add('current')
    });
}

function backspace() {
    if (current_letter_index <= 1) return;

    current_letter_index--;

    const current_ligne = document.getElementById(`ligne-${current_ligne_index}`);
    const current_letter_box = current_ligne.querySelector(`#letter-box-${current_letter_index}`);

    current_letter_box.textContent = '';

    if (good_letters.includes(current_letter_index - 1)) {
        current_letter_box.textContent = current_world[current_letter_index - 1];
        current_letter_box.classList.add('good-letter');
        return;
    }
}

function letter(key) {
    const current_ligne = document.getElementById(`ligne-${current_ligne_index}`);
    const current_letter_box = current_ligne.querySelector(`#letter-box-${current_letter_index}`);

    if (current_letter_index >= current_world.length + 1) {
        current_ligne.querySelectorAll('.letter-box').forEach(box => {
            box.animate(shake_letter_box_animation, 200);
        });
        current_ligne.animate(shake_animation, 200);
        return;
    }

    if (key === "space") {
        key = " ";
    } else if (key === "dash") {
        key = "-";
    } else if (key === "apostrophe") {
        key = "'";
    }

    if (current_letter_box) {
        current_letter_box.textContent = key;

        if (current_letter_box.classList.contains('good-letter')) {
            current_letter_box.classList.remove('good-letter');
        }

        current_letter_box.animate(letter_box_apparition_animation, 100)
        current_letter_index++;
    }
}

function resetGame() {
  current_ligne_index = 1;
  current_letter_index = 1;
  good_letters = [];
  start_game();
}

function revealCharacter() {
    const current_ligne = document.getElementById(`ligne-${current_ligne_index}`);
    const letter_boxes = current_ligne.querySelectorAll(".letter-box");

    letter_boxes.forEach(box => {
        const index = box.id.split("-")[2];
        box.textContent = current_world[index - 1]; 
        box.classList.add('correct');
        box.animate(letter_box_apparition_animation, 100);
    });
}