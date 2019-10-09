---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 09/23/2019
 ms.author: tamram
 ms.custom: include file
---

Locally redundant storage (LRS) replicates your data three times within a single data center. LRS provides at least 99.999999999% (11 nines) durability of objects over a given year. LRS is the lowest-cost replication option and offers the least durability compared to other options.

If a datacenter-level disaster (for example, fire or flooding) occurs, all replicas in a storage account using LRS may be lost or unrecoverable. To mitigate this risk, Microsoft recommends using zone-redundant storage (ZRS), geo-redundant storage (GRS), or geo-zone-redundant storage (GZRS).

A write request to an LRS storage account returns successfully only after the data is written to all three replicas.

You may wish to use LRS in the following scenarios:

* If your application stores data that can be easily reconstructed if data loss occurs, you may opt for LRS.
* Some applications are restricted to replicating data only within a country/region due to data governance requirements. In some cases, the paired regions across which the data is replicated for GRS accounts may be in another country/region. For more information on paired regions, see [Azure regions](https://azure.microsoft.com/regions/).
