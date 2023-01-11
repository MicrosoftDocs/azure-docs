---
title: Convert append and page blobs to block blobs (Azure Storage)
titleSuffix: Azure Storage
description: Learn how to convert an append blob or a page blob to a block blob in Azure Blob Storage.
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 01/11/2023
ms.author: normesta
ms.reviewer: fryu
ms.subservice: blobs
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Convert append blobs and page blobs to block blobs

Introduction goes here.

## Convert append and page blobs

Short description goes here.

### [PowerShell](#tab/azure-powershell)

To convert an append or page blob to a block blob, use the [Copy-AzStorageBlob](/powershell/module/az.storage/copy-azstorageblob) command. Remember to replace the placeholder values in brackets with your own values:

```powershell
$containerName = <source container name>
$srcblobName = <source append or page blob name>
$destcontainerName = <destination container name>
$destblobName = <destination block blob name>
$destTier = <destination block blob tier>

Copy-AzStorageBlob -SrcContainer $containerName -SrcBlob $srcblobName -Context $ctx -DestContainer $destcontainerName -DestBlob $destblobName -DestContext $ctx -DestBlobType Block -StandardBlobTier $destTier
```

### [Azure CLI](#tab/azure-cli)

To convert an append or page blob to a block blob, use the [az storage blob copy start](/cli/azure/storage/blob/copy#az-storage-blob-copy-start) command. Then, use the [az storage blob set-tier](/cli/azure/storage/blob#az-storage-blob-set-tier) command. Remember to replace the placeholder values in brackets with your own values:

```azurecli
# CLI 2.44.0 and above is required.
# convert to block blobs and write to desired tier directly. 
        az storage blob copy start --account-name $accountName --destination-blob $destBlobName --destination-container $destcontainerName --destination-blob-type BlockBlob --source-blob $srcblobName --source-container $containerName --tier $destTier
# convert to block blobs and change tier later. 
        az storage blob copy start --account-name $accountName --destination-blob $destBlobName --destination-container $destcontainerName --destination-blob-type BlockBlob --source-blob $srcblobName --source-container $containerName
        az storage blob set-tier --account-name $accountName --container-name $destcontainerName --name $destBlobName --tier $destTier
```

### [AzCopy](#tab/azcopy)

To blah, use the [azcopy copy](../common/storage-ref-azcopy-copy.md) command. Specify the source and destination paths, set the `blob-type` parameter to `BlockBlob` and set the `--block-blob-tier` to the desired tier. 

```azcopy
azcopy copy <SourceBlobPath> <DestinationBlobPath> --blob-type BlockBlob --block-blob-tier $destTier
```

For other examples, see [Upload files to Azure Blob storage by using AzCopy](../common/storage-use-azcopy-blobs-upload.md).

---

## See also

- [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
