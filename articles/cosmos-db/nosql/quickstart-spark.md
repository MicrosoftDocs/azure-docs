---
title: Quickstart - Manage data with Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL
description: This quickstart presents a code sample for the Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL that you can use to connect to and query data in your Azure Cosmos DB account
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: quickstart
ms.date: 03/01/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api, ignite-2022
---

# Quickstart: Manage data with Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Node.js](quickstart-nodejs.md)
> * [Java](quickstart-java.md)
> * [Spring Data](quickstart-java-spring-data.md)
> * [Python](quickstart-python.md)
> * [Spark v3](quickstart-spark.md)
> * [Go](quickstart-go.md)
>

This tutorial is a quick start guide to show how to use Azure Cosmos DB Spark Connector to read from or write to Azure Cosmos DB. Azure Cosmos DB Spark Connector supports Spark 3.1.x and 3.2.x.

Throughout this quick tutorial, we rely on [Azure Databricks Runtime 10.4 with Spark 3.2.1](/azure/databricks/release-notes/runtime/10.4) and a Jupyter Notebook to show how to use the Azure Cosmos DB Spark Connector.

You can use any other Spark (for e.g., spark 3.1.1) offering as well, also you should be able to use any language supported by Spark (PySpark, Scala, Java, etc.), or any Spark interface you are familiar with (Jupyter Notebook, Livy, etc.).

## Prerequisites

* An Azure account with an active subscription.

  * No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.

* [Azure Databricks](/azure/databricks/release-notes/runtime/10.4) runtime 10.4 with Spark 3.2.1

