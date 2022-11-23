---
title: Azure Tables bindings for Azure Functions
description: Understand how to use Azure Tables bindings in Azure Functions.
ms.topic: reference
ms.date: 11/11/2022
ms.custom: devx-track-csharp, devx-track-python, ignite-2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---
 
# Azure Tables bindings for Azure Functions

Azure Functions integrates with [Azure Tables](../cosmos-db/table/introduction.md) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Azure Tables allows you to build functions that read and write data using [Azure Cosmos DB for Table](../cosmos-db/table/introduction.md) and [Azure Table Storage](../storage/tables/table-storage-overview.md).

| Action | Type |
|---------|---------|
| Read table data in a function | [Input binding](./functions-bindings-storage-table-input.md) |
| Allow a function to write table data |[Output binding](./functions-bindings-storage-table-output.md) |

::: zone pivot="programming-language-csharp"
## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The process for installing the extension varies depending on the extension version:

<a name="storage-extension"></a>
<a name="table-api-extension"></a>

# [Azure Tables extension](#tab/table-api/in-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [`Azure.Data.Tables`](/dotnet/api/azure.data.tables). It also introduces the ability to use Azure Cosmos DB for Table.

This extension is available by installing the [Microsoft.Azure.WebJobs.Extensions.Tables NuGet package][table-api-package] into a project using version 5.x or higher of the extensions for [blobs](./functions-bindings-storage-blob.md?tabs=in-process%2Cextensionv5) and [queues](./functions-bindings-storage-queue.md?tabs=in-process%2Cextensionv5).

Using the .NET CLI:

```dotnetcli
# Install the Azure Tables extension
dotnet add package Microsoft.Azure.WebJobs.Extensions.Tables --version 1.0.0

# Update the combined Azure Storage extension (to a version which no longer includes Azure Tables)
dotnet add package Microsoft.Azure.WebJobs.Extensions.Storage --version 5.0.0
``` 

[!INCLUDE [functions-bindings-storage-extension-v5-tables-note](../../includes/functions-bindings-storage-extension-v5-tables-note.md)]

# [Combined Azure Storage extension](#tab/storage-extension/in-process)

Working with the bindings requires that you reference the appropriate NuGet package. Tables are included in a combined package for Azure Storage. Install the [Microsoft.Azure.WebJobs.Extensions.Storage NuGet package][storage-4.x], version 3.x or 4.x. 

> [!NOTE]
> Tables have been moved out of this package starting in its 5.x version. You need to instead use version 4.x of the extension NuGet package or additionally include the [Azure Tables extension](#table-api-extension) when using version 5.x.

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

# [Azure Tables extension](#tab/table-api/isolated-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [`Azure.Data.Tables`](/dotnet/api/azure.data.tables). It also introduces the ability to use Azure Cosmos DB for Table.

This extension is available by installing the [Microsoft.Azure.Functions.Worker.Extensions.Tables NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Tables) into a project using version 5.x or higher of the extensions for [blobs](./functions-bindings-storage-blob.md?tabs=isolated-process%2Cextensionv5) and [queues](./functions-bindings-storage-queue.md?tabs=isolated-process%2Cextensionv5).

Using the .NET CLI:

```dotnetcli
# Install the Azure Tables extension
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Tables --version 1.0.0

# Update the combined Azure Storage extension (to a version which no longer includes Azure Tables)
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Storage --version 5.0.0
``` 

[!INCLUDE [functions-bindings-storage-extension-v5-isolated-worker-tables-note](../../includes/functions-bindings-storage-extension-v5-isolated-worker-tables-note.md)]

# [Combined Azure Storage extension](#tab/storage-extension/isolated-process)

Tables are included in a combined package for Azure Storage. Install the [Microsoft.Azure.Functions.Worker.Extensions.Storage NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/4.0.4), version 4.x. 

> [!NOTE]
> Tables have been moved out of this package starting in its 5.x version. You need to instead use version 4.x of the extension NuGet package or additionally include the [Azure Tables extension](#table-api-extension) when using version 5.x.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process.

# [Azure Tables extension (preview)](#tab/table-api/csharp-script)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

You can add this version of the extension from the extension bundle v3 by adding or replacing the following code in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

# [Combined Azure Storage extension](#tab/storage-extension/csharp-script)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Azure Tables bindings are part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the bindings, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

You can add this version of the extension from the extension bundle v3 by adding or replacing the following code in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functions1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end
## Next steps

- [Read table data when a function runs](./functions-bindings-storage-table-input.md)
- [Write table data from a function](./functions-bindings-storage-table-output.md)

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage
[storage-4.x]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/4.0.5
[storage-5.x]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/5.0.0
[table-api-package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Tables/

[extension bundle]: ./functions-bindings-register.md#extension-bundles

[Update your extensions]: ./functions-bindings-register.md
