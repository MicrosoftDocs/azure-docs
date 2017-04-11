---
title: Data replication in Azure Storage | Microsoft Docs
description: Data in your Microsoft Azure storage account is replicated for durability and high availability. Replication options include locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), and read-access geo-redundant storage (RA-GRS).
services: storage
documentationcenter: ''
author: mmacy
manager: timlt
editor: tysonn

ms.assetid: 86bdb6d4-da59-4337-8375-2527b6bdf73f
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: marsma

---
# Azure Storage replication
The data in your Microsoft Azure storage account is always replicated to ensure durability and high availability. Replication copies your data, either within the same data center, or to a second data center, depending on which replication option you choose. Replication protects your data and preserves your application up-time in the event of transient hardware failures. If your data is replicated to a second data center, that also protects your data against a catastrophic failure in the primary location.

Replication ensures that your storage account meets the [Service-Level Agreement (SLA) for Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures. See the SLA for information about Azure Storage guarantees for durability and availability.

When you create a storage account, you can select one of the following replication options:

* [Locally redundant storage (LRS)](#locally-redundant-storage)
* [Zone-redundant storage (ZRS)](#zone-redundant-storage)
* [Geo-redundant storage (GRS)](#geo-redundant-storage)
* [Read-access geo-redundant storage (RA-GRS)](#read-access-geo-redundant-storage)

Read-access geo-redundant storage (RA-GRS) is the default option when you create a new storage account.

The following table provides a quick overview of the differences between LRS, ZRS, GRS, and RA-GRS, while subsequent sections address each type of replication in more detail.

| Replication strategy | LRS | ZRS | GRS | RA-GRS |
|:--- |:--- |:--- |:--- |:--- |
| Data is replicated across multiple datacenters. |No |Yes |Yes |Yes |
| Data can be read from the secondary location as well as from the primary location. |No |No |No |Yes |
| Number of copies of data maintained on separate nodes. |3 |3 |6 |6 |

See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for pricing information for the different redundancy options.

> [!NOTE]
> Premium Storage supports only locally redundant storage (LRS). For information about Premium Storage, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md).
>
>

## Locally redundant storage
Locally redundant storage (LRS) replicates your data three times within a storage scale unit which is hosted in a datacenter in the region in which you created your storage account. A write request returns successfully only once it has been written to all three replicas. These three replicas each reside in separate fault domains and upgrade domains within one storage scale unit.

A storage scale unit is a collection of racks of storage nodes. A fault domain (FD) is a group of nodes that represent a physical unit of failure and can be considered as nodes belonging to the same physical rack. An upgrade domain (UD) is a group of nodes that are upgraded together during the process of a service upgrade (rollout). The three replicas are spread across UDs and FDs within one storage scale unit to ensure that data is available even if hardware failure impacts a single rack or when nodes are upgraded during a rollout.

LRS is the lowest cost option and offers least durability compared to other options. In the event of a datacenter level disaster (fire, flooding etc.) all three replicas might be lost or unrecoverable. To mitigate this risk Geo Redundant Storage (GRS) is recommended for most applications.

Locally redundant storage may still be desirable in certain scenarios:

* Provides highest maximum bandwidth of Azure Storage replication options.
* If your application stores data that can be easily reconstructed, you may opt for LRS.
* Some applications are restricted to replicating data only within a country due to data governance requirements. A paired region could be in another country; please see [Azure regions](https://azure.microsoft.com/regions/) for information on region pairs.

## Zone-redundant storage
Zone-redundant storage (ZRS) replicates your data asynchronously across datacenters within one or two regions in addition to storing three replicas similar to LRS, thus providing higher durability than LRS. Data stored in ZRS is durable even if the primary datacenter is unavailable or unrecoverable.
Customers who plan to use ZRS should be aware that:

* ZRS is only available for block blobs in general purpose storage accounts, and is supported only in storage service versions 2014-02-14 and later.
* Since asynchronous replication involves a delay, in the event of a local disaster it is possible that changes that have not yet been replicated to the secondary will be lost if the data cannot be recovered from the primary.
* The replica may not be available until Microsoft initiates failover to the secondary.
* ZRS accounts cannot be converted later to LRS or GRS. Similarly, an existing LRS or GRS account cannot be converted to a ZRS account.
* ZRS accounts do not have metrics or logging capability.

## Geo-redundant storage
Geo-redundant storage (GRS) replicates your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region is not recoverable.

For a storage account with GRS enabled, an update is first committed to the primary region, where it is replicated three times. Then the update is replicated asynchronously to the secondary region, where it is also replicated three times.

With GRS, both the primary and secondary regions manage replicas across separate fault domains and upgrade domains within a storage scale unit as described with LRS.

Considerations:

* Since asynchronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region will be lost if the data cannot be recovered from the primary region.
* The replica is not available unless Microsoft initiates failover to the secondary region. If Microsoft does initiate a failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, please see [Disaster Recovery Guidance](storage-disaster-recovery-guidance.md). 
* If an application wants to read from the secondary region, the user should enable RA-GRS.

When you create a storage account, you select the primary region for the account. The secondary region is determined based on the primary region, and cannot be changed. The following table shows the primary and secondary region pairings.

| Primary | Secondary |
| --- | --- |
| North Central US |South Central US |
| South Central US |North Central US |
| East US |West US |
| West US |East US |
| US East 2 |Central US |
| Central US |US East 2 |
| North Europe |West Europe |
| West Europe |North Europe |
| South East Asia |East Asia |
| East Asia |South East Asia |
| East China |North China |
| North China |East China |
| Japan East |Japan West |
| Japan West |Japan East |
| Brazil South |South Central US |
| Australia East |Australia Southeast |
| Australia Southeast |Australia East |
| India South |India Central |
| India Central |India South |
| India West |India South |
| US Gov Iowa |US Gov Virginia |
| US Gov Virginia |US Gov Iowa |
| Canada Central |Canada East |
| Canada East |Canada Central |
| UK West |UK South |
| UK South |UK West |
| Germany Central |Germany Northeast |
| Germany Northeast |Germany Central |
| West US 2 |West Central US |
| West Central US |West US 2 |

For up-to-date information about regions supported by Azure, see [Azure Regions](https://azure.microsoft.com/regions/).

## Read-access geo-redundant storage
Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account, by providing read-only access to the data in the secondary location, in addition to the replication across two regions provided by GRS.

When you enable read-only access to your data in the secondary region, your data is available on a secondary endpoint, in addition to the primary endpoint for your storage account. The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

Considerations:

* Your application has to manage which endpoint it is interacting with when using RA-GRS.
* Since asynchronous replication involves a delay, in the event of a regional disaster it is possible that changes that have not yet been replicated to the secondary region will be lost if the data cannot be recovered from the primary region.
* If Microsoft initiates failover to the secondary region, you will have read and write access to that data after the failover has completed. For more information, please see [Disaster Recovery Guidance](storage-disaster-recovery-guidance.md). 
* RA-GRS is intended for high-availability purposes. For scalability guidance, please review the [performance checklist](storage-performance-checklist.md).

## Next steps
* [Designing Highly Available Applications using RA-GRS Storage](storage-designing-ha-apps-with-ragrs.md)
* [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/)
* [About Azure storage accounts](storage-create-storage-account.md)
* [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md)
* [Microsoft Azure Storage Redundancy Options and Read Access Geo Redundant Storage ](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/12/11/introducing-read-access-geo-replicated-storage-ra-grs-for-windows-azure-storage.aspx)
* [SOSP Paper - Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)

