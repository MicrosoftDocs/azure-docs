---
title: Azure Monitor alerts in Azure SRE Agent
description: Learn how Azure SRE Agent uses Azure Monitor alerts to detect incidents, acknowledge them automatically, and start investigations without managing credentials.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: azure monitor, alerts, incident detection, managed identity, alert merging, automation
#customer intent: As an SRE, I want Azure Monitor alerts to open and track investigations automatically so I can reduce noisy duplicate incidents and respond faster.
---

# Azure Monitor alerts in Azure SRE Agent

Azure Monitor alerts tell you when something changes. Azure SRE Agent turns that signal into action. When an alert fires, the agent acknowledges it, opens an investigation thread, gathers context from connected tools, and keeps the thread in sync as the alert changes state.

This integration is designed for teams that already rely on Azure Monitor and want faster incident handling without adding another credential set or manually triaging repeated alerts.

> [!TIP]
> - Connect Azure Monitor from **Builder > Incident platform** and use the agent's managed identity for authentication.
> - The scanner checks for new alerts every minute and starts investigations automatically.
> - Repeated firings from the same alert rule merge into one investigation thread instead of creating duplicate work.
> - [Incident response plans](incident-response-plans.md) control which severities the agent handles and whether it acts autonomously or waits for approval.

## Why use Azure Monitor alerts with SRE Agent

Without automation, an alert often creates several kinds of work at once. Someone has to read the alert, decide whether it's new or recurring, open observability tools, correlate evidence, and keep track of status changes.

Azure SRE Agent reduces that overhead by connecting Azure Monitor alerting to the rest of your operational workflow:

- It uses the same managed identity you already scoped for the agent.
- It acknowledges alerts as it picks them up for investigation.
- It correlates alerts with logs, metrics, deployments, and other [connected data sources](connectors.md).
- It consolidates repeated firings from the same alert rule into a single active thread.

## Prerequisites

Before you connect Azure Monitor, make sure:

- Your agent is in the **Running** state.
- The agent's managed identity has the **Monitoring Contributor** role on the subscriptions that contain the relevant alert rules.
- Your [managed resource groups](complete-setup.md) are configured for the subscriptions you want the agent to monitor.

## Connect Azure Monitor

1. Open **Builder > Incident platform**.
1. Select **Azure Monitor**.
1. Save your changes.

After you save, the agent starts scanning subscriptions that contain your managed resource groups. A default incident response plan is created for **Sev3** alerts in autonomous mode.

To change which alerts the agent handles, create or update [incident response plans](incident-response-plans.md).

> [!NOTE]
> Your agent connects to one incident platform at a time. If your agent is already connected to PagerDuty or ServiceNow, disconnect that platform before you switch to Azure Monitor.

## How alert handling works

The scanner polls Azure Monitor every minute for alerts whose state is **New** and whose condition is **Fired**.

When it finds a qualifying alert, the agent:

1. Acknowledges the alert in Azure Monitor so the alert is marked as actively handled.
1. Checks whether an active investigation already exists for the same alert rule.
1. Creates a new investigation thread only when no matching active thread exists.
1. Begins investigating by using Azure data plus any other [connected sources](connectors.md) available to the agent.

Investigation threads use severity-prefixed titles such as **[Sev2] CPU Alert** so the urgency remains visible throughout the incident lifecycle.

## How recurring alert merging works

Repeated firings from the same alert rule don't always need separate investigations. If the agent finds an active thread for the same alert rule within the last seven days, it merges the new firing into the existing thread.

That merge behavior gives you one place to track the incident while still preserving evidence that the alert fired again.

| Scenario | Agent behavior |
|---|---|
| Matching active thread exists | Acknowledge the alert and merge it into the current thread |
| No matching active thread exists | Create a new investigation thread |

For example, if the same CPU alert fires five times during one ongoing issue, you see one thread with **Total alerts: 5** instead of five separate investigations.

> [!NOTE]
> A merged alert updates the existing thread, but it doesn't trigger a brand-new investigation. If you want the next firing to start fresh analysis, resolve or close the current thread first.

## How status sync works

Azure SRE Agent keeps the thread aligned with alert lifecycle changes. A background sync process checks Azure Monitor every five minutes for state transitions such as **Resolved** or **Closed**.

