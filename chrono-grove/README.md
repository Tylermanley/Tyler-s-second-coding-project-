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
- **Turn-based card battles:** Battle cards are your main weapon. Each turn you draw 5 cards and spend 3 Chrono Points to play attacks, blocks and skills, such as burn, weaken, expose, freeze time and shield-breakers. Each boss shows its next move ahead of time, so you can plan around it. Bosses also use:
  - charge-up heavy attacks
  - counter stances
  - shields
  - burn and weaken effects
  - self-healing
  - a tougher second phase at half health
- **Companions and romance:**
  - **Anna, the librarian.** Your satchel holds 10 items, and anything that won't fit goes into Anna's archive. She keeps notes on every guardian. As your battle support she reads the boss's next move and gives live advice every turn. With more hearts she unlocks a healing Remedy, extra satchel pockets and a protective ward.
  - **Cedric, the merchant and ship captain.** He forges a battle card for every puzzle you solve and every boss you defeat, and he sells rare cards on his ship. You build your deck there. As your battle support he deals you an extra card each turn, and later his ship fires a cannon Broadside.
  - **Romance.** Talk to them daily, give gifts (each has favourite crops) and fight side by side to earn hearts. Heart-event scenes unlock at 2, 4, 6 and 8♥. At 8♥, give a Chrono Locket to become partners. Your partner moves into the homestead, brings a daily gift and gives you a special card.
- **Anime-style characters:** Animated SVG portraits blink, breathe, sway and lip-flap while talking. They have expressions with blushes, emotes and sparkles. Conversations play as visual-novel scenes with a typewriter effect and speed lines, and big moves in battle trigger special-move cut-ins.
- **Progression:** Earn XP and levels, upgrade your weapon and coat at the Forge, buy potions, unlock new seeds, and fill all 21 slots in the Museum, and collect all 31 battle cards.

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
    ├── data.js       # crops, artifacts, eras, puzzles, bosses
    ├── cards.js      # battle cards, Cedric's shop, Anna's guardian notes
    ├── state.js      # save/load, satchel/archive, hearts, progression
    ├── portraits.js  # animated anime-style SVG character portraits
    ├── puzzles.js    # the four puzzle types
    ├── battle.js     # turn-based card combat engine and cut-ins
    ├── companions.js # Anna and Cedric: dialogue scenes, romance, library, ship
    ├── farm.js       # homestead grid, tools, day cycle
    └── main.js     # header, tabs, portal, museum, market, help
```
