---
title: Use Azure Data Box, Azure Data Box Heavy to send data to hot, cold, archive blob tier | Microsoft Docs in data 
description: Describes how to use Azure Data Box or Azure Data Box Heavy to send data to an appropriate block blob storage tier such as hot, cold, or archive
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 05/24/2019
ms.author: alkohli
---

# Use Azure Data Box or Azure Data Box Heavy to send data to appropriate Azure Storage blob tier

Azure Data Box moves large amounts of data to Azure by shipping you a proprietary storage device. You fill up the device with data and return it. The data from Data Box is uploaded to a default tier associated with the storage account. You can then move the data to another storage tier.

This article describes how the data that is uploaded by Data Box can be moved to a Hot, Cold, or Archive blob tier. This article applies to both Azure Data Box and Azure Data Box Heavy.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Choose the correct storage tier for your data

Azure storage allows three different tiers to store data in the most cost-effective manner - Hot, Cold, or Archive. Hot storage tier is optimized for storing data that is accessed frequently. Hot storage has higher storage costs than Cool and Archive storage, but the lowest access costs.

Cool storage tier is for infrequently accessed data that needs to be stored for a minimum of 30 days. The storage cost for cold tier is lower than that of hot storage tier but the data access charges are high when compared to Hot tier.

The Azure Archive tier is offline and offers the lowest storage costs but also the highest access costs. This tier is meant for data that remains in archival storage for a minimum of 180 days. For details of each of these tiers and the pricing model, go to [Comparison of the storage tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers).

The data from the Data Box or Data Box Heavy is uploaded to a storage tier that is associated with the storage account. When you create a storage account, you can specify the access tier as Hot or Cold. Depending upon the access pattern of your workload and cost, you can move this data from the default tier to another storage tier.

You may only tier your object storage data in Blob storage or General Purpose v2 (GPv2) accounts. General Purpose v1 (GPv1) accounts do not support tiering. To choose the correct storage tier for your data, review the considerations detailed in [Azure Blob storage: Premium, Hot, Cool, and Archive storage tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers).

## Set a default blob tier

The default blob tier is specified when the storage account is created in the Azure portal. Once a storage type is selected as GPv2 or Blob storage, then the Access tier attribute can be specified. By default, the Hot tier is selected.

The tiers cannot be specified if you are trying to create a new account when ordering a Data Box or Data Box Heavy. After the account is created, you can modify the account in portal to set the default access tier.

Alternatively, you create a storage account first with the specified access tier attribute. When creating the Data Box or Data Box Heavy order, select the existing storage account. For more information on how to set the default blob tier during storage account creation, go to [Create a storage account in Azure portal](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=portal).

## Move data to a non-default tier

Once the data from Data Box device is uploaded to the default tier, you may want to move the data to a non-default tier. There are two ways to move this data to a non-default tier.

- **Azure Blob storage lifecycle management** - You can use a policy-based approach to automatically tier data or expire at the end of its lifecycle. For more information, go to [Managing the Azure Blob storage lifecycle](https://docs.microsoft.com/azure/storage/common/storage-lifecycle-managment-concepts).
- **Scripting** - You could use a scripted approach via Azure PowerShell to enable blob-level tiering. You can call the `SetBlobTier` operation to set the tier on the blob.

## Use Azure PowerShell to set the blob tier

Following steps describe how you can set the blob tier to Archive using an Azure PowerShell script.

1. Open an elevated Windows PowerShell session. Make sure that your running PowerShell 5.0 or higher. Type:

   `$PSVersionTable.PSVersion`     

2. Sign into the Azure PowerShell. 

   `Login-AzAccount`  

3. Define the variables for storage account, access key, container, and the storage context.

    ```powershell
    $StorageAccountName = "<enter account name>"
    $StorageAccountKey = "<enter account key>"
    $ContainerName = "<enter container name>"
    $ctx = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    ```

4. Get all the blobs in the container.

    `$blobs = Get-AzStorageBlob -Container "<enter container name>" -Context $ctx`
 
5. Set the tier of all the blobs in the container to Archive.

    ```powershell
    Foreach ($blob in $blobs) {
    $blob.ICloudBlob.SetStandardBlobTier("Archive")
    }
    ```

    A sample output is shown below:

    ```
    Windows PowerShell
    Copyright (C) Microsoft Corporation. All rights reserved.
    PS C:\WINDOWS\system32> $PSVersionTable.PSVersion

    Major  Minor  Build  Revision
    -----  -----  -----  --------
    5      1      17763  134
    PS C:\WINDOWS\system32> Login-AzAccount

    Account          : gus@contoso.com
    SubscriptionName : MySubscription
    SubscriptionId   : subscription-id
    TenantId         : tenant-id
    Environment      : AzureCloud

    PS C:\WINDOWS\system32> $StorageAccountName = "mygpv2storacct"
    PS C:\WINDOWS\system32> $StorageAccountKey = "mystorageacctkey"
    PS C:\WINDOWS\system32> $ContainerName = "test"
    PS C:\WINDOWS\system32> $ctx = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    PS C:\WINDOWS\system32> $blobs = Get-AzStorageBlob -Container "test" -Context $ctx
    PS C:\WINDOWS\system32> Foreach ($blob in $blobs) {
    >> $blob.ICloudBlob.SetStandardBlobTier("Archive")
    >> }
    PS C:\WINDOWS\system32>
    ```
   > [!TIP]
   > If you want the data to archive on ingest, set the default account tier to Hot. If the default tier is Cool, then there is a 30-day early deletion penalty if the data moves to Archive immediately.

## Next steps

-  Learn how to address the [common data tiering scenarios with lifecycle policy rules](https://docs.microsoft.com/azure/storage/blobs/storage-lifecycle-management-concepts#examples)

