---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/01/2021
ms.author: glenga
---

## Supported versions

Versions of the Functions runtime work with specific versions of .NET. To learn more about Functions versions, see [Azure Functions runtime versions overview](../articles/azure-functions/functions-versions.md). Version support depends on whether your functions run in-process or out-of-process (isolated). 

The following table shows the highest level of .NET Core or .NET Framework that can be used with a specific version of Functions. 

| Functions runtime version | In-process<br/>([.NET class library](../articles/azure-functions/functions-dotnet-class-library.md)) | Out-of-process<br/>([.NET Isolated](../articles/azure-functions/dotnet-isolated-process-guide.md)) |
| ---- | ---- | --- |
| Functions 4.x (Preview) | .NET 6.0 (preview)| .NET 6.0 (preview)<sup>2</sup> |
| Functions 3.x | .NET Core 3.1 | .NET 5.0 |
| Functions 2.x | .NET Core 2.1<sup>1</sup> | n/a |
| Functions 1.x | .NET Framework 4.8 | n/a |

<sup>1</sup> For details, see [Functions v2.x considerations](../articles/azure-functions/functions-dotnet-class-library.md#functions-v2x-considerations).    
<sup>2</sup> You can currently only create isolated process functions by using Azure Functions Core Tools. To learn more, see [Quickstart: Create a C# function in Azure from the command line](../articles/azure-functions/create-first-function-cli-csharp.md?tabs=isolated-process).  

For the latest news about Azure Functions releases, including the removal of specific older minor versions, monitor [Azure App Service announcements](https://github.com/Azure/app-service-announcements/issues).
