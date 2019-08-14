---
title: Rehydrate blob data from the archive tier
description: Rehydrate your blobs from archive storage so you can access the data.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/07/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: hux
---

# Rehydrate blob data from the archive tier

While a blob is in the archive access tier, it's considered offline and can't be read or modified. The blob metadata remains online and available, allowing you to list the blob and its properties. Reading and modifying blob data is only available with online tiers such as hot or cool. There are two options to retrieve and access data stored in the archive access tier.

1. [Rehydrate an archived blob to an online tier](#rehydrate-an-archived-blob-to-an-online-tier) - Rehydrate an archived blob to hot or cool by changing its tier using the [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) operation.
2. [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) - Create a new copy of an archived blob by using the [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) operation. Specify a different blob name and a destination tier of hot or cool.

 For more information on tiers, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).

## Rehydrate an archived blob to an online tier

[!INCLUDE [storage-blob-rehydration](../../../includes/storage-blob-rehydrate-include.md)]

## Copy an archived blob to an online tier

If you don't want to rehydrate a blob, you can choose a [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) operation. Your original blob will remain unmodified in archive while you work on the new blob in the hot or cool tier. You can set the optional *x-ms-rehydrate-priority* property to Standard or High (preview) when using the copy process.

Archive blobs can only be copied to online destination tiers. Copying an archive blob to another archive blob isn't supported.

Copying a blob from Archive takes time. Behind the scenes, the **Copy Blob** operation temporarily rehydrates your archive source blob to create a new online blob in the destination tier. This new blob is not available until the temporary rehydration from archive is complete and the data is written to the new blob.

## Pricing and billing

Rehydrating blobs out of archive into hot or cool tiers are charged as read operations and data retrieval. Using High priority (preview) has higher operation and data retrieval costs compared to standard priority. High-priority rehydration shows up as a separate line item on your bill. If a high-priority request to return an archive blob of a few gigabytes takes over 5 hours, you won't be charged the high-priority retrieval rate. However, standard retrieval rates still apply.

Copying blobs from archive into hot or cool tiers are charged as read operations and data retrieval. A write operation is charged for the creation of the new copy. Early deletion fees don't apply when you copy to an online blob because the source blob remains unmodified in the archive tier. High priority charges do apply.

Blobs in the archive tier should be stored for a minimum of 180 days. Deleting or rehydrating archived blobs before 180 days will incur early deletion fees.

> [!NOTE]
> For more information about pricing for block blobs and data rehydration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

## Next Steps

* [Learn about Blob Storage Tiers](storage-blob-storage-tiers.md)
* [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
* [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)
* [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
