---
title: Send and receive events from Azure Event Hubs using .NET (Hello World)
description: This article describes the simple scenario of sending events to and receiving events from Azure Event Hubs using .NET.  
ms.topic: how-to
ms.date: 07/27/2022
---

# Publish events to and read events from Azure Event Hubs using .NET 
This article shows you how to publish events and read from the Event Hubs service. It introduces you to the `EventHubProducerClient` and `EventHubConsumerClient`, along with some of the core concepts of Event Hubs.

## Create a client
To interact with Event Hubs, a client is needed for each area of functionality, such as publishing and reading of events. All clients are scoped to a single Event Hubs instance (or event hub) under an Event Hubs namespace. Clients that read events are also scoped to a consumer group.  For this example, we'll configure our clients using the set of information that follows.

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";
var consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;
```

Each of the Event Hubs client types is safe to cache and use for the lifetime of the application, which is the best practice when the application publishes or reads events regularly or semi-regularly. The clients hold responsibility for efficient resource management, working to keep resource usage low during periods of inactivity and manage health during periods of higher use. Calling either the `CloseAsync` or `DisposeAsync` method on a client as the application is shutting down will ensure that network resources and other unmanaged objects are properly cleaned up.

```csharp
var producer = new EventHubProducerClient(connectionString, eventHubName);
var consumer = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
```

## Publish events
To publish events, you'll need the `EventHubsProducerClient` that was created. You'll close the client once publishing has completed. In most real-world scenarios, closing the producer when the application exits is often the preferred pattern.  

So that you have something to read, you'll publish a full batch of events.  The `EventHubDataBatch` exists to ensure that a set of events can safely be published without exceeding the size allowed by the event hub. The `EventDataBatch` queries the service to understand the maximum size and is responsible for accurately measuring each event as it is added to the batch. When its `TryAdd` method returns `false`, the event is too large to fit into the batch.

```csharp
try
{
    using EventDataBatch eventBatch = await producer.CreateBatchAsync();

    for (var counter = 0; counter < int.MaxValue; ++counter)
    {
        var eventBody = new BinaryData($"Event Number: { counter }");
        var eventData = new EventData(eventBody);

        if (!eventBatch.TryAdd(eventData))
        {
            // At this point, the batch is full but our last event was not
            // accepted.  For our purposes, the event is unimportant so we
            // will intentionally ignore it.  In a real-world scenario, a
            // decision would have to be made as to whether the event should
            // be dropped or published on its own.

            break;
        }
    }

    // When the producer publishes the event, it will receive an
    // acknowledgment from the Event Hubs service; so long as there is no
    // exception thrown by this call, the service assumes responsibility for
    // delivery. Your event data will be published to one of the event hub's
    // partitions, though there may be a (very) slight delay until it is
    // available to be consumed.

    await producer.SendAsync(eventBatch);
}
catch
{
    // Transient failures will be automatically retried as part of the
    // operation. If this block is invoked, then the exception was either
    // fatal or all retries were exhausted without a successful publish.
}
finally
{
   await producer.CloseAsync();
}
```

## Read events
Now that the events have been published, you'll read back all events from the event hub using the `EventHubConsumerClient` that was created.  It's important to note that because events aren't removed when reading, if you're using an existing event hub, you're likely to see events that had been previously published as well as the events from the batch that we just sent.

A consumer is associated with a specific event hub and [consumer group](event-hubs-features.md#consumer-groups). Conceptually, the consumer group is a label that identifies one or more event consumers as a set.  Often, consumer groups are named after the responsibility of the consumer in an application, such as **Telemetry** or **OrderProcessing**.  When an event hub is created, a default consumer group is created for it, named **$Default**.  

Each consumer has a unique view of the events in a partition that it reads from, which means that events are available to all consumers and aren't removed from the partition when read. It allows consumers to read and process events from the event hub at different speeds without interfering with one another.

When events are published, they'll continue to exist in the event hub. They'll be available for consuming until they reach an age where they're older than the [retention period](event-hubs-faq.md#what-is-the-maximum-retention-period-for-events). Once removed, the events are no longer available to be read, and can't be recovered. Though the Event Hubs service is free to remove events older than the retention period, it doesn't do so deterministically. There's no guarantee of when events will be removed.

```csharp
try
{
    // To ensure that we do not wait for an indeterminate length of time, we'll
    // stop reading after we receive five events.  For a fresh event hub, those
    // will be the first five that we had published. We'll also ask for
    // cancellation after 90 seconds, just to be safe.

    using var cancellationSource = new CancellationTokenSource();
    cancellationSource.CancelAfter(TimeSpan.FromSeconds(90));

    var maximumEvents = 5;
    var eventDataRead = new List<string>();

    await foreach (PartitionEvent partitionEvent in consumer.ReadEventsAsync(cancellationSource.Token))
    {
        eventDataRead.Add(partitionEvent.Data.EventBody.ToString());

        if (eventDataRead.Count >= maximumEvents)
        {
            break;
        }
    }

    // At this point, the data sent as the body of each event is held
    // in the eventDataRead set.
}
catch
{
    // Transient failures will be automatically retried as part of the
    // operation. If this block is invoked, then the exception was either
    // fatal or all retries were exhausted without a successful read.
}
finally
{
   await consumer.CloseAsync();
}
```

This example makes use of the `ReadEvents` method of the `EventHubConsumerClient`, which allows it to see events from all [partitions](event-hubs-features.md#partitions) of an event hub. While it's convenient to use for exploration, we strongly recommend not using it for production scenarios. The `ReadEvents` method doesn't guarantee fairness amongst the partitions during iteration. Partitions compete with each other to publish events to be read. Depending on how service communication takes place, there may be a clustering of events per partition and a noticeable bias for a given partition or subset of partitions.

To read from all partitions in a production application, we recommend preferring the [EventProcessorClient](/dotnet/api/azure.messaging.eventhubs.eventprocessorclient) or a custom [EventProcessor<TPartition>](/dotnet/api/azure.messaging.eventhubs.primitives.eventprocessor-1) implementation.

## Next steps
See the following quickstarts and samples. 

- Quickstarts: [.NET](event-hubs-dotnet-standard-getstarted-send.md), [Java](event-hubs-java-get-started-send.md), [Python](event-hubs-python-get-started-send.md), [JavaScript](event-hubs-node-get-started-send.md)
- Samples on GitHub: [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples), [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples), [Python](https://github.com/Azure/azure-sdk-for-python/blob/azure-eventhub_5.3.1/sdk/eventhub/azure-eventhub/samples), [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/javascript), [TypeScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/typescript)
