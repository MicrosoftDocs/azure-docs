---
title: Geo-redundant storage (GRS) for cross-regional durability in Azure Storage | Microsoft Docs
description: Geo-redundant storage (GRS) replicates your data between two regions that are hundreds of miles apart. GRS protects against hardware failures in the datacenter as well as regional disasters.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 10/20/2018
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Geo-redundant storage (GRS): Cross-regional replication for Azure Storage
[!INCLUDE [storage-common-redundancy-GRS](../../../includes/storage-common-redundancy-grs.md)]

## Read-access geo-redundant storage
Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account. RA-GRS provides read-only access to the data in the secondary location, in addition to geo-replication across two regions.

When you enable read-only access to your data in the secondary region, your data is available on a secondary endpoint as well as on the primary endpoint for your storage account. The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

Some considerations to keep in mind when using RA-GRS:

* Your application has to manage which endpoint it is interacting with when using RA-GRS.
* Since asynchronous replication involves a delay, changes that haven't yet been replicated to the secondary region may be lost if data can't be recovered from the primary region.
* You can check the Last Sync Time of your storage account. Last Sync Time is a GMT date/time value. All primary writes before the Last Sync Time have been successfully written to the secondary location, meaning that they are available to be read from the secondary location. Primary writes after the Last Sync Time may or may not be available for reads yet. You can query this value using the [Azure portal](https://portal.azure.com/), [Azure PowerShell](storage-powershell-guide-full.md), or from one of the Azure Storage client libraries.
* If you initiate an account failover (preview) of a GRS or RA-GRS account to the secondary region, write access to that account is restored after the failover has completed. For more information, see [Disaster recovery and storage account failover (preview)](storage-disaster-recovery-guidance.md).
* RA-GRS is intended for high-availability purposes. For scalability guidance, review the [performance checklist](storage-performance-checklist.md).
* For suggestions on how to design for high availability with RA-GRS, see [Designing Highly Available Applications using RA-GRS storage](storage-designing-ha-apps-with-ragrs.md).

## What is the RPO and RTO with GRS?

**Recovery Point Objective (RPO):** In GRS and RA-GRS, the storage service asynchronously geo-replicates the data from the primary to the secondary location. In the event that the primary region becomes unavailable, you can perform an account failover (preview) to the secondary region. When you initiate a failover, recent changes that haven't yet been geo-replicated may be lost. The number of minutes of potential data that's lost is known as the RPO. The RPO indicates the point in time to which data can be recovered. Azure Storage typically has an RPO of less than 15 minutes, although there's currently no SLA on how long geo-replication takes.

**Recovery Time Objective (RTO):** The RTO is a measure of how long it takes to perform the failover and get the storage account back online. The time to perform the failover includes the following actions:

   * The time until the customer initiates the failover of the storage account from the primary to the secondary region.
   * The time required by Azure to perform the failover by changing the primary DNS entries to point to the secondary location.

## Paired regions 
When you create a storage account, you select the primary region for the account. The paired secondary region is determined based on the primary region, and can't be changed. For up-to-date information about regions supported by Azure, see [Business continuity and disaster recovery (BCDR): Azure paired regions](../../best-practices-availability-paired-regions.md).

## See also
- [Azure Storage replication](storage-redundancy.md)
- [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](storage-redundancy-lrs.md)
- [Zone-redundant storage (ZRS): Highly available Azure Storage applications](storage-redundancy-zrs.md)
