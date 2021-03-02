---
title: Availability and consistency - Azure Event Hubs | Microsoft Docs
description: How to provide the maximum amount of availability and consistency with Azure Event Hubs using partitions.
ms.topic: article
ms.date: 01/25/2021
ms.custom: devx-track-csharp
---

# Availability and consistency in Event Hubs
This article provides information about availability and consistency supported by Azure Event Hubs. 

## Availability
Azure Event Hubs spreads the risk of catastrophic failures of individual machines or even complete racks across clusters that span multiple failure domains within a datacenter. It implements transparent failure detection and failover mechanisms such that the service will continue to operate within the assured service-levels and typically without noticeable interruptions when such failures occur. If an Event Hubs namespace has been created with the enabled option for [availability zones](../availability-zones/az-overview.md), the outage risk is further spread across three physically separated facilities, and the service has enough capacity reserves to instantly cope with the complete, catastrophic loss of the entire facility. For more information, see [Azure Event Hubs - Geo-disaster recovery](event-hubs-geo-dr.md).

When a client application sends events to an event hub, events are automatically distributed among partitions in your event hub. If a partition isn't available for some reason, events are distributed among the remaining partitions. This behavior allows for the greatest amount of up time. For use cases that require the maximum up time, this model is preferred instead of sending events to a specific partition. 

## Availability considerations when using partition key
Using a partition key is optional, and you should consider carefully whether or not to use one. If you don't specify a partition key when publishing an event, Event Hubs balances the load among partitions as mentioned earlier in this article. In many cases, using a partition key is a good choice if event ordering is important. When you use a partition key, these partitions require availability on a single node, and outages can occur over time; for example, when compute nodes reboot and patch. As such, if you set a partition ID and that partition becomes unavailable for some reason, an attempt to access the data in that partition will fail. If high availability is most important, don't specify a partition key. In that case, events are sent to partitions using an internal load-balancing algorithm. In this scenario, you are making an explicit choice between availability (no partition ID) and consistency (pinning events to a partition ID).

Another consideration is handling delays in processing events. In some cases, it might be better to drop data and retry than to try to keep up with processing, which can potentially cause further downstream processing delays. For example, with a stock ticker it's better to wait for complete up-to-date data, but in a live chat or VOIP scenario you'd rather have the data quickly, even if it isn't complete.

Given these availability considerations, in these scenarios you might choose one of the following error handling strategies:

- Stop (stop reading from Event Hubs until things are fixed)
- Drop (messages aren’t important, drop them)
- Retry (retry the messages as you see fit)

For more information about partitions, see [Partions in Event Hubs](event-hubs-features.md#partitions).


## Consistency
In some scenarios, the ordering of events can be important. For example, you may want your back-end system to process an update command before a delete command. In this scenario, a client application sends events to a specific partition so that the ordering is preserved. When a consumer application consumes these events from the partition, they are read in order. 

With this configuration, keep in mind that if the particular partition to which you are sending is unavailable, you will receive an error response. As a point of comparison, if you don't have an affinity to a single partition, the Event Hubs service sends your event to the next available partition.

One possible solution to ensure ordering, while also maximizing up time, would be to aggregate events as part of your event processing application. The easiest way to accomplish it is to stamp your event with a custom sequence number property.

In this scenario, producer client sends events to one of the available partitions in your event hub, and sets the corresponding sequence number from your application. This solution requires state to be kept by your processing application, but gives your senders an endpoint that is more likely to be available.


## Appendix

### .NET examples

#### Send events to a specific partition

#### [Azure.Messaging.EventHubs (5.0.0 or later)](#tab/latest)
Set the partition key on an event or an event batch. In the following example, the partition ID is specified on an event batch. Doing so ensures that when these events are read from the partition, they are read in order. 


```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

var producer = new EventHubProducerClient(connectionString, eventHubName);

try
{
    string firstPartition = (await producer.GetPartitionIdsAsync()).First();

    var batchOptions = new CreateBatchOptions
    {
        PartitionId = firstPartition
    };

    using var eventBatch = await producer.CreateBatchAsync(batchOptions);

    for (var index = 0; index < 5; ++index)
    {
        var eventBody = new BinaryData($"Event #{ index }");
        var eventData = new EventData(eventBody);

        if (!eventBatch.TryAdd(eventData))
        {
            throw new Exception($"The event at { index } could not be added.");
        }
    }

    await producer.SendAsync(eventBatch);
}
finally
{
    await producer.CloseAsync();
}
```

#### [Microsoft.Azure.EventHubs (4.1.0 or earlier)](#tab/old)
Use a `PartitionSender` object to only send events to a certain partition. To migrate to the newer **Azure.Messaging.EventHubs** library, see [Migrating code from PartitionSender to EventHubProducerClient for publishing events to a partition](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md#migrating-code-from-partitionsender-to-eventhubproducerclient-for-publishing-events-to-a-partition).

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

var connectionStringBuilder = new EventHubsConnectionStringBuilder(connectionString){ EntityPath = eventHubName }; 
var eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());

// partition ID 0 is used for this example
PartitionSender partitionSender = eventHubClient.CreatePartitionSender("0");
try
{
    EventDataBatch eventBatch = partitionSender.CreateBatch();

    for (var counter = 0; counter < int.MaxValue; ++counter)
    {
        var eventBody = $"Event Number: { counter }";
        var eventData = new EventData(Encoding.UTF8.GetBytes(eventBody));

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
    await partitionSender.SendAsync(eventBatch);
}
finally
{
    await partitionSender.CloseAsync();
    await eventHubClient.CloseAsync();
}
```

---

### Set a sequence number
The following example stamps your event with a custom sequence number property. 

#### [Azure.Messaging.EventHubs (5.0.0 or later)](#tab/latest)

```csharp
// create a producer client that you can use to send events to an event hub
await using (var producerClient = new EventHubProducerClient(connectionString, eventHubName))
{
    // get the latest sequence number from your application
    var sequenceNumber = GetNextSequenceNumber();

    // create a batch of events 
    using EventDataBatch eventBatch = await producerClient.CreateBatchAsync();

    // create a new EventData object by encoding a string as a byte array
    var data = new EventData(Encoding.UTF8.GetBytes("This is my message..."));

    // set a custom sequence number property
    data.Properties.Add("MyAppSequenceNumber", sequenceNumber);

    // add events to the batch. An event is a represented by a collection of bytes and metadata. 
    if (! eventBatch.TryAdd(data))
    {
        throw new Exception($"The event could not be added.");
    }

    // use the producer client to send the batch of events to the event hub
    await producerClient.SendAsync(eventBatch);
}
```

#### [Microsoft.Azure.EventHubs (4.1.0 or earlier)](#tab/old)
```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

var connectionStringBuilder = new EventHubsConnectionStringBuilder(connectionString){ EntityPath = eventHubName }; 
var eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());

// Get the latest sequence number from your application
var sequenceNumber = GetNextSequenceNumber();

// Create a new EventData object by encoding a string as a byte array
var data = new EventData(Encoding.UTF8.GetBytes("This is my message..."));

// Set a custom sequence number property
data.Properties.Add("MyAppSequenceNumber", sequenceNumber);

// Send single message async
await eventHubClient.SendAsync(data);
```
---

This example sends your event to one of the available partitions in your event hub, and sets the corresponding sequence number from your application. This solution requires state to be kept by your processing application, but gives your senders an endpoint that is more likely to be available.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs service overview](./event-hubs-about.md)
* [Create an event hub](event-hubs-create.md)
