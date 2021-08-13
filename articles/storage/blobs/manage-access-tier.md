---
title: Manage the access tier of a blob in an Azure Storage account
description: Learn how to change the tier of a blob in a GPv2 or Blob Storage account
author: tamram

ms.author: tamram
ms.date: 01/11/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.reviewer: klaasl 
ms.custom: devx-track-azurepowershell
---

# Manage the access tier of a blob in an Azure Storage account

Each blob has a default access tier, either hot, cool, or archive. A blob takes on the default access tier of the Azure Storage account where it is created. Blob Storage and GPv2 accounts expose the **Access Tier** attribute at the account level. This attribute specifies the default access tier for any blob that doesn't have it explicitly set at the object level. For objects with the tier set at the object level, the account tier won't apply. The archive tier can be applied only at the object level. You can switch between access tiers at any time by following the steps below.

## Change the tier of a blob in a GPv2 or Blob Storage account

The following scenarios use the Azure portal or PowerShell:

# [Portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and select **All Resources**.

1. Select your storage account.

1. Select your container and then select your blob.

1. In the **Blob properties**, select **Change tier**.

1. Select the **Hot**, **Cool**, or **Archive** access tier. If your blob is currently in archive and you want to rehydrate to an online tier, you may also select a Rehydrate Priority of **Standard** or **High**.

1. Select **Save** at the bottom.

![Change blob tier in Azure portal](media/storage-tiers/blob-access-tier.png)

# [PowerShell](#tab/powershell)

The following PowerShell script can be used to change the blob tier. The `$rgName` variable must be initialized with your resource group name. The `$accountName` variable must be initialized with your storage account name. The `$containerName` variable must be initialized with your container name. The `$blobName` variable must be initialized with your blob name.

```powershell
#Initialize the following with your resource group, storage account, container, and blob names
$rgName = ""
$accountName = ""
$containerName = ""
$blobName == ""

#Select the storage account and get the context
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

#Select the blob from a container
$blob = Get-AzStorageBlob -Container $containerName -Blob $blobName -Context $ctx

#Change the blob’s access tier to archive
$blob.ICloudBlob.SetStandardBlobTier("Archive")
```

---

## Next steps

- [How to manage the default account access tier of an Azure Storage account](../common/manage-account-default-access-tier.md)
- [Learn about rehydrating blob data from the archive tier](archive-rehydrate-overview.md)
- [Check hot, cool, and archive pricing in Blob Storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
