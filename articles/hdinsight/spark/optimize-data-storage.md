---
title: Optimize data storage for Apache Spark - Azure HDInsight 
description: Learn how to optimize data storage for use with Apache Spark on Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/20/2020
---
# Data storage optimization for Apache Spark

This article discusses strategies to optimize data storage for efficient Apache Spark job execution on Azure HDInsight.

## Overview

Spark supports many formats, such as csv, json, xml, parquet, orc, and avro. Spark can be extended to support many more formats with external data sources - for more information, see [Apache Spark packages](https://spark-packages.org).

The best format for performance is parquet with *snappy compression*, which is the default in Spark 2.x. Parquet stores data in columnar format, and is highly optimized in Spark.

## Choose data abstraction

Earlier Spark versions use RDDs to abstract data, Spark 1.3, and 1.6 introduced DataFrames and DataSets, respectively. Consider the following relative merits:

* **DataFrames**
    * Best choice in most situations.
    * Provides query optimization through Catalyst.
    * Whole-stage code generation.
    * Direct memory access.
    * Low garbage collection (GC) overhead.
    * Not as developer-friendly as DataSets, as there are no compile-time checks or domain object programming.
* **DataSets**
    * Good in complex ETL pipelines where the performance impact is acceptable.
    * Not good in aggregations where the performance impact can be considerable.
    * Provides query optimization through Catalyst.
    * Developer-friendly by providing domain object programming and compile-time checks.
    * Adds serialization/deserialization overhead.
    * High GC overhead.
    * Breaks whole-stage code generation.
* **RDDs**
    * You don't need to use RDDs, unless you need to build a new custom RDD.
    * No query optimization through Catalyst.
    * No whole-stage code generation.
    * High GC overhead.
    * Must use Spark 1.x legacy APIs.

## Select default storage

When you create a new Spark cluster, you can select Azure Blob Storage or Azure Data Lake Storage as your cluster's default storage. Both options give you the benefit of long-term storage for transient clusters. So your data doesn't get automatically deleted when you delete your cluster. You can recreate a transient cluster and still access your data.

| Store Type | File System | Speed | Transient | Use Cases |
| --- | --- | --- | --- | --- |
| Azure Blob Storage | **wasb:**//url/ | **Standard** | Yes | Transient cluster |
| Azure Blob Storage (secure) | **wasbs:**//url/ | **Standard** | Yes | Transient cluster |
| Azure Data Lake Storage Gen 2| **abfs:**//url/ | **Faster** | Yes | Transient cluster |
| Azure Data Lake Storage Gen 1| **adl:**//url/ | **Faster** | Yes | Transient cluster |
| Local HDFS | **hdfs:**//url/ | **Fastest** | No | Interactive 24/7 cluster |

For a full description of storage options, see [Compare storage options for use with Azure HDInsight clusters](../hdinsight-hadoop-compare-storage-options.md).

## Use the cache

Spark provides its own native caching mechanisms, which can be used through different methods such as `.persist()`, `.cache()`, and `CACHE TABLE`. This native caching is effective with small data sets and in ETL pipelines where you need to cache intermediate results. However, Spark native caching currently doesn't work well with partitioning, since a cached table doesn't keep the partitioning data. A more generic and reliable caching technique is *storage layer caching*.

* Native Spark caching (not recommended)
    * Good for small datasets.
    * Doesn't work with partitioning, which may change in future Spark releases.

* Storage level caching (recommended)
    * Can be implemented on HDInsight using the [IO Cache](apache-spark-improve-performance-iocache.md) feature.
    * Uses in-memory and SSD caching.

* Local HDFS (recommended)
    * `hdfs://mycluster` path.
    * Uses SSD caching.
    * Cached data will be lost when you delete the cluster, requiring a cache rebuild.

## Optimize data serialization

Spark jobs are distributed, so appropriate data serialization is important for the best performance.  There are two serialization options for Spark:

* Java serialization is the default.
* `Kryo` serialization is a newer format and can result in faster and more compact serialization than Java.  `Kryo` requires that you register the classes in your program, and it doesn't yet support all Serializable types.

## Use bucketing

Bucketing is similar to data partitioning. But each bucket can hold a set of column values rather than just one. This method works well for partitioning on large (in the millions or more) numbers of values, such as product identifiers. A bucket is determined by hashing the bucket key of the row. Bucketed tables offer unique optimizations because they store metadata about how they were bucketed and sorted.

Some advanced bucketing features are:

* Query optimization based on bucketing meta-information.
* Optimized aggregations.
* Optimized joins.

You can use partitioning and bucketing at the same time.

## Next steps

* [Optimize data processing for Apache Spark](optimize-cluster-configuration.md)
* [Optimize memory usage for Apache Spark](optimize-memory-usage.md)
* [Optimize cluster configuration for Apache Spark](optimize-cluster-configuration.md)
