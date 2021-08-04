---
title: Rehydrate blob data from the archive tier
description: Rehydrate your blobs from archive storage so you can access the blob data. Copy an archived blob to an online tier.
services: storage
author: tamram

ms.author: tamram
ms.date: 08/03/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: fryu
---

# Rehydrate blob data from the archive tier

While a blob is in the archive access tier, it's considered offline and can't be read or modified. To read or modify data in an archived blob, you must first move the blob to an online tier, either hot or cool. There are two options for retrieving and accessing data stored in the archive tier:

- [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier): You can copy an archived blob to a new blob in the hot or cool tier by using the [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) operation. Microsoft recommends this option for most scenarios.

- [Rehydrate an archived blob to an online tier](#rehydrate-an-archived-blob-to-an-online-tier): You can rehydrate an archive blob to hot or cool by changing its tier using the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation.

When you move a blob from the archive tier to an online tier using one of these methods, [Azure Event Grid](../../event-grid/overview.md) raises an event. You can configure Event Grid to send the event to an event handler. For more information, see [Handle events on blob rehydration](#handle-events-on-blob-rehydration).

For more information about the archive tier, see [Archive access tier](storage-blob-storage-tiers.md#archive-access-tier).

## Rehydration priority

When you rehydrate a blob, you can set the priority for the rehydration operation via the optional *x-ms-rehydrate-priority* header on a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or [Copy Blob](/rest/api/storageservices/copy-blob)/[Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operation. Rehydration priority options include:

- **Standard priority**: The rehydration request will be processed in the order it was received and may take up to 15 hours.
- **High priority**: The rehydration request will be prioritized over standard priority requests and may complete in under one hour for objects under 10 GB in size.

To check the rehydration priority while the rehydration operation is underway, call [Get Blob Properties](/rest/api/storageservices/get-blob-properties) to get the value of the `x-ms-rehydrate-priority` header. The rehydrate priority property indicates whether the operation priority is high or standard.

> [!NOTE]
> Standard priority is the default rehydration option. A high-priority rehydration is faster, but also costs more than a standard-priority rehydration. Microsoft recommends reserving high-priority rehydration for use in emergency data restoration situations.
>
> A high-priority rehydration may take longer than one hour, depending on blob size and current demand. High-priority requests are guaranteed to be prioritized over standard-priority requests.

## Copy an archived blob to an online tier

The first option for moving a blob from the archive tier to an online tier is to copy the archived blob to a new destination blob that is in either the hot or cool tier. You can use either the [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) operation to copy the blob. When you copy an archived blob to a new blob an online tier, the source blob remains unmodified in the archive tier.

You must copy the archived blob to a new blob with a different name or to a different container. You cannot overwrite the source blob by copying to a blob with the same address.

Microsoft recommends performing a copy operation in most scenarios where you need to move a blob from the archive tier to an online tier, for the following reasons:

- A copy operation avoids the early deletion fee that is assessed if you delete a blob from the archive tier before the required 180-day period elapses.
- Because a copy operation leaves the source blob in the archive tier and creates a new blob with a different name, rehydrating a blob in this way does not affect any lifecycle management policies that may be in place.

Copying a blob from archive can take hours to complete depending on the rehydration priority selected. Behind the scenes, a blob copy operation reads your archived source blob to create a new online blob in the selected destination tier. The new blob may be visible when you list the blobs in the parent container, but the data is not available until the read operation from the source blob in the archive tier is complete and the blob's contents have been written to the new destination blob in an online tier. The new blob is an independent copy, so modifying or deleting it does not affect the source blob in the archive tier.

> [!IMPORTANT]
> Do not delete the the source blob until the copy is completed successfully at the destination. If the source blob is deleted then the destination blob may not complete copying and will be empty. You can handle the event that is raised when the copy operation completes to know when it is safe to delete the source blob. For more information, see [Handle events on blob rehydration](#handle-events-on-blob-rehydration).

Copying an archived blob to an online destination tier is supported within the same storage account only. You cannot copy an archived blob to a destination blob that is also in the archive tier.

The following table shows the behavior of a blob copy operation, depending on the tiers of the source and destination blob.

|  | **Hot tier source** | **Cool tier source** | **Archive tier source** |
|--|--|--|--|
| **Hot tier destination** | Supported | Supported | Supported within the same account; pending rehydrate |
| **Cool tier destination** | Supported | Supported | Supported within the same account; pending rehydrate |
| **Archive tier destination** | Supported | Supported | Unsupported |

## Rehydrate an archived blob to an online tier

The second option for moving a blob from the archive tier to an online tier is to rehydrate the blob by calling [Set Blob Tier](/rest/api/storageservices/set-blob-tier). With this operation, you can change the tier of the archived blob to either hot or cool.

Rehydrating a blob from the archive tier can take several hours to complete. Microsoft recommends rehydrating larger blobs for optimal performance. Rehydrating several small blobs concurrently may require additional time.

Once a rehydration request is initiated, it cannot be canceled. During the rehydration operation, the blob's access tier setting continues to show as archived until the rehydration process is complete.

To check the status of the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation, call [Get Blob Properties](/rest/api/storageservices/get-blob-properties) to get the value of the `x-ms-archive-status` header. The archive status property may return *rehydrate-pending-to-hot* or *rehydrate-pending-to-cool*, depending on the target tier for the rehydration operation.

When the rehydration operation is complete, the blob's access tier property updates to reflect the new tier.

To learn how to configure Azure Event Grid to fire an event when the rehydration is complete and then handle the event with an Azure Function, see [Handle events on blob rehydration](#handle-events-on-blob-rehydration).

> [!CAUTION]
> Rehydrating a blob doesn't change its last modified time. Using the [lifecycle management](storage-lifecycle-management-concepts.md) feature can result in a scenario where after a blob is rehydrated, a lifecycle management policy moves the blob back to the archive tier because the last modified time is beyond the threshold set for the policy.
>
> To avoid this scenario, copy the blob from the archived tier to an online tier, as described in the [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) section. Performing a copy operation creates a new instance of the blob with an updated last modified time and and doesn't trigger the lifecycle management policy.

## Handle events on blob rehydration

Azure Storage raises an event through Azure Event Grid when a blob rehydration operation is complete. You can subscribe to these events and implement an event handler that responds when an archived blob is rehydrated.

- The **Microsoft.Storage.BlobCreated** event fires when a blob is created. In the context of blob rehydration, this event fires when a copy operation creates a new destination blob in either the hot or cool tier.
- The **Microsoft.Storage.BlobTierChanged** event fires when a blob's tier is changed. In the context of blob rehydration, this event fires when a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation successfully changes an archived blob's tier to the hot or cool tier.

To learn how to capture an event on rehydration and send it to an Azure Function event handler, see [Trigger an event when an archived blob is rehydrated](archive-rehydrate-handle-event.md).

For more information on handling events in Blob Storage, see [Reacting to Azure Blob storage events](storage-blob-event-overview.md).

## Pricing and billing

A rehydration operation with **Set Blob Tier** is charged for data reads and data retrieval ???aren't these the same thing???. A high-priority rehydration has higher operation and data retrieval costs compared to standard priority. High-priority rehydration shows up as a separate line item on your bill. If a high-priority request to return an archive blob of a few gigabytes takes more than five hours, you won't be charged the high-priority retrieval rate. However, standard retrieval rates still apply as the rehydration was prioritized over other requests.

Copying an archived blob to an online tier with **Copy Blob**/**Copy Blob from URL** is charged for data reads and data retrieval. Creating the destination blob in an online tier is charged for data writes. Early deletion fees don't apply when you copy to an online blob because the source blob remains unmodified in the archive tier. High-priority retrieval charges do apply if selected.

Blobs in the archive tier should be stored for a minimum of 180 days. Deleting or rehydrating archived blobs before 180 days incurs early deletion fees.

For more information about pricing for block blobs and data rehydration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).

## See also

- [Azure Blob Storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md).
- [Trigger an event when an archived blob is rehydrated](archive-rehydrate-handle-event.md)
