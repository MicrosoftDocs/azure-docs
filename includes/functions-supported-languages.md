---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/19/2025
ms.author: glenga
ms.custom:
  - include file
  - ignite-2023
---
Make sure to select your preferred development language at the [top of the article](#top).
::: zone pivot="programming-language-csharp"
The following table shows the .NET versions supported by Azure Functions.  

The supported version of .NET depends on both your Functions runtime version and your chosen execution model:

### [Isolated worker model](#tab/isolated-process)

Your function code runs in a separate .NET worker process. Use with [supported versions of .NET and .NET Framework](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). To learn more, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](./functions-in-process-model-retirement-note.md)]

Your function code runs in the same process as the Functions host process. Supports only [Long Term Support (LTS) versions of .NET](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions). To learn more, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md).  

---

### [v4.x](#tab/v4/in-process)

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [.NET 8 (LTS)](https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle) | GA | November 10, 2026 |

.NET 6 was previously supported on the in-process model but reached the end of official support on [November 12, 2024][dotnet-policy].

For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md) and the [Azure Functions C# script developer reference](../articles/azure-functions/functions-reference-csharp.md).

### [v1.x](#tab/v1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](./functions-runtime-1x-retirement-note.md)]

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| .NET Framework 4.8 | GA | [See policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-framework) |
 
For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md) and the [Azure Functions C# script developer reference](../articles/azure-functions/functions-reference-csharp.md).

### [v4.x](#tab/v4/isolated-process)

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| .NET 9 | GA | [May 12, 2026][dotnet-policy] |
| .NET 8 | GA | [November 10, 2026][dotnet-policy] |
| .NET Framework 4.8.1 | GA | [See policy][dotnet-framework-policy] |

[dotnet-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle
[dotnet-framework-policy]: https://dotnet.microsoft.com/platform/support/policy/dotnet-framework

.NET 6 was previously supported on the isolated worker model but reached the end of official support on [November 12, 2024][dotnet-policy].

.NET 7 was previously supported on the isolated worker model but reached the end of official support on [May 14, 2024][dotnet-policy].

For more information, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [v1.x](#tab/v1/isolated-process)

Running C# functions in an isolated worker process isn't supported by version 1.x of the Functions runtime. Instead choose the **In-process** tab or choose **v4.x**.

---

::: zone-end
::: zone pivot="programming-language-java"  
The following table shows the language versions supported for Java functions.

| Supported version | Support level | Supported until |
| ---- | ---- |--- |
| **Java 21** (Linux-only) | GA | See the [Release and servicing roadmap](/java/openjdk/support#release-and-servicing-roadmap). |
| **Java 17** | GA | See the [Release and servicing roadmap](/java/openjdk/support#release-and-servicing-roadmap). |
| **Java 11** | GA |See the [Release and servicing roadmap](/java/openjdk/support#release-and-servicing-roadmap). |
| **Java 8** | GA | See this [Temurin support page](https://adoptium.net/support/). |

Java 21 isn't currently supported when running on Windows or on Linux in a Flex Consumption plan.

For more information on developing and running Java functions, see [Azure Functions Java developer guide](../articles/azure-functions/functions-reference-java.md).

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
The following table shows the language versions supported for Node.js functions.

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [Node.js 22](https://endoflife.date/nodejs) | GA (Linux) <br> Preview (Windows) | April 30, 2027 |
| [Node.js 20](https://endoflife.date/nodejs) | GA | April 30, 2026 |
| [Node.js 18](https://endoflife.date/nodejs) | GA | April 30, 2025|

Node.js 22 isn't currently supported when running in a Flex Consumption plan.

TypeScript is supported through transpiling to JavaScript. For more information, see the [Azure Functions Node.js developer guide](../articles/azure-functions/functions-reference-node.md#supported-versions).
::: zone-end  
::: zone pivot="programming-language-powershell"  
The following table shows the language version supported for PowerShell functions.

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| [PowerShell 7.4](/powershell/scripting/install/powershell-support-lifecycle#powershell-end-of-support-dates) | GA | November 10, 2026 |

For more information, see [Azure Functions PowerShell developer guide](../articles/azure-functions/functions-reference-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
The following table shows the language versions supported for Python functions. 

| Supported version | Support level | Expected end-of-support date |
| ---- | ---- |--- |
| Python 3.12 | Preview | October 2028 |
| Python 3.11 | GA | October 2027 |
| Python 3.10 | GA | October 2026 |
| Python 3.9 | GA | October 2025 |

For more information, see [Azure Functions Python developer guide](../articles/azure-functions/functions-reference-python.md).
::: zone-end

For information about planned changes to language support, see the [Azure roadmap updates](https://techcommunity.microsoft.com/search?q=functions+roadmap).
