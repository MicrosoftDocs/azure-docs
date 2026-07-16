---
title: Partition load balancing for event processing
description: Learn about partition load balancing and how event processor clients distribute event processing workloads across multiple application instances in Azure Event Hubs.
ms.topic: concept-article
ms.date: 05/04/2026
#customer intent: As a developer, I want to understand how partition load balancing works so that I can scale my event processing applications.
---

# Partition load balancing for event processing

Partition load balancing is a technique in Azure Event Hubs that distributes event processing workloads across multiple instances of your application. The event processor client automatically manages partition ownership and coordinates work distribution among all active consumer instances.

In the newer SDK versions (5.0 onwards), **EventProcessorClient** (.NET and Java) or **EventHubConsumerClient** (Python and JavaScript) handles load balancing automatically. You subscribe to the events you're interested in by registering an event handler.

This article describes a sample scenario for using multiple instances of client applications to read events from an event hub. It also explains key concepts like partition ownership, checkpointing, and load balancing.

> [!TIP]
> If you're using an older version of the client library, see the migration guides: [.NET](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md), [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/servicebus/azure-messaging-servicebus/migration-guide.md), [Python](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/servicebus/azure-servicebus/migration_guide.md), and [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/servicebus/service-bus/migrationguide.md).

> [!NOTE]
> The key to scale for Event Hubs is the idea of partitioned consumers. In contrast to the [competing consumers](/previous-versions/msp-n-p/dn568101(v=pandp.10)) pattern, the partitioned consumer pattern enables high scale by removing the contention bottleneck and facilitating end-to-end parallelism.

## Example scenario

As an example scenario, consider a home security company that monitors 100,000 homes. Every minute, it gets data from various sensors such as a motion detector, door/window open sensor, glass break detector, and so on, installed in each home. The company provides a web site for residents to monitor the activity of their home in near real time.

Each sensor pushes data to an event hub. The event hub is configured with 16 partitions. On the consuming end, you need a mechanism that can read these events, consolidate them (filter, aggregate, and so on) and dump the aggregate to a storage blob, which is then projected to a user-friendly web page.

## Consumer application

When you design a consumer in a distributed environment, the scenario must handle the following requirements:

- **Scale:** Create multiple consumers, with each consumer taking ownership of reading from a few Event Hubs partitions.
- **Load balance:** Increase or reduce the consumers dynamically. For example, when a new sensor type (for example, a carbon monoxide detector) is added to each home, the number of events increases. In that case, the operator (a human) increases the number of consumer instances. Then, the pool of consumers can rebalance the number of partitions they own, to share the load with the newly added consumers.
- **Seamless resume on failures:** If a consumer (**consumer A**) fails (for example, the virtual machine hosting the consumer suddenly crashes), then other consumers can pick up the partitions owned by **consumer A** and continue. Also, the continuation point, called a *checkpoint* or *offset*, should be at the exact point at which **consumer A** failed, or slightly before that.
- **Consume events:** While the previous three points deal with the management of the consumer, there must be code to consume events and do something useful with it. For example, aggregate it and upload it to blob storage.

## Event processor or consumer client

You don't need to build your own solution to meet these requirements. The Azure Event Hubs SDKs provide this functionality. In .NET or Java SDKs, use an event processor client (`EventProcessorClient`). In Python and JavaScript SDKs, use `EventHubConsumerClient`. In the old version of SDK, the event processor host (`EventProcessorHost`) supported these features.

For most production scenarios, use the event processor client for reading and processing events. The processor client provides a robust experience for processing events across all partitions of an event hub in a performant and fault-tolerant manner while providing a means to checkpoint its progress. Event processor clients can work cooperatively within the context of a consumer group for a given event hub. Clients automatically manage distribution and balancing of work as instances become available or unavailable for the group.

## Partition ownership 

An event processor instance typically owns and processes events from one or more partitions. The system evenly distributes ownership of partitions among all the active event processor instances associated with an event hub and consumer group combination. 

Each event processor has a unique identifier and claims ownership of partitions by adding or updating an entry in a checkpoint store. All event processor instances communicate with this store periodically to update their own processing state and to learn about other active instances. The system uses this data to balance the load among the active processors. New instances can join the processing pool to scale up. When instances go down, either because of failures or to scale down, the system gracefully transfers partition ownership to other active processors.

Partition ownership records in the checkpoint store keep track of Event Hubs namespace,  event hub name, consumer group, event processor identifier (also known as owner), partition ID, and the last modified time.



| Event Hubs namespace               | Event hub name | **Consumer group** | Owner                                | Partition ID | Last modified time  |
| ---------------------------------- | -------------- | :----------------- | :----------------------------------- | :----------- | :------------------ |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | 3be3f9d3-9d9e-4c50-9491-85ece8334ff6 | 0            | 2020-01-15T01:22:15 |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | f5cc5176-ce96-4bb4-bbaa-a0e3a9054ecf | 1            | 2020-01-15T01:22:17 |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | 72b980e9-2efc-4ca7-ab1b-ffd7bece8472 | 2            | 2020-01-15T01:22:10 |
|                                    |                | :                  |                                      |              |                     |
|                                    |                | :                  |                                      |              |                     |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | 844bd8fb-1f3a-4580-984d-6324f9e208af | 15           | 2020-01-15T01:22:00 |

Each event processor instance acquires ownership of a partition and starts processing the partition from last known [checkpoint](#checkpoint). If a processor fails (VM shuts down), other instances detect the failure by looking at the last modified time. Other instances try to get ownership of the partitions previously owned by the inactive instance. The checkpoint store guarantees that only one of the instances succeeds in claiming ownership of a partition. So, at any given point in time, there's at most one processor that receives events from a partition.

## Receive messages

When you create an event processor, specify functions that process events and errors. Each call to the function that processes events delivers a single event from a specific partition. You must handle this event. If you want to make sure the consumer processes every message at least once, write your own code with retry logic. But be cautious about poisoned messages.

Process events relatively fast. That is, do as little processing as possible. If you need to write to storage and do some routing, it's better to use two consumer groups and have two event processors.

## Checkpoint

*Checkpointing* is a process by which an event processor marks or commits the position of the last successfully processed event within a partition. Marking a checkpoint typically happens within the function that processes the events and occurs on a per-partition basis within a consumer group. 

If an event processor disconnects from a partition, another instance can resume processing the partition at the checkpoint that the last processor of that partition in that consumer group previously committed. When the processor connects, it passes the offset to the event hub to specify the location at which to start reading. In this way, you can use checkpointing to both mark events as "complete" by downstream applications and to provide resiliency when an event processor goes down. You can return to older data by specifying a lower offset from this checkpointing process. 

When the checkpoint marks an event as processed, it adds or updates an entry in the checkpoint store with the event's offset and sequence number. Decide the frequency of updating the checkpoint. Updating after each successfully processed event can have performance and cost implications  as it triggers a write operation to the underlying checkpoint store. Also, checkpointing every single event is indicative of a queued messaging pattern for which a Service Bus queue might be a better option than an event hub. The idea behind Event Hubs is that you get "at least once" delivery at great scale. By making your downstream systems idempotent, it's easy to recover from failures or restarts that result in the same events being received multiple times.


[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]


## Thread safety and processor instances

By default, the function that processes events is called sequentially for a given partition. Subsequent events and calls to this function from the same partition queue up behind the scenes as the event pump continues to run in the background on other threads. Events from different partitions can be processed concurrently. You must synchronize any shared state that's accessed across partitions.

## Related content
See the following quickstarts:

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
