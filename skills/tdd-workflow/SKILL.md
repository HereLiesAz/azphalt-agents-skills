---
name: tdd-workflow
description: Implement a feature or fix a bug using strict red-green-refactor test-driven development. Use when asked to build something "with TDD" or "test-first", or when implementing behavior precise enough to specify as a test before writing the implementation.
---

# TDD Workflow (Red-Green-Refactor)

Implement in the smallest possible loop: write a failing test, make it pass with the least code that
does so, then clean up — repeat. The discipline is the point; skipping a step to "save time" defeats the
purpose, which is a suite that actually pins down behavior because every line of implementation exists
because a test demanded it.

## The loop

1. **Red — write one failing test.** Pick the smallest next increment of behavior. Write a test that
   describes it and run the suite to confirm the test actually fails, and fails for the reason you
   expect (not a typo, not a missing import). A test you haven't watched fail is a test you don't know
   works.
2. **Green — make it pass with the least code possible.** Resist the urge to build the general solution
   immediately. Write the simplest implementation that makes the current test (and all previous ones)
   pass, even if it's a hardcoded special case — the next test will force generalization.
3. **Refactor — clean up with the safety net in place.** Now that the tests pass, improve the
   implementation's structure: remove duplication, rename for clarity, extract a function. Run the suite
   after every small refactoring step. If a step breaks a test, undo it and take a smaller step.
4. **Repeat** with the next smallest increment, in an order that builds toward the full behavior:
   happy path first, then one edge case at a time.

## Choosing the next test

- Start with the simplest possible input that produces non-trivial output — not always the empty case,
  sometimes the empty case is trivial to fake and a non-empty case forces real logic sooner.
- Add one new piece of behavior per test, not several. If you're tempted to write a test with three
  assertions covering three different concerns, that's three tests.
- Order tests so each one forces exactly one meaningful step in the implementation — this is what keeps
  the "least code to pass" step honest instead of accidentally writing the whole solution on step one.
- Boundary and error cases come after the core happy path is solid, not interleaved with it — a
  half-built happy path with edge cases bolted on is harder to reason about than the reverse order.

## Rules

- Never write implementation code without a failing test demanding it. If you notice missing behavior
  while implementing, stop, write the test for it, watch it fail, then continue.
- Never modify a test to make failing code pass unless the test itself was wrong (i.e., the requirement
  changed, or the test asserted the wrong thing). Changing an assertion to match broken output is
  reverse-TDD and defeats the entire method.
- Keep the loop fast — if a single red-green-refactor cycle takes many minutes, the increment was too
  big; split it smaller.
- Commit at green, ideally after each meaningful refactor too — small, working commits are what let you
  safely revert one bad refactoring step without losing the tests.

## Output

Narrate the loop as you go: which test you're adding and why it's the next smallest increment, the
failure it shows, the minimal implementation, then what you refactored and why. At the end, the full test
suite passing is the deliverable — not a description of tests that should exist.
