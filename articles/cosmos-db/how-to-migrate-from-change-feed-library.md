---
title: Migrate from the change feed processor library to the Azure Cosmos DB SDK V3
description: Learn how to migrate your application from using the change feed processor library to the Azure Cosmos DB SDK V3
author: ealsur
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/10/2019
ms.author: maquaran
---

# Migrate from the change feed processor library to the Azure Cosmos DB SDK V3

This article describes the required steps to migrate an existing application's code that uses the [library](https://github.com/Azure/azure-documentdb-changefeedprocessor-dotnet) to consume the [change feed](change-feed.md) to the SDK V3.

## Required code changes

The SDK V3 includes several breaking changes in the public APIs. The main steps to address during the migration are:

1. Convert `DocumentCollectionInfo` instances into `Container` references for the monitored and leases containers.
1. Customizations that were using `WithProcessorOptions` should be using `WithLeaseConfiguration` and `WithPollInterval` for intervals, `WithStartTime` [for start time](how-to-configure-change-feed-start-time.md), and `WithMaxItems` to define the maximum item count.
1. If specifying `ChangeFeedProcessorOptions.LeasePrefix`, use that same value as the `processorName` on `GetChangeFeedProcessorBuilder`, or use `string.Empty` otherwise.
1. The changes are no longer delivered as a `IReadOnlyList<Document>`, instead, it's a `IReadOnlyCollection<T>` where `T` is a type you need to define, there is no base item class anymore.
1. To handle the changes, you no longer need an Observer implementation, [just a delegate](change-feed-processor.md#implementing-the-change-feed-processor). This delegate can be a simple static Function or, if you need to maintain state across executions, you can create your own class and pass an instance method as delegate.

For example, if the original code is building the change feed processor like this:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=ChangeFeedProcessorLibrary)]

The migrated code would look like:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=ChangeFeedProcessorMigrated)]

And the delegate, can be simply a static method:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=Delegate)]

## State and lease container

The change feed processor uses a [lease container](change-feed-processor.md#components-of-the-change-feed-processor) to store state, and this is also valid for the library. 

The state created by the library (the lease documents) has a different schema than the SDK V3 but it will be **migrated automatically** upon the first execution of the migrated application code. This means that you can safely stop the application using the old code, migrate the code to the new version, start the migrated application, and any changes that happened while the application was stopped, will be picked up and processed by the new version.

> [!NOTE]
> Migrations from applications using the library to the SDK V3 are one-way, since the state (leases) will be migrated to the new schema that is not backward compatible.


## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](how-to-configure-change-feed-start-time.md)
