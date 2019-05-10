---
title: Scale up an Azure Data Explorer cluster to accommodate changing demand
description: This article describes steps to scale up and scale down an Azure Data Explorer cluster based on changing demand.
author: radennis
ms.author: radennis
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/05/2019
---

# Manage cluster scale-up to accommodate changing demand

There are two workflows for scaling an Azure Data Explorer cluster: scale-up and [scale-out](manage-cluster-scale-out.md). This article shows how to manage cluster scale-up.

Sizing a cluster appropriately is critical to the performance of Azure Data Explorer. But demand on a cluster can’t be predicted with absolute accuracy. A static cluster size can lead to underutilization or overutilization, neither of which is ideal. A better approach is to *scale* a cluster, adding and removing capacity and CPU resources with changing demand. 

## Steps to scale up
1. Go to your cluster. Under **Settings**, select **Scale up**.

    You're shown a list of available SKUs. For example, in the following figure, only four SKUs are available.

    ![Scale up](media/manage-cluster-scale-up/scale-up.png)

    SKUs are disabled because either they're the current SKU, or they aren't available in the region where the cluster is located.

1. To change your SKU, select the SKU you want and choose the **Select** button.

> [!NOTE]
> The scale-up process can take a few minutes, and during that time your cluster will be suspended. Note that scaling down can harm your cluster performance.

You've now done a scale-up or scale-down operation for your Azure Data Explorer cluster.

## Next steps
You can also [manage cluster scale-out](manage-cluster-scale-out.md) to dynamically scale out the instance count based on metrics that you specify.

If you need assistance with cluster-scaling issues, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

Monitor your resource usage by following this article: [Monitor Azure Data Explorer performance, health, and usage with metrics](using-metrics.md).
