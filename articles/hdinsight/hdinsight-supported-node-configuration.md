---
title: Azure HDInsight supported node configurations
description: Learn the minimum and recommended configurations for HDInsight cluster nodes.
keywords: vm sizes, cluster sizes, cluster configuration
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,hdiseo17may2017
ms.date: 05/14/2020
---

# What are the default and recommended node configurations for Azure HDInsight?

This article discusses default and recommended node configurations for Azure HDInsight clusters.

## Default and minimum recommended node configuration and virtual machine sizes for clusters

The following tables list default and recommended virtual machine (VM) sizes for HDInsight clusters.  This information is necessary to understand the VM sizes to use when you're creating PowerShell or Azure CLI scripts to deploy HDInsight clusters.

If you need more than 32 worker nodes in a cluster, select a head node size with at least 8 cores and 14 GB of RAM.

The only cluster types that have data disks are Kafka and HBase clusters with the Accelerated Writes feature enabled. HDInsight supports P30 and S30 disk sizes in these scenarios. For all other cluster types, HDInsight provides managed disk space with the cluster. Starting 11/07/2019, the managed disk size of each node in the newly created cluster is 128 GB. This can't be changed.

The specifications of all minimum recommended VM types used in this document are summarized in the following table.

| Size              | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max data disks / throughput: IOPS | Max NICs / Expected network bandwidth (Mbps) |
|-------------------|-----------|-------------|----------------|----------------------------------------------------------|-----------------------------------|------------------------------|
| Standard_D3_v2 | 4    | 14          | 200                    | 12000 / 187 / 93                                           | 16             / 16x500           | 4 / 3000                                       |
| Standard_D4_v2 | 8    | 28          | 400                    | 24000 / 375 / 187                                          | 32            / 32x500           | 8 / 6000                                       |
| Standard_D5_v2 | 16   | 56          | 800                    | 48000 / 750 / 375                                          | 64             / 64x500           | 8 / 12000                                    |
| Standard_D12_v2   | 4         | 28          | 200            | 12000 / 187 / 93                                         | 16 / 16x500                         | 4 / 3000                     |
| Standard_D13_v2   | 8         | 56          | 400            | 24000 / 375 / 187                                        | 32 / 32x500                       | 8 / 6000                     |
| Standard_D14_v2   | 16        | 112         | 800            | 48000 / 750 / 375                                        | 64 / 64x500                       | 8 / 12000          |
| Standard_A1_v2  | 1         | 2           | 10             | 1000 / 20 / 10                                           | 2 / 2x500               | 2 / 250                 |
| Standard_A2_v2  | 2         | 4           | 20             | 2000 / 40 / 20                                           | 4 / 4x500               | 2 / 500                 |
| Standard_A4_v2  | 4         | 8           | 40             | 4000 / 80 / 40                                           | 8 / 8x500               | 4 / 1000                     |

For more information on the specifications of each VM type, see the following documents:

* [General purpose virtual machine sizes: Dv2 series 1-5](../virtual-machines/dv2-dsv2-series.md)
* [Memory optimized virtual machine sizes: Dv2 series 11-15](../virtual-machines/dv2-dsv2-series-memory.md)
* [General purpose virtual machine sizes: Av2 series 1-8](../virtual-machines/av2-series.md)

### All supported regions except Brazil south and Japan west

> [!Note]
> To get the SKU identifier for use in powershell and other scripts, add `Standard_` to the beginning of all of the VM SKUs in the tables below. For example, `D12_v2` would become `Standard_D12_v2`.

| Cluster type | Hadoop | HBase | Interactive Query | Storm | Spark | ML Server | Kafka |
|---|---|---|---|---|---|---|---|
| Head: default VM size | D12_v2 | D12_v2 | D13_v2 | A4_v2 | D12_v2, <br/>D13_v2* | D12_v2 | D3_v2 |
| Head: minimum recommended VM sizes | D5_v2 | D3_v2 | D13_v2 | A4_v2 | D12_v2, <br/>D13_v2* | D12_v2 | D3_v2 |
| Worker: default VM size | D4_v2 | D4_v2 | D14_v2 | D3_v2 | D13_v2 | D4_v2 | 4 D12_v2 with 2 S30 disks per broker |
| Worker: minimum recommended VM sizes | D5_v2 | D3_v2 | D13_v2 | D3_v2 | D12_v2 | D4_v2 | D3_v2 |
| ZooKeeper: default VM size |  | A4_v2 | A4_v2 | A4_v2 |  | A2_v2 | A4_v2 |
| ZooKeeper: minimum recommended VM sizes |  | A4_v2 | A4_v2 | A2_v2 |  | A2_v2 | A4_v2 |
| ML Services: default VM size |  |  |  |  |  | D4_v2 |  |
| ML Services: minimum recommended VM size |  |  |  |  |  | D4_v2 |  |

\* = VM Sizes for Spark Enterprise Security Package (ESP) clusters

### Brazil south and Japan west only

| Cluster type | Hadoop | HBase | Interactive Query | Storm | Spark | ML Services |
|---|---|---|---|---|---|---|
| Head: default VM size | D12 | D12 | D13 | A4_v2 | D12 | D12 |
| Head: minimum recommended VM sizes | D5_v2 | D3_v2 | D13_v2 | A4_v2 | D12_v2 | D12_v2 |
| Worker: default VM size | D4 | D4 | D14 | D3 | D13 | D4 |
| Worker: minimum recommended VM sizes | D5_v2 | D3_v2 | D13_v2 | D3_v2 | D12_v2 | D4_v2 |
| ZooKeeper: default VM size |  | A4_v2 | A4_v2 | A4_v2 |  | A2_v2 |
| ZooKeeper: minimum recommended VM sizes |  | A4_v2 | A4_v2 | A4_v2 |  | A2_v2 |
| ML Services: default VM sizes |  |  |  |  |  | D4 |
| ML Services: minimum recommended VM sizes |  |  |  |  |  | D4_v2 |

> [!NOTE]
> - Head is known as *Nimbus* for the Storm cluster type.
> - Worker is known as *Supervisor* for the Storm cluster type.
> - Worker is known as *Region* for the HBase cluster type.

## Next steps

* [What are the Apache Hadoop components and versions available with HDInsight?](hdinsight-component-versioning.md)
