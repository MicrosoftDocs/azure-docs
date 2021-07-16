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
You require at least one Log Analytics workspace to support VM insights and to collect telemetry from the Log Analytics agent. There is no cost for the workspace, but you do incur ingestion and retention costs when you collect data. See [Manage usage and costs with Azure Monitor Logs](../logs/manage-cost-storage.md) for details.

Many environments will use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by [Azure Security Center and Azure Sentinel](../vm/monitor-virtual-machine-security.md), although many customers choose to segregate their availability and performance telemetry from security data. If you're just getting started with Azure Monitor, then start with a single workspace and consider creating additional workspaces as your requirements evolve.

See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for complete details on logic that you should consider for designing a workspace configuration.

## Enable container insights
[Container insights](container-insights-overview.md) is a feature of Azure Monitor that monitors the performance of managed Kubernetes clusters hosted on AKS in addition to other cluster configurations. Enabling Container insights for your AKS cluster deploys a containerized version of the Log Analytics agent that sends data to Logs and Metrics.

See [New AKS cluster](container-insights-enable-new-cluster.md) to enable container insights when a cluster is created. See [Existing AKS cluster](container-insights-enable-existing-clusters.md) to enable container insights for an existing cluster.


## Configure collection from Prometheus
Container insights allows you to collect Prometheus metrics into your Log Analytics workspace without requiring a Prometheus server. This data is written to the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table with other performance data collected by Container insights.

See [Configure scraping of Prometheus metrics with Container insights](container-insights-prometheus-integration.md#view-prometheus-metrics-in-grafana) for details on performing this configuration.


## Collect resource logs
The logs for AKS control plane components are implemented in Azure as [resource logs](../essentials/resource-logs.md). Container insights doesn't currently use these logs, so you do need to create your own log queries to view and analyze them. See [Analyze resource logs](monitor-aks-analyze.md#analyze-resource-logs) for details on the structure of these logs and how to write queries for them.

You need to create a diagnostic setting to collect resource logs. You can send the logs to multiple locations, but the most common is to send to the Log Analytics workspace that you configured to support Container insights. See [Create diagnostic settings to send platform logs and metrics to different destinations](../essentials/diagnostic-settings.md) to create a diagnostic setting for your AKS cluster to send these logs to your Log Analytics workspace. 

There is a cost for sending resource logs to a workspace, so you should only collect those log categories that you intend to use. See [Resource logs](monitor-aks-reference.md#resource-logs) for a description of the categories that are available for AKS and [Manage usage and costs with Azure Monitor Logs](../logs/manage-cost-storage.md) for details on the cost of ingesting and retaining log data. Start by collecting a minimal number of categories and then modify the diagnostic setting to collect additional categories as your needs increase and as you understand your associated costs.



## Next steps

* [Analyze monitoring data collected for AKS clusters.](monitor-aks-analyze.md)
