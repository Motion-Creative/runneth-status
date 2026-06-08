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
- Meta data
- TikTok data
- creative summaries
- transcripts
- data endpoints
- Motion reports (coming soon)
- Inspo (coming soon)
- workspace context
- brand context
- whether workspace goal is being triggered
- spend threshold

For Meta, separate out what is available: own-account performance metrics, creative rows, creative summaries, transcripts where available, copy/headline/landing-page groupings, metric references, filter references, and custom conversion metrics. For TikTok, keep it separate: TikTok performance metrics and associated creative details have a different query shape from Meta and should not be described as the same transcript or creative-summary surface.

For reports, mark the saved reports endpoint as coming soon until it is live. For Inspo, mark the new Inspo endpoints as coming soon and note that Runneth guidance for their query boundaries will ship with the Inspo release. Cover the coming-soon Inspo routes: brands, unique creatives, visual format options, boards, board items, creators, organic TikTok posts, and organic TikTok keywords. Call out query boundaries in creative-strategy language: creators can be looked up by known name or handle, organic TikTok can pull the current recommendation feed or an exact creator feed, and organic keywords guide future feed recommendations. Broader creator/category/engagement filtering and live organic TikTok topic search are still being expanded. Pull any future-querying details from Linear tickets and the current codebase state, not guesses.

Use these repo files:
- `primitives.json`: the richer product/status map for the visual page.
- `status-page-notices.json`: the CSM/operator-visible notice layer, including the optional `releaseNote`, the `runnethUse` value, the explicit `workaround`, the compact `resolution`, and any `examples`.
- `status.json`: the current Runneth prompt-injection feed. Keep this separate from status-page-only notices unless Agent Builder has been updated to support richer routing.
- `limitations.json`: current limitation/guidance feed, if populated later.

If `status-page-notices.json` has a `releaseNote`, show it at the top of the page above the issue notices. For the current note, say the next planned release is Monday night or Tuesday night, June 8 or June 9, 2026, and that it is being coordinated with the big routines refactor. Keep the wording practical: until that release, active issues remain, so keep the workarounds in mind.

Add a distinction between how Runneth should use each notice:
- `use_when_relevant`: Runneth should use the guidance whenever the user's request touches this area.
- `only_when_asked`: Runneth should use the guidance only when the user asks about or reports that specific issue.
- `status_page_only`: visible to CSMs/product/operators, but not injected into Runneth by default.

Every notice should show its workaround state clearly. Do not bury it in a paragraph; the page should have an obvious Workaround line or section on each affected notice. If there is no workaround, say "No workaround" clearly and show the safest alternate path.

Support `pinned: true` on notices. Pinned notices should render before unpinned notices and should have a small visual "Pinned" treatment so the most urgent/current operational notes stay front and centre. Pinning is only for the visual page; it does not decide whether Runneth should inject or mention the notice. `runnethUse` still decides that.

Support `resolution` on notices as a small icon or flag on the card:
- `confirmed_next_release`: show a small checkmark-style flag with the notice's `resolution.label`, usually "Next release". This means the fix is confirmed for the next planned release, but the notice is still active until that release ships.
- `working_toward_next_release`: show a subtle in-progress flag with the notice's `resolution.label`, usually "In progress". This means the team is working toward the next planned release, but it is not ready or guaranteed yet.
- `in_progress`: show a subtle in-progress flag with the notice's `resolution.label`, usually "In progress". This means the team is working on it, but it is not tied to the next planned release.
- `notice_only`: show a neutral notice/info flag with the notice's `resolution.label`, usually "Notice only". This means the card is guidance or status visibility and does not imply a release fix.

Do not show these as big badges or make them the main focus of the card. They should be small supporting flags near the notice title or status metadata.

Support `examples` on every notice. Most notices may have `examples: []` for now. When examples exist, render a compact example area on the card with:
- the example label as a hyperlink,
- the specific observed response or symptom,
- the "what to look for" explanation.

For Slack examples, do not just show a bare thread link. Unfold the useful part directly on the card so someone can recognize the issue without opening Slack first. For the older Slack thread formatting notice, show that the observed response was raw response-control JSON: `{"shouldRespond":false}`.

For example:
- A routines outage should be `use_when_relevant` because it changes what Runneth should do whenever someone asks for scheduled, recurring, monitored, or later work.
- A missing conversations sidebar issue probably belongs on the status page as `status_page_only` because it changes support triage, but Runneth should not proactively mention it in normal conversations.
- A Slack file-upload outage should be `use_when_relevant` because affected upload requests need clear guidance when Slack-side retries are unreliable.
- Older Slack threads showing messy formatting should be `only_when_asked` because Runneth should not mention it for every Slack request, but should guide the user when they report messy formatting or raw response-control text in an older Slack thread. Show the example thread link from the notice on the visual page for internal context.

Update the app UI so cards, filters, pinned ordering, notice counts, and labels reflect this structure. The page should help someone quickly understand the current state of Runneth without reading Linear.

Make sure the visual page still has standalone cards for Slack, Google Drive, and Notion because they are native OAuth integrations, even though they also appear under Integrations.

Keep Integrations as the parent/category view that explains:
- native OAuth integrations
- data access
- Pipedream / long-tail integrations
- secrets / API keys

Make Data access clear and concrete. Do not just say "Motion CLI." Show how the actual data surfaces work:
- `motion meta insights` for own-account Meta creative performance, metrics, creative rows, creative summaries, transcripts where available, and copy/headline/landing-page groupings.
- `motion tiktok insights` for TikTok performance and associated creative details.
- creative summaries as a separate available data surface for creative understanding and strategy.
- transcripts as a separate available data surface where supported, especially Meta video spoken-word/script pulls.
- data endpoints such as metric references, filter references, custom conversion metrics, workspace goal, spend threshold, and brand context.
- saved Motion reports and report configurations as coming soon until the reports endpoint is live.
- `motion workspace-goal` for preferred KPI and attribution-window setup when the user asks for best/worst/what is working/what to scale/goal or conversion setup.
- `motion spend-threshold` only when the user asks for significant-spend-only data, spend cutoffs, or threshold config.
- `motion brand-context --data-query` for own-brand positioning, products, audience, claims, constraints, and creative framing.
- Inspo as coming soon for followed brands, unique creatives, visual format options, boards, board items, competitor brand context, creator profiles, organic TikTok posts, and organic TikTok keyword steering.

For Inspo:
- Coming soon: followed brand lookup, unique creatives, visual format options, boards, board items, competitor brand context, creator profiles, organic TikTok posts, and organic TikTok keyword steering.
- Direct query paths when available: competitor ad examples through brands and unique creatives, saved inspiration through boards and board items, known creator lookup by name or handle, current organic recommendation feed reads, exact creator feeds by handle, and keyword update plans that guide future recommendations.
- Still not direct-queryable: broad creator/category/engagement filtering, broad follower/platform filtering, live organic TikTok topic or keyword search, and immediate new results from keyword changes.
- If Runneth pulls a limited page and filters or reads it after retrieval, say that clearly. Do not make it sound like a direct creator search or live TikTok search, and set expectations that it may take a while.
- Separate paid Meta/TikTok performance from organic/Inspo/creator data.

Also set up or update the routine/refresh behavior so the status page refreshes every morning. It should refresh the current-state page from:
- the `Motion-Creative/runneth-status` repo
- relevant Linear tickets
- the current Agent Builder codebase where useful

Make the language clear for CSM/product visibility, not just engineering. Avoid vague labels and avoid turning the page into a raw bug tracker. The page should help someone quickly understand what Runneth can currently do, what is degraded, what is coming soon, and what customers should or should not be told.
```
