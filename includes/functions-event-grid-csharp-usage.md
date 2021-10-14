---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/14/2021
ms.author: glenga
---

| Type | Version 3+ | Version 2+ | Version 1 |
| --- | --- | --- | --- |
| **[Azure.Messaging.CloudEvent][CloudEvent]** |✔ |X|X| 
| **[Microsoft.Azure.EventGrid.Models.EventGridEvent][EventGridEvent]** | ✔ | ✔<sup>*</sup>|X|
| **Microsoft.Azure.WebJobs.Extensions.EventGrid.EventGridEvent** |X|✔ |X |
| **Newtonsoft.Json.Linq.JObject** | ✔ |✔ |✔ |
| **[System.String](/dotnet/api/system.string)** | ✔ |✔ |✔ |

<sup>*</sup> Requires the [Microsoft.Azure.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.EventGrid) NuGet package. To use the newer type, fully qualify the [EventGridEvent] type name by prefixing it with `Microsoft.Azure.EventGrid.Models`.

The [EventGridEvent] type is specific to Event Grid and defines properties for the fields common to all event types. The `EventGridEvent` type defines only the top-level properties; the `Data` property is a `JObject`.

[CloudEvent] is based on the [CloudEvents standard](https://cloudevents.io/) and is intended to be more interoperable between cloud-based messaging providers.

See the [Example section](#example) for examples of using the various parameter types.