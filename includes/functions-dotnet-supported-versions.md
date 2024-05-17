---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 12/16/2023
ms.author: glenga
---

## Supported versions

Versions of the Functions runtime support specific versions of .NET. To learn more about Functions versions, see [Azure Functions runtime versions overview](../articles/azure-functions/functions-versions.md). Version support also depends on whether your functions run in-process or isolated worker process. 

>[!NOTE]
>To learn how to change the Functions runtime version used by your function app, see [view and update the current runtime version](../articles/azure-functions/set-runtime-version.md#view-the-current-runtime-version).

The following table shows the highest level of .NET or .NET Framework that can be used with a specific version of Functions. 

| Functions runtime version | [Isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md) | [In-process model](../articles/azure-functions/functions-dotnet-class-library.md)<sup>5</sup> |
| ---- | --- | ---- |
| Functions 4.x<sup>1</sup> | .NET 8.0<br/>.NET 6.0<sup>2</sup><br/>.NET Framework 4.8<sup>3</sup> | .NET 6.0<sup>2</sup>  |
| Functions 1.x<sup>4</sup> | n/a | .NET Framework 4.8 |

<sup>1</sup> .NET 7 was previously supported on the isolated worker model but reached the [end of official support] on May 14, 2024.

<sup>2</sup> .NET 6 reaches the [end of official support] on November 12, 2024.

<sup>3</sup> The build process also requires the [.NET SDK](https://dotnet.microsoft.com/download).  

<sup>4</sup> Support ends for version 1.x of the Azure Functions runtime on September 14, 2026. For more information, see [this support announcement](https://aka.ms/azure-functions-retirements/hostv1). For continued full support, you should [migrate your apps to version 4.x](../articles/azure-functions/migrate-version-1-version-4.md).

<sup>5</sup> Support ends for the in-process model on November 10, 2026. For more information, see [this support announcement](https://aka.ms/azure-functions-retirements/in-process-model). For continued full support, you should  [migrate your apps to the isolated worker model](../articles/azure-functions/migrate-dotnet-to-isolated-model.md).  

For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues).

[end of official support]: https://dotnet.microsoft.com/platform/support/policy
