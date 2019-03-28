---
title: Apache HBase write ahead log
description: Provides an overview of the Apache HBase write-ahead log feature and how its used in Azure HDInsight.
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.topic: conceptual
ms.date: 3/27/2019

---
# Apache HBase Write Ahead Log

<!-- Overview of HBase purpose -->

Apache HBase is a type of data store often called "NoSQL" because it does not support many of the traditional relational database features, and does not use SQL as its primary query language. Column oriented storage allows for better compression in columns where certain values are often repeated. It also allows for faster aggregate operations over specific columns, which are common in analytics engines.

<!-- Overview of HBase architecture -->

In HBase, a **row** consists of one or more **columns** and is identified by a **row key**. Multiple rows make up a **table**. Columns contain **cells** which are timestamped versions of the value in that column. Columns are grouped into **column families**, and all columns in a column-family are stored together in storage files called **HFiles**.

**Regions** in HBase are used to balance the data processing load. Rows for a table are initially stored in a single region and then are spread across multiple regions as the amount of data in the table increases. **Region servers** can handle requests for multiple regions.

"There are three major components to HBase: the client library, at least one master server, and many region servers. The region servers can be added or removed while the system is up and running to accommodate changing workloads. The master is responsible for assigning regions to region servers and uses Apache ZooKeeper, a reliable, highly available, persistent and distributed coordination service, to facilitate that task."

<!-- Write Ahead Log Feature Overview -->

When a data update occurs in HBase, it is first written to a type of commit log called a write-ahead log (WAL). After the update being stored to the WAL, it is written to the in-memory memstore. When the data in memory reaches its maximum capacity, it is written to disk as an HFile.

The write-ahead log provides fault-tolerance by allowing HBase to replay updates if a RegionServer crashes or becomes unavailable before the MemStore is flushed. Without the write-ahead log, the crash of a RegionServer before flushing updates to an HFile would result in all of those updates being lost.

## Write ahead log feature in Azure HDInsight

A normal HBase cluster in Azure HDInsight is configured to write data directly to its primary Azure storage option. This can slow down a low-latency architecture and could result in consistency problems. The write ahead log, however, is configured to write data to managed disks. Premium managed disks provide even better performance than cloud storage for situations that require extremely low latency. They also offer replication across disks which provides greater redundancy and fault tolerance.

## Use cases and tradeoffs

<!-- When should I enable WAL? When should I disable it? -->
<!-- What are the implication for the performance of by other HBase queries on the same cluster?-->

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