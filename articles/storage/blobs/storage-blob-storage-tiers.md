---
title: Hot, cool, and archive access tiers for blobs - Azure Storage
description: Hot, cool, and archive access tiers for Azure storage accounts.
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: conceptual
ms.date: 03/23/2019
ms.author: mhopkins
ms.reviewer: clausjor
ms.subservice: blobs
---

# Azure Blob storage: hot, cool, and archive access tiers

Azure storage offers different access tiers, which allow you to store blob object data in the most cost-effective manner. The available access tiers include:

- **Hot** - Optimized for storing data that is accessed frequently.
- **Cool** - Optimized for storing data that is infrequently accessed and stored for at least 30 days.
- **Archive** - Optimized for storing data that is rarely accessed and stored for at least 180 days with flexible latency requirements (on the order of hours).

The following considerations apply to the different access tiers:

- The archive access tier is available only at the blob level and not at the storage account level.
- Data in the cool access tier can tolerate slightly lower availability, but still requires high durability and similar time-to-access and throughput characteristics as hot data. For cool data, a slightly lower availability service-level agreement (SLA) and higher access costs compared to hot data are acceptable trade-offs for lower storage costs.
- Archive storage is offline and offers the lowest storage costs but also the highest access costs.
- Only the hot and cool access tiers can be set at the account level.
- Hot, cool, and archive tiers can be set at the object level.

Data stored in the cloud grows at an exponential pace. To manage costs for your expanding storage needs, it's helpful to organize your data based on attributes like frequency-of-access and planned retention period to optimize costs. Data stored in the cloud can be different in terms of how it's generated, processed, and accessed over its lifetime. Some data is actively accessed and modified throughout its lifetime. Some data is accessed frequently early in its lifetime, with access dropping drastically as the data ages. Some data remains idle in the cloud and is rarely, if ever, accessed after it's stored.

Each of these data access scenarios benefits from a different access tier that is optimized for a particular access pattern. With hot, cool, and archive access tiers, Azure Blob storage addresses this need for differentiated access tiers with separate pricing models.

## Storage accounts that support tiering

You may only tier your object storage data to hot, cool, or archive in Blob storage and General Purpose v2 (GPv2) accounts. General Purpose v1 (GPv1) accounts do not support tiering. However, you can easily convert existing GPv1 or Blob storage accounts to GPv2 accounts through a one-click process in the Azure portal. GPv2 provides a new pricing structure for blobs, files, and queues, and access to a variety of other new storage features. Going forward, some new features and prices cuts will be offered only in GPv2 accounts. Therefore, you should evaluate using GPv2 accounts but only use them after reviewing the pricing for all services. Some workloads can be more expensive on GPv2 than GPv1. For more information, see [Azure storage account overview](../common/storage-account-overview.md).

Blob storage and GPv2 accounts expose the **Access Tier** attribute at the account level. This attribute allows you to specify the default access tier as hot or cool for any blob in the storage account that doesn't have an explicit tier set at the object level. For objects with the tier set at the object level, the account tier will not apply. The archive tier can be applied only at the object level. You can switch between these access tiers at any time.

## Premium performance block blob storage

Premium performance block blob storage makes frequently accessed data available via high-performance hardware. Data in this performance tier is stored on solid-state drives (SSDs), which are optimized for low and consistent latency. SSDs provide higher transactional rates and throughput compared to traditional hard drives.

Premium performance block blob storage is ideal for workloads that require fast and consistent response times. It's best for workloads that perform many small transactions, such as capturing telemetry data, messaging, and data transformation. Data that involves end users, such as interactive video editing, static web content, and online transactions are also good candidates.

Premium performance block blob storage is available only via the block blob storage account type, and does not currently support tiering to hot, cool, or archive access tiers.

## Hot access tier

The hot access tier has higher storage costs than cool and archive tiers, but the lowest access costs. Example usage scenarios for the hot access tier include:

- Data that's in active use or expected to be accessed (read from and written to) frequently.
- Data that's staged for processing and eventual migration to the cool access tier.

## Cool access tier

The cool access tier has lower storage costs and higher access costs compared to hot storage. This tier is intended for data that will remain in the cool tier for at least 30 days. Example usage scenarios for the cool access tier include:

- Short-term backup and disaster recovery datasets.
- Older media content not viewed frequently anymore but is expected to be available immediately when accessed.
- Large data sets that need to be stored cost effectively while more data is being gathered for future processing. (*For example*, long-term storage of scientific data, raw telemetry data from a manufacturing facility)

