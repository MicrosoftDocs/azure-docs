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
Zone Redundant Storage (ZRS) synchronously replicates your data across three storage clusters in a single region. Each storage cluster is physically separated from the others and resides in its own availability zone (AZ). Each availability zone, and the ZRS cluster within it, is autonomous, with separate utilities and networking capabilities.

Storing your data in a ZRS account ensures that you will be able access and manage your data in the event that a zone becomes unavailable. ZRS provides excellent performance and extremely low latency.

For more information about availability zones, see [Availability Zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

## ZRS for high availability 

Consider ZRS for scenarios that require strong consistency, strong durability, and high availability even if an outage or natural disaster renders a data center unavailable. ZRS offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year.

ZRS currently supports standard, general-purpose v2 (GPv2) account types. ZRS is available for block blobs, non-disk page blobs, files, tables, and queues. 

ZRS is generally available in the following regions:

- US East 2
- US Central
- North Europe
- West Europe
- France Central
- Southeast Asia

Microsoft continues to enable ZRS in other Azure regions.

### What happens when a zone becomes unavailable?

Your data will remain resilient if a zone becomes unavailable. Microsoft recommends that you continue to follow practices for transient fault handling, such as implementing retry policies with exponential back-off. When a zone is unavailable, Azure undertakes networking updates, such as DNS repointing. These updates may affect your application if you are accessing your data before they have completed.

ZRS may not protect your data against a regional disaster where multiple zones are permanently affected. Instead, ZRS offers resiliency for your data in the case of temporal unavailability. For protection against regional disasters, Microsoft recommends using [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](../articles/storage/common/storage-redundancy-grs.md).

## ZRS Classic: A legacy option for block blobs redundancy
> [!NOTE]
> ZRS Classic accounts are planned for deprecation and required migration on March 31, 2021. Microsoft will send more details to ZRS Classic customers prior to deprecation. Microsoft plans to provide an automated migration process from ZRS Classic to ZRS in the future.

ZRS Classic is available only for block blobs in general-purpose V1 (GPv1) storage accounts. ZRS Classic asynchronously replicates data across data centers within one to two regions. A replica may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account cannot be converted to or from LRS or GRS, and does not have metrics or logging capability.

ZRS Classic accounts cannot be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also do not support metrics or logging.

Once ZRS is generally available in a region, you will no longer be able to create a ZRS Classic account from the portal in that region, but you can create one through other means like PowerShell, CLI and so on.

To manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RA-GRS account, use AzCopy, Azure Storage Explorer, Azure PowerShell, or Azure CLI. You can also build your own migration solution with one of the Azure Storage client libraries.