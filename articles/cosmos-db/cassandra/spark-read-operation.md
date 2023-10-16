---
title: Read API for Cassandra table data using Spark
titleSufix: Azure Cosmos DB
description: This article describes how to read data from API for Cassandra tables in Azure Cosmos DB.
author: TheovanKraay
ms.author: thvankra
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 06/02/2020
ms.devlang: scala
ms.custom: seodec18, ignite-2022
---

# Read data from Azure Cosmos DB for Apache Cassandra tables using Spark
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

 This article describes how to read data stored in Azure Cosmos DB for Apache Cassandra from Spark.

## API for Cassandra configuration
Set below spark configuration in your notebook cluster. It's one time activity.
```scala
//Connection-related
 spark.cassandra.connection.host  YOUR_ACCOUNT_NAME.cassandra.cosmosdb.azure.com  
 spark.cassandra.connection.port  10350  
 spark.cassandra.connection.ssl.enabled  true  
 spark.cassandra.auth.username  YOUR_ACCOUNT_NAME  
 spark.cassandra.auth.password  YOUR_ACCOUNT_KEY  
// if using Spark 2.x
// spark.cassandra.connection.factory  com.microsoft.azure.cosmosdb.cassandra.CosmosDbConnectionFactory  

//Throughput-related...adjust as needed
 spark.cassandra.output.batch.size.rows  1  
// spark.cassandra.connection.connections_per_executor_max  10   // Spark 2.x
 spark.cassandra.connection.remoteConnectionsPerExecutor  10   // Spark 3.x
 spark.cassandra.output.concurrent.writes  1000  
 spark.cassandra.concurrent.reads  512  
 spark.cassandra.output.batch.grouping.buffer.size  1000  
 spark.cassandra.connection.keep_alive_ms  600000000  
```

> [!NOTE]
> If you are using Spark 3.x, you do not need to install the Azure Cosmos DB helper and connection factory. You should also use `remoteConnectionsPerExecutor` instead of `connections_per_executor_max` for the Spark 3 connector (see above).

> [!WARNING]
> The Spark 3 samples shown in this article have been tested with Spark **version 3.2.1** and the corresponding Cassandra Spark Connector **com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.2.0**. Later versions of Spark and/or the Cassandra connector may not function as expected.

## Dataframe API

### Read table using session.read.format command

```scala
import org.apache.spark.sql.cassandra._
//Spark connector
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql.CassandraConnector

//if using Spark 2.x, CosmosDB library for multiple retry
//import com.microsoft.azure.cosmosdb.cassandra

val readBooksDF = sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load

readBooksDF.explain
readBooksDF.show
```
### Read table using spark.read.cassandraFormat 

```scala
val readBooksDF = spark.read.cassandraFormat("books", "books_ks", "").load()
```

### Read specific columns in table

```scala
val readBooksDF = spark
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load
  .select("book_name","book_author", "book_pub_year")

readBooksDF.printSchema
readBooksDF.explain
readBooksDF.show
```

### Apply filters

You can push down predicates to the database to allow for better optimized Spark queries. A predicate is a condition on a query that returns true or false, typically located in the WHERE clause. A predicate push down filters the data in the database query, reducing the number of entries retrieved from the database and improving query performance. By default the Spark Dataset API will automatically push down valid WHERE clauses to the database. 

```scala
val df = spark.read.cassandraFormat("books", "books_ks").load
df.explain
val dfWithPushdown = df.filter(df("book_pub_year") > 1891)
dfWithPushdown.explain

readBooksDF.printSchema
readBooksDF.explain
readBooksDF.show
```

The `Cassandra Filters` section of the physical plan includes the pushed down filter. 

:::image type="content" source="./media/spark-read-operation/pushdown-predicates-spark-3.png" alt-text="partitions":::

## RDD API

### Read table
```scala
val bookRDD = sc.cassandraTable("books_ks", "books")
bookRDD.take(5).foreach(println)
```

### Read specific columns in table

```scala
val booksRDD = sc.cassandraTable("books_ks", "books").select("book_id","book_name").cache
booksRDD.take(5).foreach(println)
```

## SQL Views 

### Create a temporary view from a dataframe

```scala
spark
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load.createOrReplaceTempView("books_vw")
```

### Run queries against the view

```sql
select * from books_vw where book_pub_year > 1891
```

## Next steps

The following are additional articles on working with Azure Cosmos DB for Apache Cassandra from Spark:
 
 * [Upsert operations](spark-upsert-operations.md)
 * [Delete operations](spark-delete-operation.md)
 * [Aggregation operations](spark-aggregation-operations.md)
 * [Table copy operations](spark-table-copy-operations.md)
