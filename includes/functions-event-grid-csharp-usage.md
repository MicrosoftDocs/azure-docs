---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/14/2021
ms.author: glenga
---

| Type | Extension 3.x | Extension 2.x | Functions v1 |
| --- | --- | --- | --- |
| **[Azure.Messaging.CloudEvent][CloudEvent]** |✔ |X|X| 
| **[Azure.Messaging.EventGrid][EventGridEvent]** | ✔ | X |X|
| **Microsoft.Azure.EventGrid.Models.EventGridEvent** |X|✔ |X |
| **Newtonsoft.Json.Linq.JObject** | ✔ |✔ |✔ |
| **[System.String](/dotnet/api/system.string)**     | ✔ |✔ |✔ |

The [EventGridEvent] type is specific to Event Grid and defines properties for the fields common to all event types. The `EventGridEvent` type defines only the top-level properties; the `Data` property is a `JObject`.

[CloudEvent] is based on the [CloudEvents standard](https://cloudevents.io/) and is intended to be more interoperable between cloud-based messaging providers.


[EventGridEvent]: /dotnet/api/microsoft.azure.eventgrid.models.eventgridevent
[CloudEvent]: /dotnet/api/azure.messaging.cloudevent
