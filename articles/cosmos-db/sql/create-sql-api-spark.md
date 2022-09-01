---
title: Quickstart - Manage data with Azure Cosmos DB Spark 3 OLTP Connector for SQL API
description: This quickstart presents a code sample for the Azure Cosmos DB Spark 3 OLTP Connector for SQL API that you can use to connect to and query data in your Azure Cosmos DB account
author: seesharprun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: quickstart
ms.date: 03/01/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api
---

# Quickstart: Manage data with Azure Cosmos DB Spark 3 OLTP Connector for SQL API
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Java](create-sql-api-java.md)
> * [Spring Data](create-sql-api-spring-data.md)
> * [Python](create-sql-api-python.md)
> * [Spark v3](create-sql-api-spark.md)
> * [Go](create-sql-api-go.md)
>

This tutorial is a quick start guide to show how to use Cosmos DB Spark Connector to read from or write to Cosmos DB. Cosmos DB Spark Connector supports Spark 3.1.x and 3.2.x. Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb)

Throughout this quick tutorial, we rely on [Azure Databricks Runtime 8.0 with Spark 3.1.1](/azure/databricks/release-notes/runtime/8.0) and a Jupyter Notebook to show how to use the Cosmos DB Spark Connector, but you can also use [Azure Databricks Runtime 10.3 with Spark 3.2.1](/azure/databricks/release-notes/runtime/10.3).

You can use any other Spark 3.1.1 or 3.2.1 spark offering as well, also you should be able to use any language supported by Spark (PySpark, Scala, Java, etc.), or any Spark interface you are familiar with (Jupyter Notebook, Livy, etc.).

## Prerequisites

* An active Azure account. If you don't have one, you can sign up for a [free account](https://aka.ms/trycosmosdb). Alternatively, you can use the [use Azure Cosmos DB Emulator](../local-emulator.md) for development and testing.

* [Azure Databricks](/azure/databricks/release-notes/runtime/8.0) runtime 8.0 with Spark 3.1.1 or [Azure Databricks](/azure/databricks/release-notes/runtime/10.3) runtime 10.3 with Spark 3.2.1.

* (Optional) [SLF4J binding](https://www.slf4j.org/manual.html) is used to associate a specific logging framework with SLF4J.

SLF4J is only needed if you plan to use logging, also download an SLF4J binding, which will link the SLF4J API with the logging implementation of your choice. See the [SLF4J user manual](https://www.slf4j.org/manual.html) for more information.

Install Cosmos DB Spark Connector in your spark cluster [using the latest version for Spark 3.1.x](https://aka.ms/azure-cosmos-spark-3-1-download) or [using the latest version for Spark 3.2.x](https://aka.ms/azure-cosmos-spark-3-2-download).

The getting started guide is based on PySpark however you can use the equivalent scala version as well, and you can run the following code snippet in an Azure Databricks PySpark notebook.

## Create databases and containers

First, set Cosmos DB account credentials, and the Cosmos DB Database name and container name.

```python
cosmosEndpoint = "https://REPLACEME.documents.azure.com:443/"
cosmosMasterKey = "REPLACEME"
cosmosDatabaseName = "sampleDB"
cosmosContainerName = "sampleContainer"

cfg = {
  "spark.cosmos.accountEndpoint" : cosmosEndpoint,
  "spark.cosmos.accountKey" : cosmosMasterKey,
  "spark.cosmos.database" : cosmosDatabaseName,
  "spark.cosmos.container" : cosmosContainerName,
}
```

Next, you can use the new Catalog API to create a Cosmos DB Database and Container through Spark.

```python
# Configure Catalog Api to be used
spark.conf.set("spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", cosmosMasterKey)

# create a cosmos database using catalog api
spark.sql("CREATE DATABASE IF NOT EXISTS cosmosCatalog.{};".format(cosmosDatabaseName))

# create a cosmos container using catalog api
spark.sql("CREATE TABLE IF NOT EXISTS cosmosCatalog.{}.{} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')".format(cosmosDatabaseName, cosmosContainerName))
```

When creating containers with the Catalog API, you can set the throughput and [partition key path](../partitioning-overview.md#choose-partitionkey) for the container to be created.

For more information, see the full [Catalog API](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/catalog-api.md) documentation.

## Ingest data

The name of the data source is `cosmos.oltp`, and the following example shows how you can write a memory dataframe consisting of two items to Cosmos DB:

```python
spark.createDataFrame((("cat-alive", "Schrodinger cat", 2, True), ("cat-dead", "Schrodinger cat", 2, False)))\
  .toDF("id","name","age","isAlive") \
   .write\
   .format("cosmos.oltp")\
   .options(**cfg)\
   .mode("APPEND")\
   .save()
```

Note that `id` is a mandatory field for Cosmos DB.

For more information related to ingesting data, see the full [write configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#write-config) documentation.

## Query data

Using the same `cosmos.oltp` data source, we can query data and use `filter` to push down filters:

```python
from pyspark.sql.functions import col

df = spark.read.format("cosmos.oltp").options(**cfg)\
 .option("spark.cosmos.read.inferSchema.enabled", "true")\
 .load()

df.filter(col("isAlive") == True)\
 .show()
```

For more information related to querying data, see the full [query configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#query-config) documentation.

## Schema inference

When querying data, the Spark Connector can infer the schema based on sampling existing items by setting `spark.cosmos.read.inferSchema.enabled` to `true`.

```python
df = spark.read.format("cosmos.oltp").options(**cfg)\
 .option("spark.cosmos.read.inferSchema.enabled", "true")\
 .load()
 
df.printSchema()
```

Alternatively, you can pass the custom schema you want to be used to read the data:

```python
customSchema = StructType([
      StructField("id", StringType()),
      StructField("name", StringType()),
      StructField("type", StringType()),
      StructField("age", IntegerType()),
      StructField("isAlive", BooleanType())
    ])

df = spark.read.schema(customSchema).format("cosmos.oltp").options(**cfg)\
 .load()
 
df.printSchema()
```

If no custom schema is specified and schema inference is disabled, then the resulting data will be returning the raw Json content of the items:

```python
df = spark.read.format("cosmos.oltp").options(**cfg)\
 .load()
 
df.printSchema()
```

For more information related to schema inference, see the full [schema inference configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#schema-inference-config) documentation.

## Configuration reference

The Azure Cosmos DB Spark 3 OLTP Connector for SQL API has a complete configuration reference that provides additional and advanced settings writing and querying data, serialization, streaming using change feed, partitioning and throughput management and more. For a complete listing with details see our [Spark Connector Configuration Reference](https://aka.ms/azure-cosmos-spark-3-config) on GitHub.

## Migrate to Spark 3 Connector

If you are using our older Spark 2.4 Connector, you can find out how to migrate to the Spark 3 Connector [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/migration.md).

## Next steps

* Azure Cosmos DB Apache Spark 3 OLTP Connector for Core (SQL) API: [Release notes and resources](sql-api-sdk-java-spark-v3.md)
* Learn more about [Apache Spark](https://spark.apache.org/).
* Learn how to configure [throughput control](throughput-control-spark.md).
* Check out more [samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples).
