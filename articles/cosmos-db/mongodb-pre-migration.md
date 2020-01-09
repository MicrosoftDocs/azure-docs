---
title: Pre-migration steps for data migration to Azure Cosmos DB's API for MongoDB
description: This doc provides an overview of the prerequisites for a data migration from MongoDB to Cosmos DB.
author: roaror
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 01/09/2020
ms.author: roaror
---

# Pre-migration steps for data migrations from MongoDB to Azure Cosmos DB's API for MongoDB

Before you migrate your data from MongoDB (either on-premises or in the cloud) to Azure Cosmos DB’s API for MongoDB, you should:

1. [Read the key considerations about using Azure Cosmos DB's API for MongoDB](#considerations)
2. [Choose an option to migrate your data](#options)
3. [Estimate the throughput needed for your workloads](#estimate-throughput)
4. [Pick an optimal partition key for your data](#partitioning)
5. [Understand the indexing policy that you can set on your data](#indexing)

If you have already completed the above pre-requisites for migration, you can [Migrate MongoDB data to Azure Cosmos DB's API for MongoDB using the Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db.md). Additionally, if you haven't created an account, you can browse any of the [Quickstarts](create-mongodb-dotnet.md).

## <a id="considerations">Main considerations when using Azure Cosmos DB's API for MongoDB</a>

The following are specific characteristics about Azure Cosmos DB's API for MongoDB:
- **Capacity model**: Database capacity on Cosmos DB is based on a throughput-based model. This model is based on [Request Units per second](request-units.md), which is a unit that represents the number of database operations that can be executed against a collection on a per-second basis. This capacity can be allocated at [a database or collection level](set-throughput.md), and it can works on an allocation model, or an [AutoPilot model](provision-throughput-autopilot.md).
- **Request Units**: Every database operation has an associated Request Units (RUs) cost in Cosmos DB. When executed, this is subtracted from the available request units level on a given second. If a request requires more RUs than currently allocated the two options are increasing the amount of RUs, or waiting until the next second starts, then retrying the operation.
- **Elastic capacity**: The capacity for a given collection or database can change at any time. This allows for the database to elastically adapt to the throughput requirements of your workload.
- **Automatic sharding**: Cosmos DB provides an automatic partitioning system that only requires a shard (or partitioning) key. The [automatic partitioning mechanism](partition-data.md) is shared across all Cosmos DB APIs and it allows for seamless data and throughout scaling through horizontal distribution.

## <a id="options">Migration options for Azure Cosmos DB's API for MongoDB</a>

|**Migration type**|**Solution**|**Considerations**|
|---------|---------|---------|
|Offline|[Data Migration Tool](https://docs.microsoft.com/azure/cosmos-db/import-data)|&bull; Easy to set up and supports multiple sources <br/>&bull; Not suitable for large datasets.|
|Offline|[Azure Data Factory](https://docs.microsoft.com/azure/data-factory/connector-azure-cosmos-db)|&bull; Easy to set up and supports multiple sources <br/>&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets <br/>&bull; Lack of checkpointing means that any issue during the course of migration would require a restart of the whole migration process<br/>&bull; Lack of a dead letter queue would mean that a few erroneous files could stop the entire migration process <br/>&bull; Needs custom code to increase read throughput for certain data sources|
|Offline|[Existing Mongo Tools (mongodump, mongorestore, Studio3T)](https://azure.microsoft.com/resources/videos/using-mongodb-tools-with-azure-cosmos-db/)|&bull; Easy to set up and integration <br/>&bull; Needs custom handling for throttles|
|Online|[Azure Database Migration Service](https://docs.microsoft.com/azure/dms/tutorial-mongodb-cosmos-db-online)|&bull; Fully managed migration service.<br/>&bull; Provides hosting and monitoring solutions for the migration task. <br/>&bull; Suitable for large datasets and takes care of replicating live changes <br/>&bull; Works only with other MongoDB sources|


## <a id="estimate-throughput"></a> Estimate the throughput need for your workloads

In Azure Cosmos DB, the throughput is provisioned in advance and is measured in Request Units (RU's) per second. Unlike VMs or on-premises servers, RUs are easy to scale up and down at any time. You can change the number of provisioned RUs instantly. For more information, see [Request units in Azure Cosmos DB](request-units.md).

You can use the [Cosmos DB Capacity Calculator](https://cosmos.azure.com/capacitycalculator/) to determine the amount of Request Units based on your database account configuration, amount of data, document size, and required reads and writes per second.

The following are key factors that affect the number of required RUs:
- **Item (i.e., document) size**: As the size of an item/document increases, the number of RUs consumed to read or write the item/document also increases.
- **Item property count**: Assuming the [default indexing](index-overview.md) on all properties, the number of RUs consumed to write an item increases as the item property count increases. You can reduce the request unit consumption for write operations by [limiting the number of indexed properties](index-policy.md).
- **Concurrent operations**: Request units consumed also depends on the frequency with which different CRUD operations (like writes, reads, updates, deletes) and more complex queries are executed. You can use [mongostat](https://docs.mongodb.com/manual/reference/program/mongostat/) to output the concurrency needs of your current MongoDB data.
- **Query patterns**: The complexity of a query affects how many request units are consumed by the query.

The best way to understand the cost of queries is to use sample data in Azure Cosmos DB, [and run sample queries from the MongoDB Shell](connect-mongodb-account.md) using the `getLastRequestStastistics` command to get the request charge, which will output the number of RUs consumed:

`db.runCommand({getLastRequestStatistics: 1})`

This command will output a JSON document similar to the following:

```{  "_t": "GetRequestStatisticsResponse",  "ok": 1,  "CommandName": "find",  "RequestCharge": 10.1,  "RequestDurationInMilliSeconds": 7.2}```

After you understand the number of RUs consumed by a query and the concurrency needs for that query, you can adjust the number of provisioned RUs. Optimizing RUs is not a one-time event - you should continually optimize or scale up the RUs provisioned, depending on whether you are not expecting a heavy traffic, as opposed to a heavy workload or importing data.

## <a id="partitioning">Choose your partition key</a>
Partitioning is a key point of consideration before migrating to a globally distributed database like Azure Cosmos DB. Azure Cosmos DB uses partitioning to scale individual containers in a database to meet the storage and throughput needs of your application. This feature works in a similar way as sharding, without the need to host and configure routing servers.  

In a similar way, the partitioning capability automatically adds capacity and re-balances the data accordingly. For details and recommendations on choosing the right partition key for your data, please see the [Choosing a Partition Key article](https://docs.microsoft.com/azure/cosmos-db/partitioning-overview#choose-partitionkey). 

## <a id="indexing"></a>Index your data
By default, Azure Cosmos DB indexes all your data fields upon ingestion. You can modify the [indexing policy](index-policy.md) in Azure Cosmos DB at any time. In fact, it is often recommended to turn off indexing when migrating data, and then turn it back on when the data is already in Cosmos DB. For more details on indexing, you can read more about it in the [Indexing in Azure Cosmos DB](index-overview.md) section. 

[Azure Database Migration Service](../dms/tutorial-mongodb-cosmos-db.md) automatically migrates MongoDB collections with unique indexes. However, the unique indexes must be created before the migration. Azure Cosmos DB does not support the creation of unique indexes, when there is already data in your collections. For more information, see [Unique keys in Azure Cosmos DB](unique-keys.md).

## Next steps
* [Migrate your MongoDB data to Cosmos DB using the Database Migration Service.](../dms/tutorial-mongodb-cosmos-db.md) 
* [Provision throughput on Azure Cosmos containers and databases](set-throughput.md)
* [Partitioning in Azure Cosmos DB](partition-data.md)
* [Global Distribution in Azure Cosmos DB](distribute-data-globally.md)
* [Indexing in Azure Cosmos DB](index-overview.md)
* [Request Units in Azure Cosmos DB](request-units.md)
