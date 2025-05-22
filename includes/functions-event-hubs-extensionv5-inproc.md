---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/07/2025
ms.author: glenga
---
The Event Hubs extension supports parameter types according to the table below.

| Binding scenario | Parameter types |
|-|-|
| Event Hubs trigger (single event) | [Azure.Messaging.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[BinaryData] |
| Event Hubs trigger (batch of events) | `EventData[]`<br/>`string[]` |
| Event Hubs output (single event) | [Azure.Messaging.EventHubs.EventData]<br/>JSON serializable types<sup>1</sup><br/>`string`<br/>`byte[]`<br/>[BinaryData]|
| Event Hubs output (multiple events) | `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the single event types |

<sup>1</sup> Events containing JSON data can be deserialized into known plain-old CLR object (POCO) types.