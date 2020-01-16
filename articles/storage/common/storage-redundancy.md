---
title: Data redundancy 
titleSuffix: Azure Storage
description: Data in your Microsoft Azure Storage account is replicated for durability and high availability. Redundancy configurations include locally redundant storage (LRS), zone-redundant storage (ZRS), geo-redundant storage (GRS), read-access geo-redundant storage (RA-GRS), geo-zone-redundant storage (GZRS) (preview), and read-access geo-zone-redundant storage (RA-GZRS) (preview).
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 01/06/2019
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Azure Storage redundancy

Azure Storage always stores multiple copies of your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures.

Azure Storage regularly verifies the integrity of data stored using cyclic redundancy checks (CRCs). If data corruption is detected, it is repaired using redundant data. Azure Storage also calculates checksums on all network traffic to detect corruption of data packets when storing or retrieving data.

## Redundancy in the primary region

Data in an Azure Storage account is always replicated three times in the primary region. Azure Storage offers two options for how your data is replicated in the primary region:

- **Locally redundant storage (LRS)** copies your data synchronously three times within a single physical location in the primary region. LRS is the least expensive replication option, but is not recommended for applications requiring high availability.
- **Zone-redundant storage (ZRS)** copies your data synchronously across three Azure availability zones in the primary region. For applications requiring high availability, Microsoft recommends using ZRS in the primary region, and also replicating to a secondary region.

### Locally-redundant storage

Locally redundant storage (LRS) replicates your data three times within a single physical location in the primary region. LRS provides at least 99.999999999% (11 nines) durability of objects over a given year.

LRS is the lowest-cost redundancy option and offers the least durability compared to other options. If a disaster such as fire or flooding occurs within the data center, all replicas of a storage account using LRS may be lost or unrecoverable. To mitigate this risk, Microsoft recommends using zone-redundant storage (ZRS), geo-redundant storage (GRS), or geo-zone-redundant storage (GZRS).

A write request to a storage account that is using LRS happens synchronously. The write operation returns successfully only after the data is written to all three replicas.

You may wish to use LRS in the following scenarios:

