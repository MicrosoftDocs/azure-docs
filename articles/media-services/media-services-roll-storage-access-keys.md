---
title: Update Media Services after rolling storage access keys | Microsoft Docs
description: This articles give you guidance on how to update Media Services after rolling storage access keys.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: a892ebb0-0ea0-4fc8-b715-60347cc5c95b
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/18/2017
ms.author: milanga;cenkdin;juliako

---
# Update Media Services after rolling storage access keys

When you create a new Azure Media Services (AMS) account, you are also asked to select an Azure Storage account that is used to store your media content. You can add more than one storage accounts to your Media Services account. This topic shows how to rotate storage keys. It also shows how to add storage accounts to a media account. 

To perform the actions described in this topic, you should be using [ARM APIs](https://docs.microsoft.com/rest/api/media/mediaservice) and [Powershell](https://docs.microsoft.com/powershell/resourcemanager/azurerm.media/v0.3.2/azurerm.media).  For more information, see [How to manage Azure resources with PowerShell and Resource Manager](../azure-resource-manager/powershell-azure-resource-manager.md).

## Overview

When a new storage account is created, Azure generates two 512-bit storage access keys, which are used to authenticate access to your storage account. To keep your storage connections more secure, it is recommended to periodically regenerate and rotate your storage access key. Two access keys (primary and secondary) are provided in order to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. This procedure is also called "rolling access keys".

Media Services depends on a storage key provided to it. Specifically, the locators that are used to stream or download your assets depend on the specified storage access key. When an AMS account is created it takes a dependency on the primary storage access key by default but as a user you can update the storage key that AMS has. You must make sure to let Media Services know which key to use by following steps described in this topic.  

>[!NOTE]
> If you have multiple storage accounts, you would perform this procedure with each storage account.
>
> Before executing steps described in this topic on a production account, make sure to test them on a pre-production account.
>

## Steps to rotate storage keys 

 1. Change storage account Primary key through the powershell cmdlet or [Azure](https://portal.azure.com/) portal.
 2. Call Sync-AzureRmMediaServiceStorageKeys cmdlet with appropriate params to force media account to pick up storage account keys
 
    The following example shows how to sync keys to storage accounts.
  
         Sync-AzureRmMediaServiceStorageKeys -ResourceGroupName $resourceGroupName -AccountName $mediaAccountName -StorageAccountId $storageAccountId
  
 3. Wait 6 hours. Verify the streaming scenarios are working.
 4. Change storage account secondary key through the powershell cmdlet or Azure portal.
 5. Call Sync-AzureRmMediaServiceStorageKeys powershell with appropriate params to force media account to pick up new storage account keys. 
 6. Verify the streaming scenarios are working.
 
 ## Steps to add storage accounts to your AMS account
  
 The following sample shows how to use [Powershell](https://docs.microsoft.com/powershell/resourcemanager/azurerm.media/v0.3.2/azurerm.media) to add two storage accounts to the AMS account.

    $regionName = "West US"
    $subscriptionId = " xxxxxxxx-xxxx-xxxx-xxxx- xxxxxxxxxxxx "
    $resourceGroupName = "SkyMedia-USWest-App"
    $mediaAccountName = "sky"
    $storageAccount1Name = "skystorage1"
    $storageAccount2Name = "skystorage2"
    $storageAccount1Id = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Storage/storageAccounts/$storageAccount1Name"
    $storageAccount2Id = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Storage/storageAccounts/$storageAccount2Name"
    $storageAccount1 = New-AzureRmMediaServiceStorageConfig -StorageAccountId $storageAccount1Id -IsPrimary
    $storageAccount2 = New-AzureRmMediaServiceStorageConfig -StorageAccountId $storageAccount2Id
    $storageAccounts = @($storageAccount1, $storageAccount2)

    Set-AzureRmMediaService -ResourceGroupName $resourceGroupName -AccountName $mediaAccountName -StorageAccounts $storageAccounts

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

### Acknowledgments
We would like to acknowledge the following people who contributed towards creating this document: Cenk Dingiloglu, Milan Gada, Seva Titov.
