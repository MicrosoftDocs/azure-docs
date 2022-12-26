---
title: Access Azure Cosmos DB for Apache Cassandra on YARN with HDInsight
description: This article covers how to work with Azure Cosmos DB for Apache Cassandra from Spark on YARN with HDInsight.
author: TheovanKraay
ms.author: thvankra
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 09/24/2018
ms.devlang: scala
ms.custom: kr2b-contr-experiment, ignite-2022
---

# Access Azure Cosmos DB for Apache Cassandra from Spark on YARN with HDInsight
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article covers how to access Azure Cosmos DB for Apache Cassandra from Spark on YARN with HDInsight-Spark from `spark-shell`. HDInsight is Microsoft's Hortonworks Hadoop PaaS on Azure. It uses object storage for HDFS and comes in several flavors, including [Spark](../../hdinsight/spark/apache-spark-overview.md). While this article refers to HDInsight-Spark, it applies to all Hadoop distributions.  

## Prerequisites

Before you begin, [review the basics of connecting to Azure Cosmos DB for Apache Cassandra](connect-spark-configuration.md).

You need the following prerequisites:

* Provision Azure Cosmos DB for Apache Cassandra. See [Create a database account](manage-data-dotnet.md#create-a-database-account).

* Provision an HDInsight-Spark cluster. See [Create Apache Spark cluster in Azure HDInsight using ARM template](../../hdinsight/spark/apache-spark-jupyter-spark-sql.md).

* API for Cassandra configuration in Spark2. The Spark connector for Cassandra requires that the Cassandra connection details to be initialized as part of the Spark context. When you launch a Jupyter notebook, the spark session and context are already initialized. Don't stop and reinitialize the Spark context unless it's complete with every configuration set as part of the HDInsight default Jupyter notebook start-up. One workaround is to add the Cassandra instance details to Ambari, Spark2 service configuration, directly. This approach is a one-time activity per cluster that requires a Spark2 service restart.

  1. Go to Ambari, Spark2 service and select configs.

  2. Go to custom spark2-defaults and add a new property with the following, and restart Spark2 service:

  ```scala
  spark.cassandra.connection.host=YOUR_COSMOSDB_ACCOUNT_NAME.cassandra.cosmosdb.azure.com<br>
  spark.cassandra.connection.port=10350<br>
  spark.cassandra.connection.ssl.enabled=true<br>
  spark.cassandra.auth.username=YOUR_COSMOSDB_ACCOUNT_NAME<br>
  spark.cassandra.auth.password=YOUR_COSMOSDB_KEY<br>
  ```

You can use `cqlsh` for validation. For more information, see [Connecting to Azure Cosmos DB for Apache Cassandra from Spark](connect-spark-configuration.md#connecting-to-azure-cosmos-db-cassandra-api-from-spark).

## Access Azure Cosmos DB for Apache Cassandra from Spark shell

Spark shell is used for testing and exploration.

* Launch `spark-shell` with the required maven dependencies compatible with your cluster's Spark version.

  ```scala
  spark-shell --packages "com.datastax.spark:spark-cassandra-connector_2.11:2.3.0,com.microsoft.azure.cosmosdb:azure-cosmos-cassandra-spark-helper:1.0.0"
  ```

* Execute some DDL and DML operations

  ```scala
  import org.apache.spark.rdd.RDD
  import org.apache.spark.{SparkConf, SparkContext}

  import spark.implicits._
  import org.apache.spark.sql.functions._
  import org.apache.spark.sql.Column
  import org.apache.spark.sql.types.{StructType, StructField, StringType, IntegerType,LongType,FloatType,DoubleType, TimestampType}
  import org.apache.spark.sql.cassandra._

  //Spark connector
  import com.datastax.spark.connector._
  import com.datastax.spark.connector.cql.CassandraConnector

  //CosmosDB library for multiple retry
  import com.microsoft.azure.cosmosdb.cassandra

  // Specify connection factory for Cassandra
  spark.conf.set("spark.cassandra.connection.factory", "com.microsoft.azure.cosmosdb.cassandra.CosmosDbConnectionFactory")

  // Parallelism and throughput configs
  spark.conf.set("spark.cassandra.output.batch.size.rows", "1")
  spark.conf.set("spark.cassandra.connection.connections_per_executor_max", "10")
  spark.conf.set("spark.cassandra.output.concurrent.writes", "100")
  spark.conf.set("spark.cassandra.concurrent.reads", "512")
  spark.conf.set("spark.cassandra.output.batch.grouping.buffer.size", "1000")
  spark.conf.set("spark.cassandra.connection.keep_alive_ms", "60000000") //Increase this number as needed
  ```

* Run CRUD operations

  ```scala
  //1) Create table if it does not exist
  val cdbConnector = CassandraConnector(sc)
  cdbConnector.withSessionDo(session => session.execute("CREATE TABLE IF NOT EXISTS books_ks.books(book_id TEXT PRIMARY KEY,book_author TEXT, book_name TEXT,book_pub_year INT,book_price FLOAT) WITH cosmosdb_provisioned_throughput=4000;"))

  //2) Delete data from potential prior runs
  cdbConnector.withSessionDo(session => session.execute("DELETE FROM books_ks.books WHERE book_id IN ('b00300','b00001','b00023','b00501','b09999','b01001','b00999','b03999','b02999','b000009');"))

  //3) Generate a few rows
  val booksDF = Seq(
   ("b00001", "Arthur Conan Doyle", "A study in scarlet", 1887,11.33),
   ("b00023", "Arthur Conan Doyle", "A sign of four", 1890,22.45),
   ("b01001", "Arthur Conan Doyle", "The adventures of Sherlock Holmes", 1892,19.83),
   ("b00501", "Arthur Conan Doyle", "The memoirs of Sherlock Holmes", 1893,14.22),
   ("b00300", "Arthur Conan Doyle", "The hounds of Baskerville", 1901,12.25)
  ).toDF("book_id", "book_author", "book_name", "book_pub_year","book_price")

  //4) Persist
  booksDF.write.mode("append").format("org.apache.spark.sql.cassandra").options(Map( "table" -> "books", "keyspace" -> "books_ks", "output.consistency.level" -> "ALL", "ttl" -> "10000000")).save()

  //5) Read the data in the table
  spark.read.format("org.apache.spark.sql.cassandra").options(Map( "table" -> "books", "keyspace" -> "books_ks")).load.show
  ```

## Access Azure Cosmos DB for Apache Cassandra from Jupyter notebooks

HDInsight-Spark comes with Zeppelin and Jupyter notebook services. They're both web-based notebook environments that support Scala and Python. Notebooks are great for interactive exploratory analytics and collaboration, but not meant for operational or production processes.

The following Jupyter notebooks can be uploaded into your HDInsight Spark cluster and provide ready samples for working with Azure Cosmos DB for Apache Cassandra. Be sure to review the first notebook `1.0-ReadMe.ipynb` to review Spark service configuration for connecting to Azure Cosmos DB for Apache Cassandra.

Download the notebooks under [azure-cosmos-db-cassandra-api-spark-notebooks-jupyter](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-jupyter/blob/main/scala/) to your machine.
  
### How to upload

When you launch Jupyter, navigate to Scala. Create a directory and then upload the notebooks to the directory. The **Upload** button is on the top, right-hand side.  

### How to run

Go through the notebooks, and each notebook cell sequentially.  Select the **Run** button at the top of each notebook to run all cells, or **Shift**+**Enter** for each cell.

## Access with Azure Cosmos DB for Apache Cassandra from your Spark Scala program

For automated processes in production, Spark programs are submitted to the cluster by using [spark-submit](https://spark.apache.org/docs/latest/submitting-applications.html).

## Next steps

* [Create a Scala Maven application for Apache Spark in HDInsight using IntelliJ](../../hdinsight/spark/apache-spark-create-standalone-application.md)
* [SampleCosmosDBApp.scala](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-connector-sample/blob/main/src/main/scala/com/microsoft/azure/cosmosdb/cassandra/SampleCosmosDBApp.scala)
* [Connect to Azure Cosmos DB for Apache Cassandra from Spark](connect-spark-configuration.md)
