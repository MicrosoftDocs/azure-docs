---
title: Access Azure Cosmos DB Cassandra API from Azure Databricks
description: This article covers how to work with Azure Cosmos DB Cassandra API from Azure Databricks.
author: TheovanKraay
ms.author: thvankra
ms.reviewer: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: how-to
ms.date: 09/24/2018
---

# Access Azure Cosmos DB Cassandra API data from Azure Databricks
[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

This article details how to work with Azure Cosmos DB Cassandra API from Spark on [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks).

## Prerequisites

* [Provision an Azure Cosmos DB Cassandra API account](manage-data-dotnet.md#create-a-database-account)

* [Review the basics of connecting to Azure Cosmos DB Cassandra API](connect-spark-configuration.md)

* [Provision an Azure Databricks cluster](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal)

* [Review the code samples for working with Cassandra API](connect-spark-configuration.md#next-steps)

* [Use cqlsh for validation if you so prefer](connect-spark-configuration.md#connecting-to-azure-cosmos-db-cassandra-api-from-spark)

* **Cassandra API instance configuration for Cassandra connector:**

  The connector for Cassandra API requires the Cassandra connection details to be initialized as part of the spark context. When you launch a Databricks notebook, the spark context is already initialized and it is not advisable to stop and reinitialize it. One solution is to add the Cassandra API instance configuration at a cluster level, in the cluster spark configuration. This is a one-time activity per cluster. Add the following code to the Spark configuration as a space separated key value pair:
 
  ```scala
  spark.cassandra.connection.host YOUR_COSMOSDB_ACCOUNT_NAME.cassandra.cosmosdb.azure.com
  spark.cassandra.connection.port 10350
  spark.cassandra.connection.ssl.enabled true
  spark.cassandra.auth.username YOUR_COSMOSDB_ACCOUNT_NAME
  spark.cassandra.auth.password YOUR_COSMOSDB_KEY
  ```

## Add the required dependencies

* **Cassandra Spark connector:** - To integrate Azure Cosmos DB Cassandra API with Spark, the Cassandra connector should be attached to the Azure Databricks cluster. To attach the cluster:

  * Review the Databricks runtime version, the Spark version. Then find the [maven coordinates](https://mvnrepository.com/artifact/com.datastax.spark/spark-cassandra-connector) that are compatible with the Cassandra Spark connector, and attach it to the cluster. See ["Upload a Maven package or Spark package"](https://docs.databricks.com/user-guide/libraries.html) article to attach the connector library to the cluster. We recommend selecting Databricks runtime version 7.5, which supports Spark 3.0. To add the Apache Spark Cassandra Connector, your cluster, select **Libraries** > **Install New** > **Maven**, and then add `com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.0.0` in Maven coordinates. If using Spark 2.x, we recommend an environment with Spark version 2.4.5, using spark connector at maven coordinates `com.datastax.spark:spark-cassandra-connector_2.11:2.4.3`.

* **Azure Cosmos DB Cassandra API-specific library:** - If you are using Spark 2.x, a custom connection factory is required to configure the retry policy from the Cassandra Spark connector to Azure Cosmos DB Cassandra API. Add the `com.microsoft.azure.cosmosdb:azure-cosmos-cassandra-spark-helper:1.2.0`[maven coordinates](https://search.maven.org/artifact/com.microsoft.azure.cosmosdb/azure-cosmos-cassandra-spark-helper/1.2.0/jar) to attach the library to the cluster.

> [!NOTE]
> If you are using Spark 3.0 or higher, you do not need to install the Cosmos DB Cassandra API-specific library mentioned above.

## Sample notebooks

A list of Azure Databricks [sample notebooks](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-databricks/tree/main/notebooks/scala) are available in GitHub repo for you to download. These samples include how to connect to Azure Cosmos DB Cassandra API from Spark and perform different CRUD operations on the data. You can also [import all the notebooks](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-databricks/tree/main/dbc) into your Databricks cluster workspace and run it. 

## Accessing Azure Cosmos DB Cassandra API from Spark Scala programs

Spark programs to be run as automated processes on Azure Databricks are submitted to the cluster by using [spark-submit](https://spark.apache.org/docs/latest/submitting-applications.html)) and scheduled to run through the Azure Databricks jobs.

The following are links to help you get started building Spark Scala programs to interact with Azure Cosmos DB Cassandra API.
* [How to connect to Azure Cosmos DB Cassandra API from a Spark Scala program](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-connector-sample/blob/main/src/main/scala/com/microsoft/azure/cosmosdb/cassandra/SampleCosmosDBApp.scala)
* [How to run a Spark Scala program as an automated job on Azure Databricks](/azure/databricks/jobs)
* [Complete list of code samples for working with Cassandra API](connect-spark-configuration.md#next-steps)

## Next steps

Get started with [creating a Cassandra API account, database, and a table](create-account-java.md) by using a Java application.
