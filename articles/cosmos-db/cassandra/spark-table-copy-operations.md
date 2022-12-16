---
title: Table copy operations on Azure Cosmos DB for Apache Cassandra from Spark
description: This article details how to copy data between tables in Azure Cosmos DB for Apache Cassandra
author: TheovanKraay
ms.author: thvankra
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 09/24/2018
ms.devlang: scala
ms.custom: ignite-2022
---

# Table copy operations on Azure Cosmos DB for Apache Cassandra from Spark
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article describes how to copy data between tables in Azure Cosmos DB for Apache Cassandra from Spark. The commands described in this article can also be used to copy data from Apache Cassandra tables to Azure Cosmos DB for Apache Cassandra tables.

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

## Insert sample data 
```scala
import org.apache.spark.sql.cassandra._
//Spark connector
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql.CassandraConnector

//if using Spark 2.x, CosmosDB library for multiple retry
//import com.microsoft.azure.cosmosdb.cassandra

val booksDF = Seq(
   ("b00001", "Arthur Conan Doyle", "A study in scarlet", 1887,11.33),
   ("b00023", "Arthur Conan Doyle", "A sign of four", 1890,22.45),
   ("b01001", "Arthur Conan Doyle", "The adventures of Sherlock Holmes", 1892,19.83),
   ("b00501", "Arthur Conan Doyle", "The memoirs of Sherlock Holmes", 1893,14.22),
   ("b00300", "Arthur Conan Doyle", "The hounds of Baskerville", 1901,12.25)
).toDF("book_id", "book_author", "book_name", "book_pub_year","book_price")

booksDF.write
  .mode("append")
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks", "output.consistency.level" -> "ALL", "ttl" -> "10000000"))
  .save()
```

## Copy data between tables

### Copy data between tables (destination table exists)

```scala
//1) Create destination table
val cdbConnector = CassandraConnector(sc)
cdbConnector.withSessionDo(session => session.execute("CREATE TABLE IF NOT EXISTS books_ks.books_copy(book_id TEXT PRIMARY KEY,book_author TEXT, book_name TEXT,book_pub_year INT,book_price FLOAT) WITH cosmosdb_provisioned_throughput=4000;"))

//2) Read from one table
val readBooksDF = sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load

//3) Save to destination table
readBooksDF.write
  .cassandraFormat("books_copy", "books_ks", "")
  .save()

//4) Validate copy to destination table
sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books_copy", "keyspace" -> "books_ks"))
  .load
  .show
```

### Copy data between tables (destination table doesn't exist)

```scala
import com.datastax.spark.connector._

//1) Read from source table
val readBooksDF = sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load

//2) Creates an empty table in the keyspace based off of source table
val newBooksDF = readBooksDF
newBooksDF.createCassandraTable(
    "books_ks", 
    "books_new", 
    partitionKeyColumns = Some(Seq("book_id"))
    //clusteringKeyColumns = Some(Seq("some column"))
    )

//3) Saves the data from the source table into the newly created table
newBooksDF.write
  .cassandraFormat("books_new", "books_ks","")
  .mode(SaveMode.Append)
  .save()

//4) Validate table creation and data load
sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books_new", "keyspace" -> "books_ks"))
  .load
  .show
```
The output-
```
+-------+------------------+--------------------+----------+-------------+
|book_id|       book_author|           book_name|book_price|book_pub_year|
+-------+------------------+--------------------+----------+-------------+
| b00300|Arthur Conan Doyle|The hounds of Bas...|     12.25|         1901|
| b00001|Arthur Conan Doyle|  A study in scarlet|     11.33|         1887|
| b00023|Arthur Conan Doyle|      A sign of four|     22.45|         1890|
| b00501|Arthur Conan Doyle|The memoirs of Sh...|     14.22|         1893|
| b01001|Arthur Conan Doyle|The adventures of...|     19.83|         1892|
+-------+------------------+--------------------+----------+-------------+

import com.datastax.spark.connector._
readBooksDF: org.apache.spark.sql.DataFrame = [book_id: string, book_author: string ... 3 more fields]
newBooksDF: org.apache.spark.sql.DataFrame = [book_id: string, book_author: string ... 3 more fields]
```

## Next steps

 * Get started with [creating a API for Cassandra account, database, and a table](create-account-java.md) by using a Java application.
 * [Load sample data to the API for Cassandra table](load-data-table.md) by using a Java application.
 * [Query data from the API for Cassandra account](query-data.md) by using a Java application.
