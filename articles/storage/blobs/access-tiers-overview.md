---
title: Hot, Cool, and Archive access tiers for blob data
titleSuffix: Azure Storage
description: Azure storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it is being used. Learn about the Hot, Cool, and Archive access tiers for Blob Storage.
author: tamram

ms.author: tamram
ms.date: 02/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: fryu
---

# Hot, Cool, and Archive access tiers for blob data

Data stored in the cloud grows at an exponential pace. To manage costs for your expanding storage needs, it can be helpful to organize your data based on how frequently it will be accessed and how long it will be retained. Azure storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it is being used. Azure Storage access tiers include:

- **Hot tier** - An online tier optimized for storing data that is accessed or modified frequently. The Hot tier has the highest storage costs, but the lowest access costs.
- **Cool tier** - An online tier optimized for storing data that is infrequently accessed or modified. Data in the Cool tier should be stored for a minimum of 30 days. The Cool tier has lower storage costs and higher access costs compared to the Hot tier.
- **Archive tier** - An offline tier optimized for storing data that is rarely accessed, and that has flexible latency requirements, on the order of hours. Data in the Archive tier should be stored for a minimum of 180 days.

Azure storage capacity limits are set at the account level, rather than according to access tier. You can choose to maximize your capacity usage in one tier, or to distribute capacity across two or more tiers.

## Online access tiers

When your data is stored in an online access tier (either Hot or Cool), users can access it immediately. The Hot tier is the best choice for data that is in active use, while the Cool tier is ideal for data that is accessed less frequently, but that still must be available for reading and writing.

Example usage scenarios for the Hot tier include:

- Data that's in active use or is expected to be read from and written to frequently.
- Data that's staged for processing and eventual migration to the Cool access tier.

Usage scenarios for the Cool access tier include:

- Short-term data backup and disaster recovery.
- Older data sets that are not used frequently, but are expected to be available for immediate access.
- Large data sets that need to be stored in a cost-effective way while additional data is being gathered for processing.

To learn how to move a blob to the Hot or Cool tier, see [Set a blob's access tier](access-tiers-online-manage.md).

Data in the Cool tier has slightly lower availability, but offers the same high durability, retrieval latency, and throughput characteristics as the Hot tier. For data in the Cool tier, slightly lower availability and higher access costs may be acceptable trade-offs for lower overall storage costs, as compared to the Hot tier. For more information, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

A blob in the Cool tier in a general-purpose v2 accounts is subject to an early deletion penalty if it is deleted or moved to a different tier before 30 days has elapsed. This charge is prorated. For example, if a blob is moved to the Cool tier and then deleted after 21 days, you'll be charged an early deletion fee equivalent to 9 (30 minus 21) days of storing that blob in the Cool tier.

The Hot and Cool tiers support all redundancy configurations. For more information about data redundancy options in Azure Storage, see [Azure Storage redundancy](../common/storage-redundancy.md).

## Archive access tier

The Archive tier is an offline tier for storing data that is rarely accessed. The Archive access tier has the lowest storage cost, but higher data retrieval costs and latency compared to the Hot and Cool tiers. Example usage scenarios for the Archive access tier include:

- Long-term backup, secondary backup, and archival datasets
- Original (raw) data that must be preserved, even after it has been processed into final usable form
- Compliance and archival data that needs to be stored for a long time and is hardly ever accessed

To learn how to move a blob to the Archive tier, see [Archive a blob](archive-blob.md).

Data must remain in the Archive tier for at least 180 days or be subject to an early deletion charge. For example, if a blob is moved to the Archive tier and then deleted or moved to the Hot tier after 45 days, you'll be charged an early deletion fee equivalent to 135 (180 minus 45) days of storing that blob in the Archive tier.

While a blob is in the Archive tier, it can't be read or modified. To read or download a blob in the Archive tier, you must first rehydrate it to an online tier, either Hot or Cool. Data in the Archive tier can take up to 15 hours to rehydrate, depending on the priority you specify for the rehydration operation. For more information about blob rehydration, see [Overview of blob rehydration from the Archive tier](archive-rehydrate-overview.md).

An archived blob's metadata remains available for read access, so that you can list the blob and its properties, metadata, and index tags. Metadata for a blob in the Archive tier is read-only, while blob index tags can be read or written. Snapshots are not supported for archived blobs.

The following operations are supported for blobs in the Archive tier:

- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Delete Blob](/rest/api/storageservices/delete-blob)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties)
- [Get Blob Tags](/rest/api/storageservices/get-blob-tags)
- [List Blobs](/rest/api/storageservices/list-blobs)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags)
- [Set Blob Tier](/rest/api/storageservices/set-blob-tier)

