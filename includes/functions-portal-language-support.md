---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/23/2021
ms.author: glenga
---

## Language support details 

The following table shows which languages supported by Functions can run on Linux or Windows. It also indicated whether your language supports editing in the Azure portal. The language is based on the **Runtime stack** option you choose when [creating your function app in the Azure portal](../articles/azure-functions/functions-create-function-app-portal.md#create-a-function-app). 

| Language | Runtime stack | Linux | Windows | In-portal editing |
|:--- |:-- |:--|:--- |:--- |
| [C# class library](../articles/azure-functions/functions-dotnet-class-library.md)<sup>*</sup> |.NET|✓ |✓ | | 
| [C# script](../articles/azure-functions/functions-reference-csharp.md) | .NET | ✓ |✓ |✓ |
| [JavaScript](../articles/azure-functions/functions-reference-node.md) | Node.js |✓ |✓ | ✓ |
| [Python](../articles/azure-functions/functions-reference-python.md) | Python |✓ | | |
| [Java](../articles/azure-functions/functions-reference-java.md) | Java |✓ |✓ | |
| [PowerShell](../articles/azure-functions/functions-reference-powershell.md) |PowerShell Core | |✓ |✓ |
| [TypeScript](../articles/azure-functions/functions-reference-node.md) | Node.js |✓ |✓ |  |
| [Go/Rust/other](../articles/azure-functions/functions-custom-handlers.md) | Custom Handlers |✓ |✓ | |

<sup>*</sup>You can't currently create function apps that run on .NET 5.0 in the portal. To learn more, see [Develop and publish .NET 5 functions using Azure Functions](../articles/azure-functions/dotnet-isolated-process-developer-howtos.md). 

For more details, see [Operating system/runtime support](../articles/azure-functions/functions-scale.md#operating-systemruntime). 

When in-portal editing isn't available, you must instead [develop your functions locally](../articles/azure-functions/functions-develop-local.md#local-development-environments). 
