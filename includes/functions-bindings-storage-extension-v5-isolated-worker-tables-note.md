---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 04/14/2022
ms.author: mahender
---

> [!NOTE]
> Blobs, Queues, and Tables are now considered separate extensions and should be referenced individually. A .NET isolated-process app aiming to use triggers and bindings for blobs and queues should reference:
>
> - [Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs]
> - [Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues]
>
> The Table API extension does not currently support isolated process. If your app needs to use Azure Tables, you will need to use [Microsoft.Azure.Functions.Worker.Extensions.Storage, version 4.x]. This same package also has a [5.x version], which references the packages for blobs and queues only. When referencing these newer split packages, make sure you are not referencing an older version of the combined storage package, as this will result in conflicts from two definitions of the same bindings. 

[Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs
[Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues

[Microsoft.Azure.Functions.Worker.Extensions.Storage, version 4.x]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/4.0.4
[5.x version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/5.0.0
