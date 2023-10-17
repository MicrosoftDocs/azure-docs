---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/16/2023
ms.author: glenga
---

## Supported versions

Versions of the Functions runtime support specific versions of .NET. To learn more about Functions versions, see [Azure Functions runtime versions overview](../articles/azure-functions/functions-versions.md). Version support also depends on whether your functions run in-process or isolated worker process. 

>[!NOTE]
>To learn how to change the Functions runtime version used by your function app, see [view and update the current runtime version](../articles/azure-functions/set-runtime-version.md#view-and-update-the-current-runtime-version).

The following table shows the highest level of .NET or .NET Framework that can be used with a specific version of Functions. 

| Functions runtime version | Isolated worker process<br/>([.NET Isolated](../articles/azure-functions/dotnet-isolated-process-guide.md)) | In-process<br/>([.NET class library](../articles/azure-functions/functions-dotnet-class-library.md)) |
| ---- | --- | ---- |
| Functions 4.x | .NET 6.0<sup>1</sup><br/>.NET 7.0<sup>2</sup><br/>.NET Framework 4.8<sup>3</sup><br/>.NET 8.0 (Preview)<sup>4</sup> | .NET 6.0<sup>1</sup>  |
| Functions 1.x<sup>5</sup> | n/a | .NET Framework 4.8 |

<sup>1</sup> Per the [.NET Official Support Policy], .NET 6 will reach end of support on November 12, 2024.

<sup>2</sup> Per the [.NET Official Support Policy], .NET 7 will reach end of support on May 14, 2024.

<sup>3</sup> Build process also requires [.NET 6 SDK](https://dotnet.microsoft.com/download).

<sup>4</sup> See [Preview .NET versions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#preview-net-versions) for details on support, current restrictions, and instructions for using the preview version.

<sup>5</sup>[Support will end for version 1.x of the Azure Functions runtime on September 14, 2026](https://aka.ms/azure-functions-retirements/hostv1). We highly recommend that you [migrate your apps to version 4.x](../articles/azure-functions/migrate-version-1-version-4.md) for full support.

For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues).

[.NET Official Support Policy]: https://dotnet.microsoft.com/platform/support/policy
