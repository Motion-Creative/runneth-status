---
name: runneth-status-update
description: Use when asked to add, update, rewrite, or post a Runneth status notice in Motion-Creative/runneth-status, especially when a primitive or integration is degraded and Runneth needs customer-safe status-page copy or prompt-injection guidance.
---

# Runneth Status Update

Use this skill to turn rough incident notes into reviewed Runneth status repo updates.

The goal is not to paste a bug report. Rewrite the note into:

- clear status-page guidance
- an obvious workaround
- prompt-grade Runneth instructions when the notice should be injected

## Read First

From the status repo, read:

- `README.md`
- `primitives.json`
- `status-page-notices.json`
- `status.json`

When the notice will be injected into Runneth, also inspect the relevant Agent Builder prompt or reference files when available. Use the routines-down prompt work from Agent Builder PR #2051 as the model for completeness.

## Decide Where It Belongs

Pick the narrowest useful primitive from `primitives.json`.

Choose one `runnethUse` value:

- `use_when_relevant`: Runneth should use the guidance whenever the user's request touches this area.
- `only_when_asked`: Runneth should use the guidance only when the user asks about or reports this exact issue.
- `status_page_only`: show this on the visual page for CSM/product/operator awareness, but do not inject it into Runneth by default.

Use `status_page_only` for issues that affect support triage or expectation-setting but should not change normal Runneth behavior. Use `only_when_asked` for known symptoms Runneth should explain only after the user hits them. Use `use_when_relevant` when Runneth must avoid, redirect, or change behavior for an affected primitive.

## Required Notice Shape

Every status-page notice needs:

- `id`: stable kebab-case id
- `runnethUse`
- `primitives`
- `surfaces`
- `summary`
- `impact`
- `workaround`
- `statusPageGuidance`
- `runnethTrigger`
- `runnethGuidance`
- `supportGuidance`

Make the workaround concrete enough to show as a standalone line on the visual page. Do not bury it inside `impact` or `statusPageGuidance`.

## Prompt-Injection Standard

When `runnethUse` is `use_when_relevant` or `only_when_asked`, update `status.json` unless the current Agent Builder contract cannot support that primitive yet.

Injected notices must include:

- `summary`: short label
- `impact`: what is affected, in customer-safe language
- `runnethInstructions`: detailed prompt guidance
- `workaround`: the concrete substitute or next step
- `avoid`: hard boundaries

Write `runnethInstructions` like a system-prompt patch, not a status blurb. The routines-down pattern has these key components:

- Trigger: exactly when to apply the notice.
- Support boundary: what is degraded or not reliable, framed positively.
- First response: what Runneth should say before attempting work.
- Safe substitute: the workaround or narrower supported path.
- Detail preservation: what information to save or capture for later when relevant.
- Preconditions: what must be exact before Runneth can attempt any best-effort path.
- Success language: what Runneth may only claim after the side effect actually succeeds.
- Surface handling: Slack, web, or app-specific behavior when it differs.
- Avoid rules: what Runneth must not say, pitch, imply, retry, or silently do.

Good injected guidance often starts like:

```text
Apply this when the user asks to...
Do not start by...
Say positively that...
Offer to...
Only do X after...
If details are missing, say...
Do not say Y unless Z actually succeeded.
```

## Writing Rules

- Keep customer-facing fields safe: no secrets, private links, traces, credentials, customer names, private channel IDs, or internal Slack thread links.
- Use plain language. Avoid internal implementation names unless they are the safest exact term for Runneth.
- Do not use severity as the main model. The important question is how Runneth should use the notice.
- Do not invent missing state, timelines, owners, or workarounds. Mark uncertainty in support guidance or ask one short question if blocked.
- Do not say something is connected, scheduled, posted, saved, repaired, or active unless the underlying action actually succeeded.
- Preserve important user-provided details instead of flattening them into a vague summary.

## Validation

After edits, run:

```bash
python3 -m json.tool status.json >/dev/null
python3 -m json.tool primitives.json >/dev/null
python3 -m json.tool limitations.json >/dev/null
python3 -m json.tool status-page-notices.json >/dev/null
comm -23 <(jq -r '.notices[].primitives[]' status-page-notices.json | sort -u) <(jq -r '.primitives[].key' primitives.json | sort -u)
jq -r '.notices[].runnethUse' status-page-notices.json | sort | uniq -c
git diff --check
```
