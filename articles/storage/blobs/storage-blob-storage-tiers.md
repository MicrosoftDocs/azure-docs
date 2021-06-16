---
title: Access tiers for Azure Blob Storage - hot, cool, and archive
description: Read about hot, cool, and archive access tiers for Azure Blob Storage. Review storage accounts that support tiering.
author: tamram

ms.author: tamram
ms.date: 03/18/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: klaasl
---

# Access tiers for Azure Blob Storage - hot, cool, and archive

Azure storage offers different access tiers, allowing you to store blob object data in the most cost-effective manner. Available access tiers include:

- **Hot** - Optimized for storing data that is accessed frequently.
- **Cool** - Optimized for storing data that is infrequently accessed and stored for at least 30 days.
- **Archive** - Optimized for storing data that is rarely accessed and stored for at least 180 days with flexible latency requirements, on the order of hours.

The following considerations apply to the different access tiers:

- The access tier can be set on a blob during or after upload.
- Only the hot and cool access tiers can be set at the account level. The archive access tier can only be set at the blob level.
- Data in the cool access tier has slightly lower availability, but still has high durability, retrieval latency, and throughput characteristics similar to hot data. For cool data, slightly lower availability and higher access costs are acceptable trade-offs for lower overall storage costs compared to hot data. For more information, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).
- Data in the archive access tier is stored offline. The archive tier offers the lowest storage costs but also the highest access costs and latency.
- The hot and cool tiers support all redundancy options. The archive tier supports only LRS, GRS, and RA-GRS.
- Data storage limits are set at the account level and not per access tier. You can choose to use all of your limit in one tier or across all three tiers.

Data stored in the cloud grows at an exponential pace. To manage costs for your expanding storage needs, it's helpful to organize your data based on attributes like frequency-of-access and planned retention period to optimize costs. Data stored in the cloud can be different based on how it's generated, processed, and accessed over its lifetime. Some data is actively accessed and modified throughout its lifetime. Some data is accessed frequently early in its lifetime, with access dropping drastically as the data ages. Some data remains idle in the cloud and is rarely, if ever, accessed after it's stored.

Each of these data access scenarios benefits from a different access tier that is optimized for a particular access pattern. With hot, cool, and archive access tiers, Azure Blob Storage addresses this need for differentiated access tiers with separate pricing models.

The following tools and client libraries all support blob-level tiering and archive storage.

- Azure portal
- PowerShell
- Azure CLI tools
- .NET client library
- Java client library
- Python client library
- Node.js  client library

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Storage accounts that support tiering

Object storage data tiering between hot, cool, and archive is supported in Blob Storage and General Purpose v2 (GPv2) accounts. General Purpose v1 (GPv1) accounts don't support tiering. You can easily convert your existing GPv1 or Blob Storage accounts to GPv2 accounts through the Azure portal. GPv2 provides new pricing and features for blobs, files, and queues. Some features and price cuts are only offered in GPv2 accounts. Some workloads can be more expensive on GPv2 than GPv1. For more information, see [Azure storage account overview](../common/storage-account-overview.md).

Blob Storage and GPv2 accounts expose the **Access Tier** attribute at the account level. This attribute allows you to specify the default access tier for any blob that doesn't have it explicitly set at the object level. For objects with the tier explicitly set, the account tier won't apply. The archive tier can be applied only at the object level. You can switch between access tiers at any time.

Use GPv2 instead of Blob Storage accounts for tiering. GPv2 supports all the features that Blob Storage accounts support, plus a lot more. Pricing between Blob Storage and GPv2 is almost identical, but some new features and price cuts are only available on GPv2 accounts.

Pricing structure between GPv1 and GPv2 accounts is different and customers should carefully evaluate both before deciding to use GPv2 accounts. You can easily convert an existing Blob Storage or GPv1 account to GPv2 through a simple one-click process. For more information, see [Azure storage account overview](../common/storage-account-overview.md).

## Hot access tier

The hot access tier has higher storage costs than cool and archive tiers, but the lowest access costs. Example usage scenarios for the hot access tier include:

- Data that's in active use or is expected to be read from and written to frequently
- Data that's staged for processing and eventual migration to the cool access tier

## Cool access tier

The cool access tier has lower storage costs and higher access costs compared to hot storage. This tier is intended for data that will remain in the cool tier for at least 30 days. Example usage scenarios for the cool access tier include:

- Short-term backup and disaster recovery
- Older data not used frequently but expected to be available immediately when accessed
- Large data sets that need to be stored cost effectively, while more data is being gathered for future processing

## Archive access tier

The archive access tier has the lowest storage cost but higher data retrieval costs compared to hot and cool tiers. Data must remain in the archive tier for at least 180 days or be subject to an early deletion charge. Data in the archive tier can take several hours to retrieve depending on the specified rehydration priority. For small objects, a high priority rehydrate may retrieve the object from archive in under an hour. See [Rehydrate blob data from the archive tier](storage-blob-rehydration.md) to learn more.

