---
title: include file
description: include file
services: functions
author: craigshoemaker
manager: gwallace
ms.service: azure-functions
ms.topic: include
ms.date: 08/02/2019
ms.author: cshoe
ms.custom: include file
---

### Default

You can use the following parameter types for the triggering blob:

* `Stream`
* `TextReader`
* `string`
* `Byte[]`
* `ICloudBlob`<sup>1</sup>
* `CloudBlockBlob`<sup>1</sup>
* `CloudPageBlob`<sup>1</sup>
* `CloudAppendBlob`<sup>1</sup>

<sup>1</sup> Requires "inout" binding `direction` in *function.json* or `FileAccess.ReadWrite` in a C# class library.

If you try to bind to one of the Storage SDK types and get an error message, make sure that you have a reference to [the correct Storage SDK version](../articles/azure-functions/functions-bindings-storage-blob.md#azure-storage-sdk-version-in-functions-1x).

Binding to `string`, or `Byte[]` is only recommended if the blob size is small, as the entire blob contents are loaded into memory. Generally, it is preferable to use a `Stream` or `CloudBlockBlob` type. For more information, see [Concurrency and memory usage](../articles/azure-functions/functions-bindings-storage-blob-trigger.md#concurrency-and-memory-usage) later in this article.

### Additional types

Apps using the [5.0.0 or higher version of the Storage extension](../articles/azure-functions/functions-bindings-storage-blob.md#storage-extension-5x-and-higher) may also use types from the [Azure SDK for .NET](/dotnet/api/overview/azure/storage.blobs-readme). This version drops support for the legacy `ICloudBlob`, `CloudBlockBlob`, `CloudPageBlob`, and `CloudAppendBlob` types in favor of the following types:

- [BlobClient](/dotnet/api/azure.storage.blobs.blobclient)<sup>1</sup>
- [BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)<sup>1</sup>
- [PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient)<sup>1</sup>
- [AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)<sup>1</sup>
- [BlobBaseClient](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient)<sup>1</sup>

<sup>1</sup> Requires "inout" binding `direction` in *function.json* or `FileAccess.ReadWrite` in a C# class library.

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Microsoft.Azure.WebJobs.Extensions.Storage.Blobs#examples).
