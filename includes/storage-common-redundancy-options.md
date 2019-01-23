---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 03/26/2018
 ms.author: tamram
 ms.custom: include file
---

Replication options for a storage account include:

* [Locally-redundant storage (LRS)](../articles/storage/common/storage-redundancy-lrs.md): A simple, low-cost replication strategy. Data is replicated within a single storage scale unit.
* [Zone-redundant storage (ZRS)](../articles/storage/common/storage-redundancy-zrs.md): Replication for high availability and durability. Data is replicated synchronously across three availability zones. 
* [Geo-redundant storage (GRS)](../articles/storage/common/storage-redundancy-grs.md): Cross-regional replication to protect against region-wide unavailability.
* [Read-access geo-redundant storage (RA-GRS)](../articles/storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage): Cross-regional replication with read access to the replica.