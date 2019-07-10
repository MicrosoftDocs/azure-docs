---
title: Data rehydration for blobs in the Archive access tier - Azure Storage
description: Reading your blob data from Archive storage. Options and expectations for rehydration.
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: article
ms.date: 06/20/2019
ms.author: mhopkins
ms.reviewer: hux
ms.component: blobs
---

# Reading blob data from the Archive tier

The archive access tier is an offline tier meant to provide lowest cost of storage for data that is retained long-term and rarely retrieved for access. While a blob is in archive storage, the underlying data is offline and cannot be read or modified. However, the blob metadata remains online and available, allowing you to list the blob and its properties. Blobs in the offline archive tier may be switched to an online tier using the [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) API or a new online copy may be created using the [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) API. Data read and modification is available only with online tiers such as a hot or cool. For more information about Blob access tiers, see [Azure Blob Access Tiers](storage-blob-storage-tiers.md)

The two options to retrieve and access data stored on the Archive access tier are:

1. [Rehydrate archive blob to online tier](#rehydrate-archive-blob-to-online-tier) - The archive blob itself can be rehydrated to hot or cool by changing its tier using the SetBlobTier API.
2. [Copy archive blob to online tier](#copy-archive-blob-to-online-tier) - A copy of the archive blob can be created using the CopyBlob API by specifying a different blob name and destination tier of hot or cool.

## Rehydrate archive blob to online tier
[!INCLUDE [storage-blob-rehydration](../../../includes/storage-blob-rehydrate-include.md)]

### Standard rehydrate-priority
Standard rehydrate-priority is the default option for Archive SetBlobTier and CopyBlob requests, with data rehydrates taking up to 15 hours. Standard rehydration from Archive occurs when the optional **rehydrate-priority** property is not set or is set to "Standard".

### High rehydrate-priority 
High rehydrate-priority fulfills the need for urgent data retrieval from Archive with these requests being prioritized over Standard rehydrate-priority requests. High rehydrate-priority requests for Archive blob of a few GB in size, will typically be returned in less than 1 hour. Larger blobs will be returned as quickly as possible but may take longer than 1 hour.

In most scenarios, a High rehydrate-priority request may return your Archive data in under 1 hour; however, Archive rehydration demand at the time of request can affect the speed at which your data rehydration is completed. In the rare scenario where Archive receives an exceptionally large number of concurrent requests, your High rehydrate-priority will still be prioritized over Standard rehydrate-priority requests. Your data will be rehydrated as soon as possible but it may take longer than 1 hour to rehydrate your data from Archive.

## Copy archive blob to online tier

In the cases where you do not wish to rehydrate a blob from archive into an online tier, you can choose to make a copy using the CopyBlob API. Behind the scenes, the CopyBlob API temporarily rehydrates your archive source blob to create a new online blob in the destination tier of your choice. This new blob will not be available until the temporary rehydrate from archive is complete and the data is written to the new blob. Your original blob will remain unmodified in archive while you can work on the new blob in the hot or cool tier. You may also choose to specify a rehydrate-priority of [**Standard**](#standard-rehydrate-priority) or [**High**](#high-rehydrate-priority) when initiating the copy process from archive storage.

The following scenarios are enabled with the CopyBlob API:

| **Source Blob Tier** | **Destination Tiers Supported** |
| ------------ | ------------ |
| Hot  | Hot, Cool, Archive |
| Cool | Hot, Cool, Archive |
| Archive | Hot, Cool <sup>1,2,3</sup>|

<sup>1</sup> Creating a copy of an archive source blob into hot or cool destination blob initiates a temporary rehydrate of the source blob. Early deletion fees do not apply as the source blob remains in archive after a new online blob is created.

<sup>2</sup> Archive blobs can only be copied to online destination tiers. Copying an archive blob to another archive blob is not supported.

<sup>3</sup> Both Standard and High rehydrate-priority is supported when initiating a copy of an archive blob.

## Pricing and billing

Rehydrating blobs out of archive into hot or cool are charged as read operations and data retrieval. Utilizing High priority rehydration has higher operation and data retrieval costs compared to the default Standard priority option. High priority rehydration will also show up as separate line items on your bill. In the rare case that High rehydrate-priority requests take over 5 hours to return Archive blobs of a few GB in size, you will not be charged the priority retrieval rates.

Copying blobs from archive into hot or cool are charged as read operations and data retrieval for the source archive blob. A write operation is charged for the creation of the new copy. Early deletion fees do not apply for a copy of an archive blob as the archive blob remains unmodified in the archive tier when a new online blob is created. High rehydrate-priority charges will apply if specified

> [!NOTE]
> For more information about pricing for Block Blobs and data rehydration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page. For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.

## Quickstart scenarios

## FAQ
**Are there any special considerations for Blob rehydration from archive?**
The archive access tier is an offline tier meant to provide the lowest cost of storage for data that is retained long-term and rarely retrieved for access. Rehydration from Archive to an online tier will take time and the latency provided is on the order of under 1 hour to 15 hours depending on the rehydration priority chosen. For data that requires online millisecond latency, we recommend using the hot or cool access tier. For more information about Blob access tiers, see [Azure Blob Access Tiers](storage-blob-storage-tiers.md)

**What are the recommended use cases for High priority rehydration?**

We recommend utilizing High priority rehydration for emergency situations when data must be rehydrated to an online tier as quickly as possible. We don't recommend utilizing High priority rehydrations consistently instead of Standard priority rehydrations as it may be more cost-effective to utilize an online access tier like cool or hot instead of archive.

**Is High priority rehydration guaranteed to return data faster than Standard priority?**

Your High rehydrate-priority request is guaranteed to be prioritized over Standard rehydrate-priority requests and rehydrate your Archive data as quickly as possible. In most situations, Archive blobs of a few GB in size will be returned under 1 hour and any larger blobs will be returned as quickly as possible. In the rare case that High rehydrate-priority requests take over 5 hours to return Archive blobs of a few GB in size, you will not be charged the priority retrieval rates.

**Will there be early deletion charges for data moved out of archive?**

Blobs in the archive access tier should be stored for a minimum of 180 days. Any archived blobs that are rehydrated into an online tier or deleted before 180 days are subject to an early deletion fee of the remaining difference. Early deletion fees do not apply when you create an online copy of the archive blob as the original blob remains in archive when a new copy is created. For more information on early deletion periods, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

**Can I upgrade the speed of an in-progress Blob rehydration from archive?**

Upgrading an existing Standard rehydrate-priority request to a High rehydrate-priority request is not currently available for Public Preview.

**Which storage accounts support the archive tier?**

GPv2 and Blob storage accounts support hot, cool, and archive tiers and allow for blob-level tiering. GPv1 accounts do not support blob-level tiering. For more information, see [Azure storage account overview](../common/storage-account-overview.md).

**Which Azure tools and SDKs support blob-level tiering and archive storage rehydration?**

Azure portal, PowerShell, and CLI tools and .NET, Java, Python, and Node.js client libraries all support blob-level tiering and archive storage rehydration.

## Next Steps

[Learn about Blob Storage Tiers](storage-blob-storage-tiers.md)

[Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)

[Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)

[Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
