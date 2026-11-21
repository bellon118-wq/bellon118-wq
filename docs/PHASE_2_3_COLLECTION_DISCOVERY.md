# Phase 2.3 — Collection & Discovery System
**Date:** 2026-11-19  
**Branch:** `feature/mayflower-sanctuary-full-upgrade`  
**Status:** Discovery Journal, location target catalogue, guest-local discovery save and Gallery progress connection implemented; automatic game-engine detection and collectible rewards remain future work.

## What was added
- Dedicated `discoveries.html` Discovery Journal with search, progress filters, location cards and exploration summary.
- Location discovery targets reference the existing canonical `assets/data/locations.json` records by stable ID.
- Manual “Record discovery” interaction stores a guest-local exploration event and discovered location IDs.
- Local JSON backup and reset controls; discovery state is separate from quest and inventory saves.
- Gallery displays the player's local location-discovery count and links back to the Discovery Journal.
- Homepage, Command Deck, Inventory, Gallery and route registry now link to the Discovery Journal.
- `assets/data/discoveries.json`, `schemas/discoveries.schema.json` and `schemas/player-discovery.schema.json` define discovery catalogue and player-save contracts.
- CI syntax checks include both discovery scripts; content validator checks location and collectible references.

## Canonical content and boundaries
The location discovery list uses the six active location IDs already present in the canonical location catalogue. No new lore or location records were invented. The collectible discovery catalogue is intentionally empty until approved item records exist. Gallery artwork remains accessible; no existing artwork is locked or misrepresented as a collectible unlock.

The current “Record discovery” action is a manual prototype interaction. It does not detect actual player position, map marker visits, game-engine events or proximity. It does not grant inventory items, currency, quest rewards or Gallery unlocks.

## Save-data boundary
- Shared discovery targets: `assets/data/discoveries.json`.
- Canonical location details: `assets/data/locations.json`.
- Player exploration: `localStorage` key `mayflower-player-discovery-v1`.
- Quest progression and inventory remain in their separate local stores.
- No account, server database, cloud sync or multiplayer is connected.

## QA still required
- Desktop/mobile layout and responsive navigation.
- Search and progress filters; record discovery and repeated-click behavior.
- Export/reset; confirm quest and inventory saves remain unchanged.
- Gallery progress count with zero, partial and full discovery records.
- Keyboard navigation, focus visibility, screen-reader announcements and unavailable-storage behavior.
- Later game-engine integration must emit trusted discovery events and use stable IDs; do not trust client-side localStorage for authoritative rewards.

## Next step
Connect the discovery journal to actual map-marker selection or game-engine location events. Then approve collectible item records and build idempotent collection completion/reward handling before activating collectible rewards.
