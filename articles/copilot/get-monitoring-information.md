---
title: Get information about Azure Monitor metrics and logs using Microsoft Copilot in Azure
description: Learn about scenarios where Microsoft Copilot in Azure can provide information about Azure Monitor metrics and logs.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Get information about Azure Monitor metrics, logs, and alerts using Microsoft Copilot in Azure (preview)

You can ask Microsoft Copilot in Azure (preview) questions about metrics and logs collected by [Azure Monitor](/azure/azure-monitor/), and about Azure Monitor alerts.

When you ask Microsoft Copilot in Azure for this information, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context of a query isn't clear, you'll be prompted to specify the resource for which you want information.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Answer questions about Azure Monitor platform metrics

Use Microsoft Copilot in Azure to ask questions about your Azure Monitor metrics. When asked about metrics for a particular resource, Microsoft Copilot in Azure generates a graph, summarizes the results, and allows you to further explore the data in Metrics Explorer. When asked about what metrics are available, Microsoft Copilot in Azure describes the platform metrics available for the given resource type.

### Platform metrics sample prompts

Here are a few examples of the kinds of prompts you can use to get information about Azure Monitor platform metrics. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "What platform metrics are available for my VM?"
- "Show me the memory usage trend for my VM over the last 4 hours"
- "Show trends for network bytes in over the last day"
- "Give me a chart of os disk latency statistics for the last week"

## Answer questions about Azure Monitor logs

When asked about logs for a particular resource, Microsoft Copilot in Azure generates an example KQL expression and allows you to further explore the data in Azure Monitor logs. This capability is available for all customers using Log Analytics, and can be used in the context of a particular Azure Kubernetes Service (AKS) cluster that uses Azure Monitor logs.

To get details about your container logs, start on the **Logs** page for your AKS cluster.

### Logs sample prompts

Here are a few examples of the kinds of prompts you can use to get information about Azure Monitor logs for an AKS cluster. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Are there any errors in container logs?"
- "Show logs for the last day of pod <provide_pod_name> under namespace <provide_namespace>"
- "Show me container logs that include word 'error' for the last day for namespace 'xyz'"
- "Check in logs which containers keep restarting"
- "Show me all Kubernetes events"

## Answer questions about Azure Monitor alerts

Use Microsoft Copilot in Azure (preview) to ask questions about your Azure Monitor alerts. When asked about alerts, Microsoft Copilot in Azure (preview) summarizes the list of alerts, their severity, and allows you to further explore the data in the alerts page. 

### Sample prompts

Here are a few examples of the kinds of prompts you can use to get information about Azure Monitor alerts. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Are there any alerts for my resource?"
- "Tell me more about these alerts. How many critical alerts are there?"
- "Show me all the alerts in my resource group"
- "List all the alerts for the subscription"
- "Show me all alerts triggered during the last 24 hours"


## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Azure Monitor](/azure/azure-monitor/) and [how to use it with AKS clusters](/azure/aks/monitor-aks).
