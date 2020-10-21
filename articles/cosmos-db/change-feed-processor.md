---
title: Change feed processor in Azure Cosmos DB 
description: Learn how to use the Azure Cosmos DB change feed processor to read the change feed, the components of the change feed processor
author: timsander1
ms.author: tisande
ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 10/12/2020
ms.reviewer: sngun
ms.custom: devx-track-csharp
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

:::image type="content" source="./media/change-feed-processor/changefeedprocessor.png" alt-text="Change feed processor example" border="false":::

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

The change feed processor is resilient to user code errors. That means that if your delegate implementation has an unhandled exception (step #4), the thread processing that particular batch of changes will be stopped, and a new thread will be created. The new thread will check which was the latest point in time the lease store has for that range of partition key values, and restart from there, effectively sending the same batch of changes to the delegate. This behavior will continue until your delegate processes the changes correctly and it's the reason the change feed processor has an "at least once" guarantee, because if the delegate code throws an exception, it will retry that batch.

To prevent your change feed processor from getting "stuck" continuously retrying the same batch of changes, you should add logic in your delegate code to write documents, upon exception, to a dead-letter queue. This design ensures that you can keep track of unprocessed changes while still being able to continue to process future changes. The dead-letter queue might be another Cosmos container. The exact data store does not matter, simply that the unprocessed changes are persisted.

In addition, you can use the [change feed estimator](how-to-use-change-feed-estimator.md) to monitor the progress of your change feed processor instances as they read the change feed. You can use this estimation to understand if your change feed processor is "stuck" or lagging behind due to available resources like CPU, memory, and network bandwidth.

## Deployment unit

A single change feed processor deployment unit consists of one or more instances with the same `processorName` and lease container configuration. You can have many deployment units where each one has a different business flow for the changes and each deployment unit consisting of one or more instances. 

For example, you might have one deployment unit that triggers an external API anytime there is a change in your container. Another deployment unit might move data, in real time, each time there is a change. When a change happens in your monitored container, all your deployment units will get notified.

## Dynamic scaling

As mentioned before, within a deployment unit you can have one or more instances. To take advantage of the compute distribution within the deployment unit, the only key requirements are:

1. All instances should have the same lease container configuration.
1. All instances should have the same `processorName`.
1. Each instance needs to have a different instance name (`WithInstanceName`).

If these three conditions apply, then the change feed processor will, using an equal distribution algorithm, distribute all the leases in the lease container across all running instances of that deployment unit and parallelize compute. One lease can only be owned by one instance at a given time, so the maximum number of instances equals to the number of leases.

The number of instances can grow and shrink, and the change feed processor will dynamically adjust the load by redistributing accordingly.

Moreover, the change feed processor can dynamically adjust to containers scale due to throughput or storage increases. When your container grows, the change feed processor transparently handles these scenarios by dynamically increasing the leases and distributing the new leases among existing instances.

## Change feed and provisioned throughput

Change feed read operations on the monitored container will consume RUs. 

Operations on the lease container consume RUs. The higher the number of instances using the same lease container, the higher the potential RU consumption will be. Remember to monitor your RU consumption on the leases container if you decide to scale and increment the number of instances.

## Starting time

By default, when a change feed processor starts the first time, it will initialize the leases container, and start its [processing life cycle](#processing-life-cycle). Any changes that happened in the monitored container before the change feed processor was initialized for the first time won't be detected.

### Reading from a previous date and time

It's possible to initialize the change feed processor to read changes starting at a **specific date and time**, by passing an instance of a `DateTime` to the `WithStartTime` builder extension:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=TimeInitialization)]

The change feed processor will be initialized for that specific date and time and start reading the changes that happened after.

### Reading from the beginning

In other scenarios like data migrations or analyzing the entire history of a container, we need to read the change feed from **the beginning of that container's lifetime**. To do that, we can use `WithStartTime` on the builder extension, but passing `DateTime.MinValue.ToUniversalTime()`, which would generate the UTC representation of the minimum `DateTime` value, like so:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartFromBeginningInitialization)]

The change feed processor will be initialized and start reading changes from the beginning of the lifetime of the container.

> [!NOTE]
> These customization options only work to setup the starting point in time of the change feed processor. Once the leases container is initialized for the first time, changing them has no effect.

## Where to host the change feed processor

The change feed processor can be hosted in any platform that supports long running processes or tasks:

* A continuous running [Azure WebJob](https://docs.microsoft.com/learn/modules/run-web-app-background-task-with-webjobs/).
* A process in an [Azure Virtual Machine](https://docs.microsoft.com/azure/architecture/best-practices/background-jobs#azure-virtual-machines).
* A background job in [Azure Kubernetes Service](https://docs.microsoft.com/azure/architecture/best-practices/background-jobs#azure-kubernetes-service).
* An [ASP.NET hosted service](https://docs.microsoft.com/aspnet/core/fundamentals/host/hosted-services).

While change feed processor can run in short lived environments, because the lease container maintains the state, the startup cycle of these environments will add delay to receiving the notifications (due to the overhead of starting the processor every time the environment is started).

## Additional resources

* [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md)
* [Complete sample application on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)
* [Additional usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Cosmos DB workshop labs for change feed processor](https://azurecosmosdb.github.io/labs/dotnet/labs/08-change_feed_with_azure_functions.html#consume-cosmos-db-change-feed-via-the-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed](change-feed.md)
* [Change feed pull model](change-feed-pull-model.md)
* [How to migrate from the change feed processor library](how-to-migrate-from-change-feed-library.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](how-to-configure-change-feed-start-time.md)
