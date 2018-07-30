---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 07/11/2018
 ms.author: tamram
 ms.custom: include file
---
Zone-redundant storage (ZRS) replicates your data synchronously across three storage clusters in a single region. Each storage cluster is physically separated from the others and resides in its own availability zone (AZ). Each availability zone, and the ZRS cluster within it, is autonomous, with separate utilities and networking capabilities.

Storing your data in a ZRS account ensures that you will be able access and manage your data in the event that a zone becomes unavailable. ZRS provides excellent performance and low latency. ZRS offers the same [scalability targets](../articles/storage/common/storage-scalability-targets.md) as [locally-redundant storage (LRS)](../articles/storage/common/storage-redundancy-lrs.md).

Consider ZRS for scenarios that require strong consistency, strong durability, and high availability even if an outage or natural disaster renders a zonal data center unavailable. ZRS offers durability for storage objects of at least 99.9999999999% (12 9's) over a given year.

For more information about availability zones, see [Availability Zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

## Support coverage and regional availability
ZRS currently supports standard [general-purpose v2 (GPv2)](../articles/storage/common/storage-account-options.md#general-purpose-v2-accounts) account types. ZRS is available for block blobs, non-disk page blobs, files, tables, and queues. Additionally, all of your [Storage Analytics](../articles/storage/common/storage-analytics.md) logs and [Storage Metrics](../articles/storage/common/storage-enable-and-view-metrics.md)

ZRS is generally available in the following regions:

- US East 2
- US West 2
- US Central
- North Europe
- West Europe
- France Central
- Southeast Asia

Microsoft continues to enable ZRS in additional Azure regions. Check the [Azure Service Updates](https://azure.microsoft.com/updates/) page regularly for information about new regions.

## What happens when a zone becomes unavailable?

Your data remains resilient if a zone becomes unavailable. Microsoft recommends that you continue to follow practices for transient fault handling, such as implementing retry policies with exponential back-off. When a zone is unavailable, Azure undertakes networking updates, such as DNS repointing. These updates may affect your application if you are accessing your data before they have completed.

ZRS may not protect your data against a regional disaster where multiple zones are permanently affected. Instead, ZRS offers resiliency for your data if it becomes temporarily unavailable. For protection against regional disasters, Microsoft recommends using geo-redundant storage (GRS). For more information about GRS, see [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](../articles/storage/common/storage-redundancy-grs.md).

## Converting to ZRS replication
Today, you can use either the Azure portal or the Storage Resource Provider API to change your account's redundancy type, as long as you are migrating to or from to LRS, GRS, and RA-GRS. With ZRS, however, migration is not as straightforward because it involves the physical data movement from a single storage stamp to multiple stamps within a region. 

You have two primary options for migration to or from ZRS. You can manually copy or move data to a new ZRS account from your existing account. You can also  request a live migration. Microsoft strongly recommends that you perform a manual migration because there is no guarantee as to when a live migration will complete. A manual migration route provides more flexibility than a live migration does, and you are in control of the timing of the migration.

To perform a manual migration, you have a variety options:
- Use existing tooling like AzCopy, the storage SDK, reliable third-party tools, etc.
- If you are familiar with Hadoop or HDInsight, you can attach both source and destination (ZRS) account to your cluster and use something like DistCp to massively parallelize the data copy process
- Build your own tooling leveraging one flavor of the storage SDK

If, however, a manual migration will result in some application downtime and you are unable to absorb that on your end, then Microsoft provides a live migration option. A live migration is an in-place migration that allows you to continue using your existing storage account while your data is migrated between source and destination storage stamps. During migration, you will still have the same level of durability and availability SLA as you do normally.

Live migration does come with certain restrictions, however. They are listed below.

- While Microsoft will address your live migration request promptly, there is no guarantee as to when the migration will complete. If you need your data to be in ZRS by a certain time, then you should do a manual migration. Generally, the more data you have in your account, the longer it will take to migrate that data. 
- You may only perform a live migration from an account using LRS or GRS replication. If your account uses RA-GRS, then you will need to first migrate to one of these replication types before proceeding. This intermediary step ensures that the secondary read-only endpoint which RA-GRS provides is removed prior to migration.
- Your account must contain data.
- Only intra-region migrations are supported. If you want to migrate your data into a ZRS account located in a region different than the source account, then you must perform a manual migration.
- Only standard storage account types are supported. You cannot migrate from a premium storage account.

Live migration requests go through Azure Support portal. From the portal, you select the storage account you want to convert to ZRS.
1. Click **New Support Request**
2. Verify the Basics. Click **Next**. 
3. On the **Problem** section, 
    - Leave Severity as-is.
    - Problem Type = **Data Migration**
    - Category = **Migrate to ZRS within a region**
    - Title = **ZRS account migration** (or something descriptive)
    - Details = I would like to migrate to ZRS from [LRS, GRS] in the ______ region. 
4. Click **Next**.
5. Verify that the Contact Info is correct on the Contact Info blade.
6. Click **Submit**.

A support person will then be in contact with you. That person will be available to provide any assistance you may require. 

## ZRS Classic: A legacy option for block blobs redundancy
> [!NOTE]
> ZRS Classic accounts are planned for deprecation and required migration on March 31, 2021. Microsoft will send more details to ZRS Classic customers prior to deprecation. Microsoft plans to provide an automated migration process from ZRS Classic to ZRS in the future.

>[!NOTE]
> Once ZRS is [generally available](#support-coverage-and-regional-availability) in a region, you will no longer be able to create a ZRS Classic account from the portal in that same region. However, you can still create one through other means like Microsoft PowerShell and the Azure CLI, that is, until ZRS Classic is deprecated.

ZRS Classic asynchronously replicates data across data centers within one to two regions. A replica may not be available unless Microsoft initiates failover to the secondary. ZRS Classic is available only for **block blobs** in [general-purpose V1 (GPv1)](../articles/storage/common/storage-account-options.md#general-purpose-v1-accounts) storage accounts. A ZRS Classic account cannot be converted to or from LRS or GRS, and does not have metrics or logging capability.

ZRS Classic accounts cannot be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also do not support metrics or logging.

To manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RA-GRS account, use AzCopy, Azure Storage Explorer, Azure PowerShell, or Azure CLI. You can also build your own migration solution with one of the Azure Storage client libraries.
