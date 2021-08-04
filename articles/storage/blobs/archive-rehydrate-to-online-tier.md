---
title: Rehydrate an archived blob 
titleSuffix: Azure Storage
description: Rehydrate an archived blob
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/04/2021
ms.author: tamram
ms.reviewer: fryu
ms.custom: devx-track-azurepowershell
ms.subservice: blobs
---

# Rehydrate an archived blob

TBD

### Rehydrate an archive blob to an online tier

TBD

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and select **All Resources**.

1. Select your storage account.

1. Select your container and then select your blob.

1. In the **Blob properties**, select **Change tier**.

1. Select the **Hot** or **Cool** access tier.

1. Select a Rehydrate Priority of **Standard** or **High**.

1. Select **Save** at the bottom.

![Change storage account tier](media/storage-tiers/blob-access-tier.png)
![Check rehydrate status](media/storage-tiers/rehydrate-status.png)

# [PowerShell](#tab/azure-powershell)

The following PowerShell script can be used to change the blob tier of an archive blob. The `$rgName` variable must be initialized with your resource group name. The `$accountName` variable must be initialized with your storage account name. The `$containerName` variable must be initialized with your container name. The `$blobName` variable must be initialized with your blob name.

```powershell
#Initialize the following with your resource group, storage account, container, and blob names
$rgName = ""
$accountName = ""
$containerName = ""
$blobName = ""

#Select the storage account and get the context
$storageAccount =Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

#Select the blob from a container
$blob = Get-AzStorageBlob -Container $containerName -Blob $blobName -Context $ctx

#Change the blob’s access tier to Hot using Standard priority rehydrate
$blob.ICloudBlob.SetStandardBlobTier("Hot", "Standard")
```

---

### Copy an archive blob to a new blob with an online tier

The following PowerShell script can be used to copy an archive blob to a new blob within the same storage account. The `$rgName` variable must be initialized with your resource group name. The `$accountName` variable must be initialized with your storage account name. The `$srcContainerName` and `$destContainerName` variables must be initialized with your container names. The `$srcBlobName` and `$destBlobName` variables must be initialized with your blob names.

```powershell
#Initialize the following with your resource group, storage account, container, and blob names
$rgName = ""
$accountName = ""
$srcContainerName = ""
$destContainerName = ""
$srcBlobName = ""
$destBlobName = ""

#Select the storage account and get the context
$storageAccount =Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

#Copy source blob to a new destination blob with access tier hot using standard rehydrate priority
Start-AzStorageBlobCopy -SrcContainer $srcContainerName -SrcBlob $srcBlobName -DestContainer $destContainerName -DestBlob $destBlobName -StandardBlobTier Hot -RehydratePriority Standard -Context $ctx
```

## See also

TBD
