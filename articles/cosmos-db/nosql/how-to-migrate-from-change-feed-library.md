---
title: Migrate from the change feed processor library to the Azure Cosmos DB .NET V3 SDK
description: Learn how to migrate your application from using the change feed processor library to the Azure Cosmos DB SDK V3
author: ealsur
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 11/28/2023
ms.author: maquaran
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# Migrate from the change feed processor library to the Azure Cosmos DB .NET V3 SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article describes the required steps to migrate an existing application's code that uses the [change feed processor library](https://github.com/Azure/azure-documentdb-changefeedprocessor-dotnet) to the [change feed](../change-feed.md) feature in the latest version of the .NET SDK (also referred as .NET V3 SDK).

## Required code changes

The .NET V3 SDK has several breaking changes, the following are the key steps to migrate your application:

1. Convert the `DocumentCollectionInfo` instances into `Container` references for the monitored and leases containers.
1. Customizations that use `WithProcessorOptions` should be updated to use `WithLeaseConfiguration` and `WithPollInterval` for intervals, `WithStartTime` [for start time](./change-feed-processor.md#starting-time), and `WithMaxItems` to define the maximum item count.
1. Set the `processorName` on `GetChangeFeedProcessorBuilder` to match the value configured on `ChangeFeedProcessorOptions.LeasePrefix`, or use `string.Empty` otherwise.
1. The changes are no longer delivered as a `IReadOnlyList<Document>`, instead, it's a `IReadOnlyCollection<T>` where `T` is a type you need to define, there is no base item class anymore.
1. To handle the changes, you no longer need an implementation of `IChangeFeedObserver`, instead you need to [define a delegate](change-feed-processor.md#implement-the-change-feed-processor). The delegate can be a static Function or, if you need to maintain state across executions, you can create your own class and pass an instance method as delegate.

For example, if the original code to build the change feed processor looks as follows:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=ChangeFeedProcessorLibrary)]

The migrated code will look like:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=ChangeFeedProcessorMigrated)]

For the delegate, you can have a static method to receive the events. If you were consuming information from the `IChangeFeedObserverContext` you can migrate to use the `ChangeFeedProcessorContext`:

* `ChangeFeedProcessorContext.LeaseToken` can be used instead of `IChangeFeedObserverContext.PartitionKeyRangeId`
* `ChangeFeedProcessorContext.Headers` can be used instead of `IChangeFeedObserverContext.FeedResponse`
* `ChangeFeedProcessorContext.Diagnostics` contains detailed information about request latency for troubleshooting

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=Delegate)]

## Health events and observability

If previously you were using `IHealthMonitor` or you were leveraging `IChangeFeedObserver.OpenAsync` and `IChangeFeedObserver.CloseAsync`, use the [Notifications API](./change-feed-processor.md#life-cycle-notifications).

* `IChangeFeedObserver.OpenAsync` can be replaced with `WithLeaseAcquireNotification`.
* `IChangeFeedObserver.CloseAsync` can be replaced with `WithLeaseReleaseNotification`.
* `IHealthMonitor.InspectAsync` can be replaced with `WithErrorNotification`.

## State and lease container

Similar to the change feed processor library, the change feed feature in .NET V3 SDK uses a [lease container](change-feed-processor.md#components-of-the-change-feed-processor) to store the state. However, the schemas are different.

The SDK V3 change feed processor will detect any old library state and migrate it to the new schema automatically upon the first execution of the migrated application code. 

You can safely stop the application using the old code, migrate the code to the new version, start the migrated application, and any changes that happened while the application was stopped, will be picked up and processed by the new version.

## Additional resources

* [Azure Cosmos DB SDK](sdk-dotnet-v2.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](./change-feed-processor.md#starting-time)
* Trying to do capacity planning for a migration to Azure Cosmos DB?
    * If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)