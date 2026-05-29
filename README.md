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

```json
{
  "updatedAt": "2026-05-29T00:00:00.000Z",
  "active": [
    {
      "id": "routines-live-setup-paused",
      "primitives": ["routines"],
      "surfaces": ["web", "slack"],
      "startedAt": "2026-05-26T00:00:00.000Z",
      "updatedAt": "2026-05-29T00:00:00.000Z",
      "summary": "Reliable routine setup is temporarily paused.",
      "impact": "Requests to create, schedule, monitor, remind, post later, or keep work updated should not create live routines.",
      "runnethInstructions": "Do not create new live routines. Prepare the requested routine shape and offer useful one-time work now.",
      "workaround": "Capture the routine plan with schedule, condition, delivery, and workspace or Slack target so it can be turned on later.",
      "avoid": ["Do not say the routine is scheduled or running."]
    }
  ]
}
```

Keep `summary`, `impact`, `runnethInstructions`, `workaround`, and `avoid` customer-safe. Do not include secrets, customer names, private Slack channel IDs, production traces, credentials, or internal-only incident notes.
