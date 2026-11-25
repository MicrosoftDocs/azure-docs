---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/24/2026
ms.author: glenga
ms.custom:
  - include file
  - ignite-2023
---
Make sure to select your preferred development language at the [top of the article](#top).
::: zone pivot="programming-language-csharp"
The following table shows the .NET versions supported by Azure Functions.

Your function app code runs in a separate .NET worker process. Use with [supported versions of .NET and .NET Framework](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). For more information, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

[!INCLUDE [functions-in-process-model-retirement-note](./functions-in-process-model-retirement-note.md)]

| Supported version    | Support level | Expected end-of-support date                                  |
|----------------------|---------------|---------------------------------------------------------------|
| .NET 11              | GA            | [November 14, 2028][dotnet-policy]                            |
| .NET 10              | GA            | [November 14, 2028][dotnet-policy]                            |
| .NET Framework 4.8.1 | GA            | See [.NET Framework Support Policy][dotnet-framework-policy]  |

Projects that target .NET 11 require `Azure.Functions.Sdk` version 1.0.1 or later as the project SDK and an explicit `Microsoft.Azure.Functions.Worker` package reference. For configuration and tooling guidance, see [.NET 11 in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#net-11).

> [!NOTE]
> To use .NET 10 or later, Linux Consumption plan apps must first [migrate to the Flex Consumption plan](../articles/azure-functions/migration/migrate-plan-consumption-to-flex.md).

[dotnet-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle
[dotnet-framework-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-framework

For more information, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

::: zone-end
::: zone pivot="programming-language-java"
The following table shows the language versions supported for Java function apps:

| Supported version | Support level | Supported until |
| ---- | ---- |--- |
| **Java 25** | GA | May 2029 |
| **Java 21** | GA | September 2028 |
| **Java 17** | GA | September 2027 |
| **Java 11** | GA | September 2027 |
| **Java 8** | GA | September 2027 |

> [!NOTE]
> Java 21 is the last Java version supported for Linux Consumption plan apps. Newer Java versions aren't added to Linux Consumption. For more information, see [Migrate Consumption plan apps to the Flex Consumption plan](../articles/azure-functions/migration/migrate-plan-consumption-to-flex.md).

For more information on developing and running Java function apps, see [Azure Functions Java developer guide](../articles/azure-functions/functions-reference-java.md).

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
The following table shows the language versions supported for Node.js function apps:

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [Node.js 26](https://endoflife.date/nodejs) | Preview (Linux only) | |
| [Node.js 24](https://endoflife.date/nodejs) | GA | April 30, 2028 |
| [Node.js 22](https://endoflife.date/nodejs) | GA | April 30, 2027 |

Node.js 26 is available in preview only on Linux. On Windows, use Node.js 24 or Node.js 22.

TypeScript is supported through transpiling to JavaScript. For more information, see [Azure Functions Node.js developer guide](../articles/azure-functions/functions-reference-node.md#programming-model).

> [!NOTE]
> Node.js 22 is the last Node.js version supported for Linux Consumption plan apps. Newer Node.js versions aren't added to Linux Consumption. For more information, see [Migrate Consumption plan apps to the Flex Consumption plan](../articles/azure-functions/migration/migrate-plan-consumption-to-flex.md).

::: zone-end
::: zone pivot="programming-language-powershell"
The following table shows the language versions supported for PowerShell function apps:

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [PowerShell 7.6](/powershell/scripting/install/powershell-support-lifecycle#powershell-end-of-support-dates) | GA | November 14, 2028 |

PowerShell 7.6 is supported on all Azure Functions hosting plans except Linux Consumption, including Premium and Dedicated on Windows and Linux, Windows Consumption, and Flex Consumption.

[!INCLUDE [PowerShell 7.6 Linux Consumption migration](./functions-powershell-76-linux-consumption-migration.md)]

For more information, see [Azure Functions PowerShell developer guide](../articles/azure-functions/functions-reference-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
The following table shows the language versions supported for Python function apps:

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| Python 3.15 | Preview | April 2030 |
| Python 3.14 | GA | April 2029 |
| Python 3.13 | GA | October 2029 |
| Python 3.12 | GA | October 2028 |
| Python 3.11 | GA | October 2027 |

> [!NOTE]
> Python 3.12 is the last Python version supported for Linux Consumption plan apps. Newer Python versions aren't added to Linux Consumption. For more information, see [Migrate Consumption plan apps to the Flex Consumption plan](../articles/azure-functions/migration/migrate-plan-consumption-to-flex.md).

For more information, see [Azure Functions Python developer guide](../articles/azure-functions/functions-reference-python.md).
::: zone-end
::: zone pivot="programming-language-go"
The following table shows the Go versions supported by Azure Functions:

| Supported version | Support level | Expected end-of-support date |
| --- | --- | --- |
| [Go 1.24 or later](https://go.dev/doc/devel/release#policy) | GA | See the [Go release policy](https://go.dev/doc/devel/release#policy)<sup>1</sup> |

<sup>1</sup> Each major Go release is supported until two newer major releases are available.

> [!NOTE]
> Go support is available only for function apps hosted in the Flex Consumption plan.

For more information, see [Azure Functions Go developer reference](../articles/azure-functions/functions-reference-go.md).
::: zone-end

For information about planned changes to language support, see the [Azure roadmap updates](https://techcommunity.microsoft.com/search?q=functions+roadmap).
