---
name: changelog-writer
description: Draft a CHANGELOG entry or release notes from a range of commits, merged PRs, or a diff. Use when preparing a release, when asked to summarize "what changed since X", or to update a CHANGELOG.md file.
---

# Changelog Writer

Turn a raw list of commits or merged PRs into release notes a *user* of the software would want to read
— not a rephrasing of commit subject lines, and not an engineering diary.

## Process

1. **Gather the raw material.** `git log <last-tag>..HEAD --oneline` (or the equivalent PR list from the
   forge). If commits follow Conventional Commits, use the `type` to pre-sort; if not, read each one
   (and the diff, when the subject is ambiguous) to classify it yourself.
2. **Classify by user-facing category**, not by commit type verbatim:
   - **Added** — new features or capabilities.
   - **Changed** — changes to existing behavior a user would notice.
   - **Fixed** — bug fixes.
   - **Deprecated** — features still present but scheduled for removal.
   - **Removed** — features actually removed.
   - **Security** — vulnerability fixes (call these out even if the rest of the release is quiet).
3. **Drop what users don't care about.** `chore`, internal `refactor`, `test`, `ci`, and `build` commits
   almost never belong in user-facing release notes — they're implementation detail. Exception: a `chore`
   that bumps a dependency to fix a vulnerability the user is exposed to belongs under Security.
4. **Merge duplicates and follow-ups.** Three commits that together implement one feature, or a commit
   that fixes a bug introduced by an earlier commit *in the same unreleased range*, become one entry, not
   three.
5. **Rewrite for the reader, not the author.** "fix(auth): correct off-by-one in token expiry check"
   becomes "Fixed a bug where auth tokens expired one second before their stated lifetime." State the
   *impact*, not the internal mechanism, unless the mechanism is what the user needs to know (e.g. a
   config key rename).

## Format

Follow [Keep a Changelog](https://keepachangelog.com/) unless the project's existing `CHANGELOG.md`
already uses a different structure — match what's there:

```markdown
## [1.4.0] - 2026-08-09

### Added
- Support for `.webp` image imports.

### Fixed
- Fixed a crash when opening a project with no saved layers.

### Security
- Patched a path traversal in the asset importer (see GHSA-xxxx-xxxx-xxxx).
```

## Rules

- Every breaking change gets its own clearly marked entry with the migration path, even if it's small —
  users skim changelogs specifically looking for "will this break my setup."
- Don't invent detail the commits/PRs don't support. If a commit message is too vague to classify or
  describe accurately ("fix stuff"), say so and ask, or list it under its most likely category with a
  note that it's underspecified — don't fabricate specifics to sound complete.
- Keep entries to one line where possible. If an entry needs more than a sentence, it's probably either
  two entries or belongs in fuller release-notes prose above the bullet list, not in the list itself.
- Order entries within a category by user impact, most significant first — not commit chronology.
