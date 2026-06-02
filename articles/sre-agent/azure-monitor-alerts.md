---
title: Azure Monitor Alerts in Azure SRE Agent
description: Learn how Azure SRE Agent connects to Azure Monitor to detect, acknowledge, and investigate alerts automatically with zero credentials.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: azure monitor, alerts, incident detection, managed identity, alert merging, zero-config
---

# Azure Monitor Alerts in Azure SRE Agent

When an Azure Monitor alert fires, you open the Azure portal to read the alert details. Then you switch to Log Analytics to check for errors. Then Application Insights for exceptions. Then deployment history to see if someone pushed a change. Each tool switch costs time and breaks your focus.

Noisy alerts make it worse. A CPU threshold breached every five minutes generates a new alert each time — and each one sits in your queue demanding separate acknowledgment, triage, and investigation. By morning, you handled the same underlying problem twelve times with no consolidated view of what happened. The signal is buried under duplicate noise.

> [!TIP]
> - Connect Azure Monitor in **Builder → Incident platform**. Your agent's managed identity handles authentication with no API keys or credentials needed.
> - The scanner detects new alerts every minute, acknowledges them in Azure Monitor, and creates investigation threads.
> - Recurring alerts from the same rule merge into one thread within a configurable cooldown window (default 3 hours). Five firings become one investigation, not five.
> - [Incident response plans](incident-response-plans.md) control which severity levels your agent handles and whether it acts autonomously or waits for approval.

## How Azure Monitor integration works

Your agent connects to Azure Monitor through its managed identity. This is the same identity it uses to access your Azure resources. No API keys, no OAuth flows, no credential rotation.

### Prerequisites

- Your agent must be in **Running** state.
- The agent's managed identity needs **Monitoring Contributor** role on the subscriptions containing your alert rules — assigned automatically when you add managed resource groups during agent creation, or when you connect Azure Monitor as your incident platform.
- [Managed resource groups](complete-setup.md) determine which subscriptions the agent scans. The agent monitors all Azure Monitor alerts across each subscription that contains a managed resource group.

Go to **Builder → Incident platform**, select **Azure Monitor** from the dropdown, and save.

After saving, your agent begins scanning for alerts across the subscriptions that contain your managed resource groups. A default incident response plan is created that handles Sev3 alerts in autonomous mode. You can [create additional response plans](incident-response-plans.md) for other severity levels.

> [!NOTE]
> **One platform at a time:** Your agent connects to one incident platform at a time. To switch from PagerDuty or ServiceNow to Azure Monitor, disconnect the current platform first.

### Alert detection and acknowledgment

The scanner polls Azure Monitor every minute for new alerts. When it finds an alert with state "New" and condition "Fired":

