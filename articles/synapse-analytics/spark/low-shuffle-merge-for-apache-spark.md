---
title: Low Shuffle Merge optimization on Delta tables
description: Low Shuffle Merge optimization on Delta tables for Apache Spark
author: sezruby
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 04/11/2023
ms.author: eunjinsong
ms.reviewer: dacoelho
---

# Low Shuffle Merge optimization on Delta tables

Delta Lake [MERGE command](https://docs.delta.io/latest/delta-update.html#upsert-into-a-table-using-merge) allows users to update a delta table with advanced conditions. It can update data from a source table, view or DataFrame into a target table by using MERGE command. However, the current algorithm isn't fully optimized for handling *unmodified* rows. With Low Shuffle Merge optimization, unmodified rows are excluded from an expensive shuffling operation that is needed for updating matched rows.

## Why we need Low Shuffle Merge

Currently MERGE operation is done by two Join executions. The first join is using the whole target table and source data, to find a list of *touched* files of the target table including any matched rows. After that, it performs the second join reading only those *touched* files and source data, to do actual table update. Even though the first join is to reduce the amount of data for the second join, there could still be a huge number of *unmodified* rows in *touched* files. The first join query is lighter as it only reads columns in the given matching condition. The second one for table update needs to load all columns, which incurs an expensive shuffling process.

With Low Shuffle Merge optimization, Delta keeps the matched row result from the first join temporarily and utilizes it for the second join. Based on the result, it excludes *unmodified* rows from the heavy shuffling process. There would be two separate write jobs for *matched* rows and *unmodified* rows, thus it could result in 2x number of output files compared to the previous behavior. However, the expected performance gain outweighs the possible small files problem.

## Availability

> [!NOTE]
> - Low Shuffle Merge is available as a Preview feature. 

It's available on Synapse Pools for Apache Spark versions 3.2 and 3.3.

|Version| Availability | Default |
|--|--|--|
| Delta 0.6 / [Spark 2.4](./apache-spark-24-runtime.md) | No | - |
| Delta 1.2 / [Spark 3.2](./apache-spark-32-runtime.md) | Yes | false |
| Delta 2.2 / [Spark 3.3](./apache-spark-33-runtime.md) | Yes | true |


## Benefits of Low Shuffle Merge

* Unmodified rows in *touched* files are handled separately and not going through the actual MERGE operation. It can save the overall MERGE execution time and compute resources. The gain would be larger when many rows are copied and only a few rows are updated.
* Row orderings are preserved for unmodified rows. Therefore, the output files of unmodified rows could be still efficient for data skipping if the file was sorted or Z-ORDERED.
* There would be tiny overhead even for the worst case when MERGE condition matches all rows in touched files.


## How to enable and disable Low Shuffle Merge

Once the configuration is set for the pool or session, all Spark write patterns will use the functionality.

To use Low Shuffle Merge optimization, enable it using the following configuration:

1. Scala and PySpark

```scala
spark.conf.set("spark.microsoft.delta.merge.lowShuffle.enabled", "true")
```

2. Spark SQL

```SQL
SET `spark.microsoft.delta.merge.lowShuffle.enabled` = true
```

To check the current configuration value, use the command as shown below:

1. Scala and PySpark

```scala
spark.conf.get("spark.microsoft.delta.merge.lowShuffle.enabled")
```

2. Spark SQL

```SQL
SET `spark.microsoft.delta.merge.lowShuffle.enabled`
```

To disable the feature, change the following configuration as shown below:

1. Scala and PySpark

```scala
spark.conf.set("spark.microsoft.delta.merge.lowShuffle.enabled", "false")
```

2. Spark SQL

```SQL
SET `spark.microsoft.delta.merge.lowShuffle.enabled` = false
```
