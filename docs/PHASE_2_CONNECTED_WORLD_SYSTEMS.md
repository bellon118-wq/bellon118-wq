# Phase 2 — Connected World Systems
**Date:** 2026-11-19  
**Branch:** `feature/mayflower-sanctuary-full-upgrade`  
**Status:** Data contracts and first canonical relationships implemented; runtime integration and browser QA remain pending.

## Scope delivered
- Added `assets/data/locations.json` as the canonical catalogue for the six locations already represented by the schematic world map.
- Added `assets/data/quests.json` as a versioned quest catalogue scaffold. It intentionally contains no quest records yet because the existing Command Deck checklist and UI achievements are not confirmed in-world quests.
- Added location and quest JSON Schemas.
- Connected the canonical YouthSpark record to `muse-harbor` using `homeLocationId`.
- Connected location records to the existing canonical YouthSpark ID where the current game-layer lore explicitly lists her.
- Registered locations and quests in `assets/data/source-map.json`.
- Extended content validation to check unique stable IDs and character/location/quest foreign-key references.

## Location records
| ID | Location | Relationship |
|---|---|---|
| `mayflower-sanctuary` | Mayflower Sanctuary | Project world |
| `muse-harbor` | Muse Harbor | District inside Mayflower Sanctuary; YouthSpark home |
| `cherry-gardens` | Cherry Blossom Gardens | Landmark inside Muse Harbor |
| `waterways` | Digital Waterways | Landmark inside Muse Harbor |
| `stages` | Music Performance Stages | District inside Muse Harbor |
| `rose` | Rose Sanctuary | Landmark inside Mayflower Sanctuary |

The IDs match the current SVG map marker keys. The map remains schematic and not to scale; no new numeric coordinates were invented.

## Canon and uncertainty safeguards
- Existing character IDs and descriptive quest text were preserved.
- YouthSpark's existing faction spelling discrepancy (MYBLING / MYBLIN9) remains unresolved and was not silently normalized.
- Rose Sanctuary's existing documented description was carried forward; history/events remain marked unconfirmed where the source does not establish them.
- No Seraphina, faction, quest, reward, or story record was invented or added to the canonical catalogue without a repository-backed record.
- Character canon remains separate from browser-local player relationship/progress state.

## Validation
The Node validator now checks:
- Route targets and canonical source-map paths.
- Required fields and unique kebab-case IDs in character, game, location and quest catalogues.
- Location parent references.
- Location-to-character and location-to-quest references.
- Character home-location, location and quest references.
- Quest prerequisite, character and location references.

The GitHub Actions run is the executable CI verification gate. Browser behavior and visual map-to-catalogue integration are not yet claimed as tested.

## Next controlled step
Phase 2 follow-up should wire the existing world-map panel to the canonical location catalogue, replacing the duplicated inline `mapData` object only after the UI behavior is regression-tested. Then add owner-confirmed quests and faction records. Do not turn placeholder achievements or development tasks into canonical game content.
