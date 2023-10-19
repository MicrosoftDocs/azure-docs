---
title: How Azure Storage account customer-managed failover works
titleSuffix: Azure Storage
description: Azure Storage supports account failover for geo-redundant storage accounts to recover from a service endpoint outage. Learn what happens to your storage account and storage services during a customer-managed failover to the secondary region if the primary endpoint becomes unavailable.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: conceptual
ms.date: 09/22/2023
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: 
---

# How customer-managed storage account failover works

Customer-managed failover of Azure Storage accounts enables you to fail over your entire geo-redundant storage account to the secondary region if the storage service endpoints for the primary region become unavailable. During failover, the original secondary region becomes the new primary and all storage service endpoints for blobs, tables, queues and files are redirected to the new primary region. After the storage service endpoint outage has been resolved, you can perform another failover operation to *fail back* to the original primary region.

This article describes what happens during a customer-managed storage account failover and failback at every stage of the process.

[!INCLUDE [updated-for-az](../../../includes/storage-failover-unplanned-hns-preview-include.md)]

## Redundancy management during failover and failback

> [!TIP]
> To understand the various redundancy states during the storage account failover and failback process in detail, see [Azure Storage redundancy](storage-redundancy.md) for definitions of each.

When a storage account is configured for GRS or RA-GRS redundancy, data is replicated three times locally within both the primary and secondary regions (LRS). When a storage account is configured for GZRS or RA-GZRS replication, data is zone-redundant within the primary region (ZRS) and replicated three times locally within the secondary region (LRS). If the account is configured for read access (RA), you will be able to read data from the secondary region as long as the storage service endpoints to that region are available.

During the customer-managed failover process, the DNS entries for the storage service endpoints are changed such that those for the secondary region become the new primary endpoints for your storage account. After failover, the copy of your storage account in the original primary region is deleted and your storage account continues to be replicated three times locally within the original secondary region (the new primary). At that point, your storage account becomes locally redundant (LRS).

The original and current redundancy configurations are stored in the properties of the storage account to allow you eventually return to your original configuration when you fail back.

To regain geo-redundancy after a failover, you will need to reconfigure your account as GRS. (GZRS is not an option post-failover since the new primary will be LRS after the failover). After the account is reconfigured for geo-redundancy, Azure immediately begins copying data from the new primary region to the new secondary. If you configure your storage account for read access (RA) to the secondary region, that access will be available but it may take some time for replication from the primary to make the secondary current.

> [!WARNING]
> After your account is reconfigured for geo-redundancy, it may take a significant amount of time before existing data in the new primary region is fully copied to the new secondary.
>
> **To avoid a major data loss**, check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back. Compare the last sync time to the last times that data was written to the new primary to evaluate potential data loss.

The failback process is essentially the same as the failover process except Azure restores the replication configuration to its original state before it was failed over (the replication configuration, not the data). So, if your storage account was originally configured as GZRS, the primary region after faillback becomes ZRS.

After failback, you can configure your storage account to be geo-redundant again. If the original primary region was configured for LRS, you can configure it to be GRS or RA-GRS. If the original primary was configured as ZRS, you can configure it to be GZRS or RA-GZRS. For additional options, see [Change how a storage account is replicated](redundancy-migration.md).

## How to initiate a failover

To learn how to initiate a failover, see [Initiate a storage account failover](storage-initiate-account-failover.md).

> [!CAUTION]
> Storage account failover usually involves some data loss, and potentially file and data inconsistencies. It's important to understand the impact that an account failover would have on your data before initiating one.
>
> For details about potential data loss and inconsistencies, see [Anticipate data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies).

## The failover and failback process

This section summarizes the failover process for a customer-managed failover.

### Failover transition summary

After a customer-managed failover:

- The secondary region becomes the new primary
- The copy of the data in the original primary region is deleted
- The storage account is converted to LRS
- Geo-redundancy is lost

This table summarizes the resulting redundancy configuration at every stage of a customer-managed failover and failback:

| Original <br> configuration | After <br> failover | After re-enabling <br> geo redundancy | After <br> failback | After re-enabling <br> geo redundancy |
|------------------------------|-----|------------------|------|------------------|
| GRS                          | LRS | GRS <sup>1</sup> | LRS  |GRS <sup>1</sup>  |
| GZRS                         | LRS | GRS <sup>1</sup> | ZRS  |GZRS <sup>1</sup> |

<sup>1</sup> Geo-redundancy is lost during a customer-managed failover and must be manually reconfigured.<br>