Only storage accounts that are configured for LRS, GRS, or RA-GRS support moving blobs to the Archive tier. The Archive tier is not supported for ZRS, GZRS, or RA-GZRS accounts. For more information about redundancy configurations for Azure Storage, see [Azure Storage redundancy](../common/storage-redundancy.md).

To change the redundancy configuration for a storage account that contains blobs in the Archive tier, you must first rehydrate all archived blobs to the Hot or Cool tier. Microsoft recommends that you avoid changing the redundancy configuration for a storage account that contains archived blobs if at all possible, because rehydration operations can be costly and time-consuming.

Migrating a storage account from LRS to GRS is supported as long as no blobs were moved to the Archive tier while the account was configured for LRS. An account can be moved back to GRS if the update is performed less than 30 days from the time the account became LRS, and no blobs were moved to the Archive tier while the account was set to LRS.

## Default account access tier setting

Storage accounts have a default access tier setting that indicates the online tier in which a new blob is created. The default access tier setting can be set to either Hot or Cool. Users can override the default setting for an individual blob when uploading the blob or changing its tier.

The default access tier for a new general-purpose v2 storage account is set to the Hot tier by default. You can change the default access tier setting when you create a storage account or after it is created. If you do not change this setting on the storage account or explicitly set the tier when uploading a blob, then a new blob is uploaded to the Hot tier by default.

A blob that doesn't have an explicitly assigned tier infers its tier from the default account access tier setting. If a blob's access tier is inferred from the default account access tier setting, then the Azure portal displays the access tier as **Hot (inferred)** or **Cool (inferred)**.

Changing the default access tier setting for a storage account applies to all blobs in the account for which an access tier has not been explicitly set. If you toggle the default access tier setting from Hot to Cool in a general-purpose v2 account, then you are charged for write operations (per 10,000) for all blobs for which the access tier is inferred. You are charged for both read operations (per 10,000) and data retrieval (per GB) if you toggle from Cool to Hot in a general-purpose v2 account.

When you create a legacy Blob Storage account, you must specify the default access tier setting as Hot or Cool at create time. There's no charge for changing the default account access tier setting from Hot to Cool in a legacy Blob Storage account. You are charged for both read operations (per 10,000) and data retrieval (per GB) if you toggle from Cool to Hot in a Blob Storage account. Microsoft recommends using general-purpose v2 storage accounts rather than Blob Storage accounts when possible.

> [!NOTE]
> The Archive tier is not supported as the default access tier for a storage account.

## Setting or changing a blob's tier

To explicitly set a blob's tier when you create it, specify the tier when you upload the blob.

After a blob is created, you can change its tier in either of the following ways:

