---
title: Delete and restore a blob with .NET
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the .NET client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/11/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Delete and restore a blob with .NET

[!INCLUDE [storage-dev-guide-selector-delete-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-blob.md)]

This article shows how to delete blobs with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob, or to restore a soft-deleted blob. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Blob](/rest/api/storageservices/delete-blob#authorization)
    - [Undelete Blob](/rest/api/storageservices/undelete-blob#authorization)

## Delete a blob

To delete a blob, call either of these methods:

- [Delete](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.delete)
- [DeleteAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.deleteasync)
- [DeleteIfExists](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.deleteifexists)
- [DeleteIfExistsAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.deleteifexistsasync)

The following example deletes a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DeleteBlob.cs" id="Snippet_DeleteBlob":::

If the blob has any associated snapshots, you must delete all of its snapshots to delete the blob. The following example deletes a blob and its snapshots:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DeleteBlob.cs" id="Snippet_DeleteBlobSnapshots":::

To delete *only* the snapshots and not the blob itself, you can pass the parameter `DeleteSnapshotsOption.OnlySnapshots`.

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. 

How you restore a soft-deleted blob depends on whether or not your storage account has blob versioning enabled. For more information on blob versioning, see [Blob versioning](../../storage/blobs/versioning-overview.md). See one of the following sections, depending on your scenario:

- [Blob versioning is not enabled](#restore-soft-deleted-objects-when-versioning-is-disabled)
- [Blob versioning is enabled](#restore-soft-deleted-blobs-when-versioning-is-enabled)

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs when versioning is not enabled, call either of the following methods:

- [Undelete](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undelete)
- [UndeleteAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undeleteasync)

These methods restore soft-deleted blobs and any deleted snapshots associated with them. Calling either of these methods for a blob that has not been deleted has no effect. The following example restores  all soft-deleted blobs and their snapshots in a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DeleteBlob.cs" id="Snippet_RestoreBlob":::

To restore a specific soft-deleted snapshot, first call the [Undelete](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undelete) or [UndeleteAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undeleteasync) on the base blob, then copy the desired snapshot over the base blob. The following example restores a block blob to the most recently generated snapshot:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DeleteBlob.cs" id="Snippet_RestoreSnapshot":::

#### Restore soft-deleted blobs when versioning is enabled

If a storage account is configured to enable blob versioning, deleting a blob causes the current version of the blob to become the previous version. To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use either of the following methods:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The following code example shows how to get the latest version of a deleted blob, and restore the latest version by copying it to the base blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DeleteBlob.cs" id="Snippet_RestoreBlobWithVersioning":::

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/DeleteBlob.cs)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