* (Optional) [SLF4J binding](https://www.slf4j.org/manual.html) is used to associate a specific logging framework with SLF4J.

SLF4J is only needed if you plan to use logging, also download an SLF4J binding, which will link the SLF4J API with the logging implementation of your choice. See the [SLF4J user manual](https://www.slf4j.org/manual.html) for more information.

Install Azure Cosmos DB Spark Connector in your spark cluster [using the latest version for Spark 3.2.x](https://aka.ms/azure-cosmos-spark-3-2-download).

The getting started guide is based on PySpark/Scala and you can run the following code snippet in an Azure Databricks PySpark/Scala notebook.

## Create databases and containers

First, set Azure Cosmos DB account credentials, and the Azure Cosmos DB Database name and container name.

#### [Python](#tab/python)

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

#### [Scala](#tab/scala)

```scala
val cosmosEndpoint = "https://REPLACEME.documents.azure.com:443/"
val cosmosMasterKey = "REPLACEME"
val cosmosDatabaseName = "sampleDB"
val cosmosContainerName = "sampleContainer"

val cfg = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
  "spark.cosmos.accountKey" -> cosmosMasterKey,
  "spark.cosmos.database" -> cosmosDatabaseName,
  "spark.cosmos.container" -> cosmosContainerName
)
```
---

Next, you can use the new Catalog API to create an Azure Cosmos DB Database and Container through Spark.

#### [Python](#tab/python)

```python
# Configure Catalog Api to be used
spark.conf.set("spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", cosmosMasterKey)

# create an Azure Cosmos DB database using catalog api
spark.sql("CREATE DATABASE IF NOT EXISTS cosmosCatalog.{};".format(cosmosDatabaseName))

# create an Azure Cosmos DB container using catalog api
spark.sql("CREATE TABLE IF NOT EXISTS cosmosCatalog.{}.{} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')".format(cosmosDatabaseName, cosmosContainerName))
```

#### [Scala](#tab/scala)

```scala
// Configure Catalog Api to be used
spark.conf.set(s"spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", cosmosEndpoint)
spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", cosmosMasterKey)

// create an Azure Cosmos DB database using catalog api
spark.sql(s"CREATE DATABASE IF NOT EXISTS cosmosCatalog.${cosmosDatabaseName};")

// create an Azure Cosmos DB container using catalog api
spark.sql(s"CREATE TABLE IF NOT EXISTS cosmosCatalog.${cosmosDatabaseName}.${cosmosContainerName} using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/id', manualThroughput = '1100')")
```
---

When creating containers with the Catalog API, you can set the throughput and [partition key path](../partitioning-overview.md#choose-partitionkey) for the container to be created.

For more information, see the full [Catalog API](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/catalog-api.md) documentation.

## Ingest data

The name of the data source is `cosmos.oltp`, and the following example shows how you can write a memory dataframe consisting of two items to Azure Cosmos DB:

#### [Python](#tab/python)

```python
spark.createDataFrame((("cat-alive", "Schrodinger cat", 2, True), ("cat-dead", "Schrodinger cat", 2, False)))\
  .toDF("id","name","age","isAlive") \
   .write\
   .format("cosmos.oltp")\
   .options(**cfg)\
   .mode("APPEND")\
   .save()
```

#### [Scala](#tab/scala)

```scala
spark.createDataFrame(Seq(("cat-alive", "Schrodinger cat", 2, true), ("cat-dead", "Schrodinger cat", 2, false)))
  .toDF("id","name","age","isAlive")
   .write
   .format("cosmos.oltp")
   .options(cfg)
   .mode("APPEND")
   .save()
```
---

Note that `id` is a mandatory field for Azure Cosmos DB.

For more information related to ingesting data, see the full [write configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#write-config) documentation.

## Query data

Using the same `cosmos.oltp` data source, we can query data and use `filter` to push down filters:

#### [Python](#tab/python)

```python
from pyspark.sql.functions import col

df = spark.read.format("cosmos.oltp").options(**cfg)\
 .option("spark.cosmos.read.inferSchema.enabled", "true")\
 .load()

df.filter(col("isAlive") == True)\
 .show()
```

#### [Scala](#tab/scala)

```scala
import org.apache.spark.sql.functions.col

val df = spark.read.format("cosmos.oltp").options(cfg).load()

df.filter(col("isAlive") === true)
 .withColumn("age", col("age") + 1)
 .show()
```
---

For more information related to querying data, see the full [query configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#query-config) documentation.

## Partial document update using Patch

Using the same `cosmos.oltp` data source, we can do partial update in Azure Cosmos DB using Patch API:

#### [Python](#tab/python)

```python
cfgPatch = {"spark.cosmos.accountEndpoint": cosmosEndpoint,
          "spark.cosmos.accountKey": cosmosMasterKey,
          "spark.cosmos.database": cosmosDatabaseName,
          "spark.cosmos.container": cosmosContainerName,
          "spark.cosmos.write.strategy": "ItemPatch",
          "spark.cosmos.write.bulk.enabled": "false",
          "spark.cosmos.write.patch.defaultOperationType": "Set",
          "spark.cosmos.write.patch.columnConfigs": "[col(name).op(set)]"
          }

id = "<document-id>"
query = "select * from cosmosCatalog.{}.{} where id = '{}';".format(
    cosmosDatabaseName, cosmosContainerName, id)

dfBeforePatch = spark.sql(query)
print("document before patch operation")
dfBeforePatch.show()

data = [{"id": id, "name": "Joel Brakus"}]
patchDf = spark.createDataFrame(data)

patchDf.write.format("cosmos.oltp").mode("Append").options(**cfgPatch).save()

dfAfterPatch = spark.sql(query)
print("document after patch operation")
dfAfterPatch.show()
```

For more samples related to partial document update, see the GitHub code sample [Patch Sample](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/Python/patch-sample.py).


#### [Scala](#tab/scala)

```scala
val cfgPatch = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
        "spark.cosmos.accountKey" -> cosmosMasterKey,
        "spark.cosmos.database" -> cosmosDatabaseName,
        "spark.cosmos.container" -> cosmosContainerName,
        "spark.cosmos.write.strategy" -> "ItemPatch",
        "spark.cosmos.write.bulk.enabled" -> "false",
         
        "spark.cosmos.write.patch.columnConfigs" -> "[col(name).op(set)]"
      )

val id = "<document-id>"
val query = s"select * from cosmosCatalog.${cosmosDatabaseName}.${cosmosContainerName} where id = '$id';"

val dfBeforePatch = spark.sql(query)
println("document before patch operation")
dfBeforePatch.show()
val patchDf =  Seq(
        (id,  "Joel Brakus")
      ).toDF("id", "name")

patchDf.write.format("cosmos.oltp").mode("Append").options(cfgPatch).save()
val dfAfterPatch = spark.sql(query)
println("document after patch operation")
dfAfterPatch.show()
```

For more samples related to partial document update, see the GitHub code sample [Patch Sample](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/Scala/PatchSample.scala).

---

## Schema inference

When querying data, the Spark Connector can infer the schema based on sampling existing items by setting `spark.cosmos.read.inferSchema.enabled` to `true`.

#### [Python](#tab/python)

```python
df = spark.read.format("cosmos.oltp").options(**cfg)\
 .option("spark.cosmos.read.inferSchema.enabled", "true")\
 .load()
 
df.printSchema()


# Alternatively, you can pass the custom schema you want to be used to read the data:

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

# If no custom schema is specified and schema inference is disabled, then the resulting data will be returning the raw Json content of the items:

df = spark.read.format("cosmos.oltp").options(**cfg)\
 .load()
 
df.printSchema()
```

#### [Scala](#tab/scala)

```scala
val cfgWithAutoSchemaInference = Map("spark.cosmos.accountEndpoint" -> cosmosEndpoint,
  "spark.cosmos.accountKey" -> cosmosMasterKey,
  "spark.cosmos.database" -> cosmosDatabaseName,
  "spark.cosmos.container" -> cosmosContainerName,
  "spark.cosmos.read.inferSchema.enabled" -> "true"                          
)

val df = spark.read.format("cosmos.oltp").options(cfgWithAutoSchemaInference).load()
df.printSchema()

df.show()
```
---

For more information related to schema inference, see the full [schema inference configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md#schema-inference-config) documentation.

## Configuration reference

The Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL has a complete configuration reference that provides additional and advanced settings writing and querying data, serialization, streaming using change feed, partitioning and throughput management and more. For a complete listing with details see our [Spark Connector Configuration Reference](https://aka.ms/azure-cosmos-spark-3-config) on GitHub.

## Migrate to Spark 3 Connector

If you are using our older Spark 2.4 Connector, you can find out how to migrate to the Spark 3 Connector [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/migration.md).

## Next steps

* Azure Cosmos DB Apache Spark 3 OLTP Connector for API for NoSQL: [Release notes and resources](sdk-java-spark-v3.md)
* Learn more about [Apache Spark](https://spark.apache.org/).
* Learn how to configure [throughput control](throughput-control-spark.md).
* Check out more [samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples).
