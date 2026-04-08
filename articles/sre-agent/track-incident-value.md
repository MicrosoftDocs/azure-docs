---
title: Track Incident Value in Azure SRE Agent
description: Measure your agent's impact with interactive analytics — drill into incidents from any chart, filter by response plan, and track quality with star ratings.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/25/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incidents, metrics, value, daily-reports, incident-scorecard, response-plans, analytics, MTTR, mitigation-rate, intent-met, scheduled-tasks, drill-down, treemap, star-ratings
#customer intent: As an engineering manager, I want to track my agent's incident response impact so that I can prove ROI and optimize my automation strategy.
---

# Track incident value in Azure SRE Agent
> [!TIP]
> - Click any chart segment, severity bar, or root-cause tile to drill down into matching incidents with search and filtering.
> - Filter the entire dashboard to a single response plan. All KPI cards, charts, and treemap update.
> - Four KPI cards show hours saved, success rate with stacked outcome bar, median time-to-mitigate, and quality score with star ratings (1–5).
> - Treemap root-cause view sizes tiles proportionally by incident count so your biggest problem is immediately visible.

## Overview

You deployed an AI agent to handle incidents. Leadership wants to know whether it reduces toil, which incidents it resolves on its own, and whether the investment delivers ROI.

Answering those questions typically requires manual telemetry queries, cross-referencing incident tickets, and guessing which response plans are effective. There's no single view that shows what your agent did, how each response plan performed, or whether mitigation rates improve over time.

Without this data, you can't distinguish a response plan that resolves 80% of incidents autonomously from one that escalates everything to humans. You can't show your team that the agent handled 15 incidents overnight. And you can't make informed decisions about where to invest in better automation.

## How incident value tracking works

Your agent records an activity snapshot every time it processes an incident. These snapshots capture the outcome: whether the agent mitigated the incident autonomously, assisted the investigation, or escalated to a human. The incident metrics dashboard aggregates these snapshots into four interactive KPI cards, a volume chart, a root-cause treemap, a severity distribution chart, and a per-response-plan performance grid.

Go to **Monitor** > **Incident metrics** to view the dashboard.

:::image type="content" source="media/track-incident-value/incident-metrics-dashboard.png" alt-text="Screenshot of the incident metrics dashboard showing four KPI cards, incident volume chart, root-cause treemap, and response plan performance grid.":::

### KPI cards

Four cards at the top give you an at-a-glance summary. Each card is clickable and opens a detailed trend chart.

| Card | What it shows |
|------|---------------|
| **Hours Saved** | Total hours your agent saved, with up or down trend vs. previous period |
| **Success Rate** | Percentage of incidents resolved or assisted, with a stacked outcome bar showing agent mitigated, agent assisted, human mitigated, and active/pending segments |
| **Median Time to Mitigate** | Proportional comparison bars showing agent P50 resolution time vs. human P50, with a percentage badge when the agent is faster |
| **Quality Score** | Intent Met evaluation score (X / 5) with a star rating of full, half, or empty stars based on score |

The **Success Rate** card includes a stacked outcome bar, a thin horizontal bar with four color-coded segments that shows the distribution of incident outcomes at a glance.

The **Quality Score** card uses a 5-star rating to make the Intent Met score instantly readable. The same star rating appears in the response plan grid's Quality column.

### Interactive drill-down

Every visualization in the dashboard is clickable. Select a segment to open a drill-down modal showing the matching incidents.

| Click target | What the modal shows |
|-------------|---------------------|
| Root-cause treemap tile | Incidents with that root cause |
| Severity distribution bar | Incidents at that severity level |
| Volume chart data point | Incidents from that date, optionally filtered by outcome |
| Volume chart legend label | All incidents with that outcome type |

The drill-down modal displays up to 200 incidents with sortable columns: ID, Title, Severity, Status, Created, Assisted By Agent, and Mitigated By. Use the search box to filter by incident title, ID, severity, or status.

Select an incident title to open the investigation thread in a side drawer. You can review what the agent did without leaving the analytics page.

### Root-cause treemap

Root causes appear as proportionally sized tiles. Larger tiles mean more incidents with that root cause. Each tile displays the root cause name and incident count. Select any tile to drill down into incidents with that root cause.

### Incident volume chart

A stacked chart shows incident volume over time, broken down by outcome: agent mitigated, agent assisted, human mitigated, and active/pending. Toggle between area and bar chart views using the buttons at the top right of the chart.

Select any data point to drill into that day's incidents. Select a legend label to see all incidents of that outcome type.

### Severity distribution chart

A horizontal stacked bar chart breaks down incidents by severity level. Each bar shows the outcome proportions. Select a bar to drill down into incidents at that severity.

### Response plan performance

Below the charts, a **Response Plan Performance** grid shows per-plan metrics with seven sortable columns.\n\n| Column | Description |\n|--------|-------------|\n| **Response Plan Name** | Select to filter the entire dashboard to this plan |\n| **Mode** | Autonomy level badge (Autonomous, Copilot, and so on) |\n| **Incidents** | Distinct incident count |\n| **Agent Mitigated** | Count of autonomous resolutions |\n| **Success Rate** | Percentage with color coding |\n| **Avg TTM** | Average time to mitigate |\n| **Quality** | Star rating plus numeric Intent Met score |\n\nSelect any row to filter the entire dashboard. All KPI cards, charts, and the treemap update to show data for only that response plan. A back arrow appears at the top. Select it to return to the overview.\n\nThis grid is where you make decisions. You can see at a glance which plans run in [Autonomous mode](run-modes.md) and resolve incidents without human involvement versus plans in Review mode that still require approval. If a plan consistently shows a low success rate, adjust the response plan's instructions or increase its autonomy level.

