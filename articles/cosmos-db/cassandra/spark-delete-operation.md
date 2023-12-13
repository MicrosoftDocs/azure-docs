---
title: Delete operations on Azure Cosmos DB for Apache Cassandra from Spark 
description: This article details how to delete data in tables in Azure Cosmos DB for Apache Cassandra from Spark
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

# Delete data in Azure Cosmos DB for Apache Cassandra tables from Spark
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article describes how to delete data in Azure Cosmos DB for Apache Cassandra tables from Spark.

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

## Sample data generator
We'll use this code fragment to generate sample data:

```scala
import org.apache.spark.sql.cassandra._
//Spark connector
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql.CassandraConnector

//if using Spark 2.x, CosmosDB library for multiple retry
//import com.microsoft.azure.cosmosdb.cassandra

//Create dataframe
val booksDF = Seq(
   ("b00001", "Arthur Conan Doyle", "A study in scarlet", 1887,11.33),
   ("b00023", "Arthur Conan Doyle", "A sign of four", 1890,22.45),
   ("b01001", "Arthur Conan Doyle", "The adventures of Sherlock Holmes", 1892,19.83),
   ("b00501", "Arthur Conan Doyle", "The memoirs of Sherlock Holmes", 1893,14.22),
   ("b00300", "Arthur Conan Doyle", "The hounds of Baskerville", 1901,12.25)
).toDF("book_id", "book_author", "book_name", "book_pub_year","book_price")

//Persist
booksDF.write
  .mode("append")
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks", "output.consistency.level" -> "ALL", "ttl" -> "10000000"))
  .save()
```

## Dataframe API

### Delete rows that match a condition

```scala
//1) Create dataframe
val deleteBooksDF = spark
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load
  .filter("book_id = 'b01001'")

//2) Review execution plan
deleteBooksDF.explain

//3) Review table data before execution
println("==================")
println("1) Before")
deleteBooksDF.show
println("==================")

//4) Delete selected records in dataframe
println("==================")
println("2a) Starting delete")

//Reuse connection for each partition
val cdbConnector = CassandraConnector(sc)
deleteBooksDF.foreachPartition((partition: Iterator[Row]) => {
  cdbConnector.withSessionDo(session =>
    partition.foreach{ book => 
        val delete = s"DELETE FROM books_ks.books where book_id='"+book.getString(0) +"';"
        session.execute(delete)
    })
})

println("2b) Completed delete")
println("==================")

//5) Review table data after delete operation
println("3) After")

spark
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load
  .show
```

**Output:**

```
== Physical Plan ==
*(1) Filter (isnotnull(book_pub_year#486) && (book_pub_year#486 = 1887))
+- *(1) Scan org.apache.spark.sql.cassandra.CassandraSourceRelation@197cfae4 [book_id#482,book_author#483,book_name#484,book_price#485,book_pub_year#486] 
PushedFilters: [IsNotNull(book_pub_year), EqualTo(book_pub_year,1887)], 
ReadSchema: struct<book_id:string,book_author:string,book_name:string,book_price:float,book_pub_year:int>
==================
1) Before
+-------+------------------+------------------+----------+-------------+
|book_id|       book_author|         book_name|book_price|book_pub_year|
+-------+------------------+------------------+----------+-------------+
| b00001|Arthur Conan Doyle|A study in scarlet|     11.33|         1887|
+-------+------------------+------------------+----------+-------------+

==================
==================
2a) Starting delete
2b) Completed delete
==================
3) After
+-------+------------------+--------------------+----------+-------------+
|book_id|       book_author|           book_name|book_price|book_pub_year|
+-------+------------------+--------------------+----------+-------------+
| b00300|Arthur Conan Doyle|The hounds of Bas...|     12.25|         1901|
| b03999|Arthur Conan Doyle|The adventure of ...|      null|         1892|
| b00023|Arthur Conan Doyle|      A sign of four|     22.45|         1890|
| b00501|Arthur Conan Doyle|The memoirs of Sh...|     14.22|         1893|
| b01001|Arthur Conan Doyle|The adventures of...|     19.83|         1892|
| b02999|Arthur Conan Doyle|  A case of identity|      15.0|         1891|
+-------+------------------+--------------------+----------+-------------+

deleteBooksDF: org.apache.spark.sql.Dataset[org.apache.spark.sql.Row] = [book_id: string, book_author: string ... 3 more fields]
cdbConnector: com.datastax.spark.connector.cql.CassandraConnector = com.datastax.spark.connector.cql.CassandraConnector@187deb43
```

