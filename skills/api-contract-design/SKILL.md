---
name: api-contract-design
description: Design an API contract (REST/OpenAPI, GraphQL, or RPC) before implementation, or review a proposed/existing contract for consistency, versioning, and error handling. Use when adding a new API surface or asked to design or review an API's shape.
---

# API Contract Design

Design the contract first, on paper, before implementation — a schema is far cheaper to change than an
API clients already depend on.

## Start from use cases, not tables

List what a caller actually needs to accomplish before naming a single endpoint or type. If a proposed
resource or field doesn't trace back to a real use case, question whether it belongs in v1 — every field
you ship is a field you're committed to supporting.

## REST-specific rules

- **Resources are nouns, operations are HTTP methods.** `POST /orders`, not `POST /createOrder`. `GET` is
  safe (no side effects) and idempotent; `PUT`/`DELETE` are idempotent; `POST`/`PATCH` are not — design
  and document accordingly.
- **Status codes carry meaning consistently**: `200`/`201`/`204` for success variants, `400` for
  malformed/invalid input, `401`/`403` for auth failures (401 = not authenticated, 403 = authenticated
  but not authorized), `404` for missing resources, `409` for conflicts, `422` for semantically invalid
  input that's well-formed, `429` for rate limiting, `5xx` reserved for the server's own failures — never
  used as a substitute for a client-error status.
- **Pagination, filtering, and sorting use one convention across every list endpoint** — pick cursor-based
  pagination for anything that can grow unbounded (offset-based pagination degrades and can skip/repeat
  items under concurrent writes).
- **Every error response has one stable shape**: at minimum a machine-readable error code and a
  human-readable message, consistently placed, across every endpoint — not a bespoke shape per endpoint.

## GraphQL-specific rules

- Design the type graph around how clients will query it, not around backend table shape — deeply nested
  resolvers that mirror a normalized schema usually mean N+1 queries waiting to happen; plan batching
  (dataloader pattern) into the design, not as an afterthought.
- Be deliberate about nullability — a field that's "usually present" but modeled non-null will eventually
  crash a client when it's genuinely absent; a field that's always present but modeled nullable forces
  every client to handle a case that can't occur.
- Mutations return enough of the affected object that a client doesn't need a follow-up query to see the
  result of its own write.

## Versioning and evolution — decide explicitly, up front

- State whether the API is **additive-only** (new optional fields and endpoints, existing ones never
  change shape or meaning) or whether **breaking changes** are anticipated, and if so, the versioning
  scheme (URL path, header, or query param) and how long old versions stay supported after a new one
  ships.
- A field can be added without breaking existing clients only if it's optional and its absence has a
  sensible default — don't add a required field to an existing contract.
- Deprecate loudly before removing: a deprecated field/endpoint stays functional, documented as
  deprecated, with a stated removal date, before it's actually removed.

## Idempotency

Every state-changing operation states explicitly whether a client can safely retry it. Non-idempotent
operations that need retry safety (e.g. "charge this card") get an idempotency-key mechanism — a
client-supplied key that makes a repeated request with the same key a no-op after the first.

## Output

The contract itself — an OpenAPI/GraphQL SDL document or equivalent schema, with example requests and
responses for the success path and every documented error — not prose describing what the contract should
contain. When reviewing an existing contract, list violations of the rules above by endpoint/field, and
state explicitly which proposed changes would be breaking vs. non-breaking under the stated versioning
policy.
