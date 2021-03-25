---
title: Update Media Services v3 after rolling storage access keys | Microsoft Docs
description: This article gives you guidance on how to update Media Services v3 after rolling storage access keys.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/22/2021
ms.author: inhenkel
---
# Update Media Services v3 after rolling storage access keys

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

You're asked to select an Azure Storage account when you create a new Azure Media Services (AMS) account.  You can add more than one storage account to your Media Services account. This article shows how to rotate storage keys. It also shows how to add storage accounts to a media account.

To complete the actions described in this article, you should be using [Azure Resource Manager APIs](/rest/api/media/operations/azure-media-services-rest-api-reference) and [PowerShell](/powershell/module/az.media).  For more information, see [How to manage Azure resources with PowerShell and Resource Manager](../../azure-resource-manager/management/manage-resource-groups-powershell.md).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Storage access key generation

When a new storage account is created, Azure generates two 512-bit storage access keys, that are used to authenticate access to your storage account. To keep your storage connections more secure, periodically regenerate and rotate your storage access key. Two access keys (primary and secondary) are provided to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. This procedure is also called "rolling access keys".

Media Services depends on a storage key provided to it. Specifically, the locators that are used to stream or download your assets depend on the specified storage access key. When an AMS account is created, it takes a dependency on the primary storage access key by default. However, as a user you can update the storage key that AMS has. You must let Media Services know which key to use by following these steps:

>[!NOTE]
> If you have multiple storage accounts, you would perform this procedure with each storage account. The order in which you rotate storage keys is not fixed. You can rotate the secondary key first and then the primary key or vice versa.
>
> Before executing the steps on a production account, make sure to test them on a pre-production account.
>

## Steps to rotate storage keys
 
 1. Change the storage account Primary key through the PowerShell cmdlet or [Azure](https://portal.azure.com/) portal.
 2. Call the `Sync-AzMediaServiceStorageKeys` cmdlet with appropriate parameters to force the media account to pick up storage account keys
 
    The following example shows how to sync keys to storage accounts.
  
    `Sync-AzMediaServiceStorageKeys -ResourceGroupName $resourceGroupName -AccountName $mediaAccountName -StorageAccountId $storageAccountId`
  
 3. Wait an hour or so. Verify the streaming scenarios are working.
 4. Change the storage account secondary key through the PowerShell cmdlet or Azure portal.
 5. Call `Sync-AzMediaServiceStorageKeys` PowerShell with appropriate parameters to force the media account to pick up new storage account keys.
 6. Wait an hour or so. Verify the streaming scenarios are working.
 
### A PowerShell cmdlet example

The following example demonstrates how to get the storage account and sync it with the AMS account.

```console
$regionName = "West US"
$resourceGroupName = "SkyMedia-USWest-App"
$mediaAccountName = "sky"
$storageAccountName = "skystorage"
$storageAccountId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Storage/storageAccounts/$storageAccountName"

Sync-AzMediaServiceStorageKeys -ResourceGroupName $resourceGroupName -AccountName $mediaAccountName -StorageAccountId $storageAccountId
```

## Steps to add storage accounts to your AMS account

The following article shows how to add storage accounts to your AMS account: [Attach multiple storage accounts to a Media Services account](media-services-managing-multiple-storage-accounts.md).
