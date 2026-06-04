# Runneth Status Page App Prompt

Use this prompt with the Runneth app agent that owns the visual status page.

```text
Please update the Runneth status page app using the latest `Motion-Creative/runneth-status` repo as the source of truth.

The important framing: this should not become a bug list. It should be a capability/status map for Runneth, with a separate layer for notices that should actually be injected into Runneth's system prompt.

I would like the status page to still have:
- Brain
- Conversation history, or maybe Conversations
- Slack
- Integrations
- Data access
- Apps
- Routines

What you need to also add is:
- Runneth
- Chat
- Google Drive
- Notion

Make Integrations a parent category for Data access.

Clarify those different types so there should be workspace context. Clarify brand context and whether the workspace goal is being triggered and spend threshold within those, instead of just saying Motion CLI.

For Data access, pull out specifically:
- Motion CLI
- Meta data
- TikTok data
- Organic data
- Motion reports
- InSpo
- workspace context
- brand context
- whether workspace goal is being triggered
- spend threshold

For Meta, also mention InSpo. For InSpo, say what exists today, like boards, brands, and anything else currently supported, versus what is coming soon. Pull the coming-soon details from Linear tickets and the current codebase state, not guesses.

Use these repo files:
- `primitives.json`: the richer product/status map for the visual page.
- `status-page-notices.json`: the CSM/operator-visible notice layer, including the `runnethUse` value and the explicit `workaround` for each notice.
- `status.json`: the current Runneth prompt-injection feed. Keep this separate from status-page-only notices unless Agent Builder has been updated to support richer routing.
- `limitations.json`: current limitation/guidance feed, if populated later.

Add a distinction between how Runneth should use each notice:
- `use_when_relevant`: Runneth should use the guidance whenever the user's request touches this area.
- `only_when_asked`: Runneth should use the guidance only when the user asks about or reports that specific issue.
- `status_page_only`: visible to CSMs/product/operators, but not injected into Runneth by default.

Every notice should show its workaround clearly. Do not bury the workaround in a paragraph; the page should have an obvious Workaround line or section on each affected notice.

For example:
- A routines outage should be `use_when_relevant` because it changes what Runneth should do whenever someone asks for scheduled, recurring, monitored, or later work.
- A missing conversations sidebar issue probably belongs on the status page as `status_page_only` because it changes support triage, but Runneth should not proactively mention it in normal conversations.
- First chat after idle can be `only_when_asked` because it only matters when the user reports that symptom.
- Pipedream integrations broken should be `use_when_relevant` when the user asks for affected long-tail integrations.

Update the app UI so cards, filters, notice counts, and labels reflect this structure. The page should help someone quickly understand the current state of Runneth without reading Linear.

Make sure the visual page still has standalone cards for Slack, Google Drive, and Notion because they are native OAuth integrations, even though they also appear under Integrations.

Keep Integrations as the parent/category view that explains:
- native OAuth integrations
- data access
- Pipedream / long-tail integrations
- secrets / API keys

Make Data access clear and concrete. Do not just say "Motion CLI." Show how the actual data surfaces work:
- `motion meta insights` for own-account Meta creative performance, metrics, transcripts, and creative-gallery rows.
- `motion tiktok insights` for TikTok performance.
- `motion reports` for saved Motion reports and report configurations.
- `motion workspace-goal` for preferred KPI and attribution-window setup when the user asks for best/worst/what is working/what to scale/goal or conversion setup.
- `motion spend-threshold` only when the user asks for significant-spend-only data, spend cutoffs, or threshold config.
- `motion brand-context --data-query` for own-brand positioning, products, audience, claims, constraints, and creative framing.
- `motion inspo-creatives` and `motion inspo-context` for competitor/InSpo creative and brand context.

For InSpo:
- Today: Runneth can use competitor creatives and competitor brand context through the current Motion CLI paths.
- Coming soon/currently being wired: InSpo brands, unique creatives, boards, creators, TikTok organic posts, board contents, and board write flows.
- Separate paid Meta/TikTok performance from organic/InSpo/creator data.

Also set up or update the routine/refresh behavior so the status page refreshes every morning. It should refresh the current-state page from:
- the `Motion-Creative/runneth-status` repo
- relevant Linear tickets
- the current Agent Builder codebase where useful

Make the language clear for CSM/product visibility, not just engineering. Avoid vague labels and avoid turning the page into a raw bug tracker. The page should help someone quickly understand what Runneth can currently do, what is degraded, what is coming soon, and what customers should or should not be told.
```
