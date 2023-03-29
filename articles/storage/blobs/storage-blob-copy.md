---
title: Copy a blob with .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 03/14/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Copy a blob with .NET

This article shows how to copy a blob in a storage account using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). It also shows how to abort an asynchronous copy operation.

## About copying blobs

A copy operation can perform any of the following actions:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, effectively replacing the destination blob. Such a copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs isn't supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation may be one of the following types:
- Block blob
- Append blob
- Page blob
- Blob snapshot
- Blob version

If the destination blob already exists, it must be of the same blob type as the source blob, and the existing destination blob will be overwritten. The destination blob can't be modified while a copy operation is in progress, and a destination blob can only have one outstanding copy operation.

The entire source blob or file is always copied. Copying a range of bytes or set of blocks isn't supported. When a blob is copied, its system properties are copied to the destination blob with the same values.

## Copy a blob

To copy a blob, call one of the following methods:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation.

The following code example gets a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) representing an existing blob and copies it to a new blob in a different container within the same storage account.

```csharp
public static async Task CopyBlobAsync(BlobServiceClient blobServiceClient)
{
    // Instantiate BlobClient for the source blob and destination blob
    BlobClient sourceBlob = blobServiceClient
        .GetBlobContainerClient("source-container")
        .GetBlobClient("sample-blob.txt");
    BlobClient destinationBlob = blobServiceClient
        .GetBlobContainerClient("destination-container")
        .GetBlobClient("sample-blob.txt");

    // Start the copy operation and wait for it to complete
    CopyFromUriOperation copyOperation = await destinationBlob.StartCopyFromUriAsync(sourceBlob.Uri);
    await copyOperation.WaitForCompletionAsync();
}
```

To check the status of a copy operation, you can call [UpdateStatusAsync](/dotnet/api/azure.storage.blobs.models.copyfromurioperation.updatestatusasync#azure-storage-blobs-models-copyfromurioperation-updatestatusasync(system-threading-cancellationtoken)) and parse the response to get the value for the `x-ms-copy-status` header. 

The following code example shows how to check the status of a given copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CheckStatusCopyBlob":::

## Abort a copy operation

Aborting a copy operation results in a destination blob of zero length. However, the metadata for the destination blob will have the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

To abort a pending copy operation, call one of the following operations:
- [AbortCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuri)
- [AbortCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuriasync)

The following code example shows how to abort a pending copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_AbortBlobCopy":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for copying blobs use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]