1. **Acknowledges the alert** in Azure Monitor. The state changes from New to Acknowledged so other tools know it's being handled.
1. **Checks for existing investigations**. If an active thread already exists for the same alert rule, the alert [merges into that thread](#recurring-alert-merging) instead of creating a new one.
1. **Creates an investigation thread** (for new alerts only) with a severity-prefixed title (for example, **[Sev2] CPU Alert**).
1. **Begins investigating** using all your [connected data sources](connectors.md) - correlating logs, metrics, and deployment history.

### Recurring alert merging

When the same alert rule fires again while an investigation already exists, the agent can merge the new alert into the existing thread instead of starting a new investigation. This behavior is controlled per response plan.

| Setting | Default | Range |
|---------|---------|-------|
| **Merge recurring alerts** | Enabled | On / Off |
| **Cooldown time** | 3 hours | 1-24 hours |

When the cooldown is **enabled** (default):

1. If an active thread exists for the same alert rule within the cooldown window, the new alert merges silently. The total alert count increments and the latest fire time updates, but no new investigation starts.
1. If the previous thread was resolved or closed within the cooldown window, the agent reopens it instead of creating a new thread.
1. If no thread exists within the cooldown window, a new investigation thread is created.

Five firings of the same alert rule within the cooldown window produce one investigation thread with **Total alerts: 5**.

When the cooldown is **disabled**:

- Every alert fire creates a new investigation thread, even from the same rule.

> [!WARNING]
> Disabling the cooldown means every fire of a noisy alert rule triggers a new investigation. For rules that fire frequently (such as CPU or memory threshold alerts), this approach can significantly increase token consumption.

### Status sync

A background process checks Azure Monitor every two minutes for status changes. When an alert transitions to resolved or closed, the agent generates an AI root cause summary for the investigation thread.

Thread titles preserve their severity prefix through status transitions. For example, **[Sev2] CPU Alert** stays **[Sev2] CPU Alert**.

The agent tracks whether each incident was **mitigated by agent** or **mitigated by user**. These counts appear in the [incident analytics](monitor-agent-usage.md) dashboard and in per-response-plan breakdowns, so you can measure how much investigation work the agent handles autonomously.

## What's supported

| Feature | How it works |
|---------|-------------|
| **Zero-credential setup** | Agent's managed identity handles authentication — select the platform, save, and alerts start flowing |
| **Automatic acknowledgment** | Agent acknowledges alerts in Azure Monitor the moment it creates an investigation thread |
| **Recurring alert merging** | Same alert rule fires merge into one thread within a configurable cooldown window (default 3 hours) |
| **Resolved thread reopening** | If a resolved thread is within the cooldown window, the agent reopens it instead of creating a new thread |
| **AI root cause summary** | Generated automatically when an alert resolves |
| **Mitigation tracking** | Analytics show mitigated by agent vs mitigated by user |

---

## Viewing alerts in the incident list

The incident list includes two columns specific to Azure Monitor:

- **Total alerts**: The number of times the same alert rule fired for this investigation. Select to view details.
- **Last fired**: When the most recent alert for this rule occurred.

Select any **Total alerts** count to open a dialog that shows every alert instance:

| Column | What it shows |
|--------|--------------|
| **Alert id** | The alert GUID with a copy button |
| **Fired at** | When this specific alert instance fired |
| **Alert status** | Current status (New, Acknowledged, Resolved) |
| **Alert condition** | Whether the alert condition is Fired or Resolved |
| **Azure Monitor** | Link to view the alert in Azure portal |

## Controlling which alerts your agent handles

Incident response plans define which alerts your agent investigates and how much autonomy it has. Go to **Builder** > **Incident response plans** to create or modify plans.

Each plan specifies:

- **Severity levels**: Which Azure Monitor severities to match (Sev0 through Sev4).
- **Title pattern**: Filter alerts by title content (include or exclude specific keywords).
- **Autonomy level**: Autonomous (agent acts independently) or Manual (agent proposes, you approve).
- **Custom response plan**: Route alerts to a specific [custom agent](sub-agents.md) for specialized response.

Response plans also support custom investigation instructions, deep investigation toggles, and trigger event configuration. For full details, see [Incident response plans](incident-response-plans.md).

The default response plan created during setup handles **Sev3** alerts in **Autonomous** mode. To handle other severity levels, create additional response plans.

### Azure Monitor severity mapping

| Azure Monitor Severity | Description |
|------------------------|-------------|
| Sev0 | Critical |
| Sev1 | Error |
| Sev2 | Warning |
| Sev3 | Informational |
| Sev4 | Verbose |

## Scanner behavior

| Setting | Value |
|---------|-------|
| Scan interval | 1 minute |
| Alerts per API call | 250 |
| Initial scan lookback | 1 day |
| Maximum scan window | 29 days |
| Merge cooldown | 3 hours default (configurable 1-24 hours per response plan) |
| Status sync interval | 2 minutes |

> [!NOTE]
> If alerts don't appear after connecting, verify:
> 1. The agent's managed identity has **Monitoring Contributor** role on the subscription.
> 1. Azure Monitor alert rules exist on resources in your managed resource groups.
> 1. Alert rules actually fired (check Azure Monitor → Alerts in Azure portal).

## Related content

| Capability | What it adds |
|--|--|
| [Incident response](incident-response.md) | How your agent investigates and responds to all incident types |
| [Incident response plans](incident-response-plans.md) | Control which alerts your agent handles with severity routing and autonomy levels |
| [Root cause analysis](root-cause-analysis.md) | AI-driven hypothesis formation and evidence validation |
| [Azure Observability](diagnose-azure-observability.md) | Built-in Azure diagnostic tools for investigation |
| [Track incident value](track-incident-value.md) | Measure alert resolution effectiveness over time |
