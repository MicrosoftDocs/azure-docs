---
title: Pre-migration steps for data migration to Azure Cosmos DB's API for MongoDB
description: This doc provides an overview of the prerequisites for a data migration from MongoDB to Cosmos DB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: how-to
ms.date: 05/17/2021
author: gahl-levy
ms.author: gahllevy
---

# Pre-migration steps for data migrations from MongoDB to Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

> [!IMPORTANT]  
> Please read this entire guide before carrying out your pre-migration steps.
>

This MongoDB pre-migration guide is part of series on MongoDB migration. The critical MongoDB migration steps are pre-migration, migration, and [post-migration](post-migration-optimization.md), as shown below.

![Diagram of migration steps.](./media/pre-migration-steps/overall-migration-steps.png)

## Overview of pre-migration

It is critical to carry out certain planning and decision-making about your migration up-front before you actually move any data. This initial decision-making process is the “pre-migration”. Your goal in pre-migration is to (1) ensure that you set up Azure Cosmos DB to fulfill your application's post-migration requirements, and (2) plan out how you will execute the migration.

Follow these steps to perform a thorough pre-migration
* [Discover your existing MongoDB resources and create an artifact to track them](#pre-migration-discovery)
* [Assess the readiness of your existing MongoDB resources for data migration](#pre-migration-assessment)
* [Map your existing MongoDB resources to new Azure Cosmos DB resources](#pre-migration-mapping)
* [Plan the logistics of migration process end-to-end, before you kick off the full-scale data migration](#execution-logistics)

Then, execute your migration in accordance with your pre-migration plan.

Finally, perform the critical [post-migration steps of cut-over and optimization](post-migration-optimization.md).

All of the above steps are critical for ensuring a successful migration.

When you plan a migration, we recommend that whenever possible you plan at the per-resource level.

## Pre-migration discovery

The first pre-migration step is resource discovery. In this step you attempt to make a comprehensive list of existing resources in your MongoDB data estate.

### Create a data estate migration spreadsheet

Create a **data estate migration spreadsheet** as a tracking document for your migration, using your preferred productivity software. 
   * The purpose of this spreadsheet is to enhance your productivity and help you to plan migration from end-to-end.
   * The structure of the spreadsheet is up to you. The following bullet points provide some recommendations.
   * This spreadsheet should be structured as a record of your data estate resources, in list form.
   * Each row corresponds to a resource (database or collection).
   * Each column corresponds to a property of the resource; for now, you should at least have *name* and *data size (GB)* as columns, although ideally you can also collect information about the MongoDB version for each resource, in which case add a *Mongo version* column as well. 
   * Initially, you will fill out this spreadsheet with a list of the existing resources in your MongoDB data estate. As you progress through this guide, you will build this spreadsheet into a tracking document for your end-to-end migration planning, adding columns as needed.

### Discover existing MongoDB data estate resources

Using an appropriate discovery tool, identify the resources (databases, collections) in your existing MongoDB data estate, as comprehensively as possible. 

Here are some tools you can use for discovering resources:
   * [MongoDB Shell](https://www.mongodb.com/try/download/shell)
   * [MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Pre-migration assessment

Second, as a prelude to planning your migration, assess the readiness of each resource in your data estate for migration. 

The primary factor impacting readiness is MongoDB version. Azure Cosmos DB currently supports MongoDB binary protocol versions 3.2, 3.6 and 4.0. Hopefully you have a column in your migration planning spreadsheet for *MongoDB version*. Step through you spreadsheet and highlight any resources which use incompatible MongoDB versions for Azure Cosmos DB.

## Pre-migration mapping

With the discovery and assessment steps complete, you are done with the MongoDB side of the equation. Now it is time to plan the Azure Cosmos DB side of the equation. How will you set up and configure your production Azure Cosmos DB resources? Do your planning at a *per-resource* level – that means you should add the following columns to your planning spreadsheet: 
* Azure Cosmos DB mapping 
* Shard key 
* Data model
* Dedicated vs shared throughput

More detail is provided in the following sections.

### Considerations when using Azure Cosmos DB's API for MongoDB

Before you plan your Azure Cosmos DB data estate, make sure you understand the following Azure Cosmos DB concepts:

- **Capacity model**: Database capacity on Azure Cosmos DB is based on a throughput-based model. This model is based on [Request Units per second](../request-units.md), which is a unit that represents the number of database operations that can be executed against a collection on a per-second basis. This capacity can be allocated at [a database or collection level](../set-throughput.md), and it can be provisioned on an allocation model, or using the [autoscale provisioned throughput](../provision-throughput-autoscale.md).

- **Request Units**: Every database operation has an associated Request Units (RUs) cost in Azure Cosmos DB. When executed, this is subtracted from the available request units level on a given second. If a request requires more RUs than the currently allocated RU/s there are two options to solve the issue - increase the amount of RUs, or wait until the next second starts and then retry the operation.

- **Elastic capacity**: The capacity for a given collection or database can change at any time. This allows for the database to elastically adapt to the throughput requirements of your workload.

- **Automatic sharding**: Azure Cosmos DB provides an automatic partitioning system that only requires a shard (or a partition key). The [automatic partitioning mechanism](../partitioning-overview.md) is shared across all the Azure Cosmos DB APIs and it allows for seamless data and throughout scaling through horizontal distribution.

### Plan the Azure Cosmos DB data estate

Figure out what Azure Cosmos DB resources you will create. This means stepping through your data estate migration spreadsheet and mapping each existing MongoDB resource to a new Azure Cosmos DB resource. 
* Anticipate that each MongoDB database will become an Azure Cosmos DB database
* Anticipate that each MongoDB collection will become an Azure Cosmos DB collection
* Choose a naming convention for your Azure Cosmos DB resources. Barring any change in the structure of databases and collections, keeping the same resource names is usually a fine choice.
* In MongoDB, sharding collections is optional. In Azure Cosmos DB, every collection is sharded.
* *Do not assume that your MongoDB collection shard key becomes your Azure Cosmos DB collection shard key. Do not assume that your existing MongoDB data model/document structure is what you will employ on Azure Cosmos DB.* 
   * Shard key is the single most important setting for optimizing the scalability and performance of Azure Cosmos DB, and data modeling is the second most important. Both of these settings are immutable and cannot be changed once they are set; therefore it is highly important to optimize them in the planning phase. Follow the guidance in the [Immutable decisions](#immutable-decisions) section for more information.
* Azure Cosmos DB does not recognize certain MongoDB collection types such as capped collections. For these resources, just create normal Azure Cosmos DB collections.
* Azure Cosmos DB has two collection types of its own – shared and dedicated throughput. Shared vs dedicated throughput is another critical, immutable decision which it is vital to make in the planning phase. Follow the guidance in the [Immutable decisions](#immutable-decisions) section for more information.

### Immutable decisions

The following Azure Cosmos DB configuration choices cannot be modified or undone once you have created an Azure Cosmos DB resource; therefore it is important to get these right during pre-migration planning, before you kick off any migrations:
* Follow [this guide](../partitioning-overview.md) to choose the best shard key. Partitioning, also known as Sharding, is a key point of consideration before migrating data. Azure Cosmos DB uses fully-managed partitioning to increase the capacity in a database to meet the storage and throughput requirements. This feature doesn't need the hosting or configuration of routing servers.   
   * In a similar way, the partitioning capability automatically adds capacity and re-balances the data accordingly. For details and recommendations on choosing the right partition key for your data, please see the [Choosing a Partition Key article](../partitioning-overview.md#choose-partitionkey). 
* Follow [this guide](../modeling-data.md) to choose a data model
* Follow [this guide](../optimize-cost-throughput.md#optimize-by-provisioning-throughput-at-different-levels) to choose between dedicated and shared throughput for each resource that you will migrate
* [Here](../how-to-model-partition-example.md) is a real-world example of sharding and data modeling to aid you in your decision-making process

### Cost of ownership

* Estimate cost of ownership of your new Azure Cosmos DB resources using the [Azure Cosmos DB capacity calculator](https://cosmos.azure.com/capacitycalculator/).

### Estimating throughput

* In Azure Cosmos DB, the throughput is provisioned in advance and is measured in Request Units (RU's) per second. Unlike VMs or on-premises servers, RUs are easy to scale up and down at any time. You can change the number of provisioned RUs instantly. For more information, see [Request units in Azure Cosmos DB](../request-units.md).

* You can use the [Azure Cosmos DB Capacity Calculator](https://cosmos.azure.com/capacitycalculator/) to determine the amount of Request Units based on your database account configuration, amount of data, document size, and required reads and writes per second.

* The following are key factors that affect the number of required RUs:
   * **Document size**: As the size of an item/document increases, the number of RUs consumed to read or write the item/document also increases.

   * **Document property count**:The number of RUs consumed to create or update a document is related to the number, complexity and length of its properties. You can reduce the request unit consumption for write operations by [limiting the number of indexed properties](mongodb-indexing.md).

   * **Query patterns**: The complexity of a query affects how many request units are consumed by the query. 

* The best way to understand the cost of queries is to use sample data in Azure Cosmos DB, [and run sample queries from the MongoDB Shell](connect-mongodb-account.md) using the `getLastRequestStastistics` command to get the request charge, which will output the number of RUs consumed:

    `db.runCommand({getLastRequestStatistics: 1})`

    This command will output a JSON document similar to the following:

    ```{  "_t": "GetRequestStatisticsResponse",  "ok": 1,  "CommandName": "find",  "RequestCharge": 10.1,  "RequestDurationInMilliSeconds": 7.2}```

* You can also use [the diagnostic settings](../cosmosdb-monitor-resource-logs.md) to understand the frequency and patterns of the queries executed against Azure Cosmos DB. The results from the diagnostic logs can be sent to a storage account, an EventHub instance or [Azure Log Analytics](../../azure-monitor/logs/log-analytics-tutorial.md).  

## Pre-migration logistics planning

Finally, now that you have a view of your existing data estate and a design for your new Azure Cosmos DB data estate, you are ready to plan how to execute your migration process end-to-end. Once again, do your planning at a *per-resource* level, adding columns to your spreadsheet to capture the logistic dimensions below.

### Execution logistics
* Assign responsibility for migrating each existing resource from MongoDB to Azure Cosmos DB. How you leverage your team resources in order to shepherd your migration to completion is up to you. For small migrations, you can have one team kick off the entire migration and monitor its progress. For larger migrations, you could assign responsibility to team-members on a per-resource basis for migrating and monitoring that resource.
* Once you have assigned responsibility for migrating your resources, now you should choose the right migration tool(s) for migration. For small migrations, you might be able to use one migration tool such as a MongoDB native tool or Azure DMS to migrate all of your resources in one shot. For larger migrations or migrations with special requirements, you may want to choose migration tooling at a per-resource granularity.
   * Before you plan which migration tools to use, we recommend acquainting yourself with the options that are available. The [Azure Database Migration Service for Azure Cosmos DB's API for MongoDB](../../dms/tutorial-mongodb-cosmos-db.md) provides a mechanism that simplifies data migration by providing a fully managed hosting platform, migration monitoring options and automatic throttling handling. The full list of options are the following:

   |**Migration type**|**Solution**|**Considerations**|
   |---------|---------|---------|
   |Online|[Azure Database Migration Service](../../dms/tutorial-mongodb-cosmos-db-online.md)|&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets and takes care of replicating live changes <br/>&bull; Works only with other MongoDB sources|
   |Offline|[Azure Database Migration Service](../../dms/tutorial-mongodb-cosmos-db-online.md)|&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets and takes care of replicating live changes <br/>&bull; Works only with other MongoDB sources|
   |Offline|[Azure Data Factory](../../data-factory/connector-azure-cosmos-db.md)|&bull; Easy to set up and supports multiple sources <br/>&bull; Makes use of the Azure Cosmos DB bulk executor library <br/>&bull; Suitable for large datasets <br/>&bull; Lack of checkpointing means that any issue during the course of migration would require a restart of the whole migration process<br/>&bull; Lack of a dead letter queue would mean that a few erroneous files could stop the entire migration process <br/>&bull; Needs custom code to increase read throughput for certain data sources|
   |Offline|[Existing Mongo Tools (mongodump, mongorestore, Studio3T)](https://azure.microsoft.com/resources/videos/using-mongodb-tools-with-azure-cosmos-db/)|&bull; Easy to set up and integration <br/>&bull; Needs custom handling for throttles|
    
   * If your resource can tolerate an offline migration, use the diagram below to choose the appropriate migration tool:

   ![Offline migration tools.](./media/pre-migration-steps/offline-tools.png)

   * If your resource requires an online migration, use the diagram below to choose the appropriate migration tool:

   ![Online migration tools.](./media/pre-migration-steps/online-tools.png)
   
   Watch this video for an [overview and demo of the migration solutions](https://www.youtube.com/watch?v=WN9h80P4QJM) mentioned above.

* Once you have chosen migration tools for each resource, the next step is to prioritize the resources you will migrate. Good prioritization can help keep your migration on schedule. A good practice is to prioritize migrating those resources which need the most time to be moved; migrating these resources first will bring the greatest progress toward completion. Furthermore, since these time-consuming migrations typically involve more data, they are usually more resource-intensive for the migration tool and therefore are more likely to expose any problems with your migration pipeline early on. This minimizes the chance that your schedule will slip due to any difficulties with your migration pipeline.
* Plan how you will monitor the progress of migration once it has started. If you are coordinating your data migration effort among a team, plan a regular cadence of team syncs to so that you have a comprehensive view of how the high-priority migrations are going.
  

### Supported migration scenarios

The best choice of MongoDB migration tool depends on your migration scenario. 

#### Types of migrations

The compatible tools for each migration scenario are shown below:

![Supported migration scenarios.](./media/pre-migration-steps/migration-tools-use-case-table.png)

#### Tooling support for MongoDB versions

Given that you are migrating from a particular MongoDB version, the supported tools are shown below:

![MongoDB versions supported by migration tools.](./media/pre-migration-steps/migration-tool-compatibility.png)

### Post-migration

In the pre-migration phase, spend some time to plan what steps you will take toward app migration and optimization post-migration.
* In the post-migration phase, you will execute a cutover of your application to use Azure Cosmos DB instead of your existing MongoDB data estate. 
* Make your best effort to plan out indexing, global distribution, consistency, and other *mutable* Azure Cosmos DB properties at a per resource level - however, these Azure Cosmos DB configuration settings *can* be modified later, so expect to make adjustments to these settings down the road. Don’t let these aspects be a cause of analysis paralysis. You will apply these mutable configurations post-migration.
* The best guide to post-migration can be found [here](post-migration-optimization.md).

## Next steps
* [Migrate your MongoDB data to Cosmos DB using the Database Migration Service.](../../dms/tutorial-mongodb-cosmos-db.md) 
* [Provision throughput on Azure Cosmos containers and databases](../set-throughput.md)
* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Global Distribution in Azure Cosmos DB](../distribute-data-globally.md)
* [Indexing in Azure Cosmos DB](../index-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
