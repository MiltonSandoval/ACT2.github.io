// ------------ VARIABLES ------------
const board = document.getElementById("gameBoard");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const scoreEl = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");

let icons = ["🍎", "🍌", "🍇", "🍓", "🍉", "🍒", "🍑", "🍍"];
let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let canClick = true;

let moves = 0;
let score = 0;
let time = 0;
let timer = null;
let gameActive = true;

// ------------ INICIALIZAR JUEGO ------------
function startGame() {
    console.log("🔄 Iniciando nuevo juego...");
    
    // Reiniciar variables
    moves = 0;
    score = 0;
    time = 0;
    firstCard = null;
    secondCard = null;
    lock = false;
    canClick = true;
    gameActive = true;

    // Actualizar UI
    movesEl.textContent = moves;
    scoreEl.textContent = score;
    timerEl.textContent = "00:00";
    timerEl.style.color = "#ffffff";

    // Detener temporizador anterior si existe
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // Iniciar nuevo temporizador
    startTimer();

    // Duplicar iconos y mezclarlos
    cards = [...icons, ...icons];
    shuffle(cards);

    // Renderizar tablero
    renderBoard();
    
    console.log("✅ Juego iniciado");
}

// ------------ RENDERIZAR TABLERO ------------
function renderBoard() {
    board.innerHTML = "";
    
    cards.forEach((icon, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;
        card.dataset.index = index;
        card.dataset.id = `card-${index}`; // ID único para cada carta
        card.textContent = "";
        card.style.animationDelay = `${(index % 8) * 0.1}s`; // Efecto cascada

        board.appendChild(card);
    });
}

// ------------ SHUFFLE ------------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ------------ TEMPORIZADOR ------------
function startTimer() {
    timer = setInterval(() => {
        if (gameActive) {
            time++;
            const min = String(Math.floor(time / 60)).padStart(2, "0");
            const sec = String(time % 60).padStart(2, "0");
            timerEl.textContent = `${min}:${sec}`;
            
            // Cambiar color según el tiempo
            if (time > 120) { // Más de 2 minutos
                timerEl.style.color = "#ff6b6b";
            } else if (time > 60) { // Más de 1 minuto
                timerEl.style.color = "#ffa502";
            }
        }
    }, 1000);
}

// ------------ MANEJAR CLICK EN CARTA ------------
board.addEventListener("click", (e) => {
    const card = e.target;
    
    // Validaciones múltiples
    if (!canClick || !gameActive) return;
    if (!card.classList.contains("card")) return;
    if (card.classList.contains("matched")) return;
    if (card.classList.contains("revealed")) return;
    if (lock) return;
    
    // PREVENIR: Click en la misma carta dos veces
    if (card === firstCard) {
        console.log("⚠️ Intento de click en misma carta, ignorando...");
        return;
    }
    
    // Activar bloqueo temporal
    lock = true;
    
    // Revelar carta
    revealCard(card);
    
    // Lógica de emparejamiento
    if (!firstCard) {
        firstCard = card;
        lock = false; // Desbloquear para segunda carta
    } else {
        secondCard = card;
        checkMatch();
    }
});

// ------------ REVELAR CARTA ------------
function revealCard(card) {
    card.classList.add("revealed");
    card.textContent = card.dataset.icon;
    card.style.transform = "rotateY(0deg)";
    card.style.background = "#1DB954"; // Verde Spotify al revelar
    
    // Efecto de sonido visual
    card.style.boxShadow = "0 0 20px rgba(29, 185, 84, 0.5)";
    setTimeout(() => {
        card.style.boxShadow = "";
    }, 300);
}

// ------------ OCULTAR CARTA ------------
function hideCard(card) {
    card.classList.remove("revealed");
    card.textContent = "";
    card.style.transform = "rotateY(180deg)";
    card.style.background = "#333"; // Volver al color original
}

// ------------ VERIFICAR PAREJA ------------
function checkMatch() {
    // Incrementar movimientos
    moves++;
    movesEl.textContent = moves;
    
    const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    
    if (isMatch) {
        // PAREJA ENCONTRADA
        handleMatchSuccess();
    } else {
        // NO HAY PAREJA
        handleMatchFail();
    }
}

