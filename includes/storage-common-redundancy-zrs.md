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

Zone redundant storage (ZRS) is implemented in such a way that provides you the the best level of storage durablity without sacrificing transactional completeness or any noticeable performance loss. ZRS ensures that your data is *synchronously* written across a minimum of three (3) storage stamps, each of which are physically separated and residing in their own Availability Zone (AZ). Each AZ is provided its own utility (power, water, etc.) and networking cabiblities, and each AZ is completely autonomous from each other. AZ's reside in a single region.

ZRS is available for Standard storage accounts. It offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year. Consider ZRS for scenarios which require both HA and strong consistency.

Storing your data in a ZRS account ensures that you will still be able to fully access and manage your data in the event of an AZ outage. This protects your data from any sort of failure (short of a region-wide catastrophy), whether intermittent or permament, while still providing excellent performance and *very* low latency.

During an AZ outage, you will still be able to use our storage API completely. ZRS will not restrict this.

Currently, ZRS supports the following storage service features:
- Block Blobs
- Non-disk Page Blobs
- Files
- Tables
- Queues

For more information about availability zones, see [Availability zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

ZRS may not protect your data against a regional disaster where multiple zones are affected. For protection against regional disasters, Microsoft recommends using [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](../articles/storage/common/storage-redundancy-grs.md). ZRS is a less expensive option than GRS.

ZRS is currently available in the following regions, with more regions coming soon:

- US East 2 
- US East 2 EUAP (Canary)
- US Central 
- US West 2 (coming soon)
- North Europe
- West Europe
- France Central
- Southeast Asia

We are always pushing ZRS into other regions so stay tuned!

> [!IMPORTANT]
> ZRS is only available in a general purpose v2 (GPv2) account. You can change how your data is replicated after your storage account has been created. However, you may incur an additional one-time data transfer cost if you switch from LRS or ZRS to GRS or RA-GRS.
>
## What happens when a zone goes down?
ZRS will remain resilient when one zone goes down, and you should still continue to follow practices for transient fault handling and so on. When a zone is considered 'down', there are networking updates such as DNS re-pointing which could affect you if you are hitting storage before these updates are completely pushed through. We recommend that you implement retry policies with exponential backoff.

# ZRS Classic: A legacy option for redundancy of block blobs
> [!NOTE]
> ZRS Classic accounts are planned for deprecation and required migration on March 31, 2021. Microsoft will send more details to ZRS Classic customers prior to deprecation. We plan to provide an automated migration process from ZRS Classic to ZRS in the future.

ZRS Classic is available only for block blobs in general-purpose V1 (GPv1) storage accounts. ZRS Classic asynchronously replicates data across datacenters within one to two regions. A replica may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account cannot be converted to or from LRS or GRS, and does not have metrics or logging capability.

ZRS Classic accounts cannot be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also do not support metrics or logging.

Once ZRS is generally available in a region, you will no longer be able to create a ZRS Classic account from the portal in that region, but you can create one through other means like PowerShell, CLI and so on.

You can manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RA-GRS account. You can perform this manual migration using AzCopy, Azure Storage Explorer, Azure PowerShell, Azure CLI, or building your own atop one of the Azure Storage client libraries.