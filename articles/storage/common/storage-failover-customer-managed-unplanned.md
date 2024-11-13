---
title: How Azure Storage account customer-managed (unplanned) failover works
titleSuffix: Azure Storage
description: Azure Storage supports failover for geo-redundant storage accounts to recover from a service endpoint outage. Learn what happens to your storage account and storage services during a customer-managed (unplanned) failover to the secondary region if the primary endpoint becomes unavailable.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: conceptual
ms.date: 07/23/2024
ms.author: shaas
ms.subservice: storage-common-concepts
---

<!--
Initial: 84 (2544/39)
Current: 100 (2548/3)
-->

# How customer-managed (unplanned) failover works

Customer-managed (unplanned) failover enables you to fail over your entire geo-redundant storage account to the secondary region if the storage service endpoints for the primary region become unavailable. During failover, the original secondary region becomes the new primary region. All storage service endpoints are then redirected to the *new* primary region. After the storage service endpoint outage is resolved, you can perform another failover operation to fail *back* to the original primary region.

This article describes what happens during a customer-managed (unplanned) failover and failback at every stage of the process.

[!INCLUDE [updated-for-az](../../../includes/storage-failover-unplanned-hns-preview-include.md)]

## Redundancy management during unplanned failover and failback

> [!TIP]
> To understand the various redundancy states during the unplanned failover and failback process in detail, see [Azure Storage redundancy](storage-redundancy.md) for definitions of each.

When a storage account is configured for geo-redundant storage (GRS) or read access geo-redundant storage (RA-GRS) redundancy, data is replicated three times within both the locally redundant storage (LRS) primary and secondary regions. When a storage account is configured for geo-zone-redundant storage (GZRS) or read access geo-zone-redundant storage (RA-GZRS) replication, data is zone-redundant within the zone redundant storage (ZRS) primary region and replicated three times within the LRS secondary region. If the account is configured for read access (RA), you're able to read data from the secondary region as long as the storage service endpoints to that region are available.

During the customer-managed (unplanned) failover process, the Domain Name System (DNS) entries for the storage service endpoints are switched. Your storage account's secondary endpoints become the new primary endpoints, and the original primary endpoints become the new secondary. After failover, the copy of your storage account in the original primary region is deleted and your storage account continues to be replicated three times locally within the *new* primary region. At that point, your storage account becomes locally redundant and utilizes LRS.

The original and current redundancy configurations are stored within the storage account's properties. This functionality allows you to return to your original configuration when you fail back. For a complete list of resulting redundancy configurations, read [Recovery planning and failover](storage-disaster-recovery-guidance.md#plan-for-failover).

To regain geo-redundancy after a failover, you need to reconfigure your account as GRS.<!--Keep in mind that GZRS isn't a post-failover option because your storage account utilizes LRS after the failover completes.--> After the account is reconfigured for geo-redundancy, Azure immediately begins copying data from the new primary region to the new secondary. If you configure your storage account for read access to the secondary region, that access is available. However, replication from the primary to the secondary region might take some time to complete.

> [!WARNING]
> After your account is reconfigured for geo-redundancy, it may take a significant amount of time before existing data in the new primary region is fully copied to the new secondary.
>
> **To avoid a major data loss**, check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back. To evaluate potential data loss, compare the last sync time to the last time at which data was written to the new primary.

The failback process is essentially the same as the failover process, except that the replication configuration is restored to its original, pre-failover state.

After failback, you can reconfigure your storage account to take advantage of geo-redundancy. If the original primary was configured as ZRS, you can configure it to be GZRS or RA-GZRS. For more options, see [Change how a storage account is replicated](redundancy-migration.md).

## How to initiate an unplanned failover

To learn how to initiate an unplanned failover, see [Initiate an account failover](storage-initiate-account-failover.md).

> [!CAUTION]
> Unplanned failover usually involves some data loss, and potentially file and data inconsistencies. It's important to understand the impact that an account failover would have on your data before initiating this type of failover.
>
> For details about potential data loss and inconsistencies, see [Anticipate data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies).

## The unplanned failover and failback process

This section summarizes the failover process for a customer-managed (unplanned) failover.

### Unplanned failover transition summary

After a customer-managed (unplanned) failover:

- The secondary region becomes the new primary
- The copy of the data in the original primary region is deleted
- The storage account is converted to LRS
- Geo-redundancy is lost

This table summarizes the resulting redundancy configuration at every stage of a customer-managed (unplanned) failover and failback:

