---
title: Supported languages in Azure Functions
description: Learn which languages are supported (GA) and which are experimental or in preview.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
ms.service: azure-functions
ms.devlang: dotnet
ms.topic: reference
ms.date: 08/02/2018
ms.author: glenga

---

# Supported languages in Azure Functions

This article explains the levels of support offered for languages that you can use with Azure Functions.

## Levels of support

There are three levels of support:

* **Generally available (GA)** - Fully supported and approved for production use.
* **Preview** - Not yet supported but is expected to reach GA status in the future.
* **Experimental** - Not supported and might be abandoned in the future; no guarantee of eventual preview or GA status.

## Languages in runtime 1.x and 2.x

[Two versions of the Azure Functions runtime](functions-versions.md) are available. The following table shows which languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

### Experimental languages

The experimental languages in version 1.x don't scale well and don't support all bindings. For example, 1.x Python is slow because the Functions runtime runs *python.exe* with each function invocation. And while Python supports HTTP bindings, it can't access the request object.

Experimental support for PowerShell in 1.x is limited to version 5.1, because that is what's installed by default on the VMs on which function apps run. If you want to run PowerShell scripts, consider [Azure Automation](https://azure.microsoft.com/services/automation/).

Don't use experimental languages for anything that you rely on, as there is no official support for them. Support cases should not be opened for problems with experimental languages. 

The version 2.x runtime doesn't support experimental languages. Support for new languages is added only when the language can be supported in production. 

### Language extensibility

The 2.x runtime is designed to offer [language extensibility](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Language-Extensibility). The JavaScript and Java languages in the 2.x runtime are built with this extensibility.

## Next steps

To learn more about how to use one of the GA or preview languages in Azure Functions, see the following resources:

> [!div class="nextstepaction"]
> [C#](functions-reference-csharp.md)

> [!div class="nextstepaction"]
> [F#](functions-reference-fsharp.md)

> [!div class="nextstepaction"]
> [JavaScript](functions-reference-node.md)

> [!div class="nextstepaction"]
> [Java](functions-reference-java.md)
