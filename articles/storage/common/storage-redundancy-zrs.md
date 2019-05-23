---
title: Build highly available Azure Storage applications on zone-redundant storage (ZRS) | Microsoft Docs
description: Zone-redundant storage (ZRS) offers a simple way to build highly available applications. ZRS protects against hardware failures in the datacenter, and against some regional disasters.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 10/24/2018
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Zone-redundant storage (ZRS): Highly available Azure Storage applications
[!INCLUDE [storage-common-redundancy-ZRS](../../../includes/storage-common-redundancy-zrs.md)]

## Support coverage and regional availability
ZRS currently supports standard general-purpose v2 account types. For more information about storage account types, see [Azure storage account overview](storage-account-overview.md).

ZRS is available for block blobs, non-disk page blobs, files, tables, and queues.

ZRS is generally available in the following regions:

- Asia Southeast
- Europe West
- Europe North
- France Central
- Japan East
- UK South
- US Central
- US East
- US East 2
- US West 2

Microsoft continues to enable ZRS in additional Azure regions. Check the [Azure Service Updates](https://azure.microsoft.com/updates/) page regularly for information about new regions.

## What happens when a zone becomes unavailable?
Your data is still accessible for both read and write operations even if a zone becomes unavailable. Microsoft recommends that you continue to follow practices for transient fault handling. These practices include implementing retry policies with exponential back-off.

When a zone is unavailable, Azure undertakes networking updates, such as DNS repointing. These updates may affect your application if you are accessing your data before the updates have completed.

ZRS may not protect your data against a regional disaster where multiple zones are permanently affected. Instead, ZRS offers resiliency for your data if it becomes temporarily unavailable. For protection against regional disasters, Microsoft recommends using geo-redundant storage (GRS). For more information about GRS, see [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy-grs.md).

## Converting to ZRS replication
Migrating to or from LRS, GRS, and RA-GRS is straightforward. Use the Azure portal or the Storage Resource Provider API to change your account's redundancy type. Azure will then replicate your data accordingly. 

Migrating data to ZRS requires a different strategy. ZRS migration involves the physical movement of data from a single storage stamp to multiple stamps within a region.

There are two primary options for migration to ZRS: 

- Manually copy or move data to a new ZRS account from an existing account.
- Request a live migration.

Microsoft strongly recommends that you perform a manual migration. A manual migration provides more flexibility than a live migration. With a manual migration, you're in control of the timing.

To perform a manual migration, you have options:
- Use existing tooling like AzCopy, one of the Azure Storage client libraries, or reliable third-party tools.
- If you're familiar with Hadoop or HDInsight, attach both source and destination (ZRS) account to your cluster. Then, parallelize the data copy process with a tool like DistCp.
- Build your own tooling using one of the Azure Storage client libraries.

A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a live migration option. A live migration is an in-place migration. 

During a live migration, you can use your storage account while your data is migrated between source and destination storage stamps. During the migration process, you have the same level of durability and availability SLA as you normally do.

Keep in mind the following restrictions on live migration:

- While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete. If you need your data migrated to ZRS by a certain date, then Microsoft recommends that you perform a manual migration instead. Generally, the more data you have in your account, the longer it takes to migrate that data. 
- Live migration is supported only for storage accounts that use LRS or GRS replication. If your account uses RA-GRS, then you need to first change your account's replication type to either LRS or GRS before proceeding. This intermediary step removes the secondary read-only endpoint provided by RA-GRS before migration.
- Your account must contain data.
- You can only migrate data within the same region. If you want to migrate your data into a ZRS account located in a region different than the source account, then you must perform a manual migration.
- Only standard storage account types support live migration. Premium storage accounts must be migrated manually.
- Live migration from ZRS to LRS, GRS or RA-GRS is not supported. You will need to manually move the data to a new or an existing storage account.
- Managed disks are only available for LRS and cannot be migrated to ZRS. For integration with availability sets see [Introduction to Azure managed disks](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview#integration-with-availability-sets). You can store snapshots and images for Standard SSD Managed Disks on Standard HDD storage and [choose between LRS and ZRS options](https://azure.microsoft.com/pricing/details/managed-disks/). 

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

## Live migration to ZRS FAQ

**Should I plan for any downtime during the migration?**

There is no downtime caused by the migration. During a live migration, you can continue using your storage account while your data is migrated between source and destination storage stamps. During the migration process, you have the same level of durability and availability SLA as you normally do.

**Is there any data loss associated with the migration?**

There is no data loss associated with the migration. During the migration process, you have the same level of durability and availability SLA as you normally do.

**Are any updates required to the application(s) once the migration is complete?**

Once the migration is complete the replication type of the account(s) will change to "Zone-redundant storage (ZRS)". Service endpoints, access keys, SAS and any other account configuration options remain unchanged and intact.

**Can I request a live migration of my general-purpose v1 account(s) to ZRS?**

ZRS only supports general-purpose v2 accounts so before submitting a request for a live migration to ZRS make sure to upgrade your account(s) to general-purpose v2. See [Azure storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview) and [Upgrade to a general-purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade) for more details.

**Can I request a live migration of my read-access geo-redundant storage (RA-GRS) account(s) to ZRS?**

Before submitting a request for a live migration to ZRS make sure your application(s) or workload(s) no longer require access to the secondary read-only endpoint and change the replication type of your storage account(s) to geo-redundant storage (GRS). See [Changing replication strategy](https://docs.microsoft.com/azure/storage/common/storage-redundancy#changing-replication-strategy) for more details.

**Can I request a live migration of my storage account(s) to ZRS  to another region?**

If you want to migrate your data into a ZRS account located in a region different from the region of the source account, then you must perform a manual migration.

## ZRS Classic: A legacy option for block blobs redundancy
> [!NOTE]
> Microsoft will deprecate and migrate ZRS Classic accounts on March 31, 2021. More details will be provided to ZRS Classic customers before deprecation. 
>
> Once ZRS becomes [generally available](#support-coverage-and-regional-availability) in a region, customers won't be able to create ZRS Classic accounts from the Portal in that region. Using Microsoft PowerShell and Azure CLI to create ZRS Classic accounts is an option until ZRS Classic is deprecated.

ZRS Classic asynchronously replicates data across data centers within one to two regions. Replicated data may not be available unless Microsoft initiates failover to the secondary. A ZRS Classic account can't be converted to or from LRS, GRS, or RA-GRS. ZRS Classic accounts also don't support metrics or logging.

ZRS Classic is available only for **block blobs** in general-purpose V1 (GPv1) storage accounts. For more information about storage accounts, see [Azure storage account overview](storage-account-overview.md).

To manually migrate ZRS account data to or from an LRS, ZRS Classic, GRS, or RA-GRS account, use one of the following tools: AzCopy, Azure Storage Explorer, Azure PowerShell, or Azure CLI. You can also build your own migration solution with one of the Azure Storage client libraries.

You can also upgrade your ZRS Classic account(s) to ZRS in the Portal or using Azure PowerShell or Azure CLI in the regions where ZRS is available.

To upgrade to ZRS in the Portal go to the Configuration section of the account and choose Upgrade:![Upgrade ZRS Classic to ZRS in the Portal](media/storage-redundancy-zrs/portal-zrs-classic-upgrade.jpg)

To upgrade to ZRS using PowerShell call the following command:
```powershell
Set-AzStorageAccount -ResourceGroupName <resource_group> -AccountName <storage_account> -UpgradeToStorageV2
```

To upgrade to ZRS using CLI call the following command:
```cli
az storage account update -g <resource_group> -n <storage_account> --set kind=StorageV2
```

## See also
- [Azure Storage replication](storage-redundancy.md)
- [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](storage-redundancy-lrs.md)
- [Geo-redundant storage (GRS): Cross-regional replication for Azure Storage](storage-redundancy-grs.md)
