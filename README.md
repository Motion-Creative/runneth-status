# runneth-status

Customer-safe operational status feed for Runneth primitives.

Agent Builder reads `status.json`, validates it, caches it briefly, and injects the active notices into each Runneth turn before the user's message. Runneth treats the injected block as system metadata: it checks whether the request touches one of the listed primitives, leads with the status only when relevant, avoids broken actions, and offers the listed workaround or closest useful substitute.

Changes are reviewed through GitHub like normal code: edit `status.json` in a pull request, review the customer-facing wording, merge to `main`, and Agent Builder picks it up from the raw feed.

## Primitives

- `routines`: scheduled, recurring, monitored, or later work.
- `slack`: Slack reading, posting, setup, reconnect, and install flows.
- `notion`: Notion access.
- `google_drive`: Google Drive and Google file access.
- `web`: Runneth web app surfaces, widgets, and setup UI.
- `data_access`: Motion data, external endpoints, and CLI-backed data access.
- `general`: broad Runneth behavior when no narrower primitive fits.

## Feed Shape

Each notice has two layers:

- Agent-facing fields: `impact`, `runnethInstructions`, `workaround`, and `avoid`. Agent Builder can inject these into Runneth turns when the user's request touches an affected primitive.
- Optional dashboard metadata: `severity`, `goesAwayWhen`, and `pinned`. The visual status page can use these for sorting and context without changing what Runneth needs to say to customers.

Use the existing primitive set instead of adding a new primitive for every incident. For example, broad model or chat issues should usually be `general`, while external data pulls, endpoints, CLI-backed pulls, and non-native integrations should usually be `data_access`.

```json
{
  "updatedAt": "2026-06-03T18:46:01.000Z",
  "active": [
    {
      "id": "routines-refactor-in-progress",
      "primitives": ["routines"],
      "surfaces": ["web", "slack"],
      "severity": "degraded",
      "startedAt": "2026-05-26T00:00:00.000Z",
      "updatedAt": "2026-06-02T13:00:00.000Z",
      "summary": "Routines setup and firing are broken while the refactor lands.",
      "impact": "Requests to create, schedule, monitor, remind, post later, or keep work updated should not create live routines while setup and firing are broken.",
      "runnethInstructions": "Do not create new live routines or tell the person a routine is running. Capture the plan and do useful one-time work now.",
      "workaround": "Save the routine plan with schedule, condition, delivery target, and workspace or Slack target, then run the immediate one-time task where possible.",
      "avoid": ["Do not say the routine is scheduled or active."],
      "goesAwayWhen": "The routines refactor ships.",
      "pinned": true
    }
  ]
}
```

Keep `summary`, `impact`, `runnethInstructions`, `workaround`, and `avoid` customer-safe. Do not include secrets, customer names, private channel IDs, internal Slack threads, private ticket links, production traces, credentials, or customer-specific incident notes.

If the repository is private, the dashboard can add richer metadata like owner, tickets, and Slack thread links. Do not add those fields while the repository is public.
