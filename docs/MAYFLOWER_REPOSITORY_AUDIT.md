# Mayflower Sanctuary — Repository Audit & Release Readiness
**Owner:** Daniel Bellon  
**Audit date:** 2026-11-19  
**Repository:** bellon118-wq/bellon118-wq  
**Audited ref:** feature/mayflower-sanctuary-full-upgrade  
**Production ref:** main  
**Status:** Static source audit complete; runtime/browser QA pending; not release-ready.

## Executive summary
Mayflower Sanctuary is already a substantial static, multi-page fantasy/game-inspired experience. It is not a blank website. The repository contains a rich homepage game layer, Muse Harbor, a character universe, character dossiers, gallery, games, projects, DragonAI7, browser-local progression, and a draft Command Deck/Muse-Core foundation.

The highest-value next step is consolidation and integration, not a wholesale rewrite. Preserve the current vanilla HTML/CSS/JavaScript systems while establishing a single navigation model, a canonical data layer, explicit prototype/backend boundaries, and repeatable QA.

## Repository and version-control findings
- Default branch: `main`; branch head at audit: `2f05a2eeba8e236dc9a5403791644f79a67d2565`.
- Upgrade branch: `feature/mayflower-sanctuary-full-upgrade`; head at audit: `dfcbce2558657c6a82966c4bf66023614bc8fd3f`.
- Draft PR #1: “Upgrade Mayflower Sanctuary command deck and Muse-Core foundation”; 7 files, 427 additions, 0 deletions. Keep draft until QA and owner review.
- No merge or production publication was performed as part of this audit.
- The branch adds `game-dashboard.html`, dashboard assets, Muse-Core architecture/schema, and a QA checklist. The homepage change is an additive gateway link.

## Existing capabilities to preserve
### Homepage and game layer
- Character summon intro with enter/skip and replay controls.
- Immersion controls: particles, animations, sound effects, generated ambient tone, auto day/night.
- Day/night visual phases based on visitor local time.
- Dialogue typewriter effect and skip control; unverified branches intentionally use placeholders.
- Schematic world map with pan/zoom, markers, and location information.
- Codex search/filter, favorites, recent views.
- Character relationship network visualization.
- Artwork gallery with category/tag filtering, lightbox/fullscreen behavior.
- Achievements and hidden UI easter eggs.
- Companion progress and scrapbook notes.
- Browser-local settings and progress using localStorage.

### Existing content destinations
- Muse Harbor landing and companion experience.
- Character universe and detailed YOUTHSPARK_Muse profile.
- Founder dossier, Golden Rose, Three Queens, MYBLIN9 characters, future character placeholders.
- Digital art gallery and favorite game directory.
- DragonAI7, MYBLIN9, SweeTeez, Three Queens, cinematic fantasy and future AI storytelling project pages.
- About and Connect pages with verified outbound destinations.

### Existing content/asset protection
- Preserve YouthSpark's existing portrait, book-cover, movie-poster, turnaround and placeholder assets.
- Preserve YouthSpark's facial-expression, movement and animator reference documents.
- Preserve the detailed founder dossier and existing project pages.
- Preserve original art and distinguish it from official game assets or screenshots.
- Preserve placeholder labels where content has not been owner-confirmed.

## Page and navigation inventory
The feature branch contains 24 HTML documents:

