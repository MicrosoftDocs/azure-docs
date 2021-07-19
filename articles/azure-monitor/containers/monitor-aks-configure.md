---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Configure
description: Describes how to configure AKS clusters for monitoring in Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Configuration
This article is part of the Monitoring AKS in Azure Monitor scenario. It describes how to configure monitoring for your AKS cluster.
## Create Log Analytics workspace
You require at least one Log Analytics workspace to support Container insights and to collect telemetry from the Log Analytics agent that's installed on your cluster. There is no cost for the workspace, but you do incur ingestion and retention costs when you collect data. See [Manage usage and costs with Azure Monitor Logs](../logs/manage-cost-storage.md) for details.

If you're just getting started with Azure Monitor, then start with a single workspace and consider creating additional workspaces as your requirements evolve. Many environments will use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by [Azure Security Center and Azure Sentinel](../vm/monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. 

See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for details on logic that you should consider for designing a workspace configuration.

## Enable container insights
When you enable Container insights for your AKS cluster, it deploys a containerized version of the Log Analytics agent that sends data to Azure Monitor. There are multiple methods to enable it depending whether you're working with a new or existing AKS cluster. See [Enable Container insights](container-insights-onboard.md) for prerequisites and configuration options.


## Configure collection from Prometheus
Container insights allows you to collect Prometheus metrics in your Log Analytics workspace without requiring a Prometheus server. You can analyze this data using Azure Monitor features along with other data collected by Container insights. See [Configure scraping of Prometheus metrics with Container insights](container-insights-prometheus-integration.md) for details on this configuration.


## Collect resource logs
The logs for AKS control plane components are implemented in Azure as [resource logs](../essentials/resource-logs.md). Container insights doesn't currently use these logs, so you do need to create your own log queries to view and analyze them. See [Analyze log data with Log Analytics](monitor-aks-analyze.md#analyze-log-data-with-log-analytics) for details on the structure of these logs and how to write queries for them.

There is a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. See [Resource logs](../../aks/monitor-aks-reference.md#resource-logs) for a description of the categories that are available for AKS and [Manage usage and costs with Azure Monitor Logs](../logs/manage-cost-storage.md) for details on the cost of ingesting and retaining log data. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs.

You need to create a diagnostic setting to collect resource logs. You can send the logs to multiple locations, but the most common is to send to the Log Analytics workspace that you configured to support Container insights. See [Create diagnostic settings to send platform logs and metrics to different destinations](../essentials/diagnostic-settings.md) to create a diagnostic setting for your AKS cluster to send these logs to your Log Analytics workspace. 

## Next steps

* [Analyze monitoring data collected for AKS clusters.](monitor-aks-analyze.md)
