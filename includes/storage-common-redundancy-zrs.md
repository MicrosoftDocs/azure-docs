---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 01/07/2020
 ms.author: tamram
 ms.custom: include file
---

Zone-redundant storage (ZRS) replicates your Azure Storage data synchronously across three Azure availability zones in the primary region. Each availability zone is a separate physical location that is with independent power, cooling, and networking. For more information on Azure availability zones, see [What are Azure Availability Zones?](../articles/availability-zones/az-overview.md).

When you store your data in a storage account using ZRS replication, you can continue to access and manage your data if an availability zone becomes unavailable. ZRS offers durability for Azure Storage data objects of at least 99.9999999999% (12 9's) over a given year.

A write request to a storage account that is using ZRS happens synchronously. The write operation returns successfully only after the data is written to all replicas across the three availability zones.

Microsoft recommends using ZRS in the primary region for scenarios that require consistency, durability, and high availability. ZRS provides excellent performance and low latency.

For information about which regions support ZRS, see **Services support by region**  in [What are Azure Availability Zones?](../articles/availability-zones/az-overview.md).
