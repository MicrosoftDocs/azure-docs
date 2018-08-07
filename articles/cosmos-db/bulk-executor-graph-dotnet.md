---
title: Using the graph BulkExecutor .NET library to perform bulk operations in Azure Cosmos DB Gremlin API
description: Learn how to use the BulkExecutor library to massively import graph data into an Azure Cosmos DB Gremlin API collection.
services: cosmos-db
keywords: bulk, graph, gremlin, bulkexecutor, migration
author: luisbosquez
manager: kfile
editor: cgronlun

ms.service: cosmos-db
ms.component: cosmosdb-graph
ms.devlang: na
ms.topic: tutorial
ms.date: 07/24/2018
ms.author: lbosq
ms.custom: mvc

---

# Using the graph BulkExecutor .NET library to perform bulk operations in Azure Cosmos DB Gremlin API

This tutorial provides instructions about using Azure CosmosDB's BulkExecutor .NET library to import and update graph objects in an Azure Cosmos DB Gremlin API collection. This makes use of the Graph class in the [BulkExecutor library](https://docs.microsoft.com/en-us/azure/cosmos-db/bulk-executor-overview) to create Vertex and Edge objects programmatically to then multiple of them per request. This behavior is highly configurable through the BulkExecutor library to make optimal use of both database and local memory resources.

