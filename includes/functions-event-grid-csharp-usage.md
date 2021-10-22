---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/14/2021
ms.author: glenga
---

| Type | Extension 3.x<sup>*</sup> | Extension 2.x | Functions v1 |
| --- | --- | --- | --- |
| **[Azure.Messaging.CloudEvent][CloudEvent]** |✔ |X|X| 
| **[Azure.Messaging.EventGrid][EventGridEvent]** | ✔ | X |X|
| **Microsoft.Azure.EventGrid.Models.EventGridEvent** |X|✔ |X |
| **Newtonsoft.Json.Linq.JObject** | ✔ |✔ |✔ |
| **[System.String](/dotnet/api/system.string)** | ✔ |✔ |✔ |

<sup>*</sup> Extension version 3.x is currently in preview.

The [EventGridEvent] type is specific to Event Grid and defines properties for the fields common to all event types. The `EventGridEvent` type defines only the top-level properties; the `Data` property is a `JObject`.

[CloudEvent] is based on the [CloudEvents standard](https://cloudevents.io/) and is intended to be more interoperable between cloud-based messaging providers.

