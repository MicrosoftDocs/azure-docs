---
title: Supported languages in Azure Functions
description: Learn which languages are supported (GA) and which are in preview, and ways to extend Functions development to other languages.
ms.topic: conceptual
ms.date: 11/27/2019

---

# Supported languages in Azure Functions

This article explains the levels of support offered for languages that you can use with Azure Functions. It also describes strategies for creating functions using languages not natively supported.

[!INCLUDE [functions-support-levels](../../includes/functions-support-levels.md)]

## Languages by runtime version 

[Several versions of the Azure Functions runtime](functions-versions.md) are available. The following table shows which languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

[!INCLUDE [functions-portal-language-support](../../includes/functions-portal-language-support.md)]

### Language major version support

Azure Functions provides a guarantee of support for the major versions of supported programming languages. For most languages, there are minor or patch versions released to update a supported major version. Examples of minor or patch versions include such as Python 3.9.1 and Node 14.17. After new minor versions of supported languages become available, the minor versions used by your functions apps are automatically upgraded to these newer minor or patch versions. 

> [!NOTE]
>Because Azure Functions can remove the support of older minor versions at any time after a new minor version is available, you shouldn't pin your function apps to a specific minor/patch version of a programming language.  
>

## Custom handlers

Custom handlers are lightweight web servers that receive events from the Azure Functions host. Any language that supports HTTP primitives can implement a custom handler. This means that custom handlers can be used to create functions in languages that aren't officially supported. To learn more, see [Azure Functions custom handlers](functions-custom-handlers.md).

## Language extensibility

Starting with version 2.x, the runtime is designed to offer [language extensibility](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Language-Extensibility). The JavaScript and Java languages in the 2.x runtime are built with this extensibility.

## Next steps

To learn more about how to develop functions in the supported languages, see the following resources:

+ [C# class library developer reference](functions-dotnet-class-library.md)
+ [C# script developer reference](functions-reference-csharp.md)
+ [Java developer reference](functions-reference-java.md)
+ [JavaScript developer reference](functions-reference-node.md?tabs=javascript)
+ [PowerShell developer reference](functions-reference-powershell.md)
+ [Python developer reference](functions-reference-python.md)
+ [TypeScript developer reference](functions-reference-node.md?tabs=typescript)
