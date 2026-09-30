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

## Why use Azure Monitor alerts with SRE Agent?

Without automation, an alert often creates several kinds of work at once. Someone has to read the alert, decide whether it's new or recurring, open observability tools, correlate evidence, and keep track of status changes.

Azure SRE Agent reduces that overhead by connecting Azure Monitor alerting to the rest of your operational workflow:

- It uses the same managed identity you already scoped for the agent.
- It acknowledges alerts as it picks them up for investigation.
- It correlates alerts with logs, metrics, deployments, and other [connected data sources](connectors.md).
- It consolidates repeated firings from the same alert rule into a single active thread.

    | Severity | Label |
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

- The agent's managed identity has the **Monitoring Contributor** role on the subscription.
- Azure Monitor alert rules exist for resources in the subscriptions you expect the agent to scan.
- The alert rules actually fired in Azure Monitor.

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
