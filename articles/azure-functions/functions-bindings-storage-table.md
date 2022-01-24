---
title: Azure Table storage bindings for Azure Functions
description: Understand how to use Azure Table storage bindings in Azure Functions.
author: craigshoemaker
ms.topic: reference
ms.date: 01/23/2022
ms.author: cshoe
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Table storage bindings for Azure Functions

Azure Functions integrates with [Azure Storage](../storage/index.yml) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Table storage allows you to build functions that read and write Table storage data.

| Action | Type |
|---------|---------|
| Read table storage data in a function | [Input binding](./functions-bindings-storage-table-input.md) |
| Allow a function to write table storage data |[Output binding](./functions-bindings-storage-table-output.md) |

::: zone pivot="programming-language-csharp"
## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running functions on .NET 5.0 in Azure](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Extension 5.x higher](#tab/extensionv5/in-process)

Version 5.x of the Storage extension NuGet package doesn't currently include the Table Storage bindings. If your app requires Table Storage, you need to instead use version 4.x of the extension NuGet package.

# [Functions 2.x and higher](#tab/functionsv2/in-process)

<a name="functions-2x-and-higher"></a>
Working with the bindings requires that you reference the appropriate NuGet package. Install the [NuGet package], version 3.x or 4.x. 

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

Version 5.x of the Storage extension NuGet package doesn't currently include the Table Storage bindings. If your app requires Table Storage, you need to instead use version 4.x of the extension NuGet package.

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages//dotnet/api/microsoft.azure.webjobs.blobattribute), version 3.x.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated process.

# [Extension 5.x and higher](#tab/extensionv5/csharp-script)

Version 3.x of the extension bundle doesn't currently include the Table Storage bindings. If your app requires Table Storage, you need to instead use version 2.x of the extension bundle.

# [Functions 2.x and higher](#tab/functionsv2/csharp-script)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Blob storage binding is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

Version 3.x of the extension bundle doesn't currently include the Table Storage bindings. If your app requires Table Storage, you need to instead use version 2.x of the extension bundle.

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functions1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end
## Next steps

- [Read table storage data when a function runs](./functions-bindings-storage-table-input.md)
- [Write table storage data from a function](./functions-bindings-storage-table-output.md)

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage