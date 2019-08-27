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

The following tables list default and recommended virtual machine (VM) sizes for HDInsight clusters.  This information is necessary to understand the VM sizes to use when you are creating PowerShell or Azure CLI scripts to deploy HDInsight clusters. 

If you need more than 32 worker nodes in a cluster, select a head node size with at least 8 cores and 14 GB of RAM. 

The only cluster types that have data disks are Kafka and HBase clusters with the Accelerated Writes feature enabled. HDInsight supports P30 and S30 disk sizes in these scenarios.

For more details on the specification of each VM type, see the following documents:

* [General purpose virtual machine sizes: Dv2 series 1-5](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#dv2-series)
* [Memory optimized virtual machine sizes: Dv2 series 11-15](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-memory#dv2-series-11-15)
* [General purpose virtual machine sizes: Av2 series 1-8](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general#av2-series)

### All supported regions except Brazil south and Japan west

> [!Note]
> To get the SKU identifier for use in powershell and other scripts, add `Standard_` to the beginning of all of the VM SKUs in the tables below. For example, `D12_v2` would become `Standard_D12_v2`.

| Cluster type | Hadoop | HBase | Interactive Query | Storm | Spark | ML Server | Kafka |
|---|---|---|---|---|---|---|---|
| Head: default VM size | D12_v2 | D12_v2 | D13_v2 | A4_v2 | D12_v2 | D12_v2 | D3_v2 |
| Head: recommended VM sizes | D13_v2,<br/>D14_v2,<br/>D5_v2 | D3_v2,<br/>D4_v2,<br/>D12_v2 | D13_v2,<br/>D14_v2 | A4_v2,<br/>A8_v2 | D12_v2,<br/>D13_v2,<br/>D14_v2 | D12_v2,<br/>D13_v2,<br/>D14_v2 | D3_v2,<br/>D4_v2,<br/>D12_v2 |
| Worker: default VM size | D4_v2 | D4_v2 | D14_v2 | D3_v2 | D13_v2 | D4_v2 | 4 D12_v2 with 2 S30 disks per broker |
| Worker: recommended VM sizes | D5_v2,<br>D12_v2,<br/>D13_v2 | D3_v2,<br/>D4_v2,<br/>D13_v2 | D13_v2,<br/>D14_v2 | D3_v2<br/>D4_v2,<br/>D12_v2 | D12_v2,<br>D13_v2,<br>D14_v2 | D4_v2,<br/>D12_v2,<br>D13_v2,<br>D14_v2 | D3_v2,<br/>D4_v2,<br/>DS3_v2,<br/>DS4_v2 |
| ZooKeeper: default VM size |  | A4_v2 | A4_v2 | A4_v2 |  | A2_v2 | A4_v2 |
| ZooKeeper: recommended VM sizes |  | A4_v2, <br/>A8_v2, <br/>A2m_v2 | A4_v2,<br/>A8_v2,<br/>A2m_v2 | A4_v2,<br/>A2_v2,<br/>A8_v2 |  | A2_v2 | A4_v2,<br/> A8_v2,<br/>A2m_v2 |
| ML Services: default VM size |  |  |  |  |  | D4_v2 |  |
| ML Services: recommended VM size |  |  |  |  |  | D4_v2,<br/> D12_v2,<br/> D13_v2,<br/>D14_v2 |  |

### Brazil south and Japan west only

| Cluster type | Hadoop | HBase | Interactive Query | Storm | Spark | ML Services |
|---|---|---|---|---|---|---|
| Head: default VM size | D12 | D12 | D13 | A4_v2 | D12 | D12 |
| Head: recommended VM sizes | D5_v2,<br/> D13_v2,<br/> D14_v2 | D3_v2,<br/> D4_v2,<br/> D12_v2 | D13_v2,<br/> D14_v2 | A4_v2,<br/> A8_v2 | D12_v2,<br/> D13_v2,<br/> D14_v2 | D12_v2,<br/> D13_v2,<br/> D14_v2 |
| Worker: default VM size | D4 | D4 | D14 | D3 | D13 | D4 |
| Worker: recommended VM sizes | D5_v2,<br/> D12_v2,<br/> D13_v2 | D3_v2,<br/> D4_v2,<br/> D13_v2 | D13_v2,<br/> D14_v2 | D3_v2,<br/> D4_v2,<br/> D12_v2 | D12_v2,<br/> D13_v2,<br/> D14_v2 | D4_v2,<br/> D12_v2,<br/> D13_v2,<br/> D14_v2 |
| ZooKeeper: default VM size |  | A4_v2 | A4_v2 | A4_v2 |  | A2_v2 |
| ZooKeeper: recommended VM sizes |  | A4_v2,<br/> A8_v2,<br/> A2m_v2 | A4_v2,<br/> A8_v2,<br/> A2m_v2 | A4_v2,<br/> A8_v2 |  | A2_v2 |
| ML Services: default VM sizes |  |  |  |  |  | D4 |
| ML Services: recommended VM sizes |  |  |  |  |  | D4_v2,<br/> D12_v2,<br/> D13_v2,<br/> D14_v2 |

> [!NOTE]
> - Head is known as *Nimbus* for the Storm cluster type.
> - Worker is known as *Supervisor* for the Storm cluster type.
> - Worker is known as *Region* for the HBase cluster type.

## Next steps

* [What are the Apache Hadoop components and versions available with HDInsight?](hdinsight-component-versioning.md)
