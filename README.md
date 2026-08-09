# azphalt-agents-skills

A curated collection of **Claude Code subagents** and **agent skills** for everyday software engineering
work, plus an [azphalt](https://github.com/HereLiesAz/azphalt) `kind:"skill"` package so the skills half
is installable from the azphalt marketplace by any AI-agent host that adopts the format — not just
Claude Code.

## What's here

```
agents/     11 Claude Code subagents (.claude/agents format — Claude Code only)
skills/     6 portable agent skills (SKILL.md — the open standard; works beyond Claude Code)
azphalt/    builds skills/ into one dev-workflow-skills.azp (kind:"skill") for the azphalt marketplace
```

**Agents and skills are not the same format**, and this repo keeps them genuinely separate rather than
pretending one is the other:

- `agents/*.md` follow Claude Code's own subagent convention (YAML frontmatter with `name`, `description`,
  `tools`, `model`, then a system prompt as the body). This format is Claude-Code-specific.
- `skills/*/SKILL.md` follow the [Agent Skills](https://agentskills.io/specification) open standard —
  frontmatter with `name`/`description`, then instructions Claude will follow. Anthropic published this
  format openly in December 2025; it's already supported by Claude Code, Claude.ai, the Claude API, and
  (per current adoption) OpenAI Codex, Cursor, Gemini CLI, and Windsurf. `skills/` is the source of truth
  — `azphalt/` packages it, it doesn't duplicate it.

## Install

**Subagents** — copy the ones you want into your project's `.claude/agents/` (or `~/.claude/agents/` for
every project):

```sh
cp agents/code-reviewer.md ~/.claude/agents/
```

**Skills**, directly — copy a skill folder into `.claude/skills/` (or wherever your tool looks for
skills):

```sh
cp -r skills/tdd-workflow ~/.claude/skills/
```

**Skills, via azphalt** — build the `.azp` and install it through any azphalt-conformant host:

```sh
cd azphalt
npm install
npm run build   # → dev-workflow-skills-1.0.0.azp
```

## The agents

| Agent | What it does |
| --- | --- |
| `code-reviewer` | Reviews a diff/PR for correctness, security, and maintainability issues |
| `security-auditor` | Audits code, dependencies, and config for exploitable vulnerabilities |
| `test-engineer` | Writes and improves test coverage — unit, integration, edge cases |
| `debugger` | Root-causes a specific bug through systematic hypothesis-and-evidence investigation |
| `refactoring-specialist` | Improves code structure without changing observable behavior |
| `api-designer` | Designs REST/GraphQL/RPC API contracts before implementation |
| `database-optimizer` | Diagnoses and fixes slow queries and missing indexes from execution plans |
| `devops-engineer` | Sets up or improves CI/CD pipelines, containers, and infrastructure-as-code |
| `documentation-engineer` | Writes READMEs, API reference docs, and runbooks |
| `performance-engineer` | Profiles and optimizes CPU/memory/latency bottlenecks, measurement-first |
| `glee` | Adversarial post-hoc auditor — tears apart code, docs, and claims rather than reviewing pre-emptively. Run after a change or before a PR, not instead of `code-reviewer`. |

## The skills

| Skill | What it does |
| --- | --- |
| `conventional-commits` | Write and validate Conventional Commits-formatted commit messages |
| `changelog-writer` | Draft user-facing release notes from a commit range or PR list |
| `tdd-workflow` | Implement via strict red-green-refactor test-driven development |
| `sql-query-optimizer` | Optimize a slow SQL query using its execution plan |
| `api-contract-design` | Design or review an API contract's shape, versioning, and error handling |
| `incident-postmortem` | Write a blameless postmortem from an incident timeline |

## Inspiration & attribution

These are original prompts, not copies, but the categories, scope, and quality bar were informed by the
community's most-praised public collections:

- [wshobson/agents](https://github.com/wshobson/agents) (MIT) — 36k+ ★, the largest production-oriented
  subagent/skill/command collection, and the source for the tiered-scope idea (a focused agent per role
  rather than one do-everything prompt).
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
  (MIT) — 24k+ ★, whose 10-category breakdown shaped which roles this collection covers.
- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic's own official skills repository,
  the authoritative source for `SKILL.md` structure and authoring conventions.

`glee` is the one agent here not modeled on those collections — it's an existing project agent (from
[azphalt](https://github.com/HereLiesAz/azphalt)'s own `.claude/agents/`), included as-is because an
adversarial post-hoc auditor is a genuinely different, complementary role to the pre-emptive reviewers
above, not a restyled `code-reviewer`.

## License

MIT — see [LICENSE](LICENSE).
