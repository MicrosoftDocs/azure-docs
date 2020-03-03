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

You can bind to the following types to write blobs:

* `TextWriter`
* `out string`
* `out Byte[]`
* `CloudBlobStream`
* `Stream`
* `CloudBlobContainer`<sup>1</sup>
* `CloudBlobDirectory`
* `ICloudBlob`<sup>2</sup>
* `CloudBlockBlob`<sup>2</sup>
* `CloudPageBlob`<sup>2</sup>
* `CloudAppendBlob`<sup>2</sup>

<sup>1</sup> Requires "in" binding `direction` in *function.json* or `FileAccess.Read` in a C# class library. However, you can use the container object that the runtime provides to do write operations, such as uploading blobs to the container.

<sup>2</sup> Requires "inout" binding `direction` in *function.json* or `FileAccess.ReadWrite` in a C# class library.

If you try to bind to one of the Storage SDK types and get an error message, make sure that you have a reference to [the correct Storage SDK version](../articles/azure-functions/functions-bindings-storage-blob.md#azure-storage-sdk-version-in-functions-1x).

In async functions, use the return value or `IAsyncCollector` instead of an `out` parameter.

Binding to `string` or `Byte[]` is only recommended if the blob size is small, as the entire blob contents are loaded into memory. Generally, it is preferable to use a `Stream` or `CloudBlockBlob` type. For more information, see [Concurrency and memory usage](../articles/azure-functions/functions-bindings-storage-blob-trigger.md#concurrency-and-memory-usage) earlier in this article.
