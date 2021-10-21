---
title: Custom partitioning in Azure Synapse Link for Azure Cosmos DB (Preview)
description: Custom partitioning enables you to partition analytical store data on fields that are commonly used as filters in analytical queries resulting in improved query performance.
author: Rodrigossz
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: rosouz
---

# Custom partitioning in Azure Synapse Link for Azure Cosmos DB (Preview)

Custom partitioning enables you to partition analytical store data on fields that are commonly used as filters in analytical queries resulting in improved query performance.

In this article, you will learn how to partition your data in Azure Cosmos DB analytical store using keys that are critical for your analytical workloads. It also explains how to take advantage of the improved query performance with partition pruning. You will also learn how the partitioned store helps to improve the query performance when your workloads have a significant number of updates or deletes.

> [!IMPORTANT]
> Custom partitioning feature is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Azure Cosmos DB accounts should have Azure Synapse Link enabled to take advantage of custom partitioning. Custom partitioning is currently supported for Azure Synapse Spark 2.0 only.

## How does it work?

With custom partitioning, you can choose a single field or a combination of fields from your dataset as the analytical store partition key.

The analytical store partitioning is independent of partitioning in the transactional store. By default, analytical store is not partitioned. If you want to query analytical store frequently based on fields such as Date, Time, Category etc. we recommend that you create a partitioned store based on these keys.

To trigger partitioning, you can periodically execute partitioning job from an Azure Synapse Spark notebook using Azure Synapse Link. You can schedule it to run as a background job at your convenient schedule.

> [!NOTE]
> The partitioned store points to the ADLS Gen2 primary storage account that is linked with the Azure Synapse workspace.

:::image type="content" source="./media/custom-partitioning-analytical-store/partitioned-store-architecture.png" alt-text="Architecture of partitioned store in Azure Synapse Link for Azure Cosmos DB" border="false":::

The partitioned store contains Azure Cosmos DB analytical data until the last timestamp you ran your partitioning job. When you query your analytical data using the partition key filters in Synapse Spark, Synapse Link will automatically merge most recent data from the analytical store with the data in partitioned store. This way it gives you the latest results. Although it merges the data before querying, the delta isn’t written back to the partitioned store. As the delta between data in analytical store and partitioned store widens, the query times on partitioned data may vary. Triggering partitioning job more frequently will reduce this delta. Each time you execute the partition job, only incremental changes in the analytical store will be processed, instead of the full data set.

## When to use?

Using partitioned store is optional when querying analytical data in Azure Cosmos DB. You can directly query the same data using Synapse Link with the existing analytical store. You may want to turn on partitioned store if you have following requirements:

* You want to frequently query analytical data filtered on some fields.

* You have high volume of updates/delete operations or data is ingested slowly. Partitioned store provides better query performance in these cases, irrespective of whether you are querying using partition keys or not.

Except for the workloads above, if you are querying live data using query filters that are different from the partition keys, we recommend that you query this directly from the analytical store, especially if the partitioning jobs are not run frequently.

## Benefits

### Reduced data scanning from partition pruning

Because the data corresponding to each unique partition key is colocated in the partitioned store, when you use the partition key as a query filter, the query executions can prune the underlying data and scan only the required data. By scanning limited data, partition pruning improves the analytical query performance.

### Flexibility to partition your analytical data

You can have multiple partitioning strategies for a given analytical store container where the analytical store data can be partitioned using separate partition keys. For example, the "store_sales" container can be partitioned using "sold_date" as key and can also be partitioned using "item" as key. You must have two separate partitioning jobs in this case, which will essentially partition the data into two separate partitioned stores. This partitioning strategy is beneficial if some of the queries use "sold_date" as the query filter and some other queries use "item" as the query filter.

The data across different partition keys will be part of the same partitioned store and you can query based on the partition key to pick the corresponding data.

### Query performance improvements

In addition to the query improvements from partition pruning, custom partitioning also results in improved query performance for the following workloads:

* **Update/delete heavy workloads** - Instead of keeping track of multiple versions of records in the analytical store and loading them during each query execution, the partitioned  store only contains the latest version of the data. This significantly improves the query performance when you have update/delete heavy workloads.

