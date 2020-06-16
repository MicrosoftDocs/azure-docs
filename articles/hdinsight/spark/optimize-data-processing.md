---
title: Optimize data processing for Apache Spark - Azure HDInsight 
description: Learn how to choose the most efficient operations to process your data on Apache Spark with Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/20/2020
---
# Data processing optimization for Apache Spark

This article discusses how to optimize the configuration of your Apache Spark cluster for best performance on Azure HDInsight.

## Overview

If you have slow jobs on a Join or Shuffle, the cause is probably *data skew*. Data skew  is asymmetry in your job data. For example, a map job may take 20 seconds. But running a job where the data is joined or shuffled takes hours. To fix data skew, you should salt the entire key, or use an *isolated salt* for  only some subset of keys. If you're using an isolated salt, you should further filter to isolate your subset of salted keys in map joins. Another option is to introduce a bucket column and pre-aggregate in buckets first.

Another factor causing slow joins could be the join type. By default, Spark uses the `SortMerge` join type. This type of join is best suited for large data sets. But is otherwise computationally expensive because it must first sort the left and right sides of data before merging them.

A `Broadcast` join is best suited for smaller data sets, or where one side of the join is much smaller than the other side. This type of join broadcasts one side to all executors, and so requires more memory for broadcasts in general.

You can change the join type in your configuration by setting `spark.sql.autoBroadcastJoinThreshold`, or you can set a join hint using the DataFrame APIs (`dataframe.join(broadcast(df2))`).

```scala
// Option 1
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", 1*1024*1024*1024)

// Option 2
val df1 = spark.table("FactTableA")
val df2 = spark.table("dimMP")
df1.join(broadcast(df2), Seq("PK")).
    createOrReplaceTempView("V_JOIN")

sql("SELECT col1, col2 FROM V_JOIN")
```

If you're using bucketed tables, then you have a third join type, the `Merge` join. A correctly pre-partitioned and pre-sorted dataset will skip the expensive sort phase from a `SortMerge` join.

The order of joins matters, particularly in more complex queries. Start with the most selective joins. Also, move joins that increase the number of rows after aggregations when possible.

To manage parallelism for Cartesian joins, you can add nested structures, windowing, and perhaps skip one or more steps in your Spark Job.

## Optimize job execution

* Cache as necessary, for example if you use the data twice, then cache it.
* Broadcast variables to all executors. The variables are only serialized once, resulting in faster lookups.
* Use the thread pool on the driver, which results in faster operation for many tasks.

Monitor your running jobs regularly for performance issues. If you need more insight into certain issues, consider one of the following performance profiling tools:

* [Intel PAL Tool](https://github.com/intel-hadoop/PAT) monitors CPU, storage, and network bandwidth usage.
* [Oracle Java 8 Mission Control](https://www.oracle.com/technetwork/java/javaseproducts/mission-control/java-mission-control-1998576.html) profiles Spark and executor code.

Key to Spark 2.x query performance is the Tungsten engine, which depends on whole-stage code generation. In some cases, whole-stage code generation may be disabled. For example, if you use a non-mutable type (`string`) in the aggregation expression, `SortAggregate` appears instead of `HashAggregate`. For example, for better performance, try the following and then re-enable code generation:

```sql
MAX(AMOUNT) -> MAX(cast(AMOUNT as DOUBLE))
```

## Next steps

* [Optimize data storage for Apache Spark](optimize-data-storage.md)
* [Optimize memory usage for Apache Spark](optimize-memory-usage.md)
* [Optimize cluster configuration for Apache Spark](optimize-cluster-configuration.md)
