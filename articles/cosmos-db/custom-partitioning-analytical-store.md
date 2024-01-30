---
title: Custom partitioning in Azure Synapse Link for Azure Cosmos DB
description: Custom partitioning enables you to partition the analytical store data on fields that are commonly used as filters in analytical queries resulting in improved query performance.
author: Rodrigossz
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/24/2023
ms.author: rosouz
ms.custom: ignite-fall-2021, ignite-2022
---

# Custom partitioning in Azure Synapse Link for Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Gremlin](includes/appliesto-nosql-mongodb-gremlin.md)]

Custom partitioning enables you to partition analytical store data, on fields that are commonly used as filters in analytical queries, resulting in improved query performance.

In this article, you learn how to partition your data in Azure Cosmos DB analytical store using keys that are critical for your analytical workloads. It also explains how to take advantage of the improved query performance with partition pruning. You also learn how custom partitioning improves the queries performance when your workloads have a significant number of updates or deletes.

> [!NOTE]
> Azure Cosmos DB accounts and containers should have [Azure Synapse Link](synapse-link.md) enabled to take advantage of custom partitioning.

## How does it work?

Analytical store partitioning is independent of partitioning in the transactional store. By default, analytical store isn't partitioned. If you want to query analytical store frequently based on fields such as Date, Time, Category etc. you can use custom partitioning to create a separate partitioned store based on these keys. You can choose a single field or a combination of fields from your dataset as the analytical store partition key.

You can trigger partitioning from an Azure Synapse Spark notebook using Azure Synapse Link. You can schedule it to run as a background job, once or twice a day but can be executed more often, if needed. 

> [!NOTE]
> The partitioned store points to the ADLS Gen2 primary storage account that is linked with the Azure Synapse workspace.

:::image type="content" source="./media/custom-partitioning-analytical-store/partitioned-store-architecture.png" alt-text="Architecture of partitioned store in Azure Synapse Link for Azure Cosmos DB" lightbox="./media/custom-partitioning-analytical-store/partitioned-store-architecture.png" border="false":::

The partitioned store contains Azure Cosmos DB analytical data until the last timestamp you ran your partitioning job. When you query analytical data using the partition key filters, Synapse Link automatically merges partitioned store data with the most recent changes in analytical store. This way it gives you the latest results for your queries. Although it merges the data before querying, the delta isn’t written back to the partitioned store. As the delta between data in analytical store and partitioned store widens, the query times on partitioned data may vary. Triggering partitioning job more frequently reduces this delta. Each time you execute the partition job, only incremental changes in the analytical store are processed, instead of the full data set.

## When to use?

Using partitioned store is optional when querying analytical data in Azure Cosmos DB. You can directly query the same data using Synapse Link with the existing analytical store. You may want to turn on partitioned store if you have following requirements:
* Common analytical query filters that could be used as partition columns
* Low cardinality partition columns
* Partition column distributes data equally across partitions
* High volume of update or delete operations
* Slow data ingestion 

If you are querying live data using query filters different from partition keys, we recommend that you query analytical store directly.

## Benefits

### Reduced data scanning from partition pruning

Because the data corresponding to each unique partition key is colocated in the partitioned store, when you use the partition key as a query filter, the query executions can prune the underlying data and scan only the required data. By scanning limited data, partition pruning improves the analytical query performance.

### Flexibility to partition your analytical data

You can have multiple partitioning strategies for a given analytical store container. You could use composite or separate partition keys based on your query requirements.

### Query performance improvements

In addition to the query improvements from partition pruning, custom partitioning also results in improved query performance for the following workloads:

* **Update/delete heavy workloads** - Instead of keeping track of multiple versions of records in the analytical store and loading them during each query execution, the partitioned  store only contains the latest version of the data. This capability significantly improves the query performance when you have update/delete heavy workloads.

* **Slow data ingestion workloads** - Partitioning compacts analytical data and so, if your workload has slow data ingestion, this compaction could result in better query performance

### Transactional guarantee

It is important to note that custom partitioning ensures complete transactional guarantee. The query path isn't blocked while the partitioning execution is in progress. Each query execution reads the partitioned data from the last successful partitioning. It reads the most recent data from the analytical store, which makes sure that queries always return the latest data available when using the partitioned store.

