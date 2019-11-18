---
title: Delta Lake
description: Overview of Delta Lake and how it works as part of Azure Synapse Analytics
services: sql-data-warehouse
author: euangMS
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 10/16/2019
ms.author: euang
ms.reviewer: euang
zone_pivot_groups: apache-spark-languages
---
# Delta Lake quickstart

## Create a table

To create a Delta Lake table, write a DataFrame out in the delta format. You can use existing Spark SQL code and change the format from parquet, csv, json, and so on, to delta.

::: zone pivot="programming-language-scala"

```Scala
val data = spark.range(0, 5)
data.write.format("delta").save("/tmp/delta-table")
```

::: zone-end
::: zone pivot="programming-language-pyspark"

```Python
data = spark.range(0, 5)
data.write.format("delta").save("/tmp/delta-table")
```

::: zone-end
::: zone pivot="programming-language-java"

```Java
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;

SparkSession spark = ...   // create SparkSession

Dataset<Row> data = data = spark.range(0, 5);
data.write().format("delta").save("/tmp/delta-table");
```

::: zone-end
::: zone pivot="programming-language-sql"

```SQL
select * from foo
```
::: zone-end
::: zone pivot="programming-language-csharp"

```csharp
val data = spark.range(0, 5)
data.write.format("delta").save("/tmp/delta-table")
```

::: zone-end

These operations create a new Delta Lake table by using the schema that was inferred from your DataFrame. For the full set of options available when you create a new Delta Lake table, see Create a table and Write to a table
