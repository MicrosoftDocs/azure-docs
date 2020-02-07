---
title: Supported languages in Azure Functions
description: Learn which languages are supported (GA) and which are experimental or in preview.
ms.topic: conceptual
ms.date: 11/27/2019

---

# Supported languages in Azure Functions

This article explains the levels of support offered for languages that you can use with Azure Functions.

## Levels of support

There are three levels of support:

* **Generally available (GA)** - Fully supported and approved for production use.
* **Preview** - Not yet supported but is expected to reach GA status in the future.
* **Experimental** - Not supported and might be abandoned in the future; no guarantee of eventual preview or GA status.

## Languages by runtime version 

[Three versions of the Azure Functions runtime](functions-versions.md) are available. The following table shows which languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

### Experimental languages

The experimental languages in version 1.x don't scale well and don't support all bindings.

Don't use experimental features for anything that you rely on, as there is no official support for them. Support cases should not be opened for problems with experimental languages. 

Later runtime versions do not support experimental languages. Support for new languages is added only when the language can be supported in production. 

### Language extensibility

Starting with version 2.x, the runtime is designed to offer [language extensibility](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Language-Extensibility). The JavaScript and Java languages in the 2.x runtime are built with this extensibility.

## Next steps

To learn more about how to develop functions in the supported languages, see the following resources:

+ [C# class library developer reference](functions-dotnet-class-library.md)
+ [C# script developer reference](functions-reference-csharp.md)
+ [Java developer reference](functions-reference-java.md)
+ [JavaScript developer reference](functions-reference-node.md)
+ [PowerShell developer reference](functions-reference-powershell.md)
+ [Python developer reference](functions-reference-python.md)
+ [TypeScript developer reference](functions-reference-node.md#typescript)
