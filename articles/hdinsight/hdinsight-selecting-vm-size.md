---
title: How to select the right VM size for your Azure HDInsight cluster
description: How to select.
keywords: vm sizes, cluster sizes, cluster configuration
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 10/09/2019
---
# Selecting the right VM size for your Azure HDInsight cluster

This article discusses how to select the right VM size for the various nodes in your HDInsight cluster. For a list of all supported and recommended VM sizes for each cluster type, see [Azure HDInsight supported node configurations](hdinsight-supported-node-configurations.md).

## Understanding VM optimization

Virtual machine families in Azure are optimized to suit different use cases. In the table below, you can find some of the most popular use cases and the VM families that match to them.

| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](../virtual-machines/linux/sizes-general.md)          | B, Dsv3, Dv3, Dasv3, Dav3, DSv2, Dv2, Av2, DC  | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](../virtual-machines/linux/sizes-compute.md)        | Fsv2           | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers.        |
| [Memory optimized](../virtual-machines/linux/sizes-memory.md)         | Esv3, Ev3, Easv3, Eav3, Mv2, M, DSv2, Dv2  | High memory-to-CPU ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](../virtual-machines/linux/sizes-storage.md)        | Lsv2                | High disk throughput and IO ideal for Big Data, SQL, NoSQL databases, data warehousing, and large transactional databases.  |
| [GPU](../virtual-machines/linux/sizes-gpu.md)            | NC, NCv2, NCv3, ND, NDv2 (Preview), NV, NVv3  | Specialized virtual machines targeted for heavy graphic rendering and video editing, as well as model training and inferencing (ND) with deep learning. Available with single or multiple GPUs.       |
| [High performance compute](../virtual-machines/linux/sizes-hpc.md) | HB, HC,  H | Our fastest and most powerful CPU virtual machines with optional high-throughput network interfaces (RDMA). |

<br>

- For information about pricing of the various sizes, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux). 
- For availability of VM sizes in Azure regions, see [Products available by region](https://azure.microsoft.com/regions/services/).
- To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../../azure-subscription-service-limits.md).
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.

## Cost saving SKUs for light workloads

If you have light processing requirements, the Fsv2 series can be a good choice to get started with HDInsight. At a lower per-hour list price, the Fsv2-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per vCPU.

The following table describes the cluster types and node types, which can be created with the Fsv2-series VMs.

| Cluster Type | Version | Worker Node | Head Node | Zookeeper Node |
|---|---|---|---|---|
| Spark | All | F4 and above | no | no |
| Hadoop | All | F4 and above | no | no |
| Kafka | All | F4 and above | no | no |
| HBase | All | F4 and above | no | no |
| LLAP | disabled | no | no | no |
| Storm | disabled | no | no | no |
| ML Service | HDI 3.6 ONLY | F4 and above | no | no |

To see the specifications of each Fsv2-series SKU, see [Compute optimized virtual machine sizes](../virtual-machines/linux/sizes-compute.md#fsv2-series-1).

## Next steps

- [Azure HDInsight supported node configurations](hdinsight-supported-node-configurations.md)
* [Sizes for Linux virtual machines in Azure](../virtual-machines/linux/sizes.md)
