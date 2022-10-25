---
title: Access Azure Cosmos DB for Apache Cassandra from Azure Databricks
description: This article covers how to work with Azure Cosmos DB for Apache Cassandra from Azure Databricks.
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

# Access Azure Cosmos DB for Apache Cassandra data from Azure Databricks
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article details how to work with Azure Cosmos DB for Apache Cassandra from Spark on [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks).

## Prerequisites

* [Provision an Azure Cosmos DB for Apache Cassandra account](manage-data-dotnet.md#create-a-database-account)

* [Review the basics of connecting to Azure Cosmos DB for Apache Cassandra](connect-spark-configuration.md)

* [Provision an Azure Databricks cluster](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal)

* [Review the code samples for working with API for Cassandra](connect-spark-configuration.md#next-steps)

* [Use cqlsh for validation if you so prefer](connect-spark-configuration.md#connecting-to-azure-cosmos-db-cassandra-api-from-spark)

* **API for Cassandra instance configuration for Cassandra connector:**

  The connector for API for Cassandra requires the Cassandra connection details to be initialized as part of the spark context. When you launch a Databricks notebook, the spark context is already initialized, and it isn't advisable to stop and reinitialize it. One solution is to add the API for Cassandra instance configuration at a cluster level, in the cluster spark configuration. It's one-time activity per cluster. Add the following code to the Spark configuration as a space separated key value pair:
 
  ```scala
  spark.cassandra.connection.host YOUR_COSMOSDB_ACCOUNT_NAME.cassandra.cosmosdb.azure.com
  spark.cassandra.connection.port 10350
  spark.cassandra.connection.ssl.enabled true
  spark.cassandra.auth.username YOUR_COSMOSDB_ACCOUNT_NAME
  spark.cassandra.auth.password YOUR_COSMOSDB_KEY
  ```

## Add the required dependencies

* **Cassandra Spark connector:** - To integrate Azure Cosmos DB for Apache Cassandra with Spark, the Cassandra connector should be attached to the Azure Databricks cluster. To attach the cluster:

  * Review the Databricks runtime version, the Spark version. Then find the [maven coordinates](https://mvnrepository.com/artifact/com.datastax.spark/spark-cassandra-connector-assembly) that are compatible with the Cassandra Spark connector, and attach it to the cluster. See ["Upload a Maven package or Spark package"](https://docs.databricks.com/user-guide/libraries.html) article to attach the connector library to the cluster. We recommend selecting Databricks runtime version 10.4 LTS, which supports Spark 3.2.1. To add the Apache Spark Cassandra Connector, your cluster, select **Libraries** > **Install New** > **Maven**, and then add `com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.2.0` in Maven coordinates. If using Spark 2.x, we recommend an environment with Spark version 2.4.5, using spark connector at maven coordinates `com.datastax.spark:spark-cassandra-connector_2.11:2.4.3`.

* **Azure Cosmos DB for Apache Cassandra-specific library:** - If you're using Spark 2.x, a custom connection factory is required to configure the retry policy from the Cassandra Spark connector to Azure Cosmos DB for Apache Cassandra. Add the `com.microsoft.azure.cosmosdb:azure-cosmos-cassandra-spark-helper:1.2.0`[maven coordinates](https://search.maven.org/artifact/com.microsoft.azure.cosmosdb/azure-cosmos-cassandra-spark-helper/1.2.0/jar) to attach the library to the cluster.

> [!NOTE]
> If you are using Spark 3.x, you do not need to install the Azure Cosmos DB for Apache Cassandra-specific library mentioned above.

> [!WARNING]
> The Spark 3 samples shown in this article have been tested with Spark **version 3.2.1** and the corresponding Cassandra Spark Connector **com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.2.0**. Later versions of Spark and/or the Cassandra connector may not function as expected.

## Sample notebooks

A list of Azure Databricks [sample notebooks](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-databricks/tree/main/notebooks/scala) is available in GitHub repo for you to download. These samples include how to connect to Azure Cosmos DB for Apache Cassandra from Spark and perform different CRUD operations on the data. You can also [import all the notebooks](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-databricks/tree/main/dbc) into your Databricks cluster workspace and run it. 

## Accessing Azure Cosmos DB for Apache Cassandra from Spark Scala programs

Spark programs to be run as automated processes on Azure Databricks are submitted to the cluster by using [spark-submit](https://spark.apache.org/docs/latest/submitting-applications.html)) and scheduled to run through the Azure Databricks jobs.

The following are links to help you get started building Spark Scala programs to interact with Azure Cosmos DB for Apache Cassandra.
* [How to connect to Azure Cosmos DB for Apache Cassandra from a Spark Scala program](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-connector-sample/blob/main/src/main/scala/com/microsoft/azure/cosmosdb/cassandra/SampleCosmosDBApp.scala)
* [How to run a Spark Scala program as an automated job on Azure Databricks](/azure/databricks/jobs)
* [Complete list of code samples for working with API for Cassandra](connect-spark-configuration.md#next-steps)

## Next steps

Get started with [creating a API for Cassandra account, database, and a table](create-account-java.md) by using a Java application.
