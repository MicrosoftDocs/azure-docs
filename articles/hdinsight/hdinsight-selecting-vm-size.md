---
title: How to select the right VM size for your Azure HDInsight cluster
description: Learn how to select the right VM size for your HDInsight cluster.
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

This article discusses how to select the right VM size for the various nodes in your HDInsight cluster. 

Begin by understanding how the properties of a virtual machine such as CPU processing, RAM size, and network latency will affect the processing of your workloads. Next, think about your application and how it matches with what different VM families are optimized for. Make sure that the VM family that you would like to use is compatible with the cluster type that you plan to deploy. For a list of all supported and recommended VM sizes for each cluster type, see [Azure HDInsight supported node configurations](hdinsight-supported-node-configuration.md). Lastly, you can use a benchmarking process to test some sample workloads and check which SKU within that family is right for you.

For more information on planning other aspects of your cluster such as selecting a storage type or cluster size, see [Capacity planning for HDInsight clusters](hdinsight-capacity-planning.md).

## VM properties and big data workloads

The VM size and type is determined by CPU processing power, RAM size, and network latency:

- CPU: The VM size dictates the number of cores. The more cores, the greater the degree of parallel computation each node can achieve. Also, some VM types have faster cores.

- RAM: The VM size also dictates the amount of RAM available in the VM. For workloads that store data in memory for processing, rather than reading from disk, ensure your worker nodes have enough memory to fit the data.

- Network: For most cluster types, the data processed by the cluster isn't on local disk, but rather in an external storage service such as Data Lake Storage or Azure Storage. Consider the network bandwidth and throughput between the node VM and the storage service. The network bandwidth available to a VM typically increases with larger sizes. For details, see [VM sizes overview](https://docs.microsoft.com/azure/virtual-machines/linux/sizes).

## Understanding VM optimization

Virtual machine families in Azure are optimized to suit different use cases. In the table below, you can find some of the most popular use cases and the VM families that match to them.

| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [Entry-level](../virtual-machines/linux/sizes-general.md)          | A, Av2  | Have CPU performance and memory configurations best suited for entry level workloads like development and test. They are economical and provide a low-cost option to get started with Azure. |
| [General purpose](../virtual-machines/linux/sizes-general.md)          | D, DSv2, Dv2  | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](../virtual-machines/linux/sizes-compute.md)        | F           | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers.        |
| [Memory optimized](../virtual-machines/linux/sizes-memory.md)         | Esv3, Ev3  | High memory-to-CPU ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |

- For information about pricing of available VM instances across HDInsight supported regions, see [HDInsight Pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

## Cost saving VM types for light workloads

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

## Benchmarking

Benchmarking is the process of running simulated workloads on different VMs to measure how well they will perform for your production workloads. 

For more information on benchmarking for VM SKUs and cluster sizes, see [Cluster capacity planning in Azure HDInsight ](hdinsight-capacity-planning.md#choose-the-vm-size-and-type).

## Next steps

- [Azure HDInsight supported node configurations](hdinsight-supported-node-configuration.md)
- [Sizes for Linux virtual machines in Azure](../virtual-machines/linux/sizes.md)
