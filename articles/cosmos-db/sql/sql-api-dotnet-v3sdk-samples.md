---
title: 'Azure Cosmos DB: .NET (Microsoft.Azure.Cosmos) examples for the SQL API'
description: Find the C# .NET v3 SDK examples on GitHub for common tasks by using the Azure Cosmos DB SQL API.
author: StefArroyo
ms.author: esarroyo
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: sample
ms.date: 05/02/2020
ms.custom: devx-track-dotnet

---

# Azure Cosmos DB .NET v3 SDK (Microsoft.Azure.Cosmos) examples for the SQL API

[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
> * [.NET v3 SDK Examples](sql-api-dotnet-v3sdk-samples.md)
> * [Java v4 SDK Examples](sql-api-java-sdk-samples.md)
> * [Spring Data v3 SDK Examples](sql-api-spring-data-sdk-samples.md)
> * [Node.js Examples](sql-api-nodejs-samples.md)
> * [Python Examples](sql-api-python-samples.md)
> * [.NET v2 SDK Examples (Legacy)](sql-api-dotnet-v2sdk-samples.md)
> * [Azure Code Sample Gallery](https://azure.microsoft.com/resources/samples/?sort=0&service=cosmos-db)
>
>

The [azure-cosmos-dotnet-v3](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage) GitHub repository includes the latest .NET sample solutions. You use these solutions to perform CRUD (create, read, update, and delete) and other common operations on Azure Cosmos DB resources.

If you're familiar with the previous version of the .NET SDK, you might be used to the terms collection and document. Because Azure Cosmos DB supports multiple API models, version 3.0 of the .NET SDK uses the generic terms *container* and *item*. A container can be a collection, graph, or table. An item can be a document, edge/vertex, or row, and is the content inside a container. This article provides:

* Links to the tasks in each of the example C# project files.
* Links to the related API reference content.

## Prerequisites

- Latest [!INCLUDE [cosmos-db-visual-studio](../includes/cosmos-db-visual-studio.md)]

- The [Microsoft.Azure.cosmos NuGet package](https://www.nuget.org/packages/Microsoft.Azure.cosmos/).

- An Azure subscription or free Azure Cosmos DB trial account.

  - [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
  
- You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). Your Visual Studio subscription gives you credits every month, which you can use for paid Azure services.

- [!INCLUDE [cosmos-db-emulator-docdb-api](../includes/cosmos-db-emulator-docdb-api.md)]  

> [!NOTE]
> The samples are self-contained, and set up and clean up after themselves. Each occurrence bills your subscription for one hour of usage in your container's performance tier.
> 

## Database examples

The [RunDatabaseDemo](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/DatabaseManagement/Program.cs#L65-L91) method of the sample *DatabaseManagement* project shows how to do the following tasks. To learn about Azure Cosmos DB databases before you run the following samples, see [Work with databases, containers, and items](../account-databases-containers-items.md).

| Task | API reference |
| --- | --- |
| [Create a database](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/DatabaseManagement/Program.cs#L68) |[CosmosClient.CreateDatabaseIfNotExistsAsync](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseifnotexistsasync) |
| [Read a database by ID](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/DatabaseManagement/Program.cs#L80) |[Database.ReadAsync](/dotnet/api/microsoft.azure.cosmos.database.readasync) |
| [Read all the databases for an account](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/DatabaseManagement/Program.cs#L96) |[CosmosClient.GetDatabaseQueryIterator](/dotnet/api/microsoft.azure.cosmos.cosmosclient.getdatabasequeryiterator) |
| [Delete a database](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/DatabaseManagement/Program.cs#L106) |[Database.DeleteAsync](/dotnet/api/microsoft.azure.cosmos.database.deleteasync) |

## Container examples

The [RunContainerDemo](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L69-L89) method of the sample *ContainerManagement* project shows how to do the following tasks. To learn about Azure Cosmos DB containers before you run the following samples, see [Work with databases, containers, and items](../account-databases-containers-items.md).

| Task | API reference |
| --- | --- |
| [Create a container](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L97-L107) |[Database.CreateContainerIfNotExistsAsync](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync) |
| [Create a container with custom index policy](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L161-L178) |[Database.CreateContainerIfNotExistsAsync](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync) |
| [Change configured performance of a container](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L198-L223) |[Container.ReplaceThroughputAsync](/dotnet/api/microsoft.azure.cosmos.container.replacethroughputasync) |
| [Get a container by ID](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L225-L236) |[Container.ReadContainerAsync](/dotnet/api/microsoft.azure.cosmos.container.readcontainerasync) |
| [Read all the containers in a database](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L242-L258) |[Database.GetContainerQueryIterator](/dotnet/api/microsoft.azure.cosmos.database.getcontainerqueryiterator) |
| [Delete a container](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ContainerManagement/Program.cs#L264-L270) |[Container.DeleteContainerAsync](/dotnet/api/microsoft.azure.cosmos.container.deletecontainerasync) |

## Item examples

The [RunItemsDemo](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L119-L130) method of the sample *ItemManagement* project shows how to do the following tasks. To learn about Azure Cosmos DB items before you run the following samples, see [Work with databases, containers, and items](../account-databases-containers-items.md).

| Task | API reference |
| --- | --- |
| [Create an item](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L172) |[Container.CreateItemAsync](/dotnet/api/microsoft.azure.cosmos.container.createitemasync) |
| [Read an item by ID](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L227) |[container.ReadItemAsync](/dotnet/api/microsoft.azure.cosmos.container.readitemasync) |
| [Query for items](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L344) |[container.GetItemQueryIterator](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) |
| [Replace an item](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L477) |[container.ReplaceItemAsync](/dotnet/api/microsoft.azure.cosmos.container.replaceitemasync) |
| [Upsert an item](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L574) |[container.UpsertItemAsync](/dotnet/api/microsoft.azure.cosmos.container.upsertitemasync) |
| [Delete an item](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L627) |[container.DeleteItemAsync](/dotnet/api/microsoft.azure.cosmos.container.deleteitemasync) |
| [Replace an item with conditional ETag check](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L798) |[RequestOptions.IfMatchEtag](/dotnet/api/microsoft.azure.cosmos.requestoptions.ifmatchetag) |
| [Partially update (patch) an item](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ItemManagement/Program.cs#L520) |[container.PatchItemAsync](/dotnet/api/microsoft.azure.cosmos.container.patchitemasync) |


## Indexing examples

The [RunIndexDemo](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/IndexManagement/Program.cs#L108-L122) method of the sample *IndexManagement* project shows how to do the following tasks. To learn about indexing in Azure Cosmos DB before you run the following samples, see [index policies](../index-policy.md), [index types](../index-overview.md#index-types), and [index paths](../index-policy.md#include-exclude-paths). 

| Task | API reference |
| --- | --- |
| [Exclude an item from the index](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/IndexManagement/Program.cs#L130-L186) |[IndexingDirective.Exclude](/dotnet/api/microsoft.azure.cosmos.indexingdirective) |
| [Use Lazy indexing](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/IndexManagement/Program.cs#L198-L220) |[IndexingPolicy.IndexingMode](/dotnet/api/microsoft.azure.cosmos.indexingpolicy.indexingmode) |
| [Exclude specified item paths from the index](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/IndexManagement/Program.cs#L230-L297) |[IndexingPolicy.ExcludedPaths](/dotnet/api/microsoft.azure.cosmos.indexingpolicy.excludedpaths) |

## Query examples

The [RunDemoAsync](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L76-L96) method of the sample *Queries* project shows how to do the following tasks, by using the SQL query grammar, the LINQ provider with query, and Lambda. To learn about the SQL query reference in Azure Cosmos DB before you run the following samples, see [SQL query examples for Azure Cosmos DB](./sql-query-getting-started.md).

| Task | API reference |
| --- | --- |
| [Query items from single partition](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L154-L186) |[container.GetItemQueryIterator](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) |
| [Query items from multiple partitions](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L215-L275) |[container.GetItemQueryIterator](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) |
| [Query using a SQL statement](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/Queries/Program.cs#L189-L212) |[container.GetItemQueryIterator](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) |

## Change feed examples

The [RunBasicChangeFeed](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs#L91-L119) method of the sample *ChangeFeed* project shows how to do the following tasks. To learn about change feed in Azure Cosmos DB before you run the following samples, see [Read Azure Cosmos DB change feed](read-change-feed.md) and [Change feed processor](change-feed-processor.md).

| Task | API reference |
| --- | --- |
| [Basic change feed functionality](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs#L91-L119) |[Container.GetChangeFeedProcessorBuilder](/dotnet/api/microsoft.azure.cosmos.container.getchangefeedprocessorbuilder) |
| [Read change feed from a specific time](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs#L127-L162) |[Container.GetChangeFeedProcessorBuilder](/dotnet/api/microsoft.azure.cosmos.container.getchangefeedprocessorbuilder) |
| [Read change feed from the beginning](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs#L170-L198) |[ChangeFeedProcessorBuilder.WithStartTime(DateTime)](/dotnet/api/microsoft.azure.cosmos.changefeedprocessorbuilder.withstarttime) |
| [Migrate from change feed processor to change feed in v3 SDK](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs#L256-L333) |[Container.GetChangeFeedProcessorBuilder](/dotnet/api/microsoft.azure.cosmos.container.getchangefeedprocessorbuilder) |

## Server-side programming examples

The [RunDemoAsync](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ServerSideScripts/Program.cs#L72-L102) method of the sample *ServerSideScripts* project shows how to do the following tasks. To learn about server-side programming in Azure Cosmos DB before you run the following samples, see [Stored procedures, triggers, and user-defined functions](stored-procedures-triggers-udfs.md).

| Task | API reference |
| --- | --- |
| [Create a stored procedure](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ServerSideScripts/Program.cs#L116) |[Scripts.CreateStoredProcedureAsync](/dotnet/api/microsoft.azure.cosmos.scripts.scripts.createstoredprocedureasync) |
| [Execute a stored procedure](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ServerSideScripts/Program.cs#L135) |[Scripts.ExecuteStoredProcedureAsync](/dotnet/api/microsoft.azure.cosmos.scripts.scripts.executestoredprocedureasync) |
| [Delete a stored procedure](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/ServerSideScripts/Program.cs#L351) |[Scripts.DeleteStoredProcedureAsync](/dotnet/api/microsoft.azure.cosmos.scripts.scripts.deletestoredprocedureasync) |

## Custom serialization

The [SystemTextJson](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/SystemTextJson/Program.cs) sample project shows how to use a custom serializer when you're initializing a new `CosmosClient` object. The sample also includes [a custom `CosmosSerializer` class](https://github.com/Azure/azure-cosmos-dotnet-v3/blob/master/Microsoft.Azure.Cosmos.Samples/Usage/SystemTextJson/CosmosSystemTextJsonSerializer.cs), which uses `System.Text.Json` for serialization and deserialization.

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

* If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units by using vCores or vCPUs](../convert-vcore-to-request-unit.md). 

* If you know typical request rates for your current database workload, read about [estimating request units by using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md).
