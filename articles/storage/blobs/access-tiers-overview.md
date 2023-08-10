---
title: Access tiers for blob data
titleSuffix: Azure Storage
description: Azure storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it's being used. Learn about the hot, cool, cold, and archive access tiers for Blob Storage.
author: normesta

ms.author: normesta
ms.date: 07/13/2023
ms.service: storage
ms.topic: conceptual
ms.reviewer: fryu
---

# Access tiers for blob data

Data stored in the cloud grows at an exponential pace. To manage costs for your expanding storage needs, it can be helpful to organize your data based on how frequently it will be accessed and how long it will be retained. Azure storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it's being used. Azure Storage access tiers include:

- **Hot tier** - An online tier optimized for storing data that is accessed or modified frequently. The hot tier has the highest storage costs, but the lowest access costs.
- **Cool tier** - An online tier optimized for storing data that is infrequently accessed or modified. Data in the cool tier should be stored for a minimum of **30** days. The cool tier has lower storage costs and higher access costs compared to the hot tier.
- **Cold tier** - An online tier optimized for storing data that is infrequently accessed or modified. Data in the cold tier should be stored for a minimum of **90** days. The cold tier has lower storage costs and higher access costs compared to the cool tier.
- **Archive tier** - An offline tier optimized for storing data that is rarely accessed, and that has flexible latency requirements, on the order of hours. Data in the archive tier should be stored for a minimum of 180 days.

> [!IMPORTANT]
> The cold tier is currently in PREVIEW and is available in all public regions.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see [Cold tier (preview)](#cold-tier-preview).

Azure storage capacity limits are set at the account level, rather than according to access tier. You can choose to maximize your capacity usage in one tier, or to distribute capacity across two or more tiers.

> [!NOTE]
> Setting the access tier is only allowed on Block Blobs. They are not supported for Append and Page Blobs.

## Online access tiers

When your data is stored in an online access tier (either hot, cool or cold), users can access it immediately. The hot tier is the best choice for data that is in active use. The cool or cold tier is ideal for data that is accessed less frequently, but that still must be available for reading and writing.

Example usage scenarios for the hot tier include:

- Data that's in active use or data that you expect will require frequent reads and writes.
- Data that's staged for processing and eventual migration to the cool access tier.

Usage scenarios for the cool and cold access tiers include:

- Short-term data backup and disaster recovery.
- Older data sets that aren't used frequently, but are expected to be available for immediate access.
- Large data sets that need to be stored in a cost-effective way while other data is being gathered for processing.

To learn how to move a blob to the hot, cool, or cold tier, see [Set a blob's access tier](access-tiers-online-manage.md).

Data in the cool and cold tiers have slightly lower availability, but offer the same high durability, retrieval latency, and throughput characteristics as the hot tier. For data in the cool or cold tiers, slightly lower availability and higher access costs may be acceptable trade-offs for lower overall storage costs, as compared to the hot tier. For more information, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

A blob in the cool tier in a general-purpose v2 account is subject to an early deletion penalty if it's deleted or moved to a different tier before 30 days has elapsed. For a blob in the cold tier, the deletion penalty applies if it's deleted or moved to a different tier before 90 days has elapsed. This charge is prorated. For example, if a blob is moved to the cool tier and then deleted after 21 days, you'll be charged an early deletion fee equivalent to 9 (30 minus 21) days of storing that blob in the cool tier.

The hot, cool, and cold tiers support all redundancy configurations. For more information about data redundancy options in Azure Storage, see [Azure Storage redundancy](../common/storage-redundancy.md).

## Archive access tier

The archive tier is an offline tier for storing data that is rarely accessed. The archive access tier has the lowest storage cost. However, this tier has higher data retrieval costs with a higher latency as compared to the hot, cool, and cold tiers. Example usage scenarios for the archive access tier include:

- Long-term backup, secondary backup, and archival datasets
- Original (raw) data that must be preserved, even after it has been processed into final usable form
- Compliance and archival data that needs to be stored for a long time and is hardly ever accessed

To learn how to move a blob to the archive tier, see [Archive a blob](archive-blob.md).

Data must remain in the archive tier for at least 180 days or be subject to an early deletion charge. For example, if a blob is moved to the archive tier and then deleted or moved to the hot tier after 45 days, you'll be charged an early deletion fee equivalent to 135 (180 minus 45) days of storing that blob in the archive tier.

While a blob is in the archive tier, it can't be read or modified. To read or download a blob in the archive tier, you must first rehydrate it to an online tier, either hot, cool, or cold. Data in the archive tier can take up to 15 hours to rehydrate, depending on the priority you specify for the rehydration operation. For more information about blob rehydration, see [Overview of blob rehydration from the archive tier](archive-rehydrate-overview.md).

An archived blob's metadata remains available for read access, so that you can list the blob and its properties, metadata, and index tags. Metadata for a blob in the archive tier is read-only, while blob index tags can be read or written. Storage costs for metadata of archived blobs will be charged on Cool tier rates.
Snapshots aren't supported for archived blobs.

The following operations are supported for blobs in the archive tier:

- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Delete Blob](/rest/api/storageservices/delete-blob)
- [Undelete Blob](/rest/api/storageservices/undelete-blob)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties)
- [Get Blob Tags](/rest/api/storageservices/get-blob-tags)
- [List Blobs](/rest/api/storageservices/list-blobs)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags)
- [Set Blob Tier](/rest/api/storageservices/set-blob-tier)

