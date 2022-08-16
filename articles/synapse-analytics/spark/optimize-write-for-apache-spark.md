---
title: Using optimize write on Apache Spark to produce more efficient tables
description: Optimize write is a efficient write feature for Apache Spark
author: DaniBunny 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 08/03/2022
ms.author: dacoelho 
ms.reviewer: martinle
---

# The need for optimize write on Apache Spark

Analytical workloads on Big Data processing engines such as Apache Spark perform most efficiently when using standardized larger file sizes. The relation between the file size, the number of files, the number of Spark workers and its configurations, play a critical role on performance. Ingestion workloads into data lake tables may have the inherited characteristic of constantly writing lots of small files; this is commonly known as the "small file problem".

Optimize Write is a Delta Lake on Synapse feature that reduces the number of files being written by Apache Spark and aims to increase the size of the written data at each file. It dynamically optimizes partitions while generating files with a default 128MB size. The target file size may be changed per workload requirements using [configurations](apache-spark-azure-create-spark-configuration.md).

This feature achieves the file size by using an extra data shuffle phase over partitions, causing an extra processing cost while writing the data. The small write penalty should be outweighed by read efficiency on the tables.

> [!NOTE]
> - Optimize write is available as a Preview feature. 
> - It is available on Synapse Pools for Apache Spark versions 3.1 and 3.2.

## Benefits of Optimize Writes

* It is available on Delta Lake tables for both Batch and Streaming write patterns.
* There is no need to change the ```spark.write``` command pattern. The feature is enabled by a configuration setting or a table property.
* It reduces the number of write transactions as compared to the OPTIMIZE command. 
* Additional OPTIMIZE operations will be faster as it will need to operate on less files.
* VACUUM command for deletion of old unreferenced files will also operate faster.
* Queries will scan less files with more optimal file sizes, improving either read performance or resource usage.

## Optimize write usage scenarios

### When to use it

* Delta lake partitioned tables subject to write patterns that generate sub-optimal (less than 128MB) or non-standardized files sizes (files with very different sizes between itself).
* Re-partitioned data frames that will be written to disk with sub-optimal files size.
* Delta lake partitioned tables targeted by small batch SQL commands like UPDATE, DELETE, MERGE, CREATE TABLE AS SELECT, INSERT INTO, etc.
* Streaming ingestion scenarios with append data patterns to Delta lake partitioned tables where the additional write latency is tolerable.

### When to avoid it

* Non partitioned tables.
* Use cases where additional write latency is not acceptable.
* Big tables with well defined optimization schedules and read patterns.

## How to enable and disable optimize write

The optimize write is disabled by default.

Once the configuration is set for the pool or session, all Spark write patterns will use the functionality.

To use optimize write, enable the following configuration:

1. Scala and PySpark

```scala
spark.conf.set("spark.microsoft.delta.optimizeWrite.enabled", "true")
```

2. Spark SQL

```SQL
SET `spark.microsoft.delta.optimizeWrite.enabled` = true
```

To check the current configuration value, use the command as shown below:

1. Scala and PySpark

```scala
spark.conf.get("spark.microsoft.delta.optimizeWrite.enabled")
```

2. Spark SQL

```SQL
SET `spark.microsoft.delta.optimizeWrite.enabled`
```

To disable optimize write, use the configuration as shown below:

1. Scala and PySpark

```scala
spark.conf.set("spark.microsoft.delta.optimizeWrite.enabled", "false")
```

2. Spark SQL

```SQL
SET `spark.microsoft.delta.optimizeWrite.enabled` = false
```

## Controlling optimize write using table properties

### On new tables
 
1. SQL

```SQL
CREATE TABLE <table_name> TBLPROPERTIES (delta.autoOptimize.optimizeWrite = true)
```

2. Scala

Using the [DeltaTableBuilder API](https://docs.delta.io/latest/api/scala/io/delta/tables/DeltaTableBuilder.html):

```scala
val table = DeltaTable.create()
  .tableName("<table_name>")
  .addColumnn("<colName>", <dataType>)
  .location("<table_location>")
  .property("delta.autoOptimize.optimizeWrite", "true") 
  .execute()
```

### On existing tables

1. SQL

```SQL
ALTER TABLE <table_name> SET TBLPROPERTIES (delta.autoOptimize.optimizeWrite = true)
```

2. Scala

Using the [DeltaTableBuilder API](https://docs.delta.io/latest/api/scala/io/delta/tables/DeltaTableBuilder.html)

```scala
val table = DeltaTable.replace()
  .tableName("<table_name>")
  .location("<table_location>")
  .property("delta.autoOptimize.optimizeWrite", "true") 
  .execute()
```

# How to get & change the current max file size configuration for Optimize Write

To get the current config value use the bellow commands. The default is 128MB.

 1. Scala and PySpark

```scala
spark.conf.get("spark.microsoft.delta.optimizeWrite.binSize")
```

2. SQL

```SQL
SET `spark.microsoft.delta.optimizeWrite.binSize`
```

- To change the config value

1. Scala and PySpark

```scala
spark.conf.set("spark.microsoft.delta.optimizeWrite.binSize", "134217728")
```

2. SQL

```SQL
SET `spark.microsoft.delta.optimizeWrite.binSize` = 134217728
```

## Next steps

 - [Use serverless Apache Spark pool in Synapse Studio](../quickstart-create-apache-spark-pool-studio.md).
 - [Run a Spark application in notebook](./apache-spark-development-using-notebooks.md).
 - [Create Apache Spark job definition in Azure Studio](./apache-spark-job-definitions.md).
 