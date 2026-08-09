---
name: sql-query-optimizer
description: Analyze and optimize a slow SQL query using its execution plan. Use when a specific query is reported slow, when reviewing a migration that adds a query pattern, or when asked to add or evaluate an index.
---

# SQL Query Optimizer

Optimize the query that's actually slow, using evidence from its execution plan — not a rewrite based on
pattern-matching the SQL text against "things that are usually slow."

## Process

1. **Get the plan, not just the query.** Run `EXPLAIN ANALYZE` (Postgres/MySQL) or the engine's
   equivalent, against real (or realistically-sized and realistically-distributed) data. A plan against
   an empty or tiny table tells you nothing — the optimizer will make different choices at different
   scales.
2. **Read the plan from the bottom up** (innermost operations execute first). For each node, note: the
   operation type (seq scan, index scan, index-only scan, nested loop, hash join, sort), the estimated
   vs. actual row count (a large mismatch means stale statistics or a bad estimate misleading the
   optimizer), and actual time spent in that node specifically.
3. **Identify the dominant cost.** Usually one of: a sequential scan on a large table where a selective
   filter should be using an index; a sort or hash operation spilling to disk (memory pressure); a nested
   loop join where the inner side isn't indexed, turning it into effectively O(n×m); an index that
   exists but isn't chosen (check for a function wrapping the column, an implicit type cast, or a
   leading-column mismatch in a compound index).
4. **Propose the fix that addresses the dominant cost specifically** — not a bundle of speculative
   changes. One index, one query rewrite, or one schema change, matched to the plan evidence.
5. **Re-run `EXPLAIN ANALYZE`** after the change and confirm the plan actually improved (fewer rows
   scanned, index used, lower actual time) — a hypothesis about what an index *should* do isn't
   confirmation that it did.

## Common fixes, matched to their evidence

- **Sequential scan on a large table with a selective `WHERE`** → add an index on the filtered column(s).
  Confirm selectivity first: an index on a column with only two distinct values (e.g. a boolean) rarely
  helps, since the optimizer may reasonably prefer a scan anyway.
- **Compound filter/sort not using an index** → a compound index with columns ordered to match: equality
  filters first, then the range filter, then the sort column — column order in a B-tree index matters.
- **Function or expression on the indexed column in the `WHERE`** (`WHERE lower(email) = ...` with an
  index on `email`) → an expression index on `lower(email)`, or rewrite to avoid the function.
- **N+1 from application code** (many single-row queries where one query would do) → not fixable at the
  SQL level alone; flag it as an application-layer issue needing a join, `IN (...)` batch, or a
  dataloader/prefetch pattern.
- **Join producing more rows than expected (fan-out)** → check for a missing or overly-broad join
  condition; consider whether a `DISTINCT` masking the fan-out is hiding a join bug rather than fixing
  the output.
- **`OFFSET`-based pagination slow on a large table** → switch to cursor-based (keyset) pagination using
  an indexed, ordered column instead of counting/skipping rows.

## Rules

- State the write-cost tradeoff of any new index — it speeds the reads it serves and slows every write to
  that table. Don't propose an index without at least acknowledging that.
- Don't recommend denormalizing or adding a cache layer before ruling out a missing index or a bad query
  shape — those two fix the large majority of real-world slow queries and carry far less complexity cost.
- If you can't get a real execution plan (no access to a representative dataset), say so explicitly and
  mark any recommendation as untested rather than presenting a guess as a diagnosis.

## Output

The plan evidence (before), the specific fix, and the plan evidence after (when you can run it) — plus
the tradeoff the fix introduces.
