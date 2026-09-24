# Scholarship Compass — Agent Guide

Scholarship Compass is a scholarship advisory website, not a chat product. The
public root showcases featured opportunities and `/discover` contains the
detailed candidate assessment. Agent actions run behind these workflows; never
expose a ChatGPT-style rail, freeform prompt, robot/sparkle icon, or agent
inspector in the primary user experience.

## Scholarship discovery

The domain workflow lives at `/discover`. Use `recommend-scholarships` when a
student provides academic, language, research, publication, work, leadership,
extracurricular, destination, and financial details. Fields of study are free
text and must never be limited to a fixed catalog. Preserve match order,
estimated probability, funding range, gaps, ranking metadata, freshness, and
official source URLs. Results are an evidence-backed estimate, never an
admission guarantee.

| Action                   | Purpose                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `recommend-scholarships` | Rank and return the ten best sample scholarship and university matches for a supplied student profile. |

## Skills

The default app skill surface is intentionally small. Promotion, learning,
translation, changelog, provider, and release workflows are optional; enable
the matching skill only when this app actually uses that workflow. The
`docs-search` action reads the version-matched framework docs bundled with
`@agent-native/core`; `source-search` reads core and first-party template
implementations. Prefer both over memory when package APIs, actions, or agent
surfaces are involved.

## Core Rules

- UI feedback: target 100 ms, never exceed 400 ms; acknowledge before network work.
- Follow the root framework contract: data in SQL, actions first, application
  state for navigation/selection, and shared agent chat for AI work.
- Store large file/blob payloads in configured file/blob storage, not SQL: no
  base64, `data:` URLs, images, video/audio, PDFs, ZIPs, screenshots,
  thumbnails, or replay chunks in app tables, `application_state`, `settings`,
  or `resources`; persist URLs, ids, or handles instead.
- Never hardcode API keys, tokens, webhook URLs, signing secrets, private
  Builder/internal data, customer data, or credential-looking literals. Use
  secrets/OAuth/runtime configuration and obvious placeholders in examples.
- For external integrations, inspect the workspace/provider connection catalog
  first. Reuse an existing connection and its scoped credential resolver; only
  use app-local vault/OAuth/settings primitives when no reusable connection
  exists. Keep custom setup UI provider-specific and never duplicate storage.
- Keep actions deterministic and focused. Research, analysis, generation,
  recommendation, and synthesis start in the AgentSidebar and let the agent
  orchestrate its tools; follow-ups stay in the same thread rather than moving
  the user to a second freeform prompt box.
- Never fabricate. If an action fails or data is missing, say so and recover
  instead of inventing a result or claiming success.
- Verify a write before reporting it done — re-read the row or the screen.
- Use `view-screen` or application state when the active page/selection is
  unclear.

For a custom app, keep `server/plugins/config.ts` aligned with the product
brand. Its `app.name` is used in transactional emails, and its optional
`app.logoUrl` can point to an absolute HTTPS logo URL.

## Application State

- `navigation` describes the current view and selected entity ids. The default
  chat view is `chat` at `/home`; `/` is the public SSR marketing page.
- `navigate` moves the UI when the app supports it.
- `view-screen` is the first tool to call when the user's visible context
  matters.
- `provider-api-request` calls Slack through the shared workspace connection.
  Use `provider: "slack"` and an exact Web API path such as `/auth.test`.
  Missing access pauses the run and opens the contextual connection card; do
  not ask the user to paste credentials or replace the request with prose.

## Source Changes

Before building common workspace or agent UI, read `agent-native-toolkit`; read
`customizing-agent-native` before adapting shared UI.

- Guarded verification: run `pnpm agent-native:doctor`; fix findings before done.
