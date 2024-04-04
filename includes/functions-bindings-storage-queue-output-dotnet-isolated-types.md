---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

When you want the function to write a single message, the queue output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The message content as a string. Use when the message is simple text. |
| `byte[]` | The bytes of the message. |
| JSON serializable types | An object representing the content of a JSON message. Functions tries to serialize a plain-old CLR object (POCO) type into JSON data. |

When you want the function to write multiple messages, the queue output binding can bind to the following types:

| Type | Description |
| --- | --- |
| `T[]` where `T` is one of the single message types | An array containing content for multiple messages. Each entry represents one message. | 

For other output scenarios, create and use types from [Azure.Storage.Queues] directly.

[Azure.Storage.Queues]: /dotnet/api/azure.storage.queues
