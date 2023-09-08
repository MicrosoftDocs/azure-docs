---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/21/2023
ms.author: glenga
ms.custom: devdivchpfy22
---

## Language support details 

The following table shows which languages supported by Functions can run on Linux or Windows. It also indicates whether your language supports editing in the Azure portal. The language is based on the **Runtime stack** option you choose when [creating your function app in the Azure portal](../articles/azure-functions/functions-create-function-app-portal.md#create-a-function-app). This is the same as the `--worker-runtime` option when using the `func init` command in Azure Functions Core Tools. 

| Language | Runtime stack | Linux | Windows | In-portal editing |
|:--- |:-- |:--|:--- |:--- |
| [C# (in-process model)](../articles/azure-functions/functions-dotnet-class-library.md)|.NET|✓ |✓ | | 
| [C# (isolated process model))](../articles/azure-functions/dotnet-isolated-process-guide.md) |.NET|✓ |✓ | | 
| [C# script](../articles/azure-functions/functions-reference-csharp.md) | .NET | ✓ |✓ |✓ |
| [JavaScript](../articles/azure-functions/functions-reference-node.md?tabs=javascript) | Node.js |✓ |✓ | ✓ |
| [Python](../articles/azure-functions/functions-reference-python.md)<sup>1</sup> | Python |✓ | |✓ |
| [Java](../articles/azure-functions/functions-reference-java.md) | Java |✓ |✓ | |
| [PowerShell](../articles/azure-functions/functions-reference-powershell.md) |PowerShell Core |✓ |✓ |✓ |
| [TypeScript](../articles/azure-functions/functions-reference-node.md?tabs=typescript) | Node.js |✓ |✓ |  |
| [Go/Rust/other](../articles/azure-functions/functions-custom-handlers.md) | Custom Handlers |✓ |✓ | |
 
<sup>1</sup> In-portal editing requires your function to be defined in a function.json file. Because the [Python v2 programming model](../articles/azure-functions/functions-reference-python.md?pivots=python-mode-decorators#programming-model) uses Python code decorators instead of function.json to define functions, only the Python v1 programming model is supported for in-portal development.   

For more information on operating system and language support, see [Operating system/runtime support](../articles/azure-functions/functions-scale.md#operating-systemruntime).

When in-portal editing isn't available, you must instead [develop your functions locally](../articles/azure-functions/functions-develop-local.md#local-development-environments).
