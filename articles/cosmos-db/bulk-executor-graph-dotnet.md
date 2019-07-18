---
title: Using the graph BulkExecutor .NET library to perform bulk operations in Azure Cosmos DB Gremlin API
description: Learn how to use the BulkExecutor library to massively import graph data into an Azure Cosmos DB Gremlin API container.
author: luisbosquez
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: tutorial
ms.date: 05/28/2019
ms.author: lbosq
ms.reviewer: sngun
---

# Using the graph BulkExecutor .NET library to perform bulk operations in Azure Cosmos DB Gremlin API

This tutorial provides instructions about using Azure CosmosDB's BulkExecutor .NET library to import and update graph objects into an Azure Cosmos DB Gremlin API container. This process makes use of the Graph class in the [BulkExecutor library](https://docs.microsoft.com/azure/cosmos-db/bulk-executor-overview) to create Vertex and Edge objects programmatically to then insert multiple of them per network request. This behavior is configurable through the BulkExecutor library to make optimal use of both database and local memory resources.

As opposed to sending Gremlin queries to a database, where the command is evaluated and then executed one at a time, using the BulkExecutor library will instead require to create and validate the objects locally. After creating the objects, the library allows you to send graph objects to the database service sequentially. Using this method, data ingestion speeds can be increased up to 100x, which makes it an ideal method for initial data migrations or periodical data movement operations. Learn more by visiting the GitHub page of the [Azure Cosmos DB Graph BulkExecutor sample application](https://aka.ms/graph-bulkexecutor-sample).

## Bulk operations with graph data

The [BulkExecutor library](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.graph?view=azure-dotnet) contains a `Microsoft.Azure.CosmosDB.BulkExecutor.Graph` namespace to provide functionality for creating and importing graph objects. 

The following process outlines how data migration can be used for a Gremlin API container:
1. Retrieve records from the data source.
2. Construct `GremlinVertex` and `GremlinEdge` objects from the obtained records and add them into an `IEnumerable` data structure. In this part of the application the logic to detect and add relationships should be implemented, in case the data source is not a graph database.
3. Use the [Graph BulkImportAsync method](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.graph.graphbulkexecutor.bulkimportasync?view=azure-dotnet) to insert the graph objects into the collection.

This mechanism will improve the data migration efficiency as compared to using a Gremlin client. This improvement is experienced because inserting data with Gremlin will require the application send a query at a time that will need to be validated, evaluated, and then executed to create the data. The BulkExecutor library will handle the validation in the application and send multiple graph objects at a time for each network request.

### Creating Vertices and Edges

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

For more information on the parameters of the BulkExecutor library, refer to the [BulkImportData to Azure Cosmos DB topic](https://docs.microsoft.com/azure/cosmos-db/bulk-executor-dot-net#bulk-import-data-to-azure-cosmos-db).

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

> [!NOTE]
> The BulkExecutor utility doesn't automatically check for existing Vertices before adding Edges. This needs to be validated in the application before running the BulkImport tasks.

## Sample application

### Prerequisites
* Visual Studio 2019 with the Azure development workload. You can get started with the [Visual Studio 2019 Community Edition](https://visualstudio.microsoft.com/downloads/) for free.
* An Azure subscription. You can create [a free Azure account here](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cosmos-db). Alternatively, you can create a Cosmos DB database account with [Try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription.
* An Azure Cosmos DB Gremlin API database with an **unlimited collection**. This guide shows how to get started with [Azure Cosmos DB Gremlin API in .NET](https://docs.microsoft.com/azure/cosmos-db/create-graph-dotnet).
* Git. For more information check out the [Git Downloads page](https://git-scm.com/downloads).

### Clone the sample application
In this tutorial, we'll follow through the steps for getting started by using the [Azure Cosmos DB Graph BulkExecutor sample](https://aka.ms/graph-bulkexecutor-sample) hosted on GitHub. This application consists of a .NET solution that randomly generates vertex and edge objects and then executes bulk insertions to the specified graph database account. To get the application, run the `git clone` command below:

```bash
git clone https://github.com/Azure-Samples/azure-cosmosdb-graph-bulkexecutor-dotnet-getting-started.git
```

This repository contains the GraphBulkExecutor sample with the following files:

File|Description
---|---
`App.config`|This is where the application and database-specific parameters are specified. This file should be modified first to connect to the destination database and collections.
`Program.cs`| This file contains the logic behind creating the `DocumentClient` collection, handling the cleanups and sending the BulkExecutor requests.
`Util.cs`| This file contains a helper class that contains the logic behind generating test data, and checking if the database and collections exist.

In the `App.config` file, the following are the configuration values that can be provided:

Setting|Description
---|---
`EndPointUrl`|This is **your .NET SDK endpoint** found in the Overview blade of your Azure Cosmos DB Gremlin API database account. This has the format of `https://your-graph-database-account.documents.azure.com:443/`
`AuthorizationKey`|This is the Primary or Secondary key listed under your Azure Cosmos DB account. Learn more about [Securing Access to Azure Cosmos DB data](https://docs.microsoft.com/azure/cosmos-db/secure-access-to-data#master-keys)
`DatabaseName`, `CollectionName`|These are the **target database and collection names**. When `ShouldCleanupOnStart` is set to `true` these values, along with `CollectionThroughput`, will be used to drop them and create a new database and collection. Similarly, if `ShouldCleanupOnFinish` is set to `true`, they will be used to delete the database as soon as the ingestion is over. Note that the target collection must be **an unlimited collection**.
`CollectionThroughput`|This is used to create a new collection if the `ShouldCleanupOnStart` option is set to `true`.
`ShouldCleanupOnStart`|This will drop the database account and collections before the program is run, and then create new ones with the `DatabaseName`, `CollectionName` and `CollectionThroughput` values.
`ShouldCleanupOnFinish`|This will drop the database account and collections with the specified `DatabaseName` and `CollectionName` after the program is run.
`NumberOfDocumentsToImport`|This will determine the number of test vertices and edges that will be generated in the sample. This number will apply to both vertices and edges.
`NumberOfBatches`|This will determine the number of test vertices and edges that will be generated in the sample. This number will apply to both vertices and edges.
`CollectionPartitionKey`|This will be used to create the test vertices and edges, where this property will be auto-assigned. This will also be used when re-creating the database and collections if the `ShouldCleanupOnStart` option is set to `true`.

### Run the sample application

1. Add your specific database configuration parameters in `App.config`. This will be used to create a DocumentClient instance. If the database and container have not been created yet, they will be created automatically.
2. Run the application. This will call `BulkImportAsync` two times, one to import Vertices and one to import Edges. If any of the objects generates an error when they're inserted, they will be added to either `.\BadVertices.txt` or `.\BadEdges.txt`.
3. Evaluate the results by querying the graph database. If the `ShouldCleanupOnFinish` option is set to true, then the database will automatically be deleted.

## Next steps
* To learn about Nuget package details and release notes of bulk executor .NET library, see [bulk executor SDK details](sql-api-sdk-bulk-executor-dot-net.md). 
* Check out the [Performance Tips](https://docs.microsoft.com/azure/cosmos-db/bulk-executor-dot-net#performance-tips) to further optimize the usage of BulkExecutor.
* Review the [BulkExecutor.Graph Reference article](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.graph?view=azure-dotnet) for more details about the classes and methods defined in this namespace.
