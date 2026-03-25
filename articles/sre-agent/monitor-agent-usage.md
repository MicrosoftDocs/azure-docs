---
title: Monitor Agent Usage in Azure SRE Agent
description: Track Azure AI Unit consumption, manage allocation limits, and generate session insights to review your agent's performance.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: usage, AAU, consumption, billing, session-insights, cost, allocation
#customer intent: As an SRE, I want to monitor my agent's Azure AI Unit consumption so that I can predict costs, spot usage spikes, and adjust allocation limits.
---

# Monitor agent usage in Azure SRE Agent
Track Azure AI Unit (AAU) consumption, manage allocation limits, and review session insights which are all available from a single view. Monitor what your agent uses, what's left, and where the consumption goes.

> [!TIP]
> - See how many AAUs your agent consumes in this billing cycle.
> - View daily consumption trends on a bar chart to spot usage spikes.
> - Adjust your active flow AAU allocation at any time, up to 200,000 per month.
> - Generate session insights from any conversation thread for performance review.

## The problem: usage without visibility

Your agent runs conversations, processes incidents, and executes scheduled tasks which all consume Azure AI Units. Without visibility into consumption patterns, you can't predict costs, identify runaway usage, or make informed decisions about allocation changes. You need a single view that shows what you use, what's left, and where the consumption goes.

## Agent consumption

View your AAU usage at **Settings** > **Agent consumption**.

Azure SRE Agent billing is measured in Azure AI Units (AAU). Your monthly allocation includes both a fixed **always-on flow** and a variable **active flow** that you can adjust.

### What the consumption page shows

The consumption page displays three key cards.

| Card | What it displays |
|---|---|
| **Monthly AAU limit** | Your total allocation: always-on flow + active flow AAUs |
| **Total active flow consumption** | Current usage out of total limit, shown as a large number with progress bar. Includes "AAUs reset in X days" countdown. |
| **Daily active flow consumption** | Bar chart showing AAU consumption per day for the current billing period |

### Adjust your allocation

Select **Change AAU allocation** to modify your monthly active flow AAU limit.

| Setting | Details |
|---|---|
| **Input** | Monthly active flow AAUs |
| **Step size** | Increments of 100 |
| **Maximum** | 200,000 AAUs per month |
| **Effective** | Changes take effect immediately |

If you reduce the allocation to less than your current consumption, a warning prompts you to confirm the change before applying it.

## Session insights

Review conversation summaries at **Monitor** > **Session Insights**.

Session insights provide a structured summary of any conversation thread - what happened, what was found, and what was recommended.

### Generate insights

To generate a session insight:

1. Open any conversation thread in the chat interface.
1. Select the chart icon in the chat footer.
1. Your agent generates a structured insight from that thread.

### View insights

The Session Insights page uses a two-panel layout.

| Panel | What it shows |
|---|---|
| **Left (list)** | Insight cards sorted by date (newest first), showing title and timestamp |
| **Right (detail)** | Full insight content in Markdown, with a **Go to Thread** button to open the original conversation |

Use insights to review investigation quality, share findings with teammates, or audit your agent's reasoning on specific threads.

## Monitor navigation

The **Monitor** section in the sidebar provides additional observability tools.

| Item | What it opens |
|---|---|
| **Session Insights** | Conversation summaries (described in the previous section) |
| **Resource Mapping** | Visual graph of your monitored Azure resources |
| **Incident metrics** | Incident analytics dashboard (see [Track incident value](track-incident-value.md)) |
| **Logs** | Opens Azure Application Insights in a new tab for custom KQL queries |

## What makes this different

The following table compares manual monitoring to agent-assisted monitoring.

| Manual approach | With your agent |
|---|---|
| Check Azure billing portal for cost data | See AAU consumption directly in the agent portal |
| No per-day breakdown of AI usage | Daily bar chart shows consumption trends |
| Review conversation transcripts manually | Session insights summarize threads automatically |
| Unknown when allocation runs out | Progress bar and reset countdown keep you informed |

## Next step

> [!div class="nextstepaction"]
> [Audit agent actions](./audit-agent-actions.md)

## Related content

- [Track incident value](track-incident-value.md) - Incident metrics and daily reports.
- [Audit agent actions](audit-agent-actions.md) - Permissions, access control, and action logging.
- [Application Insights overview](/azure/azure-monitor/app/app-insights-overview) - Azure documentation for custom KQL queries.
