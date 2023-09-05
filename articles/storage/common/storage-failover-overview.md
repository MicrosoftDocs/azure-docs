---
title: Azure storage account failover overview
titleSuffix: Azure Storage
description: Azure Storage supports account failover for geo-redundant storage accounts. With account failover, you can initiate the failover process for your storage account if the primary storage service endpoints become unavailable, or to perform disaster recovery testing.
services: storage
author: jimmart-dev

ms.service: azure-storage
ms.topic: conceptual
ms.date: 09/05/2023
ms.author: jammart
ms.subservice: storage-common-concepts
ms.custom: 
---

# Azure storage account failover overview

Azure Storage supports account failover for geo-redundant storage accounts. With account failover, you can initiate the failover process for your storage account if the primary storage service endpoints become unavailable. The failover updates the DNS entries for the storage service endpoints such that the endpoints for the secondary region become the new primary endpoints for your storage account. Once the failover is complete, clients can begin writing to the new primary endpoints.

This article describes the failover options available for your storage accounts, and identifies what you should consider about failover to minimize the impact to your users.

> [!CAUTION]
> Storage account failover usually involves some data loss, and potentially file and data inconsistencies. In your [disaster recovery plan](storage-disaster-recovery-guidance.md), it's important to consider the impact that an account failover would have on your data before initiating one. For more details, see [Data loss and inconsistencies](#data-loss-and-inconsistencies).

## Failover options

Azure Storage accounts support two types of failover:

