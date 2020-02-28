---
title: 'Manage cluster vertical scaling (scale up) to match demand in Azure Data Explorer'
description: This article describes steps to scale up and scale down an Azure Data Explorer cluster based on changing demand.
author: radennis
ms.author: radennis
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/14/2019
---

# Manage cluster vertical scaling (scale up) in Azure Data Explorer to accommodate changing demand

Sizing a cluster appropriately is critical to the performance of Azure Data Explorer. A static cluster size can lead to under-utilization or over-utilization, neither of which is ideal.

Since demand on a cluster can’t be predicted with absolute accuracy, a better approach is to *scale* a cluster, adding and removing capacity and CPU resources with changing demand. 

There are two workflows for scaling an Azure Data Explorer cluster:

* [Horizontal scaling](manage-cluster-horizontal-scaling.md), also called scaling in and out.
* Vertical scaling, also called scaling up and down.

This article explains the vertical scaling workflow:

## Configure vertical scaling

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under **Settings**, select **Scale up**.

1. In the **Scale up** window, you will see a list of available SKUs for your cluster. For example, in the following figure, only four SKUs are available.

    ![Scale up](media/manage-cluster-vertical-scaling/scale-up.png)

    The SKUs are disabled because they're the current SKU, or they aren't available in the region where the cluster is located.

1. To change your SKU, select a new SKU and click **Select**.

> [!NOTE]
> * The vertical scaling process can take a few minutes, and during that time your cluster will be  suspended. 
> * Scaling down can harm your cluster performance.
> * The price is an estimate of the cluster's virtual machines and Azure Data Explorer service costs. Other costs are not included. See Azure Data Explorer [cost estimator](https://dataexplorer.azure.com/AzureDataExplorerCostEstimator.html) page for an estimate and the Azure Data Explorer [pricing page](https://azure.microsoft.com/pricing/details/data-explorer/) for full pricing information.

You've now configured vertical scaling for your Azure Data Explorer cluster. Add another rule for a horizontal scaling. If you need assistance with cluster-scaling issues, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Next steps

* [Manage cluster horizontal scaling](manage-cluster-horizontal-scaling.md) to dynamically scale out the instance count based on metrics that you specify.

* Monitor your resource usage by following this article: [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md).

