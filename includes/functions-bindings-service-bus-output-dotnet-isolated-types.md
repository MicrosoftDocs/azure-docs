---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write a single message, the Service Bus output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The message as a string. Use when the message is simple text. |
| `byte[]` | The bytes of the message. |
| JSON serializable types | An object representing the message. Functions attempts to serialize a plain-old CLR object (POCO) type into JSON data. |

When you want the function to write multiple messages, the Service Bus output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single message types | An array containing multiple message. Each entry represents one message. | 

For other output scenarios, create and use types from [Azure.Messaging.ServiceBus] directly.

[Azure.Messaging.ServiceBus]: /dotnet/api/azure.messaging.servicebus