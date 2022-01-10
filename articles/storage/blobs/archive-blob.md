---
title: Archive a blob
titleSuffix: Azure Storage
description: Learn how to create a blob in the Archive tier, or move an existing blob to the Archive tier.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 10/25/2021
ms.author: tamram
ms.reviewer: fryu
ms.subservice: blobs
---

# Archive a blob

The Archive tier is an offline tier for storing blob data that is rarely accessed. The Archive tier offers the lowest storage costs, but higher data retrieval costs and latency compared to the online tiers (Hot and Cool). Data must remain in the Archive tier for at least 180 days or be subject to an early deletion charge. For more information about the Archive tier, see [Archive access tier](access-tiers-overview.md#archive-access-tier).

While a blob is in the Archive tier, it can't be read or modified. To read or download a blob in the Archive tier, you must first rehydrate it to an online tier, either Hot or Cool. Data in the Archive tier can take up to 15 hours to rehydrate, depending on the priority you specify for the rehydration operation. For more information about blob rehydration, see [Overview of blob rehydration from the Archive tier](archive-rehydrate-overview.md).

> [!CAUTION]
> A blob in the Archive tier is offline &mdash; that is, it cannot be read or modified &mdash; until it is rehydrated. The rehydration process can take several hours and has associated costs. Before you move data to the Archive tier, consider whether taking blob data offline may affect your workflows.

You can use the Azure portal, PowerShell, Azure CLI, or one of the Azure Storage client libraries to manage data archiving.

## Archive blobs on upload

To archive one ore more blobs on upload, create the blob directly in the Archive tier.

### [Portal](#tab/azure-portal)

To archive a blob or set of blobs on upload from the Azure portal, follow these steps:

1. Navigate to the target container.
1. Select the **Upload** button.
1. Select the file or files to upload.
1. Expand the **Advanced** section, and set the **Access tier** to *Archive*.
1. Select the **Upload** button.

    :::image type="content" source="media/archive-blob/upload-blobs-archive-portal.png" alt-text="Screenshot showing how to upload blobs to the Archive tier in the Azure portal":::

### [PowerShell](#tab/azure-powershell)

To archive a blob or set of blobs on upload with PowerShell, call the [Set-AzStorageBlobContent](/powershell/module/az.storage/set-azstorageblobcontent) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
$rgName = <resource-group>
$storageAccount = <storage-account>
$containerName = <container>

# Get context object
$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount

# Create new container.
New-AzStorageContainer -Name $containerName -Context $ctx

# Upload a single file named blob1.txt to the Archive tier.
Set-AzStorageBlobContent -Container $containerName `
    -File "blob1.txt" `
    -Blob "blob1.txt" `
    -Context $ctx `
    -StandardBlobTier Archive

# Upload the contents of a sample-blobs directory to the Archive tier, recursively.
Get-ChildItem -Path "C:\sample-blobs" -File -Recurse | 
    Set-AzStorageBlobContent -Container $containerName `
        -Context $ctx `
        -StandardBlobTier Archive
```

### [Azure CLI](#tab/azure-cli)

To archive a single blob on upload with Azure CLI, call the [az storage blob upload](/cli/azure/storage/blob#az_storage_blob_upload) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurecli
az storage blob upload \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --file <file> \
    --tier Archive \
    --auth-mode login
```

To archive a set of blobs on upload with Azure CLI, call the [az storage blob upload-batch](/cli/azure/storage/blob#az_storage_blob_upload_batch) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurecli
az storage blob upload-batch \
    --destination <container> \
    --source <source-directory> \
    --account-name <storage-account> \
    --tier Archive \
    --auth-mode login
```

---

## Archive an existing blob

You can move an existing blob to the Archive tier in one of two ways:

- You can change a blob's tier with the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation. **Set Blob Tier** moves a single blob from one tier to another.

    Keep in mind that when you move a blob to the Archive tier with **Set Blob Tier**, then you cannot read or modify the blob's data until you rehydrate the blob. If you may need to read or modify the blob's data before the early deletion interval has elapsed, then consider using a **Copy Blob** operation to create a copy of the blob in the Archive tier.

- You can copy a blob in an online tier to the Archive tier with the [Copy Blob](/rest/api/storageservices/copy-blob) operation. You can call the **Copy Blob** operation to copy a blob from an online tier (Hot or Cool) to the Archive tier. The source blob remains in the online tier, and you can continue to read or modify its data in the online tier.

### Archive an existing blob by changing its tier

Use the **Set Blob Tier** operation to move a blob from the Hot or Cool tier to the Archive tier. The **Set Blob Tier** operation is best for scenarios where you will not need to access the archived data before the early deletion interval has elapsed.

The **Set Blob Tier** operation changes the tier of a single blob. To move a set of blobs to the Archive tier with optimum performance, Microsoft recommends performing a bulk archive operation. The bulk archive operation sends a batch of **Set Blob Tier** calls to the service in a single transaction. For more information, see [Bulk archive](#bulk-archive).  

#### [Portal](#tab/azure-portal)

To move an existing blob to the Archive tier in the Azure portal, follow these steps:

1. Navigate to the blob's container.
1. Select the blob to archive.
1. Select the **Change tier** button.
1. Select *Archive* from the **Access tier** dropdown.
1. Select **Save**.

    :::image type="content" source="media/archive-blob/set-blob-tier-archive-portal.png" alt-text="Screenshot showing how to set a blob's tier to Archive in the Azure portal":::

#### [PowerShell](#tab/azure-powershell)

To change a blob's tier from Hot or Cool to Archive with PowerShell, use the blob's **BlobClient** property to return a .NET reference to the blob, then call the **SetAccessTier** method on that reference. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container>"
$blobName = "<blob>"

# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName $rgName `
        -Name $accountName).Context

# Change the blob's access tier to Archive.
$blob = Get-AzStorageBlob -Container $containerName -Blob $blobName -Context $ctx
$blob.BlobClient.SetAccessTier("Archive", $null)
```

#### [Azure CLI](#tab/azure-cli)

To change a blob's tier from Hot or Cool to Archive with Azure CLI, call the [az storage blob set-tier](/cli/azure/storage/blob#az_storage_blob_set_tier) command. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob set-tier \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --tier Archive \
    --auth-mode login
```

---

### Archive an existing blob with a copy operation

Use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a blob from the Hot or Cool tier to the Archive tier. The source blob remains in the Hot or Cool tier, while the destination blob is created in the Archive tier.

A **Copy Blob** operation is best for scenarios where you may need to read or modify the archived data before the early deletion interval has elapsed. You can access the source blob's data without needing to rehydrate the archived blob.

#### [Portal](#tab/azure-portal)

N/A

#### [PowerShell](#tab/azure-powershell)

To copy an blob from an online tier to the Archive tier with PowerShell, call the [Start-AzStorageBlobCopy](/powershell/module/az.storage/start-azstorageblobcopy) command and specify the Archive tier. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$srcContainerName = "<source-container>"
$destContainerName = "<dest-container>"
$srcBlobName = "<source-blob>"
$destBlobName = "<dest-blob>"

# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName $rgName `
        -Name $accountName).Context

