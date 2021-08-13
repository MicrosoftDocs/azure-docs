---
title: Overview of blob rehydration from the archive tier
description: While a blob is in the archive access tier, it's considered to be offline and can't be read or modified. In order to read or modify data in an archived blob, you must first rehydrate the blob to an online tier, either the hot or cool tier.
services: storage
author: tamram

ms.author: tamram
ms.date: 08/11/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: fryu
---

# Overview of blob rehydration from the archive tier

While a blob is in the archive access tier, it's considered to be offline and can't be read or modified. In order to read or modify data in an archived blob, you must first rehydrate the blob to an online tier, either the hot or cool tier. There are two options for rehydrating a blob that is stored in the archive tier:

- [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier): You can rehydrate an archived blob by copying it to a new blob in the hot or cool tier with the [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) operation. Microsoft recommends this option for most scenarios.

- [Change a blob's access tier to an online tier](#change-a-blobs-access-tier-to-an-online-tier): You can rehydrate an archived blob to hot or cool by changing its tier using the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation.

Rehydrating a blob from the archive tier with can take several hours to complete. Microsoft recommends rehydrating larger blobs for optimal performance. Rehydrating several small blobs concurrently may require additional time.

You can configure [Azure Event Grid](../../event-grid/overview.md) to raise an event when you rehydrate a blob from the archive tier to an online tier and to send the event to an event handler. For more information, see [Handle an event on blob rehydration](#handle-an-event-on-blob-rehydration).

For more information about access tiers in Azure Storage, see [Access tiers for Azure Blob Storage - hot, cool, and archive](storage-blob-storage-tiers.md).

## Rehydration priority

When you rehydrate a blob, you can set the priority for the rehydration operation via the optional *x-ms-rehydrate-priority* header on a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or [Copy Blob](/rest/api/storageservices/copy-blob)/[Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operation. Rehydration priority options include:

- **Standard priority**: The rehydration request will be processed in the order it was received and may take up to 15 hours.
- **High priority**: The rehydration request will be prioritized over standard priority requests and may complete in under one hour for objects under 10 GB in size.

To check the rehydration priority while the rehydration operation is underway, call [Get Blob Properties](/rest/api/storageservices/get-blob-properties) to return the value of the `x-ms-rehydrate-priority` header. The rehydration priority property returns either *Standard* or *High*.

Standard priority is the default rehydration option. A high-priority rehydration is faster, but also costs more than a standard-priority rehydration. A high-priority rehydration may take longer than one hour, depending on blob size and current demand. Microsoft recommends reserving high-priority rehydration for use in emergency data restoration situations.

For more information on pricing differences between standard-priority and high-priority rehydration requests, see [Pricing for Azure Blob Storage](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Copy an archived blob to an online tier

The first option for moving a blob from the archive tier to an online tier is to copy the archived blob to a new destination blob that is in either the hot or cool tier. You can use either the [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) operation to copy the blob. When you copy an archived blob to a new blob an online tier, the source blob remains unmodified in the archive tier.

You must copy the archived blob to a new blob with a different name or to a different container. You cannot overwrite the source blob by copying to the same blob.

Microsoft recommends performing a copy operation in most scenarios where you need to move a blob from the archive tier to an online tier, for the following reasons:

- A copy operation avoids the early deletion fee that is assessed if you change the tier of a blob from the archive tier before the required 180-day period elapses. For more information, see [Archive access tier](storage-blob-storage-tiers.md#archive-access-tier).
- If there is a lifecycle management policy in effect for the storage account, then rehydrating a blob with [Set Blob Tier](/rest/api/storageservices/set-blob-tier) can result in a scenario where the lifecycle policy moves the blob back to the archive tier after rehydration because the last modified time is beyond the threshold set for the policy. A copy operation leaves the source blob in the archive tier and creates a new blob with a different name and a new last modified time, so there is no risk that the rehydrated blob will be moved back to the archive tier by the lifecycle policy.

Copying a blob from the archive tier can take hours to complete depending on the rehydration priority selected. Behind the scenes, a blob copy operation reads your archived source blob to create a new online blob in the selected destination tier. The new blob may be visible when you list the blobs in the parent container before the rehydration operation is complete, but its tier will be set to archive, The data is not available until the read operation from the source blob in the archive tier is complete and the blob's contents have been written to the new destination blob in an online tier. The new blob is an independent copy, so modifying or deleting it does not affect the source blob in the archive tier.

To learn how to rehydrate a blob by copying it to an online tier, see [Rehydrate a blob with a copy operation](archive-rehydrate-to-online-tier.md#rehydrate-a-blob-with-a-copy-operation).

> [!IMPORTANT]
> Do not delete the source blob until the rehydration has completed successfully. If the source blob is deleted, then the destination blob may not finish copying. You can handle the event that is raised when the copy operation completes to know when it is safe to delete the source blob. For more information, see [Handle an event on blob rehydration](#handle-an-event-on-blob-rehydration).

Copying an archived blob to an online destination tier is supported within the same storage account only. You cannot copy an archived blob to a destination blob that is also in the archive tier.

The following table shows the behavior of a blob copy operation, depending on the tiers of the source and destination blob.

|  | **Hot tier source** | **Cool tier source** | **Archive tier source** |
|--|--|--|--|
| **Hot tier destination** | Supported | Supported | Supported within the same account. Requires blob rehydration. |
| **Cool tier destination** | Supported | Supported | Supported within the same account. Requires blob rehydration. |
| **Archive tier destination** | Supported | Supported | Unsupported |

## Change a blob's access tier to an online tier

The second option for rehydrating a blob from the archive tier to an online tier is to change the blob's tier by calling [Set Blob Tier](/rest/api/storageservices/set-blob-tier). With this operation, you can change the tier of the archived blob to either hot or cool.

Once a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) request is initiated, it cannot be canceled. During the rehydration operation, the blob's access tier setting continues to show as archived until the rehydration process is complete. When the rehydration operation is complete, the blob's access tier property updates to reflect the new tier.

To learn how to rehydrate a blob by changing its tier to an online tier, see [Rehydrate a blob by changing its tier](archive-rehydrate-to-online-tier.md#rehydrate-a-blob-by-changing-its-tier).

> [!CAUTION]
> Changing a blob's tier doesn't affect its last modified time. If there is a [lifecycle management](storage-lifecycle-management-concepts.md) policy in effect for the storage account, then rehydrating a blob with **Set Blob Tier** can result in a scenario where the lifecycle policy moves the blob back to the archive tier after rehydration because the last modified time is beyond the threshold set for the policy.
>
> To avoid this scenario, rehydrate the archived blob by copying it instead, as described in the [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) section. Performing a copy operation creates a new instance of the blob with an updated last modified time, so it won't trigger the lifecycle management policy.

## Check the status of a blob rehydration operation

During the blob rehydration operation, you can call the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation to check its status. To learn how to check the status of a rehydration operation, see [Check the status of a rehydration operation](archive-rehydrate-to-online-tier.md#check-the-status-of-a-rehydration-operation).

## Handle an event on blob rehydration

Rehydration of an archived blob may take up to 15 hours, and repeatedly polling **Get Blob Properties** to determine whether rehydration is complete is inefficient. Using [Azure Event Grid](../../event-grid/overview.md) to capture the event that fires when rehydration is complete offers better performance and cost optimization.

Azure Event Grid raises one of the following two events on blob rehydration, depending on which operation was used to rehydrate the blob:

- The **Microsoft.Storage.BlobCreated** event fires when a blob is created. In the context of blob rehydration, this event fires when a [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) operation creates a new destination blob in either the hot or cool tier and the blob's data is fully rehydrated from the archive tier.
- The **Microsoft.Storage.BlobTierChanged** event fires when a blob's tier is changed. In the context of blob rehydration, this event fires when a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation successfully changes an archived blob's tier to the hot or cool tier.

To learn how to capture an event on rehydration and send it to an Azure Function event handler, see [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-handle-event.md).

For more information on handling events in Blob Storage, see [Reacting to Azure Blob storage events](storage-blob-event-overview.md) and [Azure Blob Storage as Event Grid source](../../event-grid/event-schema-blob-storage.md).

## Pricing and billing

A rehydration operation with [Set Blob Tier](/rest/api/storageservices/set-blob-tier) is billed for data read transactions and data retrieval size. A high-priority rehydration has higher operation and data retrieval costs compared to standard priority. High-priority rehydration shows up as a separate line item on your bill. If a high-priority request to return an archived blob of a few gigabytes takes more than five hours, you won't be charged the high-priority retrieval rate. However, standard retrieval rates still apply.

Copying an archived blob to an online tier with [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) is billed for data read transactions and data retrieval size. Creating the destination blob in an online tier is billed for data write transactions. Early deletion fees don't apply when you copy to an online blob because the source blob remains unmodified in the archive tier. High-priority retrieval charges do apply if selected.

Blobs in the archive tier should be stored for a minimum of 180 days. Deleting or changing the tier of an archived blob before the 180-day period elapses incurs an early deletion fee. For more information, see [Archive access tier](storage-blob-storage-tiers.md#archive-access-tier).

For more information about pricing for block blobs and data rehydration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

## See also

- [Azure Blob Storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).
- [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md)
- [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-handle-event.md)
- [Reacting to Blob storage events](storage-blob-event-overview.md)