---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/21/2025
ms.author: glenga
ms.custom:
  - include file
  - ignite-2023
---
Make sure to select your preferred development language at the [top of the article](#top).
::: zone pivot="programming-language-csharp"
The following table shows the .NET versions supported by Azure Functions.

The supported version of .NET depends on both your Functions runtime version and your selected execution model.

### [Isolated worker model](#tab/isolated-process)

Your function app code runs in a separate .NET worker process. Use with [supported versions of .NET and .NET Framework](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). For more information, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](./functions-in-process-model-retirement-note.md)]

Your function app code runs in the same process as the Functions host process. This model supports only [Long Term Support (LTS) versions of .NET](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions). For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md).  

---

### [v4.x](#tab/v4/in-process)

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [.NET 8 (LTS)][dotnet-policy] | GA | November 10, 2026 |

.NET 6 was previously supported by the in-process model but reached the end of official support on [November 12, 2024][dotnet-policy].

> [!IMPORTANT]
> The in-process model currently only supports .NET 8. To be able to update your function app to use a later .NET version, you must [migrate to the isolated worker model](../articles/azure-functions/migrate-dotnet-to-isolated-model.md).

For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md) and [Azure Functions legacy C# script (.csx) developer reference](../articles/azure-functions/functions-reference-csharp.md).

### [v1.x](#tab/v1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](./functions-runtime-1x-retirement-note.md)]

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| .NET Framework 4.8.1 | GA | See [.NET Framework Support Policy][dotnet-framework-policy]. |
 
For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md) and [Azure Functions legacy C# script (.csx) developer reference](../articles/azure-functions/functions-reference-csharp.md).

### [v4.x](#tab/v4/isolated-process)

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| .NET 10 | Preview | See [.NET and .NET Core release lifecycle][dotnet-policy]. |
| .NET 9 | GA | [May 12, 2026][dotnet-policy] |
| .NET 8 | GA | [November 10, 2026][dotnet-policy] |
| .NET Framework 4.8.1 | GA | See [.NET Framework Support Policy][dotnet-framework-policy]. |

[dotnet-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle
[dotnet-framework-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-framework

.NET 6 was previously supported by the isolated worker model but reached the end of official support on [November 12, 2024][dotnet-policy].

.NET 7 was previously supported by the isolated worker model but reached the end of official support on [May 14, 2024][dotnet-policy].

For more information, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [v1.x](#tab/v1/isolated-process)

Version 1.x of the Functions runtime doesn't support running C# function apps in an isolated worker process. Go to the **In-process** tab or the **v4.x** tab.

---

::: zone-end
::: zone pivot="programming-language-java"  
The following table shows the language versions supported for Java function apps:

| Supported version | Support level | Supported until |
| ---- | ---- |--- |
| **Java 21** | GA | See [Release and servicing roadmap](/java/openjdk/support#release-and-servicing-roadmap). |
| **Java 17** | GA | See [Release and servicing roadmap](/java/openjdk/support#release-and-servicing-roadmap). |
| **Java 11** | GA |See [Release and servicing roadmap](/java/openjdk/support#release-and-servicing-roadmap). |
| **Java 8** | GA | See the [Temurin support page](https://adoptium.net/support/). |

For more information on developing and running Java function apps, see [Azure Functions Java developer guide](../articles/azure-functions/functions-reference-java.md).

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
The following table shows the language versions supported for Node.js function apps:

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [Node.js 22](https://endoflife.date/nodejs) | GA | April 30, 2027 |
| [Node.js 20](https://endoflife.date/nodejs) | GA | April 30, 2026 |

TypeScript is supported through transpiling to JavaScript. For more information, see [Azure Functions Node.js developer guide](../articles/azure-functions/functions-reference-node.md#supported-versions).
::: zone-end  
::: zone pivot="programming-language-powershell"  
The following table shows the language version supported for PowerShell function apps:

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [PowerShell 7.4](/powershell/scripting/install/powershell-support-lifecycle#powershell-end-of-support-dates) | GA | November 10, 2026 |

For more information, see [Azure Functions PowerShell developer guide](../articles/azure-functions/functions-reference-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
The following table shows the language versions supported for Python function apps: 

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| Python 3.13 | Preview | October 2029 |
| Python 3.12 | GA | October 2028 |
| Python 3.11 | GA | October 2027 |
| Python 3.10 | GA | October 2026 |
| Python 3.9 | GA | October 2025 |

For more information, see [Azure Functions Python developer guide](../articles/azure-functions/functions-reference-python.md).
::: zone-end

For information about planned changes to language support, see the [Azure roadmap updates](https://techcommunity.microsoft.com/search?q=functions+roadmap).