# Copy the source blob to a new destination blob in Hot tier with Standard priority.
Start-AzStorageBlobCopy -SrcContainer $srcContainerName `
    -SrcBlob $srcBlobName `
    -DestContainer $destContainerName `
    -DestBlob $destBlobName `
    -StandardBlobTier Archive `
    -Context $ctx
```

#### [Azure CLI](#tab/azure-cli)

To copy an blob from an online tier to the Archive tier with Azure CLI, call the [az storage blob copy start](/cli/azure/storage/blob/copy#az_storage_blob_copy_start) command and specify the Archive tier. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob copy start \
    --source-container <source-container> \
    --source-blob <source-blob> \
    --destination-container <dest-container> \
    --destination-blob <dest-blob> \
    --account-name <storage-account> \
    --tier Archive \
    --auth-mode login
```

---

## Bulk archive

When moving a large number of blobs to the Archive tier, use a batch operation for optimal performance. A batch operation sends multiple API calls to the service with a single request. The sub-operations supported by the [Blob Batch](/rest/api/storageservices/blob-batch) operation include [Delete Blob](/rest/api/storageservices/delete-blob) and [Set Blob Tier](/rest/api/storageservices/set-blob-tier).

To archive blobs with a batch operation, use one of the Azure Storage client libraries. The following code example shows how to perform a basic batch operation with the .NET client library:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/AccessTiers.cs" id="Snippet_BulkArchiveContainerContents":::

For an in-depth sample application that shows how to change tiers with a batch operation, see [AzBulkSetBlobTier](/samples/azure/azbulksetblobtier/azbulksetblobtier/).

## See also

- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Blob rehydration from the Archive tier](archive-rehydrate-overview.md)
- [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md)
