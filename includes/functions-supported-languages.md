---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/01/2021
ms.author: glenga
ms.custom: include file
---

|Language                                 |1.x         |2.x| 3.x |
|-----------------------------------------|------------|---| --- |
|[C#](../articles/azure-functions/functions-dotnet-class-library.md)<sup>1</sup>|GA (.NET Framework 4.8)|GA (.NET Core 2.1<sup>2</sup>)| GA (.NET Core 3.1)<br/>[GA (.NET 5.0)](../articles/azure-functions/dotnet-isolated-process-guide.md) |
|[JavaScript](../articles/azure-functions/functions-reference-node.md#node-version)|GA (Node 6)|GA (Node 10 & 8)| GA (Node 14, 12, & 10) |
|[F#](../articles/azure-functions/functions-reference-fsharp.md)|GA (.NET Framework 4.8)|GA (.NET Core 2.1<sup>2</sup>)| GA (.NET Core 3.1) |
|[Java](../articles/azure-functions/functions-reference-java.md)|N/A|GA (Java 8)| GA (Java 11 & 8)|
|[PowerShell](../articles/azure-functions/functions-reference-powershell.md) |N/A|GA (PowerShell Core 6)| GA (PowerShell 7.0 & Core 6)|
|[Python](../articles/azure-functions/functions-reference-python.md#python-version)|N/A|GA (Python 3.7 & 3.6)| GA (Python 3.8, 3.7, & 3.6) <br/> Preview (Python 3.9)|
|[TypeScript](../articles/azure-functions/functions-reference-node.md#typescript) |N/A|GA<sup>3</sup>| GA<sup>3</sup> |

<sup>1</sup> An experimental version of Azure Functions is available that lets you use the .NET 6.0 preview. To learn more, see the [Azure Functions v4 early preview](https://aka.ms/functions-dotnet6earlypreview-wiki) page.
<sup>2</sup> .NET class library apps targeting runtime version 2.x runs on .NET Core 3.1 in .NET Core 2.x compatibility mode. To learn more, see [Functions v2.x considerations](../articles/azure-functions/functions-dotnet-class-library.md#functions-v2x-considerations).  
<sup>3</sup> Supported through transpiling to JavaScript.

See the language-specific developer guide article for more details about supported language versions.   
For information about planned changes to language support, see [Azure roadmap](https://azure.microsoft.com/roadmap/?tag=functions).
