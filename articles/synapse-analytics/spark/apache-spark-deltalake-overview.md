---
title: Overview of how to use Linux Foundation Delta Lake in Apache Spark for Azure Synapse Analytics
description: Learn how to use Delta Lake in Apache Spark for Azure Synapse Analytics to create and use tables with ACID properties.
services: synapse-analytics
author: euangMS
ms.service:  synapse-analytics
ms.reviewer: euang
ms.topic: overview
ms.subservice: machine-learning
ms.date: 06/28/2020
ms.author: euang
zone_pivot_groups: programming-languages-spark-all-minus-sql
---

# Hitchhiker's Guide to Delta Lake (Python)

This article has been adapted for more clarity from its original counterpart [here](https://docs.delta.io/latest/quick-start.html). This article helps you quickly explore the main features of [Delta Lake](https://delta.io). It provides code snippets that show how to read from and write to Delta Lake tables from interactive, batch, and streaming queries. It is also available as a notebook [PySpark here](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/PySpark/Hitchikers%20Guide%20to%20Delta%20Lake%20-%20Python.ipynb), [Scala here](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/Scala/Hitchikers%20Guide%20to%20Delta%20Lake%20-%20Scala.ipynb) and [C# here](https://github.com/Azure-Samples/Synapse/blob/master/Notebooks/Spark.NET%20C%23/Hitchikers%20Guide%20to%20Delta%20Lake%20-%20CSharp.ipynb)

Here's what we will cover:

* Create a table
* Read data
* Update table data
* Overwrite table data
* Conditional update without overwrite
* Read older versions of data using Time Travel
* Write a stream of data to a table
* Read a stream of changes from a table

## Configuration

Make sure you modify this as appropriate.

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

## Create a table

To create a Delta Lake table, write a DataFrame out in the delta format. You can use existing Spark SQL code and change the format from parquet, csv, json, and so on, to delta.

These operations create a new Delta Lake table using the schema that was inferred from your DataFrame. For the full set of options available when you create a new Delta Lake table, see Create a table and Write to a table (subsequent cells in this notebook).

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

## Read data

You read data in your Delta Lake table by specifying the path to the files.

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

## Update table data

Delta Lake supports several operations to modify tables using standard DataFrame APIs. This example runs a batch job to overwrite the data in the table.

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

## Save as catalog tables

Delta Lake can write to managed or external catalog tables.

:::zone pivot = "programming-language-python"

```python
# Write data to a new managed catalog table.
data.write.format("delta").saveAsTable("ManagedDeltaTable")

# Define an external catalog table that points to the existing Delta Lake data in storage.
spark.sql("CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '{0}'".format(delta_table_path))
# List the 2 new tables.
spark.sql("SHOW TABLES").show()

# Explore their properties.
spark.sql("DESCRIBE EXTENDED ManagedDeltaTable").show(truncate=False)
spark.sql("DESCRIBE EXTENDED ExternalDeltaTable").show(truncate=False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
// Write data to a new managed catalog table.
data.Write().Format("delta").SaveAsTable("ManagedDeltaTable");

// Define an external catalog table that points to the existing Delta Lake data in storage.
spark.Sql($"CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '{deltaTablePath}'");

// List the 2 new tables.
spark.Sql("SHOW TABLES").Show();

// Explore their properties.
spark.Sql("DESCRIBE EXTENDED ManagedDeltaTable").Show(truncate: 0);
spark.Sql("DESCRIBE EXTENDED ExternalDeltaTable").Show(truncate: 0);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
// Write data to a new managed catalog table.
data.write.format("delta").saveAsTable("ManagedDeltaTable")


// Define an external catalog table that points to the existing Delta Lake data in storage.
spark.sql(s"CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '$deltaTablePath'")

// List the 2 new tables.
spark.sql("SHOW TABLES").show

// Explore their properties.
spark.sql("DESCRIBE EXTENDED ManagedDeltaTable").show(truncate=false)
spark.sql("DESCRIBE EXTENDED ExternalDeltaTable").show(truncate=false)
```

::: zone-end

## Conditional update without overwrite

Delta Lake provides programmatic APIs to conditional update, delete, and merge (upsert) data into tables. For more information on these operations, see Table Deletes, Updates, and Merges.

:::zone pivot = "programming-language-python"

```python
from delta.tables import *
from pyspark.sql.functions import *

delta_table = DeltaTable.forPath(spark, delta_table_path)

# Update every even value by adding 100 to it
delta_table.update(
  condition = expr("id % 2 == 0"),
  set = { "id": expr("id + 100") })
delta_table.toDF().show()

# Delete every even value
delta_table.delete("id % 2 == 0")
delta_table.toDF().show()

# Upsert (merge) new data
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
using Microsoft.Spark.Extensions.Delta;
using Microsoft.Spark.Extensions.Delta.Tables;
using Microsoft.Spark.Sql;
using static Microsoft.Spark.Sql.Functions;

var deltaTable = DeltaTable.ForPath(deltaTablePath);

// Update every even value by adding 100 to it
deltaTable.Update(
  condition: Expr("id % 2 == 0"),
  set: new Dictionary<string, Column>(){{ "id", Expr("id + 100") }});
deltaTable.ToDF().Show();

// Delete every even value
deltaTable.Delete(condition: Expr("id % 2 == 0"));
deltaTable.ToDF().Show();

// Upsert (merge) new data
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
import io.delta.tables._
import org.apache.spark.sql.functions._

val deltaTable = DeltaTable.forPath(deltaTablePath)

// Update every even value by adding 100 to it
deltaTable.update(
  condition = expr("id % 2 == 0"),
  set = Map("id" -> expr("id + 100")))
deltaTable.toDF.show

// Delete every even value
deltaTable.delete(condition = expr("id % 2 == 0"))
deltaTable.toDF.show

// Upsert (merge) new data
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

### History

Delta's most powerful feature is the ability to allow looking into history i.e., the changes that were made to the underlying Delta Table. The cell below shows how simple it is to inspect the history.

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

## Read older versions of data using Time Travel

You can query previous snapshots of your Delta Lake table by using a feature called Time Travel. If you want to access the data that you overwrote, you can query a snapshot of the table before you overwrote the first set of data using the versionAsOf option.

Once you run the cell below, you should see the first set of data, from before you overwrote it. Time Travel is an extremely powerful feature that takes advantage of the power of the Delta Lake transaction log to access data that is no longer in the table. Removing the version 0 option (or specifying version 1) would let you see the newer data again. For more information, see Query an older snapshot of a table (time travel).

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

## Write a stream of data to a table

You can also write to a Delta Lake table using Spark's Structured Streaming. The Delta Lake transaction log guarantees exactly-once processing, even when there are other streams or batch queries running concurrently against the table. By default, streams run in append mode, which adds new records to the table.

For more information about Delta Lake integration with Structured Streaming, see Table Streaming Reads and Writes.

In the cells below, here's what we are doing:

Cell 28 Setup a simple Spark Structured Streaming job to generate a sequence and make the job write into our Delta Table
Cell 30 Show the newly appended data
Cell 31 Inspect history
Cell 32 Stop the structured streaming job
Cell 33 Inspect history <-- You'll notice appends have stopped

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

While the stream is writing to the Delta Lake table, you can also read from that table as streaming source. For example, you can start another streaming query that prints all the changes made to the Delta Lake table.

:::zone pivot = "programming-language-python"

```python
delta_table.toDF().sort(col("id").desc()).show(100)
delta_table.history().drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").show(20, 1000, False)
stream.stop()
delta_table.history().drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").show(100, 1000, False)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
deltaTable.ToDF().Sort(Col("id").Desc()).Show(100);
deltaTable.History().Drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").Show(20, 1000, false);
stream.Stop();
deltaTable.History().Drop("userId", "userName", "job", "notebook", "clusterId", "isolationLevel", "isBlindAppend").Show(100, 1000, false);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
// Write data to a new managed catalog table.
deltaTable.toDF.sort($"id".desc).show
deltaTable.history.show
stream.stop
deltaTable.history.show
```

::: zone-end

## Convert Parquet to Delta

You can do an in-place conversion from the Parquet format to Delta.

:::zone pivot = "programming-language-python"

```python
parquet_path = "/parquet/parquet-table-{0}".format(session_id)

data = spark.range(0,5)
data.write.parquet(parquet_path)

# Confirm that the data isn't in the Delta format
DeltaTable.isDeltaTable(spark, parquet_path)

DeltaTable.convertToDelta(spark, "parquet.`{0}`".format(parquet_path))

# Confirm that the converted data is now in the Delta format
DeltaTable.isDeltaTable(spark, parquet_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
// Write data to a new managed catalog table.
data.Write().Format("delta").SaveAsTable("ManagedDeltaTable");

// Define an external catalog table that points to the existing Delta Lake data in storage.
spark.Sql($"CREATE TABLE ExternalDeltaTable USING DELTA LOCATION '{deltaTablePath}'");

// List the 2 new tables.
spark.Sql("SHOW TABLES").Show();

// Explore their properties.
spark.Sql("DESCRIBE EXTENDED ManagedDeltaTable").Show(truncate: 0);
spark.Sql("DESCRIBE EXTENDED ExternalDeltaTable").Show(truncate: 0);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val parquetPath = s"/parquet/parquet-table-$sessionId"

val data = spark.range(0,5)
data.write.parquet(parquetPath)

// Confirm that the data isn't in the Delta format
DeltaTable.isDeltaTable(parquetPath)

DeltaTable.convertToDelta(spark, s"parquet.`$parquetPath`")

// Confirm that the converted data is now in the Delta format
DeltaTable.isDeltaTable(parquetPath)
```

::: zone-end

## SQL Support

Delta supports table utility commands through SQL. You can use SQL to:

* Get a DeltaTable's history
* Vacuum a DeltaTable
* Convert a Parquet file to Delta

:::zone pivot = "programming-language-python"

```python
spark.sql("DESCRIBE HISTORY delta.`{0}`".format(delta_table_path)).show()
spark.sql("VACUUM delta.`{0}`".format(delta_table_path)).show()
parquet_id = random.randint(0,1000)
parquet_path = "/parquet/parquet-table-{0}-{1}".format(session_id, parquet_path)

data = spark.range(0,5)
data.write.parquet(parquet_path)

# Confirm that the data isn't in the Delta format
DeltaTable.isDeltaTable(spark, parquet_path)

# Use SQL to convert the parquet table to Delta
spark.sql("CONVERT TO DELTA parquet.`{0}`".format(parquet_path))

DeltaTable.isDeltaTable(spark, parquet_path)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
spark.Sql($"DESCRIBE HISTORY delta.`{deltaTablePath}`").Show();
spark.Sql($"VACUUM delta.`{deltaTablePath}`").Show();
var parquetId =  (new Random()).Next(10000000);
var parquetPath = $"/parquet/parquet-table-{sessionId}-{parquetId}";

var data = spark.Range(0,5);
data.Write().Parquet(parquetPath);

// Confirm that the data isn't in the Delta format
DeltaTable.IsDeltaTable(parquetPath);

// Use SQL to convert the parquet table to Delta
spark.Sql($"CONVERT TO DELTA parquet.`{parquetPath}`");

DeltaTable.IsDeltaTable(parquetPath);
```

::: zone-end

:::zone pivot = "programming-language-scala"

```scala
spark.sql(s"DESCRIBE HISTORY delta.`$deltaTablePath`").show()
spark.sql(s"VACUUM delta.`$deltaTablePath`").show()
val parquetId = scala.util.Random.nextInt(1000)
val parquetPath = s"/parquet/parquet-table-$sessionId-$parquetId"

val data = spark.range(0,5)
data.write.parquet(parquetPath)

// Confirm that the data isn't in the Delta format
DeltaTable.isDeltaTable(parquetPath)

// Use SQL to convert the parquet table to Delta
spark.sql(s"CONVERT TO DELTA parquet.`$parquetPath`")

DeltaTable.isDeltaTable(parquetPath)

```

::: zone-end
