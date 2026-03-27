---
title: PagerDuty Incident Indexing in Azure SRE Agent
description: Learn how your agent picks up PagerDuty incidents, investigates using connected data sources, and tracks resolution metrics automatically.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: pagerduty, incidents, indexing, on-call, MTTR, investigation, response plans, severity, priority
#customer intent: As an SRE, I want my agent to pick up PagerDuty incidents automatically so that it can investigate and resolve them without manual context-switching.
---

# PagerDuty incident indexing in Azure SRE Agent

Your agent picks up PagerDuty incidents within minutes of firing, investigates using all connected data sources, and tracks resolution metrics over time.

> [!TIP]
> - Your agent picks up PagerDuty incidents within 1–2 minutes of firing.
> - It investigates using all connected data sources, such as Azure Monitor, Kusto, GitHub, and more.
> - It acknowledges, resolves, or escalates based on your [response plan](incident-response-plans.md) configuration.
> - Resolution metrics are tracked automatically. See agent-resolved versus human-resolved trends.

## The problem: PagerDuty fires, you context-switch

When a PagerDuty alert fires, you're not just reading a notification, you're starting a manual investigation. Open PagerDuty for the incident details, then Azure Monitor for metrics, then your logs for errors, then GitHub for recent deployments. By the time you gather enough context to form a theory, 30 minutes have passed.

Meanwhile, MTTR tracking lives in spreadsheets or PagerDuty analytics, disconnected from what the agent learned during past investigations. Knowledge from resolved incidents stays in engineers' heads, lost when the team rotates.

## How PagerDuty incident indexing works

When you connect PagerDuty to your agent, the following process runs automatically.

**Scanner polls every minute**: Your agent checks PagerDuty for new incidents matching your response plan filters, such as priority, service, and incident type. Connect by using a PagerDuty API access key from your [PagerDuty API Access Keys](https://support.pagerduty.com/main/docs/api-access-keys) settings.

**Priority mapping**: PagerDuty priorities (P1–P5) map to agent severity levels (1–5), so your response plans filter consistently regardless of which incident platform you use.

**Status sync**: PagerDuty incident status (Triggered → Acknowledged → Resolved) maps to agent status. When the agent resolves an incident, it tracks whether it was agent-mitigated, agent-assisted, or human-resolved.

From there, the agent follows the same [investigation and response flow](incident-response.md) as any other incident platform.

## What makes this approach different

PagerDuty incident indexing goes beyond traditional PagerDuty automation in several key ways.

**Unlike PagerDuty's built-in automation**, which runs predefined workflows, your agent reasons about each incident individually. It correlates evidence across all your data sources, forms hypotheses, and validates them and adapts its approach based on what it finds.

**Unlike static runbooks**, your agent learns from every resolved incident. AI analysis captures root cause summaries and extracted knowledge, building institutional memory that survives team rotation.

**Unlike manual investigation**, your agent starts within seconds of the alert firing. No context-switching between tools. No waking up at 3 AM to manually correlate logs and metrics.

## Before and after

The following table compares manual PagerDuty incident response with agent-assisted incident response.

| Area | Before | After |
|---|---|---|
| **Acknowledgment** | Wait for on-call to see PagerDuty alert | Agent acknowledges in seconds |
| **Investigation** | Open 5+ tools, manually correlate data | Agent queries all sources automatically |
| **Time to root cause** | 30–60 minutes of manual work | 2–5 minutes, automated |
| **Knowledge captured** | In engineer's head, lost on rotation | Saved to agent memory |
| **Resolution tracking** | Manual MTTR tracking | Automated: agent-resolved vs. human-resolved |

## PagerDuty priority mapping

PagerDuty priorities map directly to the agent's severity classification.

| PagerDuty priority | Agent severity | Quickstart response plan |
|---|---|---|
| P1 | 1 (Critical) | ✅ Autonomous response |
| P2 | 2 (High) | — |
| P3 | 3 (Moderate) | — |
| P4 | 4 (Low) | — |
| P5 | 5 (Informational) | — |

The agent stores PagerDuty urgency (high or low) for reference but it doesn't affect agent routing. Priority is the primary severity signal your response plans use.

## Incident status normalization

The following table shows how PagerDuty incident statuses map to agent statuses.

| PagerDuty status | Agent status | What happens |
|---|---|---|
| Triggered | Active | Agent begins investigation |
| Acknowledged | Active | Investigation continues |
| Resolved | Resolved | AI analysis generates root cause summary |

When the agent resolves a PagerDuty incident, it records an `SREAgent_Resolved` tag on the incident in the agent's own database. You can use this tag to distinguish agent-resolved from human-resolved incidents in the agent's analytics. The tag isn't written back to PagerDuty.

## Get started

For a step-by-step guide, see [Tutorial: Connect to PagerDuty](connect-pagerduty.md).

## Next step

> [!div class="nextstepaction"]
> [Set up an incident trigger](./response-plan.md)

## Related content

- [Incident response](incident-response.md) - How your agent investigates and responds to all incident types.
- [Incident response plans](incident-response-plans.md) - Configure autonomy levels for different incident types and priorities.
- [Root cause analysis](root-cause-analysis.md) - AI-driven hypothesis formation and evidence validation.
- [Memory and knowledge](memory.md) - How resolved incident knowledge improves future investigations.
- [Connectors](connectors.md) - Data sources your agent uses during investigation.
