---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---



Azure Storage - whether that's for Table, Queue, Blob, or Files - provides a range of geo-redundancy and failover capabilities to suit different requirements.

> [!IMPORTANT]
> Geo-redundant storage only works within [Azure paired regions](/azure/reliability/regions-paired). If your storage account's region isn't paired, consider using the [alternative multi-region approaches](#alternative-multi-region-approaches).


#### Replication across paired regions

Azure Storage provides several types of geo-redundant storage in paired regions. Whichever type of geo-redundant storage you use, data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage) provides support for planned and unplanned failovers to the Azure paired region when there's an outage in the primary region. GRS asynchronously replicates data from the primary region to the paired region.

   :::image type="content" source="/azure/reliability/media/reliability-storage/geo-redundant-storage" alt-text="Diagram showing how data is replicated with GRS." lightbox="/azure/reliability/media/reliability-storage/geo-redundant-storage" border="false":::

- [Geo-zone redundant storage (GZRS)](/azure/storage/common/storage-redundancy#geo-zone-redundant-storage) replicates data in multiple availabilty zones in the primary region, and also into the paired region.

  :::image type="content" source="/azure/reliability/media/reliability-storage/geo-zone-redundant-storage" alt-text="Diagram showing how data is replicated with GZRS." lightbox="/azure/reliability/media/reliability-storage/geo-zone-redundant-storage" border="false":::

- [Read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS)](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region) extends GRS and GZRS, with the added benefit of read access to the secondary endpoint. These options are ideal for applications designed for high availability business-critical applications. In the unlikely event that the primary endpoint experiences an outage, applications configured for read access to the secondary region can continue to operate.


#### Failover types

Azure Storage supports three types of failover that are intended for different situations:

- **Customer-managed unplanned failover:** You are responsible for initiating recovery if there's a region-wide storage failure in your primary region.

- **Customer-managed planned failover:** You are responsible for initiating recovery if another part of your solution has a failure in your primary region, and you need to switch your whole solution over to a secondary region.

- **Microsoft-managed failover:** In exceptional situations, Microsoft might initiate failover for all GRS storage accounts in a region. However, Microsoft-managed failover is a last resort and is expected to only be performed after an extended period of outage. You shouldn't rely on Microsoft-managed failover.

Geo-redundant storage accounts can use any of these failover types. You don't need to preconfigure a storage account to use any of the failover types ahead of time.
