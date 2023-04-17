---
title: Dapr trigger and bindings for Azure Functions
description: Learn to use the Dapr trigger and bindings in Azure Functions.

ms.topic: reference
ms.date: 04/17/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr trigger and bindings for Azure Functions

Azure Functions integrates with [Azure Storage](../storage/index.yml) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Blob storage allows you to build functions that react to changes in blob data as well as read and write values.

| Action | Type |
|---------|---------|
| Trigger on a Dapr binding, service invocation, or topic subscription | [Trigger](./functions-bindings-dapr-trigger.md) |
| Pull in Dapr state and secrets | [Input binding](./functions-bindings-dapr-input.md) |
| Send a value to a Dapr topic or output binding |[Output binding](./functions-bindings-storage-blob-output.md) |


::: zone pivot="programming-language-csharp"

## Install extension
The extension NuGet package you install depends on the C# mode you're using in your function app:

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

---

The functionality of the extension varies depending on the extension version:

# [Extension 5.x and higher](#tab/extensionv5/in-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs). Learn more about how these new types are different from `WindowsAzure.Storage` and `Microsoft.Azure.Storage` and how to migrate to them from the [Azure.Storage.Blobs Migration Guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md).

This extension is available by installing the [Microsoft.Azure.WebJobs.Extensions.Storage.Blobs NuGet package], version 5.x.

Using the .NET CLI:

```dotnetcli
NuGet\Install-Package Dapr.AzureFunctions.Extension -Version 0.10.0-preview01
``` 

[!INCLUDE [functions-bindings-storage-extension-v5-tables-note](../../includes/functions-bindings-storage-extension-v5-tables-note.md)]

# [Functions 2.x and higher](#tab/functionsv2/in-process)

Working with the trigger and bindings requires that you reference the appropriate NuGet package. Install the [Microsoft.Azure.WebJobs.Extensions.Storage NuGet package, version 4.x]. The package is used for .NET class libraries while the extension bundle is used for all other application types.

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs). Learn more about how these new types are different from `WindowsAzure.Storage` and `Microsoft.Azure.Storage` and how to migrate to them from the [Azure.Storage.Blobs Migration Guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md).

Add the extension to your project by installing the [Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs NuGet package], version 5.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs --version 5.0.0
``` 

[!INCLUDE [functions-bindings-storage-extension-v5-isolated-worker-tables-note](../../includes/functions-bindings-storage-extension-v5-isolated-worker-tables-note.md)]

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [Microsoft.Azure.Functions.Worker.Extensions.Storage NuGet package, version 4.x].

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process.

---


::: zone-end

::: zone pivot="programming-language-java"

::: zone-end

::: zone pivot="programming-language-javascript"

::: zone-end

::: zone pivot="programming-language-powershell"

::: zone-end

::: zone pivot="programming-language-python"

<!-- Do the manual func install extension stuff here. -->
::: zone-end

Next steps
<!--Use the next step links from the original article.-->