Only storage accounts that are configured for LRS, GRS, or RA-GRS support moving blobs to the archive tier. The archive tier isn't supported for ZRS, GZRS, or RA-GZRS accounts. For more information about redundancy configurations for Azure Storage, see [Azure Storage redundancy](../common/storage-redundancy.md).

To change the redundancy configuration for a storage account that contains blobs in the archive tier, you must first rehydrate all archived blobs to the hot, cool, or cold tier. Because rehydration operations can be costly and time-consuming, Microsoft recommends that you avoid changing the redundancy configuration of a storage account that contains archived blobs.

Migrating a storage account from LRS to GRS is supported as long as no blobs were moved to the archive tier while the account was configured for LRS. An account can be moved back to GRS if the update is performed less than 30 days from the time the account became LRS, and no blobs were moved to the archive tier while the account was set to LRS.

## Default account access tier setting

Storage accounts have a default access tier setting that indicates the online tier in which a new blob is created. The default access tier setting can be set to either hot or cool. Users can override the default setting for an individual blob when uploading the blob or changing its tier.

The default access tier for a new general-purpose v2 storage account is set to the hot tier by default. You can change the default access tier setting when you create a storage account or after it's created. If you don't change this setting on the storage account or explicitly set the tier when uploading a blob, then a new blob is uploaded to the hot tier by default.

A blob that doesn't have an explicitly assigned tier infers its tier from the default account access tier setting. If a blob's access tier is inferred from the default account access tier setting, then the Azure portal displays the access tier as **Hot (inferred)** or **Cool (inferred)**.

Changing the default access tier setting for a storage account applies to all blobs in the account for which an access tier hasn't been explicitly set. If you toggle the default access tier setting to a cooler tier in a general-purpose v2 account, then you're charged for write operations (per 10,000) for all blobs for which the access tier is inferred. You're charged for both read operations (per 10,000) and data retrieval (per GB) if you toggle to a warmer tier in a general-purpose v2 account.

When you create a legacy Blob Storage account, you must specify the default access tier setting as hot or cool at create time. There's no charge for changing the default account access tier setting to a cooler tier in a legacy Blob Storage account. You're charged for both read operations (per 10,000) and data retrieval (per GB) if you toggle to a warmer tier in a Blob Storage account. Microsoft recommends using general-purpose v2 storage accounts rather than Blob Storage accounts when possible.

> [!NOTE]
> The cold tier and the archive tier are not supported as the default access tier for a storage account.

## Setting or changing a blob's tier

To explicitly set a blob's tier when you create it, specify the tier when you upload the blob.

After a blob is created, you can change its tier in either of the following ways:

- By calling the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation, either directly or via a [lifecycle management](#blob-lifecycle-management) policy. Calling [Set Blob Tier](/rest/api/storageservices/set-blob-tier) is typically the best option when you're changing a blob's tier from a warmer tier to a cooler one.

  > [!NOTE]
  > You can't rehydrate an archived blob to an online tier by using lifecycle management policies.
 
- By calling the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a blob from one tier to another. Calling [Copy Blob](/rest/api/storageservices/copy-blob) is recommended for most scenarios where you're rehydrating a blob from the archive tier to an online tier, or moving a blob from cool or cold to hot. By copying a blob, you can avoid the early deletion penalty, if the required storage interval for the source blob hasn't yet elapsed. However, copying a blob results in capacity charges for two blobs, the source blob and the destination blob.

Changing a blob's tier from a warmer tier to a cooler one is instantaneous, as is changing from cold or cool to hot. Rehydrating a blob from the archive tier to an online tier such as the hot, cool, or cold tier can take up to 15 hours.

Keep in mind the following points when changing a blob's tier:

- You can't call **Set Blob Tier** on a blob that uses an encryption scope. For more information about encryption scopes, see [Encryption scopes for Blob storage](encryption-scope-overview.md).
- If a blob's tier is inferred as cool based on the storage account's default access tier and the blob is moved to the archive tier, there's no early deletion charge.
- If a blob is explicitly moved to the cool or cold tier and then moved to the archive tier, the early deletion charge applies.

## Blob lifecycle management

Blob storage lifecycle management offers a rule-based policy that you can use to transition your data to the desired access tier when your specified conditions are met. You can also use lifecycle management to expire data at the end of its life. See [Optimize costs by automating Azure Blob Storage access tiers](./lifecycle-management-overview.md) to learn more.

> [!NOTE]
> Data stored in a premium block blob storage account cannot be tiered to hot, cool, cold or archive by using [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or using Azure Blob Storage lifecycle management. To move data, you must synchronously copy blobs from the block blob storage account to the hot tier in a different account using the [Put Block From URL API](/rest/api/storageservices/put-block-from-url) or a version of AzCopy that supports this API. The **Put Block From URL** API synchronously copies data on the server, meaning the call completes only once all the data is moved from the original server location to the destination location.

## Summary of access tier options

The following table summarizes the features of the hot, cool, cold, and archive access tiers.

|  | **Hot tier** | **Cool tier** | **Cold tier (preview)** |**Archive tier** |
|--|--|--|--|--|
| **Availability** | 99.9% | 99% | 99% | 99% |
| **Availability** <br> **(RA-GRS reads)** | 99.99% | 99.9% | 99.9% | 99.9% |
| **Usage charges** | Higher storage costs, but lower access and transaction costs | Lower storage costs, but higher access and transaction costs | Lower storage costs, but higher access and transaction costs | Lowest storage costs, but highest access, and transaction costs |
| **Minimum recommended data retention period** | N/A | 30 days<sup>1</sup> | 90 days<sup>1</sup> | 180 days |
| **Latency** <br> **(Time to first byte)** | Milliseconds | Milliseconds | Milliseconds | Hours<sup>2</sup> |
| **Supported redundancy configurations** | All | All | All |LRS, GRS, and RA-GRS<sup>3</sup> only |

<sup>1</sup> Objects in the cool tier on general-purpose v2 accounts have a minimum retention duration of 30 days. Objects in the cold tier on general-purpose v2 accounts have a minimum retention duration of 90 days. For Blob Storage accounts, there's no minimum retention duration for the cool or cold tier.

<sup>2</sup> When rehydrating a blob from the archive tier, you can choose either a standard or high rehydration priority option. Each offers different retrieval latencies and costs. For more information, see [Overview of blob rehydration from the archive tier](archive-rehydrate-overview.md).

<sup>3</sup> For more information about redundancy configurations in Azure Storage, see [Azure Storage redundancy](../common/storage-redundancy.md).

## Pricing and billing

All storage accounts use a pricing model for block blob storage that is based on a blob's tier. Keep in mind the billing considerations described in the following sections.

For more information about pricing for block blobs, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Storage capacity costs

In addition to the amount of data stored, the cost of storing data varies depending on the access tier. The per-gigabyte capacity cost decreases as the tier gets cooler.

### Data access costs

Data access charges increase as the tier gets cooler. For data in the cool, cold and archive access tier, you're charged a per-gigabyte data access charge for reads.

### Transaction costs

A per-transaction charge applies to all tiers and increases as the tier gets cooler.

### Geo-replication data transfer costs

This charge only applies to accounts with geo-replication configured, including GRS, RA-GRS and GZRS. Geo-replication data transfer incurs a per-gigabyte charge.

### Outbound data transfer costs

Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis. For more information on outbound data transfer charges, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/) page.

### Changing the default account access tier

Changing the account access tier results in tier change charges for all blobs that don't already have a tier explicitly set. For more information, see the following section, [Changing a blob's access tier](#changing-a-blobs-access-tier).

### Changing a blob's access tier

Keep in mind the following billing impacts when changing a blob's tier:

- When a blob is uploaded or moved between tiers, it's charged at the corresponding rate immediately upon upload or tier change.
- When a blob is moved to a cooler tier, the operation is billed as a write operation to the destination tier, where the write operation (per 10,000) and data write (per GB) charges of the destination tier apply.
- When a blob is moved to a warmer tier, the operation is billed as a read from the source tier, where the read operation (per 10,000) and data retrieval (per GB) charges of the source tier apply. Early deletion charges for any blob moved out of the cool, cold or archive tier may apply as well.
- While a blob is being rehydrated from the archive tier, that blob's data is billed as archived data until the data is restored and the blob's tier changes to hot, cool, or cold.

The following table summarizes how tier changes are billed.

| Write charges (operation + access) | Read charges (operation + access) |
| ----- | ----- |
| Hot to cool<br>Hot to cold<br>Hot to archive<br>Cool to cold<br>Cool to archive<br>Cold to archive | Archive to cold<br>Archive to cool<br>Archive to hot<br>Cold to cool<br>Cold to hot<br>Cool to hot|

Changing the access tier for a blob when versioning is enabled, or if the blob has snapshots, might result in more charges. For information about blobs with versioning enabled, see [Pricing and billing](versioning-overview.md#pricing-and-billing) in the blob versioning documentation. For information about blobs with snapshots, see [Pricing and billing](snapshots-overview.md#pricing-and-billing) in the blob snapshots documentation.

## Cold tier (preview)

The cold tier is currently in PREVIEW and is available in all public regions except Poland Central and Qatar Central.

### Enrolling in the preview 

You can validate cold tier on a general-purpose v2 storage account from any subscription in Azure public cloud. It's still recommended to share your scenario in the [preview form](https://forms.office.com/r/788B1gr3Nq).

### Limitations and known issues

- The [change feed](storage-blob-change-feed.md) is not yet compatible with the cold tier.
- [Object replication](object-replication-overview.md) is not yet compatible with the cold tier.
- The default access tier setting of the account can't be set to cold tier.
- Setting the cold tier in a batch call is not yet supported (For example: using the [Blob Batch](/rest/api/storageservices/blob-batch) REST operation along with the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) subrequest).

### Required versions of REST, SDKs, and tools

| Environment | Minimum version |
|---|---|
| [REST API](/rest/api/storageservices/blob-service-rest-api)| 2021-21-02 |
| [.NET](/dotnet/api/azure.storage.blobs) | 12.15.0 |
| [Java](/java/api/overview/azure/storage-blob-readme) | 12.21.0 |
| [Python](/python/api/azure-storage-blob/) | 12.15.0 |
| [JavaScript](/javascript/api/preview-docs/@azure/storage-blob/) | 12.13.0 |
| [PowerShell (Az.Storage)](/powershell/azure/install-azure-powershell) | 5.8.0 |
| [Azure CLI](/cli/azure/install-azure-cli) | 2.50.0 |
| [AzCopy](../common/storage-use-azcopy-v10.md) | 10.18.1 |
| [Azure Storage Explorer](quickstart-storage-explorer.md) | 1.29.0 |

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Next steps

- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
- [Best practices for using blob access tiers](access-tiers-best-practices.md)
