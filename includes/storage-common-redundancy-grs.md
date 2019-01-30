---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 03/26/2018
 ms.author: jeking
 ms.custom: include file
---

Geo-redundant storage (GRS) is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year by replicating your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region isn't recoverable.

If you opt for GRS, you have two related options to choose from:

* GRS replicates your data to another data center in a secondary region, but that data is available to be read only if Microsoft initiates a failover from the primary to secondary region. 
* Read-access geo-redundant storage (RA-GRS) is based on GRS. RA-GRS replicates your data to another data center in a secondary region, and also provides you with the option to read from the secondary region. With RA-GRS, you can read from the secondary region regardless of whether Microsoft initiates a failover from the primary to secondary region. 

For a storage account with GRS or RA-GRS enabled, all data is first replicated with locally redundant storage (LRS). An update is first committed to the primary location and replicated using LRS. The update is then replicated asynchronously to the secondary region using GRS. When data is written to the secondary location, it's also replicated within that location using LRS. 

Both the primary and secondary regions manage replicas across separate fault domains and upgrade domains within a storage scale unit. The storage scale unit is the basic replication unit within the datacenter. Replication at this level is provided by LRS; for more information, see [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](../articles/storage/common/storage-redundancy-lrs.md).

Keep these points in mind when deciding which replication option to use:

* Zone-redundant storage (ZRS) provides highly availability with synchronous replication and may be a better choice for some scenarios than GRS or RA-GRS. For more information on ZRS, see [ZRS](../articles/storage/common/storage-redundancy-zrs.md).
* Asynchronous replication involves a delay from the time that data is written to the primary region, to when it is replicated to the secondary region. In the event of a regional disaster, changes that haven't yet been replicated to the secondary region may be lost if that data can't be recovered from the primary region.
* With GRS, the replica isn't available for read or write access unless Microsoft initiates a failover to the secondary region. In the case of a failover, you'll have read and write access to that data after the failover has completed. For more information, please see [Disaster recovery guidance](../articles/storage/common/storage-disaster-recovery-guidance.md).
* If your application needs to read from the secondary region, enable RA-GRS.