---
title: Supported languages in Azure Functions
description: Learn which languages are supported for developing your Functions in Azure, the support level of the various language versions, and potential end-of-support dates.
ms.topic: conceptual
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.date: 08/27/2023
zone_pivot_groups: programming-languages-set-functions
---

# Supported languages in Azure Functions

This article explains the levels of support offered for your preferred language when using Azure Functions. It also describes strategies for creating functions using languages not natively supported.

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages by runtime version 

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)] 

## Language support details 

The following table shows which languages supported by Functions can run on Linux or Windows. It also indicates whether your language supports editing in the Azure portal. The language is based on the **Runtime stack** option you choose when [creating your function app in the Azure portal](functions-create-function-app-portal.md#create-a-function-app). This is the same as the `--worker-runtime` option when using the `func init` command in Azure Functions Core Tools. 

| Language | Runtime stack | Linux | Windows | In-portal editing |
|:--- |:-- |:--|:--- |:--- |
| [C# (isolated worker model)](dotnet-isolated-process-guide.md) |.NET|✓ |✓ | | 
| [C# (in-process model)](functions-dotnet-class-library.md)|.NET|✓ |✓ | | 
| [C# script](functions-reference-csharp.md) | .NET | ✓ |✓ |✓ |
| [JavaScript](functions-reference-node.md?tabs=javascript) | Node.js |✓ |✓ | ✓ |
| [Python](functions-reference-python.md) | Python |✓ |X|✓ <sup>1</sup> |
| [Java](functions-reference-java.md) | Java |✓ |✓ | |
| [PowerShell](functions-reference-powershell.md) |PowerShell Core |✓ |✓ |✓ |
| [TypeScript](functions-reference-node.md?tabs=typescript) | Node.js |✓ |✓ |  |
| [Go/Rust/other](functions-custom-handlers.md) | Custom Handlers |✓ |✓ | |
 
For more information on operating system and language support, see [Operating system/runtime support](functions-scale.md#operating-systemruntime).

When in-portal editing isn't available, you must instead [develop your functions locally](functions-develop-local.md#local-development-environments).

<sup>1</sup> Python in-portal editing is only supported when running in the Consumption plan.

### Language major version support

Azure Functions provides a guarantee of support for the major versions of supported programming languages. For most languages, there are minor or patch versions released to update a supported major version. Examples of minor or patch versions include such as Python 3.9.1 and Node 14.17. After new minor versions of supported languages become available, the minor versions used by your functions apps are automatically upgraded to these newer minor or patch versions. 

> [!NOTE]
>Because Azure Functions can remove the support of older minor versions at any time after a new minor version is available, you shouldn't pin your function apps to a specific minor/patch version of a programming language.  

## Custom handlers

Custom handlers are lightweight web servers that receive events from the Azure Functions host. Any language that supports HTTP primitives can implement a custom handler. This means that custom handlers can be used to create functions in languages that aren't officially supported. To learn more, see [Azure Functions custom handlers](functions-custom-handlers.md).

## Language extensibility

Starting with version 2.x, the runtime is designed to offer [language extensibility](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Language-Extensibility). The JavaScript and Java languages in the 2.x runtime are built with this extensibility.

::: zone pivot="programming-language-python"
## ODBC driver support
This table indicates the ODBC driver support for your Python functions:

| Driver version | Python version |
| ---- | ---- |
| ODBC driver 18 | ≥ Python 3.11 |
| ODBC driver 17 | ≤ Python 3.10 |

::: zone-end
## Next steps  
::: zone pivot="programming-language-csharp"  
### [Isolated worker model](#tab/isolated-process)

> [!div class="nextstepaction"]
> [.NET isolated worker process reference](dotnet-isolated-process-guide.md).

### [In-process model](#tab/in-process)

> [!div class="nextstepaction"]
> [In-process C# developer reference](functions-dotnet-class-library.md)   

---

::: zone-end
::: zone pivot="programming-language-java"
> [!div class="nextstepaction"]
> [Java developer reference](functions-reference-java.md)
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
> [!div class="nextstepaction"]
> [Node.js developer reference](functions-reference-node.md?tabs=javascript)
::: zone-end
::: zone pivot="programming-language-powershell"
> [!div class="nextstepaction"]
> [PowerShell developer reference](functions-reference-powershell.md)
::: zone-end
::: zone pivot="programming-language-python"
> [!div class="nextstepaction"]
> [Python developer reference](functions-reference-python.md)
::: zone-end
