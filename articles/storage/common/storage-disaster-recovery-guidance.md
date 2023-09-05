---
title: Azure storage account disaster recovery planning
titleSuffix: Azure Storage
description: Azure Storage supports account failover for geo-redundant storage accounts. Create a disaster recovery plan for your storage accounts in the event that the endpoints in the primary region become unavailable.
services: storage
author: jimmart-dev

ms.service: azure-storage
ms.topic: conceptual
ms.date: 09/05/2023
ms.author: jammart
ms.subservice: storage-common-concepts
ms.custom: references_regions
---

# Azure storage account disaster recovery planning

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages may occur. Key components of a good disaster recovery plan include strategies for:

- [Data protection](../blobs/data-protection-overview.md)
- [Backup and restore](/../backup/index.yml)
- [Data redundancy](storage-redundancy.md) and [failover](storage-failover-overview.md)
- Designing applications for high availability

This article focuses on data redundancy and failover, and how to design your applications to be highly available in the event of an outage and subsequent failover.

## Choose the right redundancy option

Azure Storage maintains multiple copies of your storage account to ensure durability and high availability. Which redundancy option you choose for your account depends on the degree of resiliency you need for your applications.

With locally-redundant storage (LRS), three copies of your storage account are automatically stored and replicated within a single datacenter. With zone-redundant storage (ZRS), a copy is stored and replicated in each of three separate availability zones within the same region. For more information about availability zones, see [Azure availability zones](../../availability-zones/az-overview.md).

Recovery of a single copy of a storage account occurs automatically with LRS and ZRS.

With globally-redundant storage (GRS and GZRS), your data is asynchronously copied to a secondary geographic region at least hundreds of miles away to allow you to recover your data in the event of an outage in the primary region. A feature that distinguishes globally-redundant storage from LRS and ZRS is the ability to fail over to the secondary region in the event of an outage in the primary region. The process of failing over updates the secondary storage service endpoints to become the new primary endpoints for your storage account. Once the failover is complete, clients can begin writing to the new primary endpoints.

For additional access to your data in the event of an outage, RA-GRS and RA-GZRS redundancy configurations provide geo-redundant storage with the additional benefit of read access to the secondary endpoint. If an outage occurs in the primary endpoint, applications configured for read access to the secondary region and designed for high availability can continue to read from the secondary endpoint. Microsoft recommends RA-GZRS for maximum availability and durability of your storage accounts.

For more information about redundancy in Azure Storage, see [Azure Storage redundancy](storage-redundancy.md).

## Design for high availability

It's important to design your application for high availability from the start. Refer to these Azure resources for guidance in designing your application and planning for disaster recovery:

- [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design): An overview of the key concepts for architecting highly available applications in Azure.
- [Resiliency checklist](/azure/architecture/checklist/resiliency-per-service): A checklist for verifying that your application implements the best design practices for high availability.
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md): Design guidance for building applications to take advantage of geo-redundant storage.
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md): A tutorial that shows how to build a highly available application that automatically switches between endpoints as failures and recoveries are simulated.

Additionally, keep in mind these best practices for maintaining high availability for your Azure Storage data:

- **Disks:** Use [Azure Backup](https://azure.microsoft.com/services/backup/) to back up the VM disks used by your Azure virtual machines. Also consider using [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) to protect your VMs in the event of a regional disaster.
- **Block blobs:** Turn on [soft delete](../blobs/soft-delete-blob-overview.md) to protect against object-level deletions and overwrites, or copy block blobs to another storage account in a different region using [AzCopy](./storage-use-azcopy-v10.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](storage-use-data-movement-library.md).
- **Files:** Use [Azure Backup](../../backup/azure-file-share-backup-overview.md) to back up your file shares. Also enable [soft delete](../files/storage-files-prevent-file-share-deletion.md) to protect against accidental file share deletions. For geo-redundancy when GRS is not available, use [AzCopy](./storage-use-azcopy-v10.md) or [Azure PowerShell](/powershell/module/az.storage/) to copy your files to another storage account in a different region.
- **Tables:** use [AzCopy](./storage-use-azcopy-v10.md) to export table data to another storage account in a different region.

## Track outages

Customers may subscribe to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) to track the health and status of Azure Storage and other Azure services.

Microsoft also recommends that you design your application to prepare for the possibility of write failures. Your application should expose write failures in a way that alerts you to the possibility of an outage in the primary region.

## Understand the failover process

To fully understand the impact that customer-managed account failover would have on your users and applications, it is helpful to know what happens during every step of the failover and failback process. For details about how the process works, see [How customer-managed storage account failover works](storage-failover-customer-managed-unplanned.md).

## Anticipate data loss and inconsistencies

