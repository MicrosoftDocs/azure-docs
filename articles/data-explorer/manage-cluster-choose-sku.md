---
title: Select correct VM SKU for your Azure Data Explorer cluster
description: This article describes how to select the optimal SKU size for Azure Data Explorer cluster.
author: avneraa
ms.author: avnera
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/14/2019
---

# Select the correct VM SKU for your Azure Data Explorer cluster 

When you create a new cluster or optimize a cluster for a changing workload, Azure Data Explorer offers multiple virtual machine (VM) SKUs to choose from. The VMs have been carefully chosen to give you the most optimal cost for any workload. 

The size and VM SKU of the data-management cluster are fully managed by the Azure Data Explorer service. They're determined by such factors as the engine's VM size and the ingestion workload. 

You can change the VM SKU for the engine cluster at any time by [scaling up the cluster](manage-cluster-vertical-scaling.md). It's best to start with the smallest SKU size that fits the initial scenario. Keep in mind that scaling up the cluster results in a downtime of up to 30 minutes while the cluster is re-created with the new VM SKU.

> [!TIP]
> Compute [Reserved Instances (RI)](https://docs.microsoft.com/azure/virtual-machines/windows/prepay-reserved-vm-instances) is applicable to the Azure Data Explorer cluster.  

This article describes various VM SKU options and provides the technical details that can help you make the best choice.

## Select a cluster type

Azure Data Explorer offers two types of clusters:

* **Production**: Production clusters contain two nodes for engine and data-management clusters and are operated under the Azure Data Explorer [SLA](https://azure.microsoft.com/support/legal/sla/data-explorer/v1_0/).

* **Dev/Test (no SLA)**: Dev/Test clusters have a single D11 v2 node for the engine cluster and a single D1 node for the data-management cluster. This cluster type is the lowest cost configuration because of its low instance count and no engine markup charge. There's no SLA for this cluster configuration, because it lacks redundancy.

## SKU types

When you create an Azure Data Explorer cluster, select the *optimal* VM SKU for the planned workload. You can choose from the following two Azure Data Explorer SKU families:

* **D v2**: The D SKU is compute-optimized and comes in two flavors:
    * The VM itself
    * The VM bundled with premium storage disks

* **LS**: The L SKU is storage-optimized. It has a much greater SSD size than the similarly priced D SKU.

The key differences between the available SKU types are described in the following table:
 
| Attribute | D SKU | L SKU |
|---|---|---
|**Small SKUs**|Minimal size is D11 with two cores|Minimal size is L4 with four cores |
|**Availability**|Available in all regions (the DS+PS version has more limited availability)|Available in a few regions |
|**Cost per&nbsp;GB cache per core**|High with the D SKU, low with the DS+PS version|Lowest with the Pay-As-You-Go option |
|**Reserved Instances (RI) pricing**|High discount (over 55&nbsp;percent for a three-year commitment)|Lower discount (20&nbsp;percent for a three-year commitment) |  

## Select your cluster VM 

To select your cluster VM, [configure vertical scaling](manage-cluster-vertical-scaling.md#configure-vertical-scaling). 

With various VM SKU options to choose from, you can optimize costs for the performance and hot-cache requirements for your scenario. 
* If you need the most optimal performance for a high query volume, the ideal SKU should be compute-optimized. 
* If you need to query large volumes of data with relatively lower query load, the storage-optimized SKU can help reduce costs and still provide excellent performance.

Because the number of instances per cluster for the small SKUs is limited, it's preferable to use larger VMs that have greater RAM. More RAM is needed for some query types that put more demand on the RAM resource, such as queries that use `joins`. Therefore, when you're considering scaling options, we recommend that you scale up to a larger SKU rather than scale out by adding more instances.

## VM options

The technical specifications for the Azure Data Explorer cluster VMs are described in the following table:

|**Name**| **Category** | **SSD size** | **Cores** | **RAM** | **Premium storage disks (1&nbsp;TB)**| **Minimum instance count per cluster** | **Maximum instance count per cluster**
|---|---|---|---|---|---|---|---
|D11 v2| compute-optimized | 75&nbsp;GB    | 2 | 14&nbsp;GB | 0 | 1 | 8 (except for dev/test SKU, which is 1)
|D12 v2| compute-optimized | 150&nbsp;GB   | 4 | 28&nbsp;GB | 0 | 2 | 16
|D13 v2| compute-optimized | 307&nbsp;GB   | 8 | 56&nbsp;GB | 0 | 2 | 1,000
|D14 v2| compute-optimized | 614&nbsp;GB   | 16| 112&nbsp;GB | 0 | 2 | 1,000
|DS13 v2 + 1&nbsp;TB&nbsp;PS| storage-optimized | 1&nbsp;TB | 8 | 56&nbsp;GB | 1 | 2 | 1,000
|DS13 v2 + 2&nbsp;TB&nbsp;PS| storage-optimized | 2&nbsp;TB | 8 | 56&nbsp;GB | 2 | 2 | 1,000
|DS14 v2 + 3&nbsp;TB&nbsp;PS| storage-optimized | 3&nbsp;TB | 16 | 112&nbsp;GB | 2 | 2 | 1,000
|DS14 v2 + 4&nbsp;TB&nbsp;PS| storage-optimized | 4&nbsp;TB | 16 | 112&nbsp;GB | 4 | 2 | 1,000
|L4s v1| storage-optimized | 650&nbsp;GB | 4 | 32&nbsp;GB | 0 | 2 | 16
|L8s v1| storage-optimized | 1.3&nbsp;TB | 8 | 64&nbsp;GB | 0 | 2 | 1,000
|L16s_1| storage-optimized | 2.6&nbsp;TB | 16| 128&nbsp;GB | 0 | 2 | 1,000

* You can view the updated VM SKU list per region by using the Azure Data Explorer [ListSkus API](/dotnet/api/microsoft.azure.management.kusto.clustersoperationsextensions.listskus?view=azure-dotnet). 
* Learn more about the [various SKUs](/azure/virtual-machines/windows/sizes). 

## Next steps

* You can [scale up or scale down](manage-cluster-vertical-scaling.md) the engine cluster at any time by changing the VM SKU, depending on differing needs. 

* You can [scale in or scale out](manage-cluster-horizontal-scaling.md) the size of the engine cluster to alter capacity, depending on changing demands.

