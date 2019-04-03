---
title: Receive events using Event Processor Host - Azure Event Hubs | Microsoft Docs
description: This article describes the Event Processor Host in Azure Event Hubs, which simplifies the management of checkpointing, leasing, and reading events ion parallel. 
services: event-hubs
documentationcenter: .net
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.service: event-hubs
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija 

---

# Receive events from Azure Event Hubs using Event Processor Host

Azure Event Hubs is a powerful telemetry ingestion service that can be used to stream millions of events at low cost. This article describes how to consume ingested events using the *Event Processor Host* (EPH); an intelligent consumer agent that simplifies the management of checkpointing, leasing, and parallel event readers.  

The key to scale for Event Hubs is the idea of partitioned consumers. In contrast to the [competing consumers](https://msdn.microsoft.com/library/dn568101.aspx) pattern, the partitioned consumer pattern enables high scale by removing the contention bottleneck and facilitating end to end parallelism.

## Home security scenario

As an example scenario, consider a home security company that monitors 100,000 homes. Every minute, it gets data from various sensors such as a motion detector, door/window open sensor, glass break detector, etc., installed in each home. The company provides a web site for residents to monitor the activity of their home in near real time.

Each sensor pushes data to an event hub. The event hub is configured with 16 partitions. On the consuming end, you need a mechanism that can read these events, consolidate them (filter, aggregate, etc.) and dump the aggregate to a storage blob, which is then projected to a user-friendly web page.

## Write the consumer application

When designing the consumer in a distributed environment, the scenario must handle the following requirements:

1. **Scale:** Create multiple consumers, with each consumer taking ownership of reading from a few Event Hubs partitions.
2. **Load balance:** Increase or reduce the consumers dynamically. For example, when a new sensor type (for example, a carbon monoxide detector) is added to each home, the number of events increases. In that case, the operator (a human) increases the number of consumer instances. Then, the pool of consumers can rebalance the number of partitions they own, to share the load with the newly added consumers.
3. **Seamless resume on failures:** If a consumer (**consumer A**) fails (for example, the virtual machine hosting the consumer suddenly crashes), then other consumers must be able to pick up the partitions owned by **consumer A** and continue. Also, the continuation point, called a *checkpoint* or *offset*, should be at the exact point at which **consumer A** failed, or slightly before that.
4. **Consume events:** While the previous three points deal with the management of the consumer, there must be code to consume the events and do something useful with it; for example, aggregate it and upload it to blob storage.

Instead of building your own solution for this, Event Hubs provides this functionality through the [IEventProcessor](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor) interface and the [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) class.

## IEventProcessor interface

First, consuming applications implement the  [IEventProcessor](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor) interface, which has four methods: [OpenAsync, CloseAsync, ProcessErrorAsync, and ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor?view=azure-dotnet#methods). This interface contains the actual code to consume the events that Event Hubs sends. The following code shows a simple implementation:

```csharp
public class SimpleEventProcessor : IEventProcessor
{
    public Task CloseAsync(PartitionContext context, CloseReason reason)
    {
       Console.WriteLine($"Processor Shutting Down. Partition '{context.PartitionId}', Reason: '{reason}'.");
       return Task.CompletedTask;
    }

    public Task OpenAsync(PartitionContext context)
    {
       Console.WriteLine($"SimpleEventProcessor initialized. Partition: '{context.PartitionId}'");
       return Task.CompletedTask;
     }

    public Task ProcessErrorAsync(PartitionContext context, Exception error)
    {
       Console.WriteLine($"Error on Partition: {context.PartitionId}, Error: {error.Message}");
       return Task.CompletedTask;
    }

    public Task ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
    {
       foreach (var eventData in messages)
       {
          var data = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count);
             Console.WriteLine($"Message received. Partition: '{context.PartitionId}', Data: '{data}'");
       }
       return context.CheckpointAsync();
    }
}
```

Next, instantiate an [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) instance. Depending on the overload, when creating the [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) instance in the constructor, the following parameters are used:

- **hostName:** the name of each consumer instance. Each instance of **EventProcessorHost** must have a unique value for this variable within a consumer group, so don't hard code this value.
- **eventHubPath:** The name of the event hub.
- **consumerGroupName:** Event Hubs uses **$Default** as the name of the default consumer group, but it is a good practice to create a consumer group for your specific aspect of processing.
- **eventHubConnectionString:** The connection string to the event hub, which can be retrieved from the Azure portal. This connection string should have **Listen** permissions on the event hub.
- **storageConnectionString:** The storage account used for internal resource management.

Finally, consumers register the [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) instance with the Event Hubs service. Registering an event processor class with an instance of EventProcessorHost starts event processing. Registering instructs the Event Hubs service to expect that the consumer app consumes events from some of its partitions, and to invoke the [IEventProcessor](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor) implementation code whenever it pushes events to consume. 


### Example

As an example, imagine that there are 5 virtual machines (VMs) dedicated to consuming events, and a simple console application in each VM, which does the actual consumption work. Each console application then creates one [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) instance and registers it with the Event Hubs service.

In this example scenario, let's say that 16 partitions are allocated to the 5 **EventProcessorHost** instances. Some **EventProcessorHost** instances might own a few more partitions than others. For each partition that an **EventProcessorHost** instance owns, it creates an instance of the `SimpleEventProcessor` class. Therefore, there are 16 instances of `SimpleEventProcessor` overall, with one assigned to each partition.

The following list summarizes this example:

- 16 Event Hubs partitions.
- 5 VMs, 1 consumer app (for example, Consumer.exe) in each VM.
- 5 EPH instances registered, 1 in each VM by Consumer.exe.
- 16 `SimpleEventProcessor` objects created by the 5 EPH instances.
- 1 Consumer.exe app might contain 4 `SimpleEventProcessor` objects, since the 1 EPH instance may own 4 partitions.

## Partition ownership tracking

Ownership of a partition to an EPH instance (or a consumer) is tracked through the Azure Storage account that is provided for tracking. You can visualize the tracking as a simple table, as follows. You can see the actual implementation by examining the blobs under the Storage account provided:

| **Consumer group name** | **Partition ID** | **Host name (owner)** | **Lease (or ownership) acquired time** | **Offset in partition (checkpoint)** |
| --- | --- | --- | --- | --- |
| $Default | 0 | Consumer\_VM3 | 2018-04-15T01:23:45 | 156 |
| $Default | 1 | Consumer\_VM4 | 2018-04-15T01:22:13 | 734 |
| $Default | 2 | Consumer\_VM0 | 2018-04-15T01:22:56 | 122 |
| : |   |   |   |   |
| : |   |   |   |   |
| $Default | 15 | Consumer\_VM3 | 2018-04-15T01:22:56 | 976 |

Here, each host acquires ownership of a partition for a certain duration (the lease duration). If a host fails (VM shuts down), then the lease expires. Other hosts try to get ownership of the partition, and one of the hosts succeeds. This process resets the lease on the partition with a new owner. This way, only a single reader at a time can read from any given partition within a consumer group.

## Receive messages

Each call to [ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor.processeventsasync) delivers a collection of events. It is your responsibility to handle these events. If you want to make sure the processor host processes every message at least once, you need to write your own keep retrying code. But be cautious about poisoned messages.

It is recommended that you do things relatively fast; that is, do as little processing as possible. Instead, use consumer groups. If you need to write to storage and do some routing, it is better to use two consumer groups and have two [IEventProcessor](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor) implementations that run separately.

At some point during your processing, you might want to keep track of what you have read and completed. Keeping track is critical if you must restart reading, so you don't return to the beginning of the stream. [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) simplifies this tracking by using *checkpoints*. A checkpoint is a location, or offset, for a given partition, within a given consumer group, at which point you are satisfied that you have processed the messages. Marking a checkpoint in **EventProcessorHost** is accomplished by calling the [CheckpointAsync](/dotnet/api/microsoft.azure.eventhubs.processor.partitioncontext.checkpointasync) method on the [PartitionContext](/dotnet/api/microsoft.azure.eventhubs.processor.partitioncontext) object. This operation is done within the [ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor.processeventsasync) method but can also be done in [CloseAsync](/dotnet/api/microsoft.azure.eventhubs.eventhubclient.closeasync).

## Checkpointing

The [CheckpointAsync](/dotnet/api/microsoft.azure.eventhubs.processor.partitioncontext.checkpointasync) method has two overloads: the first, with no parameters, checkpoints to the highest event offset within the collection returned by [ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor.processeventsasync). This offset is a "high water" mark; it assumes you have processed all recent events when you call it. If you use this method in this way, be aware that you are expected to call it after your other event processing code has returned. The second overload lets you specify an [EventData](/dotnet/api/microsoft.azure.eventhubs.eventdata) instance to checkpoint. This method enables you to use a different type of watermark to checkpoint. With this watermark, you can implement a "low water" mark: the lowest sequenced event you are certain has been processed. This overload is provided to enable flexibility in offset management.

When the checkpoint is performed, a JSON file with partition-specific information (specifically, the offset), is written to the storage account supplied in the constructor to [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost). This file is continually updated. It is critical to consider checkpointing in context - it would be unwise to checkpoint every message. The storage account used for checkpointing probably would not handle this load, but more importantly checkpointing every single event is indicative of a queued messaging pattern for which a Service Bus queue might be a better option than an event hub. The idea behind Event Hubs is that you get "at least once" delivery at great scale. By making your downstream systems idempotent, it is easy to recover from failures or restarts that result in the same events being received multiple times.

## Thread safety and processor instances

By default, [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) is thread safe and behaves in a synchronous manner with respect to the instance of [IEventProcessor](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor). When events arrive for a partition, [ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor.processeventsasync) is called on the **IEventProcessor** instance for that partition and will block further calls to **ProcessEventsAsync** for the partition. Subsequent messages and calls to **ProcessEventsAsync** queue up behind the scenes as the message pump continues to run in the background on other threads. This thread safety removes the need for thread-safe collections and dramatically increases performance.

## Shut down gracefully

Finally, [EventProcessorHost.UnregisterEventProcessorAsync](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost.unregistereventprocessorasync) enables a clean shutdown of all partition readers and should always be called when shutting down an instance of [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost). Failure to do so can cause delays when starting other instances of **EventProcessorHost** due to lease expiration and Epoch conflicts. Epoch management is covered in detail in the [Epoch](#epoch) section of the article. 

## Lease management
Registering an event processor class with an instance of EventProcessorHost starts event processing. The host instance obtains leases on some partitions of the Event Hub, possibly grabbing some from other host instances, in a way that converges on an even distribution of partitions across all host instances. For each leased partition, the host instance creates an instance of the provided event processor class, then receives events from that partition, and passes them to the event processor instance. As more instances get added and more leases are grabbed, EventProcessorHost eventually balances the load among all consumers.

As explained previously, the tracking table greatly simplifies the autoscale nature of [EventProcessorHost.UnregisterEventProcessorAsync](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost.unregistereventprocessorasync). As an instance of **EventProcessorHost** starts, it acquires as many leases as possible, and begins reading events. As the leases near expiration, **EventProcessorHost** attempts to renew them by placing a reservation. If the lease is available for renewal, the processor continues reading, but if it is not, the reader is closed and [CloseAsync](/dotnet/api/microsoft.azure.eventhubs.eventhubclient.closeasync) is called. **CloseAsync** is a good time to perform any final cleanup for that partition.

**EventProcessorHost** includes a [PartitionManagerOptions](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost.partitionmanageroptions) property. This property enables control over lease management. Set these options before registering your [IEventProcessor](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor) implementation.

## Control Event Processor Host options

Additionally, one overload of [RegisterEventProcessorAsync](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost.registereventprocessorasync?view=azure-dotnet#Microsoft_Azure_EventHubs_Processor_EventProcessorHost_RegisterEventProcessorAsync__1_Microsoft_Azure_EventHubs_Processor_EventProcessorOptions_) takes an [EventProcessorOptions](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost.registereventprocessorasync?view=azure-dotnet#Microsoft_Azure_EventHubs_Processor_EventProcessorHost_RegisterEventProcessorAsync__1_Microsoft_Azure_EventHubs_Processor_EventProcessorOptions_) object as a parameter. Use this parameter to control the behavior of [EventProcessorHost.UnregisterEventProcessorAsync](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost.unregistereventprocessorasync) itself. [EventProcessorOptions](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions) defines four properties and one event:

- [MaxBatchSize](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.maxbatchsize): The maximum size of the collection you want to receive in an invocation of [ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor.processeventsasync). This size is not the minimum, only the maximum size. If there are fewer messages to be received, **ProcessEventsAsync** executes with as many as were available.
- [PrefetchCount](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.prefetchcount): A value used by the underlying AMQP channel to determine the upper limit of how many messages the client should receive. This value should be greater than or equal to [MaxBatchSize](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.maxbatchsize).
- [InvokeProcessorAfterReceiveTimeout](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.invokeprocessorafterreceivetimeout): If this parameter is **true**, [ProcessEventsAsync](/dotnet/api/microsoft.azure.eventhubs.processor.ieventprocessor.processeventsasync) is called when the underlying call to receive events on a partition times out. This method is useful for taking time-based actions during periods of inactivity on the partition.
- [InitialOffsetProvider](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.initialoffsetprovider): Enables a function pointer or lambda expression to be set, which is called to provide the initial offset when a reader begins reading a partition. Without specifying this offset, the reader starts at the oldest event, unless a JSON file with an offset has already been saved in the storage account supplied to the [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) constructor. This method is useful when you want to change the behavior of the reader startup. When this method is invoked, the object parameter contains the partition ID for which the reader is being started.
- [ExceptionReceivedEventArgs](/dotnet/api/microsoft.azure.eventhubs.processor.exceptionreceivedeventargs): Enables you to receive notification of any underlying exceptions that occur in [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost). If things are not working as you expect, this event is a good place to start looking.

## Epoch

Here is how the receive epoch works:

### With Epoch
Epoch is a unique identifier (epoch value) that the service uses, to enforce partition/lease ownership. You create an Epoch-based receiver using the [CreateEpochReceiver](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.eventhubclient.createepochreceiver?view=azure-dotnet) method. This method creates an Epoch-based receiver. The receiver is created for a specific event hub partition from the specified consumer group.

The epoch feature provides users the ability to ensure that there is only one receiver on a consumer group at any point in time, with the following rules:

- If there is no existing receiver on a consumer group, the user can create a receiver with any epoch value.
- If there is a receiver with an epoch value e1 and a new receiver is created with an epoch value e2 where e1 <= e2, the receiver with e1 will be disconnected automatically, receiver with e2 is created successfully.
- If there is a receiver with an epoch value e1 and a new receiver is created with an epoch value e2 where e1 > e2, then creation of e2 with fail with the error: A receiver with epoch e1 already exists.

### No Epoch
You create a non-Epoch-based receiver using the [CreateReceiver](https://docs.microsoft.com/dotnet/api/microsoft.azure.eventhubs.eventhubclient.createreceiver?view=azure-dotnet) method. 

There are some scenarios in stream processing where users would like to create multiple receivers on a single consumer group. To support such scenarios, we do have ability to create a receiver without epoch and in this case we allow upto 5 concurrent receivers on the consumer group.

### Mixed Mode
We don’t recommend application usage where you create a receiver with epoch and then switch to no-epoch or vice-versa on the same consumer group. However, when this behavior occurs, the service handles it using the following rules:

- If there is a receiver already created with epoch e1 and is actively receiving events and a new receiver is created with no epoch, the creation of new receiver will fail. Epoch receivers always take precedence in the system.
- If there was a receiver already created with epoch e1 and got disconnected, and a new receiver is created with no epoch on a new MessagingFactory, the creation of new receiver will succeed. There is a caveat here that our system will detect the “receiver disconnection” after ~10 minutes.
- If there are one or more receivers created with no epoch, and a new receiver is created with epoch e1, all the old receivers get disconnected.


## Next steps

Now that you're familiar with the Event Processor Host, see the following articles to learn more about Event Hubs:

* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs programming guide](event-hubs-programming-guide.md)
* [Availability and consistency in Event Hubs](event-hubs-availability-and-consistency.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Event Hubs samples on GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples)
