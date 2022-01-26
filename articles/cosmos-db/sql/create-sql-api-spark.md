---
title: Quickstart - Manage data with Azure Cosmos DB Spark 3 OLTP Connector for SQL API
description: This quickstart presents a code sample for the Azure Cosmos DB Spark 3 OLTP Connector for SQL API that you can use to connect to and query data in your Azure Cosmos DB account
author: rothja
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: quickstart
ms.date: 11/23/2021
ms.author: jroth
ms.custom: seo-java-august2019, seo-java-september2019, devx-track-java, mode-api
---

# Quickstart: Manage data with Azure Cosmos DB Spark 3 OLTP Connector for SQL API
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
> * [.NET V3](create-sql-api-dotnet.md)
> * [.NET V4](create-sql-api-dotnet-V4.md)
> * [Java SDK v4](create-sql-api-java.md)
> * [Spring Data v3](create-sql-api-spring-data.md)
> * [Spark 3 OLTP connector](create-sql-api-spark.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Python](create-sql-api-python.md)

This tutorial is a quick start guide to show how to use Cosmos DB Spark Connector to read from or write to Cosmos DB. Cosmos DB Spark Connector is based on Spark 3.1.x.

Throughout this quick tutorial, we rely on [Azure Databricks Runtime 8.0 with Spark 3.1.1](/azure/databricks/release-notes/runtime/8.0) and a Jupyter Notebook to show how to use the Cosmos DB Spark Connector.

You can use any other Spark 3.1.1 spark offering as well, also you should be able to use any language supported by Spark (PySpark, Scala, Java, etc.), or any Spark interface you are familiar with (Jupyter Notebook, Livy, etc.).

## Prerequisites

* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/try/cosmosdb/). Alternatively, you can use the [use Azure Cosmos DB Emulator](../local-emulator.md) for development and testing.

* [Azure Databricks](/azure/databricks/release-notes/runtime/8.0) runtime 8.0 with Spark 3.1.1.

