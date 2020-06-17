---
title: DDL operations in Azure Cosmos DB Cassandra API from Spark
description: This article details keyspace and table DDL operations against Azure Cosmos DB Cassandra API from Spark.
author: kanshiG
ms.author: govindk
ms.reviewer: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: conceptual
ms.date: 09/24/2018

---

# DDL operations in Azure Cosmos DB Cassandra API from Spark

This article details keyspace and table DDL operations against Azure Cosmos DB Cassandra API from Spark.

## Cassandra API-related configuration 

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

## Keyspace DDL operations

### Create a keyspace

```scala
//Cassandra connector instance
val cdbConnector = CassandraConnector(sc)

// Create keyspace
cdbConnector.withSessionDo(session => session.execute("CREATE KEYSPACE IF NOT EXISTS books_ks WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1 } "))
```

#### Validate in cqlsh

Run the following command in cqlsh and you should see the keyspace you created earlier.

```bash
DESCRIBE keyspaces;
```

### Drop a keyspace

```scala
val cdbConnector = CassandraConnector(sc)
cdbConnector.withSessionDo(session => session.execute("DROP KEYSPACE books_ks"))
```

#### Validate in cqlsh

```bash
DESCRIBE keyspaces;
```
## Table DDL operations

**Considerations:**  

- Throughput can be assigned at the table level by using the create table statement.  
- One partition key can store 20 GB of data.  
- One record can store a maximum of 2 MB of data.  
- One partition key range can store multiple partition keys.

### Create a table

```scala
val cdbConnector = CassandraConnector(sc)
cdbConnector.withSessionDo(session => session.execute("CREATE TABLE IF NOT EXISTS books_ks.books(book_id TEXT PRIMARY KEY,book_author TEXT, book_name TEXT,book_pub_year INT,book_price FLOAT) WITH cosmosdb_provisioned_throughput=4000 , WITH default_time_to_live=630720000;"))
```

#### Validate in cqlsh

Run the following command in cqlsh and you should see the table named “books: 

```bash
USE books_ks;
DESCRIBE books;
```

Provisioned throughput and default TTL values are not shown in the output of the previous command, you can get these values from the portal.

### Alter table

You can alter the following values by using the alter table command:

* provisioned throughput 
* time-to-live value
<br>Column changes are currently not supported.

```scala
val cdbConnector = CassandraConnector(sc)
cdbConnector.withSessionDo(session => session.execute("ALTER TABLE books_ks.books WITH cosmosdb_provisioned_throughput=8000, WITH default_time_to_live=0;"))
```

### Drop table

```scala
val cdbConnector = CassandraConnector(sc)
cdbConnector.withSessionDo(session => session.execute("DROP TABLE IF EXISTS books_ks.books;"))
```

#### Validate in cqlsh

Run the following command in cqlsh and you should see that the “books” table is no longer available:

```bash
USE books_ks;
DESCRIBE tables;
```

## Next steps

After creating the keyspace and the table, proceed to the following articles for CRUD operations and more:
 
* [Create/insert operations](cassandra-spark-create-ops.md)  
* [Read operations](cassandra-spark-read-ops.md)  
* [Upsert operations](cassandra-spark-upsert-ops.md)  
* [Delete operations](cassandra-spark-delete-ops.md)  
* [Aggregation operations](cassandra-spark-aggregation-ops.md)  
* [Table copy operations](cassandra-spark-table-copy-ops.md)  
