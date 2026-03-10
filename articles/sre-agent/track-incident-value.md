---
title: Track Incident Value in Azure SRE Agent
description: Measure your agent's impact with real-time metrics that show which incidents were mitigated, which response plans perform best, and where to invest next.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incidents, metrics, value, daily-reports, incident-scorecard, response-plans, analytics, MTTR, mitigation-rate
#customer intent: As an engineering manager, I want to track my agent's incident response impact so that I can prove ROI and optimize my automation strategy.
---

# Track incident value in Azure SRE Agent
> [!TIP]
> - See your agent's mitigation rate, assist rate, and pending actions with trend sparklines that show week-over-week change.
> - Drill into each response plan to identify which automation strategies resolve the most incidents.
> - Receive automated daily reports covering security findings, resource health, and incident summaries.

## Overview

You deployed an AI agent to handle incidents. Leadership wants to know whether it reduces toil, which incidents it resolves on its own, and whether the investment delivers ROI.

Answering those questions typically requires manual telemetry queries, cross-referencing incident tickets, and guessing which response plans are effective. There's no single view that shows what your agent did, how each response plan performed, or whether mitigation rates improve over time.

Without this data, you can't distinguish a response plan that resolves 80% of incidents autonomously from one that escalates everything to humans. You can't show your team that the agent handled 15 incidents overnight. And you can't make informed decisions about where to invest in better automation.

## How incident value tracking works

Your agent records an activity snapshot every time it processes an incident. These snapshots capture the outcome: whether the agent mitigated the incident autonomously, assisted the investigation, or escalated to a human. The incident metrics dashboard aggregates these snapshots into five real-time stat cards, a trend chart, and a per-response-plan breakdown.

Navigate to **Monitor > Incident metrics** to view the dashboard.

:::image type="content" source="media/track-incident-value/incident-metrics-dashboard.png" alt-text="Screenshot of the incident metrics dashboard showing five stat cards with sparkline trends and an incident summary line chart.":::

### Metric cards

Each card shows a count, its proportion relative to total incidents reviewed, and a sparkline with percentage change from the prior period.

| Metric | What it tells you |
|--------|-------------------|
| **Incidents reviewed** | Total distinct incidents your agent investigated in the selected time range |
| **Mitigated by agent** | Incidents your agent resolved autonomously (the core ROI metric) |
| **Assisted by agent** | Incidents where your agent provided investigation data and the user completed resolution |
| **Mitigated by user** | Incidents resolved entirely by a human (potential automation opportunities) |
| **Pending user action** | Incidents waiting for human input (your current backlog) |

The **Incident summary** chart below the cards plots all five metrics over time. Use this chart to spot trends, such as whether the agent mitigation rate is climbing or the pending backlog is shrinking.

### Response plan breakdown

Below the chart, a **Response plan** grid breaks down performance per plan. Select any plan name to drill into its individual incident history and root cause categories.

This grid is where real decisions happen. You can see at a glance which plans run in [Autonomous mode](run-modes.md) and resolve incidents without human involvement versus plans in Review mode that still require approval. If a plan consistently shows zero autonomous mitigations, adjust the response plan's instructions or increase its autonomy level.

## Before and after

The following table compares incident tracking workflows before and after using incident value tracking.

| Area | Before | After |
|------|--------|-------|
| **Proving agent value** | Query telemetry, cross-reference tickets, write manual reports | Open one dashboard to see mitigation rate, trend, and per-plan breakdown instantly |
| **Knowing which plans work** | Guess based on anecdotal feedback | Per-plan grid shows exact mitigation counts alongside autonomy level |
| **Stakeholder updates** | Compile weekly summaries by hand | Daily reports are generated automatically with incident counts, health status, and recommended actions |
| **Identifying automation gaps** | No visibility into why incidents escalate | Drill into a response plan to see root cause categories and which incidents the agent couldn't resolve |

## Incident overview

For a real-time view of every incident your agent handles, go to **Activities > Incidents**.

:::image type="content" source="media/track-incident-value/incidents-overview.png" alt-text="Screenshot of the incidents overview showing incident grid with status cards, filterable by time range, priority, and investigation status.":::

The page shows summary cards for incident status (Triggered, Acknowledged) and agent investigation status (Pending user input, In progress, Completed), plus a filterable grid of all incidents. Filter by time range, priority, status, investigation status, or search for specific incidents.

Each row links to the agent's investigation thread, so you can review exactly what the agent did: which tools it called, what evidence it found, and what it recommended.

## Daily reports

Your agent generates automated daily reports that you can access at **Activities > Daily reports**.

:::image type="content" source="media/track-incident-value/daily-reports.png" alt-text="Screenshot of the daily report showing security findings, incident summary, resource health metrics, and recommended actions.":::

Select a date to view that day's report. Each report covers:

- **Security findings**: CVE vulnerabilities across connected repositories, grouped by severity
- **Incidents**: Active, mitigated, and resolved counts with per-incident investigation details
- **Health and performance**: Per-resource health status with availability, CPU, and memory metrics
- **Code optimizations**: Performance recommendations identified by the agent
- **Recommended actions**: Prioritized action items with descriptions and estimated effort

Daily reports replace the "what happened overnight?" morning routine. Instead of asking your agent or querying dashboards, the information is already compiled and waiting.

## What makes incident value tracking different

Incident metrics dashboards aren't new. Most observability platforms have them. The difference here is that you measure the agent's contribution, not just incident volume.

The per-response-plan breakdown answers a question that no general-purpose dashboard can: "Which of my AI automation strategies are actually working?" You see the relationship between a plan's autonomy level and its mitigation rate side by side. A plan running in Autonomous mode with high mitigation numbers validates your investment. A plan with all incidents stuck in "Pending user action" tells you the response plan needs better instructions or the agent needs more tools.

The daily reports go further. They don't just summarize incidents. They correlate security findings, resource health, and performance data into a single view that would otherwise require opening three or four different tools.

## Next step

> [!div class="nextstepaction"]
> [Monitor agent usage](./monitor-agent-usage.md)

## Related content

- [Automate incident response](incident-response.md)
- [Monitor agent usage](monitor-agent-usage.md)
- [Audit agent actions](audit-agent-actions.md)
