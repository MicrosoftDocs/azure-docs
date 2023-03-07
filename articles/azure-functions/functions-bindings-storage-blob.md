---
title: Azure Blob storage trigger and bindings for Azure Functions
description: Learn to use the Azure Blob storage trigger and bindings in Azure Functions.

ms.topic: reference
ms.date: 11/11/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Blob storage bindings for Azure Functions overview

Azure Functions integrates with [Azure Storage](../storage/index.yml) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Blob storage allows you to build functions that react to changes in blob data as well as read and write values.

| Action | Type |
|---------|---------|
| Run a function as blob storage data changes | [Trigger](./functions-bindings-storage-blob-trigger.md) |
| Read blob storage data in a function | [Input binding](./functions-bindings-storage-blob-input.md) |
| Allow a function to write blob storage data |[Output binding](./functions-bindings-storage-blob-output.md) |

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

The functionality of the extension varies depending on the extension version:

# [Extension 5.x and higher](#tab/extensionv5/in-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs). Learn more about how these new types are different from `WindowsAzure.Storage` and `Microsoft.Azure.Storage` and how to migrate to them from the [Azure.Storage.Blobs Migration Guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md).

This extension is available by installing the [Microsoft.Azure.WebJobs.Extensions.Storage.Blobs NuGet package], version 5.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.WebJobs.Extensions.Storage.Blobs --version 5.0.0
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

# [Extension 5.x and higher](#tab/extensionv5/csharp-script)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This extension version is available from the extension bundle v3 by adding the following lines in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

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

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

You can add this version of the extension from the extension bundle v3 by adding or replacing the following code in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functions1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end

::: zone pivot="programming-language-csharp"
## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [In-process class library](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  
   
# [C# script](#tab/csharp-script)

C# script is used primarily when creating C# functions in the Azure portal.

---

Choose a version to see binding type details for the mode and version. 

# [Extension 5.x and higher](#tab/extensionv5/in-process)

The Azure Blobs extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Blob trigger | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[BlobClient]<sup>1</sup><br/>[BlockBlobClient]<sup>1</sup><br/>[PageBlobClient]<sup>1</sup><br/>[AppendBlobClient]<sup>1</sup><br/>[BlobBaseClient]<sup>1</sup>|
| Blob input | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[BlobClient]<sup>1</sup><br/>[BlockBlobClient]<sup>1</sup><br/>[PageBlobClient]<sup>1</sup><br/>[AppendBlobClient]<sup>1</sup><br/>[BlobBaseClient]<sup>1</sup><br/>`IEnumerable<T>`<sup>2</sup>|
| Blob output |[Stream]<br/>`TextWriter`<br/>`string`<br/>`byte[]` |

<sup>1</sup> The client types require the `Access` property of the attribute to be set to `FileAccess.ReadWrite`.

<sup>2</sup> `IEnumerable<T>` provides an enumeration of blobs in the container. Here, `T` can be any of the other supported types.

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Blobs#examples). Learn more about these new types are different and how to migrate to them from the [Azure.Storage.Blobs Migration Guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/storage/Azure.Storage.Blobs/AzureStorageNetMigrationV12.md).

# [Functions 2.x and higher](#tab/functionsv2/in-process)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.Storage.Blob] namespace. Newer types from [Azure.Storage.Blobs] are exclusive to **extension 5.x and higher**.

This version of the Azure Blobs extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Blob trigger | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob input | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob output |[Stream]<br/>`TextWriter`<br/>`string`<br/>`byte[]` |

<sup>1</sup> These types require the `Access` property of the attribute to be set to `FileAccess.ReadWrite`.

<sup>2</sup> `IEnumerable<T>` provides an enumeration of blobs in the container. Here, `T` can be any of the other supported types.

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x exposed types from the now deprecated [Microsoft.Azure.Storage.Blob] namespace. Newer types from [Azure.Storage.Blobs] are exclusive to later host versions with **extension 5.x and higher**.

Functions 1.x supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Blob trigger | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob input | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob output |[Stream]<br/>`TextWriter`<br/>`string`<br/>`byte[]` |

