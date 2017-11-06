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

This article explains the levels of support offered for languages that you can use with the Azure Functions runtime.

## Levels of support

There are three levels of support:

* **Generally available (GA)** - Fully supported and approved for production use.
* **Preview** - Not yet supported but is expected to reach GA status in the future.
* **Experimental** - Not supported and might be abandoned in the future; no guarantee of eventual preview or GA status.

  >[!NOTE] 
  > Don't use experimental languages for anything that you rely on, as there is no official support for them.  You can request help by [creating GitHub issues](https://github.com/Azure/azure-webjobs-sdk-script/issues), but support cases should not be opened for problems with experimental languages. 

## Functions v1 runtime

The [v1 runtime](functions-versions.md) is GA. It is the only runtime that is approved for production applications.

### Supported languages

The following languages have GA status in v1:

* [C#](functions-reference-csharp.md)
* [JavaScript](functions-reference-node.md)
* [F#](functions-reference-fsharp.md)

### Experimental languages

The following languages are experimental in v1:

* **Python** - Does not scale well under load because an instance of *python.exe* is launched on every function invocation. Also, Python in v1 has poor support for Functions bindings and can't access the HTTP request object.
* **PHP** - Works the same way as Python, so the same comment about scaling applies.
* **PowerShell** - The VMs that Function apps run on have PowerShell 4.0 installed. There is no plan to upgrade the PowerShell version.
* **Batch (.cmd, .bat)**
* **TypeScript** 
* **Bash**

## Functions v2 runtime (preview)

The [v2 runtime](functions-versions.md) is currently in preview, so the languages it supports are in preview.

### Preview languages

The following languages are in preview in v2:

* [C#](functions-reference-csharp.md)
* [JavaScript](functions-reference-node.md)
* [Java](functions-reference-java.md).

Support for [F#](functions-reference-fsharp.md) will be added later.

### Experimental languages
 
No experimental languages are supported in v2. We decided to add support only for languages that can scale well and support advanced triggers. We're working on a new architecture for Python that will enable it to meet these requirements.

If you want to use one of the experimental languages, you can continue using the v1 runtime, but be aware of the warning mentioned [earlier](#levels-of-support).

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