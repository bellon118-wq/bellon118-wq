# Mayflower Sanctuary — Full Upgrade Blueprint
**Owner:** Daniel Bellon  
**Version:** 1.0 · 2026-11-19  
**Status:** Approved direction / staged implementation plan  
**Design target:** Premium fairy-tale fantasy RPG universe with connected world systems.

## Product vision
Mayflower Sanctuary should feel like a living fantasy RPG universe, not a set of disconnected portfolio pages. The website is the world portal and game companion layer. It should support exploration, discovery, characters, quests, collections, stories and a persistent companion architecture over time.

The first release remains a static GitHub Pages experience. Backend persistence, live AI, voice and multiplayer are future integrations and must not be represented as active until implemented and verified.

## Product pillars
1. **World first:** immersive sanctuary gateway, regions, map and location pages.
2. **Characters matter:** profiles connect to stories, quests, places, art and collections.
3. **Exploration has purpose:** discovery, codex entries, quests, achievements and collections share IDs.
4. **YouthSpark is consistent:** canonical identity, movement, expression, voice direction and memory boundaries.
5. **Honest functionality:** local prototype, planned system and live service are clearly distinguished.
6. **Accessible premium UI:** cinematic art and motion never block navigation or readability.

## Navigation and information architecture
### Primary game navigation
- Sanctuary / Command Deck
- World Map
- Characters
- Quests
- Collections
- Codex
- Gallery
- Muse Harbor / YouthSpark
- Player Profile

### Secondary destinations
- Gaming Worlds
- Creative Projects
- DragonAI7 Lab
- About
- Connect

### Page strategy
- Keep `index.html` as the immersive sanctuary gateway and discovery hub.
- Use `game-dashboard.html` as the player-facing Command Deck and quick-travel dashboard.
- Keep `muse-harbor.html` as YouthSpark's home district, not as a duplicate homepage.
- Keep `characters.html` as the character directory; use individual dossier pages for canonical profiles.
- Keep `gallery.html` as the artwork archive.
- Keep `games.html` and `projects.html` as supporting libraries.
- Retain `character.html`, `roster.html`, and `contact.html` as compatibility routes until link analytics and inbound references are checked. Then redirect or retire deliberately.
- Do not create new pages for every system if a coherent tab/section inside an existing game page is more usable.

## System blueprint
| System | Purpose | Current condition | Dependencies | Missing work / implementation plan | Testing |
|---|---|---|---|---|---|
| Sanctuary homepage | Immersive entry, featured story and gateways | Existing rich single-page game layer | Global nav, shared data, assets | Refine hierarchy; prioritize Continue/Explore/Quests; retain summon, controls and existing sections | Smoke all controls; intro skip/replay; keyboard/mobile |
| Command Deck | Player dashboard and quick travel | New draft page; checklist uses localStorage | Route registry, quest data, shared styles | Convert cards into status-aware links; add player snapshot and real quest links; avoid fake stats | Links, progress state, reset, storage failure |
| World map | Discover regions and places | Schematic interactive SVG with pan/zoom | Region/location data, characters, quests, art | Create normalized location IDs; detail panel; region/quest/character links; later replace schematic art with approved map artwork | Touch pan/zoom, marker selection, focus, map bounds |
| Character encyclopedia | Discover characters/NPCs | Roster + individual profiles + placeholders | Character canon, art, factions, location and quest links | Standard profile schema; status/rarity/tags; related content panels; preserve placeholder states | Search/filter, profile routing, missing art |
| YouthSpark / Muse-Core | Consistent companion and future persistent AI | Extensive canon and animation guides; browser-local companion prototype; Muse-Core schema proposal | Canon version, memory schema, consent, API, voice adapter | Separate canon from user state; define memory lifecycle, retrieval, relationship state, voice profile and provider adapter; implement backend only after security/privacy design | Canon tests, memory permission/retention, dialogue consistency, voice fallback |
| Quest/story engine | Structured tasks and narrative progression | Homepage interactions and Command Deck checklist; no shared quest service | Quest definitions, event log, characters, locations | Define quest/step/objective/reward/event IDs; implement deterministic local prototype first; API later | State transitions, prerequisites, persistence boundaries |
| Inventory/collections | Track discoveries, items, artwork and collectibles | Gallery and favorites exist; no unified player inventory | Item/art/collection data, player state | Define item catalogue and collection sets; distinguish owned vs discovered vs displayed | Add/remove, duplicate handling, sorting, empty states |
| Aurelia Tarocchi | Card/deck collection and narrative oracle system | Design direction exists in project context; not established as a connected repo system in this audit | Card schema, character/location lore, art, collection state | Add a versioned card catalogue; connect card references to canon; deck builder and Oracle Hall UI as staged prototype | Card IDs, deck constraints, collection integrity, lore references |
| Gallery | Browse approved visual assets | Existing category filter/lightbox | Asset manifest, character/location IDs | Add structured metadata and related entity links; optimize image sizes and loading | Filter, lightbox, fallback, alt text, fullscreen |
| Player profile/progression | Show player identity, discoveries and progress | Founder dossier and browser-local progress; not a full player account | Player profile, quest/event state, permissions | Separate Daniel's founder dossier from visitor/player profile; local guest profile first; account system only with backend | Local reset/export, privacy, progression consistency |
| Shared data architecture | Keep systems connected | Parallel JSON files and hard-coded data in JS | Stable IDs, schemas, validation | Establish canonical JSON sources, relationships and validation script | Schema validation, duplicate ID and broken-reference checks |
| Persistence/sync | Keep state across sessions/devices | localStorage only | Secure API, database, auth, consent | Phase 1 local-only adapter; Phase 2 authenticated backend; versioned migrations and sync conflict policy | offline, quota, schema migration, concurrency, deletion |
| Future game-engine integration | Reuse world and character data in a game client | Engine not selected | Stable domain schemas, API, asset pipeline | Keep engine-agnostic IDs and contracts; build adapters after engine choice | Contract tests between web and game client |