<sup>1</sup> These types require the `Access` property of the attribute to be set to `FileAccess.ReadWrite`.

<sup>2</sup> `IEnumerable<T>` provides an enumeration of blobs in the container. Here, `T` can be any of the other supported types.

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

The isolated worker process supports parameter types according to the table below. Binding to string parameters is currently the only option that is generally available. Support for binding to `Byte[]`, to `Stream`, and to types from [Azure.Storage.Blobs] is in preview.

| Binding | Parameter types | Preview parameter types<sup>1</sup> |
|-|-|-| 
| Blob trigger | `string` | `Byte[]`<br/>[Stream]<br/>[BlobClient]<br/>[BlockBlobClient]<br/>[PageBlobClient]<br/>[AppendBlobClient]<br/>[BlobBaseClient]<br/>[BlobContainerClient]<br/>JSON serializable types<sup>2</sup>|
| Blob input | `string` | `Byte[]`<br/>[Stream]<br/>[BlobClient]<br/>[BlockBlobClient]<br/>[PageBlobClient]<br/>[AppendBlobClient]<br/>[BlobBaseClient]<br/>[BlobContainerClient]<sup>3</sup><br/>JSON serializable types<sup>2</sup>|
| Blob output | `string` | No preview types<sup>4</sup> |

<sup>1</sup> Preview types require use of [Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs 5.1.0-preview1 or later][sdk-types-extension-version], [Microsoft.Azure.Functions.Worker 1.12.1-preview1 or later][sdk-types-worker-version], and [Microsoft.Azure.Functions.Worker.Sdk 1.9.0-preview1 or later][sdk-types-worker-sdk-version]. When developing on your local machine, you will need [Azure Functions Core Tools version 4.0.5000 or later](./functions-run-local.md). Collections of preview types, such as arrays and `IEnumerable<T>`, are not supported. When using a preview type, [binding expressions](./functions-bindings-expressions-patterns.md) that rely on trigger data are not supported.

