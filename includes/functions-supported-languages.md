---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/09/2023
ms.author: glenga
ms.custom: include file
---

|Language                                 |1.x         |2.x<sup>1</sup> | 3.x<sup>1</sup> | 4.x |
|-----------------------------------------|------------|---| --- | --- |
|[C#](../articles/azure-functions/functions-dotnet-class-library.md)|GA (.NET Framework 4.8)|GA (.NET Core 2.1)| GA (.NET Core 3.1)<br/> | GA (.NET 6.0)<br/>[GA (.NET 7.0)](../articles/azure-functions/dotnet-isolated-process-guide.md)<br/>[GA (.NET Framework 4.8)](../articles/azure-functions/dotnet-isolated-process-guide.md) |
|[JavaScript](../articles/azure-functions/functions-reference-node.md?tabs=javascript)|GA (Node.js 6)|GA (Node.js 10 & 8)| GA (Node.js 14, 12, & 10) | GA (Node.js 18, 16, & 14) |
|[Java](../articles/azure-functions/functions-reference-java.md)|N/A|GA (Java 8)| GA (Java 11 & 8)| GA (Java 11 & 8) <br/> GA (Java 17)|
|[PowerShell](../articles/azure-functions/functions-reference-powershell.md) |N/A|N/A|N/A| GA (PowerShell 7.2)|
|[Python](../articles/azure-functions/functions-reference-python.md#python-version)|N/A|GA (Python 3.7)| GA (Python 3.9, 3.8, 3.7)| Preview (Python 3.11)<br/>GA (Python 3.10, 3.9, 3.8, 3.7) |
|[TypeScript](../articles/azure-functions/functions-reference-node.md?tabs=typescript)<sup>2</sup> |N/A|GA| GA | GA |

<sup>1</sup> Reached the end of life (EOL) on December 13, 2022. We highly recommend you [migrating your apps to version 4.x](../articles/azure-functions/migrate-version-3-version-4.md) for full support.  
<sup>2</sup> Supported through transpiling to JavaScript.

See the language-specific developer guide article for more details about supported language versions.   
For information about planned changes to language support, see [Azure roadmap](https://azure.microsoft.com/roadmap/?tag=functions).
