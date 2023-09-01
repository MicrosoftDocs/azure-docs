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

### [Isolated process](#tab/isolated-process)

Your function code runs in a separate .NET worker process. Use with [supported versions of .NET and .NET Framework](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). To learn more, see [Develop .NET isolated worker process functions](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [In-process](#tab/in-process)

Your function code runs in the same process as the Functions host process. Supports only [Long Term Support (LTS) versions of .NET](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions). To learn more, see [Develop .NET class library functions](../articles/azure-functions/functions-dotnet-class-library.md).  

---

### [v4.x](#tab/v4/in-process)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| .NET 6 (LTS) | GA | `<<TBD>>` |

For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). Also supports [C# script functions](../articles/azure-functions/functions-reference-csharp.md).

### [v1.x](#tab/v1/in-process)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| .NET Framework 4.8 | GA | `<<TBD>>` |
 
For more information, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). Also supports [C# script functions](../articles/azure-functions/functions-reference-csharp.md).

### [v4.x](#tab/v4/isolated-process)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| .NET 8 | Preview<sup>*</sup> | `<<TBD>>` |
| .NET 7 | GA | `<<TBD>>` |
| .NET 6 (LTS) | GA | `<<TBD>>` |
| .NET Framework 4.8 | GA | `<<TBD>>` |

<sup>*</sup> Preview support for .NET 8 function apps is currently limited to Linux applications. To develop using .NET 8 Preview SDKs in Visual Studio, you must use [Visual Studio 2022 Preview](https://visualstudio.microsoft.com/vs/preview/).

For more information, see [Guide for running C# Azure Functions in an isolated worker process](../articles/azure-functions/dotnet-isolated-process-guide.md).

### [v1.x](#tab/v1/isolated-process)

Running C# functions in an isolated worker process isn't supported by version 1.x of the Functions runtime. Instead choose the **In-process** tab or choose **v4.x**. 

--- 

::: zone-end
::: zone pivot="programming-language-java"  
The following table shows the language versions supported for Java functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| Java 17 | GA | `<<TBD>>` |
| Java 11 | GA | `<<TBD>>` |
| Java 8 | GA | `<<TBD>>` |

For more information, see [Azure Functions Java developer guide](../articles/azure-functions/functions-reference-java.md).

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
The following table shows the runtime and language versions supported for Node.js functions. Select your preferred development language at the top of the article.

### [v4.x](#tab/v4)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| Node.js 18 | GA | `<<TBD>>` |
| Node.js 16 | GA | `<<TBD>>` |
| Node.js 14 | GA | `<<TBD>>` |

### [v1.x](#tab/v1)

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| Node.js 6 | GA | `<<TBD>>` |
 
---

TypeScript is supported through transpiling to JavaScript. For more information, see the [Azure Functions Node.js developer guide](../articles/azure-functions/functions-reference-node.md#supported-versions).
::: zone-end  
::: zone pivot="programming-language-powershell"  
The following table shows the language version supported for PowerShell functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| PowerShell 7.2 | GA | `<<TBD>>` |

For more information, see [Azure Functions PowerShell developer guide](../articles/azure-functions/functions-reference-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
The following table shows the language versions supported for Python functions. Select your preferred development language at the top of the article.

| Supported version | Support level | Expected community EOL date |
| ---- | ---- |--- |
| Python 3.11 | Preview | N/A |
| Python 3.10 | GA |`<<TBD>>` |
| Python 3.9 | GA | `<<TBD>>` |
| Python 3.8 | GA | `<<TBD>>` |
| Python 3.7 | GA | `<<TBD>>` |

For more information, see [Azure Functions Python developer guide](../articles/azure-functions/functions-reference-python.md#python-version).
::: zone-end

For information about planned changes to language support, see [Azure roadmap](https://azure.microsoft.com/roadmap/?tag=functions).