[sdk-types-extension-version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs/5.1.0-preview1
[sdk-types-worker-version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/1.12.1-preview1
[sdk-types-worker-sdk-version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/1.9.0-preview1

<sup>2</sup> Blobs containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

<sup>3</sup> The `BlobPath` configuration for an input binding to [BlobContainerClient] currently requires the presence of a blob name. It is not sufficient to provide just the container name. A placeholder value may be used and will not change the behavior. For example, setting `[BlobInput("samples-workitems/placeholder.txt")] BlobContainerClient containerClient` does not consider whether any `placeholder.txt` exists or not, and the client will work with the overall "samples-workitems" container.

<sup>4</sup> Support for SDK type bindings does not presently extend to output bindings.

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Earlier versions of extensions in the isolated worker process only support binding to string parameters. Additional options are available to **extension 5.x and higher**.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process.

# [Extension 5.x and higher](#tab/extensionv5/csharp-script)

The Azure Blobs extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Blob trigger | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[BlobClient]<sup>1</sup><br/>[BlockBlobClient]<sup>1</sup><br/>[PageBlobClient]<sup>1</sup><br/>[AppendBlobClient]<sup>1</sup><br/>[BlobBaseClient]<sup>1</sup>|
| Blob input | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[BlobClient]<sup>1</sup><br/>[BlockBlobClient]<sup>1</sup><br/>[PageBlobClient]<sup>1</sup><br/>[AppendBlobClient]<sup>1</sup><br/>[BlobBaseClient]<sup>1</sup><br/>`IEnumerable<T>`<sup>2</sup>|
| Blob output |[Stream]<br/>`TextWriter`<br/>`string`<br/>`byte[]` |

<sup>1</sup> The client types require the `Access` property of the attribute to be set to `FileAccess.ReadWrite`.

<sup>2</sup> `IEnumerable<T>` provides an enumeration of blobs in the container. Here, `T` can be any of the other supported types.

# [Functions 2.x and higher](#tab/functionsv2/csharp-script)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.Storage.Blob] namespace. Newer types from [Azure.Storage.Blobs] are exclusive to **extension 5.x and higher**.

This version of the Azure Blobs extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Blob trigger | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob input | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob output |[Stream]<br/>`TextWriter`<br/>`string`<br/>`byte[]` |

<sup>1</sup> These types require the `Access` property of the attribute to be set to `FileAccess.ReadWrite`.

<sup>2</sup> `IEnumerable<T>` provides an enumeration of blobs in the container. Here, `T` can be any of the other supported types.

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x exposed types from the now deprecated [Microsoft.Azure.Storage.Blob] namespace. Newer types from [Azure.Storage.Blobs] are exclusive to later host versions with **extension 5.x and higher**.

Functions 1.x supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Blob trigger | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob input | [Stream]<br/>`TextReader`<br/>`string`<br/>`byte[]`<br/>[ICloudBlob]<sup>1</sup><br/>[CloudBlockBlob]<sup>1</sup><br/>[CloudPageBlob]<sup>1</sup><br/>[CloudAppendBlob]<sup>1</sup>|
| Blob output |[Stream]<br/>`TextWriter`<br/>`string`<br/>`byte[]` |

<sup>1</sup> These types require the `Access` property of the attribute to be set to `FileAccess.ReadWrite`.

<sup>2</sup> `IEnumerable<T>` provides an enumeration of blobs in the container. Here, `T` can be any of the other supported types.

---

[Stream]: /dotnet/api/system.io.stream

[Azure.Storage.Blobs]: /dotnet/api/azure.storage.blobs
[BlobClient]: /dotnet/api/azure.storage.blobs.blobclient
[BlockBlobClient]: /dotnet/api/azure.storage.blobs.specialized.blockblobclient
[PageBlobClient]: /dotnet/api/azure.storage.blobs.specialized.pageblobclient
[AppendBlobClient]: /dotnet/api/azure.storage.blobs.specialized.appendblobclient
[BlobBaseClient]: /dotnet/api/azure.storage.blobs.specialized.blobbaseclient
[BlobContainerClient]: /dotnet/api/azure.storage.blobs.blobcontainerclient

[Microsoft.Azure.Storage.Blob]: /dotnet/api/microsoft.azure.storage.blob
[ICloudBlob]: /dotnet/api/microsoft.azure.storage.blob.icloudblob
[CloudBlockBlob]: /dotnet/api/microsoft.azure.storage.blob.cloudblockblob
[CloudPageBlob]: /dotnet/api/microsoft.azure.storage.blob.cloudpageblob
[CloudAppendBlob]: /dotnet/api/microsoft.azure.storage.blob.cloudappendblob

:::zone-end

## host.json settings

This section describes the function app configuration settings available for functions that use this binding. These settings only apply when using extension version 5.0.0 and higher. The example host.json file below contains only the version 2.x+ settings for this binding. For more information about function app configuration settings in versions 2.x and later versions, see [host.json reference for Azure Functions](functions-host-json.md).

> [!NOTE]
> This section doesn't apply to extension versions before 5.0.0. For those earlier versions, there aren't any function app-wide configuration settings for blobs.

```json
{
    "version": "2.0",
    "extensions": {
        "blobs": {
            "maxDegreeOfParallelism": 4
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|maxDegreeOfParallelism|8 * (the number of available cores)|The integer number of concurrent invocations allowed for each blob-triggered function. The minimum allowed value is 1.|

## Next steps

- [Run a function when blob storage data changes](./functions-bindings-storage-blob-trigger.md)
- [Read blob storage data when a function runs](./functions-bindings-storage-blob-input.md)
- [Write blob storage data from a function](./functions-bindings-storage-blob-output.md)

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Microsoft.Azure.WebJobs.Extensions.Storage.Blobs NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage.Blobs
[Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs
[Microsoft.Azure.WebJobs.Extensions.Storage NuGet package, version 4.x]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/4.0.5
[Microsoft.Azure.Functions.Worker.Extensions.Storage NuGet package, version 4.x]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Storage/4.0.4
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack
