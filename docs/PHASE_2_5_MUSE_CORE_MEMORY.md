# Phase 2.5 — Muse-Core Memory & Emotional Continuity

## Delivered
- Added `muse-core.html`, the player-facing Muse-Core Memory Codex.
- Added a versioned Muse-Core profile for canonical character reference and integration boundaries.
- Added a memory-record schema and local memory vault.
- Added the four requested layers: Core, Relationship, Episodic and Symbolic.
- Added transparent importance scoring: emotional intensity 35%, personal relevance 30%, novelty 20%, repetition value 15%.
- Added explicit player-authored capture, a required save-consent checkbox, local review states (candidate / retained / archived), filtering, export and clear controls.
- Reads YouthSpark's existing canonical character record for identity, personality and values; it does not overwrite character canon.
- Added a dedicated route, homepage and Command Deck entry points.

## Data and privacy boundaries
- LocalStorage key: `mayflower-muse-core-memory-v1`.
- The local vault is not an AI memory service and does not automatically enter model prompts.
- No automatic chat capture, sentiment/emotion inference, relationship scoring, model training, cloud persistence, account sync, voice generation or multiplayer sync.
- Retained means player-reviewed in this browser only; it does not certify a fact or authorize external model use.
- The score is a transparent organizational heuristic, not an AI assessment.
- Player memory notes remain separate from character profile canon and companion relationship journal.

## QA still required
- Desktop and mobile layout.
- Create, filter, retain, archive, delete, export and clear records.
- Refresh persistence and storage-unavailable behavior.
- Verify memory vault, companion journal, discovery, quest and inventory stores remain separate.
- Verify the canonical YouthSpark profile is read-only.
- Keyboard and screen-reader behavior, contrast and route/link targets.

## Status
Implementation is staged on the existing feature branch. CI and browser QA must be verified separately. The draft PR remains unmerged; production is unchanged.
