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
Zone Redundant Storage (ZRS) __synchronously__ writes your data is across three (3) storage clusters, each of which are physically separated and residing in their own availability zone (AZ). Each availability zone is autonomous, with separate utilities and networking capabilities. Availability zones reside within a single region. Thus, each ZRS cluster is also autonomous.

Storing your data in a ZRS account ensures that you will still be able access and manage your data in the event that a zone becomes unavailable, while still providing excellent performance and *extremely* low latency.

For more information about availability zones, see [Availability Zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

**You should consider ZRS for scenarios which require strong consistency, strong durability, and high availability** even in the event of an outage or disaster which renders a data center unavailable. ZRS is available for Standard storage accounts. It offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year.

## Supportability
ZRS currently supports Standard, general purpose v2 account types. It supports **block blobs**, **non-disk page blobs**, **files**, **tables**, and **queues**. It also supports logging analytics and storage metrics on your account if you have enabled it. See [Azure Monitor Metrics](../../monitoring-and-diagnostics/monitoring-overview-metrics.md).

## Regional Availability
ZRS is generally available in the following regions:

- US East 2
- US East 2 EUAP (Canary)
- US Central
- North Europe
- West Europe
- France Central
- Southeast Asia

We are continuing to enable ZRS in other regions so stay tuned!

## What happens when a zone becomes unavailable?
Your data will remain resilient if a zone becomes unavailable. Even so, you should still continue to follow practices for transient fault handling such as implementing retry policies with exponential backoff. When a zone is considered 'unavailable', Azure undertakes networking updates, such as DNS re-pointing. These updates may affect your application if you are accessing your data before they have completed.

ZRS may not protect your data against a regional disaster where multiple zones are permanently affected. This is not to be confused with temporal unavailability where your data's resiliency is not compromised. For protection against regional disasters, Microsoft recommends using [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](../articles/storage/common/storage-redundancy-grs.md).

## ZRS Classic: A legacy option for block blobs redundancy
> [!NOTE]
> ZRS Classic accounts are planned for deprecation and required migration on **March 31, 2021**. Microsoft will send more details to ZRS Classic customers prior to deprecation. We plan to provide an automated migration process from ZRS Classic to ZRS in the future.

ZRS Classic is available only for block blobs in general-purpose V1 (GPv1) storage accounts. ZRS Classic asynchronously replicates data across data centers within one to two regions. A replica may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account cannot be converted to or from LRS or GRS, and does not have metrics or logging capability.

ZRS Classic accounts cannot be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also do not support metrics or logging.

Once ZRS is generally available in a region, you will no longer be able to create a ZRS Classic account from the portal in that region, but you can create one through other means like PowerShell, CLI and so on.

You can manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RA-GRS account. You can perform this manual migration using AzCopy, Azure Storage Explorer, Azure PowerShell, Azure CLI, or building your own atop one of the Azure Storage client libraries.