* (Optional) [SLF4J binding](https://www.slf4j.org/manual.html) is used to associate a specific logging framework with SLF4J.

SLF4J is only needed if you plan to use logging, also download an SLF4J binding, which will link the SLF4J API with the logging implementation of your choice. See the [SLF4J user manual](https://www.slf4j.org/manual.html) for more information.

Install Cosmos DB Spark Connector, in your spark Cluster [azure-cosmos-spark_3-1_2-12-4.3.1.jar](https://search.maven.org/artifact/com.azure.cosmos.spark/azure-cosmos-spark_3-1_2-12/4.3.1/jar)

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

For more information, see the full [Catalog API](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/catalog-api.md) documentation.

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

For more information related to ingesting data, see the full [write configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/configuration-reference.md#write-config) documentation.

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

For more information related to querying data, see the full [query configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/configuration-reference.md#query-config) documentation.

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

For more information related to schema inference, see the full [schema inference configuration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/configuration-reference.md#schema-inference-config) documentation.

## Configuration reference

### Generic configuration
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.accountEndpoint`      | None   | Cosmos DB Account Endpoint Uri |
| `spark.cosmos.accountKey`      | None    | Cosmos DB Account Key  |
| `spark.cosmos.database`      | None    | Cosmos DB database name  |
| `spark.cosmos.container`      | None    | Cosmos DB container name  |

### Extra tuning
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.useGatewayMode`      | `false`    | Use gateway mode for the client operations  |
| `spark.cosmos.read.forceEventualConsistency`  | `true`    | Makes the client use Eventual consistency for read operations instead of using the default account level consistency |
| `spark.cosmos.applicationName`      | None    | Application name  |
| `spark.cosmos.preferredRegionsList`      | None    | Preferred regions list to be used for a multi region Cosmos DB account. This is a comma-separated value (for example, `[East US, West US]` or `East US, West US`) provided preferred regions will be used as hint. You should use a collocated spark cluster with your Cosmos DB account and pass the spark cluster region as preferred region. See list of Azure regions [here](/dotnet/api/microsoft.azure.documents.locationnames?view=azure-dotnet&preserve-view=true). You can also use `spark.cosmos.preferredRegions` as alias |
| `spark.cosmos.diagnostics`      | None    | Can be used to enable more verbose diagnostics. Currently the only supported option is to set this property to `simple` - which will result in extra logs being emitted as `INFO` logs in the Driver and Executor logs.|

### Write config
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.write.strategy`      | `ItemOverwrite`    | Cosmos DB Items write Strategy: `ItemOverwrite` (using upsert), `ItemAppend` (using create, ignore pre-existing items that are, Conflicts), `ItemDelete` (delete all documents), `ItemDeleteIfNotModified` (delete all documents for which the etag hasn't changed)  |
| `spark.cosmos.write.maxRetryCount`      | `10`    | Cosmos DB Write Max Retry Attempts on retryable failures (for example, connection error)   |
| `spark.cosmos.write.point.maxConcurrency`   | None   | Cosmos DB Item Write Max concurrency. If not specified it will be determined based on the Spark executor VM Size |
| `spark.cosmos.write.bulk.maxPendingOperations`   | None   | Cosmos DB Item Write bulk mode maximum pending operations. Defines a limit of bulk operations being processed concurrently. If not specified it will be determined based on the Spark executor VM Size. If the volume of data is large for the provisioned throughput on the destination container, this setting can be adjusted by following the estimation of `1000 x Cores` |
| `spark.cosmos.write.bulk.enabled`      | `true`   | Cosmos DB Item Write bulk enabled |

### Query config
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.read.customQuery`      | None   | When provided the custom query will be processed against the Cosmos endpoint instead of dynamically generating the query via predicate push down. Usually it is recommended to rely on Spark's predicate push down because that will allow to generate the most efficient set of filters based on the query plan. But there are a couple of predicates like aggregates (count, group by, avg, sum etc.) that cannot be pushed down yet (at least in Spark 3.1) - so the custom query is a fallback to allow them to be pushed into the query sent to Cosmos. If specified, with schema inference enabled, the custom query will also be used to infer the schema. |
| `spark.cosmos.read.maxItemCount`  | `1000`    | Overrides the maximum number of documents that can be returned for a single query- or change feed request. The default value is `1000` - consider increasing this only for average document sizes smaller than 1 KB or when projection reduces the number of properties selected in queries significantly (like when only selecting "ID" of documents etc.).  |

### Schema inference config
When doing read operations, users can specify a custom schema or allow the connector to infer it. Schema inference is enabled by default.

| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.read.inferSchema.enabled`     | `true`    | When schema inference is disabled and user is not providing a schema, raw json will be returned. |
| `spark.cosmos.read.inferSchema.query`      | `SELECT * FROM r`    | When schema inference is enabled, used as custom query to infer it. For example, if you store multiple entities with different schemas within a container and you want to ensure inference only looks at certain document types or you want to project only particular columns. |
| `spark.cosmos.read.inferSchema.samplingSize`      | `1000`    | Sampling size to use when inferring schema and not using a query. |
| `spark.cosmos.read.inferSchema.includeSystemProperties`     | `false`    | When schema inference is enabled, whether the resulting schema will include all [Cosmos DB system properties](../account-databases-containers-items.md#properties-of-an-item). |
| `spark.cosmos.read.inferSchema.includeTimestamp`     | `false`    | When schema inference is enabled, whether the resulting schema will include the document Timestamp (`_ts`). Not required if `spark.cosmos.read.inferSchema.includeSystemProperties` is enabled, as it will already include all system properties. |
| `spark.cosmos.read.inferSchema.forceNullableProperties`     | `true`    | When schema inference is enabled, whether the resulting schema will make all columns nullable. By default, all columns (except cosmos system properties) will be treated as nullable even if all rows within the sample set have non-null values. When disabled, the inferred columns are treated as nullable or not depending on whether any record in the sample set has null-values within a column.  |

### Serialization config
Used to influence the json serialization/deserialization behavior

| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.serialization.inclusionMode`     | `Always`    | Determines whether null/default values will be serialized to json or whether properties with null/default value will be skipped. The behavior follows the same ideas as [Jackson's JsonInclude.Include](https://github.com/FasterXML/jackson-annotations/blob/d0820002721c76adad2cc87fcd88bf60f56b64de/src/main/java/com/fasterxml/jackson/annotation/JsonInclude.java#L98-L227). `Always` means json properties are created even for null and default values. `NonNull` means no json properties will be created for explicit null values. `NonEmpty` means json properties will not be created for empty string values or empty arrays/mpas. `NonDefault` means json properties will be skipped not just for null/empty but also when the value is identical to the default value `0` for numeric properties for example. |

### Change feed (only for Spark-Streaming using `cosmos.oltp.changeFeed` data source, which is read-only) configuration
| Config Property Name                            | Default       | Description |
| :---                                            | :----         | :---        | 
| spark.cosmos.changeFeed.startFrom               | `Beginning`   | ChangeFeed Start from settings (`Now`, `Beginning`  or a certain point in time (UTC) for example `2020-02-10T14:15:03`) - the default value is `Beginning`. If the write config contains a `checkpointLocation` and any checkpoints exist, the stream is always continued independent of the `spark.cosmos.changeFeed.startFrom` settings - you need to change `checkpointLocation` or delete checkpoints to restart the stream if that is the intention. | 
| spark.cosmos.changeFeed.mode                    | `Incremental` | ChangeFeed mode (`Incremental` or `FullFidelity`) - NOTE: `FullFidelity` is in experimental state right now. It requires that the subscription/account has been enabled for the private preview and there are known breaking changes that will happen for `FullFidelity` (schema of the returned documents). It is recommended to only use `FullFidelity` for non-production scenarios at this point. | 
| spark.cosmos.changeFeed.itemCountPerTriggerHint | None          | Approximate maximum number of items read from change feed for each micro-batch/trigger | 

### Json conversion configuration
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.read.schemaConversionMode`     | `Relaxed`    | The schema conversion behavior (`Relaxed`, `Strict`). When reading json documents, if a document contains an attribute that does not map to the schema type, the user can decide whether to use a `null` value (Relaxed) or an exception (Strict). |

### Partitioning strategy config
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.read.partitioning.strategy`     | `Default`    | The partitioning strategy used (Default, Custom, Restrictive or Aggressive) |
| `spark.cosmos.partitioning.targetedCount`      | None    | The targeted Partition Count. This parameter is optional and ignored unless strategy==Custom is used. In this case, the Spark Connector won't dynamically calculate number of partitions but stick with this value.  |

### Throughput control config
| Config Property Name      | Default | Description |
| :---        |    :----   |         :--- | 
| `spark.cosmos.throughputControl.enabled`      | `false`    | Whether throughput control is enabled  |
| `spark.cosmos.throughputControl.name`      | None    | Throughput control group name   |
| `spark.cosmos.throughputControl.targetThroughput`      | None   | Throughput control group target throughput  |
| `spark.cosmos.throughputControl.targetThroughputThreshold`      | None    | Throughput control group target throughput threshold  |
| `spark.cosmos.throughputControl.globalControl.database`      | None    | Database, which will be used for throughput global control  |
| `spark.cosmos.throughputControl.globalControl.container`      | None   | Container, which will be used for throughput global control  |
| `spark.cosmos.throughputControl.globalControl.renewIntervalInMS`      | `5s`    | How often the client is going to update the throughput usage of itself  |
| `spark.cosmos.throughputControl.globalControl.expireIntervalInMS`      | `11s`   | How quickly an offline client will be detected |

## Next steps

* Azure Cosmos DB Apache Spark 3 OLTP Connector for Core (SQL) API: [Release notes and resources](sql-api-sdk-java-spark-v3.md)
* Learn more about [Apache Spark](https://spark.apache.org/).
