---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 12/07/2021
ms.author: mahender
---

> [!NOTE]
> [Version 5.x of the Storage extension NuGet package][extension-5.x] and [version 3.x of the extension bundle][bundle-3.x] currently do not include the [Table Storage bindings][tables]. These are instead provided in a preview of the new [Microsoft.Azure.WebJobs.Extensions.Tables NuGet package][tables-nuget]. If your app requires Table Storage and cannot reference this preview package, you will need to continue using [version 4.x of the extension NuGet package][extension-4.x] or [version 2.x of the extension bundle][bundle-2.x] for now.

[extension-5.x]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/5.0.0
[bundle-3.x]: ../articles/azure-functions/functions-bindings-register.md#extension-bundles

[tables]: ../articles/azure-functions/functions-bindings-storage-table.md
[tables-nuget]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Tables/

[extension-4.x]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/4.0.5
[bundle-2.x]: ../articles/azure-functions/functions-bindings-register.md#extension-bundles 
