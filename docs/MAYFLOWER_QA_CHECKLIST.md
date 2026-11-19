# Mayflower Sanctuary QA Checklist
Run this pass on a preview deployment before merging the Command Deck branch.

## Smoke tests
- [ ] Homepage loads and the summon intro can be entered or skipped.
- [ ] Homepage Game Dashboard navigation and Command Deck gateway both open `game-dashboard.html`.
- [ ] Command Deck quick-travel cards open their existing destinations.
- [ ] Character roster and YOUTHSPARK_Muse profile load; verify artwork fallback behavior.
- [ ] Dialogue choices respond and the typewriter skip control works.
- [ ] World map markers, pan/zoom controls and location panel work on desktop and touch.
- [ ] Codex search/filter, gallery filter/lightbox and existing modals work.
- [ ] Browser-local achievements, scrapbook and settings behave as described.
- [ ] Command Deck checklist persists after refresh, resets correctly, and reports storage failure gracefully.

## Responsive and accessibility
- [ ] Check widths 360px, 390px, 768px, 1024px and desktop.
- [ ] No horizontal page overflow; navigation remains usable.
- [ ] All controls are keyboard reachable with visible focus.
- [ ] Form controls have labels; status messages are announced.
- [ ] Test with reduced motion enabled.
- [ ] Check color contrast and text scaling at 200%.
- [ ] Confirm image alt text and fallback images.

## Data and integration boundaries
- [ ] Verify no browser-local data is described as cloud-synced.
- [ ] Confirm no live AI, voice, database or multiplayer service is claimed as connected.
- [ ] Validate `assets/data/muse-core.schema.json` as JSON Schema Draft 2020-12.
- [ ] Validate character data JSON and all internal links.
- [ ] Check browser console and network panel for 404s or uncaught errors.

## Release gate
Do not merge/publish until the smoke, responsive and accessibility checks pass. The current GitHub Pages site remains unchanged while this feature branch is under review.
