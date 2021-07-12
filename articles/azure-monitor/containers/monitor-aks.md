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


## Scope of the scenario
This scenario is intended for customers using Azure Monitor to monitor AKS. It does not include the following, although that content may be added in subsequent updates to the scenario.

- Monitoring of Kubernetes clusters outside of Azure except for referring to existing content for Azure Arc enabled Kubernetes. 
- Monitoring of AKS with tools other than Azure Monitor except to fill gaps in Azure Monitor and Container Insights.
The Cloud Monitoring Guide defines the primary monitoring objectives you should focus on for you Azure resources. This scenario focuses on Health and Status monitoring using Azure Monitor.


## Layers of monitoring
The approach you take to AKS monitoring should be based on factors including scale, topology, organization roles, and multi-cluster tenancy. A common strategy is a bottoms-up approach starting from infrastructure bare bones all the way to applications. Below is the bottoms-up strategy which is commonly used by large scale clusters. There can be alterations based on the cluster topology.

:::image type="content" source="media/monitor-aks/layers.png" alt-text="AKS layers":::


| Level | Description | Details |
|:---|:---|:---|
| 1 | Cluster level components | Underlying system virtual machine scale set abstracted as AKS nodes and node-pools. Monitor requirements include status and resource utilization including processor, memory, disk, and network. | 
| 2 | Managed AKS components | Control plane components such as API servers, cloud control, and kubelet. Monitor requirements include control plane logs and metrics from kube system namespace. |
| 3 | Kubernetes objects and workloads | Kubernetes deployments, containers, replica sets, and daemon sets. Monitoring requirements include resource utilization and failures. |
| 4 | Application | Application workloads running on Kubernetes. Monitoring is specific to the application architecture but typically includes collecting application logs, service transaction, and memory heaps. |



## Monitoring tools
[Container insights](../containers/container-insights-overview.md) has native integration with AKS, collecting critical metrics and logs, alerting on identified issues, and providing visualization with workbooks. [Prometheus](https://prometheus.io/) and [Grafana](https://www.prometheus.io/docs/visualization/grafana/) are CNCF backed widely popular open source tools for k8s monitoring. AKS(k8s) exposes many metrics in Prometheus format which makes Prometheus a popular choice. Azure Monitor supports collection of Prometheus metrics, in-fact, many native Azure Monitor insights are built-up on top of Prometheus metrics. Azure Monitor complements & completes E2E monitoring of AKS including log collection which Prometheus as stand-alone tool doesn’t provide. Many customers use Prometheus integration & Azure Monitor together for E2E monitoring & for them the biggest operational challenge of monitoring is the large volume of data generated due to the dynamic nature of k8s.
As mentioned above there are CNCF backed opensource monitoring tools (Prometheus & Grafana) & 3rd party proprietary tools which can be used for AKS monitoring. 


## Security monitoring
Azure Monitor was designed to monitor the availability and performance of your virtual machines and other cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. 
Security monitoring for AKS is done with Azure Sentinel and Azure Security Center. See Monitor virtual machines with Azure Monitor - Security monitoring for a description of the security monitoring tools in Azure and their relationship to Azure Monitor.
Azure Defender for Kubernetes - Azure Defender for Kubernetes - the benefits and features | Microsoft Docs
AKS connector in Sentinel - Connect Azure Kubernetes Service (AKS) diagnostics logs to Azure Sentinel | Microsoft Docs




## Next steps

* [Analyze monitoring data collected for AKS clusters.](monitor-aks-analyze.md)
