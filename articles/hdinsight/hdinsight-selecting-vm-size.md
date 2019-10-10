---
title: How to select the right VM size for your Azure HDInsight cluster
description: How to select.
keywords: vm sizes, cluster sizes, cluster configuration
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/09/2019
---
# Selecting the right VM size for your Azure HDInsight cluster

This article discusses how to select the right VM size for the various nodes in your HDInsight cluster. For a list of all supported and recommended VM sizes for each cluster type, see [Azure HDInsight supported node configurations](hdinsight-supported-node-configuration.md).

## Understanding VM optimization

Virtual machine families in Azure are optimized to suit different use cases. In the table below, you can find some of the most popular use cases and the VM families that match to them.

| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [Entry-level](../virtual-machines/linux/sizes-general.md)          | A, Av2  | Have CPU performance and memory configurations best suited for entry level workloads like development and test. They are economical and provide a low-cost option to get started with Azure. |
| [General purpose](../virtual-machines/linux/sizes-general.md)          | D, DSv2, Dv2  | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](../virtual-machines/linux/sizes-compute.md)        | F           | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers.        |
| [Memory optimized](../virtual-machines/linux/sizes-memory.md)         | Esv3, Ev3  | High memory-to-CPU ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |

- For information about pricing of available VM instances across HDInsight supported regions, see [HDInsight Pricing](https://azure.microsoft.com/en-us/pricing/details/hdinsight/).

## Cost saving SKUs for light workloads

If you have light processing requirements, the [F-series](https://azure.microsoft.com/blog/f-series-vm-size/) can be a good choice to get started with HDInsight. At a lower per-hour list price, the F-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per vCPU.

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

To see the specifications of each F-series SKU, see [F-series VM sizes](https://azure.microsoft.com/blog/f-series-vm-size/).

## Next steps

- [Azure HDInsight supported node configurations](hdinsight-supported-node-configuration.md)
- [Sizes for Linux virtual machines in Azure](../virtual-machines/linux/sizes.md)
