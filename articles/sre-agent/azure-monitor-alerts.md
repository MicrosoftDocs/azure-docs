---
title: 'Azure Monitor Alerts'
description: 'Connect Azure Monitor to your agent with zero credentials so alerts are detected, acknowledged, and investigated automatically.'
author: dchelupati
ms.author: dchelupati
ms.date: 04/01/2026
ms.topic: how-to
ms.service: azure-sre-agent
ai-usage: ai-assisted
---

# Azure Monitor alerts

Connect Azure Monitor through the agent's managed identity—no API keys or credentials needed. The scanner detects new alerts every minute, acknowledges them, and creates investigation threads automatically.

> [!TIP]
> - Zero-credential setup—uses the agent's managed identity
> - Detects new alerts every minute and creates investigation threads
> - Recurring alerts from the same rule merge into one thread

## How it works

Azure Monitor is the default incident platform for Azure SRE Agent. When your agent has Reader access to Azure subscriptions, it automatically detects Azure Monitor alerts and creates investigation threads.

The alert scanner runs every minute and performs these actions:

1. **Detects** new fired alerts across your monitored subscriptions
2. **Acknowledges** each alert to prevent duplicate investigations
3. **Creates** an investigation thread with the alert context
4. **Merges** recurring alerts from the same alert rule into a single thread

## Alert merging

When the same alert rule fires multiple times, the agent merges these alerts into a single investigation thread instead of creating separate threads for each firing. This consolidates related signals and prevents alert fatigue.

## Prerequisites

- An Azure SRE Agent in **Running** state
- Azure subscriptions added to the agent's monitored scope
- The agent's managed identity needs **Reader** role on the monitored subscriptions
- The agent's managed identity needs **Monitoring Contributor** role at subscription scope for alert management (assigned automatically during agent creation through the portal)

## Related content

- [Incident response](incident-response.md)
- [Incident response plans](incident-response-plans.md)
- [Diagnose with Azure observability](diagnose-azure-observability.md)
