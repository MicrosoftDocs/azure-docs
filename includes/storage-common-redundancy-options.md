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

Replication options for a storage account include:

* [Locally-redundant storage (LRS)](../articles/storage/common/storage-redundancy-lrs.md): A simple, low-cost replication strategy. Data is replicated synchronously three times within the primary region.
* [Zone-redundant storage (ZRS)](../articles/storage/common/storage-redundancy-zrs.md): Replication for scenarios requiring high availability. Data is replicated synchronously across three Azure availability zones in the primary region.
* [Geo-redundant storage (GRS)](../articles/storage/common/storage-redundancy-grs.md): Cross-regional replication to protect against regional outages. Data is replicated synchronously three times in the primary region, then replicated asynchronously to the secondary region. For read access to data in the secondary region, enable read-access geo-redundant storage (RA-GRS).
* [Geo-zone-redundant storage (GZRS) (preview)](../articles/storage/common/storage-redundancy-gzrs.md): Replication for scenarios requiring both high availability and maximum durability. Data is replicated synchronously across three Azure availability zones in the primary region, then replicated asynchronously to the secondary region. For read access to data in the secondary region, enable read-access geo-zone-redundant storage (RA-GZRS).
