---
title: Supported Languages in Azure Functions
description: Find out which languages are supported for developing function apps in Azure, the support level of the various language versions, and end-of-support dates.
ms.topic: concept-article
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
ms.date: 08/21/2025
zone_pivot_groups: programming-languages-set-functions
# customer intent: As a developer, I want to find information about Azure Functions support for languages and language versions so that I can check whether my function app code is supported and stay informed about when I need to update it.
---

# Supported languages in Azure Functions

This article explains the levels of support offered for your preferred language when you use Azure Functions. It also describes strategies for creating function apps when you use languages that aren't natively supported.

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages by runtime version

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)] 

## Language support details

The following table shows which languages supported by Functions can run on Linux or Windows. It also indicates whether there's support for editing each language in the Azure portal. The language is based on the **Runtime stack** option you select when you [create your function app in the Azure portal](functions-create-function-app-portal.md#create-a-function-app). This value is the same as the `--worker-runtime` option that you specify when you use the `func init` command in Azure Functions Core Tools.

| Language | Runtime stack | Linux | Windows | In-portal editing<sup>1</sup> |
|:--- |:-- |:--|:--- |:--- |
| [C# (isolated worker model)](dotnet-isolated-process-guide.md) |.NET|✓ |✓ | |
| [C# (in-process model)](functions-dotnet-class-library.md)|.NET|✓ |✓ | <sup>2</sup> |
| [JavaScript](functions-reference-node.md?tabs=javascript) | Node.js |✓ |✓ | ✓ |
| [Python](functions-reference-python.md) | Python |✓ |X|✓ <sup>1</sup> |
| [Java](functions-reference-java.md) | Java |✓ |✓ | |
| [PowerShell](functions-reference-powershell.md) |PowerShell Core |✓ |✓ |✓ |
| [TypeScript](functions-reference-node.md?tabs=typescript) | Node.js |✓ |✓ |  |
| [Go/Rust/other](functions-custom-handlers.md) | Custom Handlers |✓ |✓ | |

1. In-portal editing isn't currently supported when running in the [Flex Consumption plan](./flex-consumption-plan.md). When in-portal editing isn't available, you must instead [develop your function apps locally](functions-develop-local.md#local-development-environments).
2. Although we recommend local development for C# apps, you can use the portal to develop and test C# script functions that use the in-process model. For more information, see [Create a C# script app](functions-reference-csharp.md#create-a-c-script-app).
3. In-portal editing for Python is only supported when running in the Consumption plan. 
 
[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]

For more information on operating system and language support, see [Operating system support](functions-scale.md#operating-systemruntime).

For more information about how to maintain full-support coverage while running your function apps in Azure, see [Azure Functions language stack support policy](language-support-policy.md).

### Language major version support

Functions provides a guarantee of support for the major versions of supported programming languages. For most languages, there are minor or patch versions released to update a supported major version. Examples of minor or patch versions include Python 3.9.1 and Node 14.17. After new minor versions of supported languages become available, the minor versions used by your function apps are automatically upgraded to these newer minor or patch versions.

> [!NOTE]
> Functions can remove the support of older minor versions after a new minor version is available. For this reason, you shouldn't pin your function apps to a specific minor or patch version of a programming language.  

## Custom handlers

Custom handlers are lightweight web servers that receive events from the Functions host. You can implement a custom handler in any language that supports HTTP primitives. As a result, you can use custom handlers to create function apps in languages that aren't officially supported. For more information, see [Azure Functions custom handlers](functions-custom-handlers.md).

## Language extensibility

The Functions runtime is designed to offer [language extensibility](https://github.com/Azure/azure-functions-host/wiki/Language-Extensibility). The JavaScript, Java, and Python languages are built with this extensibility.

::: zone pivot="programming-language-python"
## ODBC driver support

The following table lists the support that Open Database Connectivity (ODBC) driver versions offer for Python function apps:

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