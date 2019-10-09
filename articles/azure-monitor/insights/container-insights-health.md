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
ms.date: 10/09/2019
ms.author: magoedte
---

# Understand AKS cluster health with Azure Monitor for containers

With Azure Monitor for containers, it monitors and reports health status of the managed infrastructure components, all nodes, and workloads running in an Azure Kubernetes Service (AKS) cluster. This experience extends beyond the cluster health status calculated and reported in the [multi-cluster view](container-insights-overview.md#multi-cluster-view-from-azure-mMonitor), where now you can understand if one or more nodes in the cluster have a resource capacity constraint, or a node or pod are unavailable that could impact an application running in the cluster. 

For information about how to enable Azure Monitor for containers, see [Onboard Azure Monitor for containers](container-insights-onboard.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com). 


## View health directly from an AKS cluster

Access to the Azure Monitor for containers health feature is available directly from an AKS cluster by selecting **Insights** from the left pane. The 



How often is health calculated (performance health monitors every 1 minute)?  What is it calculating for the Kubernetes API server? How do we monitor pod and node status? 
What is the rollup health criteria and can the end-user configure it?  If so, how do you configure it and where are the settings stored?

## Viewing cluster health

## Configure health criteria

