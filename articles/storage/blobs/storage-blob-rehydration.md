---
title: Rehydrate blob data from the archive tier
description: Rehydrate your blobs from archive storage so you can access the blob data. Copy an archived blob to an online tier.
services: storage
author: tamram

ms.author: tamram
ms.date: 07/23/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: hux 
ms.custom: devx-track-azurepowershell
---

# Rehydrate blob data from the archive tier

While a blob is in the archive access tier, it's considered offline and can't be read or modified. The blob metadata remains online and available, allowing you to list the blob and its properties. Reading and modifying blob data is only available with online tiers such as hot or cool. There are two options to retrieve and access data stored in the archive access tier.

1. [Rehydrate an archived blob to an online tier](#rehydrate-an-archived-blob-to-an-online-tier) - Rehydrate an archive blob to hot or cool by changing its tier using the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation.
2. [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) - Create a new copy of an archive blob by using the [Copy Blob](/rest/api/storageservices/copy-blob) operation. Specify a different blob name and a destination tier of hot or cool.

 For more information on tiers, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).

## Rehydrate an archived blob to an online tier

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take hours to complete. We recommend large blob sizes for optimal rehydration performance. Rehydrating several small blobs concurrently may add additional time. There are currently two rehydrate priorities, High and Standard, which can be set via the optional *x-ms-rehydrate-priority* property on a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or [Copy Blob](/rest/api/storageservices/copy-blob) operation.

* **Standard priority**: The rehydration request will be processed in the order it was received and may take up to 15 hours.
* **High priority**: The rehydration request will be prioritized over Standard requests and may finish in under 1 hour for objects under ten GB in size.

> [!NOTE]
> Standard priority is the default rehydration option for archive. High priority is a faster option that will cost more than Standard priority rehydration and is usually reserved for use in emergency data restoration situations.
>
> High priority may take longer than 1 hour, depending on blob size and current demand. High priority requests are guaranteed to be prioritized over Standard priority requests.

Once a rehydration request is initiated, it cannot be canceled. During the rehydration process, the *x-ms-access-tier* blob property will continue to show as archive until rehydration is completed to an online tier. To confirm rehydration status and progress, you may call [Get Blob Properties](/rest/api/storageservices/get-blob-properties) to check the *x-ms-archive-status* and the *x-ms-rehydrate-priority* blob properties. The archive status can read "rehydrate-pending-to-hot" or "rehydrate-pending-to-cool" depending on the rehydrate destination tier. The rehydrate priority will indicate the speed of "High" or "Standard". Upon completion, the archive status and rehydrate priority properties are removed, and the access tier blob property will update to reflect the selected hot or cool tier.

### Lifecycle management

Rehydrating a blob doesn't change its last modified time. Using the [lifecycle management](storage-lifecycle-management-concepts.md) feature can result in a scenario where a blob is rehydrated and then a lifecycle management policy moves the blob back to the archive tier because the last modified time is beyond the threshold set for the policy. To avoid this scenario, use the process outlined in the [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) section. Performing a copy operation creates a new instance of the blob with an updated last modified time and and doesn't trigger the lifecycle management policy.

## Copy an archived blob to an online tier

If you don't want to rehydrate your archived blob, you can choose perform a [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy the blob to an online tier. The original source blob remains unmodified in the archive tier, while the new destination blob is created in the online hot or cool tier. You can set the optional `x-ms-rehydrate-priority` property on the **Copy Blob** operation to *Standard* or *High* to specify the priority for creating the destination blob.

Copying a blob from archive can take hours to complete depending on the rehydration priority selected. Behind the scenes, the **Copy Blob** operation reads your archive source blob to create a new online blob in the selected destination tier. The new blob may be visible when you list the blobs in the parent container, but the data is not available until the read operation from the source blob in the archive tier is complete and the data has been written to the new destination blob in an online tier. The new blob is an independent copy, so modifying or deleting it does not affect the source blob in the archive tier.

> [!IMPORTANT]
> Do not delete the the source blob until the copy is completed successfully at the destination. If the source blob is deleted then the destination blob may not complete copying and will be empty. You may check the *x-ms-copy-status* to determine the state of the copy operation.

Archive blobs can only be copied to online destination tiers within the same storage account. Copying an archive blob to a destination blob in the archive tier is not supported. The following table shows the behavior of the **Copy Blob** operation, depending on the tier of the source and destination blob.

|                                           | **Hot tier source**   | **Cool tier source** | **Archive tier source**    |
| ----------------------------------------- | --------------------- | -------------------- | ------------------- |
| **Hot tier destination**                  | Supported             | Supported            | Supported within the same account; pending rehydrate               |
| **Cool tier destination**                 | Supported             | Supported            | Supported within the same account; pending rehydrate               |
| **Archive tier destination**              | Supported             | Supported            | Unsupported         |

## Handle events on blob rehydration

As discussed in the previous sections, you can rehydrate a blob by calling one of the following operations:

* [Set Blob Tier](/rest/api/storageservices/set-blob-tier) changes the blob tier.
* [Copy Blob](/rest/api/storageservices/copy-blob)/[Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) can create a destination blob in a new tier.

Rehydrating a blob can take up to 15 hours for a standard priority rehydration, and up to one hour for a high priority rehydration. Azure Storage raises an event through Azure Event Grid when the rehydration is initiated, and again when it is complete. You can subscribe to these events so that your application is notified when the blob is rehydrated.

The following table describes the events that are raised when you change the tier of a blob with one of these operations:

| Operation status | Set Blob Tier | Copy Blob or Copy Blob from URL |
|--|--|--|
| When operation initiates | Microsoft.Storage.AsyncOperationInitiated | Microsoft.Storage.AsyncOperationInitiated |
| When operation completes | Microsoft.Storage.BlobTierChanged | Microsoft.Storage.BlobCreated |

For more information on handling events in Blob Storage, see [Reacting to Azure Blob storage events](storage-blob-event-overview.md).

## Pricing and billing

Rehydrating blobs out of archive into hot or cool tiers are charged as read operations and data retrieval. Using High priority has higher operation and data retrieval costs compared to standard priority. High priority rehydration shows up as a separate line item on your bill. If a high priority request to return an archive blob of a few gigabytes takes over 5 hours, you won't be charged the high priority retrieval rate. However, standard retrieval rates still apply as the rehydration was prioritized over other requests.

Copying blobs from archive into hot or cool tiers are charged as read operations and data retrieval. A write operation is charged for the creation of the new blob copy. Early deletion fees don't apply when you copy to an online blob because the source blob remains unmodified in the archive tier. High priority retrieval charges do apply if selected.

Blobs in the archive tier should be stored for a minimum of 180 days. Deleting or rehydrating archived blobs before 180 days will incur early deletion fees.

> [!NOTE]
> For more information about pricing for block blobs and data rehydration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

## Quickstart scenarios

### Rehydrate an archive blob to an online tier
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

## Next Steps

* [Learn about Blob Storage Tiers](storage-blob-storage-tiers.md)
* [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
* [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)
* [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
