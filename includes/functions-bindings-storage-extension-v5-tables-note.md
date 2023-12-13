---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 11/11/2022
ms.author: mahender
---

> [!NOTE]
> Azure Blobs, Azure Queues, and Azure Tables now use separate extensions and are referenced individually. For example, to use the triggers and bindings for all three services in your .NET in-process app, you should add the following packages to your project:
>
> - [Microsoft.Azure.WebJobs.Extensions.Storage.Blobs]
> - [Microsoft.Azure.WebJobs.Extensions.Storage.Queues]
> - [Microsoft.Azure.WebJobs.Extensions.Tables]
> 
> Previously, the extensions shipped together as [Microsoft.Azure.WebJobs.Extensions.Storage, version 4.x]. This same package also has a [5.x version], which references the split packages for blobs and queues only. When upgrading your package references from older versions, you may therefore need to additionally reference the new [Microsoft.Azure.WebJobs.Extensions.Tables] NuGet package. Also, when referencing these newer split packages, make sure you are not referencing an older version of the combined storage package, as this will result in conflicts from two definitions of the same bindings. 

[Microsoft.Azure.WebJobs.Extensions.Storage.Blobs]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage.Blobs
[Microsoft.Azure.WebJobs.Extensions.Storage.Queues]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage.Queues
[Microsoft.Azure.WebJobs.Extensions.Tables]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Tables
[Microsoft.Azure.WebJobs.Extensions.Storage, version 4.x]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/4.0.5
[5.x version]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/5.0.0
