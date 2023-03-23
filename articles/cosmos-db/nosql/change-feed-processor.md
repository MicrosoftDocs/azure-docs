---
title: Change feed processor in Azure Cosmos DB 
description: Learn how to use the Azure Cosmos DB change feed processor to read the change feed, the components of the change feed processor
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: conceptual
ms.date: 04/05/2022
ms.custom: devx-track-csharp
---

# Change feed processor in Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The change feed processor is part of the Azure Cosmos DB [.NET V3](https://github.com/Azure/azure-cosmos-dotnet-v3) and [Java V4](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos) SDKs. It simplifies the process of reading the change feed and distributes the event processing across multiple consumers effectively.

The main benefit of change feed processor library is its fault-tolerant behavior that assures an "at-least-once" delivery of all the events in the change feed.

## Components of the change feed processor

There are four main components of implementing the change feed processor:

1. **The monitored container:** The monitored container has the data from which the change feed is generated. Any inserts and updates to the monitored container are reflected in the change feed of the container.

1. **The lease container:** The lease container acts as a state storage and coordinates processing the change feed across multiple workers. The lease container can be stored in the same account as the monitored container or in a separate account.

1. **The compute instance**: A compute instance hosts the change feed processor to listen for changes. Depending on the platform, it could be represented by a VM, a kubernetes pod, an Azure App Service instance, an actual physical machine. It has a unique identifier referenced as the *instance name* throughout this article.

1. **The delegate:** The delegate is the code that defines what you, the developer, want to do with each batch of changes that the change feed processor reads.

To further understand how these four elements of change feed processor work together, let's look at an example in the following diagram. The monitored container stores documents and uses 'City' as the partition key. We see that the partition key values are distributed in ranges (each range representing a [physical partition](../partitioning-overview.md#physical-partitions)) that contain items.
There are two compute instances and the change feed processor is assigning different ranges to each instance to maximize compute distribution, each instance has a unique and different name.
Each range is being read in parallel and its progress is maintained separately from other ranges in the lease container through a *lease* document. The combination of the leases represents the current state of the change feed processor.

:::image type="content" source="./media/change-feed-processor/changefeedprocessor.png" alt-text="Change feed processor example" border="false":::

## Implementing the change feed processor

### [.NET](#tab/dotnet)

The point of entry is always the monitored container, from a `Container` instance you call `GetChangeFeedProcessorBuilder`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-change-feed-processor/src/Program.cs?name=DefineProcessor)]

Where the first parameter is a distinct name that describes the goal of this processor and the second name is the delegate implementation that will handle changes. 

An example of a delegate would be:


[!code-csharp[Main](~/samples-cosmosdb-dotnet-change-feed-processor/src/Program.cs?name=Delegate)]

Afterwards, you define the compute instance name or unique identifier with `WithInstanceName`, this should be unique and different in each compute instance you are deploying, and finally which is the container to maintain the lease state with `WithLeaseContainer`.

Calling `Build` will give you the processor instance that you can start by calling `StartAsync`.

## Processing life cycle

The normal life cycle of a host instance is:

1. Read the change feed.
1. If there are no changes, sleep for a predefined amount of time (customizable with `WithPollInterval` in the Builder) and go to #1.
1. If there are changes, send them to the **delegate**.
1. When the delegate finishes processing the changes **successfully**, update the lease store with the latest processed point in time and go to #1.

## Error handling

