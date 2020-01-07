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

Locally redundant storage (LRS) replicates your data three times within a single physical location in the primary region. LRS provides at least 99.999999999% (11 nines) durability of objects over a given year.

LRS is the lowest-cost redundancy option and offers the least durability compared to other options. If a disaster such as fire or flooding occurs within the data center, all replicas of a storage account using LRS may be lost or unrecoverable. To mitigate this risk, Microsoft recommends using zone-redundant storage (ZRS), geo-redundant storage (GRS), or geo-zone-redundant storage (GZRS).

A write request to a storage account that is using LRS happens synchronously. The write operation returns successfully only after the data is written to all three replicas.

You may wish to use LRS in the following scenarios:

* If your application stores data that can be easily reconstructed if data loss occurs, you may opt for LRS.
* If your application is restricted to replicating data only within a country or region due to data governance requirements, you may opt for LRS. In some cases, the paired regions across which the data is replicated for GRS accounts may be in another country or region. For more information on paired regions, see [Azure regions](https://azure.microsoft.com/regions/).
