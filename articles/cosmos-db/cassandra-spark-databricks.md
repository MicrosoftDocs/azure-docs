---
title: Access Azure Cosmos DB Cassandra API from Azure Databricks
description: This article covers how to work with Azure Cosmos DB Cassandra API from Azure Databricks.
services: cosmos-db
author: anagha-microsoft

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.devlang: spark-scala
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ankhanol

---

# Access Azure Cosmos DB Cassandra API data from Azure Databricks

This article covers how to access Azure Cosmos DB Cassandra API data from [Azure Databricks](https://docs.microsoft.com/en-us/azure/azure-databricks/what-is-azure-databricks).

## Prerequisites

* [Provision an Azure Cosmos DB Cassandra API account](create-cassandra-dotnet.md#create-a-database-account)

* [Review the basics of connecting to Azure Cosmos DB Cassandra API](cassandra-spark-generic.md)

* [Provision an Azure Databricks cluster](https://docs.microsoft.com/en-us/azure/azure-databricks/quickstart-create-databricks-workspace-portal)

* [Review the code samples for working with Cassandra API](cassandra-spark-generic.md#next-steps)

* [Use cqlsh for validation if you so prefer](cassandra-spark-generic.md#connect-to-cosmos-db-cassandra-api-from-cqlsh)

* **Cassandra API instance configuration for Datastax Cassandra connector:**

  The Datastax connector requires that the Cassandra API connection configuration is initialized as a part of the Spark context. You can initialize the configuration by adding the Cassandra API connection configuration to the Spark cluster. Initializing connection configuration is a one-time activity per cluster. Add the following code to the Spark configuration as a space separated key value pair:
 
  ```scala
  spark.cassandra.connection.host YOUR_COSMOSDB_ACCOUNT_NAME.cassandra.cosmosdb.azure.com
  spark.cassandra.connection.port 10350
  spark.cassandra.connection.ssl.enabled true
  spark.cassandra.auth.username YOUR_COSMOSDB_ACCOUNT_NAME
  spark.cassandra.auth.password YOUR_COSMOSDB_KEY
  ```

## Add the required dependencies

* **Datastax Cassandra Spark connector:** - To integrate with Azure Cosmos DB Cassandra API with Spark, the Datastax Cassandra connector should be attached to the Azure Databricks cluster. To attach the cluster:

  * Review the Databricks runtime version, the Spark version. Then find the [maven coordinates](https://mvnrepository.com/artifact/com.datastax.spark/spark-cassandra-connector) that are compatible with the Datastax Cassandra Spark connector, and attach it to the cluster. See ["Upload a Maven package or Spark package"](https://docs.databricks.com/user-guide/libraries.html) article to attach the connector library to the cluster. For example, maven coordinate for "Databricks Runtime version 4.3",  "Spark 2.3.1", and "Scala 2.11" is `spark-cassandra-connector_2.11-2.3.1`

* **Azure Cosmos DB Cassandra API-specific library:** - A custom connection factory is required to configure the retry policy from the Datastax Spark connector to Azure Cosmos DB Cassandra API. Add the `com.microsoft.azure.cosmosdb:azure-cosmos-cassandra-spark-helper:1.0.0`[maven coordinates](https://search.maven.org/artifact/com.microsoft.azure.cosmosdb/azure-cosmos-cassandra-spark-helper/1.0.0/jar) to attach the library to the cluster.

## Sample notebooks

A list of Azure Databricks [sample notebooks](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-databricks/tree/master/notebooks/scala) are available in Github repo for you to download. These samples include how to connect to Azure Cosmos DB Cassandra API from Spark and perform different CRUD operations on the data. You can also [import all the notebooks](https://github.com/Azure-Samples/azure-cosmos-db-cassandra-api-spark-notebooks-databricks/tree/master/dbc) into your Databricks cluster workspace and run it. 

## Accessing Azure Cosmos DB Cassandra API from Spark Scala program

Spark programs are automated processes that are submitted to the cluster by using [spark-submit](https://spark.apache.org/docs/latest/submitting-applications.html)) and scheduled to run through the Azure Databricks jobs.

## Next steps:

* [Connect to Azure Cosmos DB Cassandra API from Spark](cassandra-spark-generic.md)
* [Read operations](cassandra-spark-read-ops.md)
* [Upsert operations](cassandra-spark-upsert-ops.md)
* [Delete operations](cassandra-spark-delete-ops.md)
* [Aggregation operations](cassandra-spark-aggregation-ops.md)
* [Table copy operations](cassandra-spark-table-copy-ops.md)