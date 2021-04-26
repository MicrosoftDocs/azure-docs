---
title: Pre-migration steps for data migration to Azure Cosmos DB's API for MongoDB
description: This doc provides an overview of the prerequisites for a data migration from MongoDB to Cosmos DB.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 03/02/2021
ms.author: anfeldma
---

# Pre-migration steps for data migrations from MongoDB to Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

> [!IMPORTANT]  
> This MongoDB pre-migration guide is the first in a series on migrating MongoDB to Azure Cosmos DB Mongo API at scale. Customers licensing and deploying MongoDB on self-managed infrastructure may want to reduce and manage the cost of their data estate by migrating to a managed cloud service like Azure Cosmos DB with pay-as-you-go pricing and elastic scalability. The goal of this series is to guide the customer through the migration process:
>
> 1. [Pre-migration](mongodb-pre-migration.md) - inventory the existing MongoDB data estate, plan migration, and choose the appropriate migration tool(s).
> 2. Execution - migrate from MongoDB to Azure Cosmos DB using the provided [tutorials]().
> 3. [Post-migration](mongodb-post-migration.md) - update and optimize existing applications to execute against your new Azure Cosmos DB data estate.
>

A solid pre-migration plan can have an outsize impact on the timeliness and success of your team's migration. A good analogy for pre-migration is starting a new project - you may begin by defining requirements, then outline the tasks involved and also prioritize the biggest tasks to be tackled first. This helps to make your project schedule predictable - but of course, unanticipated requirements can arise and complicate the project schedule. Coming back to migration - building a comprehensive execution plan in the pre-migration phase minimizes the chance that you will discover unexpected migration tasks late in the process, saving you time during migration and helping you to ensure goals are met.

Before you migrate your data from MongoDB (either on-premises or in the cloud) to Azure Cosmos DB's API for MongoDB, you should:

