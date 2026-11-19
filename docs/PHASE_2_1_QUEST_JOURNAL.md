# Phase 2.1 — Quest Journal & Player Progression
**Date:** 2026-11-19  
**Branch:** `feature/mayflower-sanctuary-full-upgrade`  
**Status:** Quest catalogue contract, journal interface and browser-local progression prototype implemented; browser QA and authored quest content remain pending.

## What was added
- Dedicated `quests.html` Quest Journal, linked from the homepage, Command Deck and shared navigation.
- Category filters for main story, side story, character quests, exploration and collection.
- Search across quest titles, summaries, linked characters and linked locations.
- Progress filters for available, in-progress and completed quests.
- Quest cards that support starting and abandoning quests, objective check-off, automatic completion when all objectives are checked, and reward summaries when defined.
- Local progress persistence under `mayflower-player-progression-v1`.
- Exportable JSON progress backup and an explicit reset action.
- `schemas/player-progression.schema.json` to separate player save-state from canonical quest definitions.
- Expanded quest schema and CI checks for category values, objective IDs/types, foreign-key references and prerequisite cycles.

## Content integrity
The canonical quest catalogue remains intentionally empty. No unapproved storylines, objectives, item rewards, currency, or character quests have been fabricated. The journal presents a clear empty state and becomes populated from `assets/data/quests.json` when approved quest records are authored.

The Command Deck's five checkboxes remain development tasks. Their heading and explanatory copy now call them a **Development checklist**, not player quests. The existing local checklist storage is unchanged.

## Save-data boundary
- Quest definitions: `assets/data/quests.json` (shared static content).
- Character and location labels: `assets/data/characters.json` and `assets/data/locations.json`.
- Player quest progress: browser local storage only, on the current device/browser.
- Backup: user-triggered JSON export.
- No account identity, remote database, cross-device sync, multiplayer state, or server-side save is connected.

## QA status
CI now syntax-checks `game.js`, `dashboard.js`, `assets/js/site-navigation.js` and `assets/js/quest-journal.js`, then runs the content/reference validator. This is not a substitute for browser testing. Desktop/mobile rendering, filter behavior, local storage, export/reset, keyboard accessibility and real populated quest flows still need manual QA.

## Next step
Run the Quest Journal in a browser at desktop and mobile widths. After that, author the first owner-approved quest batch with confirmed story beats, prerequisites, objective targets, related characters/locations and reward definitions. Keep inventory and reward granting in a pending state until their canonical systems exist.
