# ⏳ Chrono Grove

A cozy time-travel farming and collecting game that runs in the browser. You inherit an overgrown homestead and a magic pocket watch. You farm your land, travel through rifts in time to solve puzzles and recover historical artifacts, and fight each era's guardian in turn-based boss battles.

## How to play

There's no build step and nothing to install. Open `index.html` in any modern browser. Progress saves automatically in your browser's `localStorage`.

## Features

- **Homestead farming:** Till soil, clear rocks and stumps, plant and water six crops, and press End Day to grow them. Weather changes daily, and rain waters every crop for free. Sell your harvest at the Market.
- **Artifact display:** Place the artifacts you recover on your land to switch on their powers: attack, defence, HP, max energy, coins per day, and sprinklers that water the 8 tiles around them each morning.
- **Ten eras plus a finale:** Ancient Egypt, Classical Greece, Medieval Europe, Feudal Japan, Renaissance Italy, Viking Scandinavia, Tang Dynasty China, the Aztec Empire, Ancient Mesopotamia and the secret End of Time, followed by the two-part villain finale.
- **Seven puzzle types:**
  - 🔍 Hidden objects, timed, with a hint button
  - 🃏 Memory pairs
  - 🧩 Sliding tiles that rebuild a picture of the artifact
  - 🔮 Rune sequences, in the style of Simon
  - ♟️ Checkmate-in-one chess problems. Each of the 40 positions was generated and checked with python-chess to make sure it has exactly one mating move.
  - 🧠 Memory Palace: memorise where objects sit on a grid, then recall each location.
  - 🍽️ Banquet Table: seat the guests so every clue is true. The puzzles are generated randomly and always have exactly one solution.
- **Seasons and festivals:** Each season lasts 10 days (spring, summer, autumn and winter), and each crop has its own planting seasons. Winter brings snow, and the farm changes colour with the season. On day 7 of every season there's a festival:
  - Anna's **Blossom & Book Fair**: choose a stall.
  - Cedric's **Regatta**: a rowing timing race against Peter and a mysterious old captain.
  - Lady Alice's **Harvest Gala**: a crop-judging contest.
  - Minister Quinn's **Treasury Auction**: outbid Peter Winters.
  - Winning earns festival keepsake artifacts.
- **Anna's Adventure Journal:** 23 achievements, each paying coins, and many unlocking a title you can show in the top bar.
- **Sound and music:** Sound effects and chiptune music (farm, winter, battle and festival tracks) are generated on the fly with the Web Audio API, so there are no audio files. Characters make little voice blips while they talk, like in a visual novel. Toggle sound and music with 🔊 and 🎵.
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
- **Mentors:**
  - **Lady Alice**, Duchess of Bluewater, is an aristocrat in a sapphire gown. She gives daily lessons for XP and runs a Masterclass that upgrades cards by up to 50%. As support she reduces the damage you take, and her Royal Decree makes a boss lose its next action, its shield and its power-ups. She was Peter's tutor.
  - **Minister Quinn**, of the Royal Treasury, has a monocle and a coin pin. He runs a bank that pays interest every morning and three risk/reward trade ventures, and he gives 10% discounts. As support he adds +50% battle coins and can pay 🪙100 for a mercenary strike. He posts a bounty on Lady Jane.
  - Mentors earn ★ rapport through talks, gifts and battles, with new perks and story scenes at each level.
- **Final villains:** Peter Winters is a smug, platinum-blond dark-academia scholar with wire glasses, a tweed blazer and ice magic, who collects other people's history. Lady Jane is a silver-haired former Pirate Queen with an eye patch, and she was Cedric's old captain. Both appear in earlier story scenes. After you defeat the Time Devourer, they pull off a heist: Peter steals the Hourglass and several displayed artifacts, and Jane steals Cedric's ship, the Gilded Gull. That closes his shop and silences his cannons. Get everything back in two final boss battles:
  - **Peter:** his Pickpocket steals cards from your deck mid-fight.
  - **Jane:** her Plunder turns your Block into her shield.
- **Anime-style characters:** Animated SVG portraits blink, breathe, sway and lip-flap while talking. They have expressions with blushes, emotes and sparkles. Conversations play as visual-novel scenes with a typewriter effect and speed lines, and big moves in battle trigger special-move cut-ins.
- **Progression:** Earn XP and levels, upgrade your weapon and coat at the Forge, buy potions, unlock new seeds, fill all 43 Museum slots and collect all 49 battle cards.

## Bosses

| Era | Boss | Signature mechanic |
| --- | --- | --- |
| Ancient Egypt | The Sandstone Sphinx | Charges a riddle, then fires a Sunbeam; Sandstorm weakens you |
| Classical Greece | The Labyrinth Minotaur | Becomes enraged at half health; Labyrinth Charge |
| Medieval Europe | The Iron Dragon | Burn damage over time, Inferno, hardened scale shields |
| Feudal Japan | The Oni Warlord | Counter Stance punishes attacks |
| Renaissance Italy | The Clockwork Colossus | Barriers, Overclock, Solar Lance, self-repair |
| Viking Scandinavia | Fenrir, the Great Wolf | Four-bite Pack Fury, Moon Howl rage, Ragnarök Lunge |
| Tang Dynasty China | The Stone Monkey King | Cloud Somersault counters, Hair Clones (5 hits), steals peaches to heal |
| Aztec Empire | Quetzalcoatl, the Feathered Serpent | Jade Venom burn, Serpent Coil counters, Solar Eclipse |
| Ancient Mesopotamia | The Bull of Heaven | Celestial Hide shields, Ishtar's Fury, Heaven's Thunder (hits and burns) |
| End of Time | The Time Devourer | Uses every mechanic above |
| Winters Manor | Peter Winters | Pickpocket steals cards from your deck; Smug Riposte counters; Glacial Lance |
| The Stolen Gull | Lady Jane, the Pirate Queen | Plunder steals your Block as her shield; Kraken's Embrace; Black Flag rage |

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
    ├── villains.js   # Peter Winters and Lady Jane: story scenes, heist, finale
    ├── mentors.js    # Lady Alice's salon and Minister Quinn's treasury
    ├── festivals.js  # seasonal festivals and their mini-games
    ├── journal.js    # Anna's Adventure Journal (achievements and titles)
    ├── sound.js      # procedural Web Audio sound effects and music
    ├── chesspuzzles.js # verified checkmate-in-one positions
    ├── farm.js       # homestead grid, tools, day cycle
    └── main.js     # header, tabs, portal, museum, market, help
```
