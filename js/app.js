function createElement(tag, attributes = {}, text) {
    const element = document.createElement(tag);

    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function createButton(text, attributes = {}) {
    return createElement(
        "button",
        {
            class: "button",
            type: "button",
            ...attributes,
        },
        text,
    );
}

const app = createElement("main", { class: "app" });
const header = createElement("header", { class: "app-header" });
const headerContent = createElement("div", { class: "header-content" });

const title = createElement("h1", { class: "app-title" });

title.append(
    createElement("span", {}, "Memory"),
    createElement("span", {}, "Gallery"),
);

const headerActions = createElement("div", {
    class: "header-actions",
});

headerActions.append(
    createButton("New Game", { id: "new-game" }),
    createButton("Leaderboard", {
        class: "button button--secondary",
        id: "leaderboard-button",
    }),
);

headerContent.append(title, headerActions);


const stats = createElement("div", {
    class: "stats",
    "aria-live": "polite",
});

stats.append(
    createElement("p", { id: "moves-counter" }, "Moves: 0"),
    createElement("img", {
        src: "assets/images/star.svg",
        class: "stats-separator",
        "aria-hidden": "true",
        alt: "",
    }),
    createElement("p", { id: "pairs-counter" }, "Pairs: 0 / 8"),
);

header.append(headerContent, stats);

const board = createElement("section", {
    class: "board",
    "aria-label": "Memory game cards",
});

app.append(header, board);

function createModal({ id, view, titleId, title, closeLabel }) {
    const dialog = createElement("dialog", {
        class: "modal",
        id,
        "data-view": view,
        "aria-labelledby": titleId,
    });

    const form = createElement("form", {
        class: "modal-inner",
        method: "dialog",
    });

    form.append(
        createButton("×", {
            class: "modal-close",
            type: "submit",
            "aria-label": closeLabel,
        }),
        createElement("h2", {
            class: "modal-title",
            id: titleId,
        }, title),
        createElement("div", {
            class: "ornament",
            "aria-hidden": "true",
        }, "✦"),
    );

    dialog.append(form);

    return { dialog, form };
}

const leaderboardModal = createModal({
    id: "leaderboard-modal",
    view: "leaderboard",
    titleId: "leaderboard-title",
    title: "Leaderboard",
    closeLabel: "Close leaderboard",
});

const leaderboardTable = createElement("table", {
    class: "leaderboard",
    hidden: "",
});

const tableHead = createElement("thead");
const headingRow = createElement("tr");

for (const heading of ["#", "Moves", "Date"]) {
    headingRow.append(
        createElement("th", { scope: "col" }, heading),
    );
}

tableHead.append(headingRow);

leaderboardTable.append(
    tableHead,
    createElement("tbody", { id: "leaderboard-results" }),
);

const leaderboardActions = createElement("div", {
    class: "modal-actions",
});

leaderboardActions.append(
    createButton("Close", { type: "submit" }),
);

leaderboardModal.form.append(
    createElement("p", {
        class: "empty-state",
    }, "No results yet."),
    leaderboardTable,
    leaderboardActions,
);

const victoryModal = createModal({
    id: "victory-modal",
    view: "victory",
    titleId: "victory-title",
    title: "You Won!",
    closeLabel: "Close victory dialog",
});

const finalMoves = createElement(
    "p",
    { class: "modal-message" },
    "Total moves: ",
);

finalMoves.append(
    createElement("span", { id: "final-moves" }, "0"),
);

const victoryActions = createElement("div", {
    class: "modal-actions",
});

victoryActions.append(
    createButton("New Game", { id: "victory-new-game" }),
    createButton("Close", {
        class: "button button--secondary",
        type: "submit",
    }),
);

victoryModal.form.append(
    createElement("p", {
        class: "modal-message",
    }, "All 8 pairs found."),
    finalMoves,
    victoryActions,
);

document.body.append(
    app,
    leaderboardModal.dialog,
    victoryModal.dialog,
);

function setCards() {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    const shuffledCards = shuffle(cards);
    board.textContent = "";
    shuffledCards.forEach((cardNumber, index) => {
        const card = createElement("button", {
            class: "card",
            type: "button",
            "data-image": `${index + 1}`,
            "aria-label": `Reveal card ${index + 1}`,
        });

        card.append(
            createElement("img", {
                class: "card__back",
                src: "./assets/images/card%20back.jpg",
                alt: "",
                draggable: "false",
            }),
            createElement("img", {
                class: "card__front",
                src: `./assets/images/${cardNumber}.jpg`,
                alt: "",
                draggable: "false",
            }),
        );

        board.append(card);
    })
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const leaderBoardButton = document.getElementById("leaderboard-button");
leaderBoardButton.addEventListener("click", () => {
    setLeaderboard();
    leaderboardModal.dialog.showModal();
});

const movesCounterElement = document.getElementById("moves-counter");
const pairsCounterElement = document.getElementById("pairs-counter");

let movesCounter = 0;
let pairsCounter = 0;
let currentPairs = [];

resetGame();

function resetGame() {
    setCards();
    currentPairs = [];
    movesCounter = 0;
    pairsCounter = 0;
    updateCounters();
}

function updateCounters() {
    movesCounterElement.textContent = `Moves: ${movesCounter}`;
    pairsCounterElement.textContent = `Pairs: ${pairsCounter} / 8`;
}

board.addEventListener('click', (event) => {
    const card = event.target;
    if(!card.classList.contains('card')) return;
    if(!card.classList.contains('is-open') && !card.classList.contains('disabled') && currentPairs.length < 2) {
        currentPairs.push(card);
        card.classList.add('is-open');
        if(currentPairs.length === 2) {
            disableCards();
            checkPairs();
            movesCounter++;
            updateCounters();
        }
    }
})

function checkPairs() {
    if(currentPairs.length === 2) {
        if(currentPairs[0].querySelector('.card__front').src === currentPairs[1].querySelector('.card__front').src) {
            pairsCounter++;
            currentPairs = [];
            updateCounters();
            enableCards();
            if(pairsCounter === 8) {
                addWinner();
            }
        } else {
            setTimeout(async () => {
                const pairToClose = currentPairs;
                pairToClose.forEach(card => {
                    card.classList.remove('is-open');
                });
                const animations = pairToClose.flatMap(card =>
                    card.getAnimations({ subtree: true })
                );
                await Promise.allSettled(
                    animations.map(animation => animation.finished)
                );
                if (currentPairs !== pairToClose) return;

                currentPairs = [];
                enableCards();
            }, 820);
        }
    }
}

function disableCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('disabled');
    })
}

function enableCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('disabled');
    })
}

function addWinner() {
    victoryModal.form.querySelector('#final-moves').textContent = movesCounter;
    victoryModal.dialog.showModal();
    let winners = [];
    if(localStorage.getItem("winners")) {
        winners = JSON.parse(localStorage.getItem("winners"));
    }
    winners.push({moves: movesCounter, date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })});
    winners.sort((a, b) => {
        if(a.moves === b.moves) {
            const parseDate = (str) => {
                const [day, month, year] = str.split('.').map(Number);
                return new Date(year, month - 1, day).getTime();
            };
            return parseDate(a.date) - parseDate(b.date);
        }
        return a.moves - b.moves});
    if(winners.length > 10) {
        winners.pop();
    }
    localStorage.setItem("winners", JSON.stringify(winners));
}

function setLeaderboard() {
    const modal = leaderboardModal.dialog ?? leaderboardModal;

    const leaderboardResults = modal.querySelector('#leaderboard-results');
    const emptyState = modal.querySelector('.empty-state');
    const leaderboardTable = modal.querySelector('.leaderboard');

    const winners = JSON.parse(localStorage.getItem('winners')) ?? [];

    leaderboardResults.textContent = '';
    emptyState.hidden = winners.length > 0;
    leaderboardTable.hidden = winners.length === 0;

    winners.forEach((winner, index) => {
        if(index > 9) return;
        const row = createElement('tr');

        row.append(
            createElement('td', {}, index + 1),
            createElement('td', {}, winner.moves),
            createElement('td', {}, winner.date),
        );

        leaderboardResults.append(row);
    });
}

const newGameButton = document.getElementById('new-game');
const victoryNewGameButton = document.getElementById('victory-new-game');

newGameButton.addEventListener('click', resetGame);
victoryNewGameButton.addEventListener('click', resetGame);




