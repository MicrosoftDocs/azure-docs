---
title: Manage soft delete for blobs
titleSuffix: Azure Storage 
description: Enable soft delete for blobs to more easily recover your data when it is erroneously modified or deleted.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/26/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: "devx-track-azurecli, devx-track-csharp"
---

# Manage soft delete for blobs

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted.

Blob soft delete is part of a comprehensive data protection strategy for blob data. To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md). For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).



## Restore a deleted blob


# [Portal](#tab/azure-portal)


Remember that undeleting a blob will also undelete all associated snapshots. To undelete soft deleted snapshots for an active blob, click on the blob and select **Undelete all snapshots**.

![Screenshot of the details of a soft deleted blob.](media/soft-delete-blob-enable/storage-blob-soft-delete-portal-undelete-all-snapshots.png)

Once you undelete a blob's snapshots, you can click **Promote** to copy a snapshot over the root blob, thereby restoring the blob to the snapshot.

![Screenshot of the View snapshots page with the Promote option highlighted.](media/soft-delete-blob-enable/storage-blob-soft-delete-portal-promote-snapshot.png)

# [PowerShell](#tab/azure-powershell)

To recover blobs that were accidentally deleted, call **Undelete Blob** on those blobs. Remember that calling **Undelete Blob**, both on active and soft deleted blobs, will restore all associated soft deleted snapshots as active. The following example calls **Undelete Blob** on all soft deleted and active blobs in a container:

```azurepowershell
# Create a context by specifying storage account name and key
$ctx = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey

# Get the blobs in a given container and show their properties
$Blobs = Get-AzStorageBlob -Container $StorageContainerName -Context $ctx -IncludeDeleted
$Blobs.ICloudBlob.Properties

# Undelete the blobs
$Blobs.ICloudBlob.Undelete()
```

# [CLI](#tab/azure-CLI)


# [Python](#tab/python)

N/A

# [.NET v12](#tab/dotnet)

To recover blobs that were accidentally deleted, call Undelete on those blobs. Remember that calling **Undelete**, both on active and soft deleted blobs, will restore all associated soft deleted snapshots as active. The following example calls Undelete on all soft deleted and active blobs in a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/DataProtection.cs" id="Snippet_RecoverDeletedBlobs":::

To recover to a specific blob version, first call Undelete on a blob, then copy the desired snapshot over the blob. The following example recovers a block blob to its most recently generated snapshot:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/DataProtection.cs" id="Snippet_RecoverSpecificBlobVersion":::

# [.NET v11](#tab/dotnet11)

To recover deleted blobs, call **Undelete Blob** on those blobs. Remember that calling **Undelete Blob**, both on active and soft deleted blobs, will restore all associated soft deleted snapshots as active. The following example calls **Undelete Blob** on all soft-deleted and active blobs in a container:

```csharp
// Recover all blobs in a container
foreach (CloudBlob blob in container.ListBlobs(useFlatBlobListing: true, blobListingDetails: BlobListingDetails.Deleted))
{
       await blob.UndeleteAsync();
}
```

To recover to a specific blob version, first call the **Undelete Blob** operation, then copy the desired snapshot over the blob. The following example recovers a block blob to its most recently generated snapshot:

```csharp
// Undelete
await blockBlob.UndeleteAsync();

// List all blobs and snapshots in the container prefixed by the blob name
IEnumerable<IListBlobItem> allBlobVersions = container.ListBlobs(
    prefix: blockBlob.Name, useFlatBlobListing: true, blobListingDetails: BlobListingDetails.Snapshots);

// Restore the most recently generated snapshot to the active blob
CloudBlockBlob copySource = allBlobVersions.First(version => ((CloudBlockBlob)version).IsSnapshot &&
    ((CloudBlockBlob)version).Name == blockBlob.Name) as CloudBlockBlob;
blockBlob.StartCopy(copySource);
```  

---

## Next steps

- [Soft delete for Blob storage](./soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)