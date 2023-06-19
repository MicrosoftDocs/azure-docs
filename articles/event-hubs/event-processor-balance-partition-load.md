---
title: Balance partition load across multiple instances - Azure Event Hubs | Microsoft Docs
description: Describes how to balance partition load across multiple instances of your application using an event processor and the Azure Event Hubs SDK.  
ms.topic: conceptual
ms.date: 11/14/2022
---

# Balance partition load across multiple instances of your application

To scale your event processing application, you can run multiple instances of the application and have the load balanced among themselves. In the older versions, [EventProcessorHost](event-hubs-event-processor-host.md) allowed you to balance the load between multiple instances of your program and checkpoint events when receiving the events. In the newer versions (5.0 onwards), **EventProcessorClient** (.NET and Java), or **EventHubConsumerClient** (Python and JavaScript) allows you to do the same. The development model is made simpler by using events. You subscribe to the events that you're interested in by registering an event handler. If you're using the old version of the client library, see the following migration guides: [.NET](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md), [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/servicebus/azure-messaging-servicebus/migration-guide.md), [Python](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/servicebus/azure-servicebus/migration_guide.md), and [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/servicebus/service-bus/migrationguide.md).

This article describes a sample scenario for using multiple instances of client `applications to read events from an event hub. It also gives you details about features of event processor client, which allows you to receive events from multiple partitions at once and load balance with other consumers that use the same event hub and consumer group.

> [!NOTE]
> The key to scale for Event Hubs is the idea of partitioned consumers. In contrast to the [competing consumers](/previous-versions/msp-n-p/dn568101(v=pandp.10)) pattern, the partitioned consumer pattern enables high scale by removing the contention bottleneck and facilitating end to end parallelism.

## Example scenario

As an example scenario, consider a home security company that monitors 100,000 homes. Every minute, it gets data from various sensors such as a motion detector, door/window open sensor, glass break detector, and so on, installed in each home. The company provides a web site for residents to monitor the activity of their home in near real time.

Each sensor pushes data to an event hub. The event hub is configured with 16 partitions. On the consuming end, you need a mechanism that can read these events, consolidate them (filter, aggregate, and so on) and dump the aggregate to a storage blob, which is then projected to a user-friendly web page.

## Consumer application

When designing the consumer in a distributed environment, the scenario must handle the following requirements:

1. **Scale:** Create multiple consumers, with each consumer taking ownership of reading from a few Event Hubs partitions.
2. **Load balance:** Increase or reduce the consumers dynamically. For example, when a new sensor type (for example, a carbon monoxide detector) is added to each home, the number of events increases. In that case, the operator (a human) increases the number of consumer instances. Then, the pool of consumers can rebalance the number of partitions they own, to share the load with the newly added consumers.
3. **Seamless resume on failures:** If a consumer (**consumer A**) fails (for example, the virtual machine hosting the consumer suddenly crashes), then other consumers can pick up the partitions owned by **consumer A** and continue. Also, the continuation point, called a *checkpoint* or *offset*, should be at the exact point at which **consumer A** failed, or slightly before that.
4. **Consume events:** While the previous three points deal with the management of the consumer, there must be code to consume events and do something useful with it. For example, aggregate it and upload it to blob storage.

## Event processor or consumer client

You don't need to build your own solution to meet these requirements. The Azure Event Hubs SDKs provide this functionality. In .NET or Java SDKs, you use an event processor client (`EventProcessorClient`), and in Python and JavaScript SDKs, you use `EventHubConsumerClient`. In the old version of SDK, it was the event processor host (`EventProcessorHost`) that supported these features.

For most production scenarios, we recommend that you use the event processor client for reading and processing events. The processor client is intended to provide a robust experience for processing events across all partitions of an event hub in a performant and fault tolerant manner while providing a means to checkpoint its progress. Event processor clients can work cooperatively within the context of a consumer group for a given event hub. Clients will automatically manage distribution and balancing of work as instances become available or unavailable for the group.

## Partition ownership 

An event processor instance typically owns and processes events from one or more partitions. Ownership of partitions is evenly distributed among all the active event processor instances associated with an event hub and consumer group combination. 

Each event processor is given a unique identifier and claims ownership of partitions by adding or updating an entry in a checkpoint store. All event processor instances communicate with this store periodically to update its own processing state and to learn about other active instances. This data is then used to balance the load among the active processors. New instances can join the processing pool to scale up. When instances go down, either because of failures or to scale down, partition ownership is gracefully transferred to other active processors.

Partition ownership records in the checkpoint store keep track of Event Hubs namespace,  event hub name, consumer group, event processor identifier (also known as owner), partition ID, and the last modified time.



| Event Hubs namespace               | Event hub name | **Consumer group** | Owner                                | Partition ID | Last modified time  |
| ---------------------------------- | -------------- | :----------------- | :----------------------------------- | :----------- | :------------------ |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | 3be3f9d3-9d9e-4c50-9491-85ece8334ff6 | 0            | 2020-01-15T01:22:15 |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | f5cc5176-ce96-4bb4-bbaa-a0e3a9054ecf | 1            | 2020-01-15T01:22:17 |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | 72b980e9-2efc-4ca7-ab1b-ffd7bece8472 | 2            | 2020-01-15T01:22:10 |
|                                    |                | :                  |                                      |              |                     |
|                                    |                | :                  |                                      |              |                     |
| mynamespace.servicebus.windows.net | myeventhub     | myconsumergroup    | 844bd8fb-1f3a-4580-984d-6324f9e208af | 15           | 2020-01-15T01:22:00 |

Each event processor instance acquires ownership of a partition and starts processing the partition from last known [checkpoint](#checkpoint). If a processor fails (VM shuts down), then other instances detect it by looking at the last modified time. Other instances try to get ownership of the partitions previously owned by the inactive instance. The checkpoint store guarantees that only one of the instances succeeds in claiming ownership of a partition. So, at any given point of time, there is at most one processor that receives events from a partition.

## Receive messages

When you create an event processor, you specify functions that will process events and errors. Each call to the function that processes events delivers a single event from a specific partition. It's your responsibility to handle this event. If you want to make sure the consumer processes every message at least once, you need to write your own code with retry logic. But be cautious about poisoned messages.

We recommend that you do things relatively fast. That is, do as little processing as possible. If you need to write to storage and do some routing, it's better to use two consumer groups and have two event processors.

## Checkpoint

*Checkpointing* is a process by which an event processor marks or commits the position of the last successfully processed event within a partition. Marking a checkpoint is typically done within the function that processes the events and occurs on a per-partition basis within a consumer group. 

If an event processor disconnects from a partition, another instance can resume processing the partition at the checkpoint that was previously committed by the last processor of that partition in that consumer group. When the processor connects, it passes the offset to the event hub to specify the location at which to start reading. In this way, you can use checkpointing to both mark events as "complete" by downstream applications and to provide resiliency when an event processor goes down. It's possible to return to older data by specifying a lower offset from this checkpointing process. 

When the checkpoint is performed to mark an event as processed, an entry in checkpoint store is added or updated with the event's offset and sequence number. Users should decide the frequency of updating the checkpoint. Updating after each successfully processed event can have performance and cost implications  as it triggers a write operation to the underlying checkpoint store. Also, checkpointing every single event is indicative of a queued messaging pattern for which a Service Bus queue might be a better option than an event hub. The idea behind Event Hubs is that you get "at least once" delivery at great scale. By making your downstream systems idempotent, it's easy to recover from failures or restarts that result in the same events being received multiple times.


[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]


## Thread safety and processor instances

By default, the function that processes events is called sequentially for a given partition. Subsequent events and calls to this function from the same partition queue up behind the scenes as the event pump continues to run in the background on other threads. Events from different partitions can be processed concurrently and any shared state that is accessed across partitions have to be synchronized.

## Next steps
See the following quick starts:

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