### Delete all the rows in the table

```scala
//1) Create dataframe
val deleteBooksDF = spark
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load

//2) Review execution plan
deleteBooksDF.explain

//3) Review table data before execution
println("==================")
println("1) Before")
deleteBooksDF.show
println("==================")

//4) Delete selected records in dataframe
println("==================")
println("2a) Starting delete")

//Reuse connection for each partition
val cdbConnector = CassandraConnector(sc)
deleteBooksDF.foreachPartition((partition: Iterator[Row]) => {
  cdbConnector.withSessionDo(session =>
    partition.foreach{ book => 
        val delete = s"DELETE FROM books_ks.books where book_id='"+book.getString(0) +"';"
        session.execute(delete)
    })
})

println("2b) Completed delete")
println("==================")

//5) Review table data after delete operation
println("3) After")

spark
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load
  .show
```

**Output:**

```
== Physical Plan ==
*(1) Scan org.apache.spark.sql.cassandra.CassandraSourceRelation@495377d7 [book_id#565,book_author#566,book_name#567,book_price#568,book_pub_year#569] 
PushedFilters: [], 
ReadSchema: struct<book_id:string,book_author:string,book_name:string,book_price:float,book_pub_year:int>
==================
1) Before
+-------+------------------+--------------------+----------+-------------+
|book_id|       book_author|           book_name|book_price|book_pub_year|
+-------+------------------+--------------------+----------+-------------+
| b00300|Arthur Conan Doyle|The hounds of Bas...|     12.25|         1901|
| b03999|Arthur Conan Doyle|The adventure of ...|      null|         1892|
| b00023|Arthur Conan Doyle|      A sign of four|     22.45|         1890|
| b00501|Arthur Conan Doyle|The memoirs of Sh...|     14.22|         1893|
| b01001|Arthur Conan Doyle|The adventures of...|     19.83|         1892|
| b02999|Arthur Conan Doyle|  A case of identity|      15.0|         1891|
+-------+------------------+--------------------+----------+-------------+

==================
==================
2a) Starting delete
2b) Completed delete
==================
3) After
+-------+-----------+---------+----------+-------------+
|book_id|book_author|book_name|book_price|book_pub_year|
+-------+-----------+---------+----------+-------------+
+-------+-----------+---------+----------+-------------+
```

## RDD API

### Delete all the rows in the table
```scala
//1) Create RDD with all rows
val deleteBooksRDD = 
    sc.cassandraTable("books_ks", "books")

//2) Review table data before execution
println("==================")
println("1) Before")
deleteBooksRDD.collect.foreach(println)
println("==================")

//3) Delete selected records in dataframe
println("==================")
println("2a) Starting delete")

/* Option 1: 
// Not supported currently
sc.cassandraTable("books_ks", "books")
  .where("book_pub_year = 1891")
  .deleteFromCassandra("books_ks", "books")
*/

//Option 2: CassandraConnector and CQL
//Reuse connection for each partition
val cdbConnector = CassandraConnector(sc)
deleteBooksRDD.foreachPartition(partition => {
    cdbConnector.withSessionDo(session =>
    partition.foreach{book => 
        val delete = s"DELETE FROM books_ks.books where book_id='"+ book.getString(0) +"';"
        session.execute(delete)
    }
   )
})

println("Completed delete")
println("==================")

println("2b) Completed delete")
println("==================")

//5) Review table data after delete operation
println("3) After")
sc.cassandraTable("books_ks", "books").collect.foreach(println)
```
**Output:**

