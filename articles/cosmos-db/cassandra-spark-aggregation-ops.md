---
title: Aggregate operations on Azure Cosmos DB Cassandra API tables from Spark
description: This article covers basic aggregation operations against Azure Cosmos DB Cassandra API tables from Spark
services: cosmos-db
author: anagha-microsoft

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.custom: basics, DDL, DML
ms.devlang: spark-scala
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ankhanol

---

# Aggregate operations on Azure Cosmos DB Cassandra API tables from Spark 

This article describes basic aggregation operations against Azure Cosmos DB Cassandra API tables from Spark. 

> [!NOTE]
> Server-side filtering, and server-side aggregation is currently not supported in Azure Cosmos DB Cassandra API.

## Cassandra API configuration

```scala
import org.apache.spark.sql.cassandra._
//Spark connector
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql.CassandraConnector

//CosmosDB library for multiple retry
import com.microsoft.azure.cosmosdb.cassandra

//Connection-related
spark.conf.set("spark.cassandra.connection.host","YOUR_ACCOUNT_NAME.cassandra.cosmosdb.azure.com")
spark.conf.set("spark.cassandra.connection.port","10350")
spark.conf.set("spark.cassandra.connection.ssl.enabled","true")
spark.conf.set("spark.cassandra.auth.username","YOUR_ACCOUNT_NAME")
spark.conf.set("spark.cassandra.auth.password","YOUR_ACCOUNT_KEY")
spark.conf.set("spark.cassandra.connection.factory", "com.microsoft.azure.cosmosdb.cassandra.CosmosDbConnectionFactory")
//Throughput-related...adjust as needed
spark.conf.set("spark.cassandra.output.batch.size.rows", "1")
spark.conf.set("spark.cassandra.connection.connections_per_executor_max", "10")
spark.conf.set("spark.cassandra.output.concurrent.writes", "1000")
spark.conf.set("spark.cassandra.concurrent.reads", "512")
spark.conf.set("spark.cassandra.output.batch.grouping.buffer.size", "1000")
spark.conf.set("spark.cassandra.connection.keep_alive_ms", "600000000")
```
## Sample data generator

```scala
// Generate a simple dataset containing five values
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

## Count operation


### RDD API

```scala
sc.cassandraTable("books_ks", "books").count
```

**Output:**
```
res48: Long = 5
```

### Dataframe API

Count against dataframes is currently not supported.  The sample below shows how to execute a dataframe count after persisting the dataframe to memory as a workaround.

Choose a [storage option]( https://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#which-storage-level-to-choose) from the following available options, to avoid running into "out of memory" issues:

* MEMORY_ONLY: This is the default storage option. Stores RDD as deserialized Java objects in the JVM. If the RDD does not fit in memory, some partitions will not be cached and they are recomputed on the fly each time they're needed.

* MEMORY_AND_DISK: Stores RDD as deserialized Java objects in the JVM. If the RDD does not fit in memory, store the partitions that don't fit on disk, and whenever required, read them from the location they are stored.

* MEMORY_ONLY_SER (Java/Scala): Stores RDD as serialized Java objects- one-byte array per partition. This option is space-efficient when compared to deserialized objects, especially when using a fast serializer, but more CPU-intensive to read.

* MEMORY_AND_DISK_SER (Java/Scala): This storage option is like MEMORY_ONLY_SER, the only difference is that it spills partitions that don't fit in the disk memory instead of recomputing them when they're needed.

* DISK_ONLY: Stores the RDD partitions on the disk only.

* MEMORY_ONLY_2, MEMORY_AND_DISK_2…: Same as the levels above, but replicates each partition on two cluster nodes.

* OFF_HEAP (experimental): Similar to MEMORY_ONLY_SER, but it stores the data in off-heap memory, and it requires off-heap memory to be enabled ahead of time. 

```scala
//Workaround
import org.apache.spark.storage.StorageLevel

//Read from source
val readBooksDF = spark
  .read
  .cassandraFormat("books", "books_ks", "")
  .load()

//Explain plan
readBooksDF.explain

//Materialize the dataframe
readBooksDF.persist(StorageLevel.MEMORY_ONLY)

//Subsequent execution against this DF hits the cache 
readBooksDF.count

//Persist as temporary view
readBooksDF.createOrReplaceTempView("books_vw")
```

### SQL

```sql
select * from books_vw;
select count(*) from books_vw where book_pub_year > 1900;
select count(book_id) from books_vw;
select book_author, count(*) as count from books_vw group by book_author;
select count(*) from books_vw;
```

## Average operation

### RDD API

```scala
sc.cassandraTable("books_ks", "books").select("book_price").as((c: Double) => c).mean
```

**Output:**
```
res24: Double = 16.016000175476073
```

### Dataframe API

```scala
spark
  .read
  .cassandraFormat("books", "books_ks", "")
  .load()
  .select("book_price")
  .agg(avg("book_price"))
  .show
