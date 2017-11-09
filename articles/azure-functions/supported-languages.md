---
title: Supported languages in Azure Functions
description: Learn which languages are supported (GA) and which are experimental or in preview.
services: functions
documentationcenter: na
author: tdykstra
manager: cfowler
editor: ''
tags: ''
ms.service: functions
ms.devlang: dotnet
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/07/2017
ms.author: tdykstra

---
# Supported languages in Azure Functions

This article explains the levels of support offered for languages that you can use with Azure Functions.

## Levels of support

There are three levels of support:

* **Generally available (GA)** - Fully supported and approved for production use.
* **Preview** - Not yet supported but is expected to reach GA status in the future.
* **Experimental** - Not supported and might be abandoned in the future; no guarantee of eventual preview or GA status.

## Languages supported in v1 and v2

[Two versions of the Azure Functions runtime](functions-versions.md) are available. The v1 runtime is GA. It's the only runtime that is approved for production applications. The v2 runtime is currently in preview, so the languages it supports are in preview. The following table shows which languages are supported in each runtime version.

[!INCLUDE [functions-supported-languages](../../includes/functions-supported-languages.md)]

### Experimental languages

The experimental languages in v1 don't scale well and don't support all bindings. For example, Python is slow because the Functions runtime runs *python.exe* with each function invocation. And while Python supports HTTP bindings, it can't access the request object.

Experimental support for PowerShell is limited to version 4.0 because that is what's installed on the VMs that Function apps run on. If you want to run PowerShell scripts, consider [Azure Automation](https://azure.microsoft.com/en-us/services/automation/).

The v2 runtime doesn't support experimental languages. In v2 we will add support for a language only when it scales well and supports advanced triggers.

If you want to use one of the languages that are only available in v1, stay on the v1 runtime. But don't use experimental languages for anything that you rely on, as there is no official support for them. You can request help by [creating GitHub issues](https://github.com/Azure/azure-webjobs-sdk-script/issues), but support cases should not be opened for problems with experimental languages. 

### Language extensibility

The v2 runtime is designed to offer [language extensibility](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Language-Extensibility). Among the first languages to be based on this extensibility model is Java, which is in preview in v2.

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