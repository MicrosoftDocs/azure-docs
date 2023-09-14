---
title: Overview of how to use Linux Foundation Delta Lake in Apache Spark for Azure Synapse Analytics
description: Learn how to use Delta Lake in Apache Spark for Azure Synapse Analytics, to create, and use tables with ACID properties.
author: juluczni
ms.author: juluczni
ms.service:  synapse-analytics
ms.reviewer: euang
ms.topic: overview
ms.subservice: spark
ms.date: 02/15/2022
ms.custom: devx-track-csharp, devx-track-python
zone_pivot_groups: programming-languages-spark-all-minus-sql-r
---

# Linux Foundation Delta Lake overview

This article has been adapted for more clarity from its original counterpart [here](https://docs.delta.io/latest/quick-start.html). This article helps you quickly explore the main features of [Delta Lake](https://delta.io). The article provides code snippets that show how to read from and write to Delta Lake tables from interactive, batch, and streaming queries. The code snippets are also available in a set of notebooks [PySpark here](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/PySpark/Hitchikers%20Guide%20to%20Delta%20Lake%20-%20Python.ipynb), [Scala here](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/Scala/Hitchikers%20Guide%20to%20Delta%20Lake%20-%20Scala.ipynb), and [C# here](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/Spark.NET%20C%23/Hitchikers%20Guide%20to%20Delta%20Lake%20-%20CSharp.ipynb)

Here's what we will cover:

* Create a table
* Read data
* Update table data
* Overwrite table data
* Conditional update without overwrite
* Read older versions of data using Time Travel
* Write a stream of data to a table
* Read a stream of changes from a table
* SQL Support

## Configuration

Make sure you modify the below as appropriate for your environment.

:::zone pivot = "programming-language-python"

```python
import random

session_id = random.randint(0,1000000)
delta_table_path = "/delta/delta-table-{0}".format(session_id)

delta_table_path
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var sessionId = (new Random()).Next(10000000);
var deltaTablePath = $"/delta/delta-table-{sessionId}";

deltaTablePath
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val sessionId = scala.util.Random.nextInt(1000000)
val deltaTablePath = s"/delta/delta-table-$sessionId";
```

::: zone-end

Results in:

'/delta/delta-table-335323'

## Create a table

To create a Delta Lake table, write a DataFrame out a DataFrame in the delta format. You can change the format from Parquet, CSV, JSON, and so on, to delta.

The code that follows shows you how to create a new Delta Lake table using the schema inferred from your DataFrame.

:::zone pivot = "programming-language-python"

```python
data = spark.range(0,5)
data.show()
data.write.format("delta").save(delta_table_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var data = spark.Range(0,5);
data.Show();
data.Write().Format("delta").Save(deltaTablePath);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val data = spark.range(0, 5)
data.show
data.write.format("delta").save(deltaTablePath)
```

::: zone-end

Results in:

| ID|
|---|
|  0|
|  1|
|  2|
|  3|
|  4|

## Read data

You read data in your Delta Lake table by specifying the path to the files and the delta format.

:::zone pivot = "programming-language-python"

```python
df = spark.read.format("delta").load(delta_table_path)
df.show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var df = spark.Read().Format("delta").Load(deltaTablePath);
df.Show()
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val df = spark.read.format("delta").load(deltaTablePath)
df.show()
```

::: zone-end

Results in:

| ID|
|---|
|  1|
|  3|
|  4|
|  0|
|  2|

The order of the results is different from above as there was no order explicitly specified before outputting the results.

## Update table data

Delta Lake supports several operations to modify tables using standard DataFrame APIs. These operations are one of the enhancements that delta format adds. The following example runs a batch job to overwrite the data in the table.

:::zone pivot = "programming-language-python"

```python
data = spark.range(5,10)
data.write.format("delta").mode("overwrite").save(delta_table_path)
df.show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var data = spark.Range(5,10);
data.Write().Format("delta").Mode("overwrite").Save(deltaTablePath);
df.Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val data = spark.range(5, 10)
data.write.format("delta").mode("overwrite").save(deltaTablePath)
df.show()
```

::: zone-end

Results in:

| ID|
|---|
|  7|
|  8|
|  5|
|  9|
|  6|

Here you can see that all five records have been updated to hold new values.

## Save as catalog tables

Delta Lake can write to managed or external catalog tables.

:::zone pivot = "programming-language-python"

```python
data.write.format("delta").saveAsTable("ManagedDeltaTable")
spark.sql("CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '{0}'".format(delta_table_path))
spark.sql("SHOW TABLES").show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
data.Write().Format("delta").SaveAsTable("ManagedDeltaTable");
spark.Sql($"CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '{deltaTablePath}'");
spark.Sql("SHOW TABLES").Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
data.write.format("delta").saveAsTable("ManagedDeltaTable")
spark.sql(s"CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '$deltaTablePath'")
spark.sql("SHOW TABLES").show
```

::: zone-end

Results in:

|database|         tableName|isTemporary|
|--------|------------------|-----------|
| default|externaldeltatable|      false|
| default| manageddeltatable|      false|

With this code, you created a new table in the catalog from an existing dataframe, referred to as a managed table. Then you defined a new external table in the catalog that uses an existing location, referred to as an external table. In the output you can see both tables, no matter how they were created, are listed in the catalog.

Now you can look at the extended properties of both of these tables

:::zone pivot = "programming-language-python"

```python
spark.sql("DESCRIBE EXTENDED ManagedDeltaTable").show(truncate=False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
spark.Sql("DESCRIBE EXTENDED ManagedDeltaTable").Show(truncate: 0);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
spark.sql("DESCRIBE EXTENDED ManagedDeltaTable").show(truncate=false)
```

::: zone-end

Results in:

|col_name                    |data_type                                                                                                    |comment|
|----------------------------|-------------------------------------------------------------------------------------------------------------|-------|
|id                          |bigint                                                                                                       |null   |
|                            |                                                                                                             |       |
|Detailed Table Information  |                                                                                                             |       |
|Database                    |default                                                                                                      |       |
|Table                       |manageddeltatable                                                                                            |       |
|Owner                       |trusted-service-user                                                                                         |       |
|Created Time                |Sat Apr 25 00:35:34 UTC 2020                                                                                 |       |
|Last Access                 |Thu Jan 01 00:00:00 UTC 1970                                                                                 |       |
|Created By                  |Spark 2.4.4.2.6.99.201-11401300                                                                              |       |
|Type                        |MANAGED                                                                                                      |       |
|Provider                    |delta                                                                                                        |       |
|Table Properties            |[transient_lastDdlTime=1587774934]                                                                           |       |
|Statistics                  |2407 bytes                                                                                                   |       |
|Location                    |abfss://data@\<data lake\>.dfs.core.windows.net/synapse/workspaces/\<workspace name\>/warehouse/manageddeltatable|       |
|Serde Library               |org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe                                                           |       |
|InputFormat                 |org.apache.hadoop.mapred.SequenceFileInputFormat                                                             |       |
|OutputFormat                |org.apache.hadoop.hive.ql.io.HiveSequenceFileOutputFormat                                                    |       |
|Storage Properties          |[serialization.format=1]                                                                                     |       |

:::zone pivot = "programming-language-python"

```python
spark.sql("DESCRIBE EXTENDED ExternalDeltaTable").show(truncate=False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
spark.Sql("DESCRIBE EXTENDED ExternalDeltaTable").Show(truncate: 0);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
spark.sql("DESCRIBE EXTENDED ExternalDeltaTable").show(truncate=false)
```

::: zone-end

Results in:

|col_name                    |data_type                                                             |comment|
|----------------------------|----------------------------------------------------------------------|-------|
|id                          |bigint                                                                |null   |
|                            |                                                                      |       |
|Detailed Table Information  |                                                                      |       |
|Database                    |default                                                               |       |
|Table                       |externaldeltatable                                                    |       |
|Owner                       |trusted-service-user                                                  |       |
|Created Time                |Sat Apr 25 00:35:38 UTC 2020                                          |       |
|Last Access                 |Thu Jan 01 00:00:00 UTC 1970                                          |       |
|Created By                  |Spark 2.4.4.2.6.99.201-11401300                                       |       |
|Type                        |EXTERNAL                                                              |       |
|Provider                    |DELTA                                                                 |       |
|Table Properties            |[transient_lastDdlTime=1587774938]                                    |       |
|Location                    |abfss://data@\<data lake\>.dfs.core.windows.net/delta/delta-table-587152|       |
|Serde Library               |org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe                    |       |
|InputFormat                 |org.apache.hadoop.mapred.SequenceFileInputFormat                      |       |
|OutputFormat                |org.apache.hadoop.hive.ql.io.HiveSequenceFileOutputFormat             |       |
|Storage Properties          |[serialization.format=1]                                              |       |

## Conditional update without overwrite

Delta Lake provides programmatic APIs to conditional update, delete, and merge (this command is commonly referred to as an upsert) data into tables.

:::zone pivot = "programming-language-python"

```python
from delta.tables import *
from pyspark.sql.functions import *

delta_table = DeltaTable.forPath(spark, delta_table_path)

delta_table.update(
  condition = expr("id % 2 == 0"),
  set = { "id": expr("id + 100") })
delta_table.toDF().show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
using Microsoft.Spark.Extensions.Delta;
using Microsoft.Spark.Extensions.Delta.Tables;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;

var deltaTable = DeltaTable.ForPath(deltaTablePath);

deltaTable.Update(
  condition: Expr("id % 2 == 0"),
  set: new Dictionary<string, Column>(){{ "id", Expr("id + 100") }});
deltaTable.ToDF().Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
import io.delta.tables._
import org.apache.spark.sql.functions._

val deltaTable = DeltaTable.forPath(deltaTablePath)

// Update every even value by adding 100 to it
deltaTable.update(
  condition = expr("id % 2 == 0"),
  set = Map("id" -> expr("id + 100")))
deltaTable.toDF.show
```

::: zone-end

Results in:

| ID|
|---|
|106|
|108|
|  5|
|  7|
|  9|

Here you just added 100 to every even ID.

:::zone pivot = "programming-language-python"

```python
delta_table.delete("id % 2 == 0")
delta_table.toDF().show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
deltaTable.Delete(condition: Expr("id % 2 == 0"));
deltaTable.ToDF().Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
deltaTable.delete(condition = expr("id % 2 == 0"))
deltaTable.toDF.show
```

::: zone-end

Results in:

| ID|
|---|
|  5|
|  7|
|  9|

Notice that every even row has been deleted.

:::zone pivot = "programming-language-python"

```python
new_data = spark.range(0,20).alias("newData")

delta_table.alias("oldData")\
    .merge(new_data.alias("newData"), "oldData.id = newData.id")\
    .whenMatchedUpdate(set = { "id": lit("-1")})\
    .whenNotMatchedInsert(values = { "id": col("newData.id") })\
    .execute()

delta_table.toDF().show(100)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var newData = spark.Range(20).As("newData");

deltaTable
    .As("oldData")
    .Merge(newData, "oldData.id = newData.id")
    .WhenMatched()
        .Update(new Dictionary<string, Column>() {{"id", Lit("-1")}})
    .WhenNotMatched()
        .Insert(new Dictionary<string, Column>() {{"id", Col("newData.id")}})
    .Execute();

deltaTable.ToDF().Show(100);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val newData = spark.range(0, 20).toDF

deltaTable.as("oldData").
  merge(
    newData.as("newData"),
    "oldData.id = newData.id").
  whenMatched.
  update(Map("id" -> lit(-1))).
  whenNotMatched.
  insert(Map("id" -> col("newData.id"))).
  execute()

deltaTable.toDF.show()
```

::: zone-end

Results in:

| ID|
|---|
| 18|
| 15|
| 19|
|  2|
|  1|
|  6|
|  8|
|  3|
| -1|
| 10|
| 13|
|  0|
| 16|
|  4|
| -1|
| 12|
| 11|
| 14|
| -1|
| 17|

Here you have a combination of the existing data. The existing data has been assigned the value -1 in the update(WhenMatched) code path. The new data that was created at the top of the snippet and was added via the insert code path (WhenNotMatched), was also added.

### History

Delta Lake's has the ability to allow looking into history of a table. That is, the changes that were made to the underlying Delta Table. The cell below shows how simple it's to inspect the history.

:::zone pivot = "programming-language-python"

```python
delta_table.history().show(20, 1000, False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
deltaTable.History().Show(20, 1000, false);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
deltaTable.history.show(false)
```

::: zone-end

Results in:

|version|          timestamp|userId|userName|operation|                                                operationParameters| job|notebook|clusterId|readVersion|isolationLevel|isBlindAppend|
|-------|-------------------|------|--------|---------|-------------------------------------------------------------------|----|--------|---------|-----------|--------------|-------------|
|      4|2020-04-25 00:36:27|  null|    null|    MERGE|                       [predicate -> (oldData.`ID` = newData.`ID`)]|null|    null|     null|          3|          null|        false|
|      3|2020-04-25 00:36:08|  null|    null|   DELETE|[predicate -> ["((`ID` % CAST(2 AS BIGINT)) = CAST(0 AS BIGINT))"]]|null|    null|     null|          2|          null|        false|
|      2|2020-04-25 00:35:51|  null|    null|   UPDATE| [predicate -> ((ID#744L % cast(2 as bigint)) = cast(0 as bigint))]|null|    null|     null|          1|          null|        false|
|      1|2020-04-25 00:35:05|  null|    null|    WRITE|                             [mode -> Overwrite, partitionBy -> []]|null|    null|     null|          0|          null|        false|
|      0|2020-04-25 00:34:34|  null|    null|    WRITE|                         [mode -> ErrorIfExists, partitionBy -> []]|null|    null|     null|       null|          null|         true|

Here you can see all of the modifications made over the above code snippets.

## Read older versions of data using Time Travel

It's possible to query previous snapshots of your Delta Lake table by using a feature called Time Travel. If you want to access the data that you overwrote, you can query a snapshot of the table before you overwrote the first set of data using the versionAsOf option.

Once you run the cell below, you should see the first set of data from before you overwrote it. Time Travel is a powerful feature that takes advantage of the power of the Delta Lake transaction log to access data that is no longer in the table. Removing the version 0 option (or specifying version 1) would let you see the newer data again. For more information, see [Query an older snapshot of a table](https://docs.delta.io/latest/delta-batch.html#deltatimetravel).

:::zone pivot = "programming-language-python"

```python
df = spark.read.format("delta").option("versionAsOf", 0).load(delta_table_path)
df.show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var df = spark.Read().Format("delta").Option("versionAsOf", 0).Load(deltaTablePath);
df.Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val df = spark.read.format("delta").option("versionAsOf", 0).load(deltaTablePath)
df.show()
```

::: zone-end

Results in:

| ID|
|---|
|  0|
|  1|
|  4|
|  3|
|  2|

Here you can see you've gone back to the earliest version of the data.

## Write a stream of data to a table

You can also write to a Delta Lake table using Spark's Structured Streaming. The Delta Lake transaction log guarantees exactly once processing, even when there are other streams or batch queries running concurrently against the table. By default, streams run in append mode, which adds new records to the table.

For more information about Delta Lake integration with Structured Streaming, see [Table Streaming Reads and Writes](https://docs.delta.io/latest/delta-streaming.html).

In the cells below, here's what we are doing:

* Cell 30 Show the newly appended data
* Cell 31 Inspect history
* Cell 32 Stop the structured streaming job
* Cell 33 Inspect history <--You'll notice appends have stopped

First you're going to set up a simple Spark Streaming job to generate a sequence and make the job write to your Delta Table.

:::zone pivot = "programming-language-python"

```python
streaming_df = spark.readStream.format("rate").load()
stream = streaming_df\
    .selectExpr("value as id")\
    .writeStream\
    .format("delta")\
    .option("checkpointLocation", "/tmp/checkpoint-{0}".format(session_id))\
    .start(delta_table_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var streamingDf = spark.ReadStream().Format("rate").Load();
var stream = streamingDf.SelectExpr("value as id").WriteStream().Format("delta").Option("checkpointLocation", $"/tmp/checkpoint-{sessionId}").Start(deltaTablePath);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val streamingDf = spark.readStream.format("rate").load()
val stream = streamingDf.select($"value" as "id").writeStream.format("delta").option("checkpointLocation", s"/tmp/checkpoint-$sessionId").start(deltaTablePath)
```

::: zone-end

## Read a stream of changes from a table

While the stream is writing to the Delta Lake table, you can also read from that table as a streaming source. For example, you can start another streaming query that prints all the changes made to the Delta Lake table.

:::zone pivot = "programming-language-python"

```python
delta_table.toDF().sort(col("id").desc()).show(100)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
deltaTable.ToDF().Sort(Col("id").Desc()).Show(100);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
deltaTable.toDF.sort($"id".desc).show
```

::: zone-end

Results in:

| ID|
|---|
| 19|
| 18|
| 17|
| 16|
| 15|
| 14|
| 13|
| 12|
| 11|
| 10|
|  8|
|  6|
|  4|
|  3|
|  2|
|  1|
|  0|
| -1|
| -1|
| -1|

:::zone pivot = "programming-language-python"

```python
delta_table.history().drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").show(20, 1000, False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
deltaTable.History().Drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").Show(20, 1000, false);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
deltaTable.history.show
```

::: zone-end

Results in:

|version|          timestamp|       operation|                                                                  operationParameters|readVersion|
|-------|-------------------|----------------|-------------------------------------------------------------------------------------|-----------|
|      5|2020-04-25 00:37:09|STREAMING UPDATE|[outputMode -> Append, queryId -> d26b4f8a-7e5a-44f2-a5fb-23a7bd02aef7, epochId -> 0]|          4|
|      4|2020-04-25 00:36:27|           MERGE|                                         [predicate -> (oldData.`id` = newData.`id`)]|          3|
|      3|2020-04-25 00:36:08|          DELETE|                  [predicate -> ["((`id` % CAST(2 AS BIGINT)) = CAST(0 AS BIGINT))"]]|          2|
|      2|2020-04-25 00:35:51|          UPDATE|                   [predicate -> ((id#744L % cast(2 as bigint)) = cast(0 as bigint))]|          1|
|      1|2020-04-25 00:35:05|           WRITE|                                               [mode -> Overwrite, partitionBy -> []]|          0|
|      0|2020-04-25 00:34:34|           WRITE|                                           [mode -> ErrorIfExists, partitionBy -> []]|       null|

Here you're dropping some of the less interesting columns to simplify the viewing experience of the history view.

:::zone pivot = "programming-language-python"

```python
stream.stop()
delta_table.history().drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").show(100, 1000, False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
stream.Stop();
deltaTable.History().Drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").Show(100, 1000, false);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
stream.stop
deltaTable.history.show
```

Results in:

|version|          timestamp|       operation|                                                                  operationParameters|readVersion|
|-------|-------------------|----------------|-------------------------------------------------------------------------------------|-----------|
|      5|2020-04-25 00:37:09|STREAMING UPDATE|[outputMode -> Append, queryId -> d26b4f8a-7e5a-44f2-a5fb-23a7bd02aef7, epochId -> 0]|          4|
|      4|2020-04-25 00:36:27|           MERGE|                                         [predicate -> (oldData.`id` = newData.`id`)]|          3|
|      3|2020-04-25 00:36:08|          DELETE|                  [predicate -> ["((`id` % CAST(2 AS BIGINT)) = CAST(0 AS BIGINT))"]]|          2|
|      2|2020-04-25 00:35:51|          UPDATE|                   [predicate -> ((id#744L % cast(2 as bigint)) = cast(0 as bigint))]|          1|
|      1|2020-04-25 00:35:05|           WRITE|                                               [mode -> Overwrite, partitionBy -> []]|          0|
|      0|2020-04-25 00:34:34|           WRITE|                                           [mode -> ErrorIfExists, partitionBy -> []]|       null|

::: zone-end

## Convert Parquet to Delta

You can do an in-place conversion from the Parquet format to Delta.

Here you're going to test if the existing table is in delta format or not.
:::zone pivot = "programming-language-python"

```python
parquet_path = "/parquet/parquet-table-{0}".format(session_id)
data = spark.range(0,5)
data.write.parquet(parquet_path)
DeltaTable.isDeltaTable(spark, parquet_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var parquetPath = $"/parquet/parquet-table-{sessionId}";
var data = spark.Range(0,5);
data.Write().Parquet(parquetPath);
DeltaTable.IsDeltaTable(parquetPath)
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val parquetPath = s"/parquet/parquet-table-$sessionId"
val data = spark.range(0,5)
data.write.parquet(parquetPath)
DeltaTable.isDeltaTable(parquetPath)
```

::: zone-end

Results in:

False

Now you're going to convert the data to delta format and verify it worked.

:::zone pivot = "programming-language-python"

```python
DeltaTable.convertToDelta(spark, "parquet.`{0}`".format(parquet_path))
DeltaTable.isDeltaTable(spark, parquet_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
DeltaTable.ConvertToDelta(spark, $"parquet.`{parquetPath}`");
DeltaTable.IsDeltaTable(parquetPath)
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
DeltaTable.convertToDelta(spark, s"parquet.`$parquetPath`")
DeltaTable.isDeltaTable(parquetPath)
```

::: zone-end

Results in:

True

## SQL support

Delta supports table utility commands through SQL. You can use SQL to:

* Get a DeltaTable's history
* Vacuum a DeltaTable
* Convert a Parquet file to Delta

:::zone pivot = "programming-language-python"

```python
spark.sql("DESCRIBE HISTORY delta.`{0}`".format(delta_table_path)).show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
spark.Sql($"DESCRIBE HISTORY delta.`{deltaTablePath}`").Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
spark.sql(s"DESCRIBE HISTORY delta.`$deltaTablePath`").show()
```

::: zone-end

Results in:

|version|          timestamp|userId|userName|       operation| operationParameters| job|notebook|clusterId|readVersion|isolationLevel|isBlindAppend|
|-------|-------------------|------|--------|----------------|--------------------|----|--------|---------|-----------|--------------|-------------|
|      5|2020-04-25 00:37:09|  null|    null|STREAMING UPDATE|[outputMode -> Ap...|null|    null|     null|          4|          null|         true|
|      4|2020-04-25 00:36:27|  null|    null|           MERGE|[predicate -> (ol...|null|    null|     null|          3|          null|        false|
|      3|2020-04-25 00:36:08|  null|    null|          DELETE|[predicate -> ["(...|null|    null|     null|          2|          null|        false|
|      2|2020-04-25 00:35:51|  null|    null|          UPDATE|[predicate -> ((i...|null|    null|     null|          1|          null|        false|
|      1|2020-04-25 00:35:05|  null|    null|           WRITE|[mode -> Overwrit...|null|    null|     null|          0|          null|        false|
|      0|2020-04-25 00:34:34|  null|    null|           WRITE|[mode -> ErrorIfE...|null|    null|     null|       null|          null|         true|

:::zone pivot = "programming-language-python"

```python
spark.sql("VACUUM delta.`{0}`".format(delta_table_path)).show()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
spark.Sql($"VACUUM delta.`{deltaTablePath}`").Show();
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
spark.sql(s"VACUUM delta.`$deltaTablePath`").show()
```

::: zone-end

Results in:

|                path|
|--------------------|
|abfss://data@arca...|

Now, you're going to verify that a table is not a delta format table. Then, you will convert the table to delta format using Spark SQL and confirm that it was converted correctly.

:::zone pivot = "programming-language-python"

```python
parquet_id = random.randint(0,1000)
parquet_path = "/parquet/parquet-table-{0}-{1}".format(session_id, parquet_id)
data = spark.range(0,5)
data.write.parquet(parquet_path)
DeltaTable.isDeltaTable(spark, parquet_path)
spark.sql("CONVERT TO DELTA parquet.`{0}`".format(parquet_path))
DeltaTable.isDeltaTable(spark, parquet_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var parquetId =  (new Random()).Next(10000000);
var parquetPath = $"/parquet/parquet-table-{sessionId}-{parquetId}";
var data = spark.Range(0,5);
data.Write().Parquet(parquetPath);
DeltaTable.IsDeltaTable(parquetPath);
spark.Sql($"CONVERT TO DELTA parquet.`{parquetPath}`");
DeltaTable.IsDeltaTable(parquetPath);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val parquetId = scala.util.Random.nextInt(1000)
val parquetPath = s"/parquet/parquet-table-$sessionId-$parquetId"
val data = spark.range(0,5)
data.write.parquet(parquetPath)
DeltaTable.isDeltaTable(parquetPath)
spark.sql(s"CONVERT TO DELTA parquet.`$parquetPath`")
DeltaTable.isDeltaTable(parquetPath)
```

::: zone-end

Results in:

True

For full documentation, see the [Delta Lake Documentation Page](https://docs.delta.io/latest/delta-intro.html)

For more information, see [Delta Lake Project](https://github.com/delta-io/delta).

## Next steps

* [.NET for Apache Spark documentation](/previous-versions/dotnet/spark/what-is-apache-spark-dotnet)
* [Azure Synapse Analytics](../index.yml)
