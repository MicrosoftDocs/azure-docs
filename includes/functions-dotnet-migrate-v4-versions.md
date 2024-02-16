---
author: mattchenderson
ms.service: azure-functions
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 07/28/2023
ms.author: mahender
---

When you migrate your function app, you have the opportunity to choose the target version of .NET. You can update your C# project to one of the following versions of .NET that are supported by Functions version 4.x: 

| .NET version | [.NET Official Support Policy] release type |  Functions process model<sup>1,3</sup> | 
| --- | --- | --- |
| .NET 8<sup>2</sup> | LTS | [Isolated worker model] | 
| .NET 6 | LTS (end of support November 12, 2024) |  [Isolated worker model],<br/>[In-process model]<sup>3</sup>  | 
| .NET Framework 4.8 | [See policy][netfxpolicy] | [Isolated worker model] |  

<sup>1</sup> The [isolated worker model] supports Long Term Support (LTS) and Standard Term Support (STS) versions of .NET, as well as .NET Framework. The [in-process model] only supports LTS releases of .NET. For a full feature and functionality comparison between the two models, see [Differences between in-process and isolate worker process .NET Azure Functions](../articles/azure-functions/dotnet-isolated-in-process-differences.md). 

<sup>2</sup> .NET 8 is not yet supported on the in-process model, though it is available on the isolated worker model. For information about .NET 8 plans, including future options for the in-process model, see the [Azure Functions Roadmap Update post](https://aka.ms/azure-functions-dotnet-roadmap).

<sup>3</sup> Support ends for the in-process model on November 10, 2026. For more information, see [this support announcement](https://aka.ms/azure-functions-retirements/in-process-model). For continued full support, you should  [migrate your apps to the isolated worker model](../articles/azure-functions/migrate-dotnet-to-isolated-model.md).  

<!-- <sup>2</sup> See [Preview .NET versions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#preview-net-versions) for details on support, current restrictions, and instructions for using the preview version. -->

[.NET Official Support Policy]: https://dotnet.microsoft.com/platform/support/policy
[netfxpolicy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-framework
[Isolated worker model]: ../articles/azure-functions/dotnet-isolated-process-guide.md
[In-process model]: ../articles/azure-functions/functions-dotnet-class-library.md
