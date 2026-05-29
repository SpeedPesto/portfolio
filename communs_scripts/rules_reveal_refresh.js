const refresh_btn = document.getElementById('refresh-btn');
const rules_btn = document.getElementById('rules-btn');
const reveal_btn = document.getElementById('reveal-btn');

if (refresh_btn) {
    refresh_btn.addEventListener('click', () => {
        resetGame();
    });
}

if (rules_btn) {
    rules_btn.addEventListener('click', () => {
        document.getElementById('rules-container').classList.toggle('show');
    });
}

if (reveal_btn) {
    reveal_btn.addEventListener('click', () => {
        revealCharacter();
    });
}