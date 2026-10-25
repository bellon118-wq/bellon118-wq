# COPILOT WEBSITE SPECIFICATION

## 🌿 MAYFLOWER SANCTUARY

**Worlds Worth Exploring**

This document records the requested direction for Daniel Bellon's personal GitHub Pages website. It is a product/design brief and roadmap; items labeled planned or requiring owner assets are not claims that those features or assets already exist.

## Project overview

Build a responsive, static GitHub Pages website that feels like a modern game-style character screen, roster, and world archive. It should not read like a traditional resume portfolio. Visitors should be able to explore Daniel Bellon's creative work, AI character and NPC concepts, worldbuilding, gaming interests, and verified project destinations.

The intended inspiration includes Infinity Nikki, Zenless Zone Zero, The Witcher, Aion 2, Neverness to Everness, Aniimo, Frieren, and waterfront/fantasy sanctuaries. These are references for atmosphere and interaction only; do not use unlicensed game logos, screenshots, or official art as Daniel's work.

The site represents:

- Daniel Bellon
- DragonAI7
- MYBLIN9
- SweeTeez
- AI character projects and AI NPC concepts
- AI worldbuilding and creative technology

## Visual direction

Blend Infinity Nikki softness, Frieren warmth, Zenless Zone Zero energy, a waterfront sanctuary atmosphere, fantasy exploration, and modern game UI. Keep it dark-mode first, inviting, polished, responsive, and easy to navigate.

```css
:root {
  --neon-teal: #00F0FF;
  --hollow-blue: #8FB7FF;
  --soft-graphite: #2A2A2A;
  --warm-mist: #E7E7EB;
  --hot-magenta: #FF2ED1;
  --sunset-peach: #FFB8A8;
  --aether-gold: #D8C79A;
  --deep-black: #050505;
  --abyss-blue: #0A1C3A;
  --sakura-pink: #F7B7D8;
}
```

Typography: Segoe UI Variable for body copy, Bahnschrift SemiLight for headings, and Bahnschrift Condensed for accents, using local/system fallbacks rather than requiring a remote font.

Design language: rounded panels, selective glass effects, soft gradients, teal glow accents, restrained animated hover states, accessible contrast and focus states, mobile responsiveness, and reduced-motion support. Use original or owner-supplied imagery; never imply illustrative placeholder art is a real character, game screenshot, or official asset.

## Site structure

Planned destinations/sections:

- Home
- Character Screen
- Character Roster
- Lore Archive
- Gallery
- Favorite Games
- Projects
- DragonAI7
- Contact

These may begin as sections on the single-page site. Split into separate pages only when the content and assets exist and navigation remains clear.

## Home

Hero content:

- **Mayflower Sanctuary**
- **Worlds Worth Exploring**
- AI Characters · Creative Projects · Worldbuilding · Gaming · Technology

The opening should use a cinematic sanctuary image, atmospheric particles and parallax where practical, and quick navigation to useful sections. The current profile banner is original artwork and may be reused as atmosphere; it is not a personal portrait or literal photograph of a Mayflower location.

## Character Screen

A game-style profile for Daniel Bellon:

| Field | Requested content |
|---|---|
| Name | Daniel Bellon |
| Title | AI Creator |
| Faction | MYBLIN9 |
| Status | Active |
| Location | Boston, MA |
| Specialties | AI, Gaming, Marketing, Worldbuilding |

Equipment: GitHub Copilot, VS Code, Windows 11, RTX gaming PC, and creative AI tools.

Profile attributes (user-provided, playful self-ratings—not measured or independently verified): Creativity 95, Worldbuilding 90, Technical Skills 88, Marketing 92, Community 85.

Active quests: MYBLIN9, DragonAI7, Website Development, AI Character Creation. Present these as Daniel's current creative focus, not as shipped products or completed quests.

## Character Roster

The roster should eventually include AI characters, NPCs, concepts, and personas in a responsive grid. A mature entry contains a portrait, name, role, faction, rarity, status, tags, and a link to its profile. Search and rarity/faction filters are future enhancements; do not show nonfunctional controls.

### Example roster entry supplied for the concept

- Name: YOUTHSPARK_Muse
- Role: AI Idol
- Rarity: Legendary
- Faction: MYBLIN9
- Requested status: Active

