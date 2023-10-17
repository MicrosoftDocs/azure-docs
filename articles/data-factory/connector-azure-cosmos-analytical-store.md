---
title: Copy and transform data in Azure Cosmos DB analytical store
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to transform data in Azure Cosmos DB analytical store using Azure Data Factory and Azure Synapse Analytics.
ms.author: noelleli
author: n0elleli
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom:
ms.date: 03/31/2023
---

# Copy and transform data in Azure Cosmos DB analytical store by using Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Data Flow to transform data in Azure Cosmos DB analytical store. To learn more, read the introductory articles for [Azure Data Factory](introduction.md) and [Azure Synapse Analytics](../synapse-analytics/overview-what-is.md).

>[!NOTE]
>The Azure Cosmos DB analytical store connector supports [change data capture](concepts-change-data-capture.md) Azure Cosmos DB API for NoSQL and Azure Cosmos DB API for Mongo DB, currently in public preview. 

## Supported capabilities

This Azure Cosmos DB for NoSQL connector is supported for the following capabilities:

| Supported capabilities|IR | Managed private endpoint|
|---------| --------| --------|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |✓ |


<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>


## Mapping data flow properties

When transforming data in mapping data flow, you can read and write to collections in Azure Cosmos DB. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows.

> [!Note]
> The Azure Cosmos DB analytical store is found with the [Azure Cosmos DB for NoSQL](connector-azure-cosmos-db.md) dataset type.


### Source transformation

Settings specific to Azure Cosmos DB are available in the **Source Options** tab of the source transformation. 

**Include system columns:** If true, ```id```, ```_ts```, and other system columns are included in your data flow metadata from Azure Cosmos DB. When updating collections, it's important to include this so that you can grab the existing row ID.

**Page size:** The number of documents per page of the query result. Default is "-1" which uses the service dynamic page up to 1000.

**Throughput:** Set an optional value for the number of RUs you'd like to apply to your Azure Cosmos DB collection for each execution of this data flow during the read operation. Minimum is 400.

**Preferred regions:** Choose the preferred read regions for this process.

**Change feed:** If true, you'll get data from [Azure Cosmos DB change feed](../cosmos-db/change-feed.md), which is a persistent record of changes to a container in the order they occur from last run automatically. When you set it true, don't set both **Infer drifted column types** and **Allow schema drift** as true at the same time. For more information, see [Azure Cosmos DB change feed](#azure-cosmos-db-change-feed).

**Start from beginning:** If true, you'll get initial load of full snapshot data in the first run, followed by capturing changed data in next runs. If false, the initial load will be skipped in the first run, followed by capturing changed data in next runs. The setting is aligned with the same setting name in [Azure Cosmos DB reference](https://github.com/Azure/azure-cosmosdb-spark/wiki/Configuration-references#reading-cosmosdb-collection-change-feed). For more information, see [Azure Cosmos DB change feed](#azure-cosmos-db-change-feed).

### Sink transformation

Settings specific to Azure Cosmos DB are available in the **Settings** tab of the sink transformation.

**Update method:** Determines what operations are allowed on your database destination. The default is to only allow inserts. To update, upsert, or delete rows, an alter-row transformation is required to tag rows for those actions. For updates, upserts and deletes, a key column or columns must be set to determine which row to alter.

**Collection action:** Determines whether to recreate the destination collection prior to writing.
* None: No action is done to the collection.
* Recreate: The collection gets dropped and recreated

**Batch size**: An integer that represents how many objects are being written to Azure Cosmos DB collection in each batch. Usually, starting with the default batch size is sufficient. To further tune this value, note:

- Azure Cosmos DB limits single request's size to 2 MB. The formula is "Request Size = Single Document Size * Batch Size". If you hit error saying "Request size is too large", reduce the batch size value.
- The larger the batch size, the better throughput the service can achieve, while make sure you allocate enough RUs to empower your workload.

**Partition key:** Enter a string that represents the partition key for your collection. Example: ```/movies/title```

**Throughput:** Set an optional value for the number of RUs you'd like to apply to your Azure Cosmos DB collection for each execution of this data flow. Minimum is 400.

**Write throughput budget:** An integer that represents the RUs you want to allocate for this Data Flow write operation, out of the total throughput allocated to the collection.

## Azure Cosmos DB change feed 

Azure Data Factory can get data from [Azure Cosmos DB change feed](../cosmos-db/change-feed.md) by enabling it in the mapping data flow source transformation. With this connector option, you can read change feeds and apply transformations before loading transformed data into destination datasets of your choice. You don't have to use Azure functions to read the change feed and then write custom transformations. You can use this option to move data from one container to another, prepare change feed driven material views for fit purpose or automate container backup or recovery based on change feed, and enable many more such use cases using visual drag and drop capability of Azure Data Factory.

Make sure you keep the pipeline and activity name unchanged, so that the checkpoint can be recorded by ADF for you to get changed data from the last run automatically. If you change your pipeline name or activity name, the checkpoint will be reset, which leads you to start from beginning or get changes from now in the next run.

When you debug the pipeline, this feature works the same. The checkpoint will be reset when you refresh your browser during the debug run. After you're satisfied with the pipeline result from debug run, you can go ahead to publish and trigger the pipeline. At the moment when you first time trigger your published pipeline, it automatically restarts from the beginning or gets changes from now on.

In the monitoring section, you always have the chance to rerun a pipeline. When you're doing so, the changed data is always captured from the previous checkpoint of your selected pipeline run.

In addition, Azure Cosmos DB analytical store now supports Change Data Capture (CDC) for Azure Cosmos DB API for NoSQL and Azure Cosmos DB API for Mongo DB (public preview). Azure Cosmos DB analytical store allows you to efficiently consume a continuous and incremental feed of changed (inserted, updated, and deleted) data from analytical store.

## Next steps
Get started with [change data capture in Azure Cosmos DB analytical store ](../cosmos-db/get-started-change-data-capture.md).
