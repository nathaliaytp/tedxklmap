document.addEventListener("DOMContentLoaded", () => {

    // --- ACTION: PASTE YOUR GOOGLE APPS SCRIPT URL HERE ---
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/youthopia.co/s/AKfycbwfNClVlpbNF_rwUDg3hru4P_jCYdE08s4XDN1MN6IIyhf6e1XYUcqmGftqtlIO9_Cx/exec';
    // --------------------------------------------------------

    // --- Global State ---
    const TOTAL_STAMPS = 11;
    const MAX_ENERGY = 100;
    const energyStorageKey = 'tedxKLEnergy';
    const stampStorageKey = 'tedxKLStamps';
    const luckyDrawKey = 'tedxKLLuckyDrawEntered'; // New
    const ULTIMATE_THEME_ANSWER = 'CONFLUENCE';

    let currentEnergy = parseInt(localStorage.getItem(energyStorageKey) || MAX_ENERGY);
    let collectedStamps = JSON.parse(localStorage.getItem(stampStorageKey)) || {};
    let luckyDrawEntered = localStorage.getItem(luckyDrawKey) === 'true'; // New

    // --- Element Selection ---
    const uiBar = document.getElementById('ui-bar');
    const stampCounter = document.getElementById('stamp-counter');
    const energyBar = document.getElementById('energy-bar');
    const messagePopup = document.getElementById('message-popup');
    const energyAnimationEl = document.getElementById('energy-animation');
    const stampAnimationEl = document.getElementById('stamp-animation');

    const luckyDrawModal = document.getElementById('modal-lucky-draw'); // New
    const finalRewardModal = document.getElementById('modal-final-reward'); // New

    const profileButton = document.getElementById('profile-button');
    const profileModal = document.getElementById('modal-profile');
    const fnbModal = document.getElementById('modal-fnb-zone');
    const rewardButton = document.getElementById('reward-button');

    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const instructionsModal = document.getElementById('modal-instructions');
    const mapContainer = document.getElementById('map-container');
    const experienceShell = document.getElementById('experience-shell');

    const hotspots = document.querySelectorAll(".hotspot");
    const modals = document.querySelectorAll(".modal");
    const checkinButtons = document.querySelectorAll(".checkin-btn");

    // --- Core Functions ---
    function saveGameData() {
        localStorage.setItem(stampStorageKey, JSON.stringify(collectedStamps));
        localStorage.setItem(energyStorageKey, currentEnergy);
        localStorage.setItem(luckyDrawKey, luckyDrawEntered); // New
    }

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    function updateStampCounter() {
        const count = Object.keys(collectedStamps).length;
        stampCounter.textContent = `Stamps: ${count} / ${TOTAL_STAMPS}`;
    }

    // --- Energy System ---
    function updateEnergyBar() {
        const percentage = (currentEnergy / MAX_ENERGY) * 100;
        energyBar.style.width = `${Math.max(0, percentage)}%`;
    }

    function showEnergyAnimation() {
        energyAnimationEl.classList.add('show');
        setTimeout(() => energyAnimationEl.classList.remove('show'), 1200);
    }

    function showModalMessage(message) {
        messagePopup.textContent = message;
        messagePopup.classList.add('show');
        messagePopup.classList.add('shake');
        setTimeout(() => {
            messagePopup.classList.remove('show');
            messagePopup.classList.remove('shake');
        }, 2500);
    }

    function changeEnergy(amount) {
        currentEnergy += amount;
        if (currentEnergy > MAX_ENERGY) currentEnergy = MAX_ENERGY;
        if (currentEnergy < 0) currentEnergy = 0;

        if (amount > 0) showEnergyAnimation();

        updateEnergyBar();
        saveGameData();
        return true;
    }

    function hasEnoughEnergy(cost) {
        if (currentEnergy >= cost) {
            return true;
        }
        showModalMessage("Not enough energy! Visit the 🥤 F&B Zone to recharge.");
        return false;
    }

    // --- Stamp System ---
    function showStampAnimation() {
        stampAnimationEl.classList.add('show');
        setTimeout(() => stampAnimationEl.classList.remove('show'), 1200);
    }

    function checkCompletion() {
        const collectedCount = Object.keys(collectedStamps).length;
        if (collectedCount === TOTAL_STAMPS && !luckyDrawEntered) {
            setTimeout(() => {
                luckyDrawModal.classList.add('show'); // Show lucky draw form
                rewardButton.style.display = 'flex';
            }, 1500);
        }
    }

    function checkCompletionOnLoad() {
        const collectedCount = Object.keys(collectedStamps).length;
        if (collectedCount === TOTAL_STAMPS) {
            rewardButton.style.display = 'flex';
        }
    }

    function collectStamp(stationId, modalToClose) {
        if (collectedStamps[stationId]) return;
        collectedStamps[stationId] = true;

        const hotspot = document.getElementById(stationId);
        if (hotspot) {
            hotspot.classList.add("collected");
        }

        const button = document.querySelector(`.checkin-btn[data-station-id="${stationId}"]`);
        if (button) {
            button.textContent = "Checked-in!";
            button.disabled = true;
        }

        updateStampCounter();
        showStampAnimation();
        checkCompletion();
        saveGameData();

        if (modalToClose) {
            setTimeout(() => {
                modalToClose.classList.remove('show');
            }, 1300);
        }
    }

    // --- Initial Page Load ---
    function updateUIOnLoad() {
        hotspots.forEach(hotspot => {
            const stationId = hotspot.id;
            if (collectedStamps[stationId]) {
                hotspot.classList.add("collected");
                const button = document.querySelector(`.checkin-btn[data-station-id="${stationId}"]`);
                if (button) {
                    button.textContent = "Checked-in!";
                    button.disabled = true;
                }
            }
        });
        updateStampCounter();
        updateEnergyBar();
        checkCompletionOnLoad();
    }

    // --- Start & Instructions ---
    startButton.addEventListener('click', () => {
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.style.display = 'none';
            uiBar.style.display = 'flex';
            mapContainer.classList.add('show');
            if (experienceShell) {
                experienceShell.classList.add('active');
            }
        }, 500);
    });

    instructionsModal.querySelector('.close-button').addEventListener('click', () => {
        instructionsModal.classList.remove('show');
    });

    // --- Modal Open/Close ---
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("show")
            });
        }
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
            }
        });
    });

    // --- Profile Modal ---
    profileButton.addEventListener('click', () => {
        profileModal.classList.add('show');
    });

    // --- Reward Button (New Logic) ---
    rewardButton.addEventListener('click', () => {
        if (luckyDrawEntered) {
            finalRewardModal.classList.add('show');
        } else {
            luckyDrawModal.classList.add('show');
        }
    });

    // --- Hotspot Click ---
    hotspots.forEach(hotspot => {
        hotspot.addEventListener("click", () => {
            const modalId = hotspot.dataset.modal;
            if (!modalId) return;
            openModal(modalId);
        });
    });

    // --- Info Check-in Logic ---
    checkinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const stationId = button.dataset.stationId;
            const cost = parseInt(button.dataset.cost || 0);
            if (collectedStamps[stationId]) return;
            if (hasEnoughEnergy(cost)) {
                changeEnergy(-cost);
                collectStamp(stationId, button.closest('.modal'));
            }
        });
    });

    // --- F&B Zone Logic ---
    fnbModal.querySelectorAll('.fnb-btn').forEach(button => {
        button.addEventListener('click', () => {
            const energyGain = parseInt(button.dataset.energy);
            changeEnergy(energyGain);
            if (!collectedStamps['fnb-zone']) {
                collectStamp('fnb-zone', fnbModal);
            } else {
                setTimeout(() => fnbModal.classList.remove('show'), 500);
            }
        });
    });

    // --- Game 1: Hangman ---
    const hangmanWordEl = document.getElementById('hangman-word');
    const hangmanKeyboardEl = document.getElementById('hangman-keyboard');
    const hangmanGuessesEl = document.getElementById('hangman-guesses');
    const hangmanFeedbackEl = document.getElementById('hangman-feedback');
    const hangmanResetBtn = document.getElementById('hangman-reset-btn');
    const HANGMAN_WORD = "IDEAS";
    const HANGMAN_COST = 20;
    const RESET_COST = 5;
    let guessedLetters = [];
    let guessesLeft = 6;
    let hangmanWordState = [];

    function initHangman(isReset = false) {
        guessedLetters = [];
        guessesLeft = 6;
        hangmanWordState = HANGMAN_WORD.split('').map(() => '_');
        hangmanGuessesEl.textContent = `Guesses Left: ${guessesLeft}`;
        hangmanWordEl.textContent = hangmanWordState.join('');
        hangmanKeyboardEl.innerHTML = '';
        hangmanResetBtn.style.display = 'none';

        if (collectedStamps['game-hangman']) {
            hangmanFeedbackEl.textContent = 'Challenge complete!';
            hangmanWordEl.textContent = HANGMAN_WORD;
            return;
        }

        if (isReset) {
            hangmanFeedbackEl.textContent = `Try again! Costs ${HANGMAN_COST} Energy.`;
        } else {
            hangmanFeedbackEl.textContent = `Costs ${HANGMAN_COST} Energy to play.`;
        }

        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.addEventListener('click', () => handleGuess(letter, btn));
            hangmanKeyboardEl.appendChild(btn);
        });
    }
    function handleGuess(letter, btn) {
        if (guessesLeft <= 0 || collectedStamps['game-hangman']) return;
        if (guessedLetters.length === 0) {
            if (!hasEnoughEnergy(HANGMAN_COST)) return;
            changeEnergy(-HANGMAN_COST);
            hangmanFeedbackEl.textContent = '';
        }
        btn.disabled = true;
        guessedLetters.push(letter);
        if (HANGMAN_WORD.includes(letter)) {
            hangmanWordState = HANGMAN_WORD.split('').map(char => guessedLetters.includes(char) ? char : '_');
            hangmanWordEl.textContent = hangmanWordState.join('');
            if (!hangmanWordState.includes('_')) {
                hangmanFeedbackEl.textContent = 'Correct! Stamp collected!';
                guessesLeft = -1;
                collectStamp('game-hangman', document.getElementById('modal-game-hangman'));
            }
        } else {
            guessesLeft--;
            hangmanGuessesEl.textContent = `Guesses Left: ${guessesLeft}`;
            if (guessesLeft === 0) {
                hangmanFeedbackEl.textContent = `Game over! The word was: ${HANGMAN_WORD}`;
                hangmanResetBtn.style.display = 'block';
            }
        }
    }
    hangmanResetBtn.addEventListener('click', () => {
        if (hasEnoughEnergy(RESET_COST)) {
            changeEnergy(-RESET_COST);
            initHangman(true);
        }
    });
    new MutationObserver((m) => {
        if (m[0].target.classList.contains('show')) initHangman(false);
    }).observe(document.getElementById('modal-game-hangman'), { attributes: true });


    // --- Game 2: Chess ---
    const chessBoardEl = document.getElementById('chess-board');
    const chessFeedbackEl = document.getElementById('chess-feedback');
    const CHESS_COST = 20;
    const CHESS_PUZZLE = {
        pieces: [
            { piece: '&#9818;', color: 'black', pos: 'g8' }, { piece: '&#9823;', color: 'black', pos: 'f7' },
            { piece: '&#9823;', color: 'black', pos: 'g6' }, { piece: '&#9823;', color: 'black', pos: 'h7' },
            { piece: '&#9812;', color: 'white', pos: 'g7' }, { piece: '&#9814;', color: 'white', pos: 'a7', id: 'white-rook' }
        ],
        solution: { pieceId: 'white-rook', to: 'a8' }
    };
    function initChess() {
        chessBoardEl.innerHTML = '';
        let firstMove = true;

        if (collectedStamps['game-chess']) {
            chessFeedbackEl.textContent = 'Puzzle solved!';
        } else {
            chessFeedbackEl.textContent = `Costs ${CHESS_COST} Energy to play.`;
        }

        let draggedPiece = null;
        for (let r = 8; r >= 1; r--) {
            for (let c = 0; c < 8; c++) {
                const sqId = 'abcdefgh'[c] + r;
                const sq = document.createElement('div');
                sq.className = `square ${(r + c) % 2 === 0 ? 'dark' : 'light'}`;
                sq.dataset.id = sqId;
                sq.addEventListener('dragover', (e) => e.preventDefault());
                sq.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (collectedStamps['game-chess'] || !draggedPiece) return;
                    if (firstMove) {
                        if (!hasEnoughEnergy(CHESS_COST)) { draggedPiece = null; return; }
                        changeEnergy(-CHESS_COST);
                        firstMove = false;
                    }
                    if (draggedPiece.id === CHESS_PUZZLE.solution.pieceId && sq.dataset.id === CHESS_PUZZLE.solution.to) {
                        sq.appendChild(draggedPiece);
                        draggedPiece.style.cursor = 'default';
                        draggedPiece.draggable = false;
                        chessFeedbackEl.textContent = 'Checkmate! Stamp collected!';
                        collectStamp('game-chess', document.getElementById('modal-game-chess'));
                    } else {
                        chessFeedbackEl.textContent = 'Not quite! Try again.';
                        draggedPiece.draggable = true;
                    }
                    draggedPiece = null;
                });
                if (sqId === CHESS_PUZZLE.solution.to) sq.classList.add('valid-move');
                chessBoardEl.appendChild(sq);
            }
        }
        CHESS_PUZZLE.pieces.forEach(p => {
            const pieceEl = document.createElement('div');
            pieceEl.className = 'piece';
            pieceEl.innerHTML = p.piece;
            pieceEl.style.color = p.color;
            if (p.id) pieceEl.id = p.id;
            if (p.id === CHESS_PUZZLE.solution.pieceId && !collectedStamps['game-chess']) {
                pieceEl.draggable = true;
                pieceEl.addEventListener('dragstart', (e) => {
                    draggedPiece = pieceEl;
                });
                pieceEl.addEventListener('dragend', () => {
                    draggedPiece = null;
                });
            }
            chessBoardEl.querySelector(`.square[data-id="${p.pos}"]`).appendChild(pieceEl);
        });
    }
    new MutationObserver((m) => {
        if (m[0].target.classList.contains('show')) initChess();
    }).observe(document.getElementById('modal-game-chess'), { attributes: true });


    // --- Game 3: Riddle ---
    const riddleInput = document.getElementById('riddle-input');
    const riddleSubmit = document.getElementById('riddle-submit');
    const riddleFeedback = document.getElementById('riddle-feedback');
    const riddleHintBtn = document.getElementById('riddle-hint-btn');
    const riddleHintEl = document.getElementById('riddle-hint');
    const riddleResetBtn = document.getElementById('riddle-reset-btn');
    const RIDDLE_ANSWER = 'MAP';
    const RIDDLE_COST = 20;
    let riddleFirstTry = true;

    function initRiddle() {
        riddleFirstTry = true;
        riddleInput.value = '';
        riddleHintEl.style.display = 'none';
        riddleResetBtn.style.display = 'none';

        if (collectedStamps['game-riddle']) {
            riddleFeedback.textContent = 'Riddle solved!';
            riddleInput.value = RIDDLE_ANSWER;
            riddleSubmit.style.display = 'none';
            riddleHintBtn.style.display = 'none';
            riddleInput.disabled = true;
        } else {
            riddleFeedback.textContent = `Costs ${RIDDLE_COST} Energy to submit.`;
            riddleSubmit.style.display = 'block';
            riddleHintBtn.style.display = 'block';
            riddleInput.disabled = false;
        }
    }

    riddleHintBtn.addEventListener('click', () => {
        riddleHintEl.style.display = 'block';
    });

    riddleSubmit.addEventListener('click', () => {
        if (collectedStamps['game-riddle']) return;

        if (riddleFirstTry) {
            if (!hasEnoughEnergy(RIDDLE_COST)) return;
            changeEnergy(-RIDDLE_COST);
            riddleFirstTry = false;
        }

        const answer = riddleInput.value.toUpperCase();
        if (answer.includes(RIDDLE_ANSWER)) {
            riddleFeedback.textContent = 'You got it! A Map. Stamp collected!';
            riddleSubmit.style.display = 'none';
            riddleHintBtn.style.display = 'none';
            riddleInput.disabled = true;
            collectStamp('game-riddle', document.getElementById('modal-game-riddle'));
        } else {
            riddleFeedback.textContent = 'Incorrect. Give it another thought!';
            riddleResetBtn.style.display = 'block';
            riddleSubmit.style.display = 'none';
        }
    });

    riddleResetBtn.addEventListener('click', () => {
        if (hasEnoughEnergy(RESET_COST)) {
            changeEnergy(-RESET_COST);
            initRiddle();
        }
    });

    new MutationObserver((m) => {
        if (m[0].target.classList.contains('show')) initRiddle();
    }).observe(document.getElementById('modal-game-riddle'), { attributes: true });


    // --- NEW: Lucky Draw Submission ---
    const luckyDrawSubmitBtn = document.getElementById('lucky-draw-submit');
    const luckyDrawFeedback = document.getElementById('lucky-draw-feedback');

    luckyDrawSubmitBtn.addEventListener('click', () => {
        if (!GOOGLE_SCRIPT_URL) {
            luckyDrawFeedback.textContent = 'Error: App is not configured. Missing Google Script URL.';
            return;
        }

                const name = document.getElementById('lucky-draw-name').value.trim();
                const email = document.getElementById('lucky-draw-email').value.trim();
                const answer = document.getElementById('lucky-draw-answer').value.trim();
                const normalizedAnswer = answer.toUpperCase();
                const isCorrect = normalizedAnswer === ULTIMATE_THEME_ANSWER;

        if (!name || !email || !answer) {
            luckyDrawFeedback.textContent = 'Please fill out all fields.';
            return;
        }

        luckyDrawSubmitBtn.disabled = true;
        luckyDrawSubmitBtn.textContent = 'Submitting...';

                const payload = new URLSearchParams({
                    name,
                    email,
                    answer,
                    normalizedAnswer,
                    answerStatus: isCorrect ? 'correct' : 'wrong',
                    correctAnswer: ULTIMATE_THEME_ANSWER
                });

        const parseAppsScriptResponse = async (response) => {
            const contentType = response.headers.get('content-type') || '';
            let data;
            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    data = { status: response.ok ? 'success' : 'error', message: text.trim() };
                }
            }
            if (!response.ok) {
                throw new Error(data.message || 'Apps Script rejected the submission.');
            }
            return data;
        };

                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    body: payload.toString()
                })
                    .then(parseAppsScriptResponse)
                    .then(data => {
                        const serverStatus = data?.status || 'success';
                        const recordedAsCorrect = serverStatus !== 'wrong_answer' && isCorrect;

                        luckyDrawEntered = true;
                        saveGameData();

                        if (recordedAsCorrect) {
                            luckyDrawFeedback.textContent = 'Answer correct! You are in the lucky draw.';
                        } else {
                            luckyDrawFeedback.textContent = `Thanks for playing! The official theme is ${ULTIMATE_THEME_ANSWER}. You're still entered.`;
                        }

                        setTimeout(() => {
                            luckyDrawModal.classList.remove('show');
                            finalRewardModal.classList.add('show');
                        }, 1400);
                    })
                    .catch(error => {
                        luckyDrawFeedback.textContent = `Submission failed: ${error.message || 'Please try again.'}`;
            })
            .finally(() => {
                luckyDrawSubmitBtn.disabled = false;
                luckyDrawSubmitBtn.textContent = 'Submit to Lucky Draw';
            });
    });

    // --- Completion & Screenshot ---
    document.getElementById('screenshot-btn').addEventListener('click', () => {
        const rewardModal = finalRewardModal.querySelector('.modal-content');
        html2canvas(rewardModal).then(canvas => {
            const link = document.createElement('a');
            link.download = 'TEDxKL_Reward.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // --- Run on load ---
    updateUIOnLoad();

});
