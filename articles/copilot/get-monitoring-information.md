---
title: Get information about Azure Monitor metrics and logs using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can provide information about Azure Monitor metrics and logs.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.author: jenhayes
author: JnHs
---

# Get information about Azure Monitor metrics and logs using Microsoft Copilot for Azure (preview)

You can ask Microsoft Copilot for Azure (preview) questions about metrics and logs collected by [Azure Monitor](/azure/azure-monitor/).

When you ask Microsoft Copilot in Azure (preview) to provide these recommendations, it automatically pulls context when possible, based on the previous conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the resource for which you want information.

## Answer questions about Azure Monitor platform metrics

Use Microsoft Copilot for Azure (preview) to ask questions about your Azure Monitor metrics. When asked about metrics for a particular resource Copilot will generate a graph, summarize the results, and allow you to further explore the data in Metrics Explorer. When asked about what metrics are available, Microsoft Copilot for Azure (preview) will describe the platform metrics available for the given resource type. For example, when reviewing platform metrics for an AKS cluster you can optionally choose to run an anomaly analysis to analyze spikes in metrics and see recommendations to address the issue.

## Sample prompts

- "What platform metrics are available for my VM?"
- "Show me the memory usage trend for my VM"
- "How much disk free space does my VM have?"
- "Show me the platform metrics for the network in/out trend for my AKS cluster"
- "Run an anomaly analysis on my AKS cluster"

## Answer questions about Managed Prometheus metrics

Use Microsoft Copilot for Azure (preview) to ask questions about your Azure Monitor managed service for Prometheus metrics. When asked about metrics for a particular resource, Microsoft Copilot for Azure (preview) will generate an example PromQL expression and allow you to further explore the data in Prometheus Explorer. This capability is available for all customers using Managed Prometheus. It can be used in the context of either an Azure Monitor workspace or a particular Azure Kubernetes Service cluster that is using Managed Prometheus.

### Sample prompts

- "How many pods are present in each workload and workload type?"
- "Get the node load for this cluster"
- "What is the memory usage of my containers?"
- "Get the memory requests of pod <provide_pod_name> under namespace <provide_namespace>"
- "Show me the container reads by namespace"

## Answer questions about Azure Monitor logs

Use Microsoft Copilot for Azure (preview) to ask questions about your Azure Monitor log data. When asked about logs for a particular resource, Microsoft Copilot for Azure (preview) generates an example KQL expression and allows you to further explore the data in Azure Monitor logs. This capability is available for all customers using Log Analytics, and can be used in the context of a particular Azure Kubernetes Service cluster that is using Azure Monitor logs.

### Sample prompts

- "Are there any errors in container logs?"
- "show logs for the last day of pod <provide_pod_name> under namespace <provide_namespace>"
- "show me container logs that include word 'error' for the last day for namespace 'xyz'"
- "check in logs which containers keep restarting"
- "Show me all Kubernetes events"

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Monitor](/azure/azure-monitor/).
