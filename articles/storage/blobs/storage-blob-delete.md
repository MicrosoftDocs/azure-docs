---
title: Delete and restore a blob with .NET
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the .NET client library
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 02/16/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Delete and restore a blob with .NET

This article shows how to delete blobs with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

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

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs when versioning is not enabled, call either of the following methods:

- [Undelete](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undelete)
- [UndeleteAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.undeleteasync)

These methods restore soft-deleted blobs and any deleted snapshots associated with them. Calling either of these methods for a blob that has not been deleted has no effect. The following example restores  all soft-deleted blobs and their snapshots in a container:

```csharp
public static async Task UnDeleteBlobs(BlobContainerClient container)
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

## Restore soft-deleted blobs and directories (hierarchical namespace)

> [!IMPORTANT]
> This section applies only to accounts that have a hierarchical namespace.

1. Open a command prompt and change directory (`cd`) into your project folder For example:

   ```console
   cd myProject
   ```

2. Install the `Azure.Storage.Files.DataLake -v 12.7.0` version or greater of the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) NuGet package by using the `dotnet add package` command.

   ```console
   dotnet add package Azure.Storage.Files.DataLake -v -v 12.7.0 -s https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json
   ```

3. Then, add these using statements to the top of your code file.

    ```csharp
    using Azure;
    using Azure.Storage;
    using Azure.Storage.Files.DataLake;
    using Azure.Storage.Files.DataLake.Models;
    using NUnit.Framework;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    ```

4. The following code deletes a directory, and then restores a soft-deleted directory.

   This method assumes that you've created a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance. To learn how to create a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance, see [Connect to the account](data-lake-storage-directory-file-acl-dotnet.md#connect-to-the-account).

   ```csharp
      public void RestoreDirectory(DataLakeServiceClient serviceClient)
      {
          DataLakeFileSystemClient fileSystemClient =
             serviceClient.GetFileSystemClient("my-container");

          DataLakeDirectoryClient directory =
              fileSystem.GetDirectoryClient("my-directory");

          // Delete the Directory
          await directory.DeleteAsync();

          // List Deleted Paths
          List<PathHierarchyDeletedItem> deletedItems = new List<PathHierarchyDeletedItem>();
          await foreach (PathHierarchyDeletedItem deletedItem in fileSystemClient.GetDeletedPathsAsync())
          {
            deletedItems.Add(deletedItem);
          }

          Assert.AreEqual(1, deletedItems.Count);
          Assert.AreEqual("my-directory", deletedItems[0].Path.Name);
          Assert.IsTrue(deletedItems[0].IsPath);

          // Restore deleted directory.
          Response<DataLakePathClient> restoreResponse = await fileSystemClient.RestorePathAsync(
          deletedItems[0].Path.Name,
          deletedItems[0].Path.DeletionId);

      }

   ```

   If you rename the directory that contains the soft-deleted items, those items become disconnected from the directory. If you want to restore those items, you'll have to revert the name of the directory back to its original name or create a separate directory that uses the original directory name. Otherwise, you'll receive an error when you attempt to restore those soft-deleted items.

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
