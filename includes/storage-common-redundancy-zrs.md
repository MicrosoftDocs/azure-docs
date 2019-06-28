---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 06/28/2019
 ms.author: tamram
 ms.custom: include file
---

Zone-redundant storage (ZRS) replicates your data synchronously across three storage clusters in a single region. Each storage cluster is physically separated from the others and is located in its own availability zone (AZ). Each availability zone&mdash;and the ZRS cluster within it&mdash;is autonomous and includes separate utilities and networking features. A write request to a ZRS storage account returns successfully only after the data is written to all replicas across the three clusters.

When you store your data in a storage account using ZRS replication, you can continue to access and manage your data if an availability zone becomes unavailable. ZRS provides excellent performance and low latency. ZRS offers the same [scalability targets](../articles/storage/common/storage-scalability-targets.md) as [locally redundant storage (LRS)](../articles/storage/common/storage-redundancy-lrs.md).

Consider ZRS for scenarios that require consistency, durability, and high availability. Even if an outage or natural disaster renders an availability zone unavailable, ZRS offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year.

Geo-zone-redundant storage (GZRS) (preview) replicates your data synchronously across three Azure availability zones in the primary region, then replicates the data asynchronously to the secondary region. GZRS provides high availability together with maximum durability. GZRS is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year. For read access to data in the secondary region, enable read-access geo-zone-redundant storage (RA-GZRS). For more information about GZRS, see [Geo-zone-redundant storage for highly availability and maximum durability (preview)](../articles/storage/common/storage-redundancy-lrs.md).

For more information about availability zones, see [Availability Zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).