1. [Read the key considerations about using Azure Cosmos DB's API for MongoDB](#considerations)
2. [Choose an option to migrate your data](#options)
3. [Estimate the throughput needed for your workloads](#estimate-throughput)
4. [Pick an optimal partition key for your data](#partitioning)
5. [Understand the indexing policy that you can set on your data](#indexing)

If you have already completed the above pre-requisites for migration, you can [Migrate MongoDB data to Azure Cosmos DB's API for MongoDB using the Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db.md). Additionally, if you haven't created an account, you can browse any of the [Quickstarts](create-mongodb-dotnet.md) that show the steps to create an account.

## <a id="considerations"></a>Considerations when using Azure Cosmos DB's API for MongoDB

The following are specific characteristics about Azure Cosmos DB's API for MongoDB:

- **Capacity model**: Database capacity on Azure Cosmos DB is based on a throughput-based model. This model is based on [Request Units per second](request-units.md), which is a unit that represents the number of database operations that can be executed against a collection on a per-second basis. This capacity can be allocated at [a database or collection level](set-throughput.md), and it can be provisioned on an allocation model, or using the [autoscale provisioned throughput](provision-throughput-autoscale.md).

- **Request Units**: Every database operation has an associated Request Units (RUs) cost in Azure Cosmos DB. When executed, this is subtracted from the available request units level on a given second. If a request requires more RUs than the currently allocated RU/s there are two options to solve the issue - increase the amount of RUs, or wait until the next second starts and then retry the operation.

- **Elastic capacity**: The capacity for a given collection or database can change at any time. This allows for the database to elastically adapt to the throughput requirements of your workload.

- **Automatic sharding**: Azure Cosmos DB provides an automatic partitioning system that only requires a shard (or a partition key). The [automatic partitioning mechanism](partitioning-overview.md) is shared across all the Azure Cosmos DB APIs and it allows for seamless data and throughout scaling through horizontal distribution.

## <a id="options"></a>Migration options for Azure Cosmos DB's API for MongoDB

The [Azure Database Migration Service for Azure Cosmos DB's API for MongoDB](../dms/tutorial-mongodb-cosmos-db.md) provides a mechanism that simplifies data migration by providing a fully managed hosting platform, migration monitoring options and automatic throttling handling. The full list of options are the following:

|**Migration type**|**Solution**|**Considerations**|
|---------|---------|---------|
|Online|[Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db-online.md)|&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets and takes care of replicating live changes <br/>&bull; Works only with other MongoDB sources|
|Offline|[Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db-online.md)|&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets and takes care of replicating live changes <br/>&bull; Works only with other MongoDB sources|
|Offline|[Azure Data Factory](../data-factory/connector-azure-cosmos-db.md)|&bull; Easy to set up and supports multiple sources <br/>&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets <br/>&bull; Lack of checkpointing means that any issue during the course of migration would require a restart of the whole migration process<br/>&bull; Lack of a dead letter queue would mean that a few erroneous files could stop the entire migration process <br/>&bull; Needs custom code to increase read throughput for certain data sources|
|Offline|[Existing Mongo Tools (mongodump, mongorestore, Studio3T)](https://azure.microsoft.com/resources/videos/using-mongodb-tools-with-azure-cosmos-db/)|&bull; Easy to set up and integration <br/>&bull; Needs custom handling for throttles|

## <a id="estimate-throughput"></a> Estimate the throughput need for your workloads

In Azure Cosmos DB, the throughput is provisioned in advance and is measured in Request Units (RU's) per second. Unlike VMs or on-premises servers, RUs are easy to scale up and down at any time. You can change the number of provisioned RUs instantly. For more information, see [Request units in Azure Cosmos DB](request-units.md).

You can use the [Azure Cosmos DB Capacity Calculator](https://cosmos.azure.com/capacitycalculator/) to determine the amount of Request Units based on your database account configuration, amount of data, document size, and required reads and writes per second.

The following are key factors that affect the number of required RUs:
- **Document size**: As the size of an item/document increases, the number of RUs consumed to read or write the item/document also increases.

- **Document property count**:The number of RUs consumed to create or update a document is related to the number, complexity and length of its properties. You can reduce the request unit consumption for write operations by [limiting the number of indexed properties](mongodb-indexing.md).

- **Query patterns**: The complexity of a query affects how many request units are consumed by the query. 

The best way to understand the cost of queries is to use sample data in Azure Cosmos DB, [and run sample queries from the MongoDB Shell](connect-mongodb-account.md) using the `getLastRequestStastistics` command to get the request charge, which will output the number of RUs consumed:

`db.runCommand({getLastRequestStatistics: 1})`

This command will output a JSON document similar to the following:

```{  "_t": "GetRequestStatisticsResponse",  "ok": 1,  "CommandName": "find",  "RequestCharge": 10.1,  "RequestDurationInMilliSeconds": 7.2}```

You can also use [the diagnostic settings](cosmosdb-monitor-resource-logs.md) to understand the frequency and patterns of the queries executed against Azure Cosmos DB. The results from the diagnostic logs can be sent to a storage account, an EventHub instance or [Azure Log Analytics](../azure-monitor/logs/log-analytics-tutorial.md).  

## <a id="partitioning"></a>Choose your partition key
Partitioning, also known as Sharding, is a key point of consideration before migrating data. Azure Cosmos DB uses fully-managed partitioning to increase the capacity in a database to meet the storage and throughput requirements. This feature doesn't need the hosting or configuration of routing servers.   

In a similar way, the partitioning capability automatically adds capacity and re-balances the data accordingly. For details and recommendations on choosing the right partition key for your data, please see the [Choosing a Partition Key article](partitioning-overview.md#choose-partitionkey). 

## <a id="indexing"></a>Index your data

The Azure Cosmos DB's API for MongoDB server versions 3.6 and higher automatically indexes the `_id` field only. This field can't be dropped. It automatically enforces the uniqueness of the `_id` field per shard key. To index additional fields, you apply the [MongoDB index-management commands](mongodb-indexing.md). This default indexing policy differs from the Azure Cosmos DB SQL API, which indexes all fields by default.

The indexing capabilities provided by Azure Cosmos DB include adding compound indices, unique indices and time-to-live (TTL) indices. The index management interface is mapped to the `createIndex()` command. Learn more at [Indexing in Azure Cosmos DB's API for MongoDB](mongodb-indexing.md)article.

[Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db.md) automatically migrates MongoDB collections with unique indexes. However, the unique indexes must be created before the migration. Azure Cosmos DB does not support the creation of unique indexes, when there is already data in your collections. For more information, see [Unique keys in Azure Cosmos DB](unique-keys.md).

## Next steps
* [Migrate your MongoDB data to Cosmos DB using the Database Migration Service.](../dms/tutorial-mongodb-cosmos-db.md) 
* [Provision throughput on Azure Cosmos containers and databases](set-throughput.md)
* [Partitioning in Azure Cosmos DB](partitioning-overview.md)
* [Global Distribution in Azure Cosmos DB](distribute-data-globally.md)
* [Indexing in Azure Cosmos DB](index-overview.md)
* [Request Units in Azure Cosmos DB](request-units.md)
