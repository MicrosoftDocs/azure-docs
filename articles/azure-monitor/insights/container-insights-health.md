---
title: Monitor AKS cluster health with Azure Monitor for containers | Microsoft Docs
description: This article describes how you can view and analyze the health of your AKS clusters with Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/14/2019
ms.author: magoedte
---

# Understand AKS cluster health with Azure Monitor for containers

With Azure Monitor for containers, it monitors and reports health status of the managed infrastructure components, all nodes, and workloads running in an Azure Kubernetes Service (AKS) cluster. This experience extends beyond the cluster health status calculated and reported on the [multi-cluster view](container-insights-analyze.md#multi-cluster-view-from-azure-monitor), where now you can understand if one or more nodes in the cluster are resource constrained, or a node or pod are unavailable that could impact a running application in the cluster based on curated metrics. 

For information about how to enable Azure Monitor for containers, see [Onboard Azure Monitor for containers](container-insights-onboard.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com). 

## View health from an AKS cluster

Access to the Azure Monitor for containers health feature is available directly from an AKS cluster by selecting **Insights** from the left pane in the Azure portal. From the **Cluster** performance tab, select **Health**.  

![Azure Monitor health dashboard example](./media/container-insights-health/health-view-01.png)

Immediately you can see the overall health of the cluster without having to view from each tab - **Node**, **Controllers**, and **Pods**. Under the **Cluster health summary**, an overall health perspective is provided for:

- Kubernetes infrastructure - provides a rollup of the Kubernetes API server, ReplicaSets, and DaemonSets running on nodes deployed in your cluster.

    ![Kubernetes infrastructure health rollup view](./media/container-insights-health/health-view-kube-infra-01.png)

- Nodes - provides a rollup of the node pools and state of individual nodes in each pool, by evaluating CPU and memory utilization, and a nodes availability.

    ![Nodes health rollup view](./media/container-insights-health/health-view-nodes-01.png)

- Workloads - provides a rollup of overall utilization of the cluster and for each containerized application or other workload running across all namespaces in the cluster.

    ![Workloads health rollup view](./media/container-insights-health/health-view-workloads-01.png)


## Next steps