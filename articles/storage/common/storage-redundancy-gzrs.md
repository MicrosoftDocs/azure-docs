---
title: Build highly available Azure Storage applications with geo-zone-redundant storage (GZRS) (preview) | Microsoft Docs
description: Geo-zone-redundant storage (GZRS) marries the high availability of zone-redundant storage (ZRS) with protection from regional outages as provided by geo-redundant storage (GRS). Data in a GZRS storage account is replicated across Azure availability zones in the primary region and also replicated to a secondary geographic region for protection from regional disasters.
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 08/13/2019
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Build highly available Azure Storage applications with geo-zone-redundant storage (GZRS) (preview)

Geo-zone-redundant storage (GZRS) (preview) marries the high availability of [zone-redundant storage (ZRS)](storage-redundancy-zrs.md) with protection from regional outages as provided by [geo-redundant storage (GRS)](storage-redundancy-grs.md). Data in a GZRS storage account is replicated across three [Azure availability zones](../../availability-zones/az-overview.md) in the primary region and also replicated to a secondary geographic region for protection from regional disasters. Each Azure region is paired with another region within the same geography, together making a regional pair. For more details and exceptions refer to the [documentation](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

With a GZRS storage account, you can continue to read and write data if an availability zone becomes unavailable or is unrecoverable. Additionally, your data is also durable in the case of a complete regional outage or a disaster in which the primary region isn’t recoverable. GZRS is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year. GZRS also offers the same scalability targets as LRS, ZRS, GRS, or RA-GRS. You can optionally enable read access to data in the secondary region with read-access geo-zone-redundant storage (RA-GZRS) if your applications need to be able to read data in the event of a disaster in the primary region.

Microsoft recommends using GZRS for applications requiring consistency, durability, high availability, excellent performance, and resilience for disaster recovery. For the additional security of read access to the secondary region in the event of a regional disaster, enable RA-GZRS for your storage account.

## About the preview

Only general-purpose v2 storage accounts support GZRS and RA-GZRS. For more information about storage account types, see [Azure storage account overview](storage-account-overview.md). GZRS and RA-GZRS support block blobs, page blobs (that are not VHD disks), files, tables, and queues.

GZRS and RA-GZRS are currently available for preview in the following regions:

- Asia Southeast
- Europe North
- Europe West
- Japan East
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

### Availability zone outages

In the event of a failure affecting an availability zone in the primary region, your applications can seamlessly continue to read from and write to your storage account using the other availability zones for that region. Microsoft recommends that you continue to follow practices for transient fault handling when using GZRS or ZRS. These practices include implementing retry policies with exponential back-off.

When an availability zone becomes unavailable, Azure undertakes networking updates, such as DNS re-pointing. These updates may affect your application if you are accessing data before the updates have completed.

### Regional outages

If a failure affects the entire primary region, then Microsoft will first attempt to restore the primary region. If restoration is not possible, then Microsoft will fail over to the secondary region, so that the secondary region becomes the new primary region. If the storage account has RA-GZRS enabled, then applications designed for this scenario can read from the secondary region while waiting for failover. If the storage account does not have RA-GZRS enabled, then applications will not be able to read from the secondary until the failover is complete.

> [!NOTE]
> GZRS and RA-GZRS are currently in preview in the US East region only. Customer-managed account failover (preview) is not yet available in US East 2, so customers cannot currently manage account failover events with GZRS and RA-GZRS accounts. During the preview, Microsoft will manage any failover events affecting GZRS and RA-GZRS accounts.

Because data is replicated to the secondary region asynchronously, a failure that affects the primary region may result in data loss if the primary region cannot be recovered. The interval between the most recent writes to the primary region and the last write to the secondary region is known as the recovery point objective (RPO). The RPO indicates the point in time to which data can be recovered. Azure Storage typically has an RPO of less than 15 minutes, although there's currently no SLA on how long it takes to replicate data to the secondary region.

The recovery time objective (RTO)  is a measure of how long it takes to perform the failover and get the storage account back online. This measure indicates the time required by Azure to perform the failover by changing the primary DNS entries to point to the secondary location.

## Migrate a storage account to GZRS or RA-GZRS

You can migrate any existing storage account to GZRS or RA-GZRS. Migrating from an existing ZRS account to GZRS or RA-GZRS is straightforward, while migrating from an LRS, GRS, or RA-GRS account is more involved. The following sections describe how to migrate in either case.

**Known limitations**

- Archive tier is not currently supported on (RA-)GZRS accounts. See [Azure Blob storage: hot, cool, and archive access tiers](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers) for more details.
- Managed disks do not support (RA-)GZRS. You can store snapshots and images for Standard SSD Managed Disks on Standard HDD storage and [choose between LRS and ZRS options](https://azure.microsoft.com/pricing/details/managed-disks/).

### Migrating from a ZRS account

To convert an existing ZRS account to RA-GZRS, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) cmdlet to change the SKU for the account. Remember to replace the placeholder values with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> -AccountName <storage-account> -SkuName "Standard_RAGZRS"
```

### Migrating from an LRS, GRS, or RA-GRS account

There are two options for migrating to GZRS or RA-GZRS from an LRS, GRS, or RA-GRS account:

- You can manually copy or move data to a new GZRS or RA-GZRS account from an existing account.
- You can request a live migration.

#### Perform a manual migration

If you need the migration to complete by a certain date, consider performing a manual migration. A manual migration provides more flexibility than a live migration. With a manual migration, you're in control of the timing.

To manually migrate data from an existing account to a GZRS or RA-GZRS account, use a tool that can copy data efficiently. Some examples include:

- Use a utility like AzCopy or a reliable third-party tool. For information about AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).
- If you're familiar with Hadoop or HDInsight, attach both the source and destination storage accounts to your cluster. Next, parallelize the data copy process with a tool like DistCp.
- Build your own tooling using one of the Azure Storage client libraries.

#### Perform a live migration

A manual migration can result in application downtime. If your application requires high availability, Microsoft also provides a live migration option. A live migration is an in-place migration with no downtime.

During a live migration, you can use your storage account while your data is migrated between source and destination storage accounts. During the live migration process, your account continues to meet its SLA for durability and availability. There is no downtime or data loss caused by the live migration.

Only general-purpose v2 accounts support GZRS/RA-GZRS, so before submitting a request for a live migration to GZRS/RA-GZRS, you must upgrade your account to general-purpose v2. For more information, see [Azure storage account overview](https://docs.microsoft.com/azure/storage/common/storage-account-overview) and [Upgrade to a general-purpose v2 storage account](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade).

Once the migration is complete, the storage account's replication setting will be updated to **Geo-zone-redundant storage (GZRS)** or **Read-access geo-zone-redundant storage (RA-GZRS)**. Service endpoints, access keys, shared access signatures (SAS), and any other account configuration options remain unchanged and intact.

Keep in mind the following restrictions on live migration:

- While Microsoft handles your request for live migration promptly, there's no guarantee as to when a live migration will complete. If you need your data migrated to GZRS or RA-GZRS by a certain date, then Microsoft recommends that you perform a manual migration instead. Generally, the more data you have in your account, the longer it takes to migrate that data.
- Live migration is supported only for storage accounts that use GRS or RA-GRS replication. If your account uses LRS, then you need to first change your account's replication type to GRS or RA-GRS before proceeding. This intermediary step adds the secondary endpoint provided by GRS/RA-GRS.
- Your account must contain data.
- You can only migrate data within the same region.
- Only standard storage account types support live migration. Premium storage accounts must be migrated manually.
- Live migration from a GZRS or RA-GZRS account to an LRS, GRS, or RA-GRS account is not supported. You will need to manually move the data to a new or an existing storage account.
- You can request a live migration from RA-GRS to RA-GZRS. However, migrating from RA-GRS to GZRS is not supported. In this case, you must request a live migration to RA-GZRS and then manually convert the storage account to use GZRS.
- Managed disks support LRS only and cannot be migrated to GZRS or RA-GZRS. For integration with availability sets, see [Introduction to Azure managed disks](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview#integration-with-availability-sets).
- You can store snapshots and images for Standard SSD Managed Disks on Standard HDD storage and [choose between LRS, ZRS, GZRS, and RA-GZRS options](https://azure.microsoft.com/pricing/details/managed-disks/).
- Accounts containing large file shares are not supported for GZRS.

To request a live migration, use the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). From the portal, select the storage account to migrate to GZRS or RA-GZRS, and follow these instructions:

1. Select **New Support Request**.
2. Complete the **Basics** based on your account information. In the **Service** section, select **Storage Account Management** and specify the account to be migrated.
3. Select **Next**.
4. Specify the following values the **Problem** section:
    - **Severity**: Leave the default value as-is.
    - **Problem Type**: Select **Data Migration**.
    - **Category**: Select **Migrate to (RA-)GZRS within a region**.
    - **Title**: Type a descriptive title, for example, **(RA-)GZRS account migration**.
    - **Details**: Type additional details in the **Details** box, for example, "I would like to migrate to GZRS from [LRS, GRS] in the \_\_ region." or "I would like to migrate to RA-GZRS from [LRS, RA-GRS] in the \_\_ region."
5. Select **Next**.
6. Verify that the contact information is correct on the **Contact information** blade.
7. Select **Create**.

A support representative will contact you to provide assistance.

## See also

- [Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy)
- [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-lrs)
- [Zone-redundant storage (ZRS): Highly available Azure Storage applications](https://docs.microsoft.com/azure/storage/common/storage-redundancy-zrs) 
- [Scalability and performance targets for standard storage accounts](scalability-targets-standard-account.md)
