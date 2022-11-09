---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/6/2022
ms.author: glenga
ms.custom: include file
---

|Language                                 |1.x         |2.x| 3.x | 4.x |
|-----------------------------------------|------------|---| --- | --- |
|[C#](../articles/azure-functions/functions-dotnet-class-library.md)|GA (.NET Framework 4.8)|GA (.NET Core 2.1<sup>1</sup>)| GA (.NET Core 3.1)<br/>[GA (.NET 5.0)](../articles/azure-functions/dotnet-isolated-process-guide.md) | GA (.NET 6.0)<br/>[Preview (.NET 7)](../articles/azure-functions/dotnet-isolated-process-guide.md)<br/>[GA (.NET Framework 4.8)](../articles/azure-functions/dotnet-isolated-process-guide.md) |
|[JavaScript](../articles/azure-functions/functions-reference-node.md#node-version)|GA (Node.js 6)|GA (Node.js 10 & 8)| GA (Node.js 14, 12, & 10) | GA (Node.js 14)<br/>GA (Node.js 16)<br/>Preview (Node.js 18) |
|[F#](../articles/azure-functions/functions-reference-fsharp.md)|GA (.NET Framework 4.8)|GA (.NET Core 2.1<sup>1</sup>)| GA (.NET Core 3.1) | GA (.NET 6.0) |
|[Java](../articles/azure-functions/functions-reference-java.md)|N/A|GA (Java 8)| GA (Java 11 & 8)| GA (Java 11 & 8) <br/> Preview (Java 17)|
|[PowerShell](../articles/azure-functions/functions-reference-powershell.md) |N/A|N/A| GA (PowerShell 7.0)| GA (PowerShell 7.0, 7.2)|
|[Python](../articles/azure-functions/functions-reference-python.md#python-version)|N/A|GA (Python 3.7)| GA (Python 3.9, 3.8, 3.7)| GA (Python 3.9, 3.8, 3.7)|
|[TypeScript](../articles/azure-functions/functions-reference-node.md#typescript)<sup>2</sup> |N/A|GA| GA | GA |

<sup>1</sup> .NET class library apps targeting runtime version 2.x runs on .NET Core 3.1 in .NET Core 2.x compatibility mode. To learn more, see [Functions v2.x considerations](../articles/azure-functions/functions-dotnet-class-library.md#functions-v2x-considerations).  
<sup>2</sup> Supported through transpiling to JavaScript.

See the language-specific developer guide article for more details about supported language versions.   
For information about planned changes to language support, see [Azure roadmap](https://azure.microsoft.com/roadmap/?tag=functions).
