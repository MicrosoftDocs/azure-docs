---
title: What's new in HDInsight on AKS?
description: An introduction to new concepts in HDInsight on AKS that aren't in HDInsight.
ms.service: hdinsight-aks
ms.topic: concept
ms.date: 08/06/2023
---

# Default and Minimum VM Size Recommendations for HDInsight on AKS

## Cluster Pools
For creating cluster pools, the currently available VM Options are F4s_v2, D4a_v4, D4as_v4, E4_v3, and E4s_v3.

## Clusters
HDInsight on AKS currently supports Virtual Machines (VMs) from the [Memory Optimized](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes-memory) and [General Purpose](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes-general) categories for cluster creation. Memory optimized VM sizes offer a high Memory-to-CPU ratio, which is great for relational database servers, medium to large caches, and in-memory analytics. General purpose VM sizes provide balanced Memory-to-CPU ratio and are ideal for testing and development, small to medium databases, and low to medium traffic web servers. 

If your use case requires the usage of Memory Optimized VMs, the default recommendation is to use VMs from the families **Eadsv5** or **Easv5**. For use cases requiring the usage of General Purpose VMs, we recommend VMs from the families **Dadsv5** or **Ddsv5**. 

In case of insufficient capacity/quota on the above recommended VM Families, please look for alternatives in the below table which lists all the VM Families currently supported in HDInsight on AKS for cluster creation:

|	Type	|	VM Family	|	Temp Storage	|	Premium Storage Support	|
|--|--|--|--|
|	Memory Optimized	|	[Eadsv5](https://learn.microsoft.com/en-us/azure/virtual-machines/easv5-eadsv5-series)	|	Yes	|	Yes	|
|		|	[Easv5](https://learn.microsoft.com/en-us/azure/virtual-machines/easv5-eadsv5-series)	|	No	|	Yes	|
|		|	[Edsv5](https://learn.microsoft.com/en-us/azure/virtual-machines/edv5-edsv5-series)	|	Yes	|	Yes	|
|		|	[Edv5](https://learn.microsoft.com/en-us/azure/virtual-machines/edv5-edsv5-series)	|	Yes	|	No	|
|		|	[Easv4](https://learn.microsoft.com/en-us/azure/virtual-machines/eav4-easv4-series)	|	Yes	|	Yes	|
|		|	[Eav4](https://learn.microsoft.com/en-us/azure/virtual-machines/eav4-easv4-series)	|	Yes	|	No	|
|		|	[Edv4](https://learn.microsoft.com/en-us/azure/virtual-machines/edv4-edsv4-series)	|	Yes	|	No	|
|	General Purpose	|	[Dadsv5](https://learn.microsoft.com/en-us/azure/virtual-machines/dasv5-dadsv5-series)	|	Yes	|	Yes	|
|		|	[Ddsv5](https://learn.microsoft.com/en-us/azure/virtual-machines/ddv5-ddsv5-series)	|	Yes	|	Yes	|
|		|	[Ddv5](https://learn.microsoft.com/en-us/azure/virtual-machines/ddv5-ddsv5-series)	|	Yes	|	No	|
|		|	[Dasv4](https://learn.microsoft.com/en-us/azure/virtual-machines/dav4-dasv4-series)	|	Yes	|	Yes	|
|		|	[Dav4](https://learn.microsoft.com/en-us/azure/virtual-machines/dav4-dasv4-series)	|	Yes	|	No  	|

The minimum VM specifications recommended (regardless of the chosen VM Family for the cluster) is 8vCPUs and 32GiB RAM. Higher vCPU and GiB variants may be chosen as per the workload being processed.

