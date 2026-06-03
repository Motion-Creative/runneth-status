# runneth-status

[Visual status page](https://0a7474ef-2e3f-4614-bd43-a0e22cf03d8f.app.runneth.com/runneth-status)

Customer-safe operational status feed for Runneth primitives.

This repo is primarily a prompt-injection source of truth. Agent Builder reads `status.json`, validates it, caches it briefly, and injects the active notices into each Runneth turn before the user's message. Runneth treats the injected block as system metadata: it checks whether the request touches one of the listed primitives, leads with the status only when relevant, avoids broken actions, and offers the listed workaround or closest useful substitute.

Changes are reviewed through GitHub like normal code: edit `status.json` in a pull request, review the prompt wording, merge to `main`, and Agent Builder picks it up from the raw feed.

## Primitives

- `routines`: scheduled, recurring, monitored, or later work.
- `slack`: Slack reading, posting, setup, reconnect, and install flows.
- `notion`: Notion access.
- `google_drive`: Google Drive and Google file access.
- `web`: Runneth web app surfaces, widgets, and setup UI.
- `data_access`: Motion data, external endpoints, and CLI-backed data access.
- `general`: broad Runneth behavior when no narrower primitive fits.

## Feed Shape

Each notice should be written as prompt material, not just as a status-page row.

Use the existing primitive set instead of adding a new primitive for every incident. For example, broad model or chat issues should usually be `general`, while external data pulls, endpoints, CLI-backed pulls, and non-native integrations should usually be `data_access`.

Use the fields this way:

- `primitives`: the product capability affected. Agent Builder uses this to decide whether the notice is relevant to the user's request.
- `surfaces`: where the guidance applies, usually `web`, `slack`, or both.
- `summary`: a short human-readable label.
- `impact`: what is affected in plain language.
- `runnethInstructions`: the main prompt text. This should say when the notice applies, how Runneth should frame the issue, what Runneth may do instead, and any state language that must be exact.
- `workaround`: the concrete substitute or next step Runneth should offer.
- `avoid`: hard boundaries for what Runneth should not say or do.

```json
{
  "updatedAt": "2026-06-03T18:46:01.000Z",
  "active": [
    {
      "id": "routines-refactor-in-progress",
      "primitives": ["routines"],
      "surfaces": ["web", "slack"],
      "startedAt": "2026-05-26T00:00:00.000Z",
      "updatedAt": "2026-06-02T13:00:00.000Z",
      "summary": "Routines setup and firing are broken while the refactor lands.",
      "impact": "Requests to create, schedule, monitor, remind, post later, or keep work updated should not create live routines while setup and firing are broken.",
      "runnethInstructions": "Apply this when the user asks to create, set up, schedule, monitor, remind, notify, post later, repeat, run recurring work, keep something updated, or run background upkeep. Do not start by collecting setup details or implying live routine setup will work normally. Say positively that reliable routine automation is being worked on, offer to save the requested routine as a future routine plan, and offer immediate one-time help where possible.",
      "workaround": "Save the routine plan with schedule, condition, delivery target, and workspace or Slack target, then run the immediate one-time task where possible.",
      "avoid": ["Do not say the routine is scheduled or active."]
    }
  ]
}
```

## Prompt Writing

Good notices should be detailed enough that Runneth can execute them without guessing. The best pattern is:

- Name the trigger: "Apply this when the user asks..."
- State the first response: what Runneth should say before attempting work.
- Define the substitute: what Runneth can safely do instead.
- Be precise about state: do not let Runneth say something is connected, saved, scheduled, posted, or fixed unless that action has actually succeeded.
- Include surface-specific language in `runnethInstructions` when Slack and web should behave differently.

Keep `summary`, `impact`, `runnethInstructions`, `workaround`, and `avoid` customer-safe. Do not include secrets, customer names, private channel IDs, internal Slack threads, private ticket links, production traces, credentials, or customer-specific incident notes.

The visual status page can read from the same feed, but dashboard metadata should not make the feed harder to inject into Runneth prompts. If the dashboard needs owner, ticket, severity, or Slack thread details later, add that as a separate private dashboard layer or update Agent Builder to strip dashboard-only fields before prompt validation.
