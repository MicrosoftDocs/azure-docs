---
title: Use Azure Data Box to send data to - hot, cold, archive - block blob tier | Microsoft Docs in data 
description: Describes how to use the Azure Data Box to send data to an appropriate block blob storage tier such as hot, cold or archive
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: overview
ms.date: 12/11/2018
ms.author: alkohli
---

# Use Azure Data Box to send data to appropriate block blob tier

Azure Data Box moves large amounts of data to Azure by shipping you a proprietary storage device. You fill up the device with data and return it. The data from Data Box is uploaded to the default tier and you can then move it to another storage tier.

This article describes how the data that is uploaded by Data Box can be moved to a Hot, Cold, or Archive blob tier.  

## Choose the correct storage tier for your data

Azure storage allows three different tiers to store data in the most cost-effective manner - Hot, Cold, or Archive. The data from the Data Box is uploaded to a tier that is associated with the storage account. When you create a storage account, you can specify the access tier as Hot or Cold. Depending upon the access pattern of your workload and cost, you can move this data from the default tier to another storage tier.

You may only tier your object storage data to Hot, Cool, or Archive in Blob storage or General Purpose v2 (GPv2) accounts. General Purpose v1 (GPv1) accounts do not support tiering. To choose the correct storage tier for your data, review the considerations detailed in [Azure Blob storage: Premium, Hot, Cool, and Archive storage tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers).


## Set a default blob tier

The default blob tier is specified when the storage account is created in the Azure portal. Once a storage type is selected as GPv2 or Blob storage, then the Access tier attribute can be specified. By default, the Hot tier is selected.

The tiers cannot be specified if you are trying to create a new accout when ordering a Data Box. To specify tiers, you need to create a storage account first with the specified access tier attribute. When creating the Data Box order, you can simply select this existing storage account.

For more information on how to set the default blob tier, go to 
-	How to set a default blob tier? Link to storage account details for setting hot/cool


## Move data to a non-default tier


-	How do I move data into the ‘non-default’ tier (E.g. Archive) 
o	DLM (preview): https://docs.microsoft.com/en-us/azure/storage/common/storage-lifecycle-managment-concepts
o	Script - Call SetBlobTier to Archive via Script (PowerShell example below)

#Log into Azure
Login-AzureRmAccount (KH: this is usually implied to scan get rid of it)
 
#Define variables for account, key, container and storage context
$StorageAccountName = "<enter account name>" 
$StorageAccountKey = "<enter account key>"
$ContainerName = "<enter container name>"
$ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
 
#Get all blobs in container
$blob = Get-AzureStorageBlob -Container "test" -Context $ctx
 
#Set tier of all blobs to Archive
$blob.icloudblob.setstandardblobtier("Archive") 
-	Recommendations: 
o	If the desired tier is Archive, recommend moving Upload data to Hot tier first If the data will be tiered to Archive immediately, set the default account tier to Hot to avoid the 30-day early deletion penalty on the Cool tier (GPv2 accounts).



## Next steps

- Review the [Data Box requirements](data-box-system-requirements.md).
- Understand the [Data Box limits](data-box-limits.md).
- Quickly deploy [Azure Data Box](data-box-quickstart-portal.md) in Azure portal.
