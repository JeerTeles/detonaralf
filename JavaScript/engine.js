const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        record: document.querySelector("#record"),  // h2 com id="record"
    },

    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        recordParcial: 0,
    },

    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    }
};

// Função para carregar o record do localStorage
function loadRecordFromLocalStorage() {
    const savedRecord = localStorage.getItem("record");
    if (savedRecord) {
        // Se houver um record salvo, exibe-o na página
        state.view.record.textContent = savedRecord;
    } else {
        // Caso não exista um record salvo, define o valor inicial como 0
        state.view.record.textContent = "000";
    }
}

// Função para salvar o record no localStorage
function saveRecordToLocalStorage() {
    localStorage.setItem("record", state.view.record.textContent);
}

// Função que atualiza o record se um novo record maior for alcançado
function record() {
    // Atualiza o valor de recordParcial
    state.values.recordParcial = state.values.result;

    // Verifica se o recordParcial é maior que o record atual
    const currentRecord = parseInt(state.view.record.textContent);
    if (state.values.recordParcial > currentRecord) {
        // Atualiza o recorde com o novo valor no h2 com id="record"
        state.view.record.textContent = state.values.recordParcial;
        saveRecordToLocalStorage();  // Salva o novo record no localStorage
        playSoundVictory("victory");
    } else{
        playSoundOver("game-over");
    }
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);

        // Chama a função de verificação de recorde
        record();

        alert("Game over! O seu resultado foi: " + state.values.result);
    }
}

function playSound(audiomane) {
    let audio = new Audio(`./audios/${audiomane}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function playSoundOver(audiomane) {
    let audio = new Audio(`./audios/${audiomane}.mp3`);
    audio.volume = 0.2;
    audio.play();
}

function playSoundVictory(audiomane) {
    let audio = new Audio(`./audios/${audiomane}.mp3`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        });
    });
}

// Função para inicializar o jogo
function initialize() {
    loadRecordFromLocalStorage();  // Carrega o record do localStorage
    addListenerHitBox();
}

initialize();
