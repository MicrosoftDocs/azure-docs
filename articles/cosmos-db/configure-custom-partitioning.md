---
title: Configure custom partitioning to partition analytical store data (Preview)
description: Learn how to trigger custom partitioning from Azure Synapse Spark notebook using Azure Synapse Link for Azure Cosmos DB. It explains the configuration options.
author: Rodrigossz
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/24/2023
ms.author: rosouz
ms.custom: ignite-fall-2021, ignite-2022
---

# Configure custom partitioning to partition analytical store data
[!INCLUDE[NoSQL, MongoDB, Gremlin](includes/appliesto-nosql-mongodb-gremlin.md)]

Custom partitioning enables you to partition analytical store data, on fields that are commonly used as filters in analytical queries, resulting in improved query performance.
To learn more about custom partitioning, see [what is custom partitioning](custom-partitioning-analytical-store.md) article.

To use custom partitioning, you must enable Azure Synapse Link on your Azure Cosmos DB account. To learn more, see [how to configure Azure Synapse Link](configure-synapse-link.md). Custom partitioning execution can be triggered from Azure Synapse Spark notebook using Azure Synapse Link for Azure Cosmos DB.

> [!NOTE]
> Azure Cosmos DB accounts should have Azure Synapse Link enabled to take advantage of custom partitioning. Custom partitioning is currently supported for Azure Synapse Spark 2.0 only.

> [!NOTE]
> Synapse Link for Gremlin API is now in preview. You can enable Synapse Link in your new or existing graphs using Azure CLI. For more information on how to configure it, click [here](configure-synapse-link.md).


## Trigger a custom partitioning job

Partitioning can be triggered from an Azure Synapse Spark notebook using Azure Synapse Link. You can schedule it to run as a background job, once or twice a day, or it can be executed more often if needed.  You can also choose one or more fields from the dataset as the analytical store partition key.

The following are mandatory configuration options that are required to trigger custom partitioning execution:

* `spark.cosmos.asns.execute.partitioning` - Boolean value that triggers custom partitioning execution. The default value is false.

* `spark.cosmos.asns.partition.keys` - Partition key/s using DDL formatted string. For example: *ReadDate String*.

* `spark.cosmos.asns.basePath` - The base path for the partitioned store on the Synapse primary storage account.

> [!NOTE]
> If you choose multiple partition keys, you can access these records from the same partitioned store with the basePath indicating the key.

The following are optional configuration options that you can use when triggering custom partitioning execution:

* `spark.cosmos.asns.merge.partitioned.files` - Boolean value that enables to create a single file per partition value per execution. Default value is false.

* `spark.cosmos.asns.partitioning.maxRecordsPerFile` - Maximum number of records in a single-partitioned file in the partitioned store. If this config and the `spark.cosmos.asns.merge.partitioned.files` are specified, then new files are created once the number of records exceeds the maxRecordsPerFile value. This config is typically needed only for initial partitioning for larger collections. The default value is 1,000,000.

  When you set maxRecordsPerFile but don't configure `spark.cosmos.asns.merge.partitioned.files`, the records could split across files before reaching the maxRecordsPerFile. The file split also depends on the available parallelism on the pool.

* `spark.cosmos.asns.partitioning.shuffle.partitions` - It controls parallelism during partitioned writes to the partitioned store. This config is needed only for initial partitioning for larger collections. It's set to the number of available cores on the Spark pool. The default value is 200. Lower values could waste resources if the pool is not being used for other workloads. Higher value typically doesn't cause issues, because some tasks complete early and can start more tasks while the slow ones are executing. If you want partitioning job to complete faster, it is a good practice to increase the pool size.

# [Python](#tab/python)

```python
spark.read\
    .format("cosmos.olap") \
    .option("spark.synapse.linkedService", "<enter linked service name>") \
    .option("spark.cosmos.container", "<enter container name>") \
    .option("spark.cosmos.asns.execute.partitioning", "true") \
    .option("spark.cosmos.asns.partition.keys", "readDate String") \
    .option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
    .option("spark.cosmos.asns.merge.partitioned.files", "true") \
    .option("spark.cosmos.asns.partitioning.maxRecordsPerFile", "2000000") \
    .option("spark.cosmos.asns.partitioning.shuffle.partitions", "400") \
    .load()
```

# [Scala](#tab/scala)

```scala
spark.read.
    format("cosmos.olap").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>").
    option("spark.cosmos.asns.execute.partitioning", "true").
    option("spark.cosmos.asns.partition.keys", "readDate String").
    option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/").
    option("spark.cosmos.asns.merge.partitioned.files", "true").
    option("spark.cosmos.asns.partitioning.maxRecordsPerFile", "2000000").
    option("spark.cosmos.asns.partitioning.shuffle.partitions", "400").
    load()
```
---

## Query execution with partitioned store

The following two configs are required to execute queries with partitioned store support:

* `spark.cosmos.asns.partition.keys`
* `spark.cosmos.asns.basePath`

The following example shows how to use these configs to query the above partitioned store and how filtering using the partition key can make use of the partition pruning. This partitioned store is partitioned using "ReadDate" field.

# [Python](#tab/python)

```python
df = spark.read\
    .format("cosmos.olap") \
    .option("spark.synapse.linkedService", "<enter linked service name>") \
    .option("spark.cosmos.container", "<enter container name>") \
    .option("spark.cosmos.asns.partition.keys", "readDate String") \
    .option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
    .load()

df_filtered = df.filter("readDate='2020-11-01 00:00:00.000'")
display(df_filtered.limit(10))
```

# [Scala](#tab/scala)

```scala
val df = spark.read.
            format("cosmos.olap").
            option("spark.synapse.linkedService", "<enter linked service name>").
            option("spark.cosmos.container", "<enter container name>").
            option("spark.cosmos.asns.partition.keys", "readDate String").
            option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/").
            load()
val df_filtered = df.filter("readDate='2020-11-01 00:00:00.000'")
display(df_filtered.limit(10))
```
---

The above *ReadDate = '2021-11-01'* filter will eliminate the data corresponding to ReadDate values other than *2021-11-01* from scanning, during execution.

> [!NOTE]
> The query improvements using partitioned store are applicable when queries are executed on the following:
>
> * The Spark Dataframes created from the Azure Cosmos DB analytical store container and
> * The Spark tables pointing to the Azure Cosmos DB analytical store container.

## Next steps

To learn more, see the following docs:

* [What is custom partitioning](custom-partitioning-analytical-store.md) in Azure Synapse Link for Azure Cosmos DB?
* [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
* [Azure Cosmos DB analytical store overview](analytical-store-introduction.md)
* [Get started with Azure Synapse Link for Azure Cosmos DB](configure-synapse-link.md)
* [Frequently asked questions about Azure Synapse Link for Azure Cosmos DB](synapse-link-frequently-asked-questions.yml)