The change feed processor is resilient to user code errors. That means that if your delegate implementation has an unhandled exception (step #4), the thread processing that particular batch of changes will be stopped, and a new thread will be created. The new thread will check which was the latest point in time the lease store has for that range of partition key values, and restart from there, effectively sending the same batch of changes to the delegate. This behavior will continue until your delegate processes the changes correctly and it's the reason the change feed processor has an "at least once" guarantee.

> [!NOTE]
> There is only one scenario where a batch of changes will not be retried. If the failure happens on the first ever delegate execution, the lease store has no previous saved state to be used on the retry. On those cases, the retry would use the [initial starting configuration](#starting-time), which might or might not include the last batch.

To prevent your change feed processor from getting "stuck" continuously retrying the same batch of changes, you should add logic in your delegate code to write documents, upon exception, to an errored-message queue. This design ensures that you can keep track of unprocessed changes while still being able to continue to process future changes. The errored-message queue might be another Azure Cosmos DB container. The exact data store does not matter, simply that the unprocessed changes are persisted.

In addition, you can use the [change feed estimator](how-to-use-change-feed-estimator.md) to monitor the progress of your change feed processor instances as they read the change feed or use the [life cycle notifications](#life-cycle-notifications) to detect underlying failures.

## Life-cycle notifications

The change feed processor lets you hook to relevant events in its [life cycle](#processing-life-cycle), you can choose to be notified to one or all of them. The recommendation is to at least register the error notification:

* Register a handler for `WithLeaseAcquireNotification` to be notified when the current host acquires a lease to start processing it.
* Register a handler for `WithLeaseReleaseNotification` to be notified when the current host releases a lease and stops processing it.
* Register a handler for `WithErrorNotification` to be notified when the current host encounters an exception during processing, being able to distinguish if the source is the user delegate (unhandled exception) or an error the processor is encountering trying to access the monitored container (for example, networking issues).

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartWithNotifications)]

## Deployment unit

A single change feed processor deployment unit consists of one or more compute instances with the same `processorName` and lease container configuration but different instance name each. You can have many deployment units where each one has a different business flow for the changes and each deployment unit consisting of one or more instances.

For example, you might have one deployment unit that triggers an external API anytime there is a change in your container. Another deployment unit might move data, in real time, each time there is a change. When a change happens in your monitored container, all your deployment units will get notified.

## Dynamic scaling

As mentioned before, within a deployment unit you can have one or more compute instances. To take advantage of the compute distribution within the deployment unit, the only key requirements are:

1. All instances should have the same lease container configuration.
1. All instances should have the same `processorName`.
1. Each instance needs to have a different instance name (`WithInstanceName`).

If these three conditions apply, then the change feed processor will distribute all the leases in the lease container across all running instances of that deployment unit and parallelize compute using an equal distribution algorithm. One lease can only be owned by one instance at a given time, so the number of instances should not be greater than the number of leases.

The number of instances can grow and shrink, and the change feed processor will dynamically adjust the load by redistributing accordingly.

Moreover, the change feed processor can dynamically adjust to containers scale due to throughput or storage increases. When your container grows, the change feed processor transparently handles these scenarios by dynamically increasing the leases and distributing the new leases among existing instances.

## Change feed and provisioned throughput

Change feed read operations on the monitored container will consume [request units](../request-units.md). Make sure your monitored container is not experiencing [throttling](troubleshoot-request-rate-too-large.md), otherwise you will experience delays in receiving change feed events on your processors.

Operations on the lease container (updating and maintaining state) consume [request units](../request-units.md). The higher the number of instances using the same lease container, the higher the potential request units consumption will be. Make sure your lease container is not experiencing [throttling](troubleshoot-request-rate-too-large.md), otherwise you will experience delays in receiving change feed events on your processors, in some cases where throttling is high, the processors might stop processing completely.

## Starting time

By default, when a change feed processor starts the first time, it will initialize the leases container, and start its [processing life cycle](#processing-life-cycle). Any changes that happened in the monitored container before the change feed processor was initialized for the first time won't be detected.

### Reading from a previous date and time

It's possible to initialize the change feed processor to read changes starting at a **specific date and time**, by passing an instance of a `DateTime` to the `WithStartTime` builder extension:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=TimeInitialization)]

The change feed processor will be initialized for that specific date and time and start reading the changes that happened after.

> [!NOTE]
> Starting the change feed processor at a specific date and time is not supported in multi-region write accounts.

### Reading from the beginning

In other scenarios like data migrations or analyzing the entire history of a container, we need to read the change feed from **the beginning of that container's lifetime**. To do that, we can use `WithStartTime` on the builder extension, but passing `DateTime.MinValue.ToUniversalTime()`, which would generate the UTC representation of the minimum `DateTime` value, like so:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartFromBeginningInitialization)]

The change feed processor will be initialized and start reading changes from the beginning of the lifetime of the container.

> [!NOTE]
> These customization options only work to setup the starting point in time of the change feed processor. Once the leases container is initialized for the first time, changing them has no effect.

### [Java](#tab/java)

An example of a delegate implementation would be:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=Delegate)]

>[!NOTE] 
> In the above we pass a variable `options` of type `ChangeFeedProcessorOptions`, which can be used to set various values including `setStartFromBeginning`:
> [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=ChangeFeedProcessorOptions)]

