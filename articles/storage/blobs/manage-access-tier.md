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

## Set a blob's tier on upload



### Upload a blob to the default tier

Storage accounts have a default access tier setting that indicates in which online tier a new blob is created. The default access tier setting can be set to either hot or cool. The behavior of this setting is slightly different depending on the type of storage account:

- The default access tier for a new general-purpose v2 storage account is set to the Hot tier by default. You can change the default access tier setting when you create a storage account or after it is created.
- When you create a legacy Blob Storage account, you must specify the default access tier setting as Hot or Cool when you create the storage account. You can change the default access tier setting for the storage account after it is created.

A blob that doesn't have an explicitly assigned tier infers its tier from the default account access tier setting. You can determine whether a blob's access tier is inferred by using the Azure portal, PowerShell, or Azure CLI.

#### [Portal](#tab/portal)

If a blob's access tier is inferred from the default account access tier setting, then the Azure portal displays the access tier as **Hot (inferred)** or **Cool (inferred)**.

:::image type="content" source="media/manage-access-tier/default-access-tier-portal.png" alt-text="Screenshot showing blobs with the default access tier in the Azure portal":::

#### [PowerShell](#tab/azure-powershell)

To determine whether a blob's access tier is inferred from Azure PowerShell, retrieve the blob, then check its **AccessTier** and **AccessTierInferred** properties.

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

TBD

---




### Upload a blob to a specified tier

You can override the default setting for an individual blob at the time that the blob is uploaded.

## Change an existing blob's tier

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

#Change the blob's access tier to archive
$blob.ICloudBlob.SetStandardBlobTier("Archive")
```

---

## Copy a blob to a different tier



## Next steps

- [How to manage the default account access tier of an Azure Storage account](../common/manage-account-default-access-tier.md)
- Learn about [rehydrating blob data from the archive tier](archive-rehydrate-overview.md)
- [Check hot, cool, and archive pricing in Blob Storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
