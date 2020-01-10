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

Azure Storage always stores multiple copies of your data to ensure durability and high availability. Azure Storage copies your data so that it is protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets the [Service-Level Agreement (SLA) for Storage](https://azure.microsoft.com/support/legal/sla/storage/) even in the face of failures.

Azure Storage regularly verifies the integrity of data stored using cyclic redundancy checks (CRCs). If data corruption is detected, it is repaired using redundant data. Azure Storage also calculates checksums on all network traffic to detect corruption of data packets when storing or retrieving data.

## Redundancy in the primary region

Data in an Azure Storage account is always replicated three times in the primary region. Azure Storage offers two options for how your data is replicated in the primary region:

- **Locally redundant storage (LRS)** copies your data synchronously three times within a single physical location in the primary region. LRS is the least expensive replication option, but is not recommended for applications requiring high availability.
- **Zone-redundant storage (ZRS)** copies your data synchronously across three Azure availability zones in the primary region. For applications requiring high availability, Microsoft recommends using ZRS in the primary region, and also replicating to a secondary region.

### Locally-redundant storage

[!INCLUDE [storage-common-redundancy-LRS](../../../includes/storage-common-redundancy-lrs.md)]

### Zone-redundant storage

[!INCLUDE [storage-common-redundancy-ZRS](../../../includes/storage-common-redundancy-zrs.md)]

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

If the primary region becomes unavailable, you can choose to failover to the secondary region (preview). After the failover has completed, the secondary region becomes the primary region, and you can again read and write data. For more information on disaster recovery and to learn how to fail over to the secondary region, see [Disaster recovery and account failover (preview)](storage-disaster-recovery-guidance.md).

### Geo-redundant storage

[!INCLUDE [storage-common-redundancy-grs](../../../includes/storage-common-redundancy-grs.md)]

### Geo-zone-redundant storage (preview)

Geo-zone-redundant storage (GZRS) (preview) combines the high availability provided by ZRS with protection from regional outages as provided by GRS. Data in a GZRS storage account is replicated across three [Azure availability zones](../../availability-zones/az-overview.md) in the primary region and also replicated to a secondary geographic region for protection from regional disasters. Each Azure region is paired with another region within the same geography, together making a regional pair.

With a GZRS storage account, you can continue to read and write data if an availability zone becomes unavailable or is unrecoverable. Additionally, your data is also durable in the case of a complete regional outage or a disaster in which the primary region isn’t recoverable. GZRS is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year.

Microsoft recommends using GZRS for applications requiring consistency, durability, high availability, excellent performance, and resilience for disaster recovery. For the additional security of read access to the secondary region in the event of a regional disaster, enable RA-GZRS for your storage account.

## Read access to data in the secondary region

Both GRS and GZRS replicate your data to another physical location in the secondary region, but that data is available to be read only if the customer or Microsoft initiates a failover from the primary to secondary region. For read access to the secondary region, enable read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS).

If your storage account is configured for read access to the secondary region, then you can design your applications to seamlessly shift to reading data from the secondary region if the primary region becomes unavailable for any reason. You do not need to wait until Microsoft initiates a failover from the primary to secondary region. For more information about how to design your applications for high availabiilty, see [Designing highly available applications using read-access geo-redundant storage](storage-designing-ha-apps-with-ragrs.md).

You can optionally enable read access to data in the secondary region with read-access geo-zone-redundant storage (RA-GZRS) if your applications need to be able to read data in the event of a disaster in the primary region.

## Summary of redundancy configurations

When you create a storage account, you can select one of the following redundancy configurations:

[!INCLUDE [azure-storage-redundancy](../../../includes/azure-storage-redundancy.md)]

The following table provides a quick overview of the scope of durability and availability that each redundancy configuration will provide you for a given type of event (or event of similar impact).

| Scenario                                                                                                 | LRS                             | ZRS                              | GRS/RA-GRS                                  | GZRS/RA-GZRS (preview)                              |
| :------------------------------------------------------------------------------------------------------- | :------------------------------ | :------------------------------- | :----------------------------------- | :----------------------------------- |
| A node within a data center becomes unavailable                                                                 | Yes                             | Yes                              | Yes                                  | Yes                                  |
| An entire data center (zonal or non-zonal) becomes unavailable                                           | No                              | Yes                              | Yes                                  | Yes                                  |
| A region-wide outage occurs                                                                                     | No                              | No                               | Yes                                  | Yes                                  |
| Read access to data in the secondary region | No                              | No                               | Yes (with RA-GRS)                                   | Yes (with RA-GZRS)                                 |
| Designed to provide \_\_ durability of objects over a given year<sup>1</sup>                                          | at least 99.999999999% (11 9's) | at least 99.9999999999% (12 9's) | at least 99.99999999999999% (16 9's) | at least 99.99999999999999% (16 9's) |
| Supported storage account types<sup>2</sup>                                                                   | GPv2, GPv1, BlockBlobStorage, BlobStorage, FileStorage                | GPv2, BlockBlobStorage, FileStorage                             | GPv2, GPv1, BlobStorage                     | GPv2                     |
| Availability SLA for read requests<sup>1</sup>  | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) for GRS<br /><br />At least 99.99% (99.9% for cool access tier) for RA-GRS | At least 99.9% (99% for cool access tier) for GZRS<br /><br />At least 99.99% (99.9% for cool access tier) for RA-GZRS |
| Availability SLA for write requests<sup>1</sup>  | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) | At least 99.9% (99% for cool access tier) |

<sup>1</sup> For information about Azure Storage guarantees for durability and availability, see the [Azure Storage SLA](https://azure.microsoft.com/support/legal/sla/storage/).

<sup>2</sup> For information for storage account types, see [Storage account overview](storage-account-overview.md).

All data for all types of storage accounts are copied according to the redundancy configuration for the storage account. Objects including block blobs, append blobs, page blobs, queues, tables, and files are copied.

For pricing information for each redundancy configuration, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).

> [!NOTE]
> Azure Premium Disk Storage currently supports only locally redundant storage (LRS). Block blob storage accounts support locally redundant storage (LRS) and zone redundant storage (ZRS) in certain regions.

## See also

- [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](storage-redundancy-lrs.md)
- [Zone-redundant storage (ZRS): Highly available Azure Storage applications](storage-redundancy-zrs.md)
- [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy-grs.md)
- [Geo-zone-redundant storage (GZRS) for highly availability and maximum durability (preview)](storage-redundancy-gzrs.md)
- [Designing highly available applications using RA-GRS Storage](../storage-designing-ha-apps-with-ragrs.md)
