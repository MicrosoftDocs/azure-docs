---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write a single event, the Event Hubs output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The event as a string. Use when the event is simple text. |
| `byte[]` | The bytes of the event. |
| JSON serializable types | An object representing the event. Functions tries to serialize a plain-old CLR object (POCO) type into JSON data. |

When you want the function to write multiple events, the Event Hubs output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single event types | An array containing multiple events. Each entry represents one event. | 

For other output scenarios, create and use an [EventHubProducerClient] with other types from [Azure.Messaging.EventHubs] directly. See [Register Azure clients](../articles/azure-functions/dotnet-isolated-process-guide.md#register-azure-clients) for an example of using dependency injection to create a client type from the Azure SDK.

[Azure.Messaging.EventHubs]: /dotnet/api/azure.messaging.eventhubs
[EventHubProducerClient]: /dotnet/api/azure.messaging.eventhubs.producer.eventhubproducerclient
