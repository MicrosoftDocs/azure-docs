---
title: Change data capture in analytical store
titleSuffix: Azure Cosmos DB
description: Change data capture (CDC) in Azure Cosmos DB analytical store allows you to efficiently consume a continuous and incremental feed of changed data.
author: Rodrigossz
ms.author: rosouz
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/11/2023
---

# Change Data Capture in Azure Cosmos DB analytical store (preview)

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Change data capture (CDC) in [Azure Cosmos DB analytical store](analytical-store-introduction.md) allows you to efficiently consume a continuous and incremental feed of changed (inserted, updated, and deleted) data from analytical store. Seamlessly integrated with Azure Synapse and Azure Data Factory, it provides you with a scalable no-code experience for high data volume. As the change data capture feature is based on analytical store, it [doesn't consume provisioned RUs, doesn't affect your transactional workloads](analytical-store-introduction.md#decoupled-performance-for-analytical-workloads), provides lower latency, and has lower TCO.

The change data capture feature in Azure Cosmos DB analytical store can write to various sinks using an Azure Synapse or Azure Data Factory data flow.

:::image type="content" source="media\analytical-store-change-data-capture\overview-diagram.svg" alt-text="Diagram of the analytical store in Azure Cosmos DB and how it, with change data capture, can write to various first and third-party target services.":::

For more information on supported sink types in a mapping data flow, see [data flow supported sink types](../data-factory/data-flow-sink.md#supported-sinks).

In addition to providing incremental data feed from analytical store to diverse targets, change data capture supports the following capabilities:

- Supports capturing deletes and intermediate updates
- Ability to filter the change feed for a specific type of operation (**Insert** | **Update** | **Delete** | **TTL**)
- Supports applying filters, projections and transformations on the Change feed via source query
- Multiple change feeds on the same container can be consumed simultaneously
- Each change in container appears exactly once in the change data capture feed, and the checkpoints are managed internally for you
- Changes can be synchronized "from the Beginning” or “from a given timestamp” or “from now”
- There's no limitation around the fixed data retention period for which changes are available

## Efficient incremental data capture with internally managed checkpoints

Each change in Cosmos DB container appears exactly once in the CDC feed, and the checkpoints are managed internally for you. This helps to address the below disadvantages of the common pattern of using custom checkpoints based on the “_ts” value:  

 * The “_ts” filter is applied against the data files which does not always guarantee minimal data scan. The internally managed GLSN based checkpoints in the new CDC capability ensure that the incremental data identification is done, just based on the metadata and so guarantees minimal data scanning in each stream.  

* The analytical store sync process does not guarantee “_ts” based ordering which means that there could be cases where an incremental record’s “_ts” is lesser than the last checkpointed “_ts” and could be missed out in the incremental stream. The new CDC does not consider “_ts” to identify the incremental records and thus guarantees that none of the incremental records are missed. 

## Features

Change data capture in Azure Cosmos DB analytical store supports the following key features.

### Capturing changes from the beginning

When the `Start from beginning` option is selected, the initial load includes a full snapshot of container data in the first run, and changed or incremental data is captured in subsequent runs. This is limited by the `analytical TTL` property and documents TTL-removed from analytical store are not included in the change feed. Example: Imagine a container with `analytical TTL` set to 31536000 seconds, what is equivalent to 1 year. If you create a CDC process for this container, only documents newer than 1 year will be included in the initial load.

### Capturing changes from a given timestamp

When the `Start from timestamp` option is selected, the initial load processes the data from the given timestamp, and incremental or changed data is captured in subsequent runs. This process is also limited by the `analytical TTL` property.

### Capturing changes from now

When the `Start from timestamp` option is selected, all past operations of the container are not captured. 


### Capturing deletes, intermediate updates, and TTLs

The change data capture feature for the analytical store captures deletes, intermediate updates, and TTL operations. The captured deletes and updates can be applied on Sinks that support delete and update operations. The {_rid} value uniquely identifies the records and so by specifying {_rid} as key column on the Sink side, the update and delete operations would be reflected on the Sink. 

Note that TTL operations are considered deletes. Check the [source settings](get-started-change-data-capture.md) section to check mode details and the support for intermediate updates and deletes in sinks.

### Filter the change feed for a specific type of operation

You can filter the change data capture feed for a specific type of operation. For example, you can selectively capture the insert and update operations only, thereby ignoring the user-delete and TTL-delete operations.

### Applying filters, projections, and transformations on the Change feed via source query

You can optionally use a source query to specify filter(s), projection(s), and transformation(s), which would all be pushed down to the columnar analytical store. Here's a sample source-query that would only capture incremental records with the filter `Category = 'Urban'`. This sample query projects only five fields and applies a simple transformation:

```sql
SELECT ProductId, Product, Segment, concat(Manufacturer, '-', Category) as ManufacturerCategory
FROM c 
WHERE Category = 'Urban'
```


### Multiple CDC processes

You can create multiple processes to consume CDC in analytical store. This approach brings flexibility to support different scenarios and requirements. While one process may have no data transformations and multiple sinks, another one can have data flattening and one sink. And they can run in parallel.


### Throughput isolation, lower latency and lower TCO

Operations on Cosmos DB analytical store don't consume the provisioned RUs and so don't affect your transactional workloads. change data capture with analytical store also has lower latency and lower TCO. The lower latency is attributed to analytical store enabling better parallelism for data processing and reduces the overall TCO enabling you to drive cost efficiencies in these rapidly shifting economic conditions.

## Scenarios

Here are common scenarios where you could use change data capture and the analytical store.

### Consuming incremental data from Cosmos DB

You can use analytical store change data capture, if you're currently using or planning to use:  

- Incremental data capture using Azure Data Factory Data Flows or Copy activity.
- One time batch processing using Azure Data Factory.
- Streaming Cosmos DB data
  - The analytical store has up to 2-min latency to sync transactional store data. You can schedule Data Flows in Azure Data Factory every minute.
  - If you need to stream without the above latency, we recommend using the change feed feature of the transactional store.  
- Capturing deletes, incremental changes, applying filters on Cosmos DB Data.
  - If you're using Azure Functions triggers or any other option with change feed and would like to capture deletes, incremental changes, apply transformations etc.; we recommend change data capture over analytical store.

### Incremental feed to analytical platform of your choice

Change data capture capability enables an end-to-end analytical solution providing you with the flexibility to use Azure Cosmos DB data with any of the supported sink types. For more information on supported sink types, see [data flow supported sink types](../data-factory/data-flow-sink.md#supported-sinks). Change data capture also enables you to bring Azure Cosmos DB data into a centralized data lake and join the data with data from other diverse sources. You can flatten the data, partition it, and apply more transformations either in Azure Synapse Analytics or Azure Data Factory.

## Change data capture on Azure Cosmos DB for MongoDB containers

The linked service interface for the API for MongoDB isn't available within Azure Data Factory data flows yet. You can use your API for MongoDB's account endpoint with the **Azure Cosmos DB for NoSQL** linked service interface as a work around until the Mongo linked service is directly supported.

In the interface for a new NoSQL linked service, select **Enter Manually** to provide the Azure Cosmos DB account information. Here, use the account's NoSQL document endpoint (ex: `https://<account-name>.documents.azure.com:443/`) instead of the Mongo DB endpoint (ex: `mongodb://<account-name>.mongo.cosmos.azure.com:10255/`)

## Next steps

> [!div class="nextstepaction"]
> [Get started with change data capture in the analytical store](get-started-change-data-capture.md)
