---
title: Data redundancy 
titleSuffix: Azure Storage
description: Understand data redundancy in Azure Storage. Data in your Microsoft Azure Storage account is replicated for durability and high availability.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: conceptual
ms.date: 09/06/2023
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: references_regions, engagement
---

# Azure Storage redundancy

Azure Storage always stores multiple copies of your data so that it's protected from planned and unplanned events, including transient hardware failures, network or power outages, and massive natural disasters. Redundancy ensures that your storage account meets its availability and durability targets even in the face of failures.

When deciding which redundancy option is best for your scenario, consider the tradeoffs between lower costs and higher availability. The factors that help determine which redundancy option you should choose include:

- How your data is replicated within the primary region.
- Whether your data is replicated to a second region that is geographically distant to the primary region, to protect against regional disasters (geo-replication).
- Whether your application requires read access to the replicated data in the secondary region if the primary region becomes unavailable for any reason (geo-replication with read access).

> [!NOTE]
> The features and regional availability described in this article are also available to accounts that have a hierarchical namespace (Azure Blob storage).

The services that comprise Azure Storage are managed through a common Azure resource called a *storage account*. The storage account represents a shared pool of storage that can be used to deploy storage resources such as blob containers (Blob Storage), file shares (Azure Files), tables (Table Storage), or queues (Queue Storage). For more information about Azure Storage accounts, see [Storage account overview](storage-account-overview.md).

The redundancy setting for a storage account is shared for all storage services exposed by that account. All storage resources deployed in the same storage account have the same redundancy setting. You may want to isolate different types of resources in separate storage accounts if they have different redundancy requirements.

## Redundancy in the primary region

Data in an Azure Storage account is always replicated three times in the primary region. Azure Storage offers two options for how your data is replicated in the primary region:

- **Locally redundant storage (LRS)** copies your data synchronously three times within a single physical location in the primary region. LRS is the least expensive replication option, but isn't recommended for applications requiring high availability or durability.
- **Zone-redundant storage (ZRS)** copies your data synchronously across three Azure availability zones in the primary region. For applications requiring high availability, Microsoft recommends using ZRS in the primary region, and also replicating to a secondary region.

> [!NOTE]  
> Microsoft recommends using ZRS in the primary region for Azure Data Lake Storage Gen2 workloads.

### Locally redundant storage

Locally redundant storage (LRS) replicates your storage account three times within a single data center in the primary region. LRS provides at least 99.999999999% (11 nines) durability of objects over a given year.

