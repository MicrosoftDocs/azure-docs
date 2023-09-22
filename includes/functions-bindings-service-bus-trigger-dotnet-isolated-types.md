---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to process a single message, the Service Bus trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The message as a string. Use when the message is simple text. |
| `byte[]` | The bytes of the message. |
| JSON serializable types | When an event contains JSON data, Functions tries to deserialize the JSON data into a plain-old CLR object (POCO) type. |
| [ServiceBusReceivedMessage]<sup>1</sup> | The message object. |

When you want the function to process a batch of messages, the Service Bus trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single message types  | An array of events from the batch. Each entry represents one event. |

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.ServiceBus 5.12.0 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.ServiceBus/5.12.0) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types).

> [!NOTE]
> The isolated process model does not yet support message settlement scenarios for Service Bus triggers.

[ServiceBusReceivedMessage]: /dotnet/api/azure.messaging.servicebus.servicebusreceivedmessage