function handleMatchSuccess() {
    // Efecto visual para acierto
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    
    // Animación de éxito
    [firstCard, secondCard].forEach(card => {
        card.style.animation = "pulseSuccess 0.5s ease";
        setTimeout(() => {
            card.style.animation = "";
        }, 500);
    });
    
    // Calcular puntuación (más puntos por menos movimientos y tiempo)
    let moveBonus = Math.max(0, 20 - moves);
    let timeBonus = Math.max(0, 60 - time);
    let points = 10 + Math.floor((moveBonus + timeBonus) / 10);
    
    score += points;
    scoreEl.textContent = score;
    
    // Efecto visual en score
    scoreEl.style.transform = "scale(1.2)";
    scoreEl.style.color = "#1DB954";
    setTimeout(() => {
        scoreEl.style.transform = "";
        scoreEl.style.color = "#ffffff";
    }, 300);
    
    // Resetear selección y verificar si ganó
    setTimeout(() => {
        resetSelection();
        checkWin();
    }, 500);
}

function handleMatchFail() {
    // Efecto visual para error
    [firstCard, secondCard].forEach(card => {
        card.style.background = "#ff6b6b"; // Rojo temporal
        card.style.animation = "shake 0.5s ease";
    });
    
    // Penalización por error (solo visual, no restar puntos)
    movesEl.style.color = "#ff6b6b";
    setTimeout(() => {
        movesEl.style.color = "#ffffff";
    }, 500);
    
    // Ocultar cartas después de un delay
    setTimeout(() => {
        hideCard(firstCard);
        hideCard(secondCard);
        
        // Quitar animación de error
        [firstCard, secondCard].forEach(card => {
            card.style.animation = "";
        });
        
        resetSelection();
    }, 900);
}

function resetSelection() {
    firstCard = null;
    secondCard = null;
    lock = false;
}

// ------------ VERIFICAR SI GANÓ ------------
function checkWin() {
    const matchedCards = document.querySelectorAll(".matched");
    
    if (matchedCards.length === cards.length) {
        // DETENER TEMPORIZADOR INMEDIATAMENTE
        clearInterval(timer);
        gameActive = false;
        
        // Calcular puntuación final
        let finalScore = score;
        let timePenalty = Math.floor(time / 10); // Penalización por tiempo
        finalScore = Math.max(0, finalScore - timePenalty);
        score = finalScore;
        scoreEl.textContent = score;
        
        // Efectos visuales de victoria
        document.querySelectorAll(".card").forEach(card => {
            card.style.animation = "celebrate 1s ease";
        });
        
        timerEl.style.color = "#1DB954";
        timerEl.style.animation = "pulse 1s infinite";
        
        // Mostrar mensaje de victoria después de 1 segundo
        setTimeout(() => {
            showWinMessage();
        }, 1000);
    }
}

function showWinMessage() {
    // Crear overlay de victoria
    const overlay = document.createElement("div");
    overlay.className = "win-overlay";
    overlay.innerHTML = `
        <div class="win-modal">
            <h2>🎉 ¡Felicidades! 🎉</h2>
            <div class="win-stats">
                <p><span>⏱️ Tiempo:</span> ${timerEl.textContent}</p>
                <p><span>🔄 Movimientos:</span> ${moves}</p>
                <p><span>⭐ Puntuación:</span> ${score}</p>
                <p><span>🏆 Eficiencia:</span> ${((cards.length / 2) / moves * 100).toFixed(1)}%</p>
            </div>
            <div class="win-buttons">
                <button class="win-btn play-again">Jugar Otra Vez</button>
                <button class="win-btn close-win">Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Event listeners para botones del modal
    overlay.querySelector(".play-again").addEventListener("click", () => {
        document.body.removeChild(overlay);
        startGame();
    });
    
    overlay.querySelector(".close-win").addEventListener("click", () => {
        document.body.removeChild(overlay);
    });
    
    // Cerrar al hacer click fuera del modal
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// ------------ REINICIAR ------------
resetBtn.addEventListener("click", () => {
    console.log("🔄 Reiniciando juego...");
    startGame();
});

// ------------ ATajOS DE TECLADO ------------
document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
        startGame();
    }
    if (e.key === "Escape") {
        const overlay = document.querySelector(".win-overlay");
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
});

// ------------ EFECTOS DE SONIDO VISUALES ------------
// Estos son efectos puramente visuales que simulan feedback auditivo

// Inicio automático
document.addEventListener("DOMContentLoaded", () => {
    console.log("🎮 Juego de Memoria cargado");
    startGame();
});