> [!CAUTION]
> Storage account failover usually involves some data loss, and potentially file and data inconsistencies. In your disaster recovery plan, it's important to consider the impact that an account failover would have on your data before initiating one.

Because data is written asynchronously from the primary region to the secondary region, there is always a delay before a write to the primary region is copied to the secondary. If the primary region becomes unavailable, the most recent writes may not yet have been copied to the secondary.

When you force a failover, all data in the primary region is lost as the secondary region becomes the new primary region. The new primary region is configured to be locally redundant after the failover.

All data already copied to the secondary is maintained when the failover happens. However, any data written to the primary that has not also been copied to the secondary region is lost permanently.

Additionally, you might experience file or data inconsistencies if your storage accounts have one or more of the following enabled:

- Hierarchical namespace (Azure Data Lake Storage Gen2).
- [Change feed](../blobs/storage-blob-change-feed.md).
- [Point-in-time restore for block blobs](../blobs/point-in-time-restore-overview.md).

For more details about how to handle these scenarios, see [Data loss and inconsistencies](storage-failover-overview.md#data-loss-and-inconsistencies).

## Supported storage account types

All geo-redundant offerings support [Microsoft-managed failover](storage-failover-overview.md#microsoft-managed-failover) in the event of a disaster in the primary region. However, limitations apply to the types of storage accounts that support customer-managed failover. For more details, see [Supported storage account types](storage-failover-overview.md#supported-storage-account-types).

## Additional considerations

Review the additional considerations described in this section to understand how your applications and services may be affected when you force a failover.

### Storage account containing archived blobs

Storage accounts containing archived blobs support account failover. After failover is complete, all archived blobs need to be rehydrated to an online tier before the account can be configured for geo-redundancy.

### Storage resource provider

Microsoft provides two REST APIs for working with Azure Storage resources. These APIs form the basis of all actions you can perform against Azure Storage. The Azure Storage REST API enables you to work with data in your storage account, including blob, queue, file, and table data. The Azure Storage resource provider REST API enables you to manage the storage account and related resources.

After a failover is complete, clients can again read and write Azure Storage data in the new primary region. However, the Azure Storage resource provider does not fail over, so resource management operations must still take place in the primary region. If the primary region is unavailable, you will not be able to perform management operations on the storage account.

Because the Azure Storage resource provider does not fail over, the [Location](/dotnet/api/microsoft.azure.management.storage.models.trackedresource.location) property will return the original primary location after the failover is complete.

### Azure virtual machines

Azure virtual machines (VMs) do not fail over as part of an account failover. If the primary region becomes unavailable, and you fail over to the secondary region, then you will need to recreate any VMs after the failover. Also, there is a potential data loss associated with the account failover. Microsoft recommends the following [high availability](../../virtual-machines/availability.md) and [disaster recovery](../../virtual-machines/backup-recovery.md) guidance specific to virtual machines in Azure.

### Azure unmanaged disks

As a best practice, Microsoft recommends converting unmanaged disks to managed disks. However, if you need to fail over an account that contains unmanaged disks attached to Azure VMs, you will need to shut down the VM before initiating the failover.

Unmanaged disks are stored as page blobs in Azure Storage. When a VM is running in Azure, any unmanaged disks attached to the VM are leased. An account failover cannot proceed when there is a lease on a blob. To perform the failover, follow these steps:

1. Before you begin, note the names of any unmanaged disks, their logical unit numbers (LUN), and the VM to which they are attached. Doing so will make it easier to reattach the disks after the failover.
2. Shut down the VM.
3. Delete the VM, but retain the VHD files for the unmanaged disks. Note the time at which you deleted the VM.
4. Wait until the **Last Sync Time** has updated, and is later than the time at which you deleted the VM. This step is important, because if the secondary endpoint has not been fully updated with the VHD files when the failover occurs, then the VM may not function properly in the new primary region.
5. Initiate the account failover.
6. Wait until the account failover is complete and the secondary region has become the new primary region.
7. Create a VM in the new primary region and reattach the VHDs.
8. Start the new VM.

Keep in mind that any data stored in a temporary disk is lost when the VM is shut down.

### Copying data as an alternative to failover

If your storage account is configured for read access to the secondary, then you can design your application to read from the secondary endpoint. If you prefer not to fail over in the event of an outage in the primary region, you can use tools such as [AzCopy](./storage-use-azcopy-v10.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](../common/storage-use-data-movement-library.md) to copy data from your storage account in the secondary region to another storage account in an unaffected region. You can then point your applications to that storage account for both read and write availability.

## See also

- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md)
- [Azure storage account failover overview](storage-failover-overview.md)
- [Azure Storage redundancy](storage-redundancy.md)
