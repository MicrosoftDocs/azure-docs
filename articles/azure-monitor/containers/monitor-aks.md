---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor
description: Describes how to use Azure Monitor monitor the health and performance of AKS clusters and their workloads.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) machines with Azure Monitor
This scenario describes how to use Azure Monitor monitor the health and performance of Azure Kubernetes Service (AKS). It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.


This article introduces the scenario, provides general concepts for monitoring AKS in Azure Monitor. If you want to jump right into a specific area then please refer to the other articles that are part of this scenario described in the following table.

| Article | Description |
|:---|:---|
| [Enable monitoring](monitor-aks-configure.md) | Configuration of Azure Monitor required to monitor AKS clusters. This includes enabling container insights and collecting.  |
| [Analyze](monitor-aks-analyze.md) | Analyze the health and performance of different layers in and AKS environment to identify trends and critical information. |
| [Alerts](monitor-aks-alerts.md)   | Create alerts to proactively identify critical issues in your monitoring data. |

## Scope of the scenario
The [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) defines the [primary monitoring objectives](/azure/cloud-adoption-framework/strategy/monitoring-strategy#formulate-monitoring-requirements) you should focus on for you Azure resources. This scenario focuses on Health and Status monitoring using Azure Monitor.

This scenario is intended for customers using Azure Monitor to monitor AKS. It does not include the following, although this content may be added in subsequent updates to the scenario.

- Monitoring of Kubernetes clusters outside of Azure except for referring to existing content for Azure Arc enabled Kubernetes. 
- Monitoring of AKS with tools other than Azure Monitor except to fill gaps in Azure Monitor and Container Insights.



> [!NOTE]
> ## Security monitoring
> Azure Monitor was designed to monitor the availability and performance of cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring for AKS is done with [Azure Sentinel](../../sentinel/overview.md) and [Azure Security Center](../../security-center/security-center-introduction.md). See [Monitor virtual machines with Azure Monitor - Security monitoring](../vm/monitor-virtual-machine-security.md) for a description of the security monitoring tools in Azure and their relationship to Azure Monitor.
>
> For information on using the security services to monitor AKS, see [Azure Defender for Kubernetes - the benefits and features](../../security-center/defender-for-kubernetes-introduction.md) and  [Connect Azure Kubernetes Service (AKS) diagnostics logs to Azure Sentinel](../../sentinel/connect-azure-kubernetes-service.md).


## Container insights
You will typically start with [Container insights](container-insights-overview.md) in Azure Monitor for analyzing the health and performance of the different components of your AKS cluster. Container insights provides interactive views and workbooks that analyze collected data for a variety of monitoring scenarios. You don't need to know anything about the underlying data to use Container insights.

[Prometheus](https://prometheus.io/) and [Grafana](https://www.prometheus.io/docs/visualization/grafana/) are CNCF backed widely popular open source tools for kubernetes monitoring. AKS exposes many metrics in Prometheus format which makes Prometheus a popular choice for monitoring. [Container insights](../containers/container-insights-overview.md)has native integration with AKS, collecting critical metrics and logs, alerting on identified issues, and providing visualization with workbooks. It also collects certain Prometheus metrics, and many native Azure Monitor insights are built-up on top of Prometheus metrics. Container insights complements and completes E2E monitoring of AKS including log collection which Prometheus as stand-alone tool doesn’t provide. Many customers use Prometheus integration and Azure Monitor together for E2E monitoring.

Learn more about using Container insights at [Container insights overview](container-insights-overview.md). [Monitoring Azure Kubernetes Service (AKS) - Analyze data](monitor-aks-analyze.md) in this scenario provides explanations of various features of Container insights and the monitoring scenarios that they support.

:::image type="content" source="media/monitor-aks/container-insights.png" alt-text="Container insights" lightbox="media/monitor-aks/container-insights.png":::

## Next steps

* [Analyze monitoring data collected for AKS clusters.](monitor-aks-analyze.md)
