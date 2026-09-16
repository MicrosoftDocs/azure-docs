---
title: Blob rehydration from the archive tier
description: "While a blob is in the archive access tier, it's considered to be offline and can't be read or modified. To read or modify data in an archived blob, you must first rehydrate the blob to an online tier: hot, cool, or cold."
author: normesta

ms.author: normesta
ms.date: 08/31/2026
ms.service: azure-blob-storage
ms.topic: concept-article
# Customer intent: As a cloud storage administrator, I want to rehydrate archived blobs to an online tier, so that I can access and modify the stored data as needed for operational tasks.
---

# Blob rehydration from the archive tier

An archived blob is offline and can't be read or modified. To access its data, first rehydrate the blob to an online tier: hot, cool, or cold. Use one of the following rehydration methods:

- [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier): You can rehydrate an archived blob by copying it to a new blob in the hot, cool, or cold tier with the [Copy Blob](/rest/api/storageservices/copy-blob) operation.

- [Change an archived blob's access tier to an online tier](#change-a-blobs-access-tier-to-an-online-tier): You can rehydrate an archived blob to the hot, cool, or cold tier by using the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation.

> [!IMPORTANT]
> You can't directly rehydrate archived snapshots or previous versions.
> To access data from an archived snapshot or previous version, you must copy it to a new blob in an online tier (hot, cool, or cold) by using the [Copy Blob](/rest/api/storageservices/copy-blob) operation.

Rehydrating a blob from the archive tier can take several hours to complete. Archive larger blobs for optimal rehydration performance. Rehydrating a large number of small blobs might require extra time due to the processing overhead on each blob. A maximum of 10 GiB per storage account can be rehydrated per hour with priority retrieval.

To learn how to rehydrate an archived blob to an online tier, see [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md).

## Rehydration priority

When you rehydrate a blob, you can set the operation priority by using the optional `x-ms-rehydrate-priority` header on a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or [Copy Blob](/rest/api/storageservices/copy-blob) operation. Rehydration priority options include:

- **Standard priority**: The rehydration request is processed in the order it was received and might take up to 15 hours to complete for objects under 10 GB in size.
- **High priority**: The rehydration request is prioritized over standard priority requests and might complete in less than one hour for objects under 10 GB in size.

To check the rehydration priority while the rehydration operation is underway, call [Get Blob Properties](/rest/api/storageservices/get-blob-properties) to return the value of the `x-ms-rehydrate-priority` header. The rehydration priority property returns either *Standard* or *High*.

Standard priority is the default rehydration option. A high-priority rehydration is faster but costs more than a standard-priority rehydration. A high-priority rehydration might take longer than one hour, depending on blob size and current demand. Reserve high-priority rehydration for emergency data restoration.

While a standard-priority rehydration operation is pending, you can update the rehydration priority setting for a blob to *High* to rehydrate that blob more quickly. For example, if you're rehydrating a large number of blobs in bulk, you can specify *Standard* priority for all blobs for the initial operation, then increase the priority to *High* for any individual blobs that need to be brought online more quickly, up to the limit of 10 GiB per hour.

> [!IMPORTANT]
> The 10 GiB/hour limit applies at the **storage account level**, not per blob. While timelines such as “up to 15 hours” for standard priority might apply to individual blobs under ideal conditions, they do **not scale linearly** for bulk operations. If you rehydrate large volumes of data, expect longer durations and plan accordingly.
> The throughput is shared across all blobs being rehydrated within the same account, and exceeding the hourly limit might result in throttling or extended delays. For optimal performance, consider batching rehydration requests and monitoring account-level activity.

You can't lower the rehydration priority setting from *High* to *Standard* for a pending operation. Updating the priority might affect billing.

To learn how to set and update the rehydration priority setting, see [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md).

For more information on pricing differences between standard-priority and high-priority rehydration requests, see [Pricing for Azure Blob Storage](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Copy an archived blob to an online tier

To rehydrate an archived blob by copying it, use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to create a new destination blob in the hot, cool, or cold tier. The source blob remains unmodified in the archive tier.

You must copy the archived blob to a new blob with a different name or to a different container. You can't overwrite the source blob by copying to the same blob.

By copying a blob from the archive tier to an online tier, you can avoid the early deletion fee that is assessed if you change the tier of a blob from the archive tier before the required 180-day period elapses. For more information, see [Archive access tier](access-tiers-overview.md#archive-access-tier).

### Avoid lifecycle policy rearchiving

Copying can also prevent a lifecycle management policy from moving a rehydrated blob back to the archive tier. This risk exists when the policy's `tierToArchive` action doesn't include the `daysAfterLastTierChangeGreaterThan` condition and the blob's last modified time exceeds the policy threshold. A copy operation leaves the source blob in the archive tier and creates a new blob with a different name and a new last modified time.

### Monitor copy completion

Copying a blob from the archive tier can take hours, depending on the selected rehydration priority. The copy operation reads the archived source blob and creates a new blob in the selected online tier. The new blob might appear in the parent container before rehydration is complete, but its tier remains archive. Its data becomes available after the service reads the source blob and writes its contents to the destination blob. The new blob is an independent copy, so modifying or deleting it doesn't affect the archived source blob.

To learn how to rehydrate a blob by copying it to an online tier, see [Rehydrate a blob with a copy operation](archive-rehydrate-to-online-tier.md#rehydrate-a-blob-with-a-copy-operation).

> [!IMPORTANT]
> Don't delete the source blob until rehydration completes successfully. If you delete the source blob, the destination blob might not finish copying. Monitor the completion event to determine when you can safely delete the source blob. For more information, see [Handle a blob rehydration event](#handle-a-blob-rehydration-event).

### Copy across storage accounts

Service version 2021-02-12 and later supports rehydration by copying an archived blob to a different storage account in the same region. Earlier service versions support rehydration only within the same storage account. Rehydration across storage accounts enables you to segregate your production data from your backup data by maintaining them in separate accounts. Isolating archived data in a separate account can also help mitigate costs from unintentional rehydration.

The target blob for the copy operation must be in an online tier (hot, cool, or cold). You can't copy an archived blob to a destination blob that is also in the archive tier.

The following table shows the behavior of a blob copy operation, depending on the tiers of the source and destination blob.

| | **Hot tier source** | **Cool tier source** | **Cold tier source** | **Archive tier source** |
| -- | -- | -- | -- | -- |
| **Hot tier destination** | Supported | Supported | Supported | Supported across accounts in the same region with version 2021-02-12 and later. Supported within the same storage account only for earlier versions. Requires blob rehydration. |
| **Cool tier destination** | Supported | Supported | Supported | Supported across accounts in the same region with version 2021-02-12 and later. Supported within the same storage account only for earlier versions. Requires blob rehydration. |
| **Cold tier destination** | Supported | Supported | Supported | Supported across accounts in the same region with version 2021-02-12 and later. Supported within the same storage account only for earlier versions. Requires blob rehydration. |
| **Archive tier destination** | Supported | Supported | Supported | Not supported |

### Rehydrate from a secondary region

If your storage account uses read-access geo-redundant storage (RA-GRS), use the [Copy Blob](/rest/api/storageservices/copy-blob) operation to rehydrate blobs from the secondary region to another account in that region. See [Rehydrate from a secondary region](archive-rehydrate-to-online-tier.md#rehydrate-from-a-secondary-region).

To learn more about obtaining read access to secondary regions, see [Read access to data in the secondary region](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json#read-access-to-data-in-the-secondary-region).

## Change a blob's access tier to an online tier

The second option for rehydrating a blob from the archive tier to an online tier is to change the blob's tier by calling [Set Blob Tier](/rest/api/storageservices/set-blob-tier). With this operation, you can change the tier of the archived blob to hot, cool, or cold.

You can't cancel a [Set Blob Tier](/rest/api/storageservices/set-blob-tier) request after it starts. During rehydration, the blob's access tier remains archive. When rehydration completes, the access tier property shows the new tier.

To learn how to rehydrate a blob by changing its tier to an online tier, see [Rehydrate a blob by changing its tier](archive-rehydrate-to-online-tier.md#rehydrate-a-blob-by-changing-its-tier).

> [!CAUTION]
> Changing a blob's tier doesn't affect its last modified time. If the storage account has a [lifecycle management](./lifecycle-management-overview.md) policy, the policy might move the blob back to the archive tier after rehydration when the last modified time exceeds the policy threshold.
>
> To avoid this scenario, add the `daysAfterLastTierChangeGreaterThan` condition to the `tierToArchive` action of the policy. Alternatively, you can rehydrate the archived blob by copying it instead, as described in the [Copy an archived blob to an online tier](#copy-an-archived-blob-to-an-online-tier) section. Performing a copy operation creates a new instance of the blob with an updated last modified time, so it doesn't trigger the lifecycle management policy.

## Check the status of a blob rehydration operation

During the blob rehydration operation, you can call the [Get Blob Properties](/rest/api/storageservices/get-blob-properties) operation to check its status. To learn how to check the status of a rehydration operation, see [Check the status of a rehydration operation](archive-rehydrate-to-online-tier.md#check-the-status-of-a-rehydration-operation).

## Handle a blob rehydration event

Rehydrating an archived blob can take up to 15 hours, and repeatedly polling **Get Blob Properties** is inefficient. Use [Azure Event Grid](../../event-grid/overview.md) to capture the completion event for better performance and lower costs.

Azure Event Grid raises the `Microsoft.Storage.BlobTierChanged` event when blob rehydration completes:

- The `Microsoft.Storage.BlobTierChanged` event fires when a blob's tier changes. For blob rehydration, the event fires when the destination blob changes successfully from the archive tier to an online tier (hot, cool, or cold).

When you use the **Copy Blob** operation to copy a blob from the **Archive tier** to a new destination blob in an **online tier** (hot, cool, or cold tier) for rehydration:

1. Azure Event Grid triggers a `Microsoft.Storage.BlobCreated` event when the copy operation starts. The blob's tier is **Archive**.

1. After the blob is copied and rehydrated, Azure Event Grid fires a `Microsoft.Storage.BlobTierChanged` event that indicates the change from **Archive** to the specified online tier.

To learn how to capture an event on rehydration and send it to an Azure Function event handler, see [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-handle-event.md).

For more information about handling events in Blob Storage, see [Reacting to Azure Blob storage events](storage-blob-event-overview.md) and [Azure Blob Storage as Event Grid source](../../event-grid/event-schema-blob-storage.md).

## Pricing and billing

For [Set Blob Tier](/rest/api/storageservices/set-blob-tier), Azure Storage charges for data read transactions and the amount of data retrieved. High-priority rehydration costs more than standard priority and appears as a separate line item on your bill. If a high-priority request for an archived blob smaller than 10 GB takes more than five hours, Azure Storage doesn't charge the high-priority retrieval rate. Standard retrieval rates still apply. For a sample cost estimate, see [Cost estimate: Move data out of archive storage](cost-estimate-archive-retrieval-set-tier.md).

For [Copy Blob](/rest/api/storageservices/copy-blob), Azure Storage charges for data read transactions, the amount of data retrieved, and data write transactions for the destination blob. Early deletion fees don't apply because the source blob remains unmodified in the archive tier. High-priority retrieval charges apply if selected. For a sample estimate, see [Cost estimate: Retrieve data from archive storage for analysis](cost-estimate-archive-retrieval-copy-blob.md).

Blobs in the archive tier should be stored for a minimum of 180 days. Deleting or changing the tier of an archived blob before the 180-day period elapses incurs an early deletion fee. For example, if a blob is moved to the archive tier and then deleted or moved to the hot tier after 45 days, you incur an early deletion fee equivalent to 135 (180 minus 45) days of storing that blob in the archive tier. For more information, see [Archive access tier](access-tiers-overview.md#archive-access-tier).

For more information about pricing for block blobs and data rehydration, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information about outbound data transfer charges, see [Data transfer pricing details](https://azure.microsoft.com/pricing/details/data-transfers/).

## See also

- [Hot, cool, cold, and archive access tiers for blob data](access-tiers-overview.md)
- [Archive a blob](archive-blob.md)
- [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md)
- [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-handle-event.md)
- [Reacting to Blob storage events](storage-blob-event-overview.md)