* **Slow data ingestion workloads** - Partitioning compacts analytical data and so, if your workload has slow data ingestion, this compaction could result in better query performance

### Transactional guarantee

It is important to note that custom partitioning ensures complete transactional guarantee. The query path is not blocked while the partitioning execution is in progress. Each query execution reads the partitioned data from the last successful partitioning. It reads the most recent data from the analytical store, which makes sure that queries always return the latest data available when using the partitioned store.

## Security

If you configured [managed private endpoints](analytical-store-private-endpoints.md) for your analytical store, to ensure network isolation for partitioned store, we recommend that you also add managed private endpoints for the partitioned store. The partitioned store is primary storage account associated with your Synapse workspace.

Similarly, if you configured [customer-managed keys on analytical store](how-to-setup-cmk.md#is-it-possible-to-use-customer-managed-keys-in-conjunction-with-the-azure-cosmos-db-analytical-store), you must directly enable it on the Synapse workspace primary storage account, which is the partitioned store, as well.

## Limitations

* Custom partitioning is only available for Azure Synapse Spark. Custom partitioning is currently not supported for serverless SQL pools.

* Currently partitioned store can only point to the primary storage account associated with the Synapse workspace. We do not support selecting custom storage accounts at this point.

## Pricing

In addition to the [Azure Synapse Link pricing](https://docs.microsoft.com/azure/cosmos-db/synapse-link#pricing), you will incur the following charges when using custom partitioning:

* You are [billed](https://azure.microsoft.com/pricing/details/synapse-analytics/#pricing) for using Synapse Apache Spark pools when you run partitioning jobs on analytical store.

* The partitioned data is stored in the primary Azure Data Lake Storage Gen2 account associated with your Azure Synapse Analytics workspace. You will incur the costs associated with using the ADLS Gen2 storage and transactions. These costs are determined by the storage required by partitioned analytical data and data processed for analytical queries in Synapse respectively. For more information on pricing, please visit the [Azure Data Lake Storage pricing page](https://azure.microsoft.com/pricing/details/storage/data-lake/).

## Frequently asked questions

### How often should I run the custom partitioning job?

There are several factors such as incremental data volume, query latency requirements etc. that determine how often you can run the custom partitioning job. It could be run once a day or once in every few hours. You may want to schedule the partitioning job more often if the incoming data volume is high and the expected query latency is low. You must also first accumulate incremental data in analytical store for the partition pruning to be effective.

### Do the query results include latest data while the partitioning job execution is in progress?

Yes, custom partitioning provides a complete transactional guarantee. So, the query results at any point of time combine the existing partitioned data with the tail data returning the latest analytical store dataset.

### Can the custom partitioning make use of linked service authentication on Azure Synapse Analytics?

Yes, linked service authentication  can be used for analytical store partitioning.

### Can I change the partition key for a given container at a later point in time?

Yes, the partition key for the given container can be changed and the new partition key definition will create a new partitioned store.

> [!NOTE]
> The partition key definition is part of the partitioned store path.

### Can different partition keys point to the same BasePath?

Yes, since the partition key definition is part of the partitioned store path, different partition keys will have different paths branching from the same BasePath.

Base path format could be specified as: /mnt/partitionedstorename/{Cosmos_DB_account_name}/{Cosmos_DB_database_rid}/{Cosmos_DB_container_rid}/partition=partitionkey/

For example:
/mnt/CosmosDBPartitionedStore/store_sales/…/partition=sold_date/...
/mnt/CosmosDBPartitionedStore/store_sales/…/partition=Date/...

## Next steps

To learn more, see the following docs:

* [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
* [Azure Cosmos DB analytical store overview](analytical-store-introduction.md)
* [Get started with Azure Synapse Link for Azure Cosmos DB](configure-synapse-link.md)
* [Frequently asked questions about Azure Synapse Link for Azure Cosmos DB](synapse-link-frequently-asked-questions.yml)
* [Azure Synapse Link for Azure Cosmos DB Use cases](synapse-link-use-cases.md)