### Failover transition details

The following diagrams show what happens during customer-managed failover and failback of a storage account that is configured for geo-redundancy. The transition details for GZRS and RA-GZRS are slightly different from GRS and RA-GRS.

## [GRS/RA-GRS](#tab/grs-ra-grs)

### Normal operation (GRS/RA-GRS)

Under normal circumstances, a client writes data to a storage account in the primary region via storage service endpoints (1). The data is then copied asynchronously from the primary region to the secondary region (2). The following image shows the normal state of a storage account configured as GRS when the primary endpoints are available:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png" alt-text="Diagram that shows how clients write data to the storage account in the primary region." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png":::

### The storage service endpoints become unavailable in the primary region (GRS/RA-GRS)

If the primary storage service endpoints become unavailable for any reason (1), the client is no longer able to write to the storage account. Depending on the underlying cause of the outage, replication to the secondary region may no longer be functioning (2), so [some data loss should be expected](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies). The following image shows the scenario where the primary endpoints have become unavailable, but no recovery has occurred yet:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-redundant.png" alt-text="Diagram that shows how the primary is unavailable, so clients cannot write data." lightbox="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-redundant.png":::

### The failover process (GRS/RA-GRS)

To restore write access to your data, you can [initiate a failover](storage-initiate-account-failover.md).  The storage service endpoint URIs for blobs, tables, queues, and files remain the same but their DNS entries are changed to point to the secondary region (1) as show in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-redundant.png" alt-text="Diagram that shows how the customer initiates account failover to secondary endpoint." lightbox="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-redundant.png":::

Customer-managed failover typically takes about an hour.

After the failover is complete, the original secondary becomes the new primary (1) and the copy of the storage account in the original primary is deleted (2). The storage account is configured as LRS in the new primary region and is no longer geo-redundant. Users can resume writing data to the storage account (3) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png" alt-text="Diagram that shows the storage account status post-failover to secondary region." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png":::

To resume replication to a new secondary region, reconfigure the account for geo-redundancy.

> [!IMPORTANT]
> Keep in mind that converting a locally redundant storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After re-configuring the account as GRS, Azure begins copying your data asynchronously to the new secondary region (1) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant-geo.png" alt-text="Diagram that shows the storage account status post-failover to secondary region as GRS." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant-geo.png":::

Read access to the new secondary region will not become available again until the issue causing the original outage has been resolved.

### The failback process (GRS/RA-GRS)

> [!WARNING]
> After your account is reconfigured for geo-redundancy, it may take a significant amount of time before the data in the new primary region is fully copied to the new secondary.
>
> **To avoid a major data loss**, check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back. Compare the last sync time to the last times that data was written to the new primary to evaluate potential data loss.

Once the issue causing the original outage has been resolved, you can initiate another failover to fail back to the original primary region, resulting in the following:

1. The current primary region becomes read only.
1. With customer-initiated failover and failback, your data is not allowed to finish replicating to the secondary region during the failback process. Therefore, it is important to check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back.
1. The DNS entries for the storage service endpoints are changed such that those for the secondary region become the new primary endpoints for your storage account.

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-redundant.png" alt-text="Diagram that shows how the customer initiates account failback to original primary region." lightbox="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-redundant.png":::

After the failback is complete, the original primary region becomes the current one again (1) and the copy of the storage account in the original secondary is deleted (2). The storage account is configured as locally redundant in the primary region and is no longer geo-redundant. Users can resume writing data to the storage account (3) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant.png" alt-text="Diagram that shows the Post-failback status." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant.png":::

To resume replication to the original secondary region, configure the account for geo-redundancy again.

> [!IMPORTANT]
> Keep in mind that converting a locally redundant storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After re-configuring the account as GRS, replication to the original secondary region resumes as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant-geo.png" alt-text="Diagram that shows how the redundancy configuration returns to its original state." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-redundant-geo.png":::

## [GZRS/RA-GZRS](#tab/gzrs-ra-gzrs)

### Normal operation (GZRS/RA-GZRS)

Under normal circumstances, a client writes data to a storage account in the primary region via storage service endpoints (1). The data is then copied asynchronously from the primary region to the secondary region (2). The following image shows the normal state of a storage account configured as GZRS when the primary endpoints are available:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png" alt-text="Diagram that shows how the clients write data to the storage account in the primary region." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png":::

### The storage service endpoints become unavailable in the primary region (GZRS/RA-GZRS)

