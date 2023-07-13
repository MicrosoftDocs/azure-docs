---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 07/10/2023
ms.author: mahender
---

The queue trigger can bind to the following types:

| Type | Description |
| --- | --- |
| `string` | The message content as a string. Use when the message is simple text.. |
| `byte[]` | The bytes of the message. |
| JSON serializable types | When a queue message contains JSON data, Functions tries to deserialize the JSON data into a plain-old CLR object (POCO) type. |
| [QueueMessage]| _(Preview<sup>1</sup>)_<br/>The message. |
| [BinaryData]| _(Preview<sup>1</sup>)_<br/>The bytes of the message. |

<sup>1</sup> To use these types, you need to reference [Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues 5.1.3-preview1 or later](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues/5.1.3-preview1) and the [common dependencies for SDK type bindings](../articles/azure-functions/dotnet-isolated-process-guide.md#sdk-types-preview).

[QueueMessage]: /dotnet/api/azure.storage.queues.models.queuemessage
[BinaryData]: /dotnet/api/system.binarydata