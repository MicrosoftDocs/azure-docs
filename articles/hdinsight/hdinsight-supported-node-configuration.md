---
title: Azure HDInsight supported node configurations
description: Learn the minimum and recommended configurations for HDInsight cluster nodes.
keywords: vm sizes, cluster sizes, cluster configuration
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 08/26/2019
---
# What are the default and recommended node configurations for Azure HDInsight?

This article discusses default and recommended node configurations for Azure HDInsight clusters.

## Default and recommended node configuration and virtual machine sizes for clusters

The following tables list default and recommended virtual machine (VM) sizes for HDInsight clusters.  This chart is necessary to understand the VM sizes to use when you are creating PowerShell or Azure CLI scripts to deploy HDInsight clusters. If you need more than 32 worker nodes in a cluster, select a head node size with at least 8 cores and 14 GB of RAM. The only cluster types that have data disks are Kafka and HBase clusters with the Accelerated Writes feature enabled. HDInsight supports P30 and S30 disk sizes in these scenarios.

For more details on the specification of each VM type, see the following documents:

* [General purpose virtual machine sizes: Dv2 series 1-5](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sizes-general#dv2-series)
* [Memory optimized virtual machine sizes: Dv2 series 11-15](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sizes-memory#dv2-series-11-15)
* [General purpose virtual machine sizes: Av2 series 1-8](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sizes-general#av2-series)

* All supported regions except Brazil South and Japan West:

| Cluster type | Hadoop | HBase | Interactive Query | Storm | Spark | ML Server | Kafka |
|---|---|---|---|---|---|---|---|
| Head: default VM size | Standard_D12_v2 | Standard_D12_v2 | Standard_D13_v2 | Standard_A4_v2 | Standard_D12_v2 | Standard_D12_v2 | Standard_D3_v2 |
| Head: recommended VM sizes | Standard_D13_v2 | Standard_D3_v2 | Standard_D13_v2 | Standard_A4_v2 | Standard_D12_v2 | Standard_D12_v2 | Standard_D3_v2 |
|  | Standard_D14_v2 | Standard_D4_v2 | Standard_D14_v2 | Standard_A8_v2 | Standard_D13_v2 | Standard_D13_v2 | Standard_D4_v2 |
|  | Standard_D5_v2 | Standard_D12_v2 |  |  | Standard_D14_v2 | Standard_D14_v2 | Standard_D12_v2 |
|  |  |  |  |  |  |  |  |
| Worker: default VM size | Standard_D4_v2 | Standard_D4_v2 | Standard_D14_v2 | Standard_D3_v2 | Standard_D13_v2 | Standard_D4_v2 | 4 Standard_D12_v2 with 2 S30 disks per broker |
| Worker: recommended VM sizes | Standard_D5_v2 | Standard_D3_v2 | Standard_D13_v2 | Standard_D3_v2 | Standard_D12_v2 | Standard_D4_v2 | Standard_D3_v2 |
|  | Standard_D12_v2 | Standard_D4_v2 | Standard_D14_v2 | Standard_D4_v2 | Standard_D13_v2 | Standard_D12_v2 | Standard_D4_v2 |
|  | Standard_D13_v2 | Standard_D13_v2 |  | Standard_D12_v2 | Standard_D14_v2 | Standard_D13_v2 | Standard_DS3_v2 |
|  |  |  |  |  |  | Standard_D14_v2 | Standard_DS4_v2 |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
| ZooKeeper: default VM size |  | Standard_A4_v2 | Standard_A4_v2 | Standard_A4_v2 |  | Standard_A2_v2 | Standard_A4_v2 |
| ZooKeeper: recommended VM sizes |  | Standard_A4_v2 | Standard_A4_v2 | Standard_A2_v2 |  | Standard_A2_v2 | Standard_A4_v2 |
|  |  | Standard_A8_v2 | Standard_A8_v2 | Standard_A4_v2 |  |  | Standard_A8_v2 |
|  |  | Standard_A2m_v2 | Standard_A2m_v2 | Standard_A8_v2 |  |  | Standard_A2m_v2 |
| ML Services: default VM size |  |  |  |  |  | Standard_D4_v2 |  |
| ML Services: recommended VM size |  |  |  |  |  | Standard_D4_v2 |  |
|  |  |  |  |  |  | Standard_D12_v2 |  |
|  |  |  |  |  |  | Standard_D13_v2 |  |
|  |  |  |  |  |  | Standard_D14_v2 |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

* Brazil South and Japan West only (no v2 sizes):

| Cluster type | Hadoop | HBase | Interactive Query | Storm | Spark | ML Services |
|---|---|---|---|---|---|---|
| Head: default VM size | Standard_D12 | Standard_D12 | Standard_D13 | Standard_A4_v2 | Standard_D12 | Standard_D12 |
| Head: recommended VM sizes | Standard_D5_v2,<br/> Standard_D13_v2,<br/> Standard_D14_v2 | Standard_D3_v2,<br/> Standard_D4_v2,<br/> Standard_D12_v2 | Standard_D13_v2,<br/> Standard_D14_v2 | Standard_A4_v2,<br/> Standard_A8_v2 | Standard_D12_v2,<br/> Standard_D13_v2,<br/> Standard_D14_v2 | Standard_D12_v2,<br/> Standard_D13_v2,<br/> Standard_D14_v2 |
| Worker: default VM size | Standard_D4 | Standard_D4 | Standard_D14 | Standard_D3 | Standard_D13 | Standard_D4 |
| Worker: recommended VM sizes | Standard_D5_v2,<br/> Standard_D12_v2,<br/> Standard_D13_v2 | Standard_D3_v2,<br/> Standard_D4_v2,<br/> Standard_D13_v2 | Standard_D13_v2,<br/> Standard_D14_v2 | Standard_D3_v2,<br/> Standard_D4_v2,<br/> Standard_D12_v2 | Standard_D12_v2,<br/> Standard_D13_v2,<br/> Standard_D14_v2 | Standard_D4_v2,<br/> Standard_D12_v2,<br/> Standard_D13_v2,<br/> Standard_D14_v2 |
| ZooKeeper: default VM size |  | Standard_A4_v2 | Standard_A4_v2 | Standard_A4_v2 |  | Standard_A2_v2 |
| ZooKeeper: recommended VM sizes |  | Standard_A4_v2,<br/> Standard_A8_v2,<br/> Standard_A2m_v2 | Standard_A4_v2,<br/> Standard_A8_v2,<br/> Standard_A2m_v2 | Standard_A4_v2,<br/> Standard_A8_v2 |  | Standard_A2_v2 |
| ML Services: default VM sizes |  |  |  |  |  | Standard_D4 |
| ML Services: recommended VM sizes |  |  |  |  |  | Standard_D4_v2,<br/> Standard_D12_v2,<br/> Standard_D13_v2,<br/> Standard_D14_v2 |

> [!NOTE]
> - Head is known as *Nimbus* for the Storm cluster type.
> - Worker is known as *Supervisor* for the Storm cluster type.
> - Worker is known as *Region* for the HBase cluster type.

## Next steps

* [What are the Apache Hadoop components and versions available with HDInsight?](hdinsight-component-versioning.md)