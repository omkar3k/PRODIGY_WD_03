// scripts.js
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const modeSelection = document.getElementById('mode-selection');
const aiModeButton = document.getElementById('ai-mode');
const pvpModeButton = document.getElementById('pvp-mode');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isPvP = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (gameState[cellIndex] !== '' || !isGameActive()) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.innerHTML = `<span>${currentPlayer}</span>`;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) {
        alert(`Player ${currentPlayer} wins!`);
    } else if (isBoardFull()) {
        alert('Draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (!isPvP && currentPlayer === 'O') {
            makeAiMove();
        }
    }
}

function makeAiMove() {
    const bestMove = getBestMove();
    gameState[bestMove] = 'O';
    cells[bestMove].innerHTML = `<span>O</span>`;
    cells[bestMove].classList.add('o');

    if (checkWinner()) {
        alert('Player O wins!');
    } else if (isBoardFull()) {
        alert('Draw!');
    } else {
        currentPlayer = 'X';
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(newGameState, depth, isMaximizing) {
    const winner = getWinner(newGameState);
    if (winner !== null) {
        return winner === 'O' ? 1 : winner === 'X' ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newGameState.length; i++) {
            if (newGameState[i] === '') {
                newGameState[i] = 'O';
                let score = minimax(newGameState, depth + 1, false);
                newGameState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newGameState.length; i++) {
            if (newGameState[i] === '') {
                newGameState[i] = 'X';
                let score = minimax(newGameState, depth + 1, true);
                newGameState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner(boardState) {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return null;
}

function isGameActive() {
    return getWinner(gameState) === null && !isBoardFull();
}

function checkWinner() {
    return getWinner(gameState) !== null;
}

function isBoardFull() {
    return gameState.every(cell => cell !== '');
}

function restartGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    board.style.display = 'none';
    restartButton.style.display = 'none';
    modeSelection.style.display = 'block';
}

function startGame(pvp) {
    isPvP = pvp;
    modeSelection.style.display = 'none';
    board.style.display = 'grid';
    restartButton.style.display = 'block';
    animateCells();
}

function animateCells() {
    cells.forEach((cell, index) => {
        cell.style.transitionDelay = `${index * 0.1}s`;
        cell.style.opacity = '1';
        cell.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
    });

    setTimeout(() => {
        cells.forEach(cell => {
            cell.style.transition = 'transform 0.5s, opacity 0.5s';
            cell.style.transform = 'translate(0, 0)';
        });
    }, 1000);
}

aiModeButton.addEventListener('click', () => startGame(false));
pvpModeButton.addEventListener('click', () => startGame(true));
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
