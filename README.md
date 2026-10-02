# Memory Gallery

A browser-based memory matching game featuring artwork by Olga Ovchinnikova, built with HTML, CSS, and vanilla JavaScript.

Find all eight pairs in as few moves as possible, explore the artwork, and keep track of your best results.

## Gameplay

- Reveal two different cards to make one move.
- Matching cards stay face up. Different cards turn back after one second.
- Find all eight pairs to finish the game and see your final move count.
- Start a new game at any time with **New Game**.
- Open **Leaderboard** to see the ten best completed games saved on your device.

Each new game shuffles all 16 cards and resets the counters. The leaderboard ranks games by the fewest moves, with earlier games first when scores are equal. Dates use the `DD.MM.YYYY` format.

## Features

- A randomly shuffled 4 × 4 board with eight matching pairs.
- Move and matched-pair counters.
- A victory dialog showing the final move count.
- A top-10 leaderboard stored in `localStorage`.
- Instant restarts without reloading the page.
- A pink gallery interface with an illustrated header and framed artwork cards.

## Tech stack

- **HTML5** — application entry point.
- **CSS3** — layout, styling, and visual states.
- **JavaScript** — game logic, DOM rendering, and browser storage.

The interface is created with `document.createElement`, with a shared modal shell for the victory and leaderboard dialogs. No UI or game frameworks are used.

## Run locally

Open `index.html` in your browser.

## Design

The design uses an illustrated header, pink marble surfaces, floral ornamentation and framed artwork cards. Typography: **Cormorant Garamond**, Regular 400 and Medium 500.

## Artwork and credits

Artwork: **Olga Ovchinnikova** — [ovchinnikova.art](https://ovchinnikova.art/).

## Data

Leaderboard results are stored locally in the current browser. Clearing site data removes them.
