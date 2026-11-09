# ⏳ Chrono Grove

A cozy time-travel farming and collecting game that runs in the browser. You inherit an overgrown homestead and a magic pocket watch. You farm your land, travel through rifts in time to solve puzzles and recover historical artifacts, and fight each era's guardian in turn-based boss battles.

## How to play

There's no build step and nothing to install. Open `index.html` in any modern browser. Progress saves automatically in your browser's `localStorage`.

## Features

- **Homestead farming:** Till soil, clear rocks and stumps, plant and water six crops, and press End Day to grow them. Weather changes daily, and rain waters every crop for free. Sell your harvest at the Market.
- **Artifact display:** Place the artifacts you recover on your land to switch on their powers: attack, defence, HP, max energy, coins per day, and sprinklers that water the 8 tiles around them each morning.
- **Six eras:** Ancient Egypt, Classical Greece, Medieval Europe, Feudal Japan, Renaissance Italy, and the secret End of Time.
- **Four puzzle types:**
  - 🔍 Hidden objects, timed, with a hint button
  - 🃏 Memory pairs
  - 🧩 Sliding tiles that rebuild a picture of the artifact
  - 🔮 Rune sequences, in the style of Simon
- **Turn-based boss battles:** Each boss shows its next move ahead of time, so you can plan around it. You can Attack, Defend, use Chrono Skills (Temporal Strike, Rewind, Freeze Time) that cost Chrono Points, or use items. Bosses also use:
  - charge-up heavy attacks
  - counter stances
  - shields
  - burn and weaken effects
  - self-healing
  - a tougher second phase at half health
- **Progression:** Earn XP and levels, upgrade your weapon and coat at the Forge, buy potions, unlock new seeds, and fill all 21 slots in the Museum.

## Bosses

| Era | Boss | Signature mechanic |
| --- | --- | --- |
| Ancient Egypt | The Sandstone Sphinx | Charges a riddle, then fires a Sunbeam; Sandstorm weakens you |
| Classical Greece | The Labyrinth Minotaur | Becomes enraged at half health; Labyrinth Charge |
| Medieval Europe | The Iron Dragon | Burn damage over time, Inferno, hardened scale shields |
| Feudal Japan | The Oni Warlord | Counter Stance punishes attacks |
| Renaissance Italy | The Clockwork Colossus | Barriers, Overclock, Solar Lance, self-repair |
| End of Time | The Time Devourer | Uses every mechanic above |

## Code layout

```
chrono-grove/
├── index.html
├── css/style.css
└── js/
    ├── data.js     # crops, artifacts, eras, puzzles, bosses
    ├── state.js    # save/load, derived stats, progression
    ├── farm.js     # homestead grid, tools, day cycle
    ├── puzzles.js  # the four puzzle types
    ├── battle.js   # turn-based combat engine
    └── main.js     # header, tabs, portal, museum, market, help
```