## Security

If you configured [managed private endpoints](analytical-store-private-endpoints.md) for your analytical store, we recommend to add managed private endpoints for the partitioned store too. The partitioned store is primary storage account associated with your Synapse workspace.

Similarly, if you configured [customer-managed keys on analytical store](how-to-setup-cmk.md#is-it-possible-to-use-customer-managed-keys-with-the-azure-cosmos-db-analytical-store), you must directly enable it on the Synapse workspace primary storage account, which is the partitioned store, as well.

## Partitioning strategies
You could use one or more partition keys for your analytical data. If you are using multiple partition keys, here are some recommendations on how to partition the data: 
   - **Using composite keys:**

     Say, you want to frequently query based on Key1 and Key2. 
      
     For example, "Query for all records where  ReadDate = ‘2021-10-08’ and Location = ‘Sydney’". 
       
     In this case, using composite keys are more efficient, to look up all records that match the ReadDate and the records that match Location within that ReadDate. 
       
     Sample configuration options:      
     ```python
     .option("spark.cosmos.asns.partition.keys", "ReadDate String, Location String") \
     .option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
     ```
      
     Now can query based on "Location" filter:      
     * You may want to query analytical store directly. Partitioned store scans all records by ReadDate first and then by Location. 
     So, depending on your workload and cardinality of your analytical data, you may get better results by querying analytical store directly. 
     * You could also run another partition job to also partition based on ‘Location’ on the same partitioned store.
                           
  *  **Using multiple keys separately:**
     
     Say, you want to frequently query sometimes based on 'ReadDate' and other times, based on 'Location'. 
     
     For example, 
     - Query for all records where ReadDate = ‘2021-10-08’
     - Query for all records where Location = ‘Sydney’
     
     Run two partition jobs with partition keys as defined below for this scenario:      
     
     Job 1:
     ```python
     .option("spark.cosmos.asns.partition.keys", "ReadDate String") \
     .option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
     ```                  
     Job 2: 
     ```python
     .option("spark.cosmos.asns.partition.keys", "Location String") \
     .option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
     ```        
     Note that it's not efficient to now frequently query based on "ReadDate" and "Location" filters together, on above partitioning. Composite keys allow better query performance in that case. 
      
## Limitations

* Custom partitioning is only available for Azure Synapse Spark. Custom partitioning is currently not supported for serverless SQL pools.

* Currently partitioned store can only point to the primary storage account associated with the Synapse workspace. Selecting custom storage accounts isn't supported at this point.

* Custom partitioning is only available for API for NoSQL in Azure Cosmos DB. API for MongoDB, Gremlin and Cassandra aren't supported at this time. 

## Pricing

In addition to the [Azure Synapse Link pricing](synapse-link.md#pricing), you incur the following charges when using custom partitioning:

* You are [billed](https://azure.microsoft.com/pricing/details/synapse-analytics/#pricing) for using Synapse Apache Spark pools when you run partitioning jobs on analytical store.

* The partitioned data is stored in the primary Azure Data Lake Storage Gen2 account associated with your Azure Synapse Analytics workspace. You incur the costs associated with using the ADLS Gen2 storage and transactions. These costs are determined by the storage required by partitioned analytical data and data processed for analytical queries in Synapse respectively. For more information on pricing, please visit the [Azure Data Lake Storage pricing page](https://azure.microsoft.com/pricing/details/storage/data-lake/).

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

Yes, you can specify multiple partition keys on the same partitioned store as below: 

```python
.option("spark.cosmos.asns.partition.keys", "ReadDate String, Location String") \
.option("spark.cosmos.asns.basePath", "/mnt/CosmosDBPartitionedStore/") \
```

## Next steps

To learn more, see the following docs:

* [Configure custom partitioning](configure-custom-partitioning.md) to partition analytical store data.
* [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
* [Azure Cosmos DB analytical store overview](analytical-store-introduction.md)
* [Get started with Azure Synapse Link for Azure Cosmos DB](configure-synapse-link.md)
* [Frequently asked questions about Azure Synapse Link for Azure Cosmos DB](synapse-link-frequently-asked-questions.yml)
* [Azure Synapse Link for Azure Cosmos DB Use cases](synapse-link-use-cases.md)
