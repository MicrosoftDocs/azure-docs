---
title: Change data capture in analytical store
titleSuffix: Azure Cosmos DB
description: Change data capture (CDC) in Azure Cosmos DB analytical store allows you to efficiently consume a continuous and incremental feed of changed data.
author: Rodrigossz
ms.author: rosouz
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/23/2023
---

# Change Data Capture in Azure Cosmos DB analytical store (preview)

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Change data capture (CDC) in [Azure Cosmos DB analytical store](analytical-store-introduction.md) allows you to efficiently consume a continuous and incremental feed of changed (inserted, updated, and deleted) data from analytical store. The change data capture feature of the analytical store is seamlessly integrated with Azure Synapse and Azure Data Factory, providing you with a scalable no-code experience for high data volume. As the change data capture feature is based on analytical store, it [doesn't consume provisioned RUs, doesn't affect your transactional workloads](analytical-store-introduction.md#decoupled-performance-for-analytical-workloads), provides lower latency, and has lower TCO.

> [!IMPORTANT]
> This feature is currently in preview.

The change data capture feature in Azure Cosmos DB analytical store can write to a variety of sinks using an Azure Synapse or Azure Data Factory data flow.

:::image type="content" source="media\analytical-store-change-data-capture\overview-diagram.png" alt-text="Diagram of the analytical store in Azure Cosmos DB and how it, with change data capture, can write to various first and third-party target services.":::

For more information on supported sink types in a mapping data flow, see [data flow supported sink types](../data-factory/data-flow-sink.md#supported-sinks).

In addition to providing incremental data feed from analytical store to diverse targets, change data capture supports the following capabilities:

- Supports applying filters, projections and transformations on the Change feed via source query
- Supports capturing deletes and intermediate updates
- Ability to filter the change feed for a specific type of operation (**Insert** | **Update** | **Delete** | **TTL**)
- Each change in Container appears exactly once in the change data capture feed, and the checkpoints are managed internally for you
- Changes can be synchronized from “the Beginning” or “from a given timestamp” or “from now”
- There's no limitation around the fixed data retention period for which changes are available
- Multiple change feeds on the same container can be consumed simultaneously

## Features

Change data capture in Azure Cosmos DB analytical store supports the following key features.

### Capturing deletes and intermediate updates

The change data capture feature for the analytical store captures deleted records and the intermediate updates. The captured deletes and updates can be applied on Sinks that support delete and update operations. The {_rid} value uniquely identifies the records and so by specifying {_rid} as key column on the Sink side, the update and delete operations would be reflected on the Sink.

### Filter the change feed for a specific type of operation

You can filter the change data capture feed for a specific type of operation. For example, you can selectively capture the insert and update operations only, thereby ignoring the user-delete and TTL-delete operations.

### Applying filters, projections, and transformations on the Change feed via source query

You can optionally use a source query to specify filter(s), projection(s), and transformation(s), which would all be pushed down to the columnar analytical store. Here's a sample source-query that would only capture incremental records with the filter `Category = 'Urban'`. This sample query projects only five fields and applies a simple transformation:

```sql
SELECT ProductId, Product, Segment, concat(Manufacturer, '-', Category) as ManufacturerCategory
FROM c 
WHERE Category = 'Urban'
```

> [!NOTE]
> If you would like to enable source-query based change data capture on Azure Data Factory data flows during preview, please email [cosmosdbsynapselink@microsoft.com](mailto:cosmosdbsynapselink@microsoft.com) and share your **subscription Id** and **region**. This is not necessary to enable source-query based change data capture on an Azure Synapse data flow.

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
