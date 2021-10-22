---
title: Archive a blob
titleSuffix: Azure Storage
description: Learn how to create a blob in the Archive tier, or move an existing blob to the Archive tier.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 10/18/2021
ms.author: tamram
ms.reviewer: fryu
ms.subservice: blobs
---

# Archive a blob

Intro TBD

You can use the Azure portal, PowerShell, Azure CLI, or one of the Azure Storage client libraries to manage data archiving.

## Archive blobs on upload

To archive one ore more blobs on upload, create the blob directly in the Archive tier.

### [Azure portal](#tab/portal)

To archive a blob or set of blobs on upload from the Azure portal, follow these steps:

1. Navigate to the target container.
1. Select the **Upload** button.
1. Select the file or files to upload.
1. Expand the **Advanced** section, and set the **Access tier** to *Archive*.
1. Select the **Upload** button.

    :::image type="content" source="media/archive-blob/upload-blobs-archive-portal.png" alt-text="Screenshot showing how to upload blobs to the archive tier in the Azure portal":::

### [PowerShell](#tab/powershell)

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


You can change the tier for only one blob at a time in the Azure portal. To 

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

## Bulk archive

When moving a large number of blobs to the Archive tier, use a batch operation for optimal performance. A batch operation sends multiple API calls to the service with a single request. The sub-operations supported by the [Blob Batch](/rest/api/storageservices/blob-batch) operation include [Delete Blob](/rest/api/storageservices/delete-blob) and [Set Blob Tier](/rest/api/storageservices/set-blob-tier).

To archive blobs with a batch operation, use one of the Azure Storage client libraries. The following code example shows how to perform a basic batch operation with the .NET client library:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/AccessTiers.cs" id="Snippet_BulkArchiveContainerContents":::

For an in-depth sample application that shows how to change tiers with a batch operation, see [AzBulkSetBlobTier](/samples/azure/azbulksetblobtier/azbulksetblobtier/).

## See also

- [Hot, cool, and archive access tiers for blob data](access-tiers-overview.md)
- [Blob rehydration from the Archive tier](archive-rehydrate-overview.md)
- [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md)
