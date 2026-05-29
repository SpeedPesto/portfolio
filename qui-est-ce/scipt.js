let ismodifying = false;
let isSuppressing = false;

const buttons = []

function addButtonListener(b) {
    b.button.addEventListener("click", () => {
        if (ismodifying) {
            const newTitle = prompt("Entre le nouveau titre de l'image :");
            if (newTitle) {
                b.button.querySelector("p").textContent = newTitle;
            }
        }else if (isSuppressing) {
            if (confirm("Tu es sûr de vouloir supprimer cette carte ?")) {
                b.button.remove();
            }
        }
        else {
            b.state = !b.state;
            if (b.state) {
                b.button.classList.add("active");
            } else {
                b.button.classList.remove("active");
            }
        }
    });
}

Array.from(document.getElementById("cards").getElementsByClassName("b")).forEach((button) => {
    const b = { button: button, state: false };
    buttons.push(b);
    addButtonListener(b);
});

const input = document.getElementById("imageInput")

input.addEventListener("change", (event) => {
    const images = input.files

    Array.from(images).forEach((image) => {
        const url = URL.createObjectURL(image)
        const img = document.createElement("img")
        img.src = url

        const button = document.createElement("button")
        button.classList.add("b")
        const p = document.createElement("p")
        p.textContent = "NONE"

        button.appendChild(p)
        button.appendChild(img)

        document.getElementById("cards").appendChild(button)

        const b = { button: button, state: false };
        buttons.push(b);
        addButtonListener(b);
    })
})


const ajouter = document.getElementById("ajouter")
ajouter.addEventListener("click", () => {
    input.click()
})  

const modifier = document.getElementById("modifier")
modifier.addEventListener("click", () => {
    ismodifying = !ismodifying;
    if (isSuppressing)
    {
        isSuppressing = false;
        supprimer.classList.remove("active");
    }

    modifier.classList.toggle("active", ismodifying);
})

const supprimer = document.getElementById("supprimer")
supprimer.addEventListener("click", () => {
    isSuppressing = !isSuppressing;
    if (ismodifying)
    {
        ismodifying = false;
        modifier.classList.remove("active");
    }

    supprimer.classList.toggle("active", isSuppressing);
})

const copier = document.getElementById("copier")
copier.addEventListener("click", () => {
    let data = "";
    Array.from(buttons).forEach((b) => {
        const title = b.button.querySelector("p").textContent;
        const img = b.button.querySelector("img");
        const src = img ? img.src : "";
        data += `${title}|${src}\n`;
    });

    navigator.clipboard.writeText(data).then(() => {
        alert("Données copiées dans le presse-papiers !");
    }).catch((err) => {
        console.error("Erreur lors de la copie : ", err);
    });
})

const importer = document.getElementById("importer")
importer.addEventListener("click", () => {
    const data = prompt("Collez les données à importer :");
    if (data) {
        const lines = data.split("\n");
        lines.forEach((line) => {
            const [title, src] = line.split("|");
            if (title && src) {
                const img = document.createElement("img")
                img.src = src

                const button = document.createElement("button")
                button.classList.add("b")
                const p = document.createElement("p")
                p.textContent = title

                button.appendChild(p)
                button.appendChild(img)

                document.getElementById("cards").appendChild(button)

                const b = { button: button, state: false };
                buttons.push(b);
                addButtonListener(b);
            }
        });
    }
})
