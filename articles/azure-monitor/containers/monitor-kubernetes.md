---
title: Monitor Kubernetes clusters using Azure services and cloud native tools
description: Describes how to monitor the health and performance of the different layers of your Kubernetes environment using Azure Monitor and cloud native services in Azure.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Monitor Kubernetes clusters using Azure services and cloud native tools

This article describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure and cloud native services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues. 

> [!IMPORTANT]
> This article provides complete guidance on monitoring the different layers of your Kubernetes environment based on Azure Kubernetes Service (AKS) or Kubernetes clusters in other clouds using services in Azure. If you're just getting started with AKS, see [Monitoring AKS](../../aks/monitor-aks.md) for basic information for getting started monitoring an AKS cluster.

## Layers of Kubernetes environment

Following is an illustration of a common bottoms-up approach of a typical Kubernetes environment, starting from infrastructure up through applications. Each layer has distinct monitoring requirements that are addressed by different Azure services and managed by different roles in the organization.

:::image type="content" source="media/monitor-containers/layers-with-roles.png" alt-text="Diagram of layers of Kubernetes environment with related administrative roles." lightbox="media/monitor-containers/layers-with-roles.png"  border="false":::

## Roles
Responsibility for the [different layers of a a Kubernetes environment and the applications that depend on it](monitor-kubernetes-analyze.md) are typically shared by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide different monitoring scenarios that each will typically encounter.

| Roles | Description |
|:---|:---|
| [Cluster administrator](monitor-kubernetes-cluster-administrator.md) | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](monitor-kubernetes-developer.md) | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](monitor-kubernetes-network-engineer.md) | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Analyze log data with Log Analytics

Select **Logs** to use the Log Analytics tool to analyze resource logs or dig deeper into data used to create the views in Container Insights. Log Analytics allows you to perform custom analysis of your log data.

For more information on Log Analytics and to get started with it, see:

- [How to query logs from Container Insights](container-insights-log-query.md)
- [Using queries in Azure Monitor Log Analytics](../logs/queries.md)
- [Monitoring AKS data reference logs](../../aks/monitor-aks-reference.md#azure-monitor-logs-tables)
- [Log Analytics tutorial](../logs/log-analytics-tutorial.md)

You can also use log queries to analyze resource logs from AKS. For a list of the log categories available, see [AKS data reference resource logs](../../aks/monitor-aks-reference.md#resource-logs). You must create a diagnostic setting to collect each category as described in [Collect control plane logs for AKS clusters](monitor-kubernetes-configure.md#collect-control-plane-logs-for-aks-clusters) before the data can be collected.

## Analyze metric data with the Metrics explorer

Use the **Metrics** explorer to perform custom analysis of metric data collected for your containers. It allows you plot charts, visually correlate trends, and investigate spikes and dips in your metrics values. You can create metrics alert to proactively notify you when a metric value crosses a threshold and pin charts to dashboards for use by different members of your organization.

For more information, see [Getting started with Azure Metrics Explorer](..//essentials/metrics-getting-started.md). For a list of the platform metrics collected for AKS, see [Monitoring AKS data reference metrics](../../aks/monitor-aks-reference.md#metrics). When Container Insights is enabled for a cluster, [addition metric values](container-insights-update-metrics.md) are available.

:::image type="content" source="media/monitor-containers/metrics-explorer.png" alt-text="Metrics explorer" lightbox="media/monitor-containers/metrics-explorer.png":::



## See also

- See [Monitoring AKS](../../aks/monitor-aks.md) for guidance on monitoring specific to Azure Kubernetes Service (AKS).

