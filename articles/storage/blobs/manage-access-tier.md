---
title: Set a blob's access tier
titleSuffix: Azure Storage
description: Learn how to specify a blob's access tier when you upload it, or how to change the access tier for an existing blob.
author: tamram

ms.author: tamram
ms.date: 10/25/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.reviewer: fryu
ms.custom: devx-track-azurepowershell
---

# Set a blob's access tier

When you 

Each blob has a default access tier, either hot, cool, or archive. A blob takes on the default access tier of the Azure Storage account where it is created. Blob Storage and GPv2 accounts expose the **Access Tier** attribute at the account level. This attribute specifies the default access tier for any blob that doesn't have it explicitly set at the object level. For objects with the tier set at the object level, the account tier won't apply. The archive tier can be applied only at the object level. You can switch between access tiers at any time by following the steps below.

## Set the default access tier for a storage account

TBD

## Set a blob's tier on upload

When you upload a blob to Azure Storage, you have two options for setting the blob's tier on upload:

- You can explicitly specify the tier in which the blob will be created. This setting overrides the default access tier for the storage account. You can set the tier for a blob or set of blobs on upload to Hot, Cool, or Archive.
- You can upload a blob without specifying a tier. In this case, the blob will be created in the default access tier specified for the storage account (either Hot or Cool).

The following sections describe how to specify that a blob is uploaded to either the Hot or Cool tier. For more information about archiving a blob on upload, see [Archive blobs on upload](archive-blob.md#archive-blobs-on-upload).

### Upload a blob to a specific online tier

To create a blob in the Hot or Cool tier tier, specify that tier when you create the blob. The access tier specified on upload overrides the default access tier for the storage account.

### [Azure portal](#tab/portal)

To upload a blob or set of blobs to a specific tier from the Azure portal, follow these steps:

1. Navigate to the target container.
1. Select the **Upload** button.
1. Select the file or files to upload.
1. Expand the **Advanced** section, and set the **Access tier** to *Hot* or *Cool*.
1. Select the **Upload** button.

    :::image type="content" source="media/manage-access-tier/upload-blob-to-online-tier-portal.png" alt-text="Screenshot showing how to upload blobs to an online tier in the Azure portal":::

### [PowerShell](#tab/powershell)

To upload a blob or set of blobs to a specific tier with PowerShell, call the [Set-AzStorageBlobContent](/powershell/module/az.storage/set-azstorageblobcontent) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
$rgName = <resource-group>
$storageAccount = <storage-account>
$containerName = <container>

# Get context object
$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount

# Create new container.
New-AzStorageContainer -Name $containerName -Context $ctx

# Upload a single file named blob1.txt to the Cool tier.
Set-AzStorageBlobContent -Container $containerName `
    -File "blob1.txt" `
    -Blob "blob1.txt" `
    -Context $ctx `
    -StandardBlobTier Cool

# Upload the contents of a sample-blobs directory to the Cool tier, recursively.
Get-ChildItem -Path "C:\sample-blobs" -File -Recurse | 
    Set-AzStorageBlobContent -Container $containerName `
        -Context $ctx `
        -StandardBlobTier Cool
```

### [Azure CLI](#tab/azure-cli)

To upload a blob to a specific tier with Azure CLI, call the [az storage blob upload](/cli/azure/storage/blob#az_storage_blob_upload) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurecli
az storage blob upload \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --file <file> \
    --tier Cool \
    --auth-mode login
```

To upload a set of blobs to a specific tier with Azure CLI, call the [az storage blob upload-batch](/cli/azure/storage/blob#az_storage_blob_upload_batch) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurecli
az storage blob upload-batch \
    --destination <container> \
    --source <source-directory> \
    --account-name <storage-account> \
    --tier Cool \
    --auth-mode login
```

---

### Upload a blob to the default tier

Storage accounts have a default access tier setting that indicates in which online tier a new blob is created. The default access tier setting can be set to either hot or cool. The behavior of this setting is slightly different depending on the type of storage account:

- The default access tier for a new general-purpose v2 storage account is set to the Hot tier by default. You can change the default access tier setting when you create a storage account or after it is created.
- When you create a legacy Blob Storage account, you must specify the default access tier setting as Hot or Cool when you create the storage account. You can change the default access tier setting for the storage account after it is created.

A blob that doesn't have an explicitly assigned tier infers its tier from the default account access tier setting. You can determine whether a blob's access tier is inferred by using the Azure portal, PowerShell, or Azure CLI.

#### [Portal](#tab/portal)

If a blob's access tier is inferred from the default account access tier setting, then the Azure portal displays the access tier as **Hot (inferred)** or **Cool (inferred)**.

:::image type="content" source="media/manage-access-tier/default-access-tier-portal.png" alt-text="Screenshot showing blobs with the default access tier in the Azure portal":::

#### [PowerShell](#tab/azure-powershell)

To determine a blob's access tier and whether it is inferred from Azure PowerShell, retrieve the blob, then check its **AccessTier** and **AccessTierInferred** properties.

```azurepowershell
$rgName = "<resource-group>"
$storageAccount = "<storage-account>"
$containerName = "<container>"
$blobName = "<blob>"

# Get the storage account context.
$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount

# Get the blob from the service.
$blob = Get-AzStorageBlob -Context $ctx -Container $containerName -Blob $blobName

# Check the AccessTier and AccessTierInferred properties.
# If the access tier is inferred, that property returns true.
$blob.BlobProperties.AccessTier
$blob.BlobProperties.AccessTierInferred
```

#### [Azure CLI](#tab/azure-cli)

To determine a blob's access tier and whether it is inferred from Azure CLI, retrieve the blob, then check its **blobTier** and **blobTierInferred** properties.

```azurecli
az storage blob show \
    --container-name <container> \
    --name <blob> \
    --account-name <storage-account> \
    --query '[properties.blobTier, properties.blobTierInferred]' \
    --output tsv \
    --auth-mode login 
```

---

## Move a blob to a different online tier

TBD

### Change a blob's tier

TBD

# [Portal](#tab/portal)

TBD

#### [PowerShell](#tab/azure-powershell)

TBD

#### [Azure CLI](#tab/azure-cli)

TBD

---

### Copy a blob to a different online tier

TBD???

## Next steps

- [How to manage the default account access tier of an Azure Storage account](../common/manage-account-default-access-tier.md)
- [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md)
