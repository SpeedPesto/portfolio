const projets = document.querySelectorAll('.projet');
projets.forEach(projet => {
    projet.addEventListener('click', () => {
        
        const id = projet.getAttribute('id');
        switch(id) {
            case "qui-est-ce":
                window.open('qui-est-ce/index.html', '_self');
                break;
            case "guess-the-character":
                window.open('guess the character/index.html', '_self');
                break;
            case "kikise-with-pixelised-image":
                window.open('guess the character with pixelised image/index.html', '_self');
                break;
            case "toujours-plus-fort":
                window.open('toujours plus fort/index.html', '_self');
                break; 
            case "histoire":
                window.open('histoire/index.html', '_self');
                break;    
            default:
                alert("Projet non trouvé !");
        }

    });
});