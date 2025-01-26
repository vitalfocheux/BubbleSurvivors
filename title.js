const letters = {
    B: [
        [0, 0], [0, 13], [0, 26], [0, 39], [0, 52], [0, 65],  
        [13, 0], [13, 26], [13, 65],
        [26, 0], [26, 26], [26, 65],
        [39, 13], [39, 39], [39, 52], 
        
    ],
    U: [
        [0, 0], [0, 13], [0, 26], [0, 39], [0, 52],
        [13, 65],
        [26, 65],
        [39, 0], [39, 13], [39, 26], [39, 39], [39, 52],
    ],
    L: [
        [0, 0], [0, 13], [0, 26], [0, 39], [0, 52], [0, 65],
        [13, 65],
        [26, 65],
        [39, 65],
    ],
    E : [
        [0, 0], [0, 13], [0, 26], [0, 39], [0, 52],[0, 65],
        [13, 0], [13, 26], [13, 65],
        [26, 0], [26, 26], [26, 65],
        [39, 0], [39, 26], [39, 65],
    ],
    S : [
        [0, 13], [0, 26], [0, 65],
        [13, 0], [13, 26], [13, 65],
        [26, 0], [26, 39], [26, 65],
        [39, 0], [39, 39], [39, 52],
    ],
    R : [
        [0, 0], [0, 13], [0, 26], [0, 39], [0, 52],[0, 65],
        [13, 0], [13, 39],
        [26, 0], [26, 39], [26, 52],
        [39, 13], [39, 26],[39, 65],
    ],
    V : [
        [0, 0], [0, 13], [0, 26], [0, 39], 
        [13, 52],
        [19.5, 65],
        [26, 52],
        [39, 0], [39, 13], [39, 26], [39, 39],
    ],
    I : [
        [0, 0], [0, 65],
        [13, 0], [13, 65],
        [19.5, 13], [19.5, 26], [19.5, 39], [19.5, 52],
        [26, 0], [26, 65],
        [39, 0], [39, 65],
    ],
    O : [
        [0, 13], [0, 26], [0, 39],[0, 52],
        [13, 0],[13, 65],
        [26, 0],[26, 65],
        [39, 13], [39, 26], [39, 39],[39, 52],
    ],
};

function createLetter(letter, offsetX) {
    const letterCoords = letters[letter];
    const container = document.querySelector('.title-container');

    letterCoords.forEach(([x, y]) => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.left = `${x + offsetX}px`;
        bubble.style.top = `${y}px`;
        container.appendChild(bubble);
    });
}

function createTitle() {
    const title = "BUBBLE_SURVIVORS";
    let offsetX = 0;

    title.split('').forEach(char => {
        if (letters[char]) {
            createLetter(char, offsetX);
            offsetX += 65; // Largeur de l'espace entre chaque lettre
        } else {
            offsetX += 65; // Largeur de l'espace pour les caractères non définis
        }
    });

    // Ajuster la largeur de la .title-container pour qu'elle s'adapte au contenu
    const container = document.querySelector('.title-container');
    container.style.width = `${offsetX}px`;
}
document.addEventListener("DOMContentLoaded", function() {
    // Créer le titre en bulles
    createTitle();
});