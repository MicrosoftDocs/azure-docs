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

When the same alert rule fires repeatedly during an ongoing issue, such as a CPU threshold breached every five minutes, each firing demands separate attention. By morning, you handled the same underlying problem twelve times.

> [!TIP]
> - Connect Azure Monitor in **Builder → Incident platform**. Your agent's managed identity handles authentication with no API keys or credentials needed.
> - The scanner detects new alerts every minute, acknowledges them in Azure Monitor, and creates investigation threads.
> - Recurring alerts from the same rule merge into one thread. Five firings become one investigation, not five.
> - [Incident response plans](incident-response-plans.md) control which severity levels your agent handles and whether it acts autonomously or waits for approval.

## How Azure Monitor integration works

Your agent connects to Azure Monitor through its managed identity. This is the same identity it uses to access your Azure resources. No API keys, no OAuth flows, no credential rotation.

### Prerequisites

- Your agent must be in **Running** state.
- The agent's managed identity needs **Monitoring Contributor** role on the subscriptions containing your alert rules (assigned automatically during agent creation).
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

When the same alert rule fires again while an active investigation already exists, the new alert merges silently into the existing thread:

1. The scanner checks for active (non-resolved, non-closed) threads from the same alert rule within the last seven days.
1. **If a thread exists**, the alert is acknowledged in Azure Monitor but merges into the existing thread with no new investigation. The total alert count increments and the latest fire time updates.
1. **If no active thread exists**, a new investigation thread is created.

Five firings of the same alert rule produce one investigation thread with **Total alerts: 5**.  The thread doesn't produce five separate threads investigating the same problem.

> [!NOTE]
> **Merge window and stale investigations:** The seven-day merge window means recurring alerts are consolidated, but the agent doesn't re-investigate when a new alert merges into an existing thread. If an investigation is several days old and the same alert fires again, the new firing is recorded but no fresh diagnosis runs. To trigger a new investigation, resolve or close the existing thread. This way, the next alert firing creates a fresh thread with a new investigation.

### Status sync

A background process checks Azure Monitor every five minutes for status changes. When an alert transitions to resolved or closed, the agent generates an AI root cause summary for the investigation thread.

Thread titles preserve their severity prefix through status transitions. For example, **[Sev2] CPU Alert** stays **[Sev2] CPU Alert**.

The agent tracks whether each incident was **mitigated by agent** or **mitigated by user**. These counts appear in the [incident analytics](monitor-agent-usage.md) dashboard and in per-response-plan breakdowns, so you can measure how much investigation work the agent handles autonomously.

## What makes this different

**Zero-credential setup.** PagerDuty requires an API key. ServiceNow requires a username and password or an OAuth flow. Azure Monitor uses your agent's managed identity. Select the platform, save, and alerts start flowing.

**Automatic acknowledgment.** The agent acknowledges alerts in Azure Monitor the moment it creates an investigation thread. Your alert dashboard stays clean and reflects what's being actively investigated.

**Recurring alert consolidation.** Instead of flooding your incident list with duplicate threads for the same problem, the agent merges recurring alerts from the same rule into one thread. You see the total count and can click through to every individual alert instance.

---

## Before and after

|  | Before | After |
|---|--------|-------|
| **Setup** | Configure API keys, OAuth flows, or credential rotation | Select Azure Monitor, click Save |
| **Alert acknowledgment** | Manual: open Azure portal, change state | Automatic: agent acknowledges on detection |
| **Investigation** | Open 5+ tools, correlate manually | Agent queries all connected sources automatically |
| **Recurring alerts** | 5 firings = 5 separate investigations | 5 firings = 1 thread, Total alerts: 5 |
| **Individual alert tracking** | Scroll through Azure portal alert list | Click Total alerts count to see every instance with portal links |
| **Resolution analysis** | Write your own post-incident summary | AI root cause summary generated on alert resolution |
| **Resolution tracking** | No data on who resolved what | Analytics show mitigated by agent vs mitigated by user |

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
| Merge lookback | 7 days (active threads from same alert rule) |
| Status sync interval | 5 minutes |

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