If the primary storage service endpoints become unavailable for any reason (1), the client is no longer able to write to the storage account. Depending on the underlying cause of the outage, replication to the secondary region may no longer be functioning (2), [so some data loss should be expected](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies). The following image shows the scenario where the primary endpoints have become unavailable, but no recovery has occurred yet:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-zone-redundant.png" alt-text="Diagram that shows how the primary is unavailable, so clients cannot write data." lightbox="media/storage-failover-customer-managed-unplanned/primary-unavailable-before-failover-geo-zone-redundant.png":::

### The failover process (GZRS/RA-GZRS)

To restore write access to your data, you can [initiate a failover](storage-initiate-account-failover.md).  The storage service endpoint URIs for blobs, tables, queues, and files remain the same but their DNS entries are changed to point to the secondary region (1) as show in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-zone-redundant.png" alt-text="Diagram that shows how the customer initiates account failover to the secondary endpoint." lightbox="media/storage-failover-customer-managed-unplanned/failover-to-secondary-geo-zone-redundant.png":::

The failover typically takes about an hour.

After the failover is complete, the original secondary becomes the new primary (1) and the copy of the storage account in the original primary is deleted (2). The storage account is configured as LRS in the new primary region and is no longer geo-redundant. Users can resume writing data to the storage account (3) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png" alt-text="Diagram that shows the storage account status post-failover to secondary region." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-redundant.png":::

To resume replication to a new secondary region, reconfigure the account for geo-redundancy.

Since the account was originally configured as GZRS, reconfiguring geo-redundancy after failover causes the original ZRS redundancy within the new secondary region (the original primary) to be retained. However, the redundancy configuration within the current primary always determines the effective geo-redundancy of a storage account. Since the current primary in this case is LRS, the effective geo-redundancy at this point is GRS, not GZRS.

> [!IMPORTANT]
> Keep in mind that converting a locally redundant storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After re-configuring the account as GRS, Azure begins copying your data asynchronously to the new secondary region (1) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failover-geo-zone-redundant-geo.png" alt-text="Diagram that shows the storage account status post-failover to secondary region as GRS." lightbox="media/storage-failover-customer-managed-unplanned/post-failover-geo-zone-redundant-geo.png":::

Read access to the new secondary region will not become available again until the issue causing the original outage has been resolved.

### The failback process (GZRS/RA-GZRS)

> [!WARNING]
> After your account is reconfigured for geo-redundancy, it may take a significant amount of time before the data in the new primary region is fully copied to the new secondary.
>
> **To avoid a major data loss**, check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back. Compare the last sync time to the last times that data was written to the new primary to evaluate potential data loss.

Once the issue causing the original outage has been resolved, you can initiate another failover to fail back to the original primary region, resulting in the following:

1. The current primary region becomes read only.
1. With customer-initiated failover and failback, your data is not allowed to finish replicating to the secondary region during the failback process. Therefore, it is important to check the value of the [**Last Sync Time**](last-sync-time-get.md) property before failing back.
1. The DNS entries for the storage service endpoints are changed such that those for the secondary region become the new primary endpoints for your storage account.

:::image type="content" source="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-zone-redundant.png" alt-text="Diagram that shows the customer initiating account failback to the original primary region." lightbox="media/storage-failover-customer-managed-unplanned/failback-to-primary-geo-zone-redundant.png":::

After the failback is complete, the original primary region becomes the current one again (1) and the copy of the storage account in the original secondary is deleted (2). The storage account is configured as ZRS in the primary region and is no longer geo-redundant. Users can resume writing data to the storage account (3) as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant.png" alt-text="Diagram that shows the post-failback status." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant.png":::

To resume replication to the original secondary region, configure the account for geo-redundancy again.

> [!IMPORTANT]
> Keep in mind that converting a ZRS storage account to use geo-redundancy incurs both cost and time. For more information, see [The time and cost of failing over](storage-disaster-recovery-guidance.md#the-time-and-cost-of-failing-over).

After re-configuring the account as GZRS, replication to the original secondary region resumes as shown in this image:

:::image type="content" source="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant-geo.png" alt-text="Diagram that shows the redundancy configuration returns to its original state." lightbox="media/storage-failover-customer-managed-unplanned/post-failback-geo-zone-redundant-geo.png":::

---

## See also

- [Disaster recovery planning and failover](storage-disaster-recovery-guidance.md)
- [Azure Storage redundancy](storage-redundancy.md)
- [Initiate an account failover](storage-initiate-account-failover.md)