We assign this to a `changeFeedProcessorInstance`, passing parameters of compute instance name (`hostName`), the monitored container (here called `feedContainer`) and the `leaseContainer`. We then start the change feed processor:

   [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=StartChangeFeedProcessor)]

>[!NOTE]
> The above code snippets are taken from a sample in GitHub, which you can find [here](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java).

## Processing life cycle

The normal life cycle of a host instance is:

1. Read the change feed.
1. If there are no changes, sleep for a predefined amount of time (customizable with `options.setFeedPollDelay` in the Builder) and go to #1.
1. If there are changes, send them to the **delegate**.
1. When the delegate finishes processing the changes **successfully**, update the lease store with the latest processed point in time and go to #1.

## Error handling

The change feed processor is resilient to user code errors. That means that if your delegate implementation has an unhandled exception (step #4), the thread processing that particular batch of changes will be stopped, and a new thread will be created. The new thread will check which was the latest point in time the lease store has for that range of partition key values, and restart from there, effectively sending the same batch of changes to the delegate. This behavior will continue until your delegate processes the changes correctly and it's the reason the change feed processor has an "at least once" guarantee.

> [!NOTE]
> There is only one scenario where a batch of changes will not be retried. If the failure happens on the first ever delegate execution, the lease store has no previous saved state to be used on the retry. On those cases, the retry would use the [initial starting configuration](#starting-time), which might or might not include the last batch.

To prevent your change feed processor from getting "stuck" continuously retrying the same batch of changes, you should add logic in your delegate code to write documents, upon exception, to an errored-message. This design ensures that you can keep track of unprocessed changes while still being able to continue to process future changes. The errored-message might be another Azure Cosmos DB container. The exact data store does not matter, simply that the unprocessed changes are persisted.

In addition, you can use the [change feed estimator](how-to-use-change-feed-estimator.md) to monitor the progress of your change feed processor instances as they read the change feed.

<!-- ## Life-cycle notifications

The change feed processor lets you hook to relevant events in its [life cycle](#processing-life-cycle), you can choose to be notified to one or all of them. The recommendation is to at least register the error notification:

* Register a handler for `WithLeaseAcquireNotification` to be notified when the current host acquires a lease to start processing it.
* Register a handler for `WithLeaseReleaseNotification` to be notified when the current host releases a lease and stops processing it.
* Register a handler for `WithErrorNotification` to be notified when the current host encounters an exception during processing, being able to distinguish if the source is the user delegate (unhandled exception) or an error the processor is encountering trying to access the monitored container (for example, networking issues).

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartWithNotifications)] -->

## Deployment unit

A single change feed processor deployment unit consists of one or more compute instances with the same lease container configuration, the same `leasePrefix`, but different `hostName` name each. You can have many deployment units where each one has a different business flow for the changes and each deployment unit consisting of one or more instances.

For example, you might have one deployment unit that triggers an external API anytime there is a change in your container. Another deployment unit might move data, in real time, each time there is a change. When a change happens in your monitored container, all your deployment units will get notified.

## Dynamic scaling

As mentioned before, within a deployment unit you can have one or more compute instances. To take advantage of the compute distribution within the deployment unit, the only key requirements are:

1. All instances should have the same lease container configuration.
1. All instances should have the same value set in `options.setLeasePrefix` (or none set at all).
1. Each instance needs to have a different `hostName`.

If these three conditions apply, then the change feed processor will distribute all the leases in the lease container across all running instances of that deployment unit and parallelize compute using an equal distribution algorithm. One lease can only be owned by one instance at a given time, so the number of instances should not be greater than the number of leases.

The number of instances can grow and shrink, and the change feed processor will dynamically adjust the load by redistributing accordingly. Deployment units can share the same lease container, but they should each have a different `leasePrefix`.

Moreover, the change feed processor can dynamically adjust to containers scale due to throughput or storage increases. When your container grows, the change feed processor transparently handles these scenarios by dynamically increasing the leases and distributing the new leases among existing instances.

## Change feed and provisioned throughput

Change feed read operations on the monitored container will consume [request units](../request-units.md). Make sure your monitored container is not experiencing [throttling](troubleshoot-request-rate-too-large.md), otherwise you will experience delays in receiving change feed events on your processors.

Operations on the lease container (updating and maintaining state) consume [request units](../request-units.md). The higher the number of instances using the same lease container, the higher the potential request units consumption will be. Make sure your lease container is not experiencing [throttling](troubleshoot-request-rate-too-large.md), otherwise you will experience delays in receiving change feed events on your processors, in some cases where throttling is high, the processors might stop processing completely.

## Starting time

By default, when a change feed processor starts the first time, it will initialize the leases container, and start its [processing life cycle](#processing-life-cycle). Any changes that happened in the monitored container before the change feed processor was initialized for the first time won't be detected.

### Reading from a previous date and time

It's possible to initialize the change feed processor to read changes starting at a **specific date and time**, by setting `setStartTime` in `options`. The change feed processor will be initialized for that specific date and time and start reading the changes that happened after.

> [!NOTE]
> Starting the change feed processor at a specific date and time is not supported in multi-region write accounts.

### Reading from the beginning

In our above sample, we set `setStartFromBeginning` to `false`, which is the same as the default value. In other scenarios like data migrations or analyzing the entire history of a container, we need to read the change feed from **the beginning of that container's lifetime**. To do that, we can set `setStartFromBeginning` to `true`. The change feed processor will be initialized and start reading changes from the beginning of the lifetime of the container.

> [!NOTE]
> These customization options only work to setup the starting point in time of the change feed processor. Once the leases container is initialized for the first time, changing them has no effect.

---

## Sharing the lease container

You can share the lease container across multiple [deployment units](#deployment-unit), each deployment unit would be listening to a different monitored container or have a different `processorName`. With this configuration, each deployment unit would maintain an independent state on the lease container. Review the [request unit consumption on the lease container](#change-feed-and-provisioned-throughput) to make sure the provisioned throughput is enough for all the deployment units.

## Where to host the change feed processor

The change feed processor can be hosted in any platform that supports long running processes or tasks:

* A continuous running [Azure WebJob](/training/modules/run-web-app-background-task-with-webjobs/).
* A process in an [Azure Virtual Machine](/azure/architecture/best-practices/background-jobs#azure-virtual-machines).
* A background job in [Azure Kubernetes Service](/azure/architecture/best-practices/background-jobs#azure-kubernetes-service).
* A serverless function in [Azure Functions](/azure/architecture/best-practices/background-jobs#azure-functions).
* An [ASP.NET hosted service](/aspnet/core/fundamentals/host/hosted-services).

While change feed processor can run in short lived environments, because the lease container maintains the state, the startup cycle of these environments will add delay to receiving the notifications (due to the overhead of starting the processor every time the environment is started).

## Additional resources

* [Azure Cosmos DB SDK](sdk-dotnet-v2.md)
* [Complete sample application on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)
* [Additional usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Azure Cosmos DB workshop labs for change feed processor](https://azurecosmosdb.github.io/labs/dotnet/labs/08-change_feed_with_azure_functions.html#consume-cosmos-db-change-feed-via-the-change-feed-processor)

## Next steps

You can now proceed to learn more about change feed processor in the following articles:

* [Overview of change feed](../change-feed.md)
* [Change feed pull model](change-feed-pull-model.md)
* [How to migrate from the change feed processor library](how-to-migrate-from-change-feed-library.md)
* [Using the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](#starting-time)
