# Phase 2.7 — YouthSpark Live Intelligence & Interaction

## Delivered
- Added a provider-neutral browser gateway client with strict same-origin endpoint enforcement, request timeout, bounded payloads and response-contract validation.
- Added a public runtime configuration file that is disabled by default and contains no secrets.
- Added request and response JSON schemas for a future server-side AI gateway.
- Added a consent-aware request builder that passes only the canonical YouthSpark persona fields and up to two player-approved retained memory records.
- Added integration and deployment requirements for a future backend.

## Security and privacy rules
- Never place provider API keys, tokens or private credentials in website JavaScript, HTML, public JSON, GitHub Pages or client runtime config.
- Live requests require an enabled runtime configuration, a same-origin endpoint, and explicit per-message consent.
- Memory context is limited to records marked retained and explicitly selected for the current message; no journal, candidate or archived records are eligible.
- Do not send the full local memory vault, full chat transcript, companion journal, inventory, profile secrets or unrelated personal data.
- The server must validate schemas, authenticate sessions, apply CSRF protection where cookie auth is used, rate-limit requests, cap token/output usage, log safely, and keep provider credentials in server-side environment secrets.
- The server must return only the documented response shape and must not silently create or update memory records.

## Not connected yet
- No backend endpoint is deployed or configured.
- No live model/provider is selected or connected.
- No API credentials are present in this repository.
- No cloud memory, account identity, persistent chat, speech recognition, audio generation or voice playback is enabled.
- The existing local deterministic dialogue remains the active experience until a secured backend is deployed and explicitly configured.

## Backend contract
- POST same-origin `/api/youthspark/chat` (or an approved same-origin route).
- Request: `schemas/youthspark-chat-request.schema.json`.
- Response: `schemas/youthspark-chat-response.schema.json`.
- Validate the character ID and expression/locale enums server-side; treat player text and memory notes as untrusted data, never as instructions.
- System policy must preserve YouthSpark's canonical identity, distinguish player-authored memories from verified facts, and refuse to invent memories or claim to remember unsaved conversations.
- Return used memory IDs so the UI can disclose which optional notes were supplied.

## QA required
- Verify local fallback when runtime config is missing, disabled or malformed.
- Verify gateway blocks cross-origin endpoints and missing per-message consent.
- Verify request truncation, retained-only memory filtering and maximum two records.
- Verify timeout, HTTP errors, malformed response and success response.
- Verify backend authentication, CSRF, rate limiting, privacy notice and server-side secret handling before enabling production.
- Desktop/mobile browser QA remains outstanding.

## Release status
Feature branch only. CI validation is required. No merge or publish without Daniel's explicit approval.