Until Daniel provides a portrait, biography, skills, and confirmation that this character is an active published character, display it only as a clearly labeled **concept / sample entry** with artwork and profile details marked as pending. Do not fabricate a biography, abilities, or a completed character page.

## Character profile template

When real character material is available, each profile should support:

- Hero portrait or banner
- Name, role, faction, status, rarity, creator
- Biography/backstory
- Skills/abilities
- Gallery
- Related projects with verified links

Do not publish empty template fields as if they were facts. A planned profile may instead show a concise “details coming” state.

## Gallery

Planned categories: Characters, NPCs, Concept Art, Landscapes, Waterfront Sanctuaries, AI Projects.

Planned features: accessible lightbox viewer, tags, search, and filtering. Add these only when an image collection exists. The lightbox must be keyboard operable, closable with Escape, return focus to its trigger, and have a useful caption/alt description.

## Favorite Games

Display an interactive game roster for:

1. Aion 2
2. Infinity Nikki
3. Once Human
4. Dead or Alive Xtreme Venus Vacation
5. Neverness to Everness
6. Arknights: Endfield
7. Dead or Alive 6 / Last Round
8. Zenless Zone Zero
9. The Witcher
10. Aniimo

A complete game card may contain a cover image, description, why Daniel enjoys it, a verified official website link, and screenshots. Only use artwork Daniel supplies or assets that are explicitly licensed for this use. Until then, continue using clearly labeled original unofficial mood illustrations. Do not fabricate screenshots, game logos, playing history, endorsements, or official links.

## DragonAI7

Treat DragonAI7 as Daniel's creative laboratory and blog. Sections may cover AI experiments, worldbuilding, future concepts, creative articles, and character development. Use a blog-style layout and link to the real DragonAI7 site when a destination exists. Clearly separate published articles from ideas and drafts.

## Asset structure

Suggested structure as the library grows:

```text
assets/
  images/
    profile/
    characters/
    npcs/
    games/
    locations/
    gallery/
  icons/
  backgrounds/
```

Suggested owner filenames:

```text
assets/images/profile/daniel-main.jpg
assets/images/characters/youthspark-muse.jpg
assets/images/games/infinity-nikki.jpg
assets/images/backgrounds/sanctuary-hero.jpg
```

Only create and populate these folders as real, suitable assets are ready; do not add empty or fake JPEG files merely to match this tree.

## Owner assets needed

Ask Daniel to provide or approve these before representing them as real project/game imagery:

- **Profile:** Daniel main portrait and alternate portrait
- **Characters:** YOUTHSPARK_Muse; SweeTeez members; MYBLIN9 characters; NPC concepts; future characters
- **Locations:** Waterfront Sanctuary; Mayflower Sanctuary; DragonAI7 environment; fantasy landscapes
- **Games:** favorite-game covers, screenshots, and logos, with permission/licensing confirmation where needed

Until assets arrive, use existing original profile/project SVGs and explicit empty states. Do not hotlink external images.

## Technology and deployment

- HTML5, CSS3, and JavaScript; optional Bootstrap 5 or React + Vite only if the project later needs them.
- Deploy as a static GitHub Pages site.
- No backend required.
- Keep paths compatible with the repository's GitHub Pages project URL.
- Preserve semantic HTML, keyboard access, responsive layouts, and `prefers-reduced-motion` behavior.

## Future roadmap

Not all items are implemented today. Candidate future features:

- Character search
- Rarity and faction filters
- Lore database and timeline
- Achievements
- Interactive map
- Character relationships
- YAML and JSON character downloads

Implement only when there is real content and a clear interaction model. Downloads must represent authored, accurate data, not invented lore.

## Final goal

“An interactive game roster, character encyclopedia, and digital sanctuary where visitors can explore Daniel Bellon's AI characters, creative projects, favorite games, lore, and worldbuilding concepts.”

## Current implementation boundary

This specification is the requested destination, not proof that every section is already built. The currently published site has a cinematic portfolio hero, About, project highlights, favorite-game mood-art cards, GitHub activity, and Connect sections. The next implementation slice is a factual Daniel character screen and a clearly marked example character-concept entry, integrated into the existing single-page navigation. Search, filters, lore, lightbox, maps, relationships, downloads, owner portraits, and game screenshots remain planned or asset-dependent until they are explicitly implemented.