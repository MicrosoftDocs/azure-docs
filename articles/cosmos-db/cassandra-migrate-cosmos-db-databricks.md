---
title: Migrate data from Apache Cassandra to Azure Cosmos DB Cassandra API using Databricks (Spark)
description: Learn how to migrate data from Apache Cassandra database to Azure Cosmos DB Cassandra API using Azure Databricks and Spark. 
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: how-to
ms.date: 11/16/2020
ms.author: thvankra
ms.reviewer: thvankra
---

# Migrate data from Cassandra to Azure Cosmos DB Cassandra API account using Azure Databricks
[!INCLUDE[appliesto-cassandra-api](includes/appliesto-cassandra-api.md)]

Cassandra API in Azure Cosmos DB has become a great choice for enterprise workloads running on Apache Cassandra for a variety of reasons such as: 

* **No overhead of managing and monitoring:** It eliminates the overhead of managing and monitoring a myriad of settings across OS, JVM, and yaml files and their interactions.

* **Significant cost savings:** You can save cost with Azure Cosmos DB, which includes the cost of VM’s, bandwidth, and any applicable licenses. Additionally, you don’t have to manage the data centers, servers, SSD storage, networking, and electricity costs. 

* **Ability to use existing code and tools:** Azure Cosmos DB provides wire protocol level compatibility with existing Cassandra SDKs and tools. This compatibility ensures you can use your existing codebase with Azure Cosmos DB Cassandra API with trivial changes.

There are various ways to migrate database workloads from one platform to another. [Azure Databricks](https://azure.microsoft.com/services/databricks/) is a platform as a service offering for [Apache Spark](https://spark.apache.org/) that offers a way to perform offline migrations at large scale. This article describes the steps required to migrate data from native Apache Cassandra keyspaces/tables to Azure Cosmos DB Cassandra API using Azure Databricks.

## Prerequisites

* [Provision an Azure Cosmos DB Cassandra API account](create-cassandra-dotnet.md#create-a-database-account)

* [Review the basics of connecting to Azure Cosmos DB Cassandra API](cassandra-spark-generic.md)

* Review the [supported features in Azure Cosmos DB Cassandra API](cassandra-support.md) to ensure compatibility.

* Ensure you have already created empty keyspace and tables in your target Azure Cosmos DB Cassandra API account

* [Use cqlsh or hosted shell for validation](cassandra-support.md#hosted-cql-shell-preview)

## Provision an Azure Databricks cluster

You can follow instructions to [Provision an Azure Databricks cluster](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal). However, please note Apache Spark 3.x is not currently supported for the Apache Cassandra Connector. You will need to provision a Databricks runtime with a supported v2.x version of Apache Spark. We recommend version 6.6 of Databricks runtime:

:::image type="content" source="./media/cassandra-migrate-cosmos-db-databricks/databricks-runtime.png" alt-text="Databricks runtime":::


## Add dependencies

You will need to add the Apache Spark Cassandra connector library to your cluster in order to connect to both native and Cosmos DB Cassandra endpoints. In your cluster select libraries -> install new -> maven -> search packages:

:::image type="content" source="./media/cassandra-migrate-cosmos-db-databricks/databricks-search-packages.png" alt-text="Databricks search packages":::

Type `Cassandra` in the search box, and select the latest `spark-cassandra-connector` maven repository available, then select install:

:::image type="content" source="./media/cassandra-migrate-cosmos-db-databricks/databricks-search-packages-2.png" alt-text="Databricks select packages":::

> [!NOTE]
> Ensure that you restart the Databricks cluster after the Cassandra Connector library has been installed.

## Create Scala Notebook for migration

Create a Scala Notebook in Databricks with the following code. Replace your source and target cassandra configurations with corresponding credentials, and source/target keyspaces and tables, then run:

```scala
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql._
import org.apache.spark.SparkContext

// source cassandra configs
val nativeCassandra = Map( 
    "spark.cassandra.connection.host" -> "<Source Cassandra Host>",
    "spark.cassandra.connection.port" -> "9042",
    "spark.cassandra.auth.username" -> "<USERNAME>",
    "spark.cassandra.auth.password" -> "<PASSWORD>",
    "spark.cassandra.connection.ssl.enabled" -> "false",
    "keyspace" -> "<KEYSPACE>",
    "table" -> "<TABLE>"
)

//target cassandra configs
val cosmosCassandra = Map( 
    "spark.cassandra.connection.host" -> "<USERNAME>.cassandra.cosmos.azure.com",
    "spark.cassandra.connection.port" -> "10350",
    "spark.cassandra.auth.username" -> "<USERNAME>",
    "spark.cassandra.auth.password" -> "<PASSWORD>",
    "spark.cassandra.connection.ssl.enabled" -> "true",
    "keyspace" -> "<KEYSPACE>",
    "table" -> "<TABLE>",
    //throughput related settings below - tweak these depending on data volumes. 
    "spark.cassandra.output.batch.size.rows"-> "1",
    "spark.cassandra.connection.connections_per_executor_max" -> "10",
    "spark.cassandra.output.concurrent.writes" -> "1000",
    "spark.cassandra.concurrent.reads" -> "512",
    "spark.cassandra.output.batch.grouping.buffer.size" -> "1000",
    "spark.cassandra.connection.keep_alive_ms" -> "600000000"
)

//Read from native Cassandra
val DFfromNativeCassandra = sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(nativeCassandra)
  .load
  
//Write to CosmosCassandra
DFfromNativeCassandra
  .write
  .format("org.apache.spark.sql.cassandra")
  .options(cosmosCassandra)
  .save
```

> [!NOTE]
> The `spark.cassandra.output.concurrent.writes` and `connections_per_executor_max` configurations are important for avoiding [rate limiting](https://docs.microsoft.com/samples/azure-samples/azure-cosmos-cassandra-java-retry-sample/azure-cosmos-db-cassandra-java-retry-sample/), which happens when requests to Cosmos DB exceed provisioned throughput ([request units](https://docs.microsoft.com/azure/cosmos-db/request-units)). You may need to adjust these settings depending on the number of executors in the Spark cluster, and potentially the size (and therefore RU cost) of each record being written to the target tables.

## Next steps

* [Provision throughput on containers and databases](set-throughput.md) 
* [Partition key best practices](partitioning-overview.md#choose-partitionkey)
* [Estimate RU/s using the Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md) articles
* [Elastic Scale in Azure Cosmos DB Cassandra API](manage-scale-cassandra.md)
