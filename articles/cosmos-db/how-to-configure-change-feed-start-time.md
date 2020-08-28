---
title: How to configure the change feed processor start time - Azure Cosmos DB
description: Learn how to configure the change feed processor to start reading from a specific date and time
author: ealsur
ms.service: cosmos-db
ms.topic: how-to
ms.date: 08/13/2019
ms.author: maquaran
ms.custom: devx-track-csharp
---

# How to configure the change feed processor start time

This article describes how you can configure the [change feed processor](./change-feed-processor.md) to start reading from a specific date and time.

## Default behavior

When a change feed processor starts the first time, it will initialize the leases container, and start its [processing life cycle](./change-feed-processor.md#processing-life-cycle). Any changes that happened in the container before the change feed processor was initialized for the first time won't be detected.

## Reading from a previous date and time

It's possible to initialize the change feed processor to read changes starting at a **specific date and time**, by passing an instance of a `DateTime` to the `WithStartTime` builder extension:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=TimeInitialization)]

The change feed processor will be initialized for that specific date and time and start reading the changes that happened after.

## Reading from the beginning

In other scenarios like data migrations or analyzing the entire history of a container, we need to read the change feed from **the beginning of that container's lifetime**. To do that, we can use `WithStartTime` on the builder extension, but passing `DateTime.MinValue.ToUniversalTime()`, which would generate the UTC representation of the minimum `DateTime` value, like so:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartFromBeginningInitialization)]

The change feed processor will be initialized and start reading changes from the beginning of the lifetime of the container.

> [!NOTE]
> These customization options only work to set up the starting point in time of the change feed processor. Once the leases container is initialized for the first time, changing them has no effect.

> [!NOTE]
> When specifying a point in time, only changes for items that currently exist in the container will be read. If an item was deleted, its history on the Change Feed is also removed.

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed processor](change-feed-processor.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
