---
title: Apache HBase write ahead log
description: Provides an overview of the Apache HBase write ahead log feature and how its used in Azure HDInsight
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.topic: conceptual
ms.date: 3/13/2019

---
# Apache HBase Write Ahead Log

<!-- Overview of HBase purpose -->

<!-- Overview of HBase architecture -->

The Write Ahead Log (WAL) records all changes to data in HBase, to file-based storage. Under normal operations, the WAL is not needed because data changes move from the MemStore to StoreFiles. However, if a RegionServer crashes or becomes unavailable before the MemStore is flushed, the WAL ensures that the changes to the data can be replayed. If writing to the WAL fails, the entire operation to modify the data fails.

## Write ahead log feature in Azure HDInsight

A normal HBase cluster in Azure HDInsight is configured to write data directly to its primary Azure storage option. This can slow down a low-latency architecture and could result in consistency problems. The write ahead log, however, is configured to write data to managed disks. Premium managed disks provide even better performance than cloud storage for situations that require extremely low latency. They also offer replication across disks which provides greater redundancy and fault tolerance.

## Use cases and tradeoffs

<!-- When should I enable WAL? When should I disable it? -->
<!-- What are the implication for the performance of by other HBase queries on the same cluster-->

## How to enable HBase write ahead log

<!-- What are the dependencies (external metastore, storage account, etc) -->
<!-- Does the enable/disable work for running clusters or only stopped ones? -->
<!-- Are we going to have our subscription whitelisted for screenshots? -->

## How to disable HBase write ahead log

<!-- Does the enable/disable work for running clusters or only stopped ones? -->
<!-- Are we going to have our subscription whitelisted for screenshots? -->

## Impact of cluster resize on HBase write ahead log

<!-- How does resize affect WAL? -->
<!-- Should the WAL feature be disabled before resizing? -->

## Next steps

* Official Apache HBase documentation on the [write ahead log feature](https://hbase.apache.org/book.html#wal).