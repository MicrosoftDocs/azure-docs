---
title: DDL operations in Azure Cosmos DB for Apache Cassandra from Spark
description: This article details keyspace and table DDL operations against Azure Cosmos DB for Apache Cassandra from Spark.
author: TheovanKraay
ms.author: thvankra
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 10/07/2020
ms.devlang: scala
ms.custom: ignite-2022
---

# DDL operations in Azure Cosmos DB for Apache Cassandra from Spark
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article details keyspace and table DDL operations against Azure Cosmos DB for Apache Cassandra from Spark.

## Spark context

 The connector for API for Cassandra requires the Cassandra connection details to be initialized as part of the spark context. When you launch a notebook, the spark context is already initialized, and it isn't advisable to stop and reinitialize it. One solution is to add the API for Cassandra instance configuration at a cluster level, in the cluster spark configuration. It's one-time activity per cluster. Add the following code to the Spark configuration as a space separated key value pair:
 
  ```scala
  spark.cassandra.connection.host YOUR_COSMOSDB_ACCOUNT_NAME.cassandra.cosmosdb.azure.com
  spark.cassandra.connection.port 10350
  spark.cassandra.connection.ssl.enabled true
  spark.cassandra.auth.username YOUR_COSMOSDB_ACCOUNT_NAME
  spark.cassandra.auth.password YOUR_COSMOSDB_KEY

  //Throughput-related...adjust as needed
  spark.cassandra.output.batch.size.rows  1  
  // spark.cassandra.connection.connections_per_executor_max  10   // Spark 2.x
  spark.cassandra.connection.remoteConnectionsPerExecutor  10   // Spark 3.x
  spark.cassandra.output.concurrent.writes  1000  
  spark.cassandra.concurrent.reads  512  
  spark.cassandra.output.batch.grouping.buffer.size  1000  
  spark.cassandra.connection.keep_alive_ms  600000000  
  ```

## API for Cassandra-related configuration 

```scala
import org.apache.spark.sql.cassandra._
//Spark connector
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql.CassandraConnector

//if using Spark 2.x, CosmosDB library for multiple retry
//import com.microsoft.azure.cosmosdb.cassandra
//spark.conf.set("spark.cassandra.connection.factory", "com.microsoft.azure.cosmosdb.cassandra.CosmosDbConnectionFactory")
```

> [!NOTE]
> If you are using Spark 3.x, you do not need to install the Azure Cosmos DB helper and connection factory. You should also use `remoteConnectionsPerExecutor` instead of `connections_per_executor_max` for the Spark 3 connector (see above).

> [!WARNING]
> The Spark 3 samples shown in this article have been tested with Spark **version 3.2.1** and the corresponding Cassandra Spark Connector **com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.2.1**. Later versions of Spark and/or the Cassandra connector may not function as expected.

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
cdbConnector.withSessionDo(session => session.execute("CREATE TABLE IF NOT EXISTS books_ks.books(book_id TEXT,book_author TEXT, book_name TEXT,book_pub_year INT,book_price FLOAT, PRIMARY KEY(book_id,book_pub_year)) WITH cosmosdb_provisioned_throughput=4000 , WITH default_time_to_live=630720000;"))
```

#### Validate in cqlsh

Run the following command in cqlsh and you should see the table named “books: 

```bash
USE books_ks;
DESCRIBE books;
```

Provisioned throughput and default TTL values aren't shown in the output of the previous command, you can get these values from the portal.

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
 
* [Create/insert operations](spark-create-operations.md)  
* [Read operations](spark-read-operation.md)  
* [Upsert operations](spark-upsert-operations.md)  
* [Delete operations](spark-delete-operation.md)  
* [Aggregation operations](spark-aggregation-operations.md)  
* [Table copy operations](spark-table-copy-operations.md)  