While a blob is in archive storage, the blob data is offline and can't be read or modified. To read or download a blob in archive, you must first rehydrate it to an online tier. You can't take snapshots of a blob in archive storage. However, the blob metadata remains online and available, allowing you to list the blob, its properties, metadata, and blob index tags. Setting or modifying the blob metadata while in archive isn't allowed. However, you can set and modify the blob index tags. For blobs in archive, the only valid operations are [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata), [Set Blob Tags](/rest/api/storageservices/set-blob-tags), [Get Blob Tags](/rest/api/storageservices/get-blob-tags), [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags), [List Blobs](/rest/api/storageservices/list-blobs), [Set Blob Tier](/rest/api/storageservices/set-blob-tier), [Copy Blob](/rest/api/storageservices/copy-blob), and [Delete Blob](/rest/api/storageservices/delete-blob).

Example usage scenarios for the archive access tier include:

- Long-term backup, secondary backup, and archival datasets
- Original (raw) data that must be preserved, even after it has been processed into final usable form
- Compliance and archival data that needs to be stored for a long time and is hardly ever accessed

> [!NOTE]
> The archive tier is not supported for ZRS, GZRS, or RA-GZRS accounts. Migrating from LRS to GRS is supported as long as no blobs were moved to the archive tier while the account was set to LRS. An account can be moved back to GRS if the update is done less than 30 days from the time the account became LRS, and no blobs were moved to the archive tier while the account was set to LRS.

## Account-level tiering

Blobs in all three access tiers can coexist within the same account. Any blob that doesn't have an explicitly assigned tier infers the tier from the account access tier setting. If the access tier comes from the account, you see the **Access Tier Inferred** blob property set to "true", and the **Access Tier** blob property matches the account tier. In the Azure portal, the _access tier inferred_ property is displayed with the blob access tier as **Hot (inferred)** or **Cool (inferred)**.

Changing the account access tier applies to all _access tier inferred_ objects stored in the account that don't have an explicit tier set. If you toggle the account tier from hot to cool, you'll be charged for write operations (per 10,000) for all blobs without a set tier in GPv2 accounts only. There's no charge for this change in Blob Storage accounts. You'll be charged for both read operations (per 10,000) and data retrieval (per GB) if you toggle from cool to hot in Blob Storage or GPv2 accounts.

Only hot and cool access tiers can be set as the default account access tier. Archive can only be set at the object level. On blob upload, you can specify the access tier of your choice to be hot, cool, or archive regardless of the default account tier. This functionality allows you to write data directly into the archive tier to realize cost-savings from the moment you create data in blob storage.

## Blob-level tiering

