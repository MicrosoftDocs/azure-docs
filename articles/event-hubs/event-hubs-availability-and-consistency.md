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

For more information about partitions, see [Partitions in Event Hubs](event-hubs-features.md#partitions).


## Consistency
In some scenarios, the ordering of events can be important. For example, you may want your back-end system to process an update command before a delete command. In this scenario, a client application sends events to a specific partition so that the ordering is preserved. When a consumer application consumes these events from the partition, they are read in order. 

With this configuration, keep in mind that if the particular partition to which you are sending is unavailable, you will receive an error response. As a point of comparison, if you don't have an affinity to a single partition, the Event Hubs service sends your event to the next available partition.

One possible solution to ensure ordering, while also maximizing up time, would be to aggregate events as part of your event processing application. The easiest way to accomplish it is to stamp your event with a custom sequence number property.

In this scenario, producer client sends events to one of the available partitions in your event hub, and sets the corresponding sequence number from your application. This solution requires state to be kept by your processing application, but gives your senders an endpoint that is more likely to be available. 

## Appendix

# Send events to a specific partition in Azure Event Hubs
This article shows you how to send events to a specific partition in Azure Event Hubs. 

### [.NET (Azure.Messaging.EventHubs)](#tab/dotnetlatest)
1. If you are sending a single event to an event hub, use the [EventHubProducerClient.SendAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.sendasync?view=azure-dotnet#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_SendAsync_System_Collections_Generic_IEnumerable_Azure_Messaging_EventHubs_EventData__Azure_Messaging_EventHubs_Producer_SendEventOptions_System_Threading_CancellationToken_) method with [SendEventOptions.PartitionId](https://docs.microsoft.com/en-us//dotnet/api/azure.messaging.eventhubs.producer.sendeventoptions.partitionid?view=azure-dotnet#Azure_Messaging_EventHubs_Producer_SendEventOptions_PartitionId) set to the ID of the partition that you are targeting. 

    If you are sending a batch of events to an event hub, create the batch using the [EventHubProducerClient.CreateBatchAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.createbatchasync?view=azure-dotnet#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_CreateBatchAsync_Azure_Messaging_EventHubs_Producer_CreateBatchOptions_System_Threading_CancellationToken_) method with [CreateBatchOptions.PartionId](/dotnet/api/azure.messaging.eventhubs.producer.sendeventoptions.partitionid?view=azure-dotnet#Azure_Messaging_EventHubs_Producer_SendEventOptions_PartitionId) set to the ID of the partition that you are targeting. 
2. Then, use the [EventHubProducerClient.SendAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.sendasync?view=azure-dotnet#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_SendAsync_Azure_Messaging_EventHubs_Producer_EventDataBatch_System_Threading_CancellationToken_) method to send the batch to the event hub. See the following example. 

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

### [.NET (Microsoft.Azure.EventHubs)](#tab/dotnetold)
1. Use the [EventHubClient.CreatePartitionSender("Partition ID")](/dotnet/api/microsoft.azure.eventhubs.eventhubclient.createpartitionsender?view=azure-dotnet) method to create a [PartitionSender](/dotnet/api/microsoft.azure.eventhubs.partitionsender?view=azure-dotnet) object for the specified partition. 
1. Then, use the [PartitionSender.SendAsync](/dotnet/api/microsoft.azure.eventhubs.partitionsender?view=azure-dotnet) methods to send a single event or a batch of events to the partition. 

    > [!NOTE]
    > To migrate to the newer **Azure.Messaging.EventHubs** library, see [Migrating code from PartitionSender to EventHubProducerClient for publishing events to a partition](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md#migrating-code-from-partitionsender-to-eventhubproducerclient-for-publishing-events-to-a-partition).

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

### [Java (azure-messaging-eventhubs)](#tab/latestjava)

```java
import com.azure.messaging.eventhubs.*;

public class Sender {
    public static void main(String[] args) {
        final String connectionString = "EVENT HUBS NAMESPACE CONNECTION STRING";
        final String eventHubName = "EVENT HUB NAME";

        // create a producer using the namespace connection string and event hub name
        EventHubProducerClient producer = new EventHubClientBuilder()
            .connectionString(connectionString, eventHubName)
            .buildProducerClient();

        // prepare a batch of events to send to the event hub    
        CreateBatchOptions batchOptions = new CreateBatchOptions();
        batchOptions.setPartitionId(producer.getPartitionIds().stream().findFirst().get());
        
        EventDataBatch batch = producer.createBatch(batchOptions);
        batch.tryAdd(new EventData("First event"));
        batch.tryAdd(new EventData("Second event"));
        batch.tryAdd(new EventData("Third event"));
        batch.tryAdd(new EventData("Fourth event"));
        batch.tryAdd(new EventData("Fifth event"));

        // send the batch of events to the event hub
        producer.send(batch);

        // close the producer
        producer.close();
    }
}
```

### [Java (azure-eventhubs)](#tab/oldjava)


### [Python](#tab/python) 

1. When creating a batch using the [EventHubProducerClient.create_batch](/python/api/azure-eventhub/azure.eventhub.eventhubproducerclient?view=azure-python#create-batch---kwargs-) method, specify the partition ID as an argument. 
1. Use the [EventHubProducerClient.send_batch](/python/api/azure-eventhub/azure.eventhub.aio.eventhubproducerclient?view=azure-python#send-batch-event-data-batch--typing-union-azure-eventhub--common-eventdatabatch--typing-list-azure-eventhub-) method to send the batch to the event hub's partition. 

```python
import asyncio
from azure.eventhub.aio import EventHubProducerClient
from azure.eventhub import EventData

async def run():
    # Create a producer client to send messages to the event hub.
    # Specify a connection string to your event hubs namespace and
    # the event hub name.
    producer = EventHubProducerClient.from_connection_string(conn_str="EVENT HUBS NAMESPACE - CONNECTION STRING", eventhub_name="EVENT HUB NAME")

    partition_ids = producer.get_partition_ids()
    async with producer:
        # Create a batch.
        event_data_batch = await producer.create_batch(partition_ids[0])

        # Add events to the batch.
        event_data_batch.add(EventData('First event '))
        event_data_batch.add(EventData('Second event'))
        event_data_batch.add(EventData('Third event'))

        # Send the batch of events to the event hub.
        await producer.send_batch(event_data_batch)

loop = asyncio.get_event_loop()
loop.run_until_complete(run())
```

### [JavaScript](#tab/javascript)

1. Create a [EventHubProducerClient.CreateBatchOptions](/javascript/api/@azure/event-hubs/eventhubproducerclient?view=azure-node-latest#createBatch_CreateBatchOptions_) object by specifying the ID of the partition you are targeting. You can get all the partition IDs by using the [EventHubProducerClient.getPartitionIds](/javascript/api/@azure/event-hubs/eventhubproducerclient?view=azure-node-latest#getPartitionIds_GetPartitionIdsOptions_) method. 
2. [Create a batch](/javascript/api/@azure/event-hubs/eventhubproducerclient?view=azure-node-latest#createBatch_CreateBatchOptions_) using the `CreateBatchOptions` object. 
1. Send the batch to the event hub using the [EventHubProducerClient.SendBatch](/javascript/api/@azure/event-hubs/eventhubproducerclient?view=azure-node-latest#sendBatch_EventDataBatch__OperationOptions_) method. 

    See the following example.

    ```javascript
    const { EventHubProducerClient } = require("@azure/event-hubs");
    
    const connectionString = "EVENT HUBS NAMESPACE CONNECTION STRING";
    const eventHubName = "EVENT HUB NAME";
    
    async function main() {
    
      // Create a producer client to send messages to the event hub.
      const producer = new EventHubProducerClient(connectionString, eventHubName);
    
      const partitionIds = await client.getPartitionIds();
      
      const batchOptions = {
        partitionId = partitionIds[0];
      };
    
      // Prepare a batch of three events.
      const batch = await producer.createBatch(batchOptions);
      batch.tryAdd({ body: "First event" });
      batch.tryAdd({ body: "Second event" });
      batch.tryAdd({ body: "Third event" });    
    
      // Send the batch to the event hub.
      await producer.sendBatch(batch);
    
      // Close the producer client.
      await producer.close();
    
      console.log("A batch of three events have been sent to the event hub");
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```

    If you are sending an array of event (not batch), use the [sendBatch method](/javascript/api/@azure/event-hubs/eventhubproducerclient?view=azure-node-latest#sendBatch_EventData____SendBatchOptions_) with [SendBatchOptions.partitionId](/javascript/api/@azure/event-hubs/sendbatchoptions?view=azure-node-latest) set to the ID of the target partition. 

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
