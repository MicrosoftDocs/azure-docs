---
title: Manage and restore soft-deleted blobs
titleSuffix: Azure Storage 
description: Manage and restore soft-deleted blobs.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/27/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: "devx-track-azurecli, devx-track-csharp"
---

# Manage and restore soft-deleted blobs

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

Blob soft delete is part of a comprehensive data protection strategy for blob data. To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

## Manage soft-deleted blobs with the Azure portal

You can use the Azure portal to view soft-deleted blobs and snapshots, and to restore them.

### View deleted blobs

When blobs are soft-deleted, they are invisible in the Azure portal by default. To view soft-deleted blobs, navigate to the **Overview** page for the container and toggle the **Show deleted blobs** setting. Soft-deleted blobs are displayed with a status of **Deleted**.

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blobs-list-portal.png" alt-text="Screenshot showing how to list soft-deleted blobs in Azure portal":::

Next, select the deleted blob from the list of blobs to display its properties. Under the **Overview** tab, notice that the blob's status is set to **Deleted**. The portal also displays the number of days until the blob is permanently deleted.

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blob-properties-portal.png" alt-text="Screenshot showing properties of soft-deleted blob in Azure portal":::

### View deleted snapshots

Deleting a blob also deletes any snapshots that blob has. If a soft-deleted blob has snapshots, the deleted snapshots can also be listed in the portal. Display the soft-deleted blob's properties, then navigate to the **Snapshots** tab, and toggle **Show deleted snapshots**.

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blob-snapshots-portal.png" alt-text="Screenshot showing ":::

### Restore a soft-deleted blob (versioning disabled)

To restore a soft-deleted blob in the Azure portal when blob versioning is not enabled, first display the blob's properties, then select the **Undelete** button on the **Overview** tab. Restoring a blob also restores any snapshots that were deleted during the soft-delete retention period.

:::image type="content" source="media/soft-delete-blob-manage/undelete-soft-deleted-blob-portal.png" alt-text="Screenshot showing how to restore a soft-deleted blob in Azure portal":::

### Restore a soft-deleted blob (versioning enabled)

To restore a soft-deleted blob in the Azure portal when versioning is enabled, select the soft-deleted blob to display its properties, then select the **Versions** tab. Select the version that you want to promote to be the current version, then select **Make current version**.  

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blob-promote-version-portal.png" alt-text="Screenshot showing how to promote a version to restore a blob in Azure portal":::

## Manage soft-deleted blobs with code

### List soft-deleted blobs

# [.NET v12](#tab/dotnet)


# [.NET v11](#tab/dotnet11)

---

### Restore a soft-deleted blob (versioning disabled)

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

### Restore a soft-deleted blob (versioning enabled)

# [.NET v12](#tab/dotnet)


# [.NET v11](#tab/dotnet11)


---

## Next steps

- [Soft delete for Blob storage](./soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)