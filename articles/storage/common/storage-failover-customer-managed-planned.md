---
title: How customer-managed planned failover works
titleSuffix: Azure Storage
description: Azure Storage supports account failover of geo-redundant storage accounts for disaster recovery testing and planning. Learn what happens to your storage account and storage services during a customer-managed planned failover (preview) to the secondary region to perform disaster recovery testing and planning.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: conceptual
ms.date: 07/23/2024
ms.author: shaas
ms.subservice: storage-common-concepts
ms.custom: references_regions
---

<!--
Initial: 87 (1697/22)
Current: 98 (1470/0)
-->

# How customer-managed planned failover (preview) works

Customer managed planned failover can be useful in scenarios such as disaster and recovery planning and testing, proactive remediation of anticipated large-scale disasters, and nonstorage related outages.

During the planned failover process, your storage account's primary and secondary regions are swapped. The original primary region is demoted and becomes the new secondary while the original secondary region is promoted and becomes the new primary. The storage account must be available in both the primary and secondary regions before a planned failover can be initiated.

This article describes what happens during a customer-managed planned failover and failback at every stage of the process. To understand how a failover due to an unexpected storage endpoint outage works, see [How customer-managed (unplanned) failover](storage-failover-customer-managed-unplanned.md).

<br>
<iframe width="560" height="315" src="
https://www.youtube-nocookie.com/embed/lcQfwWsck58?si=I92_-lGOLcr4pUSk"
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[!INCLUDE [storage-failover.planned-preview](../../../includes/storage-failover.planned-preview.md)]

[!INCLUDE [storage-failover-user-unplanned-preview-lst](../../../includes/storage-failover-user-unplanned-preview-lst.md)]

## Redundancy management during planned failover and failback

> [!TIP]
> To understand the varying redundancy states during customer-managed failover and failback process in detail, see [Azure Storage redundancy](storage-redundancy.md) for definitions of each.

During the planned failover process, the primary region's storage service endpoints become read-only while remaining updates finish replicating to the secondary region. Next, all storage service endpoint's domain name service (DNS) entries are switched. Your storage account's secondary endpoints become the new primary endpoints, and the original primary endpoints become the new secondary. Data replication within each region remains unchanged even though the primary and secondary regions are switched. 

The planned failback process is essentially the same as the planned failover process, but with one exception. During planned failback, Azure stores the original redundancy configuration of your storage account and restores it to its original state upon failback. For example, if your storage account was originally configured as GZRS, the storage account will be GZRS after failback.

> [!NOTE]
> Unlike [customer-managed (unplanned) failover](storage-failover-customer-managed-unplanned.md), during planned failover, replication from the primary to secondary region must be complete before the DNS entries for the endpoints are changed to the new secondary. Because of this, data loss is not expected during planned failover or failback as long as both the primary and secondary regions are available throughout the process.

## How to initiate a failover

To learn how to initiate a failover, see [Initiate an account failover](storage-initiate-account-failover.md).

## The planned failover and failback process

The following diagrams show what happens during a customer-managed planned failover and failback of a storage account.

## [GRS/RA-GRS](#tab/grs-ra-grs)

Under normal circumstances, a client writes data to a storage account in the primary region via storage service endpoints (1). The data is then copied asynchronously from the primary region to the secondary region (2). The following image shows the normal state of a storage account configured as GRS:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png" alt-text="Diagram that shows how clients write data to the storage account in the primary region." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png":::

### The planned failover process (GRS/RA-GRS)

Begin disaster recovery testing by initiating a failover of your storage account to the secondary region. The following describes steps within the planned failover process, and the subsequent image provides illustration:

- The primary region temporarily loses both read and write access. RA-GRS or RA-GZRS users will continue to have read access to their secondary region.
- Replication of all data from the primary region to the secondary region completes.
- DNS entries for storage service endpoints in the secondary region are promoted and become the new primary endpoints for your storage account.

The failover typically takes about an hour.

:::image type="content" source="media/storage-failover-customer-managed-planned/failover-to-secondary-geo-redundant.png" alt-text="Diagram that shows how the customer initiates account failover to secondary endpoint." lightbox="media/storage-failover-customer-managed-planned/failover-to-secondary-geo-redundant.png":::

After the failover is complete, the original primary region becomes the new secondary (1), and the original secondary region becomes the new primary (2). The URIs for the storage service endpoints for blobs, tables, queues, and files remain the same, but their DNS entries are changed to point to the new primary region (3). Users can resume writing data to the storage account in the new primary region, and the data is then copied asynchronously to the new secondary (4) as shown in the following image:

:::image type="content" source="media/storage-failover-customer-managed-common/post-failover-geo-redundant.png" alt-text="Diagram that shows the storage account status post-failover to secondary region." lightbox="media/storage-failover-customer-managed-common/post-failover-geo-redundant.png":::

While in the failover state, perform your disaster recovery testing.

### The planned failback process (GRS/RA-GRS)

After testing is complete, perform another failover to failback to the original primary region. During the failover process, as shown in the following image:

- The primary region temporarily loses both read and write access. RA-GRS or RA-GZRS users will continue to have read access to their secondary region.
- All data finishes replicating from the current primary region to the current secondary region.
- The DNS entries for the storage service endpoints are changed to point back to the region that was the primary before the initial failover was performed.

The failback typically takes about an hour.

:::image type="content" source="media/storage-failover-customer-managed-planned/failback-to-primary-geo-redundant.png" alt-text="Diagram that shows how the customer initiates account failback to original primary region." lightbox="media/storage-failover-customer-managed-planned/failback-to-primary-geo-redundant.png":::

After the failback is complete, the storage account is restored to its original redundancy configuration. Users can resume writing data to the storage account in the original primary region (1) while replication to the original secondary (2) continues as before the failover:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-redundant.png" alt-text="Diagram that shows how clients continue to perform read and write operations to the storage account in the original primary region.":::

## [GZRS/RA-GZRS](#tab/gzrs-ra-gzrs)

Under normal circumstances, a client writes data to a storage account in the primary region via storage service endpoints (1). The data is then copied asynchronously from the primary region to the secondary region (2). The following image shows the normal state of a storage account configured as GZRS:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png" alt-text="Diagram that shows how the clients write data to the storage account in the primary region." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png":::

### The planned failover process (GZRS/RA-GZRS)

Begin disaster recovery testing by initiating a failover of your storage account to the secondary region. The following describes steps within the planned failover process, and the subsequent image provides illustration:

- The current primary region becomes read only.
- All data finishes replicating from the primary region to the secondary region.
- Storage service endpoint DNS entries are switched. Your storage account's endpoints in the secondary region become your new primary endpoints.

The failover typically takes about an hour.

:::image type="content" source="media/storage-failover-customer-managed-planned/failover-to-secondary-geo-zone-redundant.png" alt-text="Diagram that shows how the customer initiates account failover to the secondary endpoint." lightbox="media/storage-failover-customer-managed-planned/failover-to-secondary-geo-zone-redundant.png":::

After the failover is complete, the original primary region becomes the new secondary (1) and the original secondary region becomes the new primary (2). The URIs for the storage service endpoints for blobs, tables, queues, and files remain the same, but point to the new primary region (3). Users can resume writing data to the storage account in the new primary region, and the data is then copied asynchronously to the new secondary (4), as shown in the following image:

:::image type="content" source="media/storage-failover-customer-managed-common/post-failover-geo-zone-redundant.png" alt-text="Diagram that shows the storage account status post-failover to secondary region." lightbox="media/storage-failover-customer-managed-common/post-failover-geo-zone-redundant.png":::

While in the failover state, perform your disaster recovery testing.

### The planned failback process (GZRS/RA-GZRS)

When testing is complete, perform another failover to fail back to the original primary region. The following image illustrates the steps involved in the failover process.

- The current primary region becomes read only.
- All data finishes replicating from the current primary region to the current secondary region.
- The DNS entries for the storage service endpoints are changed to point back to the region that was the primary before the initial failover was performed.

The failback typically takes about an hour.

:::image type="content" source="media/storage-failover-customer-managed-planned/failback-to-primary-geo-zone-redundant.png" alt-text="Diagram that shows the customer initiating account failback to the original primary region." lightbox="media/storage-failover-customer-managed-planned/failback-to-primary-geo-zone-redundant.png":::

After the failback is complete, the storage account is restored to its original redundancy configuration. Users can resume writing data to the storage account in the original primary region (1), while replication to the original secondary (2) continues as before the failover:

:::image type="content" source="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png" alt-text="Diagram that shows the redundancy configuration returns to its original state." lightbox="media/storage-failover-customer-managed-common/pre-failover-geo-zone-redundant.png":::

---

## See also

- [Disaster recovery and account failover](storage-disaster-recovery-guidance.md)
- [Initiate an account failover](storage-initiate-account-failover.md)
- [How customer-managed (unplanned) failover works](storage-failover-customer-managed-unplanned.md)