- [**Customer-managed failover**](#customer-managed-failover) - Customers can manage storage account failover in the event of unexpected service outages.
- [**Microsoft-managed failover**](#microsoft-managed-failover) - Initiated by Microsoft only in the case of a severe disaster in a primary region.

Your disaster recovery plan should be based on customer-managed failover. Do not rely on Microsoft-managed failover, which would only be used in extreme circumstances.

Each type of failover has a unique set of use cases, corresponding expectations for data loss, and support for accounts with a hierarchical namespace enabled (Azure Data Lake Storage Gen2). Those are summarized in the table below for each type of failover :

| Type                               | Failover Scope  | Use case | Expected data loss | HNS supported |
|------------------------------------|-----------------|----------|---------------------|---------------|
| Customer-managed                   | Storage account | The storage service endpoints for the primary region become unavailable, but the secondary region is available. <br></br> An Azure Advisory in which Microsoft advises you to perform a failover operation of storage accounts potentially affected by an outage. | [Yes](#data-loss-and-inconsistencies) | [Yes *(In preview)*](#azure-data-lake-storage-gen2) |
| Microsoft-managed                  | Entire region, datacenter or scale unit   | The primary region becomes completely unavailable due to a significant disaster, but the secondary region is available. | [Yes](#data-loss-and-inconsistencies) | [Yes](#azure-data-lake-storage-gen2) |

### Customer-managed failover

If the data endpoints for the storage services in your storage account become unavailable in the primary region, you can fail over to the secondary region. After the failover is complete, the secondary region becomes the new primary and users can proceed to access data in the new primary region.

To fully understand the impact that customer-managed account failover would have on your users and applications, it is helpful to know what happens during every step of the failover and failback process. For details about how the process works, see [How customer-managed storage account failover works](storage-failover-customer-managed-unplanned.md).

### Microsoft-managed failover

In extreme circumstances where the original primary region is deemed unrecoverable within a reasonable amount of time due to a major disaster, Microsoft may initiate a regional failover. In this case, no action on your part is required. Until the Microsoft-managed failover has completed, you won't have write access to your storage account. Your applications can read from the secondary region if your storage account is configured for RA-GRS or RA-GZRS.

> [!NOTE]
> A Microsoft-managed failover would be initiated for an entire physical unit, such as a region, datacenter or scale unit. It cannot be initiated for individual storage accounts, subscriptions, or tenants. For the ability to selectively failover your individual storage accounts, use [customer-managed account failover](#customer-managed-failover). Customers should not rely on Microsoft-managed failover as part of their disaster recovery plan. Instead, create a plan that relies primarily on customer-managed failover.

## Data loss and inconsistencies

> [!CAUTION]
> Storage account failover usually involves some data loss, and potentially file and data inconsistencies. In your [disaster recovery plan](storage-disaster-recovery-guidance.md), it's important to consider the impact that an account failover would have on your data before initiating one.

Because data is written asynchronously from the primary region to the secondary region, there is always a delay before a write to the primary region is copied to the secondary. If the primary region becomes unavailable, the most recent writes may not yet have been copied to the secondary.

When you force a failover, all data in the primary region is lost as the secondary region becomes the new primary region. All data already copied to the secondary is maintained when the failover happens. However, any data written to the primary that has not also been copied to the secondary region is lost permanently.

The new primary region is configured to be locally redundant (LRS) after the failover.

### Last sync time

The **Last Sync Time** property indicates the most recent time that data from the primary region is guaranteed to have been written to the secondary region. For accounts that have a hierarchical namespace, the same **Last Sync Time** property also applies to the metadata managed by the hierarchical namespace, including ACLs. All data and metadata written prior to the last sync time is available on the secondary, while data and metadata written after the last sync time may not have been written to the secondary, and may be lost. Use this property in the event of an outage to estimate the amount of data loss you may incur by initiating an account failover.

As a best practice, design your application so that you can use the last sync time to evaluate expected data loss. For example, if you are logging all write operations, then you can compare the time of your last write operations to the last sync time to determine which writes have not been synced to the secondary.

For more information about checking the **Last Sync Time** property, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

### File consistency for Azure Data Lake Storage Gen2

Replication for storage accounts with a hierarchical namespace enabled (Azure Data Lake Storage Gen2) occurs at the file level. This means if an outage in the primary region occurs, it is possible that only some of the files in a container or directory might have successfully replicated to the secondary region. Consistency for all files in a container or directory after a storage account failover is not guaranteed.

### Change feed and blob data inconsistencies

Storage account failover of geo-redundant storage accounts with [change feed](../blobs/storage-blob-change-feed.md) enabled may result in inconsistencies between the change feed logs and the blob data and/or metadata. Such inconsistencies can result from the asynchronous nature of both updates to the change logs and the replication of blob data from the primary to the secondary region. The only situation in which inconsistencies would not be expected is when all of the current log records have been successfully flushed to the log files, and all of the storage data has been successfully replicated from the primary to the secondary region.

For information about how change feed works see [How the change feed works](../blobs/storage-blob-change-feed.md#how-the-change-feed-works).

Keep in mind that other storage account features require the change feed to be enabled such as [operational backup of Azure Blob Storage](../../backup/blob-backup-support-matrix.md#limitations), [Object replication](../blobs/object-replication-overview.md) and [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md).

### Point-in-time restore

Customer-managed failover is supported for general-purpose v2 standard tier storage accounts that include block blobs. However, performing a customer-managed failover on a storage account resets the earliest possible restore point for the account. Data for [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md) is only consistent up to the failover completion time. As a result, you can only restore block blobs to a point in time no earlier than the failover completion time. You can check the failover completion time in the redundancy tab of your storage account in the Azure Portal.

For example, suppose you have set the retention period to 30 days. If more than 30 days have elapsed since the failover, then you can restore to any point within that 30 days. However, if fewer than 30 days have elapsed since the failover, then you can't restore to a point prior to the failover, regardless of the retention period. For example, if it's been 10 days since the failover, then the earliest possible restore point is 10 days in the past, not 30 days in the past.

## The time and cost of failing over

The time it takes for failover to complete after being initiated can vary, although it typically takes less than one hour.

A customer-managed failover loses its geo-redundancy after a failover (and failback). Your storage account is automatically converted to locally redundant storage (LRS) in the new primary region during a failover, and the storage account in the original primary region is deleted. You can re-enable geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) for the account, but note that converting from LRS to GRS or RA-GRS incurs an additional cost. The cost is due to the network egress charges to re-replicate the data to the new secondary region. For additional information, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/).

After you re-enable GRS for your storage account, Microsoft begins replicating the data in your account to the new secondary region. Replication time depends on many factors, which include:

- The number and size of the objects in the storage account. Replicating many small objects can take longer than replicating fewer and larger objects.
- The available resources for background replication, such as CPU, memory, disk, and WAN capacity. Live traffic takes priority over geo replication.
- If your storage account contains blobs, the number of snapshots per blob.
- If your storage account contains tables, the [data partitioning strategy](/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage). The replication process can't scale beyond the number of partition keys that you use.

## Supported storage account types

All geo-redundant offerings support Microsoft-managed failover. In addition, some account types support customer-managed account failover, as shown in the following table:

| Type of failover | GRS/RA-GRS | GZRS/RA-GZRS |
|---|---|---|
| **Customer-managed failover** | General-purpose v2 accounts</br> General-purpose v1 accounts</br> Legacy Blob Storage accounts | General-purpose v2 accounts |
| **Microsoft-managed failover** | All account types | General-purpose v2 accounts |

### Classic storage accounts

> [!IMPORTANT]
> Customer-managed account failover is only supported for storage accounts deployed using the Azure Resource Manager (ARM) deployment model. The Azure Service Manager (ASM) deployment model, also known as *classic*, is not supported. To make classic storage accounts eligible for customer-managed account failover, they must first be [migrated to the ARM model](classic-account-migration-overview.md). Your storage account must be accessible to perform the upgrade, so the primary region cannot currently be in a failed state.
>
> In the event of a disaster that affects the primary region, Microsoft will manage the failover for classic storage accounts. For more information, see [Microsoft-managed failover](storage-failover-overview.md#microsoft-managed-failover).

### Azure Data Lake Storage Gen2

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
> In the event of a significant disaster that affects the primary region, Microsoft will manage the failover for accounts with a hierarchical namespace. For more information, see [Microsoft-managed failover](#microsoft-managed-failover).

## Unsupported features and services

The following features and services are not supported for account failover:

- Azure File Sync does not support storage account failover. Storage accounts containing Azure file shares being used as cloud endpoints in Azure File Sync should not be failed over. Doing so will cause sync to stop working and may also cause unexpected data loss in the case of newly tiered files.
- A storage account containing premium block blobs cannot be failed over. Storage accounts that support premium block blobs do not currently support geo-redundancy.
- A storage account containing any [WORM immutability policy](../blobs/immutable-storage-overview.md) enabled containers cannot be failed over. Unlocked/locked time-based retention or legal hold policies prevent failover in order to maintain compliance.
- Customer-managed failover isn't supported for either the source or the destination account in an [object replication policy](../blobs/object-replication-overview.md).
- To failover an account with SSH File Transfer Protocol (SFTP) enabled, you must first [disable SFTP for the account](../blobs/secure-file-transfer-protocol-support-how-to.md#disable-sftp-support). If you want to resume using SFTP after the failover is complete, simply [re-enable it](../blobs/secure-file-transfer-protocol-support-how-to.md#enable-sftp-support).
- Network File System (NFS) 3.0 (NFSv3) is not supported for storage account failover. You cannot create a storage account configured for global-redundancy with NFSv3 enabled.

## Additional considerations

Review the additional considerations described in this section to understand how your applications and services may be affected when you force a failover.

### Failover is not for account migration

Storage account failover should not be used as part of your data migration strategy. Failover is a temporary solution to a service outage. For information about how to  migrate your storage accounts, see [Azure Storage migration overview](storage-migration-overview.md).

### Storage account containing archived blobs

Storage accounts containing archived blobs support account failover. However, after a [customer-managed failover](#customer-managed-failover) is complete, all archived blobs need to be rehydrated to an online tier before the account can be configured for geo-redundancy.

### Storage resource provider

Microsoft provides two REST APIs for working with Azure Storage resources. These APIs form the basis of all actions you can perform against Azure Storage. The Azure Storage REST API enables you to work with data in your storage account, including blob, queue, file, and table data. The Azure Storage resource provider REST API enables you to manage the storage account and related resources.

As part of a failover, the Azure Storage resource provider fails over too. As a result, resource management operations can occur in the new primary region after the failover. The [Location](/dotnet/api/microsoft.azure.management.storage.models.trackedresource.location) property will return the new primary location as well.

### Azure virtual machines

Azure virtual machines (VMs) do not fail over as part of an account failover. If the primary region becomes unavailable, and you fail over to the secondary region, then you will need to recreate any VMs after the failover. Also, there is a potential data loss associated with the account failover. Microsoft recommends following [high availability](../../virtual-machines/availability.md) and [disaster recovery](../../virtual-machines/backup-recovery.md) guidance specific to virtual machines in Azure.

Keep in mind that any data stored in a temporary disk is lost when the VM is shut down.

### Azure unmanaged disks

Microsoft does not support mounting unmanaged disks after a failover. If your storage account contains unmanaged disks, Microsoft recommends converting them to managed disks before failing over.

## Copying data as an alternative to failover

If your storage account is configured for read access to the secondary region, then you can design your application to read from the secondary endpoint. If you prefer not to fail over in the event of an outage in the primary region, you can use tools such as [AzCopy](./storage-use-azcopy-v10.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](../common/storage-use-data-movement-library.md) to copy data from your storage account in the secondary region to another storage account in an unaffected region. You can then point your applications to that storage account for both read and write availability.

## See also

- [How customer-managed storage account failover works](storage-failover-customer-managed-unplanned.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
- [Azure storage account disaster recovery planning](storage-disaster-recovery-guidance.md)
- [Azure Storage redundancy](storage-redundancy.md)
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
