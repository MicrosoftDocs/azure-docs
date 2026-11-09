---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 09/09/2026
ms.author: glenga
---

When you migrate your function app, choose a [supported .NET version using the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). The central support guidance lists the available versions, release types, support dates, and hosting restrictions.

The [isolated worker model] supports Long Term Support (LTS) and Standard Term Support (STS) releases of .NET, as well as supported .NET Framework versions. If your app depends on libraries or APIs available only in .NET Framework, choose a supported target and review the [.NET Framework Support Policy][netfxpolicy]. For release support policy, see the [.NET Official Support Policy].

Update your Azure Functions development tools and templates to support your target version. For project SDK and worker package requirements, see [Core SDK and package](../articles/azure-functions/dotnet-isolated-process-guide.md#core-sdk-and-package).

For a comparison of the programming models, see [Differences between in-process and isolated worker process .NET Azure Functions](../articles/azure-functions/dotnet-isolated-in-process-differences.md).

Support ends for the [in-process model] on November 10, 2026. For more information, see [this support announcement](https://aka.ms/azure-functions-retirements/in-process-model). For continued full support, [migrate your apps to the isolated worker model](../articles/azure-functions/migrate-dotnet-to-isolated-model.md).

[.NET Official Support Policy]: https://dotnet.microsoft.com/platform/support/policy
[netfxpolicy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-framework
[Isolated worker model]: ../articles/azure-functions/dotnet-isolated-process-guide.md
[In-process model]: ../articles/azure-functions/functions-dotnet-class-library.md