## Archive access tier

The archive access tier has the lowest storage cost and higher data retrieval costs compared to hot and cool tiers. This tier is intended for data that can tolerate several hours of retrieval latency and will remain in the archive tier for at least 180 days.

While a blob is in archive storage, the blob data is offline and cannot be read, copied, overwritten, or modified. You can't take snapshots of a blob in archive storage. However, the blob metadata remains online and available, allowing you to list the blob and its properties. For blobs in archive, the only valid operations are GetBlobProperties, GetBlobMetadata, ListBlobs, SetBlobTier, and DeleteBlob.

Example usage scenarios for the archive access tier include:

- Long-term backup, secondary backup, and archival datasets
- Original (raw) data that must be preserved, even after it has been processed into final usable form. (*For example*, Raw media files after transcoding into other formats)
- Compliance and archival data that needs to be stored for a long time and is hardly ever accessed. (*For example*, security camera footage, old X-Rays/MRIs for healthcare organizations, audio recordings, and transcripts of customer calls for financial services)

### Blob rehydration

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take up to 15 hours to complete. Large blob sizes are recommended for optimal performance. Rehydrating several small blobs concurrently may add additional time.

During rehydration, you may check the **Archive Status** blob property to confirm if the tier has changed. The status reads "rehydrate-pending-to-hot" or "rehydrate-pending-to-cool" depending on the destination tier. Upon completion, the archive status property is removed, and the **Access Tier** blob property reflects the new hot or cool tier.  

## Blob-level tiering

Blob-level tiering allows you to change the tier of your data at the object level using a single operation called [Set Blob Tier](/rest/api/storageservices/set-blob-tier). You can easily change the access tier of a blob among the hot, cool, or archive tiers as usage patterns change, without having to move data between accounts. All tier changes happen immediately. However, rehydrating a blob from archive can take several hours.

The time of the last blob tier change is exposed via the **Access Tier Change Time** blob property. If a blob is in the archive tier, it can't be overwritten, so uploading the same blob is not permitted in this scenario. You can overwrite a blob in a hot or cool tier, in which case the new blob inherits the tier of the blob that was overwritten.

Blobs in all three access tiers can coexist within the same account. Any blob that does not have an explicitly assigned tier infers the tier from the account access tier setting. If the access tier is inferred from the account, you see the **Access Tier Inferred** blob property set to "true", and the blob **Access Tier** blob property matches the account tier. In the Azure portal, the access tier inferred property is displayed with the blob access tier (for example, **Hot (inferred)** or **Cool (inferred)**).

> [!NOTE]
> Archive storage and blob-level tiering only support block blobs. You also cannot change the tier of a block blob that has snapshots.

> [!NOTE]
> Data stored in a block blob storage account cannot currently be tiered to hot, cool, or archive using [Set Blob Tier](/rest/api/storageservices/set-blob-tier) or using Azure Blob Storage lifecycle management.
> To move data, you must synchronously copy blobs from the block blob storage account to the hot access tier in a different account using the [Put Block From URL API](/rest/api/storageservices/put-block-from-url) or a version of AzCopy that supports this API.
> The *Put Block From URL* API synchronously copies data on the server, meaning the call completes only once all the data is moved from the original server location to the destination location.

### Blob lifecycle management

Blob Storage lifecycle management offers a rich, rule-based policy that you can use to transition your data to the best access tier and to expire data at the end of its lifecycle. See [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md) to learn more.  

### Blob-level tiering billing

When a blob is moved to a cooler tier (hot->cool, hot->archive, or cool->archive), the operation is billed as a write operation to the destination tier, where the write operation (per 10,000) and data write (per GB) charges of the destination tier apply.

When a blob is moved to a warmer tier (archive->cool, archive->hot, or cool->hot), the operation is billed as a read from the source tier, where the read operation (per 10,000) and data retrieval (per GB) charges of the source tier apply. The following table summarizes how tier changes are billed.

| | **Write Charges (Operation + Access)** | **Read Charges (Operation + Access)**
| ---- | ----- | ----- |
| **SetBlobTier Direction** | hot->cool, hot->archive, cool->archive | archive->cool, archive->hot, cool->hot

If you toggle the account tier from hot to cool, you will be charged for write operations (per 10,000) for all blobs without a set tier in GPv2 accounts only. There is no charge for this change in Blob storage accounts. You will be charged for both read operations (per 10,000) and data retrieval (per GB) if you toggle your Blob storage or GPv2 account from cool to hot. Early deletion charges for any blob moved out of the cool or archive tier may apply as well.

