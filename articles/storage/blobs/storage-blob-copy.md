---
title: Copy a blob with .NET - Azure Storage
description: Learn how to copy a blob in Azure Storage by using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp,
ms.custom: "devx-track-csharp"
---

# Copy a blob with Azure Storage using the .NET client library

This article demonstrates how to copy a blob in an Azure Storage account. It also shows how to abort an asynchronous copy operation. The example code uses the Azure Storage client libraries.

## About copying blobs

When you copy a blob within the same storage account, it's a synchronous operation. When you copy across accounts it's an asynchronous operation.

The source blob for a copy operation may be a block blob, an append blob, a page blob, or a snapshot. If the destination blob already exists, it must be of the same blob type as the source blob. An existing destination blob will be overwritten.

The destination blob can't be modified while a copy operation is in progress. A destination blob can only have one outstanding copy operation. In other words, a blob can't be the destination for multiple pending copy operations.

The entire source blob or file is always copied. Copying a range of bytes or set of blocks is not supported.

When a blob is copied, it's system properties are copied to the destination blob with the same values.

A copy operation can take any of the following forms:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, effectively replacing the destination blob. Such a copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs is not supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

## Copy a blob

To copy a blob, call one of the following methods:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation.

The following code example gets a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) representing a previously created blob and copies it to a new blob in the same container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CopyBlob.cs" id="Snippet_CopyBlob":::

## Abort a copy operation

Aborting a copy operation results in a destination blob of zero length. However, the metadata for the destination blob will have the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

# [.NET v12 SDK](#tab/dotnet)

Check the BlobProperties.CopyStatus property on the destination blob to get the status of the copy operation. The final blob will be committed when the copy completes.

When you abort a copy operation, the destination blob's copy status is set to [CopyStatus.Aborted](/dotnet/api/microsoft.azure.storage.blob.copystatus).

The [AbortCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuri) and [AbortCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuriasync) methods cancel an ongoing copy operation.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CopyBlob.cs" id="Snippet_StopBlobCopy":::

## See also

- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)
- [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)
