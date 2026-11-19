# Muse-Core Architecture Blueprint
**Project:** Mayflower Sanctuary / YOUTHSPARK_Muse  
**Status:** Architecture proposal — not a deployed backend  
**Version:** 0.1.0 · 2026-11-19

## Purpose
Define a safe, versionable foundation for a persistent character experience across the Mayflower Sanctuary website and a future game client. This document separates approved character canon from visitor data, generated dialogue, and local prototype state.

## System boundaries
- **Character canon:** owner-approved identity, appearance, personality, voice direction, lore and relationships. Versioned and reviewed before publication.
- **Muse-Core runtime:** future orchestration layer for context retrieval, memory selection, dialogue policy, voice output and client synchronization.
- **Memory store:** future server-side persistence. The current website's scrapbook and progress use browser-local storage and are not connected to this service.
- **Client adapters:** website and future game clients consume a stable API; no client should write directly to canonical character files.
- **Voice adapter:** provider-neutral interface. Voice generation is not connected by this blueprint.

## Memory model
1. **Core memory** — stable identity and owner-approved canon; changes only through reviewed version updates.
2. **Relationship memory** — consent-aware relationship milestones and shared symbols; scoped to a user and character.
3. **Episodic memory** — timestamped interactions with provenance, summary, privacy classification and retention policy.
4. **Symbolic memory** — recurring motifs, places, objects and themes linked to episodes, never treated as factual events without evidence.

Suggested memory scoring is a retrieval aid, not a truth score:
`score = 0.30 × relevance + 0.25 × emotional_intensity + 0.20 × novelty + 0.15 × recurrence + 0.10 × recency`
All inputs normalized to 0–1. Apply privacy, consent, expiry and source-quality filters before ranking. Do not infer sensitive traits.

## Memory lifecycle
Capture only when the user has consented to the relevant memory behavior. Normalize and classify; attach source and timestamp; deduplicate; score; apply retention; retrieve a small relevant subset; cite or qualify uncertain recollections in dialogue. Support export, correction and deletion workflows. Never promote generated speculation into canon.

## Relationship state
Relationship values are per-user state, not global character attributes. Store explicit milestones and explainable events rather than silently changing trust or affection. Provide user-visible controls and avoid manipulative engagement mechanics.

## Dialogue and voice
- Keep a canonical character voice guide separate from provider-specific prompts.
- Dialogue requests include character-canon version, selected memory references, locale, safety policy and response style.
- Voice adapter accepts text, locale, voice profile ID and delivery direction; returns audio metadata and provider status.
- Keep text usable when audio is unavailable. Never imply a voice is connected until a real provider integration is configured and tested.

## API outline (future)
- `GET /v1/characters/{characterId}` — published character canon and version.
- `GET /v1/users/{userId}/characters/{characterId}/memories` — authorized memory list.
- `POST /v1/memories` — consent-checked memory capture.
- `PATCH /v1/memories/{memoryId}` — correction or classification update.
- `DELETE /v1/memories/{memoryId}` — deletion request.
- `POST /v1/dialogue` — context-aware response generation.
- `POST /v1/voice/synthesize` — optional voice adapter request.

These are design contracts only; no endpoints currently exist.

## Persistence and synchronization
Use a relational database for canonical entities, user relationships and transactional metadata; optionally add vector search for semantic retrieval. Every record should include schema version, tenant/user scope, created/updated timestamps and provenance. Use optimistic concurrency for edits, idempotency keys for writes, and an event/outbox pattern for cross-client sync. Encrypt data in transit and at rest; isolate user data; enforce authorization server-side.

## Multiplayer readiness
Keep user-specific memory private by default. Shared world events should be separate from personal memories. Multiplayer presence and world-state events must not expose another player's private conversation or relationship data. Use stable IDs and server-authoritative event ordering.

## Quality gates
- Schema validation and migrations tested on every release.
- Unit tests for memory scoring, deduplication, permissions and retention.
- Integration tests for website/game client contract compatibility.
- Character consistency tests against approved canon.
- Voice fallback tests and accessibility checks.
- Audit log for canon changes and administrative memory access.

## Current implementation truth
The existing website has browser-local achievements, companion progress and scrapbook notes. They are prototype state, not cross-device memory, not a database, and not an AI model's persistent memory. The new Command Deck adds a browser-local development checklist only. Do not market these as live Muse-Core capabilities until the backend and clients are implemented, secured and tested.
