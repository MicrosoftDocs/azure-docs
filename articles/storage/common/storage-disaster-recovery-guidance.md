---
title: Azure storage disaster recovery planning and failover
titleSuffix: Azure Storage
description: Azure Storage supports account failover for geo-redundant storage accounts. Create a disaster recovery plan for your storage accounts if the endpoints in the primary region become unavailable.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: conceptual
ms.date: 09/22/2023
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: references_regions
---

# Azure storage disaster recovery planning and failover

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages may occur. Key components of a good disaster recovery plan include strategies for:

- [Data protection](../blobs/data-protection-overview.md)
- [Backup and restore](../../backup/index.yml)
- [Data redundancy](storage-redundancy.md)
- [Failover](#plan-for-storage-account-failover)
- [Designing applications for high availability](#design-for-high-availability)

This article focuses on failover for globally redundant storage accounts (GRS, GZRS, and RA-GZRS), and how to design your applications to be highly available if there's an outage and subsequent failover.

## Choose the right redundancy option

Azure Storage maintains multiple copies of your storage account to ensure durability and high availability. Which redundancy option you choose for your account depends on the degree of resiliency you need for your applications.

With locally redundant storage (LRS), three copies of your storage account are automatically stored and replicated within a single datacenter. With zone-redundant storage (ZRS), a copy is stored and replicated in each of three separate availability zones within the same region. For more information about availability zones, see [Azure availability zones](../../availability-zones/az-overview.md).

Recovery of a single copy of a storage account occurs automatically with LRS and ZRS.

### Globally redundant storage and failover

With globally redundant storage (GRS, GZRS, and RA-GZRS), Azure copies your data asynchronously to a secondary geographic region at least hundreds of miles away. This allows you to recover your data if there's an outage in the primary region. A feature that distinguishes globally redundant storage from LRS and ZRS is the ability to fail over to the secondary region if there's an outage in the primary region. The process of failing over updates the DNS entries for your storage account service endpoints such that the endpoints for the secondary region become the new primary endpoints for your storage account. Once the failover is complete, clients can begin writing to the new primary endpoints.

RA-GRS and RA-GZRS redundancy configurations provide geo-redundant storage with the added benefit of read access to the secondary endpoint if there is an outage in the primary region. If an outage occurs in the primary endpoint, applications configured for read access to the secondary region and designed for high availability can continue to read from the secondary endpoint. Microsoft recommends RA-GZRS for maximum availability and durability of your storage accounts.

For more information about redundancy in Azure Storage, see [Azure Storage redundancy](storage-redundancy.md).

## Plan for storage account failover

Azure Storage accounts support two types of failover:

- [**Customer-managed failover**](#customer-managed-failover) - Customers can manage storage account failover if there's an unexpected service outage.
- [**Microsoft-managed failover**](#microsoft-managed-failover) - Potentially initiated by Microsoft only in the case of a severe disaster in the primary region. <sup>1,2</sup>

<sup>1</sup>Microsoft-managed failover can't be initiated for individual storage accounts, subscriptions, or tenants. For more details see [Microsoft-managed failover](#microsoft-managed-failover). <br/>
<sup>2</sup> Your disaster recovery plan should be based on customer-managed failover. **Do not** rely on Microsoft-managed failover, which would only be used in extreme circumstances. <br/>

Each type of failover has a unique set of use cases, corresponding expectations for data loss, and support for accounts with a hierarchical namespace enabled (Azure Data Lake Storage Gen2). This table summarizes those aspects of each type of failover :

| Type                               | Failover Scope  | Use case | Expected data loss | HNS supported |
|------------------------------------|-----------------|----------|---------------------|---------------|
| Customer-managed                   | Storage account | The storage service endpoints for the primary region become unavailable, but the secondary region is available. <br></br> You received an Azure Advisory in which Microsoft advises you to perform a failover operation of storage accounts potentially affected by an outage. | [Yes](#anticipate-data-loss-and-inconsistencies) | [Yes ](#azure-data-lake-storage-gen2)*[(In preview)](#azure-data-lake-storage-gen2)* |
| Microsoft-managed                  | Entire region or scale unit   | The primary region becomes completely unavailable due to a significant disaster, but the secondary region is available. | [Yes](#anticipate-data-loss-and-inconsistencies) | [Yes](#azure-data-lake-storage-gen2) |

### Customer-managed failover

If the data endpoints for the storage services in your storage account become unavailable in the primary region, you can fail over to the secondary region. After the failover is complete, the secondary region becomes the new primary and users can proceed to access data in the new primary region.

To fully understand the impact that customer-managed account failover would have on your users and applications, it is helpful to know what happens during every step of the failover and failback process. For details about how the process works, see [How customer-managed storage account failover works](storage-failover-customer-managed-unplanned.md).

### Microsoft-managed failover

In extreme circumstances where the original primary region is deemed unrecoverable within a reasonable amount of time due to a major disaster, Microsoft **may** initiate a regional failover. In this case, no action on your part is required. Until the Microsoft-managed failover has completed, you won't have write access to your storage account. Your applications can read from the secondary region if your storage account is configured for RA-GRS or RA-GZRS.

> [!IMPORTANT]
> Your disaster recovery plan should be based on customer-managed failover. **Do not** rely on Microsoft-managed failover, which might only be used in extreme circumstances.
> A Microsoft-managed failover would be initiated for an entire physical unit, such as a region or scale unit. It can't be initiated for individual storage accounts, subscriptions, or tenants. For the ability to selectively failover your individual storage accounts, use [customer-managed account failover](#customer-managed-failover).
### Anticipate data loss and inconsistencies

> [!CAUTION]
> Storage account failover usually involves some data loss, and potentially file and data inconsistencies. In your disaster recovery plan, it's important to consider the impact that an account failover would have on your data before initiating one.

Because data is written asynchronously from the primary region to the secondary region, there's always a delay before a write to the primary region is copied to the secondary. If the primary region becomes unavailable, the most recent writes may not yet have been copied to the secondary.

When a failover occurs, all data in the primary region is lost as the secondary region becomes the new primary. All data already copied to the secondary is maintained when the failover happens. However, any data written to the primary that hasn't also been copied to the secondary region is lost permanently.

The new primary region is configured to be locally redundant (LRS) after the failover.

You also might experience file or data inconsistencies if your storage accounts have one or more of the following enabled:

- [Hierarchical namespace (Azure Data Lake Storage Gen2)](#file-consistency-for-azure-data-lake-storage-gen2)
- [Change feed](#change-feed-and-blob-data-inconsistencies)
- [Point-in-time restore for block blobs](#point-in-time-restore-inconsistencies)

#### Last sync time

The **Last Sync Time** property indicates the most recent time that data from the primary region is guaranteed to have been written to the secondary region. For accounts that have a hierarchical namespace, the same **Last Sync Time** property also applies to the metadata managed by the hierarchical namespace, including ACLs. All data and metadata written prior to the last sync time is available on the secondary, while data and metadata written after the last sync time may not have been written to the secondary, and may be lost. Use this property if there's an outage to estimate the amount of data loss you may incur by initiating an account failover.

As a best practice, design your application so that you can use the last sync time to evaluate expected data loss. For example, if you're logging all write operations, then you can compare the time of your last write operations to the last sync time to determine which writes haven't been synced to the secondary.

For more information about checking the **Last Sync Time** property, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

#### File consistency for Azure Data Lake Storage Gen2

Replication for storage accounts with a [hierarchical namespace enabled (Azure Data Lake Storage Gen2)](../blobs/data-lake-storage-introduction.md) occurs at the file level. This means if an outage in the primary region occurs, it is possible that only some of the files in a container or directory might have successfully replicated to the secondary region. Consistency for all files in a container or directory after a storage account failover is not guaranteed.

#### Change feed and blob data inconsistencies

Storage account failover of geo-redundant storage accounts with [change feed](../blobs/storage-blob-change-feed.md) enabled may result in inconsistencies between the change feed logs and the blob data and/or metadata. Such inconsistencies can result from the asynchronous nature of both updates to the change logs and the replication of blob data from the primary to the secondary region. The only situation in which inconsistencies would not be expected is when all of the current log records have been successfully flushed to the log files, and all of the storage data has been successfully replicated from the primary to the secondary region.

For information about how change feed works see [How the change feed works](../blobs/storage-blob-change-feed.md#how-the-change-feed-works).

Keep in mind that other storage account features require the change feed to be enabled such as [operational backup of Azure Blob Storage](../../backup/blob-backup-support-matrix.md#limitations), [Object replication](../blobs/object-replication-overview.md) and [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md).

#### Point-in-time restore inconsistencies

Customer-managed failover is supported for general-purpose v2 standard tier storage accounts that include block blobs. However, performing a customer-managed failover on a storage account resets the earliest possible restore point for the account. Data for [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md) is only consistent up to the failover completion time. As a result, you can only restore block blobs to a point in time no earlier than the failover completion time. You can check the failover completion time in the redundancy tab of your storage account in the Azure Portal.

For example, suppose you have set the retention period to 30 days. If more than 30 days have elapsed since the failover, then you can restore to any point within that 30 days. However, if fewer than 30 days have elapsed since the failover, then you can't restore to a point prior to the failover, regardless of the retention period. For example, if it's been 10 days since the failover, then the earliest possible restore point is 10 days in the past, not 30 days in the past.

### The time and cost of failing over

The time it takes for failover to complete after being initiated can vary, although it typically takes less than one hour.

A customer-managed failover loses its geo-redundancy after a failover (and failback). Your storage account is automatically converted to locally redundant storage (LRS) in the new primary region during a failover, and the storage account in the original primary region is deleted.

You can re-enable geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) for the account, but note that converting from LRS to GRS or RA-GRS incurs an additional cost. The cost is due to the network egress charges to re-replicate the data to the new secondary region. Also, all archived blobs need to be rehydrated to an online tier before the account can be configured for geo-redundancy, which will incur a cost. For more information about pricing, see:

- [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)

After you re-enable GRS for your storage account, Microsoft begins replicating the data in your account to the new secondary region. Replication time depends on many factors, which include:

- The number and size of the objects in the storage account. Replicating many small objects can take longer than replicating fewer and larger objects.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity. Live traffic takes priority over geo replication.
- If your storage account contains blobs, the number of snapshots per blob.
- If your storage account contains tables, the [data partitioning strategy](/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage). The replication process can't scale beyond the number of partition keys that you use.

### Supported storage account types

All geo-redundant offerings support Microsoft-managed failover. In addition, some account types support customer-managed account failover, as shown in the following table:

| Type of failover | GRS/RA-GRS | GZRS/RA-GZRS |
|---|---|---|
| **Customer-managed failover** | General-purpose v2 accounts</br> General-purpose v1 accounts</br> Legacy Blob Storage accounts | General-purpose v2 accounts |
| **Microsoft-managed failover** | All account types | General-purpose v2 accounts |

#### Classic storage accounts

> [!IMPORTANT]
> Customer-managed account failover is only supported for storage accounts deployed using the Azure Resource Manager (ARM) deployment model. The Azure Service Manager (ASM) deployment model, also known as *classic*, isn't supported. To make classic storage accounts eligible for customer-managed account failover, they must first be [migrated to the ARM model](classic-account-migration-overview.md). Your storage account must be accessible to perform the upgrade, so the primary region can't currently be in a failed state.
>
> if there's a disaster that affects the primary region, Microsoft will manage the failover for classic storage accounts. For more information, see [Microsoft-managed failover](#microsoft-managed-failover).

#### Azure Data Lake Storage Gen2

> [!IMPORTANT]
> Customer-managed account failover for accounts that have a hierarchical namespace (Azure Data Lake Storage Gen2) is currently in PREVIEW and only supported in the following regions:
>
> - (Asia Pacific) Central India
> - (Europe) Switzerland North
> - (Europe) Switzerland West
> - (North America) Canada Central
>
> To opt in to the preview, see [Set up preview features in Azure subscription](../../azure-resource-manager/management/preview-features.md) and specify `AllowHNSAccountFailover` as the feature name.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> if there's a significant disaster that affects the primary region, Microsoft will manage the failover for accounts with a hierarchical namespace. For more information, see [Microsoft-managed failover](#microsoft-managed-failover).

### Unsupported features and services

The following features and services aren't supported for account failover:

- Azure File Sync doesn't support storage account failover. Storage accounts containing Azure file shares being used as cloud endpoints in Azure File Sync shouldn't be failed over. Doing so will cause sync to stop working and may also cause unexpected data loss in the case of newly tiered files.
- A storage account containing premium block blobs can't be failed over. Storage accounts that support premium block blobs don't currently support geo-redundancy.
- Customer-managed failover isn't supported for either the source or the destination account in an [object replication policy](../blobs/object-replication-overview.md).
- To failover an account with SSH File Transfer Protocol (SFTP) enabled, you must first [disable SFTP for the account](../blobs/secure-file-transfer-protocol-support-how-to.md#disable-sftp-support). If you want to resume using SFTP after the failover is complete, simply [re-enable it](../blobs/secure-file-transfer-protocol-support-how-to.md#enable-sftp-support).
- Network File System (NFS) 3.0 (NFSv3) isn't supported for storage account failover. You can't create a storage account configured for global-redundancy with NFSv3 enabled.

### Failover is not for account migration

Storage account failover shouldn't be used as part of your data migration strategy. Failover is a temporary solution to a service outage. For information about how to  migrate your storage accounts, see [Azure Storage migration overview](storage-migration-overview.md).

### Storage accounts containing archived blobs

Storage accounts containing archived blobs support account failover. However, after a [customer-managed failover](#customer-managed-failover) is complete, all archived blobs need to be rehydrated to an online tier before the account can be configured for geo-redundancy.

### Storage resource provider

Microsoft provides two REST APIs for working with Azure Storage resources. These APIs form the basis of all actions you can perform against Azure Storage. The Azure Storage REST API enables you to work with data in your storage account, including blob, queue, file, and table data. The Azure Storage resource provider REST API enables you to manage the storage account and related resources.

After a failover is complete, clients can again read and write Azure Storage data in the new primary region. However, the Azure Storage resource provider does not fail over, so resource management operations must still take place in the primary region. If the primary region is unavailable, you will not be able to perform management operations on the storage account.

Because the Azure Storage resource provider does not fail over, the [Location](/dotnet/api/microsoft.azure.management.storage.models.trackedresource.location) property will return the original primary location after the failover is complete.

### Azure virtual machines

Azure virtual machines (VMs) don't fail over as part of an account failover. If the primary region becomes unavailable, and you fail over to the secondary region, then you will need to recreate any VMs after the failover. Also, there's a potential data loss associated with the account failover. Microsoft recommends following the [high availability](../../virtual-machines/availability.md) and [disaster recovery](../../virtual-machines/backup-recovery.md) guidance specific to virtual machines in Azure.

Keep in mind that any data stored in a temporary disk is lost when the VM is shut down.

### Azure unmanaged disks

As a best practice, Microsoft recommends converting unmanaged disks to managed disks. However, if you need to fail over an account that contains unmanaged disks attached to Azure VMs, you will need to shut down the VM before initiating the failover.

Unmanaged disks are stored as page blobs in Azure Storage. When a VM is running in Azure, any unmanaged disks attached to the VM are leased. An account failover can't proceed when there's a lease on a blob. To perform the failover, follow these steps:

1. Before you begin, note the names of any unmanaged disks, their logical unit numbers (LUN), and the VM to which they are attached. Doing so will make it easier to reattach the disks after the failover.
2. Shut down the VM.
3. Delete the VM, but retain the VHD files for the unmanaged disks. Note the time at which you deleted the VM.
4. Wait until the **Last Sync Time** has updated, and is later than the time at which you deleted the VM. This step is important, because if the secondary endpoint hasn't been fully updated with the VHD files when the failover occurs, then the VM may not function properly in the new primary region.
5. Initiate the account failover.
6. Wait until the account failover is complete and the secondary region has become the new primary region.
7. Create a VM in the new primary region and reattach the VHDs.
8. Start the new VM.

Keep in mind that any data stored in a temporary disk is lost when the VM is shut down.

### Copying data as an alternative to failover

If your storage account is configured for read access to the secondary region, then you can design your application to read from the secondary endpoint. If you prefer not to fail over if there's an outage in the primary region, you can use tools such as [AzCopy](./storage-use-azcopy-v10.md) or [Azure PowerShell](/powershell/module/az.storage/) to copy data from your storage account in the secondary region to another storage account in an unaffected region. You can then point your applications to that storage account for both read and write availability.

## Design for high availability

It's important to design your application for high availability from the start. Refer to these Azure resources for guidance in designing your application and planning for disaster recovery:

- [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design): An overview of the key concepts for architecting highly available applications in Azure.
- [Resiliency checklist](/azure/architecture/checklist/resiliency-per-service): A checklist for verifying that your application implements the best design practices for high availability.
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md): Design guidance for building applications to take advantage of geo-redundant storage.
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md): A tutorial that shows how to build a highly available application that automatically switches between endpoints as failures and recoveries are simulated.

Keep in mind these best practices for maintaining high availability for your Azure Storage data:

- **Disks:** Use [Azure Backup](https://azure.microsoft.com/services/backup/) to back up the VM disks used by your Azure virtual machines. Also consider using [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) to protect your VMs if there's a regional disaster.
- **Block blobs:** Turn on [soft delete](../blobs/soft-delete-blob-overview.md) to protect against object-level deletions and overwrites, or copy block blobs to another storage account in a different region using [AzCopy](./storage-use-azcopy-v10.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](storage-use-data-movement-library.md).
- **Files:** Use [Azure Backup](../../backup/azure-file-share-backup-overview.md) to back up your file shares. Also enable [soft delete](../files/storage-files-prevent-file-share-deletion.md) to protect against accidental file share deletions. For geo-redundancy when GRS isn't available, use [AzCopy](./storage-use-azcopy-v10.md) or [Azure PowerShell](/powershell/module/az.storage/) to copy your files to another storage account in a different region.
- **Tables:** use [AzCopy](./storage-use-azcopy-v10.md) to export table data to another storage account in a different region.

## Track outages

Customers may subscribe to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) to track the health and status of Azure Storage and other Azure services.

Microsoft also recommends that you design your application to prepare for the possibility of write failures. Your application should expose write failures in a way that alerts you to the possibility of an outage in the primary region.

## See also

- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md)
- [Azure Storage redundancy](storage-redundancy.md)
- [How customer-managed storage account failover works](storage-failover-customer-managed-unplanned.md)

