---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/01/2023
ms.author: glenga
ms.custom: include file
---
::: zone pivot="programming-language-csharp"
The following table shows the runtime and language versions supported for C# functions. Select your preferred development language at the top of the article. 

The supported version of .NET depends on both your Functions runtime version and your chosen .NET worker process model:

### [Isolated worker model](#tab/isolated-process)

Your function code runs in a separate .NET worker process. Use with [supported versions of .NET and .NET Framework](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). To learn more, see [Develop .NET isolated worker process functions](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [In-process model](#tab/in-process)

Your function code runs in the same process as the Functions host process. Supports only [Long Term Support (LTS) versions of .NET](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions). To learn more, see [Develop .NET class library functions](../articles/azure-functions/functions-dotnet-class-library.md).  

---

### [v4.x](#tab/v4/in-process)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| [.NET 6 (LTS)](https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle) | GA | November 12, 2024 |

For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). Also supports [C# script functions](../articles/azure-functions/functions-reference-csharp.md).

### [v1.x](#tab/v1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](./functions-runtime-1x-retirement-note.md)]

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| .NET Framework 4.8 | GA | [See policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-framework) |
 
For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). Also supports [C# script functions](../articles/azure-functions/functions-reference-csharp.md).

### [v4.x](#tab/v4/isolated-process)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| .NET 8 | Preview<sup>*</sup> | N/A |
| [.NET 7](https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle) | GA | May 14, 2024 |
| [.NET 6 (LTS)](https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle) | GA | November 12, 2024 |
| .NET Framework 4.8 | GA | [See policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-framework)  |

<sup>*</sup> See [Preview .NET versions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#preview-net-versions) for details on support, current restrictions, and instructions for using the preview version.

For more information, see [Guide for running C# Azure Functions in an isolated worker process](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [v1.x](#tab/v1/isolated-process)

Running C# functions in an isolated worker process isn't supported by version 1.x of the Functions runtime. Instead choose the **In-process** tab or choose **v4.x**. 

--- 

::: zone-end
::: zone pivot="programming-language-java"  
The following table shows the language versions supported for Java functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| [Java 17](/java/openjdk/support#release-and-servicing-roadmap) | GA | September 2027 |
| [Java 11](/java/openjdk/support#release-and-servicing-roadmap) | GA | September 2027 |
| [Java 8](https://endoflife.date/eclipse-temurin) | GA | November 30, 2026 |

For more information, see [Azure Functions Java developer guide](../articles/azure-functions/functions-reference-java.md).

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
The following table shows the language versions supported for Node.js functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| [Node.js 20](https://endoflife.date/nodejs) | Preview | April 30, 2026 |
| [Node.js 18](https://endoflife.date/nodejs) | GA | April, 2025|
| [Node.js 16](https://endoflife.date/nodejs) | GA | September 11, 2023<sup>\*</sup> |
| [Node.js 14](https://endoflife.date/nodejs) | GA | April 30, 2023<sup>\*</sup> |

<sup>\*</sup>Support on Functions extended until June 30, 2024.

TypeScript is supported through transpiling to JavaScript. For more information, see the [Azure Functions Node.js developer guide](../articles/azure-functions/functions-reference-node.md#supported-versions).
::: zone-end  
::: zone pivot="programming-language-powershell"  
The following table shows the language version supported for PowerShell functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| [PowerShell 7.2](/powershell/scripting/install/powershell-support-lifecycle#powershell-end-of-support-dates) | GA | November 8, 2024 |

For more information, see [Azure Functions PowerShell developer guide](../articles/azure-functions/functions-reference-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
The following table shows the language versions supported for Python functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| Python 3.11 | GA | N/A |
| Python 3.10 | GA | October, 2026 |
| Python 3.9 | GA | October, 2025 |
| Python 3.8 | GA | October, 2024 |
| Python 3.7 | GA | June 27, 2023<sup>\*</sup> |

<sup>\*</sup>Support on Functions extended until September 30, 2023.

For more information, see [Azure Functions Python developer guide](../articles/azure-functions/functions-reference-python.md#python-version).
::: zone-end

For information about planned changes to language support, see [Azure roadmap](https://azure.microsoft.com/roadmap/?tag=functions).