```
==================
1) Before
CassandraRow{book_id: b00300, book_author: Arthur Conan Doyle, book_name: The hounds of Baskerville, book_price: 12.25, book_pub_year: 1901}
CassandraRow{book_id: b00001, book_author: Arthur Conan Doyle, book_name: A study in scarlet, book_price: 11.33, book_pub_year: 1887}
CassandraRow{book_id: b00023, book_author: Arthur Conan Doyle, book_name: A sign of four, book_price: 22.45, book_pub_year: 1890}
CassandraRow{book_id: b00501, book_author: Arthur Conan Doyle, book_name: The memoirs of Sherlock Holmes, book_price: 14.22, book_pub_year: 1893}
CassandraRow{book_id: b01001, book_author: Arthur Conan Doyle, book_name: The adventures of Sherlock Holmes, book_price: 19.83, book_pub_year: 1892}
==================
==================
2a) Starting delete
Completed delete
==================
2b) Completed delete
==================
3) After
deleteBooksRDD: com.datastax.spark.connector.rdd.CassandraTableScanRDD[com.datastax.spark.connector.CassandraRow] = CassandraTableScanRDD[126] at RDD at CassandraRDD.scala:19
cdbConnector: com.datastax.spark.connector.cql.CassandraConnector = com.datastax.spark.connector.cql.CassandraConnector@317927
```

### Delete specific columns

```scala
//1) Create RDD 
val deleteBooksRDD = 
    sc.cassandraTable("books_ks", "books")

//2) Review table data before execution
println("==================")
println("1) Before")
deleteBooksRDD.collect.foreach(println)
println("==================")

//3) Delete specific column values
println("==================")
println("2a) Starting delete of book price")

sc.cassandraTable("books_ks", "books")
  .deleteFromCassandra("books_ks", "books",SomeColumns("book_price"))

println("Completed delete")
println("==================")

println("2b) Completed delete")
println("==================")

//5) Review table data after delete operation
println("3) After")
sc.cassandraTable("books_ks", "books").take(4).foreach(println)
```

**Output:**

```
==================
1) Before
CassandraRow{book_id: b00300, book_author: Arthur Conan Doyle, book_name: The hounds of Baskerville, book_price: 20.0, book_pub_year: 1901}
CassandraRow{book_id: b00001, book_author: Arthur Conan Doyle, book_name: A study in scarlet, book_price: 23.0, book_pub_year: 1887}
CassandraRow{book_id: b00023, book_author: Arthur Conan Doyle, book_name: A sign of four, book_price: 11.0, book_pub_year: 1890}
CassandraRow{book_id: b00501, book_author: Arthur Conan Doyle, book_name: The memoirs of Sherlock Holmes, book_price: 5.0, book_pub_year: 1893}
CassandraRow{book_id: b01001, book_author: Arthur Conan Doyle, book_name: The adventures of Sherlock Holmes, book_price: 10.0, book_pub_year: 1892}
==================
==================
2a) Starting delete of book price
Completed delete
==================
2b) Completed delete
==================
3) After
CassandraRow{book_id: b00300, book_author: Arthur Conan Doyle, book_name: The hounds of Baskerville, book_price: null, book_pub_year: 1901}
CassandraRow{book_id: b00001, book_author: Arthur Conan Doyle, book_name: A study in scarlet, book_price: null, book_pub_year: 1887}
CassandraRow{book_id: b00023, book_author: Arthur Conan Doyle, book_name: A sign of four, book_price: null, book_pub_year: 1890}
CassandraRow{book_id: b00501, book_author: Arthur Conan Doyle, book_name: The memoirs of Sherlock Holmes, book_price: null, book_pub_year: 1893}
deleteBooksRDD: com.datastax.spark.connector.rdd.CassandraTableScanRDD[com.datastax.spark.connector.CassandraRow] = CassandraTableScanRDD[145] at RDD at CassandraRDD.scala:19
```

## Next steps

To perform aggregation and data copy operations, refer -
 
* [Aggregation operations](spark-aggregation-operations.md)
* [Table copy operations](spark-table-copy-operations.md)
