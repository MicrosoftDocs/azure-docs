---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 11/04/2018
 ms.author: tamram
 ms.custom: include file
---

Zone-redundant storage (ZRS) replicates your data synchronously across three storage clusters in a single region. Each storage cluster is physically separated from the others and is located in its own availability zone (AZ). Each availability zone&mdash;and the ZRS cluster within it&mdash;is autonomous and includes separate utilities and networking features. A write request to a ZRS storage account returns successfully only after the data is written to all replicas across the three clusters.

When you store your data in a storage account using ZRS replication, you can continue to access and manage your data if an availability zone becomes unavailable. ZRS provides excellent performance and low latency. ZRS offers the same [scalability targets](../articles/storage/common/storage-scalability-targets.md) as [locally redundant storage (LRS)](../articles/storage/common/storage-redundancy-lrs.md).

Consider ZRS for scenarios that require consistency, durability, and high availability. Even if an outage or natural disaster renders an availability zone unavailable, ZRS offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year.

For more information about availability zones, see [Availability Zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).