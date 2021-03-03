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
Azure Event Hubs spreads the risk of catastrophic failures of individual machines or even complete racks across clusters that span multiple failure domains within a datacenter. It implements transparent failure detection and failover mechanisms such that the service will continue to operate within the assured service-levels and typically without noticeable interruptions when such failures occur. 

If an Event Hubs namespace has been created with [availability zones](../availability-zones/az-overview.md) enabled, the outage risk is further spread across three physically separated facilities, and the service has enough capacity reserves to instantly cope up with the complete, catastrophic loss of the entire facility. For more information, see [Azure Event Hubs - Geo-disaster recovery](event-hubs-geo-dr.md).

When a client application sends events to an event hub without specifying a partition, events are automatically distributed among partitions in your event hub. If a partition isn't available for some reason, events are distributed among the remaining partitions. This behavior allows for the greatest amount of up time. For use cases that require the maximum up time, this model is preferred instead of sending events to a specific partition. 

### Considerations when using a partition ID or key
Using a partition ID/key is optional. You should consider carefully whether or not to use one. If you don't specify a partition ID/key when publishing an event, Event Hubs balances the load among partitions. In many cases, using a partition ID/key is a good choice if event ordering is important. When you use a partition ID/key, these partitions require availability on a single node, and outages can occur over time. For example, compute nodes may need to be rebooted or patched. As such, if you set a partition ID/key and that partition becomes unavailable for some reason, an attempt to access the data in that partition will fail. If high availability is most important, don't specify a partition key. In that case, events are sent to partitions using an internal load-balancing algorithm. In this scenario, you are making an explicit choice between availability (no partition ID) and consistency (pinning events to a partition ID).

Another consideration is handling delays in processing events. In some cases, it might be better to drop data and retry than to try to keep up with processing, which can potentially cause further downstream processing delays. For example, with a stock ticker it's better to wait for complete up-to-date data, but in a live chat or VOIP scenario you'd rather have the data quickly, even if it isn't complete.

Given these availability considerations, in these scenarios you might choose one of the following error handling strategies:

- Stop (stop reading from Event Hubs until issues are fixed)
- Drop (messages aren’t important, drop them)
- Retry (retry the messages as you see fit)

