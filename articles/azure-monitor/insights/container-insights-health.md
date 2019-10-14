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

With Azure Monitor for containers, it monitors and reports health status of the managed infrastructure components, all nodes, and workloads running in an Azure Kubernetes Service (AKS) cluster. This experience extends beyond the cluster health status calculated and reported on the [multi-cluster view](container-insights-analyze.md#multi-cluster-view-from-azure-monitor), where now you can understand if one or more nodes in the cluster are resource constrained, or a node or pod are unavailable that could impact a running application in the cluster. 

For information about how to enable Azure Monitor for containers, see [Onboard Azure Monitor for containers](container-insights-onboard.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com). 

## View health from an AKS cluster

Access to the Azure Monitor for containers health feature is available directly from an AKS cluster by selecting **Insights** from the left pane in the Azure portal. From the **Cluster** performance tab, select **Health**.  

![Azure Monitor health dashboard example](./media/container-insights-health/container-insights-health-view-01.png)



## Next steps