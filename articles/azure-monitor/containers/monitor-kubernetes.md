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

This set of articles describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure and cloud native services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). Different sets of guidance are provided for the different roles that typically manage different aspects of a Kubernetes environment. 


> [!IMPORTANT]
> These articles provides complete guidance on monitoring the different layers of your Kubernetes environment based on Azure Kubernetes Service (AKS) or Kubernetes clusters in other clouds using services in Azure. If you're just getting started with AKS, see [Monitoring AKS](../../aks/monitor-aks.md) for basic information for getting started monitoring an AKS cluster.

## Layers and roles of Kubernetes environment

Following is an illustration of a common bottoms-up model of a typical Kubernetes environment, starting from infrastructure up through applications. Each layer has distinct monitoring requirements that are addressed by different Azure services and managed by different roles in the organization.

:::image type="content" source="media/monitor-containers/layers-with-roles.png" alt-text="Diagram of layers of Kubernetes environment with related administrative roles." lightbox="media/monitor-containers/layers-with-roles.png"  border="false":::

Responsibility for the [different layers of a a Kubernetes environment and the applications that depend on it](monitor-kubernetes-analyze.md) are typically shared by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide different monitoring scenarios that each will typically encounter.

| Roles | Description |
|:---|:---|
| [Cluster administrator](monitor-kubernetes-cluster-administrator.md) | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](monitor-kubernetes-developer.md) | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](monitor-kubernetes-network-engineer.md) | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |



## See also

- See [Monitoring AKS](../../aks/monitor-aks.md) for guidance on monitoring specific to Azure Kubernetes Service (AKS).