For more information about partitions, see [Partitions in Event Hubs](event-hubs-features.md#partitions).

## Consistency
In some scenarios, the ordering of events can be important. For example, you may want your back-end system to process an update command before a delete command. In this scenario, a client application sends events to a specific partition so that the ordering is preserved. When a consumer application consumes these events from the partition, they are read in order. 

With this configuration, keep in mind that if the particular partition to which you are sending is unavailable, you will receive an error response. As a point of comparison, if you don't have an affinity to a single partition, the Event Hubs service sends your event to the next available partition.

One possible solution to ensure ordering, while also maximizing up time, would be to aggregate events as part of your event processing application. The easiest way to accomplish it is to stamp your event with a custom sequence number property.

In this scenario, producer client sends events to one of the available partitions in your event hub, and sets the corresponding sequence number from your application. This solution requires state to be kept by your processing application, but gives your senders an endpoint that is more likely to be available. 

## Appendix

## Send events to a specific partition
This section shows you how to send events to a specific partition in Azure Event Hubs. 

### [.NET (Azure.Messaging.EventHubs)](#tab/dotnetlatest)
If you are sending a batch of events, create the batch using the [EventHubProducerClient.CreateBatchAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.createbatchasync#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_CreateBatchAsync_Azure_Messaging_EventHubs_Producer_CreateBatchOptions_System_Threading_CancellationToken_) method by specifying either the **partition ID** or the **partition key** in [CreateBatchOptions](//dotnet/api/azure.messaging.eventhubs.producer.createbatchoptions). The following code sends a batch of events to a specific partition by specifying a partition key. 

```csharp
var producer = new EventHubProducerClient(connectionString, eventHubName);
try
{
    // specify partition key in batch options
    var batchOptions = new CreateBatchOptions { PartitionKey = "customer1234" };

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

If you are not using the batching approach, use the [EventHubProducerClient.SendAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.sendasync#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_SendAsync_System_Collections_Generic_IEnumerable_Azure_Messaging_EventHubs_EventData__Azure_Messaging_EventHubs_Producer_SendEventOptions_System_Threading_CancellationToken_) method by specifying either the **partition ID** or **the partition key** in [SendEventOptions](/dotnet/api/azure.messaging.eventhubs.producer.sendeventoptions).

### [.NET (Microsoft.Azure.EventHubs)](#tab/dotnetold)
1. Use the [EventHubClient.CreatePartitionSender("Partition ID")](/dotnet/api/microsoft.azure.eventhubs.eventhubclient.createpartitionsender) method to create a [PartitionSender](/dotnet/api/microsoft.azure.eventhubs.partitionsender) object for the specified partition. 
1. Then, use the [PartitionSender.SendAsync](/dotnet/api/microsoft.azure.eventhubs.partitionsender) methods to send a single event or a batch of events to the partition. 

    > [!NOTE]
    > To migrate to the newer **Azure.Messaging.EventHubs** library, see [Migrating code from PartitionSender to EventHubProducerClient for publishing events to a partition](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md#migrating-code-from-partitionsender-to-eventhubproducerclient-for-publishing-events-to-a-partition).

    ```csharp
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

### [Java (azure-messaging-eventhubs)](#tab/latestjava)

```java
// create a producer client using the namespace connection string and event hub name
EventHubProducerClient producer = new EventHubClientBuilder()
    .connectionString(connectionString, eventHubName)
    .buildProducerClient();

// prepare a batch of events to send to the event hub    
CreateBatchOptions batchOptions = new CreateBatchOptions();
batchOptions.setPartitionId();

EventDataBatch batch = producer.createBatch(batchOptions);
batch.tryAdd(new EventData("First event"));
batch.tryAdd(new EventData("Second event"));

// send the batch of events to the event hub
producer.send(batch);
```

### [Java (azure-eventhubs)](#tab/oldjava)


### [Python](#tab/python) 

1. When creating a batch using the [EventHubProducerClient.create_batch](/python/api/azure-eventhub/azure.eventhub.eventhubproducerclient#create-batch---kwargs-) method, specify the `partition_id` or the `partition_key`. 
1. Use the [EventHubProducerClient.send_batch](/python/api/azure-eventhub/azure.eventhub.aio.eventhubproducerclient#send-batch-event-data-batch--typing-union-azure-eventhub--common-eventdatabatch--typing-list-azure-eventhub-) method to send the batch to the event hub's partition. 

```python
# create the producer client
producer = EventHubProducerClient.from_connection_string(conn_str="EVENT HUBS NAMESPACE - CONNECTION STRING", eventhub_name="EVENT HUB NAME")

async with producer:
    # specify partition key while creating a batch
    event_data_batch = await producer.create_batch(partition_key='customer1234')

    # add events to the batch.
    event_data_batch.add(EventData('First event '))
    event_data_batch.add(EventData('Second event'))

    # send the batch of events to the partition
    await producer.send_batch(event_data_batch)
```

### [JavaScript](#tab/javascript)

1. Create a [EventHubProducerClient.CreateBatchOptions](/javascript/api/@azure/event-hubs/eventhubproducerclient#createBatch_CreateBatchOptions_) object by specifying the `partitionId` or the `partitionKey`. 
2. [Create a batch](/javascript/api/@azure/event-hubs/eventhubproducerclient#createBatch_CreateBatchOptions_) using the `CreateBatchOptions` object. 
1. Send the batch to the event hub using the [EventHubProducerClient.SendBatch](/javascript/api/@azure/event-hubs/eventhubproducerclient#sendBatch_EventDataBatch__OperationOptions_) method. 

    See the following example.

    ```javascript
    // create the producer client
    const producer = new EventHubProducerClient(connectionString, eventHubName);

    // specify the partition key in batch options
    const batchOptions = { partitionKey = "customer1234"; };

    // create a batch
    const batch = await producer.createBatch(batchOptions);

    // add events to the batch
    batch.tryAdd({ body: "First event" });
    batch.tryAdd({ body: "Second event" });

    // send the event batch to the partition
    await producer.sendBatch(batch);    
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
