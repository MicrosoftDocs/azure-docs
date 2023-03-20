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

## Prerequisites

To work with the code examples in this article, here are a few things you'll need:

- Create or reuse an authorized client object to connect with Blob Storage data resources. To learn about client objects, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Make sure that the authorization mechanism has the correct permissions to perform a copy operation. To learn more, see the REST API authorization sections for the following operations:
    - [Copy Blob](/rest/api/storageservices/copy-blob#authorization)
    - [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url#authorization)
    - [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization)
- Install the necessary packages and include the proper `using` directives in your code file. To learn more, see the project setup section in [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project).

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

If the destination blob already exists, it must be of the same blob type as the source blob. An existing destination blob will be overwritten.

The destination blob can't be modified while a copy operation is in progress. A destination blob can only have one outstanding copy operation. One way to enforce this requirement is to use a blob lease, as shown in the code example.

The entire source blob or file is always copied. Copying a range of bytes or set of blocks isn't supported. When a blob is copied, its system properties are copied to the destination blob with the same values.

## Copy a blob

To copy a blob, call one of the following methods:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation.

The following code example gets a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) representing an existing blob and copies it to a new blob in a different container within the same storage account. This example also acquires a lease on the source blob before copying so that no other client can modify the blob until the copy is complete and the lease is released.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyBlob":::

To check the status of a copy operation, you can call [UpdateStatusAsync](/dotnet/api/azure.storage.blobs.models.copyfromurioperation.updatestatusasync#azure-storage-blobs-models-copyfromurioperation-updatestatusasync(system-threading-cancellationtoken)) and parse the response to get the value for the `x-ms-copy-status` header. 

The following code example shows how to check the status of a given copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CheckStatusCopyBlob":::

## Copy a blob snapshot over the base blob

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopySnapshot":::

To learn more about blob snapshots, see [Blob snapshots](snapshots-overview.md).

## Copy a previous blob version over the base blob

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyVersion":::

To learn more about blob versioning, see [Blob versioning](versioning-overview.md).

## Rehydrate a blob using a copy operation

You can rehydrate a blob from the archive tier by copying it to an online tier. You can specify copy options, including access tier and rehydrate priority, in a [BlobCopyFromUriOptions] object.

The following example shows how to rehydrate an archived blob by copying it to a blob in the hot tier:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_RehydrateUsingCopy":::

> [!NOTE]
> Copying an archived blob to an online destination tier is supported within the same storage account. Beginning with service version 2021-02-12, you can copy an archived blob to a different storage account, as long as the destination account is in the same region as the source account. When you copy an archived blob to an online tier, the source and destination blobs must have different names. 

After the copy operation is complete, the destination blob appears in the archive tier. The destination blob is then rehydrated to the online tier that you specified in the copy operation. When the destination blob is fully rehydrated, it becomes available in the new online tier.

To learn more about rehydrating an archived blob, see [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md).

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