LRS is the lowest-cost redundancy option and offers the least durability compared to other options. LRS protects your data against server rack and drive failures. However, if a disaster such as fire or flooding occurs within the data center, all replicas of a storage account using LRS may be lost or unrecoverable. To mitigate this risk, Microsoft recommends using [zone-redundant storage](#zone-redundant-storage) (ZRS), [geo-redundant storage](#geo-redundant-storage) (GRS), or [geo-zone-redundant storage](#geo-zone-redundant-storage) (GZRS).

A write request to a storage account that is using LRS happens synchronously. The write operation returns successfully only after the data is written to all three replicas.

The following diagram shows how your data is replicated within a single data center with LRS:

:::image type="content" source="media/storage-redundancy/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in a single data center with LRS":::

LRS is a good choice for the following scenarios:

- If your application stores data that can be easily reconstructed if data loss occurs, you may opt for LRS.
- If your application is restricted to replicating data only within a country or region due to data governance requirements, you may opt for LRS. In some cases, the paired regions across which the data is geo-replicated may be in another country or region. For more information on paired regions, see [Azure regions](https://azure.microsoft.com/regions/).
- If your scenario is using Azure unmanaged disks, you may opt for LRS. While it's possible to create a storage account for Azure unmanaged disks that uses GRS, it isn't recommended due to potential issues with consistency over asynchronous geo-replication.

### Zone-redundant storage

Zone-redundant storage (ZRS) replicates your storage account synchronously across three Azure availability zones in the primary region. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS offers durability for storage resources of at least 99.9999999999% (12 9's) over a given year.

With ZRS, your data is still accessible for both read and write operations even if a zone becomes unavailable. If a zone becomes unavailable, Azure undertakes networking updates, such as DNS repointing. These updates may affect your application if you access data before the updates have completed. When designing applications for ZRS, follow practices for transient fault handling, including implementing retry policies with exponential back-off.

A write request to a storage account that is using ZRS happens synchronously. The write operation returns successfully only after the data is written to all replicas across the three availability zones. If an availability zone is temporarily unavailable, the operation returns successfully after the data is written to all available zones.

Microsoft recommends using ZRS in the primary region for scenarios that require high availability. ZRS is also recommended for restricting replication of data to a particular country or region to meet data governance requirements.

Microsoft recommends using ZRS for Azure Files workloads. If a zone becomes unavailable, no remounting of Azure file shares from the connected clients is required.

The following diagram shows how your data is replicated across availability zones in the primary region with ZRS:

:::image type="content" source="media/storage-redundancy/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS":::

ZRS provides excellent performance, low latency, and resiliency for your data if it becomes temporarily unavailable. However, ZRS by itself may not protect your data against a regional disaster where multiple zones are permanently affected. For protection against regional disasters, Microsoft recommends using [geo-zone-redundant storage](#geo-zone-redundant-storage) (GZRS), which uses ZRS in the primary region and also geo-replicates your data to a secondary region.

The Archive tier for Blob Storage isn't currently supported for ZRS, GZRS, or RA-GZRS accounts. Unmanaged disks don't support ZRS or GZRS.

For more information about which regions support ZRS, see [Azure regions with availability zones](../../availability-zones/az-overview.md#azure-regions-with-availability-zones).

#### Standard storage accounts

ZRS is supported for all Azure Storage services through standard general-purpose v2 storage accounts, including:

- Azure Blob storage (hot and cool block blobs and append blobs, non-disk page blobs)
- Azure Files (all standard tiers: transaction optimized, hot, and cool)
- Azure Table storage
- Azure Queue storage

For a list of regions that support zone-redundant storage (ZRS) for standard accounts, see [Azure regions that support zone-redundant storage (ZRS) for standard storage accounts](redundancy-regions-zrs.md#standard-storage-accounts).

#### Premium block blob accounts

ZRS is supported for premium block blobs accounts. For more information about premium block blobs, see [Premium block blob storage accounts](../blobs/storage-blob-block-blob-premium.md).

For a list of regions that support zone-redundant storage (ZRS) for premium block blobs accounts, see [Azure regions that support zone-redundant storage (ZRS) for premium block blob accounts](redundancy-regions-zrs.md#premium-block-blob-accounts).

#### Premium file share accounts

ZRS is supported for premium file shares (Azure Files) through the `FileStorage` storage account kind.

For a list of regions that support zone-redundant storage (ZRS) for premium file share accounts, see [Azure Files zone-redundant storage for premium file shares](../files/redundancy-premium-file-shares.md).

#### Managed disks

ZRS is supported for managed disks with the following [limitations](../../virtual-machines/disks-redundancy.md#limitations).

For a list of regions that support zone-redundant storage (ZRS) for managed disks, see [regional availability](../../virtual-machines/disks-redundancy.md#regional-availability).

## Redundancy in a secondary region

For applications requiring high durability, you can choose to additionally copy the data in your storage account to a secondary region that is hundreds of miles away from the primary region. If your storage account is copied to a secondary region, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region isn't recoverable.

When you create a storage account, you select the primary region for the account. The paired secondary region is determined based on the primary region, and can't be changed. For more information about regions supported by Azure, see [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).

Azure Storage offers two options for copying your data to a secondary region:

- **Geo-redundant storage (GRS)** copies your data synchronously three times within a single physical location in the primary region using LRS. It then copies your data asynchronously to a single physical location in the secondary region. Within the secondary region, your data is copied synchronously three times using LRS.
- **Geo-zone-redundant storage (GZRS)** copies your data synchronously across three Azure availability zones in the primary region using ZRS. It then copies your data asynchronously to a single physical location in the secondary region. Within the secondary region, your data is copied synchronously three times using LRS.

> [!NOTE]
> The primary difference between GRS and GZRS is how data is replicated in the primary region. Within the secondary region, data is always replicated synchronously three times using LRS. LRS in the secondary region protects your data against hardware failures.

With GRS or GZRS, the data in the secondary region isn't available for read or write access unless there's a failover to the primary region. For read access to the secondary region, configure your storage account to use read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS). For more information, see [Read access to data in the secondary region](#read-access-to-data-in-the-secondary-region).

If the primary region becomes unavailable, you can choose to fail over to the secondary region. After the failover has completed, the secondary region becomes the primary region, and you can again read and write data. For more information on disaster recovery and to learn how to fail over to the secondary region, see [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md).

> [!IMPORTANT]
> Because data is replicated to the secondary region asynchronously, a failure that affects the primary region may result in data loss if the primary region cannot be recovered. The interval between the most recent writes to the primary region and the last write to the secondary region is known as the recovery point objective (RPO). The RPO indicates the point in time to which data can be recovered. The Azure Storage platform typically has an RPO of less than 15 minutes, although there's currently no SLA on how long it takes to replicate data to the secondary region.

### Geo-redundant storage

Geo-redundant storage (GRS) copies your data synchronously three times within a single physical location in the primary region using LRS. It then copies your data asynchronously to a single physical location in a secondary region that is hundreds of miles away from the primary region. GRS offers durability for storage resources of at least 99.99999999999999% (16 9's) over a given year.

A write operation is first committed to the primary location and replicated using LRS. The update is then replicated asynchronously to the secondary region. When data is written to the secondary location, it's also replicated within that location using LRS.

The following diagram shows how your data is replicated with GRS or RA-GRS:

:::image type="content" source="media/storage-redundancy/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS or RA-GRS":::

### Geo-zone-redundant storage

Geo-zone-redundant storage (GZRS) combines the high availability provided by redundancy across availability zones with protection from regional outages provided by geo-replication. Data in a GZRS storage account is copied across three [Azure availability zones](../../availability-zones/az-overview.md) in the primary region and is also replicated to a secondary geographic region for protection from regional disasters. Microsoft recommends using GZRS for applications requiring maximum consistency, durability, and availability, excellent performance, and resilience for disaster recovery.

With a GZRS storage account, you can continue to read and write data if an availability zone becomes unavailable or is unrecoverable. Additionally, your data is also durable in the case of a complete regional outage or a disaster in which the primary region isn't recoverable. GZRS is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year.

The following diagram shows how your data is replicated with GZRS or RA-GZRS:

:::image type="content" source="media/storage-redundancy/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS or RA-GZRS":::

Only standard general-purpose v2 storage accounts support GZRS. GZRS is supported by all of the Azure Storage services, including:

- Azure Blob storage (hot and cool block blobs, non-disk page blobs)
- Azure Files (all standard tiers: transaction optimized, hot, and cool)
- Azure Table storage
- Azure Queue storage

For a list of regions that support geo-zone-redundant storage (GZRS), see [Azure regions that support geo-zone-redundant storage (GZRS)](redundancy-regions-gzrs.md).

## Read access to data in the secondary region

Geo-redundant storage (with GRS or GZRS) replicates your data to another physical location in the secondary region to protect against regional outages. With an account configured for GRS or GZRS, data in the secondary region is not directly accessible to users or applications, unless a failover occurs. The failover process updates the DNS entry provided by Azure Storage so that the secondary endpoint becomes the new primary endpoint for your storage account. During the failover process, your data is inaccessible. After the failover is complete, you can read and write data to the new primary region. For more information, see [How customer-managed storage account failover works](storage-failover-customer-managed-unplanned.md).

If your applications require high availability, then you can configure your storage account for read access to the secondary region. When you enable read access to the secondary region, then your data is always available to be read from the secondary, including in a situation where the primary region becomes unavailable. Read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS) configurations permit read access to the secondary region.

> [!NOTE]
> Azure Files does not support read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS).

### Design your applications for read access to the secondary

If your storage account is configured for read access to the secondary region, then you can design your applications to seamlessly shift to reading data from the secondary region if the primary region becomes unavailable for any reason.

The secondary region is available for read access after you enable RA-GRS or RA-GZRS, so that you can test your application in advance to make sure that it will properly read from the secondary in the event of an outage. For more information about how to design your applications to take advantage of geo-redundancy, see [Use geo-redundancy to design highly available applications](geo-redundant-design.md).

When read access to the secondary is enabled, your application can be read from the secondary endpoint as well as from the primary endpoint. The secondary endpoint appends the suffix *–secondary* to the account name. For example, if your primary endpoint for Blob storage is `myaccount.blob.core.windows.net`, then the secondary endpoint is `myaccount-secondary.blob.core.windows.net`. The account access keys for your storage account are the same for both the primary and secondary endpoints.

#### Plan for data loss

Because data is replicated asynchronously from the primary to the secondary region, the secondary region is typically behind the primary region in terms of write operations. If a disaster were to strike the primary region, it's likely that some data would be lost and that files within a directory or container would not be consistent. For more information about how to plan for potential data loss, see [Data loss and inconsistencies](storage-disaster-recovery-guidance.md#anticipate-data-loss-and-inconsistencies).

## Summary of redundancy options

The tables in the following sections summarize the redundancy options available for Azure Storage.

### Durability and availability parameters

The following table describes key parameters for each redundancy option:

| Parameter | LRS | ZRS | GRS/RA-GRS | GZRS/RA-GZRS |
|:-|:-|:-|:-|:-|
| Percent durability of objects over a given year | at least 99.999999999% (11 9's) | at least 99.9999999999% (12 9's) | at least 99.99999999999999% (16 9's) | at least 99.99999999999999% (16 9's) |
| Availability for read requests | At least 99.9% (99% for Cool or Archive access tiers) | At least 99.9% (99% for Cool access tier) | At least 99.9% (99% for Cool or Archive access tiers) for GRS<br/><br/>At least 99.99% (99.9% for Cool or Archive access tiers) for RA-GRS | At least 99.9% (99% for Cool access tier) for GZRS<br/><br/>At least 99.99% (99.9% for Cool access tier) for RA-GZRS |
| Availability for write requests | At least 99.9% (99% for Cool or Archive access tiers) | At least 99.9% (99% for Cool access tier) | At least 99.9% (99% for Cool or Archive access tiers) | At least 99.9% (99% for Cool access tier) |
| Number of copies of data maintained on separate nodes | Three copies within a single region | Three copies across separate availability zones within a single region | Six copies total, including three in the primary region and three in the secondary region | Six copies total, including three across separate availability zones in the primary region and three locally redundant copies in the secondary region |

For more information, see the [SLA for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

### Durability and availability by outage scenario

The following table indicates whether your data is durable and available in a given scenario, depending on which type of redundancy is in effect for your storage account:

| Outage scenario | LRS | ZRS | GRS/RA-GRS | GZRS/RA-GZRS |
|:-|:-|:-|:-|:-|
| A node within a data center becomes unavailable | Yes | Yes | Yes | Yes |
| An entire data center (zonal or non-zonal) becomes unavailable | No | Yes | Yes<sup>1</sup> | Yes |
| A region-wide outage occurs in the primary region | No | No | Yes<sup>1</sup> | Yes<sup>1</sup> |
| Read access to the secondary region is available if the primary region becomes unavailable | No | No | Yes (with RA-GRS) | Yes (with RA-GZRS) |

<sup>1</sup> Account failover is required to restore write availability if the primary region becomes unavailable. For more information, see [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md).

### Supported Azure Storage services

The following table shows which redundancy options are supported by each Azure Storage service.

| Service | LRS | ZRS | GRS | RA-GRS | GZRS | RA-GZRS |
|---------|-----|-----|-----|--------|------|---------|
| Blob storage <br/>(including Data Lake Storage) | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| Queue storage                                   | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| Table storage                                   | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| Azure Files                                     | &#x2705; <sup>1,</sup><sup>2</sup> | &#x2705; <sup>1,</sup><sup>2</sup> | &#x2705; <sup>1</sup> | | &#x2705; <sup>1</sup> | |
| Azure managed disks                             | &#x2705; | &#x2705; <sup>3</sup> |          |          |          |          |
| Azure Elastic SAN                               | &#x2705; | &#x2705; |          |          |          |          |

<sup>1</sup> Standard file shares are supported on LRS and ZRS. Standard file shares are supported on GRS and GZRS as long as they're less than or equal to 5 TiB in size.<br/>
<sup>2</sup> Premium file shares are supported on LRS and ZRS.<br/>
<sup>3</sup> ZRS managed disks have certain limitations. See the [Limitations](../../virtual-machines/disks-redundancy.md#limitations) section of the redundancy options for managed disks article for details.<br/>

### Supported storage account types

The following table shows which redundancy options are supported for each type of storage account. For information for storage account types, see [Storage account overview](storage-account-overview.md).

| Storage account types | LRS | ZRS | GRS/RA-GRS | GZRS/RA-GZRS |
|:-|:-|:-|:-|:-|
| **Recommended** | Standard general-purpose v2 (`StorageV2`)<sup>1</sup><br/><br/> Premium block blobs (`BlockBlobStorage`)<sup>1</sup><br/><br/> Premium file shares (`FileStorage`) <br/><br/> Premium page blobs (`StorageV2`) | Standard general-purpose v2 (`StorageV2`)<sup>1</sup><br/><br/> Premium block blobs (`BlockBlobStorage`)<sup>1</sup><br/><br/> Premium file shares (`FileStorage`) | Standard general-purpose v2 (`StorageV2`)<sup>1</sup> | Standard general-purpose v2 (`StorageV2`)<sup>1</sup> |
| **Legacy** | Standard general-purpose v1 (`Storage`)<br/><br/> Legacy blob (`BlobStorage`) | N/A | Standard general-purpose v1 (`Storage`)<br/><br/> Legacy blob (`BlobStorage`) | N/A |

<sup>1</sup> Accounts of this type with a hierarchical namespace enabled also support the specified redundancy option.

All data for all storage accounts is copied from the primary to the secondary according to the redundancy option for the storage account. Objects including block blobs, append blobs, page blobs, queues, tables, and files are copied.

Data in all tiers, including the Archive tier, is always copied from the primary to the secondary during geo-replication. The Archive tier for Blob Storage is currently supported for LRS, GRS, and RA-GRS accounts, but not for ZRS, GZRS, or RA-GZRS accounts. For more information about blob tiers, see [Hot, Cool, and Archive access tiers for blob data](../blobs/access-tiers-overview.md).

Unmanaged disks don't support ZRS or GZRS.

For pricing information for each redundancy option, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

> [!NOTE]
Block blob storage accounts support locally redundant storage (LRS) and zone redundant storage (ZRS) in certain regions.

## Data integrity

Azure Storage regularly verifies the integrity of data stored using cyclic redundancy checks (CRCs). If data corruption is detected, it's repaired using redundant data. Azure Storage also calculates checksums on all network traffic to detect corruption of data packets when storing or retrieving data.

## See also

- [Change the redundancy option for a storage account](redundancy-migration.md)
- Geo replication (GRS/GZRS/RA-GRS/RA-GZRS)
    - [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
    - [Disaster recovery and storage account failover](storage-disaster-recovery-guidance.md)
- Pricing
    - [Blob Storage](https://azure.microsoft.com/pricing/details/storage/blobs)
    - [Azure Files](https://azure.microsoft.com/pricing/details/storage/files/)
    - [Table Storage](https://azure.microsoft.com/pricing/details/storage/tables/)
    - [Queue Storage](https://azure.microsoft.com/pricing/details/storage/queues/)
    - [Azure Disks](https://azure.microsoft.com/pricing/details/managed-disks/)
