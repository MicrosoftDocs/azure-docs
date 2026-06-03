---
title: "Track Incident Value in Azure SRE Agent"
description: "Track incident value in Azure SRE Agent with interactive analytics. Drill into incidents, filter by response plan, and measure quality with star ratings."
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: incidents, metrics, value, daily-reports, incident-scorecard, response-plans, analytics, mttr, mitigation-rate, intent-met, drill-down, treemap, star-ratings, quality-score, root-cause, severity, kpi-cards, stacked-outcome-bar
#customer intent: As an SRE leader, I want to track incident metrics to show ROI and measure which response plans work best.
---

# Track incident value in Azure SRE Agent

> [!TIP]
> Key points:
>
> - Select any chart segment, severity bar, or root-cause tile to drill down into matching incidents with search and filtering.
> - Filter the entire dashboard to a single response plan. All KPI cards, charts, and treemap update.
> - Four KPI cards show hours saved, success rate with stacked outcome bar, median time-to-mitigate, and quality score with star ratings (1-5).
> - Treemap root-cause view sizes tiles proportionally by incident count so your biggest problem is immediately visible.

Track incident value in Azure SRE Agent to answer leadership's key questions: *Is it actually reducing toil? Which incidents is it resolving on its own? Are we getting ROI from this investment?*

Answering those questions today means manually querying telemetry, cross-referencing incident tickets, and guessing which response plans are effective. No single view that shows what your agent did, how well each response plan performed, or whether mitigation rates are improving over time.

Without this data, you can't distinguish a response plan that resolves 80% of incidents autonomously from one that escalates everything to humans. You can't show your team that the agent handled 15 incidents overnight while everyone slept. And you can't make informed decisions about where to invest in better automation.

## How incident value tracking works

Your agent records an activity snapshot every time it processes an incident. These snapshots capture the outcome, whether the agent mitigated the incident autonomously, assisted the investigation, or escalated to a human. The **incident metrics** dashboard aggregates these snapshots into four interactive KPI cards, a volume chart, a root-cause treemap, a severity distribution chart, and a per-response-plan performance grid.

Go to **Operations Hub > Incident Analytics** to see the dashboard. You can also access the full incident analytics from the [Operations Hub](operations-hub.md) sidebar item.

:::image type="content" source="media/track-incident-value/incident-metrics-dashboard.png" alt-text="Screenshot of incident metrics dashboard showing KPI cards, volume chart, root-cause treemap, and performance grid.":::

### KPI cards

Four cards at the top give you an at-a-glance summary. Each card is selectable. Open it for a detailed trend chart:

| Card | What it shows |
|------|---------------|
| **Estimated engineering time saved** | Total hours your agent saved, with trend vs. previous period |
| **Agent-supported resolution rate** | Percentage of incidents resolved or assisted, with a stacked outcome bar showing agent mitigated, agent assisted, human mitigated, and active/pending segments |
| **Median Time to Mitigate** | Proportional comparison bars showing agent P50 resolution time vs. human P50, with a percentage badge when the agent is faster |
| **IntentMet evaluation score** | Intent Met evaluation score (X / 5) with a star rating: full, half, or empty stars based on score |

The **Success Rate** card includes a stacked outcome bar, a thin horizontal bar with four color-coded segments that shows the distribution of incident outcomes at a glance. Below the bar, a 2x2 grid displays the count for each category.

The **Quality Score** card uses a 5-star rating to make the Intent Met score instantly readable. Stars are full (score >= 0.75 at that position), half (>= 0.25), or empty. The same star rating appears in the response plan grid's Quality column.

### Interactive drill-down

Every visualization in the dashboard is selectable. Select a segment to open a drill-down modal showing the matching incidents:

| Target | What the modal shows |
|--------|---------------------|
| Root-cause treemap tile | Incidents with that root cause |
| Severity distribution bar | Incidents at that severity level |
| Volume chart data point | Incidents from that date, optionally filtered by outcome |
| Volume chart legend label | All incidents with that outcome type |

The drill-down modal displays up to 200 incidents with sortable columns: ID, Title, Severity, Status, Created, Assisted By Agent, and Mitigated By. Use the search box to filter by incident title, ID, severity, or status.

Select an incident title to open the investigation thread in a side drawer. You can review exactly what the agent did without leaving the analytics page.

### Root-cause treemap

Root causes appear as proportionally sized tiles. Larger tiles mean more incidents with that root cause. Tiles are color-coded from a palette of 10 colors (cornflower, teal, orchid, green, orange, and more) assigned by sort order to make each root cause visually distinct.

Each tile displays the root cause name and incident count. Hover for a tooltip with the exact count. Select any tile to drill down into incidents with that root cause.

### Incident volume chart

A stacked chart shows incident volume over time, broken down by outcome: agent mitigated, agent assisted, human mitigated, and active/pending. Toggle between area and bar chart views using the buttons at the top right of the chart.

Select any data point to drill into that day's incidents. Select a legend label to see all incidents of that outcome type across the time range.

### Severity distribution chart

A horizontal stacked bar chart breaks down incidents by severity level. Each bar shows the outcome proportions, including how many incidents at each severity were mitigated by the agent, assisted, resolved by a human, or are still active. Select a bar to drill down into incidents at that severity.

