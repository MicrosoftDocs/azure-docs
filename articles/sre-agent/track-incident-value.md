---
title: Track Incident Value in Azure SRE Agent
description: Measure your agent's impact with real-time metrics that show which incidents were mitigated, which response plans perform best, and how well your agent meets intent across incidents and scheduled tasks.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incidents, metrics, value, daily-reports, incident-scorecard, response-plans, analytics, MTTR, mitigation-rate, intent-met, scheduled-tasks
#customer intent: As an engineering manager, I want to track my agent's incident response impact so that I can prove ROI and optimize my automation strategy.
---

# Track incident value in Azure SRE Agent
> [!TIP]
> - See your agent's mitigation rate, assist rate, and pending actions with trend sparklines that show week-over-week change.
> - Track your agent's Intent Met score, which is a unified quality metric that measures how well your agent resolves both incidents and scheduled tasks on a 1–5 scale.
> - Drill into each response plan to identify which automation strategies resolve the most incidents.
> - Receive automated daily reports covering security findings, resource health, and incident summaries.

## Overview

You deployed an AI agent to handle incidents. Leadership wants to know whether it reduces toil, which incidents it resolves on its own, and whether the investment delivers ROI.

Answering those questions typically requires manual telemetry queries, cross-referencing incident tickets, and guessing which response plans are effective. There's no single view that shows what your agent did, how each response plan performed, or whether mitigation rates improve over time.

Without this data, you can't distinguish a response plan that resolves 80% of incidents autonomously from one that escalates everything to humans. You can't show your team that the agent handled 15 incidents overnight. And you can't make informed decisions about where to invest in better automation.

## How incident value tracking works

Your agent records an activity snapshot every time it processes an incident. These snapshots capture the outcome: whether the agent mitigated the incident autonomously, assisted the investigation, or escalated to a human. The incident metrics dashboard aggregates these snapshots into five real-time stat cards, a trend chart, and a per-response-plan breakdown.

Go to **Monitor** > **Incident metrics** to view the dashboard.

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

This grid is where you make decisions. You can see at a glance, which plans run in [Autonomous mode](run-modes.md) and resolve incidents without human involvement versus plans in Review mode that still require approval. If a plan consistently shows zero autonomous mitigations, adjust the response plan's instructions or increase its autonomy level.

### Intent Met score

The **Intent Met score** measures how effectively your agent resolves work, whether that's an incident investigation or a scheduled task execution. After each thread completes, an automated evaluation scores the outcome on a 1–5 scale:

| Score | Meaning |
|-------|---------|
| **5** | Exceptionally resolved—exceeded expectations with additional insights |
| **4** | Well resolved—successfully completed with clear evidence of satisfaction |
| **3** | Partially resolved—made progress but didn't fully resolve, or thread is waiting for user action |
| **2** | Poorly resolved. The agent attempted but failed significantly |
| **1** | Unresolved. The agent failed to address the core objective |

The Intent Met score card on the **Overview** dashboard displays:

- **Average score**—shown as X/5 across all evaluated threads from the past 30 days
- **Trend sparkline**—daily average scores to track quality over time

The score combines results from both incident threads and scheduled task threads into a single unified metric. You measure your agent's effectiveness at proactive automation, such as scheduled health checks, compliance scans, and cost monitoring, alongside reactive incident response. This approach gives you one number that captures overall agent quality.

Intent Met scoring is fully automatic. No configuration is needed. The system evaluates every completed incident and scheduled task thread using the same scoring criteria. Scheduled tasks that are still waiting for user action receive a score of 3, reflecting their indeterminate outcome.

> [!TIP]
> If your Intent Met score is lower than expected, review individual thread conversations in **Monitor** > **Session insights** to understand where the agent struggled. Common improvements include clearer task instructions, adding relevant connectors, or adjusting the agent's tools.

## Before and after

The following table compares incident tracking workflows before and after using incident value tracking.

| Area | Before | After |
|------|--------|-------|
| **Proving agent value** | Query telemetry, cross-reference tickets, write manual reports | Open one dashboard to see mitigation rate, trend, and per-plan breakdown instantly |
| **Knowing which plans work** | Guess based on anecdotal feedback | Per-plan grid shows exact mitigation counts alongside autonomy level |
| **Stakeholder updates** | Compile weekly summaries by hand | Daily reports are generated automatically with incident counts, health status, and recommended actions |
| **Identifying automation gaps** | No visibility into why incidents escalate | Drill into a response plan to see root cause categories and which incidents the agent couldn't resolve |
| **Measuring scheduled task quality** | Read each task's thread transcript and manually judge whether the objective was met | Automatic Intent Met score evaluates every completed thread—incidents and scheduled tasks combined into a single quality metric |

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

Incident metrics dashboards aren't new. Most observability platforms have them. The difference here's that you measure the agent's contribution, not just incident volume.

The per-response-plan breakdown answers a question that no general-purpose dashboard can: "Which of my AI automation strategies are actually working?" You see the relationship between a plan's autonomy level and its mitigation rate side by side. A plan running in Autonomous mode with high mitigation numbers validates your investment. A plan with all incidents stuck in "Pending user action" tells you the response plan needs better instructions or the agent needs more tools.

The daily reports go further. They don't just summarize incidents. They correlate security findings, resource health, and performance data into a single view that would otherwise require opening three or four different tools.

The Intent Met score adds a quality dimension that traditional dashboards lack. Instead of just counting incidents resolved, it evaluates **how well** each thread was resolved which uses the same criteria for both incidents and scheduled tasks. A scheduled health check that runs but produces empty results scores differently from one that surfaces actionable findings. This signal helps you iterate on task instructions, not just monitor completion rates.

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
