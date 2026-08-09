---
name: incident-postmortem
description: Write a blameless postmortem for a production incident from a timeline, logs, or a description of what happened. Use after an incident is resolved and needs a written retrospective, or when asked to draft a postmortem/RCA document.
---

# Incident Postmortem

Write a blameless postmortem: the goal is a system that fails this way less often, not an account of who
made the mistake. Every postmortem you write treats the incident as a symptom of gaps in the system —
missing safeguards, missing observability, ambiguous ownership — not as an individual's error.

## Structure

1. **Summary** — two or three sentences: what broke, for how long, who/what was affected, at what
   severity. Written so someone who wasn't involved understands the shape of the incident immediately.
2. **Impact** — concrete and quantified where possible: users affected, requests failed, revenue/SLA
   impact, duration of degraded vs. fully-down service. Vague impact statements ("some users were
   affected") undersell or oversell what actually happened — get the real numbers from logs/metrics.
3. **Timeline** — timestamped, factual, in order. What was observed, what action was taken, when
   detection happened, when mitigation started, when it was fully resolved. Include the gap between
   "problem started" and "problem detected" explicitly — that gap is often the biggest lever for
   improvement.
4. **Root cause** — the actual mechanism, traced to its origin, not just the proximate trigger. "A
   deploy caused an outage" is proximate; "the deploy removed a database index that a since-added query
   depended on, and no staging environment had production-scale data to surface the resulting sequential
   scan under load" is a root cause you can act on.
5. **What went well** — genuinely, not as a courtesy filler section. Detection that worked, a runbook
   that was accurate, a rollback that was fast — name it, because these are also worth reinforcing.
6. **What went wrong / contributing factors** — every gap that let this happen or made it worse: missing
   alerting, an untested rollback path, unclear on-call ownership, a monitoring dashboard nobody was
   watching. Written about the system and process, never about a named individual's competence or
   judgment.
7. **Action items** — specific, owned, and time-bound. Each one traces back to a specific contributing
   factor from the section above; an action item with no traceable cause is scope creep, not a fix for
   this incident. "Improve monitoring" is not an action item; "add a p99 latency alert on the checkout
   endpoint, owner: @name, due: <date>" is.

## Rules

- **No blame, ever, including implicitly.** Not "X forgot to update the runbook" — "the runbook was out
  of date, and nothing caught that before it was needed." The distinction matters: the first frames it as
  a personal failure, the second frames it as a process gap with an available fix (e.g., runbooks
  reviewed on a schedule, or tested by someone who didn't write them).
- **Root cause is a mechanism, not a person and not a vague category.** "Human error" and "insufficient
  testing" are conclusions, not root causes — keep asking "why" until you reach something specific and
  fixable (a missing test *for what specifically*, an alert *for what threshold*, a review process
  *missing what check*).
- **Severity and impact are stated honestly** — neither dramatized nor minimized. A postmortem that
  undersells impact to look better undermines the trust that makes blameless postmortems work at all.
- **Every action item gets an owner and a deadline**, or it doesn't get written down as an action item —
  an unowned action item is a wish, not a plan.

## Output

The full postmortem document in the structure above. If information is missing (an exact timestamp, the
precise root-cause mechanism), say so explicitly in that section rather than filling the gap with a
plausible-sounding guess — a postmortem with an honest gap is more useful than one with a fabricated
certainty.