When an alert is resolved or closed, the agent can generate an AI-based root cause summary for the associated thread. Thread titles keep their severity prefix during these transitions.

The agent also records whether each incident was:

- **Mitigated by agent**
- **Mitigated by user**

You can review those outcomes in the [incident analytics](monitor-agent-usage.md) experience and in response-plan reporting.

## What makes this different

Azure Monitor integration is useful on its own, but the advantage of Azure SRE Agent is what happens after the alert is detected.

**No extra credentials to manage.** The integration uses the agent's managed identity instead of API keys or a separate OAuth setup.

**Automatic acknowledgment.** Alerts move out of the unowned state as soon as the agent starts working on them.

**Shared investigation context.** The agent brings together observability data, deployment history, and connected knowledge sources in one thread.

**Recurring alert consolidation.** Duplicate firings from the same alert rule roll up into one active investigation instead of flooding your queue.

## Before and after

| Area | Before | After |
|---|---|---|
| **Setup** | Configure credentials or external integrations manually | Select Azure Monitor and save |
| **Acknowledgment** | Manually mark the alert as being handled | Agent acknowledges automatically |
| **Investigation** | Open multiple tools and correlate evidence yourself | Agent gathers evidence across connected sources |
| **Repeated alerts** | Each firing can create new manual triage work | Repeated firings merge into one thread |
| **Resolution summary** | Write the summary yourself after the incident | Agent can generate a root cause summary on resolution |

## Viewing alert details in the incident list

The incident list adds Azure Monitor-specific details so you can see how often an alert rule fired and when the latest firing occurred.

| Column | What it shows |
|---|---|
| **Total alerts** | How many times the same alert rule fired for the investigation |
| **Last fired** | The timestamp of the most recent firing |

Select **Total alerts** to open the alert details dialog for the thread.

| Field | What it shows |
|---|---|
| **Alert ID** | The Azure Monitor alert GUID, with copy support |
| **Fired at** | When that alert instance fired |
| **Alert status** | Current state, such as New, Acknowledged, or Resolved |
| **Alert condition** | Whether the condition is Fired or Resolved |
| **Azure Monitor** | Link to open the alert in Azure portal |

## Control which alerts your agent handles

[Incident response plans](incident-response-plans.md) determine which Azure Monitor alerts the agent investigates and how much autonomy it has when responding.

From **Builder > Incident response plans**, you can configure:

- **Severity levels** to match, from Sev0 through Sev4
- **Title pattern** filters
- **Autonomy level**, such as autonomous or manual approval
- A specialized [custom agent](create-subagent.md) for targeted handling

The default plan created during setup handles **Sev3** alerts in **Autonomous** mode. Create additional plans if you want coverage for other severities or different routing logic.

### Azure Monitor severity mapping

| Azure Monitor severity | Description |
|---|---|
| Sev0 | Critical |
| Sev1 | Error |
| Sev2 | Warning |
| Sev3 | Informational |
| Sev4 | Verbose |

## Scanner behavior

| Setting | Value |
|---|---|
| Scan interval | 1 minute |
| Alerts per API call | 250 |
| Initial scan lookback | 1 day |
| Maximum scan window | 29 days |
| Merge lookback | 7 days |
| Status sync interval | 5 minutes |

If alerts don't appear after you connect Azure Monitor, verify the following conditions:

1. The agent's managed identity has the **Monitoring Contributor** role on the subscription.
1. Azure Monitor alert rules exist for resources in the subscriptions you expect the agent to scan.
1. The alert rules actually fired in Azure Monitor.

## Get started

Connect Azure Monitor from **Builder > Incident platform** and save. Alerts for subscriptions in scope begin flowing to the agent within a few minutes.

| Resource | What you learn |
|---|---|
| [Automate incident response](automate-incidents.md) | End-to-end incident setup, including managed resource groups and response plans |

## Related content

- [Incident response](incident-response.md)
- [Incident response plans](incident-response-plans.md)
- [Root cause analysis](root-cause-analysis.md)
- [Diagnose with Azure observability](diagnose-azure-observability.md)
- [Track incident value](track-incident-value.md)