### Cool and archive early deletion

In addition to the per GB, per month charge, any blob that is moved into the cool tier (GPv2 accounts only) is subject to a cool early deletion period of 30 days, and any blob that is moved into the archive tier is subject to an archive early deletion period of 180 days. This charge is prorated. For example, if a blob is moved to archive and then deleted or moved to the hot tier after 45 days, you will be charged an early deletion fee equivalent to 135 (180 minus 45) days of storing that blob in archive.

You may calculate the early deletion by using the blob property, **creation-time**, if there has been no access tier changes. Otherwise you can use when the access tier was last modified to cool or archive by viewing the blob property: **access-tier-change-time**. For more information on blob properties, see [Get Blob Properties](https://docs.microsoft.com/rest/api/storageservices/get-blob-properties).

## Comparing block blob storage options

The following table shows a comparison of premium performance block blob storage, and the hot, cool, and archive access tiers.

|                                           | **Premium performance** | **Hot tier** | **Cool tier** | **Archive tier**
| ----------------------------------------- | ---------------- | ------------ | ----- | ----- |
| **Availability**                          | 99.9%            | 99.9%        | 99% | N/A |
| **Availability** <br> **(RA-GRS reads)**  | N/A              | 99.99%       | 99.9% | N/A |
| **Usage charges**                         | Higher storage costs, lower access and transaction cost | Higher storage costs, lower access, and transaction costs | Lower storage costs, higher access, and transaction costs | Lowest storage costs, highest access, and transaction costs |
| **Minimum object size**                   | N/A | N/A | N/A | N/A |
| **Minimum storage duration**              | N/A | N/A | 30 days (GPv2 only) | 180 days
| **Latency** <br> **(Time to first byte)** | Single-digit milliseconds | milliseconds | milliseconds | < 15 hrs

> [!NOTE]
> For scalability and performance targets, see [Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

## Quickstart scenarios

In this section, the following scenarios are demonstrated using the Azure portal:

- How to change the default account access tier of a GPv2 or Blob storage account.
- How to change the tier of a blob in a GPv2 or Blob storage account.

### Change the default account access tier of a GPv2 or Blob storage account

1. Sign in to the [Azure portal](https://portal.azure.com).

1. To navigate to your storage account, select All Resources, then select your storage account.

1. In the Settings blade, click **Configuration** to view and/or change the account configuration.

1. Select the right access tier for your needs: Set the **Access tier** to either **Cool** or **Hot**.

1. Click **Save** at the top of the blade.

### Change the tier of a blob in a GPv2 or Blob storage account

1. Sign in to the [Azure portal](https://portal.azure.com).

1. To navigate to your blob in your storage account, select **All Resources**, select your storage account, select your container, and then select your blob.

1. In the **Blob properties** blade, select the **Access tier** dropdown menu to select the **Hot**, **Cool**, or **Archive** access tier.

1. Click **Save** at the top of the blade.

## Pricing and billing

All storage accounts use a pricing model for Blob storage based on the tier of each blob. Keep in mind the following billing considerations:

- **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the access tier. The per-gigabyte cost decreases as the tier gets cooler.
- **Data access costs**: Data access charges increase as the tier gets cooler. For data in the cool and archive access tier, you are charged a per-gigabyte data access charge for reads.
- **Transaction costs**: There is a per-transaction charge for all tiers that increases as the tier gets cooler.
- **Geo-Replication data transfer costs**: This charge only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.
- **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.
- **Changing the access tier**: Changing the account access tier from cool to hot incurs a charge equal to reading all the data existing in the storage account. However, changing the account access tier from hot to cool incurs a charge equal to writing all the data into the cool tier (GPv2 accounts only).

> [!NOTE]
> For more information about pricing for Blob storage accounts, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page. For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.

## FAQ

**Should I use Blob storage or GPv2 accounts if I want to tier my data?**

We recommend you use GPv2 instead of Blob storage accounts for tiering. GPv2 support all the features that Blob storage accounts support plus a lot more. Pricing between Blob storage and GPv2 is almost identical, but some new features and price cuts will only be available on GPv2 accounts. GPv1 accounts do not support tiering.

Pricing structure between GPv1 and GPv2 accounts is different and customers should carefully evaluate both before deciding to use GPv2 accounts. You can easily convert an existing Blob storage or GPv1 account to GPv2 through a simple one-click process. For more information, see [Azure storage account overview](../common/storage-account-overview.md).

**Can I store objects in all three (hot, cool, and archive) access tiers in the same account?**

Yes. The **Access Tier** attribute set at the account level is the default tier that applies to all objects in that account without an explicit set tier. However, blob-level tiering allows you to set the access tier on at the object level regardless of what the access tier setting on the account is. Blobs in any of the three access tiers (hot, cool, or archive) may exist within the same account.

**Can I change the default access tier of my Blob or GPv2 storage account?**

Yes, you can change the default access tier by setting the **Access tier** attribute on the storage account. Changing the access tier applies to all objects stored in the account that do not have an explicit tier set. Toggling the access tier from hot to cool incurs write operations (per 10,000) for all blobs without a set tier in GPv2 accounts only and toggling from cool to hot incurs both read operations (per 10,000) and data retrieval (per GB) charges for all blobs in Blob storage and GPv2 accounts.

**Can I set my default account access tier to archive?**

No. Only hot and cool access tiers may be set as the default account access tier. Archive can only be set at the object level.

**In which regions are the hot, cool, and archive access tiers available in?**

The hot and cool access tiers along with blob-level tiering are available in all regions. Archive storage will initially only be available in select regions. For a complete list, see [Azure products available by region](https://azure.microsoft.com/regions/services/).

**Do the blobs in the cool access tier behave differently than the ones in the hot access tier?**

Blobs in the hot access tier have the same latency as blobs in GPv1, GPv2, and Blob storage accounts. Blobs in the cool access tier have a similar latency (in milliseconds) as blobs in GPv1, GPv2, and Blob storage accounts. Blobs in the archive access tier have several hours of latency in GPv1, GPv2, and Blob storage accounts.

Blobs in the cool access tier have a slightly lower availability service level (SLA) than the blobs stored in the hot access tier. For more information, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage/v1_2/).

**Are the operations among the hot, cool, and archive tiers the same?**

Yes. All operations between hot and cool are 100% consistent. All valid archive operations including delete, list, get blob properties/metadata, and set blob tier are 100% consistent with hot and cool. A blob cannot be read or modified while in the archive tier.

**When rehydrating a blob from archive tier to the hot or cool tier, how will I know when rehydration is complete?**

During rehydration, you may use the get blob properties operation to poll the **Archive Status** attribute to confirm when the tier change is complete. The status reads "rehydrate-pending-to-hot" or "rehydrate-pending-to-cool" depending on the destination tier. Upon completion, the archive status property is removed, and the **Access Tier** blob property reflects the new hot or cool tier.  

**After setting the tier of a blob, when will I start getting billed at the appropriate rate?**

Each blob is always billed according to the tier indicated by the blob's **Access Tier** property. When you set a new tier for a blob, the **Access Tier** property  immediately reflects the new tier for all transitions. However, rehydrating a blob from the archive tier to a hot or cool tier can take several hours. In this case, you are billed at archive rates until rehydration is complete, at which point the **Access Tier** property reflects the new tier. At that point you are billed for that blob at the hot or cool rate.

**How do I determine if I will incur an early deletion charge when deleting or moving a blob out of the cool or archive tier?**

Any blob that is deleted or moved out of the cool (GPv2 accounts only) or archive tier before 30 days and 180 days respectively will incur a prorated early deletion charge. You can determine how long a blob has been in the cool or archive tier by checking the **Access Tier Change Time** blob property, which provides a stamp of the last tier change. For more information, see [Cool and archive early deletion](#cool-and-archive-early-deletion).

**Which Azure tools and SDKs support blob-level tiering and archive storage?**

Azure portal, PowerShell, and CLI tools and .NET, Java, Python, and Node.js client libraries all support blob-level tiering and archive storage.  

**How much data can I store in the hot, cool, and archive tiers?**

Data storage along with other limits are set at the account level and not per access tier. Therefore, you can choose to use all of your limit in one tier or across all three tiers. For more information, see [Azure Storage scalability and performance targets](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## Next steps

### Evaluate hot, cool, and archive in GPv2 Blob storage accounts

[Check availability of hot, cool, and archive by region](https://azure.microsoft.com/regions/#services)

[Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)

[Evaluate usage of your current storage accounts by enabling Azure Storage metrics](../common/storage-enable-and-view-metrics.md)

[Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)

[Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