## Connected content model
All game entities must use stable IDs rather than page-specific display strings. Required relationships:

- Character → faction, home location, appearances/artwork, stories, quests, dialogue profile, collection items.
- Location → region, map marker, lore entries, resident/visiting characters, quests, environment artwork.
- Quest → objectives, prerequisite quests, associated characters/locations, reward items, completion events.
- Artwork → asset path, media type, alt text, creator/source, approval status, related character/location/project.
- Collection → collection items, unlock conditions, rarity/tier, discovery state, display state.
- Card → character/location/story references, suit/arcana, artwork, deck eligibility, canon version.
- Player state → quest progress, discovered locations, collection ownership, preferences, local achievements; never canonical character identity.

## Visual design standards
### Art direction
Premium fairy-tale exploration with a cinematic fantasy RPG interface. Favor rich blue, teal, emerald and antique gold; use sakura pink as a controlled accent for YouthSpark and floral environments. Avoid a generic SaaS dashboard look.

### Core palette
| Token | Suggested value | Role |
|---|---|---|
| Sanctuary midnight | `#071323` | Global backdrop |
| Deep ocean blue | `#0B2440` | Navigation and deep panels |
| Aether teal | `#19C7C2` | Interactive accent |
| Emerald | `#0A9C83` | Nature/faction accent |
| Moonlit blue | `#8FB7FF` | Secondary highlight |
| Antique gold | `#D4B56C` | Premium details and emphasis |
| Sakura | `#F1A5C4` | Floral/YouthSpark accent |
| Mist | `#F0F3F8` | Main text |
| Muted mist | `#B8C5D6` | Supporting text |
| Panel | `#10213A` | Card/panel surface |

Existing design tokens should be mapped into these semantic roles before changing colors. Do not perform a one-shot global color replacement.

### Component standards
- **Navigation:** one global component, clear active state, responsive menu, keyboard support.
- **Cards:** consistent radius, border, elevation, hover/focus states, image ratio and status treatment.
- **Buttons:** primary, secondary, quiet and destructive variants; clear labels and minimum touch targets.
- **Panels:** shared spacing and headings; avoid excessive glass blur behind body text.
- **Typography:** one display family and one body family using system fallbacks; consistent scale and line height.
- **Environment art:** wide cinematic banners for regions; portrait art for characters; landscape thumbnails for quests; never stretch or crop character identity-critical details.
- **Motion:** subtle particles, light bloom and transitions; honor prefers-reduced-motion and provide pause/disable controls.
- **Responsive:** mobile-first navigation and single-column fallback; no horizontal overflow.

## Data and persistence strategy
See `MAYFLOWER_SYSTEM_ARCHITECTURE.md` for the domain model, schema contracts and migration stages.

### Prototype truth labels
- **Live static content:** stored in repository HTML/JSON/assets.
- **Local prototype:** stored in browser localStorage; limited to one browser/device.
- **Planned service:** design-only API/backend/AI/voice/multiplayer.
- **Connected service:** only after provider credentials, server-side integration and tests are completed.

## Implementation roadmap
### Phase 0 — Protect and baseline
- Keep `main` unchanged.
- Keep work on `feature/mayflower-sanctuary-full-upgrade`.
- Record baseline screenshots, current routes, key interactions and current content.
- Add static validation and route checks.
- Review PR #1 as a draft; do not merge yet.

### Phase 1 — Audit and architecture foundation
- Complete repository/page/asset inventory.
- Choose canonical JSON directory and add compatibility layer for legacy reads.
- Define route registry and global navigation.
- Publish the system architecture, data schema and design standards.
- Add CI/static validation for HTML references, JSON, IDs and links.

