---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to process a single event, the Event Hubs trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The event as a string. Use when the event is simple text. |
| `byte[]` | The bytes of the event. |
| JSON serializable types | When a event contains JSON data, Functions tries to deserialize the JSON data into a plain-old CLR object (POCO) type. |
| [Azure.Messaging.EventHubs.EventData] | _(Preview<sup>1</sup>)_<br/>The event object.<br/>If you are migrating from any older versions of the Event Hubs SDKs, note that this version drops support for the legacy `Body` type in favor of [EventBody](/dotnet/api/azure.messaging.eventhubs.eventdata.eventbody).|

When you want the function to process a batch of events, the Event Hubs trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `string[]` | An array of events from the batch, as strings. Each entry represents one event. |
| `EventData[]` | _(Preview<sup>1</sup>)_<br/>An array of events from the batch, as instances of [Azure.Messaging.EventHubs.EventData]. Each entry represents one event. | 
| `T[]` where `T` is a JSON serializable type | _(Preview<sup>1</sup>)_<br/>An array of events from the batch, as instances of a custom POCO type. Each entry represents one event. | 

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.EventHubs 5.4.1-preview1 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs/5.4.1-preview1) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types-preview).

[Azure.Messaging.EventHubs.EventData]: /dotnet/api/azure.messaging.eventhubs.eventdata