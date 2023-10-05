---
title: Add custom data to events in Azure Event Hubs
description: This article shows you how to add custom data to events in Azure Event Hubs. 
ms.topic: how-to
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/19/2021
---

# Add custom data to events in Azure Event Hubs
Because an event consists mainly of an opaque set of bytes, it may be difficult for consumers of those events to make informed decisions about how to process them. To allow event publishers to offer better context for consumers, events may also contain custom metadata, in the form of a set of key-value pairs. One common scenario for the inclusion of metadata is to provide a hint about the type of data contained by an event, so that consumers understand its format and can deserialize it appropriately.

> [!NOTE]
> This metadata is not used by, or in any way meaningful to, the Event Hubs service; it exists only for coordination between event publishers and consumers. 

The following sections show you how to add custom data to events in different programming languages. 

## .NET 

```csharp
var eventBody = new BinaryData("Hello, Event Hubs!");
var eventData = new EventData(eventBody);
eventData.Properties.Add("EventType", "com.microsoft.samples.hello-event");
eventData.Properties.Add("priority", 1);
eventData.Properties.Add("score", 9.0);
```

For the full code sample, see [Publishing events with custom metadata](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample04_PublishingEvents.md#publishing-events-with-custom-metadata).

## Java

```java
EventData firstEvent = new EventData("EventData Sample 1".getBytes(UTF_8));
firstEvent.getProperties().put("EventType", "com.microsoft.samples.hello-event");
firstEvent.getProperties().put("priority", 1);
firstEvent.getProperties().put("score", 9.0);
```

For the full code sample, see [Publish events with custom metadata](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs/PublishEventsWithCustomMetadata.java).


## Python

```python
event_data = EventData('Message with properties')
event_data.properties = {'event-type': 'com.microsoft.samples.hello-event', 'priority': 1, "score": 9.0}
```

For the full code sample, see [Send Event Data batch with properties](https://github.com/Azure/azure-sdk-for-python/blob/azure-eventhub_5.3.1/sdk/eventhub/azure-eventhub/samples/async_samples/send_async.py).

## JavaScript

```javascript
let eventData = { body: "First event", properties: { "event-type": "com.microsoft.samples.hello-event", "priority": 1, "score": 9.0  } };
```


## Next steps
See the following quickstarts and samples. 

- Quickstarts: [.NET](event-hubs-dotnet-standard-getstarted-send.md), [Java](event-hubs-java-get-started-send.md), [Python](event-hubs-python-get-started-send.md), [JavaScript](event-hubs-node-get-started-send.md)
- Samples on GitHub: [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples), [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples), [Python](https://github.com/Azure/azure-sdk-for-python/blob/azure-eventhub_5.3.1/sdk/eventhub/azure-eventhub/samples), [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/javascript), [TypeScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/typescript)
