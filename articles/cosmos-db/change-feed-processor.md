---
title: Change feed processor library in Azure Cosmos DB 
description: Learn how to use the Azure Cosmos DB change feed processor library to read the change feed, the components of the change feed processor
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 12/03/2019
ms.reviewer: sngun
---

# Change feed processor in Azure Cosmos DB 

The change feed processor is part of the [Azure Cosmos DB SDK V3](https://github.com/Azure/azure-cosmos-dotnet-v3). It simplifies the process of reading the change feed and distribute the event processing across multiple consumers effectively.

The main benefit of change feed processor library is its fault-tolerant behavior that assures an "at-least-once" delivery of all the events in the change feed.

## Components of the change feed processor

There are four main components of implementing the change feed processor: 

1. **The monitored container:** The monitored container has the data from which the change feed is generated. Any inserts and updates to the monitored container are reflected in the change feed of the container.

1. **The lease container:** The lease container acts as a state storage and coordinates processing the change feed across multiple workers. The lease container can be stored in the same account as the monitored container or in a separate account. 

1. **The host:** A host is an application instance that uses the change feed processor to listen for changes. Multiple instances with the same lease configuration can run in parallel, but each instance should have a different **instance name**. 

1. **The delegate:** The delegate is the code that defines what you, the developer, want to do with each batch of changes that the change feed processor reads. 

To further understand how these four elements of change feed processor work together, let's look at an example in the following diagram. The monitored container stores documents and uses 'City' as the partition key. We see that the partition key values are distributed in ranges that contain items. 
There are two host instances and the change feed processor is assigning different ranges of partition key values to each instance to maximize compute distribution. 
Each range is being read in parallel and its progress is maintained separately from other ranges in the lease container.

![Change feed processor example](./media/change-feed-processor/changefeedprocessor.png)

## Implementing the change feed processor

The point of entry is always the monitored container, from a `Container` instance you call `GetChangeFeedProcessorBuilder`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-change-feed-processor/src/Program.cs?name=DefineProcessor)]

Where the first parameter is a distinct name that describes the goal of this processor and the second name is the delegate implementation that will handle changes. 

An example of a delegate would be:


[!code-csharp[Main](~/samples-cosmosdb-dotnet-change-feed-processor/src/Program.cs?name=Delegate)]

Finally you define a name for this processor instance with `WithInstanceName` and which is the container to maintain the lease state with `WithLeaseContainer`.

Calling `Build` will give you the processor instance that you can start by calling `StartAsync`.

## Processing life cycle

The normal life cycle of a host instance is:

1. Read the change feed.
1. If there are no changes, sleep for a predefined amount of time (customizable with `WithPollInterval` in the Builder) and go to #1.
1. If there are changes, send them to the **delegate**.
1. When the delegate finishes processing the changes **successfully**, update the lease store with the latest processed point in time and go to #1.

## Error handling

The change feed processor is resilient to user code errors. That means that if your delegate implementation has an unhandled exception (step #4), the thread processing that particular batch of changes will be stopped, and a new thread will be created. The new thread will check which was the latest point in time the lease store has for that range of partition key values, and restart from there, effectively sending the same batch of changes to the delegate. This behavior will continue until your delegate processes the changes correctly and it's the reason the change feed processor has an "at least once" guarantee, because if the delegate code throws, it will retry that batch.

## Dynamic scaling

As mentioned during the introduction, the change feed processor can distribute compute across multiple instances automatically. You can deploy multiple instances of your application using the change feed processor and take advantage of it, the only key requirements are:

1. All instances should have the same lease container configuration.
1. All instances should have the same workflow name.
1. Each instance needs to have a different instance name (`WithInstanceName`).

If these three conditions apply, then the change feed processor will, using an equal distribution algorithm, distribute all the leases in the lease container across all running instances and parallelize compute. One lease can only be owned by one instance at a given time, so the maximum number of instances equals to the number of leases.

The number of instances can grow and shrink, and the change feed processor will dynamically adjust the load by redistributing accordingly.

Moreover, the change feed processor can dynamically adjust to containers scale due to throughput or storage increases. When your container grows, the change feed processor transparently handles these scenarios by dynamically increasing the leases and distributing the new leases among existing instances.

## Change feed and provisioned throughput

You are charged for RUs consumed, since data movement in and out of Cosmos containers always consumes RUs. You are charged for RUs consumed by the lease container.

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Additional samples on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed](change-feed.md)
* [How to migrate from the change feed processor library](how-to-migrate-from-change-feed-library.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](how-to-configure-change-feed-start-time.md)
