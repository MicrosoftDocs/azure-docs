---
title: Azure storage disaster recovery planning and failover
titleSuffix: Azure Storage
description: Azure Storage supports account failover for geo-redundant storage accounts. Create a disaster recovery plan for your storage accounts if the endpoints in the primary region become unavailable.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.topic: conceptual
ms.date: 08/05/2024
ms.author: shaas
ms.subservice: storage-common-concepts
ms.custom: references_regions
---

<!--
Initial: 83 (3428/69)
Current: 99 (3694/0)
-->

# Azure storage disaster recovery planning and failover

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages might occasionally occur. Key components of a good disaster recovery plan include strategies for:

- [Data protection](../blobs/data-protection-overview.md)
- [Backup and restore](../../backup/index.yml)
- [Data redundancy](storage-redundancy.md)
- [Failover](#plan-for-failover)
- [Designing applications for high availability](#design-for-high-availability)

This article describes the options available for globally redundant storage accounts, and provides recommendations for developing highly available applications and testing your disaster recovery plan.

## Choose the right redundancy option

Azure Storage maintains multiple copies of your storage account to ensure that availability and durability targets are met, even in the face of failures. The way in which data is replicated provides differing levels of protection. Each option offers its own benefits, so the option you choose depends upon the degree of resiliency your applications require.

Locally redundant storage (LRS), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

By comparison, zone-redundant storage (ZRS) retains a copy of a storage account and replicates it in each of three separate availability zones within the same region. For more information about availability zones, see [Azure availability zones](../../availability-zones/az-overview.md).

<!--Recovery of a single copy of a storage account occurs automatically with both LRS and ZRS.-->

### Geo-redundant storage and failover

Geo-redundant storage (GRS), geo-zone-redundant storage (GZRS), and read-access geo-zone-redundant storage (RA-GZRS) are examples of globally redundant storage options. When configured to use globally redundant storage (GRS, GZRS, and RA-GZRS), Azure copies your data asynchronously to a secondary geographic region. These regions are located hundreds, or even thousands of miles away. This level of redundancy allows you to recover your data if there's an outage throughout the entire primary region.

Unlike LRS and ZRS, globally redundant storage also provides support for an unplanned failover to a secondary region if there's an outage in the primary region. During the failover process, DNS (Domain Name System) entries for your storage account service endpoints are automatically updated such that the secondary region's endpoints become the new primary endpoints. Once the unplanned failover is complete, clients can begin writing to the new primary endpoints.

Read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS) also provide geo-redundant storage, but offer the added benefit of read access to the secondary endpoint. These options are ideal for applications designed for high availability business-critical applications. If the primary endpoint experiences an outage, applications configured for read access to the secondary region can continue to operate. Microsoft recommends RA-GZRS for maximum availability and durability of your storage accounts.

For more information about redundancy for Azure Storage, see [Azure Storage redundancy](storage-redundancy.md).

## Plan for failover

Azure Storage accounts support three types of failover:

- [**Customer-managed planned failover (preview)**](#customer-managed-planned-failover-preview) - Customers can manage storage account failover to test their disaster recovery plan.
- [**Customer-managed (unplanned) failover**](#customer-managed-unplanned-failover) - Customers can manage storage account failover if there's an unexpected service outage.
- [**Microsoft-managed failover**](#customer-managed-unplanned-failover) - Potentially initiated by Microsoft due to a severe disaster in the primary region. <sup>1,2</sup>

<sup>1</sup> Microsoft-managed failover can't be initiated for individual storage accounts, subscriptions, or tenants. For more information, see [Microsoft-managed failover](#microsoft-managed-failover).<br/>
<sup>2</sup> Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Do not** rely on Microsoft-managed failover, which would only be used in extreme circumstances.

Each type of failover has a unique set of use cases, corresponding expectations for data loss, and support for accounts with a hierarchical namespace enabled (Azure Data Lake Storage Gen2). This table summarizes those aspects of each type of failover:

| Type                                   | Failover Scope  | Use case | Expected data loss | Hierarchical Namespace (HNS) supported |
|----------------------------------------|-----------------|----------|--------------------|----------------------------------------|
| Customer-managed planned failover (preview) | Storage account | The storage service endpoints for the primary and secondary regions are available, and you want to perform disaster recovery testing. <br></br> The storage service endpoints for the primary region are available, but another service is preventing your workloads from functioning properly.<br><br>To proactively prepare for large-scale disasters, such as a hurricane, that may impact a region. | [No](#anticipate-data-loss-and-inconsistencies)  | [Yes <br> *(In preview)*](#hierarchical-namespace-hns) |
| Customer-managed (unplanned) failover              | Storage account | The storage service endpoints for the primary region become unavailable, but the secondary region is available. <br></br> You received an Azure Advisory in which Microsoft advises you to perform a failover operation of storage accounts potentially affected by an outage. | [Yes](#anticipate-data-loss-and-inconsistencies) | [Yes <br> *(In preview)*](#hierarchical-namespace-hns) |
| Microsoft-managed                      | Entire region   | The primary region becomes unavailable due to a significant disaster, but the secondary region is available. | [Yes](#anticipate-data-loss-and-inconsistencies) | [Yes](#hierarchical-namespace-hns) |

The following table compares a storage account's redundancy state after each type of failover:

| Result of failover on...                | Customer-managed planned failover (preview)  | Customer-managed (unplanned) failover                                               |
|-----------------------------------------|----------------------------------------------|-------------------------------------------------------------------------|
| ...the secondary region                 | The secondary region becomes the new primary | The secondary region becomes the new primary                            |
| ...the original primary region          | The original primary region becomes the new secondary |The copy of the data in the original primary region is deleted  |
| ...the account redundancy configuration | The storage account is converted to GRS      | The storage account is converted to LRS                                 |
| ...the geo-redundancy configuration     | Geo-redundancy is retained                   | Geo-redundancy is lost                                                  |

The following table summarizes the resulting redundancy configuration at every stage of the failover and failback process for each type of failover:

| Original <br> configuration           | After <br> failover | After re-enabling <br> geo redundancy | After <br> failback | After re-enabling <br> geo redundancy |
|---------------------------------------|---------------------|---------------------------------------|---------------------|---------------------------------------|
| **Customer-managed planned failover** |                     |                                       |                     |                                       |
| GRS                                   | GRS                 | n/a <sup>1</sup>                      | GRS                 | n/a <sup>1</sup>                      |
| GZRS                                  | GRS                 | n/a <sup>1</sup>                      | GZRS                | n/a <sup>1</sup>                      |
| **Customer-managed (unplanned) failover**                              |                     |                                       |                     |                                       |
| GRS                                   | LRS                 | GRS                                   | LRS                 | GRS                                   |
| GZRS                                  | LRS                 | GRS                                   | ZRS                 | GZRS                                  |

<sup>1</sup> Geo-redundancy is retained during a planned failover and doesn't need to be manually reconfigured.

### Customer-managed planned failover (preview)

Planned failover can be utilized in multiple scenarios including planned disaster recovery testing, a proactive approach to large scale disasters, or to recover from non-storage related outages.

During the planned failover process, the primary and secondary regions are swapped. The original primary region is demoted and becomes the new secondary region. At the same time, the original secondary region is promoted and becomes the new primary. After the failover completes, users can proceed to access data in the new primary region and administrators can validate their disaster recovery plan. The storage account must be available in both the primary and secondary regions before a planned failover can be initiated.

Data loss isn't expected during the planned failover and failback process as long as the primary and secondary regions are available throughout the entire process. For more detail, see the [Anticipating data loss and inconsistencies](#anticipate-data-loss-and-inconsistencies) section.

To understand the effect of this type of failover on your users and applications, it's helpful to know what happens during every step of the planned failover and failback processes. For details about how this process works, see [How customer-managed (planned) failover works](storage-failover-customer-managed-planned.md).

[!INCLUDE [storage-failover.planned-preview](../../../includes/storage-failover.planned-preview.md)]

[!INCLUDE [storage-failover-user-unplanned-preview-lst](../../../includes/storage-failover-user-unplanned-preview-lst.md)]

### Customer-managed (unplanned) failover

If the data endpoints for the storage services in your storage account become unavailable in the primary region, you can initiate an unplanned failover to the secondary region. After the failover is complete, the secondary region becomes the new primary and users can proceed to access data there.

To understand the effect of this type of failover on your users and applications, it's helpful to know what happens during every step of the unplanned failover and failback process. For details about how the process works, see [How customer-managed (unplanned) failover works](storage-failover-customer-managed-unplanned.md).

### Microsoft-managed failover

Microsoft may initiate a regional failover in extreme circumstances, such as a catastrophic disaster that impacts an entire geo region. During these events, no action on your part is required. If your storage account is configured for RA-GRS or RA-GZRS, your applications can read from the secondary region during a Microsoft-managed failover. However, you don't have write access to your storage account until the failover process is complete.

> [!IMPORTANT]
> Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Do not** rely on Microsoft-managed failover, which might only be used in extreme circumstances.
> A Microsoft-managed failover would be initiated for an entire physical unit, such as a region or a datacenter. It can't be initiated for individual storage accounts, subscriptions, or tenants. If you need the ability to selectively failover your individual storage accounts, use [customer-managed planned failover](#customer-managed-planned-failover-preview).

### Anticipate data loss and inconsistencies

> [!CAUTION]
> Customer-managed unplanned failover usually involves some amount of data loss, and can also potentially introduce file and data inconsistencies. In your disaster recovery plan, it's important to consider the impact that an account failover would have on your data before initiating one.

Because data is written asynchronously from the primary region to the secondary region, there's always a delay before a write to the primary region is copied to the secondary. If the primary region becomes unavailable, it's possible that the most recent writes might not yet be copied to the secondary.

When an unplanned failover occurs, all data in the primary region is lost as the secondary region becomes the new primary. All data already copied to the secondary region is maintained when the failover happens. However, any data written to the primary that doesn't yet exist within the secondary region is lost permanently.

The new primary region is configured to be locally redundant (LRS) after the failover.

You also might experience file or data inconsistencies if your storage accounts have one or more of the following enabled:

- [Hierarchical namespace (Azure Data Lake Storage Gen2)](#file-consistency-for-azure-data-lake-storage-gen2)
- [Change feed](#change-feed-and-blob-data-inconsistencies)
- [Point-in-time restore for block blobs](#point-in-time-restore-inconsistencies)

#### Last sync time

The **Last Sync Time** property indicates the most recent time at which data from the primary region was also written to the secondary region. For accounts that have a hierarchical namespace, the same **Last Sync Time** property also applies to the metadata managed by the hierarchical namespace, including access control lists (ACLs). All data and metadata written before the last sync time is available on the secondary. By contrast, data and metadata written after the last sync time might not yet be copied to the secondary and could potentially be lost. During an outage, use this property to estimate the amount of data loss you might incur when initiating an account failover.

As a best practice, design your application so that you can use **Last Sync Time** to evaluate expected data loss. For example, logging all write operations allows you to compare the times of your last write operation to the last sync time. This method enables you to determine which writes aren't yet synced to the secondary and are in danger of being lost.

For more information about checking the **Last Sync Time** property, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

#### File consistency for Azure Data Lake Storage Gen2

Replication for storage accounts with a [hierarchical namespace enabled (Azure Data Lake Storage Gen2)](../blobs/data-lake-storage-introduction.md) occurs at the file level. Because replication occurs at this level, an outage in the primary region might prevent some of the files within a container or directory from successfully replicating to the secondary region. Consistency for all files within a container or directory after a storage account failover isn't guaranteed.

#### Change feed and blob data inconsistencies

Customer-managed (unplanned) failover of storage accounts with [change feed](../blobs/storage-blob-change-feed.md) enabled could result in inconsistencies between the change feed logs and the blob data and/or metadata. Such inconsistencies can result from the asynchronous nature of change log updates and data replication between the primary and secondary regions. You can avoid inconsistencies by taking the following precautions:

- Ensure that all log records are flushed to the log files.
- Ensure that all storage data is replicated from the primary to the secondary region.

For more information about change feed, see [How the change feed works](../blobs/storage-blob-change-feed.md#how-the-change-feed-works).

Keep in mind that other storage account features also require the change feed to be enabled. These features include [operational backup of Azure Blob Storage](../../backup/blob-backup-support-matrix.md#limitations), [Object replication](../blobs/object-replication-overview.md), and [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md).

#### Point-in-time restore inconsistencies

Customer-managed failover is supported for general-purpose v2 standard tier storage accounts that include block blobs. However, performing a customer-managed failover on a storage account resets the earliest possible restore point for the account. Data for [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md) is only consistent up to the failover completion time. As a result, you can only restore block blobs to a point in time no earlier than the failover completion time. You can check the failover completion time in the redundancy tab of your storage account in the Azure portal.

### The time and cost of failing over

The time it takes for a customer-managed failover to complete after being initiated can vary, although it typically takes less than one hour.

A planned customer-managed failover doesn't lose its geo-redundancy after a failover and subsequent failback, but an unplanned customer-managed failover does. 

Initiating a customer-managed unplanned failover automatically converts your storage account to locally redundant storage (LRS) within a new primary region, and deletes the storage account in the original primary region.

You can re-enable geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) for the account, but re-replicating data to the new secondary region incurs a charge. Additionally, any archived blobs need to be rehydrated to an online tier before the account can be reconfigured for geo-redundancy. This rehydration also incurs an extra charge. For more information about pricing, see:

- [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)

After you re-enable GRS for your storage account, Microsoft begins replicating the data in your account to the new secondary region. The amount of time it takes for replication to complete depends on several factors. These factors include:

- The number and size of the objects in the storage account. Replicating many small objects can take longer than replicating fewer and larger objects.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity. Live traffic takes priority over geo replication.
- The number of snapshots per blob, if applicable.
- The [data partitioning strategy](/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage), if your storage account contains tables. The replication process can't scale beyond the number of partition keys that you use.

### Supported storage account types

All geo-redundant offerings support Microsoft-managed failover. In addition, some account types support customer-managed account failover, as shown in the following table:

| Type of failover                                | GRS/RA-GRS | GZRS/RA-GZRS |
|-------------------------------------------------|---|---|
| **Customer-managed planned failover (preview)** | General-purpose v2 accounts</br> General-purpose v1 accounts</br> Legacy Blob Storage accounts | General-purpose v2 accounts |
| **Customer-managed (unplanned) failover**       | General-purpose v2 accounts</br> General-purpose v1 accounts</br> Legacy Blob Storage accounts | General-purpose v2 accounts |
| **Microsoft-managed failover**        | All account types | General-purpose v2 accounts |

#### Classic storage accounts

> [!IMPORTANT]
> Customer-managed failover is only supported for storage accounts deployed using the Azure Resource Manager (ARM) deployment model. The Azure Service Manager (ASM) deployment model, also known as the *classic* model, isn't supported. To make classic storage accounts eligible for customer-managed account failover, they must first be [migrated to the ARM model](classic-account-migration-overview.md). Your storage account must be accessible to perform the upgrade, so the primary region can't currently be in a failed state.
>
> During a disaster that affects the primary region, Microsoft will manage the failover for classic storage accounts. For more information, see [Microsoft-managed failover](#microsoft-managed-failover).

#### Hierarchical namespace (HNS)

[!INCLUDE [updated-for-az](../../../includes/storage-failover-unplanned-hns-preview-include.md)]

### Unsupported features and services

The following features and services aren't supported for customer-managed failover:

- Azure File Sync doesn't support customer-managed account failover. Storage accounts used as cloud endpoints for Azure File Sync shouldn't be failed over. Failover disrupts file sync and might cause the unexpected data loss of newly tiered files. For more information, see [Best practices for disaster recovery with Azure File Sync](../file-sync/file-sync-disaster-recovery-best-practices.md#geo-redundancy) for details.
- A storage account containing premium block blobs can't be failed over. Storage accounts that support premium block blobs don't currently support geo-redundancy.
- Customer-managed failover isn't supported for either the source or the destination account in an [object replication policy](../blobs/object-replication-overview.md).
- Network File System (NFS) 3.0 (NFSv3) isn't supported for storage account failover. You can't create a storage account configured for global-redundancy with NFSv3 enabled.

The following table can be used to reference feature support.

|                                  | Planned failover    | Unplanned failover  |
|----------------------------------|---------------------|---------------------|
| **ADLS Gen2**                    | Supported (preview) | Supported (preview) |
| **Change Feed**                  | Unsupported         | Supported           |
| **Object Replication**           | Unsupported         | Unsupported         |
| **SFTP**                         | Supported (preview) | Supported (preview) |
| **NFSv3**                        | GRS is unsupported  | GRS is unsupported  |
| **Storage Actions**              | Unsupported         | Unsupported         |
| **Point-in-time restore (PITR)** | Unsupported         | Supported           |

### Failover isn't for account migration

Storage account failovers are a temporary solution which can be used to either help plan and test your DR plans, or to recover from a service outage. Failover shouldn't be used as part of your data migration strategy. For information about how to  migrate your storage accounts, see [Azure Storage migration overview](storage-migration-overview.md).

### Storage accounts containing archived blobs

Storage accounts containing archived blobs support account failover. However, after a [customer-managed failover](#customer-managed-unplanned-failover) is complete, all archived blobs must be rehydrated to an online tier before the account can be configured for geo-redundancy.

### Storage resource provider

Microsoft provides two REST APIs for working with Azure Storage resources. These APIs form the basis of all actions you can perform against Azure Storage. The Azure Storage REST API enables you to work with data in your storage account, including blob, queue, file, and table data. The Azure Storage resource provider REST API enables you to manage the storage account and related resources.

After a failover is complete, clients can again read and write Azure Storage data in the new primary region. However, the Azure Storage resource provider does not fail over, so resource management operations must still take place in the primary region. If the primary region is unavailable, you will not be able to perform management operations on the storage account.

Because the Azure Storage resource provider does not fail over, the [Location](/dotnet/api/microsoft.azure.management.storage.models.trackedresource.location) property will return the original primary location after the failover is complete.

### Azure virtual machines

Azure virtual machines (VMs) don't fail over as part of a storage account failover. Any VMs that failed over to a secondary region in response to an outage need to be recreated after the failover completes. Account failover can potentially result in the loss of data stored in a temporary disk when the virtual machine (VM) is shut down. Microsoft recommends following the [high availability](/azure/virtual-machines/availability) and [disaster recovery](/azure/virtual-machines/backup-recovery) guidance specific to virtual machines in Azure.

### Azure unmanaged disks

Unmanaged disks are stored as page blobs in Azure Storage. When a VM is running in Azure, any unmanaged disks attached to the VM are leased. An account failover can't proceed when there's a lease on a blob. Before a failover can be initiated on an account containing unmanaged disks attached to Azure VMs, the disks must be shut down. For this reason, Microsoft's recommended best practices include converting any unmanaged disks to managed disks.

To perform a failover on an account containing unmanaged disks, follow these steps:

1. Before you begin, note the names of any unmanaged disks, their logical unit numbers (LUN), and the VM to which they're attached. Doing so will make it easier to reattach the disks after the failover.
1. Shut down the VM.
1. Delete the VM, but retain the virtual hard disk (VHD) files for the unmanaged disks. Note the time at which you deleted the VM.
1. Wait until the **Last Sync Time** updates, and ensure that it's later than the time at which you deleted the VM. This step ensures that the secondary endpoint is fully updated with the VHD files when the failover occurs, and that the VM functions properly in the new primary region.
1. Initiate the account failover.
1. Wait until the account failover is complete and the secondary region becomes the new primary region.
1. Create a VM in the new primary region and reattach the VHDs.
1. Start the new VM.

Keep in mind that any data stored in a temporary disk is lost when the VM is shut down.

### Copying data as a failover alternative

As previously discussed, you can maintain high availability by configuring applications to use a storage account configured for read access to a secondary region. However, if you prefer not to fail over during an outage within the primary region, you can manually copy your data as an alternative. Tools such as [AzCopy](./storage-use-azcopy-v10.md) and [Azure PowerShell](/powershell/module/az.storage/) enable you to copy data from your storage account in the affected region to another storage account in an unaffected region. After the copy operation is complete, you can reconfigure your applications to use the storage account in the unaffected region for both read and write availability.

## Design for high availability

It's important to design your application for high availability from the start. Refer to these Azure resources for guidance when designing your application and planning for disaster recovery:

- [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design): An overview of the key concepts for architecting highly available applications in Azure.
- [Resiliency checklist](/azure/architecture/checklist/resiliency-per-service): A checklist for verifying that your application implements the best design practices for high availability.
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md): Design guidance for building applications to take advantage of geo-redundant storage.
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md): A tutorial that shows how to build a highly available application that automatically switches between endpoints as failures and recoveries are simulated.

Refer to these best practices to maintain high availability for your Azure Storage data:

- **Disks:** Use [Azure Backup](https://azure.microsoft.com/services/backup/) to back up the VM disks used by your Azure virtual machines. Also consider using [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) to protect your VMs from a regional disaster.
- **Block blobs:** Turn on [soft delete](../blobs/soft-delete-blob-overview.md) to protect against object-level deletions and overwrites, or copy block blobs to another storage account in a different region using [AzCopy](./storage-use-azcopy-v10.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](storage-use-data-movement-library.md).
- **Files:** Use [Azure Backup](../../backup/azure-file-share-backup-overview.md) to back up your file shares. Also enable [soft delete](../files/storage-files-prevent-file-share-deletion.md) to protect against accidental file share deletions. For geo-redundancy when GRS isn't available, use [AzCopy](./storage-use-azcopy-v10.md) or [Azure PowerShell](/powershell/module/az.storage/) to copy your files to another storage account in a different region.
- **Tables:** Use [AzCopy](./storage-use-azcopy-v10.md) to export table data to another storage account in a different region.

## Track outages

Customers can subscribe to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) to track the health and status of Azure Storage and other Azure services.

Microsoft also recommends that you design your application to prepare for the possibility of write failures. Your application should expose write failures in a way that alerts you to the possibility of an outage in the primary region.

## See also

- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md)
- [Azure Storage redundancy](storage-redundancy.md)
- [How customer-managed planned failover (preview) works](storage-failover-customer-managed-planned.md)
- [How customer-managed (unplanned) failover works](storage-failover-customer-managed-unplanned.md)