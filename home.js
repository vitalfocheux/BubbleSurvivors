document.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('startGame').addEventListener('click', function() {
        alert('Le jeu commence bientôt ! Préparez-vous à survivre !');
        // Ici, vous ajouteriez la logique de démarrage du jeu
    });

    // Effet de scintillement du titre
    function titleFlicker() {
        const title = document.querySelector('.game-title');
        title.style.opacity = Math.random() > 0.5 ? '0.7' : '1';
    }

    setInterval(titleFlicker, 200);

    // Modal logic
    const modal = document.getElementById('modal');
    const btn = document.getElementById('howtoplay');
    const span = document.getElementsByClassName('close')[0];

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});