---
title: Convert append and page blobs into block blobs (Azure Storage)
titleSuffix: Azure Storage
description: Learn how to convert an append blob or a page blob into a block blob in Azure Blob Storage.
author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 01/20/2023
ms.author: normesta
ms.reviewer: fryu
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell
---

# Convert append blobs and page blobs into block blobs

To convert blobs, copy them to a new location by using PowerShell, Azure CLI, or AzCopy. You'll use command parameters to ensure that the destination blob is a block blob. All metadata from the source blob is copied to the destination blob.

## Convert append and page blobs

### [PowerShell](#tab/azure-powershell)

1. Open a Windows PowerShell command window.

2. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account which contains the append or page blobs.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId '<subscription-id>'
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

4. Create the storage account context by using the [New-AzStorageContext](/powershell/module/az.storage/new-azstoragecontext) command. Include the `-UseConnectedAccount` parameter so that data operations will be performed using your Azure Active Directory (Azure AD) credentials.

   ```powershell
   $ctx = New-AzStorageContext -StorageAccountName '<storage account name>' -UseConnectedAccount
   ```

5. Use the [Copy-AzStorageBlob](/powershell/module/az.storage/copy-azstorageblob) command and set the `-DestBlobType` parameter to `Block`.

   ```powershell
   $containerName = '<source container name>'
   $srcblobName = '<source append or page blob name>'
   $destcontainerName = '<destination container name>'
   $destblobName = '<destination block blob name>'
   $destTier = '<destination block blob tier>'

   Copy-AzStorageBlob -SrcContainer $containerName -SrcBlob $srcblobName -Context $ctx -DestContainer $destcontainerName -DestBlob $destblobName -DestContext $ctx -DestBlobType Block -StandardBlobTier $destTier
   ```

6. To copy a page blob snapshot to block blob, use the [Get-AzStorageBlob](/powershell/module/az.storage/get-azstorageblob) and [Copy-AzStorageBlob](/powershell/module/az.storage/copy-azstorageblob) command with `-DestBlobType` parameter as `Block`.

   ```powershell
   $containerName = '<source container name>'
   $srcPageBlobName = '<source page blob name>'
   $srcPageBlobSnapshotTime = '<snapshot time of source page blob>'
   $destContainerName = '<destination container name>'
   $destBlobName = '<destination block blob name>'
   $destTier = '<destination block blob tier>'

    Get-AzStorageBlob -Container $containerName -Blob $srcPageBlobName -SnapshotTime $srcPageBlobSnapshotTime -Context $ctx | Copy-AzStorageBlob -DestContainer $destContainerName -DestBlob $destBlobName -DestBlobType block -StandardBlobTier $destTier -DestContext $ctx 

   ```

   > [!TIP]
   > The `-StandardBlobTier` parameter is optional. If you omit that parameter, then the destination blob infers its tier from the [default account access tier setting](access-tiers-overview.md#default-account-access-tier-setting). To change the tier after you've created a block blob, see [Change a blob's tier](access-tiers-online-manage.md#change-a-blobs-tier). 


### [Azure CLI](#tab/azure-cli)

1. First, open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

   > [!NOTE]
   > If you're using a locally installed version of the Azure CLI, ensure that you are using version 2.44.0 or later. 

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of storage account which contains the append or page blobs.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Use the [az storage blob copy start](/cli/azure/storage/blob/copy#az-storage-blob-copy-start) command and set the `--destination-blob-type` parameter to `blockBlob`. 

   ```azurecli
   containerName = '<source container name>'
   srcblobName = '<source append or page blob name>'
   destcontainerName = '<destination container name>'
   destBlobName = '<destination block blob name>'
   destTier = '<destination block blob tier>'

   az storage blob copy start --account-name $accountName --destination-blob $destBlobName --destination-container $destcontainerName --destination-blob-type BlockBlob --source-blob $srcblobName --source-container $containerName --tier $destTier
   ```

4. To copy a page blob snapshot to block blob, use the [az storage blob copy start](/cli/azure/storage/blob/copy#az-storage-blob-copy-start) command and set the `--destination-blob-type` parameter to `blockBlob` along with source page blob snapshot uri. 

   ```azurecli
   srcPageblobSnapshotUri  = '<source page blob snapshot uri>'
   destcontainerName = '<destination container name>'
   destblobName = '<destination block blob name>'
   destTier = '<destination block blob tier>'

   az storage blob copy start --account-name $accountName --destination-blob $destBlobName --destination-container $destcontainerName --destination-blob-type BlockBlob --source-uri $srcPageblobSnapshotUri --tier $destTier
   ```

   > [!TIP]
   > The `--tier` parameter is optional. If you omit that parameter, then the destination blob infers its tier from the [default account access tier setting](access-tiers-overview.md#default-account-access-tier-setting). To change the tier after you've created a block blob, see [Change a blob's tier](access-tiers-online-manage.md#change-a-blobs-tier).

   > [!WARNING]
   > The optional `--metadata` parameter overwrites any existing metadata. Therefore, if you specify metadata by using this parameter, then none of the original metadata from the source blob will be copied to the destination blob.


### [AzCopy](#tab/azcopy)

Use the [azcopy copy](../common/storage-ref-azcopy-copy.md) command. Specify the source and destination paths. Set the `blob-type` parameter to `BlockBlob`.

```azcopy
azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<append-or-page-blob-name>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<name-of-new-block-blob>' --blob-type BlockBlob --block-blob-tier <destination-tier>
```

> [!TIP]
> The `--block-blob-tier` parameter is optional. If you omit that parameter, then the destination blob infers its tier from the [default account access tier setting](access-tiers-overview.md#default-account-access-tier-setting). To change the tier after you've created a block blob, see [Change a blob's tier](access-tiers-online-manage.md#change-a-blobs-tier). 

> [!WARNING]
> The optional `--metadata` parameter overwrites any existing metadata. Therefore, if you specify metadata by using this parameter, then none of the original metadata from the source blob will be copied to the destination blob.

---
## See also

- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Set a blob's access tier](access-tiers-online-manage.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)


