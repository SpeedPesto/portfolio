const projets = document.querySelectorAll('.projet');
projets.forEach(projet => {
    projet.addEventListener('click', () => {
        
        const id = projet.getAttribute('id');
        switch(id) {
            case "qui-est-ce":
                window.open('qui-est-ce/index.html', '_blank');
                break;
            case "guess-the-character":
                window.open('guess the character/index.html', '_blank');
                break;
            case "kikise-with-pixelised-image":
                window.open('guess the character with pixelised image/index.html', '_blank');
                break;  
            default:
                alert("Projet non trouvé !");
        }

    });
});