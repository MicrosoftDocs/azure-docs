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

Delta Lake [MERGE command](https://docs.delta.io/latest/delta-update.html#upsert-into-a-table-using-merge) allows users to update a delta table with advanced conditions. It can update data from a source table, view or DataFrame into a target table by using MERGE command. However, the current algorithm is not fully optimized for handling *unmodified* rows. With Low Shuffle Merge optimization, unmodified rows are excluded from an expensive shuffling operation which is needed for updating matched rows.

Currently MERGE operation is done by 2 Join operations. The first join is using the whole target table and source data, to find a list of *touched* files of the target table including any matched rows. After that, it performs the second join reading only those *touched* files and source data, to do actual table update. Even though the first join is to reduce the amount of data for the second join, there could still be a huge number of *unmodified* rows in *touched* files. The first Join query is lighter because it only reads columns in the given matching condition, but the second one needs to load all columns of each file which incurs a heavy shuffling process.

With Low Shuffle Merge optimization, Delta keeps the matched row result from the first join temporarily and utilizes it for the second join. Using the result, it excludes *unmodified* rows from the heavy shuffling process. There would be 2 separate write jobs for *matched* rows and *unmodified* rows, thus it could result in 2x number of output files compared to the previous behavior. However, the expected performance gain outweighs the possible small files problem.
## Availability

> [!NOTE]
> - Low Shuffle Merge is available as a Preview feature. 

It is available on Synapse Pools for Apache Spark versions 3.2 and 3.3.

|Version| Availability | Default |
|--|--|--|
| Delta 0.6 / Spark 2.4 | No | - |
| Delta 1.2 / Spark 3.2 | Yes | false |
| Delta 2.2 / Spark 3.3 | Yes | true |


## Benefits of Low Shuffle Merge

* Unmodified rows in *touched* files are handled separately and not going through the actual MERGE operation. It can save the overall MERGE execution time and compute resources. The gain would be larger when a lot of rows are just copied and only a small number of rows are updated.
* Row orderings are preserved for unmodified rows. Therefore, the output files of unmodified rows could be still efficient for data skipping if the file was sorted or Z-ORDERED.
* Very little overhead even for the worst case which is matching all rows.


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
