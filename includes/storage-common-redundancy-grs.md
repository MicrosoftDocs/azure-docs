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

Geo-redundant storage (GRS) is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year by replicating your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable.

If you opt for GRS, you have two related options to choose from:

* GRS replicates your data to another data center in a secondary region, but that data is available to be read only if Microsoft initiates a failover from the primary to secondary region. 
* Read-access geo-redundant storage (RA-GRS) is based on GRS. RA-GRS replicates your data to another data center in a secondary region, and also provides you with the option to read from the secondary region. With RA-GRS, you can read from the secondary regardless of whether Microsoft initiates a failover from the primary to the secondary. 

For a storage account with GRS or RA-GRS enabled, all data is first replicated with locally-redundant storage (LRS). An update is first committed to the primary location and replicated using LRS. The update is then replicated asynchronously to the secondary region using GRS. When data is written to the secondary location, it is also replicated within that location using LRS. 

Both the primary and secondary regions manage replicas across separate fault domains and upgrade domains within a storage scale unit. The storage scale unit is the basic replication unit within the datacenter. Replication at this level is provided by LRS; for more information, see [Locally-redundant storage (LRS): Low-cost data redundancy for Azure Storage](../articles/storage/common/storage-redundancy-lrs.md).

Keep these points in mind when deciding which replication option to use:

* Zone-redundant storage (ZRS) provides highly availability with synchronous replication and may be a better choice for some scenarios than GRS or RA-GRS. For more information on ZRS, see [ZRS](../articles/storage/common/storage-redundancy-zrs.md).
* Because asynchronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region will be lost if the data cannot be recovered from the primary region.
* With GRS, the replica is not available unless Microsoft initiates failover to the secondary region. If Microsoft does initiate a failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, please see [Disaster Recovery Guidance](../articles/storage/common/storage-disaster-recovery-guidance.md).
* If your application needs to read from the secondary region, enable RA-GRS.

## Read-access geo-redundant storage

Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account. RA-GRS provides read-only access to the data in the secondary location, in addition to geo-replication across two regions.

When you enable read-only access to your data in the secondary region, your data is available on a secondary endpoint as well as on the primary endpoint for your storage account. The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

Some considerations to keep in mind when using RA-GRS:

* Your application has to manage which endpoint it is interacting with when using RA-GRS.
* Since asynchronous replication involves a delay, changes that have not yet been replicated to the secondary region may be lost if data cannot be recovered from the primary region, for example in the event of a regional disaster.
* You can check the Last Sync Time of your storage account. Last Sync Time is a GMT date/time value. All primary writes before the Last Sync Time have been successfully written to the secondary location, meaning that they are available to be read from the secondary location. Primary writes after the Last Sync Time may or may not be available for reads yet. You can query this value using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](../articles/storage/common/storage-powershell-guide-full.md), or from one of the Azure Storage client libraries.
* If Microsoft initiates failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, see [Disaster Recovery Guidance](../articles/storage/common/storage-disaster-recovery-guidance.md).
* For information on how to switch to the secondary region, see [What to do if an Azure Storage outage occurs](../articles/storage/common/storage-disaster-recovery-guidance.md).
* RA-GRS is intended for high-availability purposes. For scalability guidance, review the [performance checklist](../articles/storage/common/storage-performance-checklist.md).
* For suggestions on how to design for high availability with RA-GRS, see [Designing Highly Available Applications using RA-GRS storage](../articles/storage/common/storage-designing-ha-apps-with-ragrs.md).

## What is the RPO and RTO with GRS?
**Recovery Point Objective (RPO):** In GRS and RA-GRS, the storage service asynchronously geo-replicates the data from the primary to the secondary location. In the event of a major regional disaster in the primary region, Microsoft performs a failover to the secondary region. If a failover happens, recent changes that have not yet been geo-replicated may be lost. The number of minutes of potential data lost is referred to as the RPO, and it indicates the point in time to which data can be recovered. Azure Storage typically has an RPO of less than 15 minutes, although there is currently no SLA on how long geo-replication takes.

**Recovery Time Objective (RTO):** The RTO is a measure of how long it takes to perform the failover and get the storage account back online. The time to perform the failover includes the following actions:

   * The time Microsoft requires to determine whether the data can be recovered at the primary location, or if a failover is necessary.
   * The time to perform the failover of the storage account by changing the primary DNS entries to point to the secondary location.

   Microsoft takes the responsibility of preserving your data seriously. If there is any chance of recovering the data in the primary region, Microsoft will delay the failover and focus on recovering your data. A future version of the service will allow you to trigger a failover at an account level so that you can control the RTO yourself.

## Paired Regions 

When you create a storage account, you select the primary region for the account. The paired secondary region is determined based on the primary region, and cannot be changed. For up-to-date information about regions supported by Azure, see [Business continuity and disaster recovery (BCDR): Azure Paired Regions](../articles/best-practices-availability-paired-regions.md).