Blob-level tiering allows you to upload data to the access tier of your choice using the [Put Blob](/rest/api/storageservices/put-blob) or [Put Block List](/rest/api/storageservices/put-block-list) operations and change the tier of your data at the object level using the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation or [lifecycle management](#blob-lifecycle-management) feature. You can upload data to your required access tier then easily change the blob access tier among the hot, cool, or archive tiers as usage patterns change, without having to move data between accounts. All tier change requests happen immediately and tier changes between hot and cool are instantaneous. Rehydrating a blob from the archive tier can take several hours.

The time of the last blob tier change is exposed via the **Access Tier Change Time** blob property. **Access Tier Change Time** is a blob-level property and is not updated when the default account tier is changed. Account properties and blob properties are separate. It would be prohibitively expensive to update the **Access Tier Change Time** on every blob in a storage account whenever the account's default access tier is changed.

When overwriting a blob in the hot or cool tier, the newly created blob inherits the tier of the blob that was overwritten unless the new blob access tier is explicitly set on creation. If a blob is in the archive tier, it can't be overwritten, so uploading the same blob isn't permitted in this scenario.

> [!NOTE]
> Archive storage and blob-level tiering only support block blobs.

### Blob lifecycle management

Blob storage lifecycle management offers a rich, rule-based policy that you can use to transition your data to the best access tier and to expire data at the end of its lifecycle. See [Optimize costs by automating Azure Blob Storage access tiers](storage-lifecycle-management-concepts.md) to learn more.

> [!NOTE]
> Data stored in a block blob storage account (Premium performance) cannot currently be tiered to hot, cool, or archive using [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or using Azure Blob Storage lifecycle management.
> To move data, you must synchronously copy blobs from the block blob storage account to the hot access tier in a different account using the [Put Block From URL API](/rest/api/storageservices/put-block-from-url) or a version of AzCopy that supports this API.
> The **Put Block From URL** API synchronously copies data on the server, meaning the call completes only once all the data is moved from the original server location to the destination location.

### Blob-level tiering billing

When a blob is uploaded or moved between tiers, it is charged at the corresponding rate immediately upon upload or tier change.

When a blob is moved to a cooler tier (hot->cool, hot->archive, or cool->archive), the operation is billed as a write operation to the destination tier, where the write operation (per 10,000) and data write (per GB) charges of the destination tier apply.

When a blob is moved to a warmer tier (archive->cool, archive->hot, or cool->hot), the operation is billed as a read from the source tier, where the read operation (per 10,000) and data retrieval (per GB) charges of the source tier apply. [Early deletion](#cool-and-archive-early-deletion) charges for any blob moved out of the cool or archive tier may apply as well. [Rehydrating data from the archive tier](storage-blob-rehydration.md) takes time and data will be charged archive prices until the data is restored online and the blob tier changes to hot or cool.

The following table summarizes how tier changes are billed.

| | **Write charges (operation + access)** | **Read charges (operation + access)** |
| ---- | ----- | ----- |
| **Set Blob Tier** | hot -> cool<br> hot -> archive<br> cool -> archive | archive -> cool<br> archive -> hot<br> cool -> hot

### Cool and archive early deletion

Any blob that is moved into the cool tier (GPv2 accounts only) is subject to a cool early deletion period of 30 days. Any blob that is moved into the archive tier is subject to an archive early deletion period of 180 days. This charge is prorated. For example, if a blob is moved to archive and then deleted or moved to the hot tier after 45 days, you'll be charged an early deletion fee equivalent to 135 (180 minus 45) days of storing that blob in archive.

There are some details when moving between the cool and archive tiers:

1. If a blob is inferred as cool based on the storage account's default access tier and the blob is moved to archive, there is no early deletion charge.
1. If a blob is explicitly moved to the cool tier and then moved to archive, the early deletion charge applies.

Calculate the early deletion time by using the **Last-Modified** blob property, if there have been no access tier changes. Otherwise, use when the access tier was last modified to cool or archive by viewing the blob property: **access-tier-change-time**. For more information on blob properties, see [Get Blob Properties](/rest/api/storageservices/get-blob-properties).

## Comparing block blob storage options

The following table shows a comparison of premium performance block blob storage, and the hot, cool, and archive access tiers.

|                                           | **Premium performance**   | **Hot tier** | **Cool tier**       | **Archive tier**  |
| ----------------------------------------- | ------------------------- | ------------ | ------------------- | ----------------- |
| **Availability**                          | 99.9%                     | 99.9%        | 99%                 | Offline           |
| **Availability** <br> **(RA-GRS reads)**  | N/A                       | 99.99%       | 99.9%               | Offline           |
| **Usage charges**                         | Higher storage costs, lower access, and transaction cost | Higher storage costs, lower access, and transaction costs | Lower storage costs, higher access, and transaction costs | Lowest storage costs, highest access, and transaction costs |
| **Minimum storage duration**              | N/A                       | N/A          | 30 days<sup>1</sup> | 180 days
| **Latency** <br> **(Time to first byte)** | Single-digit milliseconds | milliseconds | milliseconds        | hours<sup>2</sup> |

<sup>1</sup> Objects in the cool tier on GPv2 accounts have a minimum retention duration of 30 days. Blob Storage accounts don't have a minimum retention duration for the cool tier.

<sup>2</sup> Archive Storage currently supports two rehydration priorities, high and standard, offering different retrieval latencies and costs. For more information, see [Rehydrate blob data from the archive tier](storage-blob-rehydration.md).

> [!NOTE]
> Blob Storage accounts support the same performance and scalability targets as general-purpose v2 storage accounts. For more information, see [Scalability and performance targets for Blob Storage](scalability-targets.md).

## Pricing and billing

All storage accounts use a pricing model for block blob storage based on the tier of each blob. Keep in mind the following billing considerations:

- **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the access tier. The per-gigabyte cost decreases as the tier gets cooler.
- **Data access costs**: Data access charges increase as the tier gets cooler. For data in the cool and archive access tier, you're charged a per-gigabyte data access charge for reads.
- **Transaction costs**: There's a per-transaction charge for all tiers that increases as the tier gets cooler.
- **Geo-replication data transfer costs**: This charge only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.
- **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.
- **Changing the access tier**: Changing the account access tier will result in tier change charges for all blobs that don't have an explicit tier set. For information on changing the access tier for a single blob, see [Blob-level tiering billing](#blob-level-tiering-billing).

    Changing the access tier for a blob when versioning is enabled, or if the blob has snapshots, may result in additional charges. For information about blobs with versioning enabled, see [Pricing and billing](versioning-overview.md#pricing-and-billing) in the blob versioning documentation. For information about blobs with snapshots, see [Pricing and billing](snapshots-overview.md#pricing-and-billing) in the blob snapshots documentation.

> [!NOTE]
> For more information about pricing for Block blobs, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/). For more information on outbound data transfer charges, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/) page.

## Availability

Different access tiers, along with blob-level tiering, are available in select regions. For a complete list, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage).

## Next steps

Learn how to manage blobs and accounts across access tiers.

- [How to manage the tier of a blob in an Azure Storage account](manage-access-tier.md)
- [How to manage the default account access tier of an Azure Storage account](../common/manage-account-default-access-tier.md)
- [Optimize costs by automating Azure Blob Storage access tiers](storage-lifecycle-management-concepts.md)
