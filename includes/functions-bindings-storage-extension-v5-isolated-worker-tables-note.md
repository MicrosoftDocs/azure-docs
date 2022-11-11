---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 04/14/2022
ms.author: mahender
---

> [!NOTE]
> Blob Storage, Queue Storage, and Table Storage now use separate extensions and are referenced individually. For example, to use both Blob Storage and Queue Storage triggers and bindings in your .NET isolated-process app, you should add the following packages to your project:
>
> - [Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs]
> - [Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues]
>
> The Azure Cosmos DB for Table extension doesn't currently support isolated worker process. If your app needs to use Azure Tables, you must use [Microsoft.Azure.Functions.Worker.Extensions.Storage, version 4.x]. This same package also has a [5.x version], which references the packages for Blob Storage and Queue Storage only. When referencing these newer split packages, make sure you aren't also referencing an older version of the combined storage package, which would cause conflicts between the two definitions of the same bindings.

[Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs
[Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues

[Microsoft.Azure.Functions.Worker.Extensions.Storage, version 4.x]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/4.0.4
[5.x version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/5.0.0