- If your application stores data that can be easily reconstructed if data loss occurs, you may opt for LRS.
- If your application is restricted to replicating data only within a country or region due to data governance requirements, you may opt for LRS. In some cases, the paired regions across which the data is geo-replicated may be in another country or region. For more information on paired regions, see [Azure regions](https://azure.microsoft.com/regions/).

### Zone-redundant storage

Zone-redundant storage (ZRS) replicates your Azure Storage data synchronously across three Azure availability zones in the primary region. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS offers durability for Azure Storage data objects of at least 99.9999999999% (12 9's) over a given year.

A write request to a storage account that is using ZRS happens synchronously. The write operation returns successfully only after the data is written to all replicas across the three availability zones.

With ZRS, your data is still accessible for both read and write operations even if a zone becomes unavailable. If a zone becomes unavailable, Azure undertakes networking updates, such as DNS re-pointing. These updates may affect your application if you access data before the updates have completed. When designing applications for ZRS, follow practices for transient fault handling, including implementing retry policies with exponential back-off.

Microsoft recommends using ZRS in the primary region for scenarios that require consistency, durability, and high availability. ZRS provides excellent performance, low latency, and resiliency for your data if it becomes temporarily unavailable. However, ZRS by itself may not protect your data against a regional disaster where multiple zones are permanently affected. For protection against regional disasters, Microsoft recommends using geo-zone-redundant storage (GZRS), which uses ZRS in the primary region and also geo-replicates your data to a secondary region.

The following table shows which types of storage accounts support ZRS in which regions:

|    Storage account type    |    Supported regions    |    Supported services    |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
|    General-purpose v2<sup>1</sup>    | Asia Southeast<br /> Europe North<br />  Europe West<br /> France Central<br /> Japan East<br /> UK South<br /> US Central<br /> US East<br /> US East 2<br /> US West 2    |    Block blobs<br /> Page blobs (except for unmanaged disks)<sup>2</sup><br /> File shares (standard)<br /> Tables<br /> Queues<br /> |
|    BlockBlobStorage<sup>1</sup>    | Europe West<br /> US East    |    Block blobs only    |
|    FileStorage    | Europe West<br /> US East    |    Azure Files only    |

For information about which regions support ZRS, see **Services support by region**  in [What are Azure Availability Zones?](../articles/availability-zones/az-overview.md).

<sup>1</sup> The archive tier is not currently supported for ZRS accounts.
<sup>2</sup> Managed disks do not support ZRS. For more information, see [Pricing for Azure managed disks](/pricing/details/managed-disks/).

## Redundancy in a secondary region

For applications requiring high availability, you can choose to additionally copy the data in your storage account to a secondary region that is hundreds of miles away from the primary region. If your storage account is copied to a secondary region, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region isn't recoverable.

When you create a storage account, you select the primary region for the account. The paired secondary region is determined based on the primary region, and can't be changed. For up-to-date information about regions supported by Azure, see [Business continuity and disaster recovery (BCDR): Azure paired regions](../../best-practices-availability-paired-regions.md).

Azure Storage offers two options for copying your data to a secondary region:

- **Geo-redundant storage (GRS)** copies your data synchronously three times within a single physical location in the primary region using LRS. It then copies your data asynchronously to a single physical location in the secondary region.
- **Geo-zone-redundant storage (GZRS)** (preview) copies your data synchronously across three Azure availability zones in the primary region using ZRS. It then copies your data asynchronously to a single physical location in the secondary region.

The primary difference between GRS and GZRS is how data is replicated in the primary region. Within the secondary location, data is always replicated synchronously three times using LRS.

> [!IMPORTANT]
> Asynchronous replication involves a delay from the time that data is written to the primary region, to when it is replicated to the secondary region. In the event of a regional disaster, changes that haven't yet been replicated to the secondary region may be lost if that data can't be recovered from the primary region.

With GRS or GZRS, the data in the secondary location isn't available for read or write access unless there is a failover to the secondary region. For read access to the secondary location, configure your storage account to use read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). For more information, see [Read access to data in the secondary region](#read-access-to-data-in-the-secondary-region).

If the primary region becomes unavailable, you can choose to fail over to the secondary region (preview). After the failover has completed, the secondary region becomes the primary region, and you can again read and write data. For more information on disaster recovery and to learn how to fail over to the secondary region, see [Disaster recovery and account failover (preview)](storage-disaster-recovery-guidance.md).

### Geo-redundant storage

Geo-redundant storage (GRS) copies your data synchronously three times within a single physical location in the primary region using LRS. It then copies your data asynchronously to a single physical location in a secondary region that is hundreds of miles away from the primary region. GRS offers durability for Azure Storage data objects of at least 99.99999999999999% (16 9's) over a given year.

A write operation is first committed to the primary location and replicated using LRS. The update is then replicated asynchronously to the secondary region. When data is written to the secondary location, it's also replicated within that location using LRS.

### Geo-zone-redundant storage (preview)

Geo-zone-redundant storage (GZRS) (preview) combines the high availability provided by redundancy across availability zones with protection from regional outages provided by geo-replication. Data in a GZRS storage account is copied across three [Azure availability zones](../../availability-zones/az-overview.md) in the primary region and is also replicated to a secondary geographic region for protection from regional disasters.

With a GZRS storage account, you can continue to read and write data if an availability zone becomes unavailable or is unrecoverable. Additionally, your data is also durable in the case of a complete regional outage or a disaster in which the primary region isn’t recoverable. GZRS is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year.

Microsoft recommends using GZRS for applications requiring maximum consistency, durability, and availability, excellent performance, and resilience for disaster recovery. For the additional security of read access to the secondary region in the event of a regional disaster, enable RA-GZRS for your storage account.

### About the preview

Only general-purpose v2 storage accounts support GZRS and RA-GZRS. For more information about storage account types, see [Azure storage account overview](storage-account-overview.md). GZRS and RA-GZRS support block blobs, page blobs (that are not VHD disks), files, tables, and queues.

GZRS and RA-GZRS are currently available for preview in the following regions:

- Asia Southeast
- Europe North
- Europe West
- UK South
- US East
- US East 2
- US Central

Microsoft continues to enable GZRS and RA-GZRS in additional Azure regions. Check the [Azure Service Updates](https://azure.microsoft.com/updates/) page regularly for information about supported regions.

For information on preview pricing, refer to GZRS preview pricing for [Blobs](https://azure.microsoft.com/pricing/details/storage/blobs), [Files](https://azure.microsoft.com/pricing/details/storage/files/), [Queues](https://azure.microsoft.com/pricing/details/storage/queues/), and [Tables](https://azure.microsoft.com/pricing/details/storage/tables/).

> [!IMPORTANT]
> Microsoft recommends against using preview features for production workloads.

## How GZRS and RA-GZRS work

When data is written to a storage account with GZRS or RA-GZRS enabled, that data is first replicated synchronously in the primary region across three availability zones. The data is then replicated asynchronously to a second region that is hundreds of miles away. When the data is written to the secondary region, it's further replicated synchronously three times within that region using [locally redundant storage (LRS)](storage-redundancy-lrs.md).

> [!IMPORTANT]
> Asynchronous replication involves a delay between the time that data is written to the primary region and when it is replicated to the secondary region. In the event of a regional disaster, changes that haven't yet been replicated to the secondary region may be lost if that data can't be recovered from the primary region.

When you create a storage account, you specify how data in that account is to be replicated, and you also specify the primary region for that account. The paired secondary region for a geo-replicated account is determined based on the primary region and can't be changed. For up-to-date information about regions supported by Azure, see [Business continuity and disaster recovery (BCDR): Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). For information about creating a storage account using GZRS or RA-GZRS, see [Create a storage account](storage-account-create.md).

### Use RA-GZRS for high availability

When you enable RA-GZRS for your storage account, your data can be read from the secondary endpoint as well as from the primary endpoint for your storage account. The secondary endpoint appends the suffix *–secondary* to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The access keys for your storage account are the same for both the primary and secondary endpoints.

To take advantage of RA-GZRS in the event of a regional outage, you must design your application in advance to handle this scenario. Your application should read from and write to the primary endpoint, but switch to using the secondary endpoint in the event that the primary region becomes unavailable. For guidance on designing for high availability with RA-GZRS, see [Designing Highly Available Applications using RA-GZRS or RA-GRS](https://docs.microsoft.com/azure/storage/common/storage-designing-ha-apps-with-ragrs).

Because data is replicated to the secondary region asynchronously, the secondary region is often behind the primary region. To determine which write operations have been replicated to the secondary region, your application check the last sync time for your storage account. All write operations written to the primary region prior to the last sync time have been successfully replicated to the secondary region, meaning that they are available to be read from the secondary. Any write operations written to the primary region after the last sync time may or may not have been replicated to the secondary region, meaning that they may not be available for read operations.

You can query the value of the **Last Sync Time** property using Azure PowerShell, Azure CLI, or one of the Azure Storage client libraries. The **Last Sync Time** property is a GMT date/time value.

For additional guidance on performance and scalability with RA-GZRS, see the [Microsoft Azure Storage performance and scalability checklist](storage-performance-checklist.md).

#### Availability zone outages

In the event of a failure affecting an availability zone in the primary region, your applications can seamlessly continue to read from and write to your storage account using the other availability zones for that region. Microsoft recommends that you continue to follow practices for transient fault handling when using GZRS or ZRS. These practices include implementing retry policies with exponential back-off.

When an availability zone becomes unavailable, Azure undertakes networking updates, such as DNS re-pointing. These updates may affect your application if you are accessing data before the updates have completed.

#### Regional outages

If a failure affects the entire primary region, then Microsoft will first attempt to restore the primary region. If restoration is not possible, then Microsoft will fail over to the secondary region, so that the secondary region becomes the new primary region. If the storage account has RA-GZRS enabled, then applications designed for this scenario can read from the secondary region while waiting for failover. If the storage account does not have RA-GZRS enabled, then applications will not be able to read from the secondary until the failover is complete.

> [!NOTE]
> GZRS and RA-GZRS are currently in preview in the US East region only. Customer-managed account failover (preview) is not yet available in US East 2, so customers cannot currently manage account failover events with GZRS and RA-GZRS accounts. During the preview, Microsoft will manage any failover events affecting GZRS and RA-GZRS accounts.

Because data is replicated to the secondary region asynchronously, a failure that affects the primary region may result in data loss if the primary region cannot be recovered. The interval between the most recent writes to the primary region and the last write to the secondary region is known as the recovery point objective (RPO). The RPO indicates the point in time to which data can be recovered. Azure Storage typically has an RPO of less than 15 minutes, although there's currently no SLA on how long it takes to replicate data to the secondary region.

The recovery time objective (RTO)  is a measure of how long it takes to perform the failover and get the storage account back online. This measure indicates the time required by Azure to perform the failover by changing the primary DNS entries to point to the secondary location.



## Read access to data in the secondary region

Both GRS and GZRS replicate your data to another physical location in the secondary region, but that data is available to be read only if the customer or Microsoft initiates a failover from the primary to secondary region. For read access to the secondary region, enable read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS).

If your storage account is configured for read access to the secondary region, then you can design your applications to seamlessly shift to reading data from the secondary region if the primary region becomes unavailable for any reason. The secondary region is always available for read access, so you can test your application to make sure that it will read from the secondary in the event of an outage. For more information about how to design your applications for high availability, see [Designing highly available applications using read-access geo-redundant storage](storage-designing-ha-apps-with-ragrs.md).

You can optionally enable read access to data in the secondary region with read-access geo-zone-redundant storage (RA-GZRS) if your applications need to be able to read data in the event of a disaster in the primary region.

The secondary endpoint is similar to the primary endpoint, but appends the suffix `–secondary` to the account name. For example, if your primary endpoint for the Blob service is `myaccount.blob.core.windows.net`, then your secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The account access keys for your storage account are the same for both the primary and secondary endpoints.

## Summary of redundancy options

The following table shows how durable and available your data is in a given scenario, depending on which type of redundancy is in effect for your storage account:

| Scenario                                                                                                 | LRS                             | ZRS                              | GRS/RA-GRS                                  | GZRS/RA-GZRS (preview)                              |
| :------------------------------------------------------------------------------------------------------- | :------------------------------ | :------------------------------- | :----------------------------------- | :----------------------------------- |
| A node within a data center becomes unavailable                                                                 | Yes                             | Yes                              | Yes                                  | Yes                                  |
| An entire data center (zonal or non-zonal) becomes unavailable                                           | No                              | Yes                              | Yes                                  | Yes                                  |
| A region-wide outage occurs                                                                                     | No                              | No                               | Yes                                  | Yes                                  |
| Read access to data in the secondary region if the primary region becomes unavailable | No                              | No                               | Yes (with RA-GRS)                                   | Yes (with RA-GZRS)                                 |
| Percent durability of objects over a given year<sup>1</sup>                                          | at least 99.999999999% (11 9's) | at least 99.9999999999% (12 9's) | at least 99.99999999999999% (16 9's) | at least 99.99999999999999% (16 9's) |
| Supported storage account types<sup>2</sup>                                                                   | GPv2, GPv1, BlockBlobStorage, BlobStorage, FileStorage                | GPv2, BlockBlobStorage, FileStorage                             | GPv2, GPv1, BlobStorage                     | GPv2                     |
| Availability SLA for read requests<sup>1</sup>  | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) for GRS<br /><br />At least 99.99% (99.9% for cool access tier) for RA-GRS | At least 99.9% (99% for cool access tier) for GZRS<br /><br />At least 99.99% (99.9% for cool access tier) for RA-GZRS |
| Availability SLA for write requests<sup>1</sup>  | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) |

<sup>1</sup> For information about Azure Storage guarantees for durability and availability, see the [Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/).

<sup>2</sup> For information for storage account types, see [Storage account overview](storage-account-overview.md).

All data for all types of storage accounts are copied according to the redundancy option for the storage account. Objects including block blobs, append blobs, page blobs, queues, tables, and files are copied.

For pricing information for each redundancy option, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

> [!NOTE]
> Azure Premium Disk Storage currently supports only locally redundant storage (LRS). Block blob storage accounts support locally redundant storage (LRS) and zone redundant storage (ZRS) in certain regions.

## See also

- [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](storage-redundancy-lrs.md)
- [Zone-redundant storage (ZRS): Highly available Azure Storage applications](storage-redundancy-zrs.md)
- [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy-grs.md)
- [Geo-zone-redundant storage (GZRS) for highly availability and maximum durability (preview)](storage-redundancy-gzrs.md)
- [Designing highly available applications using RA-GRS Storage](../storage-designing-ha-apps-with-ragrs.md)
