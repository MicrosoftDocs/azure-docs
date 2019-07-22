---
title: Select the correct VM SKU for your Azure Data Explorer cluster
description: This article describes how to select the optimal SKU size for Azure Data Explorer cluster.
author: avnera
ms.author: avnera
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/14/2019
---

# Select the correct VM SKU for your Azure Data Explorer cluster 

Azure Data Explorer has multiple VM SKUs from which to choose when creating a new cluster or optimizing the cluster for a changing workload. The VMs were carefully chosen to allow the most optimal cost for any workload. 

The size and VM SKU of the data management cluster is fully managed by the Azure Data Explorer service. It is determined by factors such as the engine's VM size and the ingestion workload. 

The VM SKU for the engine cluster can be changed anytime by [scaling up the cluster](manage-cluster-vertical-scaling.md). Therefore, it's best to start with the minimal SKU size that fits the initial scenario. Keep in mind that scaling up the cluster results in downtime of up to 30 minutes while the cluster is re-created with the new VM SKU.

> [!TIP]
> Compute [RI (reserved instances)](https://docs.microsoft.com/azure/virtual-machines/windows/prepay-reserved-vm-instances) is applicable for Azure Data Explorer cluster.  

This article describes the different VM SKU options and provides the technical details that can help you make the optimal choice.

## Select the cluster type

Azure Data Explorer offers two types of clusters:

* **Production**: Production clusters contain two nodes for engine and data management clusters and are operated under the Azure Data Explorer [SLA](https://azure.microsoft.com/support/legal/sla/data-explorer/v1_0/).

* **Dev/Test (no SLA)**: Dev/Test clusters have a single D11_v2 node for the engine cluster and a single D1 node for the data management cluster. This cluster type is the lowest cost configuration because of the low instance count and no engine markup charge. There's no SLA for this cluster configuration because it lacks redundancy.

## SKU types

When creating an Azure Data Explorer cluster, select the *optimal* VM SKU for the planned workload. Azure Data Explorer has two SKU families from which to choose:

* **D_V2**: The D SKU is compute optimized and provided in two flavors.
    * VM itself
    * VM bundled with premium storage disks

* **LS**: The L SKU is storage optimized. It has a much greater SSD size than the similar priced **D** SKU.

The following table provides the key differences between the available SKU types:
 
|**Attribute** | **D SKU** | **L SKU**
|---|---|---
|**Small SKUs**|Minimal size is 'D11' with two cores|Minimal size is 'L4' with four cores
|**Availability**|Available in all regions (the DS+PS version has more limited availability)|Available in a few regions
|**Cost per GB cache per core**|High with the D SKU, low with the DS+PS version|Cheapest with the *Pay as you go* option
|**RI (Reserved Instances) pricing**|High discount (over 55% for a three-year commitment)|Lower discount (20% for a three-year commitment)  

## Select your cluster VM 

To select your cluster VM, [configure vertical scaling](manage-cluster-vertical-scaling.md#configure-vertical-scaling). 

The different VM SKU options enable you to optimize costs for the necessary performance and hot cache requirements for the desired scenario. If the scenario requires the most optimal performance for a high query volume, the ideal SKU should be compute optimized. On the other hand, if the scenario requires querying large volumes of data with relatively lower query load, the storage optimized SKU will reduce costs while still providing excellent performance.

The number of instances per cluster for the small SKUs is limited so it's preferable to use larger VMs that have greater RAM. The RAM size is needed for some query types that put more demand on the RAM resource, such as those queries that use `joins`. Therefore, when considering scaling options, is advised to scale-up to a bigger SKU than scale-out by adding more instances.

## VM options

The following table provides the technical specifications for the Azure Data Explorer cluster VMs:

|**Name**| **Category** | **SSD size** | **Cores** | **RAM** | **Premium storage disks (1 TB)**| **Minimum instance count per cluster** | **Maximum instance count per cluster**
|---|---|---|---|---|---|---|---
|D11_v2| compute optimized | 75 GB    | 2 | 14 GB | 0 | 1 | 8 (except for dev/test SKU where it's 1)
|D12_v2| compute optimized | 150 GB   | 4 | 28 GB | 0 | 2 | 16
|D13_v2| compute optimized | 307 GB   | 8 | 56 GB | 0 | 2 | 1,000
|D14_v2| compute optimized | 614 GB   | 16| 112 GB | 0 | 2 | 1,000
|DS13_v2+1TB PS| storage optimized | 1 TB | 8 | 56 GB | 1 | 2 | 1,000
|DS13_v2+2TB PS| storage optimized | 2 TB | 8 | 56 GB | 2 | 2 | 1,000
|DS14_v2+3TB PS| storage optimized | 3 TB | 16 | 112 GB | 2 | 2 | 1,000
|DS14_v2+4TB PS| storage optimized | 4 TB | 16 | 112 GB | 4 | 2 | 1,000
|L4s_v1| storage optimized | 650 GB | 4 | 32 GB | 0 | 2 | 16
|L8s_v1| storage optimized | 1.3 TB | 8 | 64 GB | 0 | 2 | 1,000
|L16s_1| storage optimized | 2.6 TB | 16| 128 GB | 0 | 2 | 1,000

* View the updated VM SKU list per region using the Azure Data Explorer [ListSkus API](/dotnet/api/microsoft.azure.management.kusto.clustersoperationsextensions.listskus?view=azure-dotnet). 
* Learn more about the [different compute SKUs](/azure/virtual-machines/windows/sizes-compute). 

## Next steps

* The engine cluster can be [scaled up or down](manage-cluster-vertical-scaling.md) anytime by changing the VM SKU for differing needs. 

* The size of the engine cluster can be [scaled in and out](manage-cluster-horizontal-scaling.md) to alter capacity with changing demands.