```

**Output:**
```
+------------------+
|   avg(book_price)|
+------------------+
|16.016000175476073|
+------------------+
```

### SQL

```sql
select avg(book_price) from books_vw;
```
**Output:**
```
16.016000175476073
```

## Min operation

### RDD API

```scala
sc.cassandraTable("books_ks", "books").select("book_price").as((c: Float) => c).min
```

**Output:**
```
res31: Float = 11.33
```

### Dataframe API

```scala
spark
  .read
  .cassandraFormat("books", "books_ks", "")
  .load()
  .select("book_id","book_price")
  .agg(min("book_price"))
  .show
```

**Output:**
```
+---------------+
|min(book_price)|
+---------------+
|          11.33|
+---------------+
```

### SQL

```sql
select min(book_price) from books_vw;
```

**Output:**
```
11.33
```

## Max operation

### RDD API

```scala
sc.cassandraTable("books_ks", "books").select("book_price").as((c: Float) => c).max
```

### Dataframe API

```scala 
spark
  .read
  .cassandraFormat("books", "books_ks", "")
  .load()
  .select("book_price")
  .agg(max("book_price"))
  .show
```

**Output:**
```
+---------------+
|max(book_price)|
+---------------+
|          22.45|
+---------------+
```

### SQL

```sql
select max(book_price) from books_vw;
```
**Output:**
```22.45 ```

## Sum operation

### RDD API

```scala
sc.cassandraTable("books_ks", "books").select("book_price").as((c: Float) => c).sum
```

**Output:**
```
res46: Double = 80.08000087738037
```

### Dataframe API

```scala
spark
  .read
  .cassandraFormat("books", "books_ks", "")
  .load()
  .select("book_price")
  .agg(sum("book_price"))
  .show
```
**Output:**
```
+-----------------+
|  sum(book_price)|
+-----------------+
|80.08000087738037|
+-----------------+
```

### SQL

```sql
select sum(book_price) from books_vw;
```

**Output:**
```
80.08000087738037
```

## Top or comparable operation

### RDD API

```scala
val readCalcTopRDD = sc.cassandraTable("books_ks", "books").select("book_name","book_price").sortBy(_.getFloat(1), false)
readCalcTopRDD.zipWithIndex.filter(_._2 < 3).collect.foreach(println)
//delivers the first top n items without collecting the rdd to the driver.
```
**Output:**
```
(CassandraRow{book_name: A sign of four, book_price: 22.45},0)
(CassandraRow{book_name: The adventures of Sherlock Holmes, book_price: 19.83},1)
(CassandraRow{book_name: The memoirs of Sherlock Holmes, book_price: 14.22},2)
readCalcTopRDD: org.apache.spark.rdd.RDD[com.datastax.spark.connector.CassandraRow] = MapPartitionsRDD[430] at sortBy at command-2371828989676374:1
```
### Dataframe API

```scala
import org.apache.spark.sql.functions._

val readBooksDF = spark.read.format("org.apache.spark.sql.cassandra")
  .options(Map( "table" -> "books", "keyspace" -> "books_ks"))
  .load
  .select("book_name","book_price")
  .orderBy(desc("book_price"))
  .limit(3)

//Explain plan
readBooksDF.explain

//Top
readBooksDF.show
```

**Output:**
```
== Physical Plan ==
TakeOrderedAndProject(limit=3, orderBy=[book_price#1840 DESC NULLS LAST], output=[book_name#1839,book_price#1840])
+- *(1) Scan org.apache.spark.sql.cassandra.CassandraSourceRelation@29cd5f58 [book_name#1839,book_price#1840] PushedFilters: [], ReadSchema: struct<book_name:string,book_price:float>
+--------------------+----------+
|           book_name|book_price|
+--------------------+----------+
|      A sign of four|     22.45|
|The adventures of...|     19.83|
|The memoirs of Sh...|     14.22|
+--------------------+----------+

import org.apache.spark.sql.functions._
readBooksDF: org.apache.spark.sql.Dataset[org.apache.spark.sql.Row] = [book_name: string, book_price: float]
```

### SQL

```sql
select book_name,book_price from books_vw order by book_price desc limit 3;
```

## Next steps

To perform table copy operations, see:

* [Table copy operations](cassandra-spark-table-copy-ops.md)