| Original <br> configuration | After <br> failover | After re-enabling <br> geo redundancy | After <br> failback | After re-enabling <br> geo redundancy |
|------------------------------|-----|------------------|------|------------------|
| GRS                          | LRS | GRS <sup>1</sup> | LRS  |GRS <sup>1</sup>  |
| GZRS                         | LRS | GRS <sup>1</sup> | ZRS  |GZRS <sup>1</sup> |

<sup>1</sup> Geo-redundancy is lost during a customer-managed (unplanned) failover and must be manually reconfigured.<br>

### Unplanned failover transition details

The following diagrams show the customer-managed (unplanned) failover and failback process for a storage account configured for geo-redundancy. The transition details for GZRS and RA-GZRS are slightly different from GRS and RA-GRS.

## [GRS/RA-GRS](#tab/grs-ra-grs)

### Normal operation (GRS/RA-GRS)

Under normal circumstances, a client writes data to a storage account in the primary region via storage service endpoints (1). The data is then copied asynchronously from the primary region to the secondary region (2). The following image shows the normal state of a storage account configured as GRS when the primary endpoints are available:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png" alt-text="Diagram that shows how clients write data to the storage account in the primary region." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png":::

### The storage service endpoints become unavailable in the primary region (GRS/RA-GRS)

If the primary storage service endpoints become unavailable for any reason (1), the client is no longer able to write to the storage account. Depending on the underlying cause of the outage, replication to the secondary region might no longer be functioning (2), so [some data loss should be expected](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies). The following image shows the scenario where the primary endpoints become unavailable, but before recovery occurs:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-redundant.png" alt-text="Diagram that shows how the primary is unavailable, so clients can't write data." lightbox="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-redundant.png":::

### The unplanned failover process (GRS/RA-GRS)

To restore write access to your data, you can [initiate a failover](storage-initiate-account-failover.md). The storage service endpoint URIs for blobs, tables, queues, and files remain unchanged, but their DNS entries are changed to point to the secondary region as shown:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-redundant.png" alt-text="Diagram that shows how the customer initiates account failover to secondary endpoint." lightbox="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-redundant.png":::

Customer-managed (unplanned) failover typically takes about an hour.

After the failover is complete, the original secondary becomes the new primary (1), and the copy of the storage account in the original primary is deleted (2). The storage account is configured as LRS in the new primary region, and is no longer geo-redundant. Users can resume writing data to the storage account (3), as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png" alt-text="Diagram that shows the storage account status post-failover to secondary region." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png":::

To resume replication to a new secondary region, reconfigure the account for geo-redundancy.

> [!IMPORTANT]
> Keep in mind that converting a locally redundant storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After reconfiguring the account to utilize GRS, Azure begins copying your data asynchronously to the new secondary region (1) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant-geo.png" alt-text="Diagram that shows the storage account status post-failover to secondary region as GRS." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant-geo.png":::

Read access to the new secondary region isn't available again until the issue causing the original outage is resolved.

### The unplanned failback process (GRS/RA-GRS)

> [!WARNING]
> After your account is reconfigured for geo-redundancy, it might take a significant amount of time before the data in the new primary region is fully copied to the new secondary.
>
> **To avoid a major data loss**, check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back. Compare the last sync time to the last times that data was written to the new primary to evaluate potential data loss.

After the issue causing the original outage is resolved, you can initiate failback to the original primary region. This process is described in the following image:

1. The current primary region becomes read only.
1. With customer-initiated failover and failback, your data isn't allowed to finish replicating to the secondary region during the failback process. Therefore, it's important to check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back.
1. The DNS entries for the storage service endpoints are switched. The endpoints within the secondary region become the new primary endpoints for your storage account.

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-redundant.png" alt-text="Diagram that shows how the customer initiates account failback to original primary region." lightbox="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-redundant.png":::

After the failback is complete, the original primary region becomes the current one again (1), and the copy of the storage account in the original secondary is deleted (2). The storage account is configured as locally redundant in the primary region, and is no longer geo-redundant. Users can resume writing data to the storage account (3), as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant.png" alt-text="Diagram that shows the Post-failback status." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant.png":::

To resume replication to the original secondary region, reconfigure the account for geo-redundancy.

> [!IMPORTANT]
> Keep in mind that converting a locally redundant storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After reconfiguring the account as GRS, replication to the original secondary region resumes as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant-geo.png" alt-text="Diagram that shows how the redundancy configuration returns to its original state." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant-geo.png":::

