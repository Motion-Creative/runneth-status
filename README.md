# runneth-status

[Visual status page](https://0a7474ef-2e3f-4614-bd43-a0e22cf03d8f.app.runneth.com/runneth-status)

Reviewed, customer-safe status and operating guidance for Runneth.

This repo has two related jobs:

- The visual status page shows a richer capability/status map for CSMs, product, and operators.
- Agent Builder can inject selected notices into Runneth turns when a notice should change what Runneth says or does.

Do not turn the status page into a raw bug list. Add an item only when it changes customer guidance, support triage, product expectation-setting, or Runneth behavior.

## Files

- `primitives.json`: the richer status-page product map.
- `status-page-notices.json`: status-page notices with injection modes.
- `status.json`: the current Agent Builder prompt-injection feed.
- `limitations.json`: reserved for durable limitations or guidance.
- `app-agent-prompt.md`: prompt for the Runneth app agent that updates the visual status page.

## Status Page Areas

The visual page should keep these top-level areas:

- `runneth`: broad Runneth platform/runtime behavior.
- `chat`: Motion chat UI, live conversation startup, streaming, idle wake, and chat continuity.
- `brain`: saved rules, files, templates, skills, and routed context.
- `conversations`: conversation history, recall, sidebar visibility, and direct conversation access.
- `slack`: Slack reading, posting, setup, reconnect, and install flows.
- `google_drive`: Google Drive and Google file access.
- `notion`: Notion access.
- `integrations`: parent category for native OAuth, Data access, Pipedream/long-tail integrations, and secrets/API keys.
- `data_access`: Motion data, external endpoints, CLI-backed data access, workspace context, brand context, workspace goal, spend threshold, Meta data, TikTok data, Organic data, Motion reports, and InSpo.
- `apps`: openable pages, dashboards, widgets, previews, and app refreshes.
- `routines`: scheduled, recurring, monitored, refresh, or later work.

Slack, Google Drive, and Notion should stay as standalone cards because they are native OAuth integrations customers ask about directly. They can also appear under the Integrations parent category.

## Notice Modes

`status-page-notices.json` separates visibility from prompt injection:

- `status_page_only`: visible to CSMs/product/operators, not injected into Runneth.
- `reactive_injection`: only surfaced when the user asks about that specific issue.
- `active_injection`: changes Runneth behavior whenever the affected primitive is touched.

Examples:

- Routines setup degraded: `active_injection`, because it changes what Runneth should do.
- Missing conversations from the sidebar: `reactive_injection`, because CSMs should know it exists, but Runneth should only mention it when the user says conversation history is missing.
- First chat after idle can fail: `reactive_injection`.
- Pipedream integrations broken: `active_injection` when a user asks for an affected long-tail integration.

## Prompt Injection Feed

`status.json` is the current Agent Builder prompt-injection feed. Keep it small, prompt-grade, and customer-safe.

Each injected notice should include:

- `summary`: a short human-readable label.
- `impact`: what is affected in plain language.
- `runnethInstructions`: detailed prompt text with trigger conditions, framing, substitute action, and exact state language.
- `workaround`: the concrete substitute or next step Runneth should offer.
- `avoid`: hard boundaries for what Runneth should not say or do.

Until Agent Builder supports the richer status-page primitive set directly, `status.json` may keep the narrower Builder-compatible primitive values while the visual page uses `primitives.json` and `status-page-notices.json`.

## Data Access Detail

Data access should be specific. Do not describe it only as "Motion CLI."

The status page should call out:

- Motion CLI.
- Meta data.
- TikTok data.
- Organic data.
- Motion reports.
- InSpo.
- Workspace context.
- Brand context.
- Whether workspace goal is being triggered.
- Spend threshold.

Current source-of-truth notes:

- Own-account Meta creative work should route through `motion meta insights`.
- TikTok-specific performance should route through `motion tiktok insights`.
- Saved Motion reports and report configurations should route through `motion reports`.
- Workspace goal should trigger for broad Meta asks like best, worst, what is working, what to scale, goal/conversion setup, or attribution-window questions.
- Spend threshold should only trigger when the user asks for significant-spend-only data, spend cutoffs, or threshold config.
- Own-brand strategy context should route through `motion brand-context --data-query`.
- Competitor/InSpo creative and brand context should route through `motion inspo-creatives` and `motion inspo-context`.
- InSpo today covers competitor creatives and competitor brand context through current Motion CLI paths.
- InSpo coming soon/currently being wired includes InSpo brands, unique creatives, boards, creators, TikTok organic posts, board contents, and board write flows.

## Review Rules

Keep customer-facing fields safe. Do not include secrets, customer names, private channel IDs, internal Slack thread links, private Linear links, production traces, credentials, or customer-specific incident notes while this repo is public.

Changes are reviewed through GitHub like normal code: edit the JSON or prompt file in a pull request, review the wording, merge to `main`, and let the status page or Agent Builder consume the updated raw feed.
