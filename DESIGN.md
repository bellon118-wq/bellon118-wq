# Design system

<!-- impeccable:design-schema 1 -->

## Surface

- **Mode:** Experience
- **Route:** GitHub Pages portfolio at `/bellon118-wq/`
- **Source of truth:** `index.html`; styles and original SVG illustrations are authored inline.
- **Intent:** Put the personal portfolio and artwork first, with navigation receding into a dark, cinematic fantasy atmosphere.

## Visual tokens

| Token | Value | Use |
|---|---|---|
| `--n` | `#050914` | Deep blue-black page background |
| `--b` | `#0a1c3a` | Abyss-blue surfaces and atmosphere |
| `--t` | `#00d9e8` | Neon-teal interactive accent and glow |
| `--blue` | `#8fb7ff` | Hollow-blue supporting accent |
| `--g` | `#d8c79a` | Aether-gold emphasis |
| `--p` | `#ffb8a8` | Sunset-peach supporting accent |
| `--mist` | `#e7e7eb` | Primary text |
| `--mut` | `#b8c3d3` | Secondary text |
| `--line` | `rgba(194,219,244,.17)` | Subtle cool borders |

## Typography

Bahnschrift leads, with Segoe UI Variable and Segoe UI fallbacks. Use the display face for the name and section titles; keep body copy compact and readable in mist/secondary tones. The page does not load a remote font.

## Composition and materials

The hero is a full-viewport twilight scene using the existing original profile banner, layered with dark gradients for readable text. Subsequent sections move through About, Projects, Worlds, GitHub activity, and Connect. A centered content column, generous section spacing, restrained glass-like panels, thin cool borders, soft teal/gold highlights, and sparse decorative starwork keep the page immersive without obscuring its content.

Project cards use original inline SVG artwork rather than external hotlinked screenshots. Game cards are unofficial atmospheric illustrations, not logos or official game artwork. Use image-led cards with clear titles, concise descriptions, and status labels where appropriate.

## Components

- **Header/navigation:** fixed, compact dark-glass bar with anchor links; reduce visible links at the narrowest viewport.
- **Hero:** large name, role line, short introduction, and two primary actions: projects and GitHub.
- **Project card:** original art, title, short description, and factual status/link treatment.
- **World card:** atmospheric art with game title, genre, and personal-interest copy.
- **GitHub activity:** achievement-like summary and profile/repository actions; live public stats are supplementary, not required for navigation.
- **Character dossier:** a profile sheet with the existing original DB monogram (not a portrait), owner-provided profile details, accessible self-rating bars labeled as playful, and current-focus quests.
- **Character roster entry:** an original YM emblem rather than fabricated portrait art; concept/status and missing biography/skills are explicit, with no fake profile link or nonfunctional search/filter.
- **Connect/footer:** only verified destinations; unavailable profile destinations remain clearly unlinked.

## Interaction and accessibility

Use smooth anchor scrolling, restrained fade/reveal and ambient particle motion, and subtle hover lift/glow. Disable or sharply reduce motion under `prefers-reduced-motion`. Preserve readable contrast, visible focus, semantic section headings, descriptive links, and a narrow-screen layout without horizontal overflow. Static page content and useful links remain available if GitHub statistics fail to load.

## Content guardrails

Describe AI Workbench as a concept and repository forks as forks. Do not present games as Daniel's own work. Do not describe original mood art as official artwork or screenshots. Keep the distinction between the personal portfolio and the MyBlin9 entertainment-company site clear.