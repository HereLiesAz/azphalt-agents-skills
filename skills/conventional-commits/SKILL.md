---
name: conventional-commits
description: Write Conventional Commits-formatted commit messages and validate existing ones. Use when writing a commit message, reviewing commit history for changelog/semver automation, or when a project's CONTRIBUTING guide mentions "conventional commits" or commitlint.
---

# Conventional Commits

Write every commit message in the [Conventional Commits](https://www.conventionalcommits.org/) format so
commit history is machine-parseable for changelog generation and semantic versioning.

## Format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

- **`type`** — one of: `feat` (a new feature), `fix` (a bug fix), `docs`, `style` (formatting only, no
  code meaning change), `refactor` (neither fixes a bug nor adds a feature), `perf`, `test`, `build`
  (build system or external dependencies), `ci`, `chore` (maintenance with no production code change),
  `revert`.
- **`scope`** (optional) — the area affected, in parentheses: `feat(auth): ...`, `fix(api): ...`. Use the
  project's existing scope names if it has established ones; don't invent new ones per commit.
- **`!`** after the type/scope — marks a **breaking change**. Also add a `BREAKING CHANGE:` footer
  describing what breaks and how to migrate.
- **`description`** — imperative mood ("add", not "added" or "adds"), lowercase, no trailing period, and
  specific: "fix null pointer in session refresh" beats "fix bug".
- **`body`** (optional) — the *why*, not a restatement of the diff. What problem existed, why this is the
  fix, what was considered and rejected. Wrap at ~72 characters.
- **`footer`** (optional) — `BREAKING CHANGE: ...`, `Fixes #123`, `Refs #456`, `Co-authored-by: ...`.

## Rules

- One logical change per commit. If a commit mixes a `feat` and an unrelated `fix`, split it — a mixed
  commit can't be described by one `type` honestly, and it can't be reverted or cherry-picked cleanly.
- `feat` and `fix` are what drive semver automation (`feat` → minor, `fix` → patch, any `!`/`BREAKING
  CHANGE` → major) — get these two right even if you're loose about the rest.
- Don't use `feat`/`fix` for anything that isn't user-facing. A refactor that happens to fix an internal
  bug nobody could have hit is `refactor`, not `fix`.
- The description answers "what does this commit do," not "what did I do to write it" — `feat: add retry
  to webhook delivery`, not `feat: updated webhook code`.

## Examples

```
fix(parser): handle trailing comma in JSON5 input

The tokenizer treated a trailing comma before `]`/`}` as a syntax error,
but JSON5 permits it. Added a lookahead check before raising.

Fixes #482
```

```
feat(api)!: require idempotency-key on POST /payments

BREAKING CHANGE: POST /payments now returns 400 if the
Idempotency-Key header is absent. Clients must generate a UUID per
logical payment attempt.
```

```
chore: bump vitest to 3.2.7
```

## Validating existing history

When asked to check a commit range against this convention: for each commit, verify the type is from the
allowed set, the description is imperative-mood and non-empty, and any `!`/breaking-change marker has a
matching `BREAKING CHANGE:` footer. Report violations by commit hash with the specific rule broken —
don't rewrite history unless explicitly asked to (rewriting shared history is destructive).
