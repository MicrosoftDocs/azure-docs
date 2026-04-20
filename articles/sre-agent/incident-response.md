---
title: Automate Incident Response in Azure SRE Agent
description: Learn how your agent monitors, investigates, and resolves incidents automatically which learns from every fix to improve over time.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: incidents, pagerduty, servicenow, icm, azure-monitor, alerts, automation, acknowledge, diagnose, mitigate, MTTR, share, deep link, copy link
#customer intent: As an SRE, I want to automate incident response so that my agent can acknowledge, investigate, and resolve incidents without waking me up at 3 AM.
---

# Automate incident response in Azure SRE Agent
Your agent monitors, investigates, and resolves incidents while you sleep. It learns from every fix to get smarter over time. Stop switching context at 3 AM.

> [!VIDEO <VIDEO_URL>/Automated_Incident_Response.mp4]

> [!TIP]
> - Your agent acknowledges incidents and starts investigating within seconds.
> - It automatically correlates logs, metrics, deployments, and past incidents.
> - It proposes fixes or resolves autonomously based on your [run mode](run-modes.md).
> - Knowledge captured in [memory](memory.md) improves future incident handling.
> - Shares investigation threads with teammates via deep links.

## The problem: 3 AM, five tabs, one exhausted engineer

When an alert fires at 3 AM, you don't just wake up - you switch context. You open PagerDuty to see what's wrong, then Grafana for metrics, then Log Analytics for errors, then Slack to see if anyone else knows anything, then a runbook that was last updated six months ago.

Meanwhile, the clock is ticking on your mean time to resolution (MTTR). The knowledge of how to fix this issue exists either in a past incident, in a teammate's head, or in a runbook nobody reads. But at 3 AM, you can't find it.

## How your agent solves this problem

Your agent starts working within seconds when an incident occurs.

:::image type="content" source="media/incident-response/incident-response-flow.svg" alt-text="Diagram showing the incident response flow: alert fires, agent acknowledges, gathers context, forms hypotheses, validates, and resolves or escalates.":::

The agent follows these steps:

1. **Acknowledges the alert** in your incident platform (PagerDuty, ServiceNow, or Azure Monitor).
1. **Queries your observability tools** - Azure Monitor, Application Insights, plus any [connected sources](connectors.md) like Kusto or non-Microsoft tools via MCP.
1. **Correlates with deployment history** - if you connected [source control](connectors.md) or built a [deployment-aware custom agent](sub-agents.md).
1. **Checks memory for similar issues** - "We saw this exact error three weeks ago. Here's what fixed it."
1. **Forms hypotheses** about what went wrong and validates each one with evidence.
1. **Proposes a fix** or resolves autonomously based on your [run mode](run-modes.md).

By the time you wake up, the incident is either resolved with a full reasoning trail, or you have a clear recommendation waiting for your approval.

## What makes this approach different

Your agent improves traditional approaches in several key ways.

**Unlike runbooks**, your agent learns from every incident. When a fix works, it remembers. When you add a runbook to the [knowledge base](memory.md), your agent references it automatically. Runbooks go stale; your agent's memory grows smarter.

**Unlike scripts**, your agent adapts. A script runs the same steps regardless of context. Your agent [reasons about the specific situation](root-cause-analysis.md) and works to correlate evidence across all connected sources to understand what's wrong.

**Unlike dashboards**, your agent acts. Dashboards surface data for you to interpret. Your agent interprets the data, forms hypotheses, and proposes solutions. Once this work is complete, you're reviewing conclusions, not raw metrics.

## Before and after

The following table compares manual incident response with agent-assisted incident response.

| Area | Before | After |
|---|---|---|
| **Acknowledgment** | Wait for human to wake up | Agent acknowledges immediately |
| **Tools opened** | 5+ tabs | 0 (agent handles it) |
| **Investigation** | Manual correlation across tools | Agent queries all sources automatically |
| **Knowledge captured** | In engineer's head | Saved to memory |
| **Sleep interrupted** | Yes | No |
| **Sharing findings** | Screenshot or describe the navigation path | Copy thread link, paste in Teams |

## Share investigation threads

During an active incident, you need your team aligned on what the agent found. Every investigation thread has a **Copy link to thread** option that generates a shareable deep link. Paste it in Teams or Slack.

To copy a thread link:

1. Open any incident investigation thread.
2. Select the **⋯** (more options) button next to the thread title.
3. Select **Copy link to thread**.

The copied URL works across access methods. Recipients with access to your agent select the link and land directly on the investigation thread.

**When to share thread links:**
- During an incident bridge, share the agent's root cause analysis with the team.
- In post-incident reviews, link directly to the investigation thread as evidence.
- Send a specific finding to a teammate for a second opinion.

## Get started

| Resource | What you'll learn |
|----------|-------------------|
| [Automate incident response](incident-response.md) | Connect your incident platform, create response plans, and watch your agent handle a real incident |

## Next step

> [!div class="nextstepaction"]
> [Step 5: Automate actions](./automate-actions.md)

## Related content

- [Incident response plans](incident-response-plans.md) - Control which incidents your agent handles by using filters, severity routing, and infrastructure as code.
- [Deep investigation](deep-investigation.md) - Extended hypothesis-driven analysis for complex incidents.
- [Root cause analysis](root-cause-analysis.md) - Hypothesis-driven investigation.
- [Diagnose with Azure observability tools](diagnose-azure-observability.md) - Built-in Azure diagnostic tools.
- [Run modes](run-modes.md) - Control agent autonomy level.
