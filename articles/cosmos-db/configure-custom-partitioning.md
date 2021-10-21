---
title: Configure custom partitioning to partition analytical store data (Preview)
description: 
author: Rodrigossz
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: rosouz
---

# Configure custom partitioning to partition analytical store data (Preview)

To use custom partitioning, you must enable Azure Synapse Link on your Azure Cosmos DB account. To learn more, see [how to configure Azure Synapse Link](configure-synapse-link.md). Custom partitioning execution can be triggered from Azure Synapse Spark notebook using Azure Synapse link for Azure Cosmos DB.

> [!IMPORTANT]
> Custom partitioning feature is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The following are mandatory configuration options that are required to trigger custom partitioning execution:

* spark.cosmos.asns.execute.partitioning - Boolean value that triggers custom partitioning execution. The default value is false.

* spark.cosmos.asns.partition.keys - partition key/s using DDL formatted string. Eg: "ReadDate String".

* spark.cosmos.asns.basePath - The base path for the partitioned store on the Synapse primary storage account.

> [!NOTE]
> If you choose multiple partition keys, you can access these records from the same partitioned store with the basePath indicating the key.

The following are optional configuration options that you can use when triggering custom partitioning execution:

* spark.cosmos.asns.merge.partitioned.files - Boolean value that enables to create a single file per partition value per execution. Default value is false.

* spark.cosmos.asns.partitioning.maxRecordsPerFile - Maximum number of records in a single partitioned file in the partitioned store. If this config and the "spark.cosmos.asns.merge.partitioned.files" are specified, then new files are created once the number of records exceeds the maxRecordsPerFile value. This config is typically needed only for initial partitioning for larger collections. The default value is 1,000,000.

* spark.cosmos.asns.partitioning.shuffle.partitions - It controls parallelism during partitioned writes to the partitioned store. This config is needed only for initial partitioning for larger collections. It’s set to the number of available cores on the Spark pool. The default value is 200.

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

## Query execution with partitioned store

The following two configs are required to execute queries with partitioned store support:

* spark.cosmos.asns.partition.keys
* spark.cosmos.asns.basePath

The following example shows how to use these configs to query the above partitioned store and how filtering using the partition key can make use of the partition pruning. This partitioned store is partitioned using "ReadDate" field.

```python
df = spark.read\
    .format("cosmos.olap") \
    .option("spark.synapse.linkedService", "<enter linked service name>") \
    .option("spark.cosmos.container", "<enter container name>") \
    .option("spark.cosmos.asns.partition.keys", "readDate String") \
    .option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
    .load()

df_filtered = df.filter("readDate='2020-11-27 00:00:00.000'")
display(df_filtered.limit(10))
```

The above "ReadDate = '2021-11-01' filter will eliminate the data corresponding to ReadDate values other than '2021-11-01' from scanning, during execution.

> [!NOTE]
> The query improvements using partitioned store are applicable when queries are executed on the following:
>
> * The Spark Dataframes created from the Azure Cosmos DB analytical store container and
> * The Spark tables pointing to the Azure Cosmos DB analytical store container.

## Next steps

To learn more, see the following docs:

* [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
* [Azure Cosmos DB analytical store overview](analytical-store-introduction.md)
* [Get started with Azure Synapse Link for Azure Cosmos DB](configure-synapse-link.md)
* [Frequently asked questions about Azure Synapse Link for Azure Cosmos DB](synapse-link-frequently-asked-questions.yml)
* [Azure Synapse Link for Azure Cosmos DB Use cases](synapse-link-use-cases.md)