### Background caching

The incident metrics dashboard runs its data queries in parallel and caches results in memory for the current time range and selected response plan. Leaving the window and returning shows your data instantly without triggering new queries. Only changing the time range, selecting a different response plan, or selecting refresh triggers a fresh data load. When new data loads, previous in-flight queries are automatically cancelled before the new batch starts.

### Response plan performance

Below the charts, a **Response Plan Performance** grid shows per-plan metrics with seven sortable columns:

| Column | Description |
|--------|-------------|
| **Response Plan Name** | Select to filter the entire dashboard to this plan |
| **Mode** | Autonomy level badge (Autonomous, Copilot, etc.) |
| **Incidents** | Distinct incident count |
| **Agent Mitigated** | Count of autonomous resolutions |
| **Success Rate** | Percentage with color coding: green (>= 70%), yellow (>= 40%), red (< 40%) |
| **Avg TTM** | Average time to mitigate |
| **Quality** | Star rating plus numeric Intent Met score |

Select any row to filter the entire dashboard. All KPI cards, charts, and the treemap update to show data for only that response plan. A back arrow appears at the top; select it to return to the overview.

Use the search box above the grid to filter plans by name.

This is where the real decisions happen. You can see at a glance which plans run in Autonomous mode and resolve incidents without human involvement versus plans in Review mode that still require approval. If a plan consistently shows a low success rate, it's a signal to adjust the response plan's instructions or increase its autonomy level.

### Intent Met score

The **Intent Met score** measures how effectively your agent resolves work, whether it's an incident investigation or a scheduled task execution. After each thread completes, an automated evaluation scores the outcome on a 1-5 scale:

| Score | Meaning |
|-------|---------|
| **5** | Exceptionally resolved, exceeded expectations with additional insights |
| **4** | Well resolved, successfully completed with clear evidence of satisfaction |
| **3** | Partially resolved, made progress but didn't fully resolve, or thread is waiting for user action |
| **2** | Poorly resolved, attempted but failed significantly |
| **1** | Completely unresolved, failed to address the core objective |

The **Quality Score** KPI card on the dashboard displays the average Intent Met score as X / 5 with a star rating visualization. The same star rating appears in the response plan grid's Quality column, making it easy to compare quality across plans at a glance.

The score combines results from both incident threads and scheduled task threads into a single unified metric. Your agent's effectiveness at proactive automation (scheduled health checks, compliance scans, cost monitoring) is measured alongside reactive incident response, giving you one number that captures overall agent quality.

Intent Met scoring is fully automatic. No configuration is needed. Every completed incident and scheduled task thread is evaluated using the same scoring criteria. Scheduled tasks that are still waiting for user action receive a score of 3, reflecting their indeterminate outcome.

> [!TIP]
> If your Intent Met score is lower than expected, review individual thread conversations in **Monitor > Session insights** to understand where the agent struggled. Common improvements include clearer task instructions, adding relevant connectors, or adjusting the agent's tools.

## Incident overview

For a real-time view of every incident your agent is handling, go to **Incidents** in the left sidebar.

:::image type="content" source="media/track-incident-value/incidents-overview.png" alt-text="Screenshot of incidents overview showing incident grid with status cards and Add filter and Clear all buttons.":::

The page shows summary cards for incident status (Triggered, Acknowledged) and agent investigation status (Pending user input, In progress, Completed), plus a filterable grid of all incidents. Select **Add filter** to add filters by time range, priority, status, or investigation status, or use the search box to find specific incidents. When two or more filters are active, select **Clear all** to reset them at once.

Each row links to the agent's investigation thread, so you can review exactly what the agent did, which tools it called, what evidence it found, and what it recommended.

## Daily reports

Your agent generates automated daily reports accessible at **Daily reports** in the left sidebar.

:::image type="content" source="media/track-incident-value/daily-reports.png" alt-text="Screenshot of daily report showing security findings, incident summary, resource health metrics, and recommended actions.":::

Select a date to view that day's report. Each report covers:

- **Security findings**: CVE vulnerabilities across connected repositories, grouped by severity
- **Incidents**: Active, mitigated, and resolved counts with per-incident investigation details
- **Health and performance**: Per-resource health status with availability, CPU, and memory metrics
- **Code optimizations**: Performance recommendations identified by the agent
- **Recommended actions**: Prioritized action items with descriptions and estimated effort

Daily reports replace the "what happened overnight?" morning routine. Instead of asking your agent or querying dashboards, the information is already compiled and waiting.

## Limits

| Resource | Limit |
|----------|-------|
| **Drill-down results** | Up to 200 incidents per drill-down query |
| **Daily reports** | Generated once per day |
| **Intent Met scoring** | Applied to incidents and scheduled tasks |

## Get started

Incident tracking is built in. Open **Operations Hub > Incident Analytics** once your agent starts handling incidents.

| Resource | What you'll learn |
|----------|-------------------|
| [Set up a response plan](response-plan.md) | Configure response plans that generate tracking data |

## Related content

- [Operations Hub](operations-hub.md)
- [Automate incident response](incident-response.md)
- [Automate tasks on a schedule](scheduled-tasks.md)
- [Monitor agent usage](monitor-agent-usage.md)
- [Audit agent actions](audit-agent-actions.md)
