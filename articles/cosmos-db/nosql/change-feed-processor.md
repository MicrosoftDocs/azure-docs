---
title: Change feed processor in Azure Cosmos DB 
description: Learn how to use the Azure Cosmos DB change feed processor to read the change feed, and learn about the components of the change feed processor.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: conceptual
ms.date: 05/09/2023
ms.custom: devx-track-csharp, build-2023
---

# Change feed processor in Azure Cosmos DB

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The change feed processor is part of the Azure Cosmos DB [.NET V3](https://github.com/Azure/azure-cosmos-dotnet-v3) and [Java V4](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos) SDKs. It simplifies the process of reading the change feed and distributes the event processing across multiple consumers effectively.

The main benefit of using the change feed processor is its fault-tolerant design, which assures an "at-least-once" delivery of all the events in the change feed.

## Components of the change feed processor

The change feed processor has four main components:

* **The monitored container**: The monitored container has the data from which the change feed is generated. Any inserts and updates to the monitored container are reflected in the change feed of the container.

* **The lease container**: The lease container acts as state storage and coordinates processing the change feed across multiple workers. The lease container can be stored in the same account as the monitored container or in a separate account.

* **The compute instance**: A compute instance hosts the change feed processor to listen for changes. Depending on the platform, it might be represented by a virtual machine (VM), a kubernetes pod, an Azure App Service instance, or an actual physical machine. The compute instance has a unique identifier that's called the *instance name* throughout this article.

* **The delegate**: The delegate is the code that defines what you, the developer, want to do with each batch of changes that the change feed processor reads.

To further understand how these four elements of the change feed processor work together, let's look at an example in the following diagram. The monitored container stores items and uses 'City' as the partition key. The partition key values are distributed in ranges (each range represents a [physical partition](../partitioning-overview.md#physical-partitions)) that contain items.

The diagram shows two compute instances, and the change feed processor assigns different ranges to each instance to maximize compute distribution. Each instance has a different, unique name.

Each range is read in parallel. A range's progress is maintained separately from other ranges in the lease container through a *lease* document. The combination of the leases represents the current state of the change feed processor.

:::image type="content" source="./media/change-feed-processor/changefeedprocessor.png" alt-text="Change feed processor example" border="false":::

## Implement the change feed processor

### [.NET](#tab/dotnet)

The change feed processor in .NET is currently available only for [latest version mode](change-feed-modes.md#latest-version-change-feed-mode). The point of entry is always the monitored container. In a `Container` instance, you call `GetChangeFeedProcessorBuilder`:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-change-feed-processor/src/Program.cs?name=DefineProcessor)]

The first parameter is a distinct name that describes the goal of this processor. The second name is the delegate implementation that handles changes.

Here's an example of a delegate:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-change-feed-processor/src/Program.cs?name=Delegate)]

Afterward, you define the compute instance name or unique identifier by using `WithInstanceName`. The compute instance name should be unique and different for each compute instance you're deploying. You set the container to maintain the lease state by using `WithLeaseContainer`.

Calling `Build` gives you the processor instance that you can start by calling `StartAsync`.

## Processing life cycle

The normal life cycle of a host instance is:

1. Read the change feed.
1. If there are no changes, sleep for a predefined amount of time (customizable by using `WithPollInterval` in the Builder) and go to #1.
1. If there are changes, send them to the *delegate*.
1. When the delegate finishes processing the changes *successfully*, update the lease store with the latest processed point in time and go to #1.

## Error handling

The change feed processor is resilient to user code errors. If your delegate implementation has an unhandled exception (step #4), the thread that is processing that particular batch of changes stops, and a new thread is eventually created. The new thread checks the latest point in time that the lease store has saved for that range of partition key values. The new thread restarts from there, effectively sending the same batch of changes to the delegate. This behavior continues until your delegate processes the changes correctly, and it's the reason the change feed processor has an "at least once" guarantee. Consuming the change feed in an Eventual consistency level can also result in duplicate events in between subsequent change feed read operations. For example, the last event of one read operation could appear as the first event of the next operation.

> [!NOTE]
> In only one scenario, a batch of changes is not retried. If the failure happens on the first ever delegate execution, the lease store has no previous saved state to be used on the retry. In those cases, the retry uses the [initial starting configuration](#starting-time), which might or might not include the last batch.

To prevent your change feed processor from getting "stuck" continuously retrying the same batch of changes, you should add logic in your delegate code to write documents, upon exception, to an errored-message queue. This design ensures that you can keep track of unprocessed changes while still being able to continue to process future changes. The errored-message queue might be another Azure Cosmos DB container. The exact data store doesn't matter. You simply want the unprocessed changes to be persisted.

You also can use the [change feed estimator](how-to-use-change-feed-estimator.md) to monitor the progress of your change feed processor instances as they read the change feed, or you can use [life cycle notifications](#life-cycle-notifications) to detect underlying failures.

## Life cycle notifications

You can connect the change feed processor to any relevant event in its [life cycle](#processing-life-cycle). You can choose to be notified to one or all of them. The recommendation is to at least register the error notification:

* Register a handler for `WithLeaseAcquireNotification` to be notified when the current host acquires a lease to start processing it.
* Register a handler for `WithLeaseReleaseNotification` to be notified when the current host releases a lease and stops processing it.
* Register a handler for `WithErrorNotification` to be notified when the current host encounters an exception during processing. You need to be able to distinguish whether the source is the user delegate (an unhandled exception) or an error that the processor encounters when it tries to access the monitored container (for example, networking issues).

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartWithNotifications)]

## Deployment unit

A single change feed processor deployment unit consists of one or more compute instances that have the same value for `processorName` and the same lease container configuration, but different instance names. You can have many deployment units in which each unit has a different business flow for the changes and each deployment unit consists of one or more instances.

For example, you might have one deployment unit that triggers an external API each time there's a change in your container. Another deployment unit might move data in real time each time there's a change. When a change happens in your monitored container, all your deployment units are notified.

## Dynamic scaling

As mentioned earlier, within a deployment unit, you can have one or more compute instances. To take advantage of the compute distribution within the deployment unit, the only key requirements are that:

* All instances should have the same lease container configuration.
* All instances should have the same value for `processorName`.
* Each instance needs to have a different instance name (`WithInstanceName`).

If these three conditions apply, then the change feed processor distributes all the leases that are in the lease container across all running instances of that deployment unit, and it parallelizes compute by using an equal-distribution algorithm. A lease is owned by one instance at any time, so the number of instances shouldn't be greater than the number of leases.

The number of instances can grow and shrink. The change feed processor dynamically adjusts the load by redistributing accordingly.

Moreover, the change feed processor can dynamically adjust a container's scale if the container's throughput or storage increases. When your container grows, the change feed processor transparently handles the scenario by dynamically increasing the leases and distributing the new leases among existing instances.

## Starting time

By default, when a change feed processor starts for the first time, it initializes the leases container and start its [processing life cycle](#processing-life-cycle). Any changes that happened in the monitored container before the change feed processor is initialized for the first time aren't detected.

### Reading from a previous date and time

It's possible to initialize the change feed processor to read changes starting at a *specific date and time* by passing an instance of `DateTime` to the `WithStartTime` builder extension:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=TimeInitialization)]

The change feed processor is initialized for that specific date and time, and it starts to read the changes that happened afterward.

### Reading from the beginning

In other scenarios, like in data migrations or if you're analyzing the entire history of a container, you need to read the change feed from *the beginning of that container's lifetime*. You can use `WithStartTime` on the builder extension, but pass `DateTime.MinValue.ToUniversalTime()`, which generates the UTC representation of the minimum `DateTime` value like in this example:

[!code-csharp[Main](~/samples-cosmosdb-dotnet-v3/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed/Program.cs?name=StartFromBeginningInitialization)]

The change feed processor is initialized, and it starts reading changes from the beginning of the lifetime of the container.

> [!NOTE]
> These customization options work only to set up the starting point in time of the change feed processor. After the lease container is initialized for the first time, changing these options has no effect.

### [Java](#tab/java)

For full working samples, see [here](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/tree/main/src/main/java/com/azure/cosmos/examples/changefeed). An example of a delegate implementation when reading the change feed in [latest version mode](change-feed-modes.md#latest-version-change-feed-mode) is:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=Delegate)]

>[!NOTE]
> In this example, you pass a variable `options` of type `ChangeFeedProcessorOptions`, which can be used to set various values, including `setStartFromBeginning`:
>
> [!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=ChangeFeedProcessorOptions)]

The delegate implementation for reading the change feed in [all versions and deletes mode](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview) is similar, but instead of calling `.handleChanges()`, call `.handleAllVersionsAndDeletesChanges()`. All versions and deletes mode is in preview and is available in Java SDK version >= `4.42.0`.

Here's an example:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessorForAllVersionsAndDeletesMode.java?name=Delegate)]

In either change feed mode, you can assign it to `changeFeedProcessorInstance` and pass the parameters of compute instance name (`hostName`), the monitored container (here called `feedContainer`), and the `leaseContainer`. Then start the change feed processor:

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java?name=StartChangeFeedProcessor)]

>[!NOTE]
> The preceding code snippets are taken from samples in GitHub. You can get the sample for [latest version mode](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessor.java) or [all versions and deletes mode](https://github.com/Azure-Samples/azure-cosmos-java-sql-api-samples/blob/main/src/main/java/com/azure/cosmos/examples/changefeed/SampleChangeFeedProcessorForAllVersionsAndDeletesMode.java).

## Processing life cycle

The normal life cycle of a host instance is:

1. Read the change feed.
1. If there are no changes, sleep for a predefined amount of time (customizable with `options.setFeedPollDelay` in the builder) and go to #1.
1. If there are changes, send them to the *delegate*.
1. When the delegate finishes processing the changes *successfully*, update the lease store by using the latest processed point in time and go to #1.

## Error handling

The change feed processor is resilient to user code errors. If your delegate implementation has an unhandled exception (step #4), the thread that's processing that particular batch of changes is stopped, and a new thread is created. The new thread checks the latest point in time that the lease store has saved for that range of partition key values, and it restart from there, effectively sending the same batch of changes to the delegate. This behavior continues until your delegate processes the changes correctly. It's the reason why the change feed processor has an "at least once" guarantee. Consuming the change feed in an Eventual consistency level can also result in duplicate events in between subsequent change feed read operations. For example, the last event of one read operation might appear as the first event of the next operation.

> [!NOTE]
> In only one scenario is a batch of changes is not retried. If the failure happens on the first ever delegate execution, the lease store has no previous saved state to be used on the retry. In those cases, the retry uses the [initial starting configuration](#starting-time), which might or might not include the last batch.

To prevent your change feed processor from getting "stuck" continuously retrying the same batch of changes, you should add logic in your delegate code to write documents, upon exception, to an errored-message. This design ensures that you can keep track of unprocessed changes while still being able to continue to process future changes. The errored-message might be another Azure Cosmos DB container. The exact data store doesn't matter. You simply want the unprocessed changes to be persisted.

You also can use the [change feed estimator](how-to-use-change-feed-estimator.md) to monitor the progress of your change feed processor instances as they read the change feed.

## Deployment unit

A single change feed processor deployment unit consists of one or more compute instances that have the same lease container configuration and the same `leasePrefix`, but different `hostName` values. You can have many deployment units in which each one has a different business flow for the changes, and each deployment unit consists of one or more instances.

For example, you might have one deployment unit that triggers an external API  each time there's a change in your container. Another deployment unit might move data in real time each time there's a change. When a change happens in your monitored container, all your deployment units are notified.

## Dynamic scaling

As mentioned earlier, within a deployment unit, you can have one or more compute instances. To take advantage of the compute distribution within the deployment unit, the only key requirements are that:

* All instances should have the same lease container configuration.
* All instances should have the same value set in `options.setLeasePrefix` (or none set at all).
* Each instance needs to have a different `hostName`.

If these three conditions apply, then the change feed processor distributes all the leases in the lease container across all running instances of that deployment unit, and it parallelizes compute by using an equal-distribution algorithm. A lease is owned by one instance at any time, so the number of instances shouldn't be greater than the number of leases.

The number of instances can grow and shrink. The change feed processor dynamically adjusts the load by redistributing accordingly. Deployment units can share the same lease container, but they should each have a different `leasePrefix` value.

Moreover, the change feed processor can dynamically adjust a container's scale if the container's throughput or storage increases. When your container grows, the change feed processor transparently handles the scenario by dynamically increasing the leases and distributing the new leases among existing instances.

## Starting time

By default, when a change feed processor starts for the first time, it initializes the lease container and starts its [processing life cycle](#processing-life-cycle). Any changes that happened in the monitored container before the change feed processor was initialized for the first time aren't detected.

> [!NOTE]
> Modifying the starting time of the change feed processor isn't available when you use [all versions and deletes mode](change-feed-modes.md#all-versions-and-deletes-change-feed-mode-preview). Currently, you must use the default start time.

### Reading from a previous date and time

It's possible to initialize the change feed processor to read changes starting at a *specific date and time* by setting `setStartTime` in `options`. The change feed processor is initialized for that specific date and time, and it starts reading the changes that happened afterward.

### Reading from the beginning

In the sample, `setStartFromBeginning` is set to `false`, which is the same as the default value. In other scenarios, like in data migrations or if you're analyzing the entire history of a container, you need to read the change feed from *the beginning of that container's lifetime*. To do that, you can set `setStartFromBeginning` to `true`. The change feed processor is initialized, and it starts reading changes from the beginning of the lifetime of the container.

> [!NOTE]
> These customization options work only to set up the starting point in time of the change feed processor. After the lease container is initialized for the first time, changing them has no effect.

---

## Change feed and provisioned throughput

Change feed read operations on the monitored container consume [request units](../request-units.md). Make sure that your monitored container isn't experiencing [throttling](troubleshoot-request-rate-too-large.md). Throttling adds delays in receiving change feed events on your processors.

Operations on the lease container (updating and maintaining state) consume [request units](../request-units.md). The higher the number of instances that use the same lease container, the higher the potential consumption of request units. Make sure that your lease container isn't experiencing [throttling](troubleshoot-request-rate-too-large.md). Throttling adds delays in receiving change feed events. Throttling can even completely end processing.

## Share the lease container

You can share a lease container across multiple [deployment units](#deployment-unit). In a shared lease container, each deployment unit listens to a different monitored container or has a different value for `processorName`. In this configuration, each deployment unit maintains an independent state on the lease container. Review the [request unit consumption on a lease container](#change-feed-and-provisioned-throughput) to make sure that the provisioned throughput is enough for all the deployment units.

## Advanced lease configuration

Three key configurations can affect how the change feed processor works. Each configuration affects the [request unit consumption on the lease container](#change-feed-and-provisioned-throughput). You can set one of these configurations when you create the change feed processor, but use them carefully:

* Lease Acquire: By default, every 17 seconds. A host periodically checks the state of the lease store and consider acquiring leases as part of the [dynamic scaling](#dynamic-scaling) process. This process is done by executing a Query on the lease container. Reducing this value makes rebalancing and acquiring leases faster, but it increases [request unit consumption on the lease container](#change-feed-and-provisioned-throughput).
* Lease Expiration: By default, 60 seconds. Defines the maximum amount of time that a lease can exist without any renewal activity before it's acquired by another host. When a host crashes, the leases it owned are picked up by other hosts after this period of time plus the configured renewal interval. Reducing this value makes recovering after a host crash faster, but the expiration value should never be lower than the renewal interval.
* Lease Renewal: By default, every 13 seconds. A host that owns a lease periodically renews the lease, even if there are no new changes to consume. This process is done by executing a Replace on the lease. Reducing this value lowers the time that's required to detect leases lost by a host crashing, but it increases [request unit consumption on the lease container](#change-feed-and-provisioned-throughput).

## Where to host the change feed processor

The change feed processor can be hosted in any platform that supports long-running processes or tasks. Here are some examples:

* A continuous running instance of [WebJobs](/training/modules/run-web-app-background-task-with-webjobs/) in Azure App Service
* A process in an instance of [Azure Virtual Machines](/azure/architecture/best-practices/background-jobs#azure-virtual-machines)
* A background job in [Azure Kubernetes Service](/azure/architecture/best-practices/background-jobs#azure-kubernetes-service)
* A serverless function in [Azure Functions](/azure/architecture/best-practices/background-jobs#azure-functions)
* An [ASP.NET hosted service](/aspnet/core/fundamentals/host/hosted-services)

Although the change feed processor can run in short-lived environments because the lease container maintains the state, the startup cycle of these environments adds delays to the time it takes to receive notifications (due to the overhead of starting the processor every time the environment is started).

## Additional resources

* [Azure Cosmos DB SDK](sdk-dotnet-v2.md)
* [Complete sample application on GitHub](https://github.com/Azure-Samples/cosmos-dotnet-change-feed-processor)
* [Additional usage samples on GitHub](https://github.com/Azure/azure-cosmos-dotnet-v3/tree/master/Microsoft.Azure.Cosmos.Samples/Usage/ChangeFeed)
* [Azure Cosmos DB workshop labs for change feed processor](https://azurecosmosdb.github.io/labs/dotnet/labs/08-change_feed_with_azure_functions.html#consume-cosmos-db-change-feed-via-the-change-feed-processor)

## Next steps

Learn more about the change feed processor in the following articles:

* [Overview of change feed](../change-feed.md)
* [Change feed pull model](change-feed-pull-model.md)
* [How to migrate from the change feed processor library](how-to-migrate-from-change-feed-library.md)
* [Use the change feed estimator](how-to-use-change-feed-estimator.md)
* [Change feed processor start time](#starting-time)
