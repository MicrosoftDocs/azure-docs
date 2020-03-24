---
title: Migrate from the bulk executor library to the Azure Cosmos DB .NET V3 SDK
description: Learn how to migrate your application from using the bulk executor library to the Azure Cosmos DB SDK V3
author: ealsur
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/24/2020
ms.author: maquaran
---

# Migrate from the bulk executor library to the Azure Cosmos DB .NET V3 SDK

This article describes the required steps to migrate an existing application's code that uses the [.NET bulk executor library](bulk-executor-dot-net.md) to the [bulk support](tutorial-sql-api-dotnet-bulk-import.md) feature in the latest version of the .NET SDK (also referred as .NET V3 SDK) and it's useful if your current production code relies on the response types provided by the bulk executor library.

## Enable bulk support

Make sure you are enabling bulk support on the `CosmosClient` instance through the [AllowBulkExecution](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmos.cosmosclientoptions.allowbulkexecution) configuration flag:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="CreateClient":::

## Create Tasks for each operation

Bulk support in the .NET SDK version 3 works by leveraging the [Task Parallel Library](https://docs.microsoft.com/dotnet/standard/parallel-programming/task-parallel-library-tpl) and grouping operations that occur concurrently. This means that there is no single method that will take your list of documents or operations as an input parameter, but rather, you need to create a Task for each operation you want to execute in bulk.

If our initial input is a list of items where each item has, for example, this schema:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="Model":::

If you want to do bulk *import* (similar to using [BulkExecutor.BulkImportAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkexecutor.bulkimportasync)) it means you need to have concurrent calls to `CreateItemAsync` with each item value. For example:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="BulkImport":::

If you want to do bulk *update* (similar to using [BulkExecutor.BulkUpdateAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkexecutor.bulkupdateasync)), it means you need to have concurrent calls to `ReplaceItemAsync` after updating the item value. For example:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="BulkUpdate":::

And if you want to do bulk *delete* (similar to using [BulkExecutor.BulkDeleteAsync](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkexecutor.bulkdeleteasync)), it means you need to have concurrent calls to `DeleteItemAsync`, with the `id` and partition key of each item. For example:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="BulkDelete":::

## Capture task result state

In the previous code examples, we are creating a concurrent list of Tasks, and on each of them, calling `CaptureOperationResponse`. This is an extension that lets us maintain a *similar response schema* as BulkExecutor, by capturing any errors and tracking the [request units usage](request-units.md).

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="CaptureOperationResult":::

Where the `OperationResponse` is declared as:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="OperationResponse":::

## Execute operations concurrently

With the list of Tasks defined, all we need to do is wait until they are all completed, which would define the *scope* of our bulk operation. This is easily done by:

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="WhenAll":::

## Capture statistics

The code above not only waits until all operations are complete, but it also captures the time spent and calculates the required statistics. These statistics are similar to that of the bulk executor library's [BulkImportResponse](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.bulkexecutor.bulkimport.bulkimportresponse).

   :::code language="csharp" source="~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration/Program.cs" id="ResponseType":::

The `BulkOperationResponse` will contain:

1. The total time taken to process the list of operations through bulk support.
1. The number of successful operations.
1. The total of request units consumed.
1. If any failures happened, a list of tuples containing the captured Exception and the associated item for logging and identification purposes.

## Performance improvements

As with other operations with the .NET SDK, leveraging the stream APIs will be better performance-wise because it would avoid any unnecessary serialization, but it is only possible if the nature of the data we work with matches that of a stream of bytes (for example, file streams). In those cases, using the `CreateItemStreamAsync`, `ReplaceItemStreamAsync`, or `DeleteItemStreamAsync` APIs and working with `ResponseMessage` (instead of `ItemResponse`) will increase the throughput that can be achieved.

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Complete migration source code on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/BulkExecutorMigration)
* [Additional bulk samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/BulkSupport)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](how-to-configure-change-feed-start-time.md)
