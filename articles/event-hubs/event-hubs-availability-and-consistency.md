---
title: Availability and consistency - Azure Event Hubs | Microsoft Docs
description: How to provide the maximum amount of availability and consistency with Azure Event Hubs using partitions.
ms.topic: article
ms.date: 03/13/2023
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp
---

# Availability and consistency in Event Hubs
This article provides information about availability and consistency supported by Azure Event Hubs. 

## Availability
Azure Event Hubs spreads the risk of catastrophic failures of individual machines or even complete racks across clusters that span multiple failure domains within a datacenter. It implements transparent failure detection and failover mechanisms such that the service will continue to operate within the assured service-levels and typically without noticeable interruptions when such failures occur. 

If an Event Hubs namespace is created in a region with [availability zones](../availability-zones/az-overview.md), the outage risk is further spread across three physically separated facilities, and the service has enough capacity reserves to instantly cope up with the complete, catastrophic loss of the entire facility. For more information, see [Azure Event Hubs - Geo-disaster recovery](event-hubs-geo-dr.md).

When a client application sends events to an event hub without specifying a partition, events are automatically distributed among partitions in your event hub. If a partition isn't available for some reason, events are distributed among the remaining partitions. This behavior allows for the greatest amount of up time. For use cases that require the maximum up time, this model is preferred instead of sending events to a specific partition. 

## Consistency
In some scenarios, the ordering of events can be important. For example, you may want your back-end system to process an update command before a delete command. In this scenario, a client application sends events to a specific partition so that the ordering is preserved. When a consumer application consumes these events from the partition, they are read in order. 

With this configuration, keep in mind that if the particular partition to which you are sending is unavailable, you will receive an error response. As a point of comparison, if you don't have an affinity to a single partition, the Event Hubs service sends your event to the next available partition.

Therefore, if high availability is most important, don't target a specific partition (using partition ID/key). Using partition ID/key downgrades the availability of an event hub to partition-level. In this scenario, you are making an explicit choice between availability (no partition ID/key) and consistency (pinning events to a specific partition). For detailed information about partitions in Event Hubs, see [Partitions](event-hubs-features.md#partitions).

## Appendix

### Send events without specifying a partition
We recommend sending events to an event hub without setting partition information to allow the Event Hubs service to balance the load across partitions. See the following quick starts to learn how to do so in different programming languages. 

- [Send events using .NET](event-hubs-dotnet-standard-getstarted-send.md)
- [Send events using Java](event-hubs-java-get-started-send.md)
- [Send events using JavaScript](event-hubs-node-get-started-send.md)
- [Send events using Python](event-hubs-python-get-started-send.md)


### Send events to a specific partition
In this section, you learn how to send events to a specific partition using different programming languages. 

### [.NET](#tab/dotnet)
To send events to a specific partition, create the batch using the [EventHubProducerClient.CreateBatchAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.createbatchasync#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_CreateBatchAsync_Azure_Messaging_EventHubs_Producer_CreateBatchOptions_System_Threading_CancellationToken_) method by specifying either the `PartitionId` or the `PartitionKey` in [CreateBatchOptions](/dotnet/api/azure.messaging.eventhubs.producer.createbatchoptions). The following code sends a batch of events to a specific partition by specifying a partition key. Event Hubs ensures that all events sharing a partition key value are stored together and delivered in order of arrival.

```csharp
var batchOptions = new CreateBatchOptions { PartitionKey = "cities" };
using var eventBatch = await producer.CreateBatchAsync(batchOptions);
```

You can also use the [EventHubProducerClient.SendAsync](/dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient.sendasync#Azure_Messaging_EventHubs_Producer_EventHubProducerClient_SendAsync_System_Collections_Generic_IEnumerable_Azure_Messaging_EventHubs_EventData__Azure_Messaging_EventHubs_Producer_SendEventOptions_System_Threading_CancellationToken_) method by specifying either **PartitionId** or **PartitionKey** in [SendEventOptions](/dotnet/api/azure.messaging.eventhubs.producer.sendeventoptions).

```csharp
var sendEventOptions  = new SendEventOptions { PartitionKey = "cities" };
// create the events array
producer.SendAsync(events, sendOptions)
```


### [Java](#tab/java)
To send events to a specific partition, create the batch using the [createBatch](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/EventHubProducerClient.java) method by specifying either **partition ID** or **partition key** in [createBatchOptions](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/models/CreateBatchOptions.java). The following code sends a batch of events to a specific partition by specifying a partition key. 

```java
CreateBatchOptions batchOptions = new CreateBatchOptions();
batchOptions.setPartitionKey("cities");
```

You can also use the [EventHubProducerClient.send](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/EventHubProducerClient.java) method by specifying either **partition ID** or **partition key** in [SendOptions](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/main/java/com/azure/messaging/eventhubs/models/SendOptions.java).

```java
List<EventData> events = Arrays.asList(new EventData("Melbourne"), new EventData("London"), new EventData("New York"));
SendOptions sendOptions = new SendOptions();
sendOptions.setPartitionKey("cities");
producer.send(events, sendOptions);
```


### [Python](#tab/python) 
To send events to a specific partition, when creating a batch using the [`EventHubProducerClient.create_batch`](/python/api/azure-eventhub/azure.eventhub.eventhubproducerclient#create-batch---kwargs-) method, specify the `partition_id` or the `partition_key`. Then, use the [`EventHubProducerClient.send_batch`](/python/api/azure-eventhub/azure.eventhub.aio.eventhubproducerclient#send-batch-event-data-batch--typing-union-azure-eventhub--common-eventdatabatch--typing-list-azure-eventhub-) method to send the batch to the event hub's partition. 

```python
event_data_batch = await producer.create_batch(partition_key='cities')
```

You can also use the [EventHubProducerClient.send_batch](/python/api/azure-eventhub/azure.eventhub.eventhubproducerclient#send-batch-event-data-batch----kwargs-) method by specifying values for `partition_id` or `partition_key` parameters.

```python
producer.send_batch(event_data_batch, partition_key="cities")
```

### [JavaScript](#tab/javascript)
To send events to a specific partition, [Create a batch](/javascript/api/@azure/event-hubs/eventhubproducerclient#createBatch_CreateBatchOptions_) using the [EventHubProducerClient.CreateBatchOptions](/javascript/api/@azure/event-hubs/eventhubproducerclient#createBatch_CreateBatchOptions_) object by specifying the `partitionId` or the `partitionKey`. Then, send the batch to the event hub using the [EventHubProducerClient.SendBatch](/javascript/api/@azure/event-hubs/eventhubproducerclient#sendBatch_EventDataBatch__OperationOptions_) method. 

See the following example.

```javascript
const batchOptions = { partitionKey = "cities"; };
const batch = await producer.createBatch(batchOptions);
```

You can also use the [EventHubProducerClient.sendBatch](/javascript/api/@azure/event-hubs/eventhubproducerclient#sendBatch_EventData____SendBatchOptions_) method by specifying either **partition ID** or **partition key** in [SendBatchOptions](/javascript/api/@azure/event-hubs/sendbatchoptions).

```javascript
const sendBatchOptions = { partitionKey = "cities"; };
// prepare events
producer.sendBatch(events, sendBatchOptions);
```

---



## Next steps
You can learn more about Event Hubs by visiting the following links:

- [Event Hubs service overview](./event-hubs-about.md)
- [Event Hubs terminology](event-hubs-features.md)
