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

Geo-redundant storage (GRS) is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year by replicating your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable.

If you opt for GRS, you have two related options to choose from:

* GRS replicates your data to another data center in a secondary region, but that data is available to be read only if Microsoft initiates a failover from the primary to secondary region. 
* Read-access geo-redundant storage (RA-GRS) is based on GRS. RA-GRS replicates your data to another data center in a secondary region, and also provides you with the option to read from the secondary region. With RA-GRS, you can read from the secondary regardless of whether Microsoft initiates a failover from the primary to the secondary. 

For a storage account with GRS or RA-GRS enabled, an update is first committed to the primary region and replicated within the primary region. The update is then replicated asynchronously to the secondary region, where it is also replicated. Both the primary and secondary regions manage replicas across separate fault domains and upgrade domains within a storage scale unit. The storage scale unit is the basic replication unit within the datacenter. Replication at this level is provided by LRS; for more information, see [Locally-redundant storage (LRS): Low-cost data redundancy for Azure Storage](../articles/storage/common/storage-redundancy-lrs.md).

Keep these points in mind when deciding which replication option to use:

* Zone-redundant storage (ZRS) provides highly availability with synchronous replication and may be a better choice for some scenarios than GRS or RA-GRS. For more information on ZRS, see [ZRS]().
* Because asynchronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region will be lost if the data cannot be recovered from the primary region.
* With GRS, the replica is not available unless Microsoft initiates failover to the secondary region. If Microsoft does initiate a failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, please see [Disaster Recovery Guidance](../articles/storage/common/storage-disaster-recovery-guidance.md).
* If your application needs to read from the secondary region, enable RA-GRS.

> [!IMPORTANT]
> You can change how your data is replicated after your storage account has been created. However, you may incur an additional one-time data transfer cost if you switch from LRS or ZRS to GRS or RA-GRS.
>

## Read-access geo-redundant storage

Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account. RA-GRS provides read-only access to the data in the secondary location, in addition to geo-replication across two regions.

When you enable read-only access to your data in the secondary region, your data is available on a secondary endpoint as well as on the primary endpoint for your storage account. The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

Some considerations to keep in mind when using RA-GRS:

* Your application has to manage which endpoint it is interacting with when using RA-GRS.
* Since asynchronous replication involves a delay, changes that have not yet been replicated to the secondary region may be lost if data cannot be recovered from the primary region, for example in the event of a regional disaster.
* If Microsoft initiates failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, see [Disaster Recovery Guidance](../articles/storage/common/storage-disaster-recovery-guidance.md).
* RA-GRS is intended for high-availability purposes. For scalability guidance, review the [performance checklist](../articles/storage/common/storage-performance-checklist.md).
* For suggestions on how to design for high availability with RA-GRS, see [Designing Highly Available Applications using RA-GRS storage](../articles/storage/common/storage-designing-ha-apps-with-ragrs.md).

## Paired Regions

When you create a storage account, you select the primary region for the account. The secondary region is determined based on the primary region, and cannot be changed. The following table shows the primary and secondary region pairings.

| Primary | Secondary |
| --- | --- |
| North Central US | South Central US |
| South Central US | North Central US |
| East US | West US |
| West US | East US |
| US East 2 | Central US |
| Central US | US East 2 |
| North Europe | West Europe |
| West Europe | North Europe |
| South East Asia | East Asia |
| East Asia | South East Asia |
| East China | North China |
| North China | East China |
| Japan East | Japan West |
| Japan West | Japan East |
| Brazil South | South Central US |
| Australia East | Australia Southeast |
| Australia Southeast | Australia East |
| India South | India Central |
| India Central | India South |
| India West | India South |
| US Gov Iowa | US Gov Virginia |
| US Gov Virginia | US Gov Texas |
| US Gov Texas | US Gov Arizona |
| US Gov Arizona | US Gov Texas |
| Canada Central | Canada East |
| Canada East | Canada Central |
| UK West | UK South |
| UK South | UK West |
| Germany Central | Germany Northeast |
| Germany Northeast | Germany Central |
| West US 2 | West Central US |
| West Central US | West US 2 |

For up-to-date information about regions supported by Azure, see [Azure regions](https://azure.microsoft.com/regions/).

>[!NOTE]  
> US Gov Virginia secondary region is US Gov Texas. Previously, US Gov Virginia utilized US Gov Iowa as a secondary region. Storage accounts still leveraging US Gov Iowa as a secondary region are being migrated to US Gov Texas as a secondary region.
>
>