| Route | Purpose | Current role / audit note |
|---|---|---|
| `index.html` | Sanctuary home | Main immersive entry; contains most game-layer sections |
| `game-dashboard.html` | Command Deck | New additive game-style dashboard in draft PR |
| `muse-harbor.html` | Companion district | Dedicated YouthSpark/Muse Harbor landing |
| `characters.html` | Character Universe | Current primary character directory |
| `characters/youthspark-muse.html` | YouthSpark dossier | Canonical character-facing profile; preserve existing material |
| `characters/daniel-bellon-community-architect.html` | Founder dossier | Extensive bespoke profile; preserve |
| `characters/golden-rose.html` | Golden Rose | Placeholder destination |
| `characters/three-queens.html` | Three Queens | Placeholder destination |
| `characters/myblin9-characters.html` | MYBLIN9 roster | Placeholder/linked character collection |
| `characters/future-characters.html` | Future roster | Placeholder destination |
| `gallery.html` | Digital Art Gallery | Existing artwork and lightbox/filter UI |
| `games.html` | Gaming Worlds | Game directory; keep factual play-status distinctions |
| `projects.html` | Creative Projects | Project index |
| `projects/myblin9.html` | MYBLIN9 | Dedicated project page; factual content cautious |
| `projects/sweeteez.html` | SweeTeez | Placeholder page |
| `projects/three-queens.html` | Three Queens | Placeholder page |
| `projects/cinematic-fantasy-universe.html` | Fantasy universe | Placeholder page |
| `projects/future-ai-storytelling.html` | AI storytelling | Placeholder page |
| `dragonai7.html` | DragonAI7 Lab | Blog/project gateway |
| `about.html` | About Daniel | About/profile destination |
| `connect.html` | Connect | Current verified link hub |
| `character.html` | Legacy character route | Older data-driven profile shell |
| `roster.html` | Legacy roster route | Older data-driven roster shell |
| `contact.html` | Legacy contact route | Older contact shell |

### Navigation consolidation issues
- The current experience has two overlapping navigation families: newer routes (`muse-harbor.html`, `characters.html`, `connect.html`) and legacy routes (`character.html`, `roster.html`, `contact.html`).
- Several legacy pages use a different header and asset stack from the newer Mayflower pages.
- The homepage contains both a primary game navigation and portfolio/project destinations. The Command Deck introduces a third navigation context.
- Establish one canonical global navigation and a small set of contextual subnavs. Retain old routes as compatibility redirects or explicit legacy entry points until inbound links are checked; do not delete them in the first consolidation pass.

## Code, styles, data and dependency inventory
| Path | Responsibility | Findings |
|---|---|---|
| `styles.css` | Main site styling | Current site-level stylesheet |
| `game.css` | Game/immersion visual layer | Homepage game presentation |
| `assets/css/styles.css` | Earlier shared portfolio style | Separate styling generation remains in repository |
| `assets/js/main.js` | Data-driven legacy pages | Roster, games, character, projects, DragonAI7, contact loaders |
| `game.js` | Homepage game interactions | Vanilla JS; local state and interactive systems |
| `script.js` | Modal behavior | Small homepage modal handler |
| `assets/js/image-fallback.js` | Image error handling | Replaces failed images with fallback art/placeholder |
| `dashboard.css/js` | Command Deck | New draft; quest checklist is browser-local |
| `assets/data/characters.json` | Main character records | More complete roster data |
| `assets/data/games.json` | Game directory data | Data-backed favorite games |
| `data/characters.json` | Legacy character data | Separate/older data source |
| `data/games.json` | Legacy game data | Separate/older data source |
| `assets/data/muse-core.schema.json` | Muse-Core proposal | Draft JSON Schema 2020-12; not a running service |
| `docs/MUSE_CORE_ARCHITECTURE.md` | Muse-Core proposal | Good system-boundary and privacy direction |
| `docs/MAYFLOWER_QA_CHECKLIST.md` | Preview QA | Useful checklist; execution evidence still needed |

### Architecture risks
1. **Multiple sources of truth:** duplicate character/game JSON paths can drift.
2. **Multiple design generations:** root and assets stylesheets plus legacy page shells can create visual inconsistency.
3. **Monolithic homepage/game script:** `game.js` owns several distinct concerns and is coupled to homepage DOM IDs.
4. **localStorage is browser-specific:** settings, achievements, scrapbook, favorites/recent and companion progress do not sync across devices.
5. **Map and codex content are not yet normalized:** the map is schematic and codex content intentionally sparse/placeheld.
6. **No verified backend/API:** database, live AI, voice generation, multiplayer and cross-device synchronization are design targets only.

