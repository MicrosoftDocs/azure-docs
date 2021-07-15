---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Analyze
description: Describes the different features of Azure Monitor that allow you to analyze the health and performance of your AKS cluster.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Analyze data
This article is part of the Monitoring AKS in Azure Monitor scenario. Once you’ve enabled Container insights on your AKS clusters, data will be available for analysis. This article describes the different features of Azure Monitor that allow you to analyze the health and performance of your AKS clusters. It's broken down into the layers described in [Layers of monitoring](monitor-aks.md#lasyers-of-monitoring).

## Monitoring tools
[Prometheus](https://prometheus.io/) and [Grafana](https://www.prometheus.io/docs/visualization/grafana/) are CNCF backed widely popular open source tools for kubernetes monitoring. AKS exposes many metrics in Prometheus format which makes Prometheus a popular choice for monitoring.

[Container insights](../containers/container-insights-overview.md) in AzureMonitor has native integration with AKS, collecting critical metrics and logs, alerting on identified issues, and providing visualization with workbooks.  Container insights collects certain Prometheus metrics, and many native Azure Monitor insights are built-up on top of Prometheus metrics. Container insights complements and completes E2E monitoring of AKS including log collection which Prometheus as stand-alone tool doesn’t provide. Many customers use Prometheus integration and Azure Monitor together for E2E monitoring.

## Menu options

Access Azure Monitor features for all AKS clusters in your subscription from the **Monitor** menu in the Azure portal or for a single AKS cluster from the **Monitor** section of the **Kubernetes services** menu. The screenshot below shows the cluster's **Monitor** menu.

| Menu option | Description |
|:---|:---|
| Insights | Opens container insights for the current cluster. Select **Containers** from the **Monitor** menu to open container insights for all clusters.  |
| Alerts | Views alerts for the current cluster. |
| Metrics | Open metrics explorer with the scope set to the current cluster. |
| Diagnostic settings | Create diagnostic settings for the cluster to collect resource logs. |
| Advisor | recommendations	Recommendations for the current virtual machine from Azure Advisor. |
| Logs | Open Log Analytics with the scope set to the current cluster to analyze log data. |
| Workbooks | Open workbook gallery for Kubernetes service. |

## Container insights
You will typically start with [Container insights](container-insights-overview.md) for analyzing the health and performance of the different components of your AKS cluster. Container insights provides interactive views and workbooks that analyze collected data for a variety of monitoring scenarios. You don't need to know anything about the underlying data to use Container insights.

## Analyze metric data with metrics explorer
Use metrics explorer when you want to perform custom analysis of metric data collected for your containers. Metrics explorer allows you plot charts, visually correlate trends, and investigate spikes and dips in metrics' values. See [Getting started with Azure Metrics Explorer](../essentials/metrics-getting-started.md) for details on using this tool. 

For a list of the platform metrics collected for AKS, see [Monitoring AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics).

## Analyze log data with Log Analytics
Use Log Analytics when you want to dig deeper into the data used to create the views in Container insights. Log Analytics allows you to perform custom analysis of your log data. You don't necessarily need to understand how to write a log query to use Log Analytics. There are multiple prebuilt queries that you can select and either run without modification or use as a start to a custom query. Click **Queries** at the top of the Log Analytics screen and view queries with a **Resource type** of **Kubernetes Services**. 

See []

See [Using queries in Azure Monitor Log Analytics](../logs/queries.md) for information on using these queries and [Log Analytics tutorial](../logs/log-analytics-tutorial.md) for a complete tutorial on using Log Analytics to run queries and work with their results.

:::image type="content" source="media/monitor-aks/log-analytics-queries.png" alt-text="Log Analytics queries for Kubernetes" lightbox="media/monitor-aks/log-analytics-queries.png":::


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-aks-analyze.md)
