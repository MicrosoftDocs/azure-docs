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

# Introduction

Delta Lake [MERGE command](https://docs.delta.io/latest/delta-update.html#upsert-into-a-table-using-merge) allows users to update a delta table with advanced conditions. It can update data from a source table, view or DataFrame into a target table by using MERGE command. However, the current algorithm of MERGE command is not optimized for handling *unmodified* rows. With Low Shuffle Merge optimization, unmodified rows are excluded from expensive shuffling execution and written separately.

To execute MERGE, 2 join operations are required. The first one is joining whole target table and source data, to find *touched* files including any matched row. The other one is for actual MERGE operation only with *touched* files of the target table. The first join is lighter as it only reads columns in matching condition. Although Delta performs the first join to reduce the amount of data for the actual merge process, huge amount of *unmodified* rows in *touched* files goes through the second join process. With Low Shuffle Merge, Delta retreives "matched" rows result from the first join and utilizes it for classifying *matched* rows. Based on that, there are 2 separate write jobs for *matched* rows and *unmodified* rows, so it could result in 2x number of output files compared to default MERGE operation. The expected performance gain outweighs the possible small files problem. 

## Availability

> [!NOTE]
> - Low shuffle merge is available as a Preview feature. 

It is available on Synapse Pools for Apache Spark versions 3.2 and 3.3.

|Version| Availability | Default |
|--|--|--|
| Delta 0.6 / Spark 2.4 | No | - |
| Delta 1.2 / Spark 3.2 | Yes | false |
| Delta 2.2 / Spark 3.3 | Yes | true |


## Benefits of Low Shuffle Merge

* Unmodified rows in *touched* files are handled separately and not going through the actual MERGE operation. It can save the overall MERGE execution time and resources.
* Row orderings are preserved for unmodified rows. Therefore, the output files of unmodified rows are still efficient for data skipping if the file was sorted or Z-ORDERED.
* Not much overhead even for the worst cast which is matching all rows.


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

## Future improvement

With Low Shuffle Merge feature, rewriting unmodified rows still takes a long time and resources. There is ongoing work in OSS Delta Lake for deletion vector. Once it is delivered, we would be able to skip rewriting unmodified rows.