## Data and canon audit
- Character and game data are represented as JSON, but there are two parallel data directories.
- The homepage and YouthSpark profile include explicit safeguards against invented lore; keep this standard.
- The YouthSpark faction note in the source describes MYBLING as franchise/“Voice of MYBLING” affiliation and MYBLIN9 as the character faction confirmed by the newer portrait. Retain this distinction and treat the owner-approved character bible as canonical.
- The profile status, publication status, role, faction, appearance and voice information should be represented as separate fields rather than compressed into one label.
- Relationship values and companion progression must be user-scoped and explicitly described as prototype/local until backed by a secure service.
- Existing game descriptions/play status should remain owner-provided and be updated only with confirmation.

## Link and runtime verification status
- Source-level review found internal links to the main route families and corresponding page files in the repository inventory.
- This is not a claim that every link, anchor, asset URL or outbound destination has been runtime-verified.
- The public site crawler returned the homepage and gallery/game pages, but some other deep links were not available in the inspection cache. The new Command Deck route is on the unmerged feature branch and is not a production route.
- No browser console, network panel, screen-reader, mobile device, or automated link-check run was completed in this static repository audit.
- Therefore, mark link health and runtime behavior as **pending QA**, not “passed.”

## Responsive and accessibility review
Existing CSS includes responsive grids, narrow-screen breakpoints, visible focus styling, skip links, and reduced-motion handling in several areas. These are positive foundations, but a full cross-page test is required because pages use more than one stylesheet/navigation generation.

Test at 360, 390, 768, 1024 and 1440px widths; keyboard-only navigation; 200% zoom; reduced motion; image fallbacks; dialog focus/escape behavior; and screen-reader announcements for progress/status changes.

## Priority findings
| Priority | Finding | Recommended action |
|---|---|---|
| P0 | Need a stable canonical route/navigation model | Define route registry and unify global nav before adding more pages |
| P0 | Duplicate JSON sources | Choose canonical data directory and add compatibility reads/migration |
| P0 | Prototype vs production boundaries | Label all local-only state and planned services consistently |
| P1 | Homepage game.js is a broad responsibility bundle | Split by feature behind stable module boundaries without changing behavior |
| P1 | Character/location/quest/art links are not normalized | Add stable IDs and explicit relationships in versioned data |
| P1 | Several character/project pages are placeholders | Keep them visible as planned content; do not fabricate lore |
| P1 | Legacy and modern page styles differ | Migrate incrementally to shared design tokens/components |
| P2 | Visual depth and environmental presentation can improve | Add approved location artwork, map detail and reusable scene cards |
| P2 | No runtime regression evidence | Add automated static checks and a repeatable manual preview QA run |

## Required deliverables — status
1. Repository audit report: this document.
2. Full upgrade blueprint: `MAYFLOWER_UPGRADE_BLUEPRINT.md`.
3. System architecture diagram: `MAYFLOWER_SYSTEM_ARCHITECTURE.md`.
4. Page/navigation inventory: included above and in blueprint.
5. Feature implementation roadmap: blueprint.
6. Data architecture/schema plan: architecture document.
7. UI/UX design standards: blueprint.
8. Testing/QA checklist: this document and existing `MAYFLOWER_QA_CHECKLIST.md`.
9. Prioritized backlog: blueprint.
10. Release-readiness report: below.

## Release-readiness report
**Decision: NOT READY FOR PRODUCTION RELEASE.**

Reasons:
- Draft PR #1 is unmerged and intentionally additive.
- Preview/browser QA has not been executed or evidenced.
- Mobile, accessibility, link, asset, console and network checks remain pending.
- The architecture and schema documents describe future services, not deployed infrastructure.
- Navigation/data consolidation has not yet been implemented.
- Owner review of the preview and canonical data is required.

### Release gates
- [ ] Owner approves the visual direction and route model.
- [ ] Internal routes, anchors and local asset references pass automated checks.
- [ ] Existing homepage interactions pass regression tests.
- [ ] Dashboard checklist works and clearly identifies browser-local persistence.
- [ ] Character/game JSON validates against documented schemas.
- [ ] No canonical profile or approved asset is changed without review.
- [ ] Desktop/mobile/accessibility checks pass.
- [ ] Console and network panels contain no unexplained errors or 404s.
- [ ] Muse-Core/voice/AI/backend features are accurately labeled as planned unless truly integrated.
- [ ] Daniel approves merge and publication.

**Production branch and live site remain unchanged pending approval.**