### Phase 2 — Sanctuary Command Deck
- Integrate dashboard with existing game state without replacing `game.js`.
- Replace placeholder navigation with verified route targets.
- Display only real/local prototype state; mark local progress.
- Add responsive and accessibility QA.

### Phase 3 — World and character graph
- Normalize character, faction, region, location, quest and artwork data.
- Connect character profiles to home location, lore, quests and gallery items.
- Connect map locations to characters, stories, quests and environment artwork.
- Keep unconfirmed entries explicitly marked.

### Phase 4 — YouthSpark / Muse-Core foundation
- Freeze canonical YouthSpark identity/version.
- Separate canon, relationship memory, episodic memory and symbolic memory.
- Add explicit consent, provenance, privacy scope, retention and user controls.
- Define text dialogue and voice adapter contracts.
- Keep provider/backend work separate until approved and secured.

### Phase 5 — Quests, inventory and Aurelia Tarocchi
- Implement shared quest state and deterministic progression.
- Build inventory and collection data model.
- Add card catalogue and deck/Oracle Hall prototype using stable references.
- Link rewards and discoveries to map, character and gallery records.

### Phase 6 — Visual polish and performance
- Unify navigation, page shells and components.
- Upgrade environmental art and character presentation.
- Optimize images, lazy loading, CSS and JavaScript boundaries.
- Test mobile, desktop, accessibility and reduced motion.

### Phase 7 — Release validation
- Run automated checks and manual QA.
- Review diff and content changes with Daniel.
- Open/refresh draft PR for review.
- Merge only after explicit owner approval; publish only after a separate approval.

## Prioritized development backlog
### P0 — Must complete before broad feature work
- [ ] Establish route registry and one canonical navigation.
- [ ] Identify canonical data directory and eliminate conflicting writes.
- [ ] Define canonical entity IDs and relationships.
- [ ] Add JSON/HTML/link/asset validation.
- [ ] Document local-only vs planned vs connected functionality.
- [ ] Run regression tests for homepage systems before refactoring.

### P1 — Core playable web experience
- [ ] Command Deck quick travel and dashboard.
- [ ] Unified map/region/location model.
- [ ] Character profile and roster data model.
- [ ] Related content links across character/location/quest/gallery.
- [ ] Quest definitions and local quest progression.
- [ ] Gallery metadata and entity links.
- [ ] Mobile/accessibility fixes found in QA.

### P2 — Collection and world depth
- [ ] Inventory and collection catalogue.
- [ ] Aurelia Tarocchi card catalogue and deck builder.
- [ ] Lore/codex expansion from owner-approved content.
- [ ] Region environment art and location scene pages.
- [ ] Player profile and discovery journal.

### P3 — Future connected services
- [ ] Muse-Core backend and secure API.
- [ ] Account/authentication and cross-device sync.
- [ ] AI dialogue provider and voice generation adapter.
- [ ] Multiplayer/shared world events.
- [ ] Game-engine adapter after engine selection.

## Definition of done
A system is done only when its purpose, canonical data, dependencies, UI states, error/empty states, accessibility, responsive behavior, tests and integration contract are documented and verified. A visual mock or localStorage demo is not a completed backend feature.


## Phase 1 implementation update — 2026-11-19
Phase 1 has now been implemented on the feature branch:
- Shared route registry at `assets/data/routes.json`.
- Accessible progressive-enhancement Explore menu integrated into 23 HTML pages; existing local navigation is retained.
- Canonical source map at `assets/data/source-map.json`; `assets/data/characters.json` and `assets/data/games.json` are the designated canonical catalogues.
- Canonical catalogues now carry schema version 1.0.0; all 10 game records have stable IDs. Existing character IDs and canon values were preserved.
- Initial character and game schema contracts are in `schemas/`.
- Dependency-free validation script and GitHub Actions workflow added.
- Legacy `data/` JSON files remain unchanged for compatibility. No page, character profile, artwork or production branch was removed or rewritten.

The implementation still requires the workflow run and desktop/mobile browser QA before Phase 1 can be marked fully verified. See `docs/PHASE_1_FOUNDATION_CHANGELOG.md`.

## Phase 2 implementation update — 2026-11-19
The first connected-world data foundation has been added on the development branch. Six current schematic map locations now have canonical stable IDs and parent/character relationships in `assets/data/locations.json`. YouthSpark is linked to Muse Harbor through `homeLocationId`. A versioned quest catalogue and schemas are in place, but the quest catalogue is intentionally empty until actual in-world quests are confirmed. Automated validation now checks cross-catalogue references. The next implementation step is to migrate the existing map panel to this catalogue without changing its current interaction behavior. See `docs/PHASE_2_CONNECTED_WORLD_SYSTEMS.md`.