As opposed to sending Gremlin queries to a database, where the command is evaluated and then executed one at a time, using the BulkExecutor library will instead require to create and validate the objects locally. After creating the objects, the library allows you send a configurable set of objects to the database service sequentially. Using this method, data ingestion speeds can be increased up to 100x, which makes it an ideal method for initial data migrations or periodical data movement operations. Learn more about this by visiting the GitHub page of the [Azure Cosmos DB Graph BulkExecutor sample application](https://aka.ms/graph-bulkexecutor-sample).

## Pre-requisites 
* Visual Studio 2017 with the Azure development workload. You can get started with the [Visual Studio 2017 Community Edition](https://visualstudio.microsoft.com/downloads/) for free.
* An Azure subscription. You can create [a free Azure account here](https://azure.microsoft.com/en-us/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cosmos-db). Alternatively, you can create a Cosmos DB database account with [Try Azure Cosmos DB for free](https://azure.microsoft.com/en-us/try/cosmosdb/) without an Azure subcription.
* An Azure Cosmos DB Gremlin API **unlimited collection**. This guide shows how to get started with [Azure Cosmos DB Gremlin API in .NET](https://docs.microsoft.com/en-us/azure/cosmos-db/create-graph-dotnet).
* Git. For more information check out the [Git Downloads page](https://git-scm.com/downloads).

## Clone the sample application
In this tutorial we'll follow through the steps for getting started by using the [Azure Cosmos DB Graph BulkExecutor sample](https://aka.ms/graph-bulkexecutor-sample) hosted on GitHub. This application consists of a .NET solution that randomly generates vertex and edge objects and then executes bulk insertions to the specified graph database account. To get the application, simply run the `git clone` command below:

```
git clone https://github.com/Azure-Samples/azure-cosmosdb-graph-bulkexecutor-dotnet-getting-started.git
```

This repository contains the GraphBulkExecutor sample with the following files:
* `App.config` file: This is where the application and database specific parameters are specified. This file should be modified first to connect to the destination database and collections.
    * `EndPointUrl` requires the .NET SDK endpoint in the following format: `https://your-graph-database-account.documents.azure.com:443/`
    * `AuthorizationKey` requires the Primary or Secondary key. Learn more about [Securing Access to Azure Cosmos DB data](https://docs.microsoft.com/en-us/azure/cosmos-db/secure-access-to-data#master-keys).
    * `DatabaseName`, `CollectionName` are the target database and collection names. When `ShouldCleanupOnStart` is set to `true` these values, along with `CollectionThroughput`, will be used to drop them and create a new database and collection. Similarly, if `ShouldCleanupOnFinish` is set to `true`, they will be used to delete the database as soon as the ingestion is over. Please note that the target collection must be **an unlimited collection**.
    * `CollectionThroughput` is used to create a new collection if the `ShouldCleanupOnStart` option is set to `true`.
    * `ShouldCleanupOnStart` will drop the database account and collections before the program is run, and then create new ones with the `DatabaseName`, `CollectionName` and `CollectionThroughput` values. 
    * `ShouldCleanupOnFinish` will drop the database account and collections with the specified `DatabaseName` and `CollectionName` after the program is run.
    * `NumberOfDocumentsToImport` will determine the number of test vertices and edges that will be generated in the sample. This number will apply to both vertices and edges.
    * `NumberOfBatches` will determine the number of test vertices and edges that will be generated in the sample. This number will apply to both vertices and edges.
    * `CollectionPartitionKey` will be used to create the test vertices and edges, where this property will be auto-assigned. This will also be used when re-creating the database and collections if the `ShouldCleanupOnStart` option is set to `true`.
* `Program.cs` contains the logic behind creating the `DocumentClient` collection, handling the cleanups and sending the BulkExecutor requests.
* `Util.cs` is a helper class that contains the logic behind generating test data, and checking if the database and collections exist.

## Creating Vertices and Edges

`GraphBulkExecutor` provides the `BulkImportAsync` method that requires a `IEnumerable` list of `GremlinVertex` or `GremlinEdge` objects, both defined in the `Microsoft.Azure.CosmosDB.BulkExecutor.Graph.Element` namespace. In the sample, we separated the edges and vertices into two BulkExecutor import tasks. See the example below:

```csharp

IBulkExecutor graphbulkExecutor = new GraphBulkExecutor(documentClient, targetCollection);

BulkImportResponse vResponse = null;
BulkImportResponse eResponse = null;

try
{
    // Import a list of GremlinVertex objects
    vResponse = await graphbulkExecutor.BulkImportAsync(
            Utils.GenerateVertices(numberOfDocumentsToGenerate),
            enableUpsert: true,
            disableAutomaticIdGeneration: true,
            maxConcurrencyPerPartitionKeyRange: null,
            maxInMemorySortingBatchSize: null,
            cancellationToken: token);

    // Import a list of GremlinEdge objects
    eResponse = await graphbulkExecutor.BulkImportAsync(
            Utils.GenerateEdges(numberOfDocumentsToGenerate),
            enableUpsert: true,
            disableAutomaticIdGeneration: true,
            maxConcurrencyPerPartitionKeyRange: null,
            maxInMemorySortingBatchSize: null,
            cancellationToken: token);
}
catch (DocumentClientException de)
{
    Trace.TraceError("Document client exception: {0}", de);
}
catch (Exception e)
{
    Trace.TraceError("Exception: {0}", e);
}
```

For more information on the parameters of the BulkExecutor library, please refer to the [BulkImportData to Azure Cosmos DB topic](https://docs.microsoft.com/en-us/azure/cosmos-db/bulk-executor-dot-net#bulk-import-data-to-azure-cosmos-db).

The payload needs to be instantiated into `GremlinVertex` and `GremlinEdge` objects. Here is how these objects can be created:

**Vertices**:
```csharp
// Creating a vertex
GremlinVertex v = new GremlinVertex(
    "vertexId",
    "vertexLabel");

// Adding custom properties to the vertex
v.AddProperty("customProperty", "value");

// Partitioning keys must be specified for all vertices
v.AddProperty("partitioningKey", "value");
```

**Edges**:
```csharp
// Creating an edge
GremlinEdge e = new GremlinEdge(
    "edgeId",
    "edgeLabel",
    "targetVertexId",
    "sourceVertexId",
    "targetVertexLabel",
    "sourceVertexLabel",
    "targetVertexPartitioningKey",
    "sourceVertexPartitioningKey");

// Adding custom properties to the edge
e.AddProperty("customProperty", "value");
```

**NOTE** The BulkExecutor utility doesn't automatically check for existing Vertices before adding Edges. This needs to be validated in the application before running the BulkImport tasks.

## Next steps
* To learn about Nuget package details and release notes of bulk executor .Net library, see[bulk executor SDK details](sql-api-sdk-bulk-executor-dot-net.md). 
* Check out the [Performance Tips](https://docs.microsoft.com/en-us/azure/cosmos-db/bulk-executor-dot-net#performance-tips) to further optimize the usage of BulkExecutor.

