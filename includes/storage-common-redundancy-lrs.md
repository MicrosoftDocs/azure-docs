---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 02/12/2019
 ms.author: tamram
 ms.custom: include file
---

Locally redundant storage (LRS) provides at least 99.999999999% (11 nines) durability of objects over a given year. LRS provides this object durability by replicating your data to a storage scale unit. A datacenter, located in the region where you created your storage account, hosts the storage scale unit. A write request to an LRS storage account returns successfully only after the data is written to all replicas. Each replica resides in separate fault domains and upgrade domains within a storage scale unit.

A storage scale unit is a collection of racks of storage nodes. A fault domain (FD) is a group of nodes that represent a physical unit of failure. Think of a fault domain as nodes belonging to the same physical rack. An upgrade domain (UD) is a group of nodes that are upgraded together during the process of a service upgrade (rollout). The replicas are spread across UDs and FDs within one storage scale unit. This architecture ensures your data is available if a hardware failure affects a single rack or when nodes are upgraded during a service upgrade.

LRS is the lowest-cost replication option and offers the least durability compared to other options. If a datacenter-level disaster (for example, fire or flooding) occurs, all replicas may be lost or unrecoverable. To mitigate this risk, Microsoft recommends using either zone-redundant storage (ZRS) or geo-redundant storage (GRS).

* If your application stores data that can be easily reconstructed if data loss occurs, you may opt for LRS.
* Some applications are restricted to replicating data only within a country/region due to data governance requirements. In some cases, the paired regions across which the data is replicated for GRS accounts may be in another country/region. For more information on paired regions, see [Azure regions](https://azure.microsoft.com/regions/).