## [GZRS/RA-GZRS](#tab/gzrs-ra-gzrs)

### Normal operation (GZRS/RA-GZRS)

Under normal circumstances, a client writes data to a storage account in the primary region via storage service endpoints (1). The data is then copied asynchronously from the primary region to the secondary region (2). The following image shows the normal state of a storage account configured as GZRS when the primary endpoints are available:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png" alt-text="Diagram that shows how the clients write data to the storage account in the primary region." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png":::

### The storage service endpoints become unavailable in the primary region (GZRS/RA-GZRS)

If the primary storage service endpoints become unavailable for any reason (1), the client is no longer able to write to the storage account. Depending on the underlying cause of the outage, replication to the secondary region might no longer be taking place (2), [so some data loss should be expected](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies). The following image shows the scenario where the primary endpoints are unavailable, but before recovery occurs:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-zone-redundant.png" alt-text="Diagram that shows how the primary is unavailable, so clients can't write data." lightbox="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-zone-redundant.png":::

### The unplanned failover process (GZRS/RA-GZRS)

To restore write access to your data, you can [initiate a failover](storage-initiate-account-failover.md). The storage service endpoint URIs for blobs, tables, queues, and files remain the same, but their DNS entries are changed to point to the secondary region (1), as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-zone-redundant.png" alt-text="Diagram that shows how the customer initiates account failover to the secondary endpoint." lightbox="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-zone-redundant.png":::

The failover typically takes about an hour.

After the failover is complete, the original secondary becomes the new primary (1), and the copy of the storage account in the original primary is deleted (2). The storage account is configured as LRS in the new primary region, and is no longer geo-redundant. Users can resume writing data to the storage account (3), as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png" alt-text="Diagram that shows the storage account status post-failover to secondary region." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png":::

To resume replication to a new secondary region, reconfigure the account for geo-redundancy.

Since the account was originally configured as GZRS, reconfiguring geo-redundancy after failover causes the original ZRS redundancy within the new secondary region (the original primary) to be retained. However, the redundancy configuration within the *current* primary always determines the effective geo-redundancy of a storage account. Since the *current* primary in this case is LRS, the effective geo-redundancy at this point is GRS, not GZRS.

> [!IMPORTANT]
> Keep in mind that converting a locally redundant storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After reconfiguring the account as GRS, Azure begins copying your data asynchronously to the new secondary region (1), as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-zone-redundant-geo.png" alt-text="Diagram that shows the storage account status post-failover to secondary region as GRS." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-zone-redundant-geo.png":::

Read access to the new secondary region isn't available again until the original outage is resolved.

### The unplanned failback process (GZRS/RA-GZRS)

> [!WARNING]
> After your account is reconfigured for geo-redundancy, it may take a significant amount of time before the data in the new primary region is fully copied to the new secondary.
>
> **To avoid a major data loss**, check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back. Compare the last sync time to the last times that data was written to the new primary to evaluate potential data loss.

After the issue causing the original outage is resolved, you can initiate failback to the original primary region. This process is described in the following image:

1. The current primary region becomes read only.
1. During customer-initiated failover and failback, your data isn't allowed to finish replicating to the secondary region during the failback process. Therefore, it's important to check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back.
1. The DNS entries for the storage service endpoints are switched. The secondary endpoints become the new primary endpoints for your storage account.

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-zone-redundant.png" alt-text="Diagram that shows the customer initiating account failback to the original primary region." lightbox="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-zone-redundant.png":::

After the failback is complete, the original primary region becomes the current one again (1), and the copy of the storage account in the original secondary is deleted (2). The storage account is configured as ZRS in the primary region, and is no longer geo-redundant. Users can resume writing data to the storage account (3), as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant.png" alt-text="Diagram that shows the post-failback status." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant.png":::

To resume replication to the original secondary region, reconfigure the account for geo-redundancy.

> [!IMPORTANT]
> Keep in mind that converting a ZRS storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After reconfiguring the account as GZRS, replication to the original secondary region resumes as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant-geo.png" alt-text="Diagram that shows the redundancy configuration returns to its original state." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant-geo.png":::

---

## See also

- [Disaster recovery planning and failover](storage-disaster-recovery-guidance.md)
- [Azure Storage redundancy](storage-redundancy.md)
- [Initiate an account failover](storage-initiate-account-failover.md)