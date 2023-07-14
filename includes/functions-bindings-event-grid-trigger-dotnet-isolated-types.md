---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to process a single event, the Event Grid trigger can bind to the following types:

| Type | Description |
| --- | --- |
| JSON serializable types | Functions tries to deserialize the JSON data of the event into a plain-old CLR object (POCO) type. |
| `string` | The event as a string. |
| [BinaryData] | _(Preview<sup>1</sup>)_<br/>The bytes of the event message. |
| [CloudEvent] | _(Preview<sup>1</sup>)_<br/>The event object. Use when Event Grid is configured to deliver using the CloudEvents schema. |
| [EventGridEvent] | _(Preview<sup>1</sup>)_<br/>The event object. Use when Event Grid is configured to deliver using the Event Grid schema. |

When you want the function to process a batch of events, the Event Grid trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `CloudEvent[]`,<br/>`EventGridEvent[]`,<br/>`string[]`,<br/>`BinaryData[]` | An array of events from the batch. Each entry represents one event. | 

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.EventGrid 3.3.0-preview1 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid/3.3.0-preview1) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types-preview).

[CloudEvent]: /dotnet/api/azure.messaging.cloudevent
[EventGridEvent]: /dotnet/api/azure.messaging.eventgrid.eventgridevent
[BinaryData]: /dotnet/api/system.binarydata
