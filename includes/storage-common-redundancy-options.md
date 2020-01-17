---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 01/14/2020
 ms.author: tamram
 ms.custom: include file
---

Redundancy options for a storage account include:

* [Locally redundant storage (LRS)](../articles/storage/common/storage-redundancy-lrs.md): A simple, low-cost redundancy strategy. Data is copied synchronously three times within the primary region.
* [Zone-redundant storage (ZRS)](../articles/storage/common/storage-redundancy-zrs.md): Redundancy for scenarios requiring high availability. Data is copied synchronously across three Azure availability zones in the primary region.
* [Geo-redundant storage (GRS)](../articles/storage/common/storage-redundancy-grs.md): Cross-regional redundancy to protect against regional outages. Data is copied synchronously three times in the primary region, then copied asynchronously to the secondary region. For read access to data in the secondary region, enable read-access geo-redundant storage (RA-GRS).
* [Geo-zone-redundant storage (GZRS) (preview)](../articles/storage/common/storage-redundancy-gzrs.md): Redundancy for scenarios requiring both high availability and maximum durability. Data is copied synchronously across three Azure availability zones in the primary region, then copied asynchronously to the secondary region. For read access to data in the secondary region, enable read-access geo-zone-redundant storage (RA-GZRS).

For more information about redundancy in Azure Storage, see [Azure Storage redundancy](../articles/storage/common/storage-redundancy.md).
