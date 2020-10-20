---
title: Migrate from the change feed processor library to the Azure Cosmos DB .NET V3 SDK
description: Learn how to migrate your application from using the change feed processor library to the Azure Cosmos DB SDK V3
author: ealsur
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/17/2019
ms.author: maquaran
ms.custom: devx-track-dotnet
---

# Migrate from the change feed processor library to the Azure Cosmos DB .NET V3 SDK

This article describes the required steps to migrate an existing application's code that uses the [change feed processor library](https://github.com/Azure/azure-documentdb-changefeedprocessor-dotnet) to the [change feed](change-feed.md) feature in the latest version of the .NET SDK (also referred as .NET V3 SDK).

## Required code changes

The .NET V3 SDK has several breaking changes, the following are the key steps to migrate your application:

1. Convert the `DocumentCollectionInfo` instances into `Container` references for the monitored and leases containers.
1. Customizations that use `WithProcessorOptions` should be updated to use `WithLeaseConfiguration` and `WithPollInterval` for intervals, `WithStartTime` [for start time](how-to-configure-change-feed-start-time.md), and `WithMaxItems` to define the maximum item count.
1. Set the `processorName` on `GetChangeFeedProcessorBuilder` to match the value configured on `ChangeFeedProcessorOptions.LeasePrefix`, or use `string.Empty` otherwise.
1. The changes are no longer delivered as a `IReadOnlyList<Document>`, instead, it's a `IReadOnlyCollection<T>` where `T` is a type you need to define, there is no base item class anymore.
1. To handle the changes, you no longer need an implementation, instead you need to [define a delegate](change-feed-processor.md#implementing-the-change-feed-processor). The delegate can be a static Function or, if you need to maintain state across executions, you can create your own class and pass an instance method as delegate.

For example, if the original code to build the change feed processor looks as follows:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=ChangeFeedProcessorLibrary)]

The migrated code will look like:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=ChangeFeedProcessorMigrated)]

And the delegate, can be a static method:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=Delegate)]

## State and lease container

Similar to the change feed processor library, the change feed feature in .NET V3 SDK uses a [lease container](change-feed-processor.md#components-of-the-change-feed-processor) to store the state. However, the schemas are different.

The SDK V3 change feed processor will detect any old library state and migrate it to the new schema automatically upon the first execution of the migrated application code. 

You can safely stop the application using the old code, migrate the code to the new version, start the migrated application, and any changes that happened while the application was stopped, will be picked up and processed by the new version.

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](how-to-configure-change-feed-start-time.md)
