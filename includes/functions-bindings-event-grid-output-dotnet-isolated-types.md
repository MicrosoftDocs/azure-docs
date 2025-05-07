---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write a single event, the Event Grid output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The event as a string. |
| `byte[]` | The bytes of the event message. |
| JSON serializable types | An object representing a JSON event. Functions tries to serialize a plain-old CLR object (POCO) type into JSON data. |

When you want the function to write multiple events, the Event Grid output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single event types | An array containing multiple events. Each entry represents one event. |

For other output scenarios, create and use an [EventGridPublisherClient] with other types from [Azure.Messaging.EventGrid] directly. See [Register Azure clients](../articles/azure-functions/dotnet-isolated-process-guide.md#register-azure-clients) for an example of using dependency injection to create a client type from the Azure SDK.

[Azure.Messaging.EventGrid]: /dotnet/api/azure.messaging.eventgrid
[EventGridPublisherClient]: /dotnet/api/azure.messaging.eventgrid.eventgridpublisherclient
