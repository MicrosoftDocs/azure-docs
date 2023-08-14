---
title: Delete and restore a blob with .NET
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the .NET client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/11/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Delete and restore a blob with .NET

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

The following example deletes a blob.

```csharp
public static async Task DeleteBlob(BlobClient blob)
{
    await blob.DeleteAsync();
}
```

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

```csharp
public static async Task UndeleteBlobs(BlobContainerClient container)
{
    foreach (BlobItem blob in container.GetBlobs(BlobTraits.None, BlobStates.Deleted))
    {
        await container.GetBlockBlobClient(blob.Name).UndeleteAsync();
    }
}
```

To restore a specific soft-deleted snapshot, first call the [Undelete](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undelete) or [UndeleteAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undeleteasync) on the base blob, then copy the desired snapshot over the base blob. The following example restores a block blob to the most recently generated snapshot:

```csharp
public static async Task RestoreSnapshots(BlobContainerClient container, BlobClient blob)
{
    // Restore the deleted blob.
    await blob.UndeleteAsync();

    // List blobs in this container that match prefix.
    // Include snapshots in listing.
    Pageable<BlobItem> blobItems = container.GetBlobs
                    (BlobTraits.None, BlobStates.Snapshots, prefix: blob.Name);

    // Get the URI for the most recent snapshot.
    BlobUriBuilder blobSnapshotUri = new BlobUriBuilder(blob.Uri)
    {
        Snapshot = blobItems
                    .OrderByDescending(snapshot => snapshot.Snapshot)
                    .ElementAtOrDefault(0)?.Snapshot
    };

    // Restore the most recent snapshot by copying it to the blob.
    blob.StartCopyFromUri(blobSnapshotUri.ToUri());
}
```

#### Restore soft-deleted blobs when versioning is enabled

To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use either of the following methods:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

```csharp
public static void RestoreBlobsWithVersioning(BlobContainerClient container, BlobClient blob)
{
    // List blobs in this container that match prefix.
    // Include versions in listing.
    Pageable<BlobItem> blobItems = container.GetBlobs
                    (BlobTraits.None, BlobStates.Version, prefix: blob.Name);

    // Get the URI for the most recent version.
    BlobUriBuilder blobVersionUri = new BlobUriBuilder(blob.Uri)
    {
        VersionId = blobItems
                    .OrderByDescending(version => version.VersionId)
                    .ElementAtOrDefault(0)?.VersionId
    };

    // Restore the most recently generated version by copying it to the base blob.
    blob.StartCopyFromUri(blobVersionUri.ToUri());
}
```

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
