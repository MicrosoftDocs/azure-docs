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
ms.date: 08/20/2019
---
# What are the minimum and recommended node configurations for Azure HDInsight?

This article discusses various node configurations for the Azure HDInsight service: default, recommended, and supported.

## Default node configuration and virtual machine sizes for clusters

The following tables list the **default** virtual machine (VM) sizes for HDInsight clusters.  This chart is necessary to understand the VM sizes to use when you are creating PowerShell or Azure CLI scripts to deploy HDInsight clusters. If you need more than 32 worker nodes in a cluster, select a head node size with at least 8 cores and 14 GB of RAM.

* All supported regions except Brazil South and Japan West:

|Cluster type|Hadoop|HBase|Interactive Query|Storm|Spark|ML Server|Kafka|
|---|---|---|---|---|---|---|---|
|Head: default VM size|D12 v2|D12 v2|D13 v2|A3|D12 v2|D12 v2|D3v2|
|Head: recommended VM sizes|D3 v2|D3 v2|D13|A4 v2|D12 v2|D12 v2|A2M v2|
||D4 v2|D4 v2|D14|A8 v2|D13 v2|D13 v2|D3 v2|
||D12 v2|D12 v2|E16 v3|A2m v2|D14 v2|D14 v2|D4 v2|
||E4 v3|E4 v3|E32 v3|E4 v3|E4 v3|E4 v3|D12 v2|
|Worker: default VM size|D4 v2|D4 v2|D14 v2|D3 v2|D13 v2|D4 v2|4 D12v2 with 2 S30 disks per broker|
|Worker: recommended VM sizes|D3 v2|D3 v2|D13|D3 v2|D4 v2|D4 v2|D13 v2|
||D4 v2|D4 v2|D14|D4 v2|D12 v2|D12 v2|DS12 v2|
||D12 v2|D12 v2|E16 v3|D12 v2|D13 v2|D13 v2|DS13 v2|
||E4 v3|E4 v3|E20 v3|E4 v3|D14 v2|D14 v2|E4 v3|
||||E32 v3||E16 v3|E16 v3|ES4 v3|
||||E64 v3||E20 v3|E20 v3|E8 v3|
||||||E32 v3|E32 v3|ES8 v3|
||||||E64 v3|E64 v3||
|ZooKeeper: default VM size||A4 v2|A4 v2|A4 v2||A2 v2|D3v2|
|ZooKeeper: recommended VM sizes||A4 v2||A2 v2|||A2M v2|
|||A8 v2||A4 v2|||D3 v2|
|||A2m v2||A8 v2|||E8 v3|
|ML Services: default VM size||||||D4 v2||
|ML Services: recommended VM size||||||D4 v2||
|||||||D12 v2||
|||||||D13 v2||
|||||||D14 v2||
|||||||E16 v3||
|||||||E20 v3||
|||||||E32 v3||
|||||||E64 v3||

* Brazil South and Japan West only (no v2 sizes):

| Cluster type | Hadoop | HBase | Interactive Query |Storm | Spark | ML Services |
| --- | --- | --- | --- | --- | --- | --- |
| Head: default VM size |D12 |D12  | D13 |A3 |D12 |D12 |
| Head: recommended VM sizes |D3,<br/> D4,<br/> D12 |D3,<br/> D4,<br/> D12  | D13,<br/> D14 |A3,<br/> A4,<br/> A5 |D12,<br/> D13,<br/> D14 |D12,<br/> D13,<br/> D14 |
| Worker: default VM size |D4 |D4  |  D14 |D3 |D13 |D4 |
| Worker: recommended VM sizes |D3,<br/> D4,<br/> D12 |D3,<br/> D4,<br/> D12  | D13,<br/> D14 |D3,<br/> D4,<br/> D12 |D4,<br/> D12,<br/> D13,<br/> D14 | D4,<br/> D12,<br/> D13,<br/> D14 |
| ZooKeeper: default VM size | |A4 v2 | A4 v2| A4 v2 | | A2 v2|
| ZooKeeper: recommended VM sizes | |A2,<br/> A3,<br/> A4 | |A2,<br/> A3,<br/> A4 | | |
| ML Services: default VM sizes | | | | | |D4 |
| ML Services: recommended VM sizes | | | | | |D4,<br/> D12,<br/> D13,<br/> D14 |

> [!NOTE]
> - Head is known as *Nimbus* for the Storm cluster type.
> - Worker is known as *Supervisor* for the Storm cluster type.
> - Worker is known as *Region* for the HBase cluster type.

## Next steps

* [What are the Apache Hadoop components and versions available with HDInsight?](hdinsight-component-versioning.md)