### Intent Met score

The **Intent Met score** measures how effectively your agent resolves work, whether that's an incident investigation or a scheduled task execution. After each thread completes, an automated evaluation scores the outcome on a 1–5 scale:

| Score | Meaning |
|-------|---------|
| **5** | Exceptionally resolved—exceeded expectations with additional insights |
| **4** | Well resolved—successfully completed with clear evidence of satisfaction |
| **3** | Partially resolved—made progress but didn't fully resolve, or thread is waiting for user action |
| **2** | Poorly resolved. The agent attempted but failed significantly |
| **1** | Unresolved. The agent failed to address the core objective |

The **Quality Score** KPI card on the dashboard displays the average Intent Met score as X / 5 with a star rating visualization. The same star rating appears in the response plan grid's Quality column, making it easy to compare quality across plans.\n\nThe score combines results from both incident threads and scheduled task threads into a single unified metric. You measure your agent's effectiveness at proactive automation, such as scheduled health checks, compliance scans, and cost monitoring, alongside reactive incident response.

Intent Met scoring is fully automatic. No configuration is needed. The system evaluates every completed incident and scheduled task thread using the same scoring criteria. Scheduled tasks that are still waiting for user action receive a score of 3, reflecting their indeterminate outcome.

> [!TIP]
> If your Intent Met score is lower than expected, review individual thread conversations in **Monitor** > **Session insights** to understand where the agent struggled. Common improvements include clearer task instructions, adding relevant connectors, or adjusting the agent's tools.

## Before and after

The following table compares incident tracking workflows before and after using incident value tracking.

| Area | Before | After |
|------|--------|-------|
| **Proving agent value** | Query telemetry, cross-reference tickets, write manual reports | Open one dashboard to see mitigation rate, trend, and per-plan breakdown instantly |
| **Knowing which plans work** | Guess based on anecdotal feedback | Per-plan grid shows exact mitigation counts, success rate, TTM, and quality stars |
| **Investigating specific incidents** | Cross-reference the incidents list page with dashboard metrics manually | Select any chart segment to drill down into matching incidents with search and filtering |
| **Filtering by response plan** | Mentally track which plan's data you're looking at across separate views | Select a plan row and the entire dashboard filters to that plan |
| **Understanding root causes** | Flat lists that don't convey proportional impact | Treemap tiles sized by incident count show the biggest problem at a glance |
| **Assessing quality per plan** | Open individual investigation threads and manually judge quality | Star ratings in the grid show Intent Met scores per plan at a glance |
| **Stakeholder updates** | Compile weekly summaries by hand | Daily reports are generated automatically with incident counts, health status, and recommended actions |

## Incident overview

For a real-time view of every incident your agent handles, go to **Incidents** in the left sidebar.

:::image type="content" source="media/track-incident-value/incidents-overview.png" alt-text="Screenshot of the incidents overview showing incident grid with status cards, filterable by time range, priority, and investigation status.":::

The page shows summary cards for incident status (Triggered, Acknowledged) and agent investigation status (Pending user input, In progress, Completed), plus a filterable grid of all incidents. Filter by time range, priority, status, investigation status, or search for specific incidents.

Each row links to the agent's investigation thread, so you can review exactly what the agent did: which tools it called, what evidence it found, and what it recommended.

## Daily reports

Your agent generates automated daily reports that you can access at **Daily reports** in the left sidebar.

:::image type="content" source="media/track-incident-value/daily-reports.png" alt-text="Screenshot of the daily report showing security findings, incident summary, resource health metrics, and recommended actions.":::

Select a date to view that day's report. Each report covers:

- **Security findings**: CVE vulnerabilities across connected repositories, grouped by severity
- **Incidents**: Active, mitigated, and resolved counts with per-incident investigation details
- **Health and performance**: Per-resource health status with availability, CPU, and memory metrics
- **Code optimizations**: Performance recommendations identified by the agent
- **Recommended actions**: Prioritized action items with descriptions and estimated effort

Daily reports replace the "what happened overnight?" morning routine. Instead of asking your agent or querying dashboards, the information is already compiled and waiting.

## What makes incident value tracking different

Incident metrics dashboards aren't new. Most observability platforms have them. The difference here is that you measure the agent's contribution, not just incident volume, and every metric is interactive.

The interactive drill-down closes the loop between aggregate metrics and individual incidents. When you see an 80% success rate, you can immediately select the remaining 20% to see which incidents failed, what root causes drove them, and what the agent attempted.

The per-response-plan filtering answers a question that no general-purpose dashboard can: "Which of my AI automation strategies are actually working?" Select a plan row and the entire dashboard filters to that plan. KPI cards, volume chart, treemap, and severity chart all update.

The treemap root-cause view makes proportional impact immediately visible. Instead of reading a flat list where categories look equally important, the treemap's tile sizes show you at a glance which root cause accounts for the majority of incidents.

The Intent Met score adds a quality dimension with visual star ratings. Instead of just counting incidents resolved, it evaluates **how well** each thread was resolved. A plan with high volume but low stars needs different attention than a plan with low volume but high quality.

## Get started

Incident tracking is built in. Open the **Incidents** tab in the agent portal to view scorecards and daily reports once your agent starts handling incidents.

| Resource | What you'll learn |
|----------|-------------------|
| [Set up a response plan](response-plan.md) | Configure incident response plans that generate tracking data |

## Next step

> [!div class="nextstepaction"]
> [Monitor agent usage](./monitor-agent-usage.md)

## Related content

- [Automate incident response](incident-response.md)
- [Automate tasks on a schedule](scheduled-tasks.md)
- [Monitor agent usage](monitor-agent-usage.md).
- [Audit agent actions](audit-agent-actions.md).
