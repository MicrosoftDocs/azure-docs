---
title: Operations Hub in Azure SRE Agent
description: Monitor your agent's performance from a unified dashboard with incident analytics, automation health, and operational metrics in one view.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: operations-hub, monitoring, incident-analytics, automation, kpi, dashboard, metrics, health, time-saved, success-rate
#customer intent: As an SRE, I want a single dashboard to monitor my agent's incident handling, automation health, and usage so I don't have to click through multiple pages.
---

# Operations Hub in Azure SRE Agent

> [!TIP]
> Key points:
>
> - See incident analytics, automation health, and daily metrics in one dashboard, no switching between pages.
> - Three tabs: **Overview** (metrics and system health), **Incident Analytics** (hours saved, resolution rates, time-to-mitigate), **Automation** (task and trigger KPIs).
> - Select any KPI card to drill into detailed charts and breakdowns.
> - Available for all agents. Appears automatically in the sidebar.

## The problem with monitoring agent performance

Your agent handles incidents, runs scheduled tasks, processes HTTP triggers, and consumes Azure Agent Units. But understanding whether your agent is performing well requires visiting multiple pages: incident metrics under one section, individual task pages for automation results, settings for consumption data, and chat threads for pending approvals.

No single view that answers "How is my agent doing?" You end up clicking through four or more sections to piece together the picture yourself.

## How the Operations Hub dashboard works

Operations Hub combines monitoring into three tabs accessible from the sidebar. Select **Operations Hub** in the left sidebar to open the dashboard.

:::image type="content" source="media/operations-hub/operations-hub-overview-tab.png" alt-text="Screenshot of the Operations Hub Overview tab showing the status bar, metrics chart, and pending actions and System Health sections." lightbox="media/operations-hub/operations-hub-overview-tab.png":::

### Overview tab

The default view shows your agent's operational status at a glance:

| Section | What it shows |
|---------|--------------|
| **Status bar** | Data source connection health, which connectors are configured and which need attention. Select **Complete setup** to configure missing sources directly. |
| **Metrics chart** | Daily Volume by Source, Daily Active Flow Consumption (AAU), or Daily Custom Tool Calls. Select from the dropdown. |
| **Pending Actions** | Count of conversation threads waiting for your input, including approvals, questions, incident inputs, and pending command executions. |
| **System Health** | Live agent process status and connector health. |

Use the **Time range** selector at the top to adjust the reporting period (default: last 7 days). Select **Refresh** to load the latest data.

### Incident Analytics tab

An interactive analytics dashboard with four KPI cards:

| Card | What it shows |
|------|---------------|
| **Estimated engineering time saved** | Total hours your agent saved, with a daily breakdown drill-down |
| **Agent-supported resolution rate** | Percentage of incidents resolved, with outcome breakdown: agent mitigated, human mitigated (agent assisted), human mitigated (no agent), and in-progress |
| **Median Time to Mitigate** | P50 comparison, agent resolution time vs. human resolution time |
| **IntentMet evaluation score** | Quality rating (1-5 scale with star visualization) based on how effectively the agent resolved incidents |

:::image type="content" source="media/operations-hub/operations-hub-incident-analytics.png" alt-text="Screenshot of the Incident Analytics tab showing four KPI cards for time saved, resolution rate, median time to mitigate, and IntentMet score." lightbox="media/operations-hub/operations-hub-incident-analytics.png":::

Select any KPI card to expand a drill-down view with detailed charts. Below the KPI cards, the **Incident Volume & Outcomes** chart shows incident trends over time.

### Automation tab

A dashboard for monitoring scheduled tasks and HTTP triggers:

| Card | What it shows |
|------|---------------|
| **Total Automations** | Count of active automations, split by scheduled tasks and triggers |
| **Total Runs** | Execution count with trend comparison to the previous period |
| **Success Rate** | Percentage of successful runs with succeeded/failed counts |
| **Avg Run Duration** | Mean execution time with median and P95 percentiles |

:::image type="content" source="media/operations-hub/operations-hub-automation-tab.png" alt-text="Screenshot of the Automation tab showing four KPI cards and the Automation Overview list with individual automation entries." lightbox="media/operations-hub/operations-hub-automation-tab.png":::

Below the KPI cards, the **Automation Overview** section lists each automation with its type (Scheduled Task or HTTP Trigger), schedule, autonomy mode, run count, and success rate. Expand any card to see an AI-generated summary of recent executions.

Use the **Search** box and **Type** filter to find specific automations.

## Before and after using Operations Hub

|  | Before | After |
|---|--------|-------|
| **Checking agent health** | Visit multiple pages: Monitor, Settings, individual tasks | Open Operations Hub: one dashboard, three tabs |
| **Incident analytics** | Go to separate metrics views, manually cross-reference | Incident Analytics tab with KPI cards and drill-down charts |
| **Automation monitoring** | Select each scheduled task individually | Automation tab shows all automations with health indicators |
| **AAU consumption** | Go to Settings > Agent consumption | Overview tab metrics chart includes AAU data |
| **Pending approvals** | Scan chat threads for items waiting for input | Pending Actions count visible on the Overview tab |

## Related content

- [Track incident value](track-incident-value.md)
- [Managed connectors](managed-connectors.md)
