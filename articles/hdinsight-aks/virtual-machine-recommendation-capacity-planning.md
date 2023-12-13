---
title: Azure Virtual Machine recommendations and capacity planning
description: Default and minimum virtual machine size recommendations and capacity planning for HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 10/05/2023
---

# Default and minimum virtual machine size recommendations and capacity planning for HDInsight on AKS

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article discusses default and recommended node configurations for Azure HDInsight on AKS clusters.

## Cluster pools
For creating cluster pools, the currently available VM Options are F4s_v2, D4a_v4, D4as_v4, and E4s_v3.

## Clusters
HDInsight on AKS currently supports Virtual Machines (VMs) from the [Memory Optimized](/azure/virtual-machines/sizes-memory) and [General Purpose](/azure/virtual-machines/sizes-general) categories for cluster creation. Memory optimized VM sizes offer a high Memory-to-CPU ratio, which is great for relational database servers, medium to large caches, and in-memory analytics. General purpose VM sizes provide balanced Memory-to-CPU ratio and are ideal for testing and development, small to medium databases, and low to medium traffic web servers. 

If your use case requires the usage of Memory Optimized VMs, the default recommendation is to use VMs from the families `Eadsv5` or `Easv5`. For use cases requiring the usage of General Purpose VMs, we recommend VMs from the families `Dadsv5` or `Ddsv5`. 

If there is insufficient capacity/quota on the recommended VM Families, look for alternatives in the table that lists all the VM Families currently supported in HDInsight on AKS for cluster creation:

|	Type	|	Virtual machine family	|	Temp storage	|	Premium storage support	|
|--|--|--|--|
|	Memory optimized	|	[Eadsv5](/azure/virtual-machines/easv5-eadsv5-series)	|	Yes	|	Yes	|
|		|	[Easv5](/azure/virtual-machines/easv5-eadsv5-series)	|	No	|	Yes	|
|		|	[Edsv5](/azure/virtual-machines/edv5-edsv5-series)	|	Yes	|	Yes	|
|		|	[Edv5](/azure/virtual-machines/edv5-edsv5-series)	|	Yes	|	No	|
|		|	[Easv4](/azure/virtual-machines/eav4-easv4-series)	|	Yes	|	Yes	|
|		|	[Eav4](/azure/virtual-machines/eav4-easv4-series)	|	Yes	|	No	|
|		|	[Edv4](/azure/virtual-machines/edv4-edsv4-series)	|	Yes	|	No	|
|	General purpose	|	[Dadsv5](/azure/virtual-machines/dasv5-dadsv5-series)	|	Yes	|	Yes	|
|		|	[Ddsv5](/azure/virtual-machines/ddv5-ddsv5-series)	|	Yes	|	Yes	|
|		|	[Ddv5](/azure/virtual-machines/ddv5-ddsv5-series)	|	Yes	|	No	|
|		|	[Dasv4](/azure/virtual-machines/dav4-dasv4-series)	|	Yes	|	Yes	|
|		|	[Dav4](/azure/virtual-machines/dav4-dasv4-series)	|	Yes	|	No  	|

The minimum VM specifications recommended (regardless of the chosen VM Family for the cluster) is 8vCPUs and 32 GiB RAM. Higher vCPU and GiB variants may be chosen as per the workload being processed.

## Capacity planning 

The Virtual Machines used in HDInsight on AKS clusters requires the same Quota as Azure VMs. This is unlike the original version of HDInsight, where users had to request a dedicated quota to create HDInsight clusters by selecting 'Azure HDInsight' from the quota selection dropdown as shown in the image. For HDInsight on AKS, customers need to select ‘Compute’ from the Quota selection dropdown in order to request extra capacity for the VMs they intend to use in their clusters. Find detailed instructions for increasing your quota [here](/azure/quotas/per-vm-quota-requests).

:::image type="image" source="./media/virtual-machine-recommendation-capacity-planning/capacity-planning.png" alt-text="Screenshot shows capacity planning for HDInsight on AKS." border="true" lightbox="./media/virtual-machine-recommendation-capacity-planning/capacity-planning.png":::