- By calling the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation, either directly or via a [lifecycle management](#blob-lifecycle-management) policy. Calling [Set Blob Tier](/rest/api/storageservices/set-blob-tier) is typically the best option when you are changing a blob's tier from a hotter tier to a cooler one.
- By calling the [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a blob from one tier to another. Calling [Copy Blob](/rest/api/storageservices/copy-blob) is recommended for most scenarios where you are rehydrating a blob from the Archive tier to an online tier, or moving a blob from Cool to Hot. By copying a blob, you can avoid the early deletion penalty, if the required storage interval for the source blob has not yet elapsed. However, copying a blob results in capacity charges for two blobs, the source blob and the destination blob.

Changing a blob's tier from Hot to Cool or Archive is instantaneous, as is changing from Cool to Hot. Rehydrating a blob from the Archive tier to either the Hot or Cool tier can take up to 15 hours.

Keep in mind the following points when moving a blob between the Cool and Archive tiers:

- If a blob's tier is inferred as Cool based on the storage account's default access tier and the blob is moved to the Archive tier, there is no early deletion charge.
- If a blob is explicitly moved to the Cool tier and then moved to the Archive tier, the early deletion charge applies.

The following table summarizes the approaches you can take to move blobs between various tiers.

| Origin/Destination | Hot tier | Cool tier | Archive tier |
|--|--|--|--|
| **Hot tier** | N/A | Change a blob's tier from Hot to Cool with **Set Blob Tier** or **Copy Blob**. [Learn more...](manage-access-tier.md)<br /><br />Move blobs to the Cool tier with a lifecycle management policy. [Learn more...](lifecycle-management-overview.md) | Change a blob's tier from Hot to Archive with **Set Blob Tier** or **Copy Blob**. [Learn more...](archive-blob.md) <br /><br />Archive blobs with a lifecycle management policy. [Learn more...](lifecycle-management-overview.md) |
| **Cool tier** | Change a blob's tier from Cool to Hot with **Set Blob Tier** or **Copy Blob**. [Learn more...](manage-access-tier.md) <br /><br />Move blobs to the Hot tier with a lifecycle management policy. [Learn more...](lifecycle-management-overview.md) | N/A | Change a blob's tier from Cool to Archive with **Set Blob Tier** or **Copy Blob**. [Learn more...](archive-blob.md) <br /><br />Archive blobs with a lifecycle management policy. [Learn more...](lifecycle-management-overview.md) |
| **Archive tier** | Rehydrate to Hot tier with **Set Blob Tier** or **Copy Blob**. [Learn more...](archive-rehydrate-to-online-tier.md) | Rehydrate to Cool tier with **Set Blob Tier** or **Copy Blob**. [Learn more...](archive-rehydrate-to-online-tier.md) | N/A |

## Blob lifecycle management

Blob storage lifecycle management offers a rule-based policy that you can use to transition your data to the desired access tier when your specified conditions are met. You can also use lifecycle management to expire data at the end of its life. See [Optimize costs by automating Azure Blob Storage access tiers](./lifecycle-management-overview.md) to learn more.

> [!NOTE]
> Data stored in a premium block blob storage account cannot be tiered to Hot, Cool, or Archive using [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or using Azure Blob Storage lifecycle management. To move data, you must synchronously copy blobs from the block blob storage account to the Hot tier in a different account using the [Put Block From URL API](/rest/api/storageservices/put-block-from-url) or a version of AzCopy that supports this API. The **Put Block From URL** API synchronously copies data on the server, meaning the call completes only once all the data is moved from the original server location to the destination location.

## Summary of access tier options

The following table summarizes the features of the Hot, Cool, and Archive access tiers.

|  | **Hot tier** | **Cool tier** | **Archive tier** |
|--|--|--|--|
| **Availability** | 99.9% | 99% | Offline |
| **Availability** <br> **(RA-GRS reads)** | 99.99% | 99.9% | Offline |
| **Usage charges** | Higher storage costs, but lower access and transaction costs | Lower storage costs, but higher access and transaction costs | Lowest storage costs, but highest access, and transaction costs |
| **Minimum recommended data retention period** | N/A | 30 days<sup>1</sup> | 180 days |
| **Latency** <br> **(Time to first byte)** | Milliseconds | Milliseconds | Hours<sup>2</sup> |
| **Supported redundancy configurations** | All | All | LRS, GRS, and RA-GRS<sup>3</sup> only |

<sup>1</sup> Objects in the Cool tier on general-purpose v2 accounts have a minimum retention duration of 30 days. For Blob Storage accounts, there is no minimum retention duration for the Cool tier.

<sup>2</sup> When rehydrating a blob from the Archive tier, you can choose either a standard or high rehydration priority option. Each offers different retrieval latencies and costs. For more information, see [Overview of blob rehydration from the Archive tier](archive-rehydrate-overview.md).

<sup>3</sup> For more information about redundancy configurations in Azure Storage, see [Azure Storage redundancy](../common/storage-redundancy.md).

## Pricing and billing

All storage accounts use a pricing model for block blob storage that is based on a blob's tier. Keep in mind the billing considerations described in the following sections.

For more information about pricing for block blobs, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Storage capacity costs

In addition to the amount of data stored, the cost of storing data varies depending on the access tier. The per-gigabyte capacity cost decreases as the tier gets cooler.

### Data access costs

Data access charges increase as the tier gets cooler. For data in the Cool and Archive access tier, you're charged a per-gigabyte data access charge for reads.

### Transaction costs

A per-transaction charge applies to all tiers and increases as the tier gets cooler.

### Geo-replication data transfer costs

This charge only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.

### Outbound data transfer costs

Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis. For more information on outbound data transfer charges, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/) page.

### Changing the default account access tier

Changing the account access tier results in tier change charges for all blobs that don't already have a tier explicitly set. For more information, see the following section, [Changing a blob's access tier](#changing-a-blobs-access-tier).

### Changing a blob's access tier

Keep in mind the following billing impacts when changing a blob's tier:

- When a blob is uploaded or moved between tiers, it is charged at the corresponding rate immediately upon upload or tier change.
- When a blob is moved to a cooler tier (Hot to Cool, Hot to Archive, or Cool to Archive), the operation is billed as a write operation to the destination tier, where the write operation (per 10,000) and data write (per GB) charges of the destination tier apply.
- When a blob is moved to a warmer tier (Archive to Cool, Archive to Hot, or Cool to Hot), the operation is billed as a read from the source tier, where the read operation (per 10,000) and data retrieval (per GB) charges of the source tier apply. Early deletion charges for any blob moved out of the Cool or Archive tier may apply as well.
- While a blob is being rehydrated from the Archive tier, that blob's data is billed as archived data until the data is restored and the blob's tier changes to Hot or Cool.

The following table summarizes how tier changes are billed.

| | **Write charges (operation + access)** | **Read charges (operation + access)** |
| ---- | ----- | ----- |
| **Set Blob Tier** operation | Hot to Cool<br> Hot to Archive<br> Cool to Archive | Archive to Cool<br> Archive to Hot<br> Cool to Hot

Changing the access tier for a blob when versioning is enabled, or if the blob has snapshots, may result in additional charges. For information about blobs with versioning enabled, see [Pricing and billing](versioning-overview.md#pricing-and-billing) in the blob versioning documentation. For information about blobs with snapshots, see [Pricing and billing](snapshots-overview.md#pricing-and-billing) in the blob snapshots documentation.

## Feature support

This table shows how this feature is supported in your account and the impact on support when you enable certain capabilities.

| Storage account type | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|--|--|--|--|--|
| [Standard general-purpose v2](https://docs.microsoft.com/azure/storage/common/storage-account-overview?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#types-of-storage-accounts) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Premium block blobs](https://docs.microsoft.com/azure/storage/common/storage-account-overview?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#types-of-storage-accounts) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

<sup>1</sup> Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account with a hierarchical namespace enabled.

For information about feature support by region, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage).

## Next steps

- [Set a blob's access tier](access-tiers-online-manage.md)
- [Archive a blob](archive-blob.md)
- [Optimize costs by automatically managing the data lifecycle](lifecycle-management-overview.md)
