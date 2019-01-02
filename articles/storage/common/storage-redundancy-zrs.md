---
title: Build highly available Azure Storage applications on zone-redundant storage (ZRS) | Microsoft Docs
description: Zone-redundant storage (ZRS) offers a simple way to build highly available applications. ZRS protects against hardware failures in the datacenter, and against some regional disasters.
services: storage
author: tolandmike
ms.service: storage
ms.topic: article
ms.date: 10/24/2018
ms.author: jeking
ms.component: common
---

# Zone-redundant storage (ZRS): Highly available Azure Storage applications
[!INCLUDE [storage-common-redundancy-ZRS](../../../includes/storage-common-redundancy-zrs.md)]

## Support coverage and regional availability
ZRS currently supports standard general-purpose v2 account types. For more information about storage account types, see [Azure storage account overview](storage-account-overview.md).

ZRS is available for block blobs, non-disk page blobs, files, tables, and queues.

ZRS is generally available in the following regions:

- US East
- US East 2
- US West 2
- US Central
- North Europe
- West Europe
- France Central
- Southeast Asia

Microsoft continues to enable ZRS in additional Azure regions. Check the [Azure Service Updates](https://azure.microsoft.com/updates/) page regularly for information about new regions.

## What happens when a zone becomes unavailable?
Your data is still accessible even if a zone becomes unavailable. Microsoft recommends that you continue to follow practices for transient fault handling. These practices include implementing retry policies with exponential back-off.

When a zone is unavailable, Azure undertakes networking updates, such as DNS repointing. These updates may affect your application if you are accessing your data before the updates have completed.

ZRS may not protect your data against a regional disaster where multiple zones are permanently affected. Instead, ZRS offers resiliency for your data if it becomes temporarily unavailable. For protection against regional disasters, Microsoft recommends using geo-redundant storage (GRS). For more information about GRS, see [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy-grs.md).

## Converting to ZRS replication
Migrating to or from LRS, GRS, and RA-GRS is straightforward. Use the Azure portal or the Storage Resource Provider API to change your account's redundancy type. Azure will then replicate your data accordingly. 

Migrating data to or from ZRS requires a different strategy. ZRS migration involves the physical movement of data from a single storage stamp to multiple stamps within a region.

There are two primary options for migration to or from ZRS: 

- Manually copy or move data to a new ZRS account from an existing account.
- Request a live migration.

Microsoft strongly recommends that you perform a manual migration. A manual migration provides more flexibility than a live migration. With a manual migration, you're in control of the timing.

To perform a manual migration, you have options:
- Use existing tooling like AzCopy, one of the Azure Storage client libraries, or reliable third-party tools.
- If you're familiar with Hadoop or HDInsight, attach both source and destination (ZRS) account to your cluster. Then, parallelize the data copy process with a tool like DistCp.
- Build your own tooling using one of the Azure Storage client libraries.

A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a live migration option. A live migration is an in-place migration. 

During a live migration, you can use your storage account while your data is migrated between source and destination storage stamps. During the migration process, you have the same level of durability and availability SLA as you do normally.

Keep in mind the following restrictions on live migration:

- While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete. If you need your data migrated to ZRS by a certain date, then Microsoft recommends that you perform a manual migration instead. Generally, the more data you have in your account, the longer it takes to migrate that data. 
- Live migration is supported only for storage accounts that use LRS or GRS replication. If your account uses RA-GRS, then you need to first change your account's replication type to either LRS or GRS before proceeding. This intermediary step removes the secondary read-only endpoint provided by RA-GRS before migration.
- Your account must contain data.
- You can only migrate data within the same region. If you want to migrate your data into a ZRS account located in a region different than the source account, then you must perform a manual migration.
- Only standard storage account types support live migration. Premium storage accounts must be migrated manually.

You can request live migration through the [Azure Support portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). From the portal, select the storage account you want to convert to ZRS.
1. Select **New Support Request**
2. Complete the **Basics** based on your account information. In the **Service** section, select **Storage Account Management** and the resource you want to convert to ZRS. 
3. Select **Next**. 
4. Specify the following values the **Problem** section: 
    - **Severity**: Leave the default value as-is.
    - **Problem Type**: Select **Data Migration**.
    - **Category**: Select **Migrate to ZRS within a region**.
    - **Title**: Type a descriptive title, for example, **ZRS account migration**.
    - **Details**: Type additional details in the **Details** box, for example, I would like to migrate to ZRS from [LRS, GRS] in the \_\_ region. 
5. Select **Next**.
6. Verify that the contact information is correct on the **Contact information** blade.
7. Select **Create**.

A support person will contact you and provide any assistance you need. 

## ZRS Classic: A legacy option for block blobs redundancy
> [!NOTE]
> Microsoft will deprecate and migrate ZRS Classic accounts on March 31, 2021. More details will be provided to ZRS Classic customers before deprecation. 
>
> Once ZRS becomes [generally available](#support-coverage-and-regional-availability) in a region, customers won't be able to create ZRS Classic accounts from the portal in that region. Using Microsoft PowerShell and Azure CLI to create ZRS Classic accounts is an option until ZRS Classic is deprecated.

ZRS Classic asynchronously replicates data across data centers within one to two regions. Replicated data may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account can't be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also don't support metrics or logging.

ZRS Classic is available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

To manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RA-GRS account, use one of the following tools: AzCopy, Azure Storage Explorer, Azure PowerShell, or Azure CLI. You can also build your own migration solution with one of the Azure Storage client libraries.

## See also
- [Azure Storage replication](storage-redundancy.md)
- [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](storage-redundancy-lrs.md)
- [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy-grs.md)
