---
title: Accessing blob data from the Archive tier
description: Accessing your blob data from Archive storage. Options and expectations for rehydration.
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: article
ms.date: 06/20/2019
ms.author: mhopkins
ms.reviewer: hux
ms.component: blobs
---

# Accessing blob data from the Archive tier

The Archive access tier is offline and is meant to provide lowest cost of storage for data that is retained long-term and rarely retrieved. While a blob is in Archive storage, it cannot be read or modified. The blob metadata remains online and available, allowing you to list the blob and its properties. Blobs in the offline Archive tier may be switched to an online tier using the [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) operation. Alternatively, a new online copy may be created using the [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) operation. Reading and modifying blob data is only available with online tiers such as a Hot or Cool. For more information, see [Azure Blob Access Tiers](storage-blob-storage-tiers.md).

There are two options to retrieve and access data stored on the Archive access tier:

1. [Rehydrate an archived blob to an online tier](#rehydrate-an-archived-blob-to-an-online-tier) - An archived blob can be rehydrated to Hot or Cool by changing its tier using the **Set Blob Tier** operation.
2. [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) - A copy of an archived blob can be created by using the **Copy Blob** operation. Specify a different blob name and a destination tier of Hot or Cool.

## Rehydrate an archived blob to an online tier

[!INCLUDE [storage-blob-rehydration](../../../includes/storage-blob-rehydrate-include.md)]

## Copy an archived blob to an online tier

In cases where you do not wish to rehydrate a blob from Archive into an online tier, you can choose a **Copy Blob** operation. Your original blob will remain unmodified in Archive while you work on the new blob in the Hot or Cool tier. You may specify a **rehydrate-priority** of "Standard" or "High" when initiating the copy process.

Archive blobs can only be copied to online destination tiers. Copying an Archive blob to another Archive blob is not supported.

## Pricing and billing

Rehydrating blobs out of Archive into Hot or Cool tiers are charged as read operations and data retrieval. Utilizing High priority rehydration has higher operation and data retrieval costs compared to the default Standard priority option. High priority rehydration will also show up as separate line items on your bill. In the rare case that High **rehydrate-priority** requests take over 5 hours to return Archive blobs of a few gigabytes, you will not be charged the priority retrieval rates.

Copying blobs from Archive into Hot or Cool tiers are charged as read operations and data retrieval. A write operation is charged for the creation of the new copy. Early deletion fees do not apply for a copy of an Archive blob source blob remains unmodified in the Archive tier when a new online blob is created. High **rehydrate-priority** charges do apply.

Blobs in the Archive tier should be stored for a minimum of 180 days. Any archived blobs that are rehydrated into an online tier or deleted before 180 days are subject to an early deletion fee. Early deletion fees do not apply when you create an online copy of the archive blob as the original blob remains in archive when a new copy is created.

> [!NOTE]
> For more information about pricing for Block Blobs and data rehydration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

## Next Steps

* [Learn about Blob Storage Tiers](storage-blob-storage-tiers.md)
* [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
* [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)
* [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
