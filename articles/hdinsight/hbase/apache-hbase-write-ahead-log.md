---
title: Apache HBase write ahead log
description: Gives an overview of the Apache HBase write-ahead log feature and how it is used in Azure HDInsight.
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.topic: conceptual
ms.date: 3/27/2019

---
# Apache HBase Write Ahead Log

Apache HBase, is a type of data store often called "NoSQL" because it doesn't support many of the traditional relational database features, and does not use SQL as its primary query language. Column-oriented storage allows for better compression in columns where certain values are often repeated. It also allows for faster aggregate operations over specific columns, which are common in analytics engines. The write-ahead log is a key feature for maintaining fault-tolerance in HBase

## Overview of HBase architecture

In HBase, a **row** consists of one or more **columns** and is identified by a **row key**. Multiple rows make up a **table**. Columns contain **cells**, which are timestamped versions of the value in that column. Columns are grouped into **column families**, and all columns in a column-family are stored together in storage files called **HFiles**.

**Regions** in HBase are used to balance the data processing load. Rows for a table are first stored in a single region and then are spread across multiple regions as the amount of data in the table increases. **Region servers** can handle requests for multiple regions.

## Write-ahead log feature overview

When a data update occurs in HBase, it is first written to a type of commit log called a write-ahead log (WAL). After the update being stored to the WAL, it is written to the in-memory memstore. When the data in memory reaches its maximum capacity, it is written to disk as an HFile.

The write-ahead log provides fault-tolerance by allowing HBase to replay updates if a RegionServer crashes or becomes unavailable before the MemStore is flushed. Without the write-ahead log, the crash of a RegionServer before flushing updates to an HFile would result in all of those updates being lost.

## Write ahead log feature in Azure HDInsight

A normal HBase cluster in Azure HDInsight is configured to write data directly to its primary Azure storage option. Using Azure storage as the primary option, however, can slow down a low-latency architecture and could result in consistency problems. The write ahead log, however, is configured to write data to managed disks. Premium managed disks provide even better performance than cloud storage for situations that require low latency. They also offer replication across disks, which provides greater redundancy and fault tolerance.

## Use cases and tradeoffs

<!-- When should I enable WAL? When should I disable it? -->
<!-- What are the implication for the performance of by other HBase queries on the same cluster?-->

## How to enable HBase write ahead log

<!-- Does the enable/disable work for running clusters or only stopped ones? -->
<!-- Are we going to have our subscription whitelisted for screenshots? -->

To enable write ahead sign in your HBase cluster, do the following steps:

1. Sign in to the Azure portal
1. Select HDInsight clusters
1. Select your cluster
1. Select **Ambari home** under **Cluster dashboard**'
1. Sign in to the Ambari UI
1. Select **Hbase** from the list of services on the left
1. Select **Advanced"
1. Expand the node **hbase-site**
1. To do: Add properties to the list

Use the following properties in the hbase-site.xml configuration file to configure the size and number of WAL files:

| Configuration Property | Description | Default |
| -- | -- | -- |
|hbase.regionserver.maxlogs|Sets the maximum number of WAL files|32|
|hbase.regionserver.logroll.multiplier|Multiplier of HDFS block size|0.95|
|hbase.regionserver.hlog.blocksize|Optional override of HDFS block size|Value assigned to actual HDFS block size|

By default, an HDFS block is 64 MB and a WAL is approximately 60 MB. Make sure that enough WAL files are created to contain the total capacity of the MemStores. Use the following formula to determine the number of WAL files needed:

(regionserver_heap_size * memstore fraction) / (default_WAL_size)

## How to disable HBase write ahead log

<!-- Does the enable/disable work for running clusters or only stopped ones? -->
<!-- Are we going to have our subscription whitelisted for screenshots? -->

## Impact of cluster resize on HBase write ahead log

<!-- How does resize affect WAL? -->
<!-- Should the WAL feature be disabled before resizing? -->

## Next steps

* Official Apache HBase documentation on the [write ahead log feature](https://hbase.apache.org/book.html#wal).