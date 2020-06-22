---
title: Disaster recovery and storage account failover
titleSuffix: Azure Storage
description: Azure Storage supports account failover for geo-redundant storage accounts. With account failover, you can initiate the failover process for your storage account if the primary endpoint becomes unavailable.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/05/2020
ms.author: tamram
ms.reviewer: artek
ms.subservice: common
---

# Disaster recovery and storage account failover

Microsoft strives to ensure that Azure services are always available. However, unplanned service outages may occur. If your application requires resiliency, Microsoft recommends using geo-redundant storage, so that your data is copied to a second region. Additionally, customers should have a disaster recovery plan in place for handling a regional service outage. An important part of a disaster recovery plan is preparing to fail over to the secondary endpoint in the event that the primary endpoint becomes unavailable.

Azure Storage supports account failover for geo-redundant storage accounts. With account failover, you can initiate the failover process for your storage account if the primary endpoint becomes unavailable. The failover updates the secondary endpoint to become the primary endpoint for your storage account. Once the failover is complete, clients can begin writing to the new primary endpoint.

Account failover is available for general-purpose v1, general-purpose v2, and Blob storage account types with Azure Resource Manager deployments. Account failover is supported for all public regions but is not available in sovereign or national clouds at this time.

This article describes the concepts and process involved with an account failover and discusses how to prepare your storage account for recovery with the least amount of customer impact. To learn how to initiate an account failover in the Azure portal or PowerShell, see [Initiate an account failover](storage-initiate-account-failover.md).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Choose the right redundancy option

Azure Storage maintains multiple copies of your storage account to ensure durability and high availability. Which redundancy option you choose for your account depends on the degree of resiliency you need. For protection against regional outages, configure your account for geo-redundant storage, with or without the option of read access from the secondary region:  

**Geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS)** copies your data asynchronously in two geographic regions that are at least hundreds of miles apart. If the primary region suffers an outage, then the secondary region serves as a redundant source for your data. You can initiate a failover to transform the secondary endpoint into the primary endpoint.

**Read-access geo-redundant storage (RA-GRS) or read-access geo-zone-redundant storage (RA-GZRS)** provides geo-redundant storage with the additional benefit of read access to the secondary endpoint. If an outage occurs in the primary endpoint, applications configured for read access to the secondary and designed for high availability can continue to read from the secondary endpoint. Microsoft recommends RA-GZRS for maximum availability and durability for your applications.

For more information about redundancy in Azure Storage, see [Azure Storage redundancy](storage-redundancy.md).

> [!WARNING]
> Geo-redundant storage carries a risk of data loss. Data is copied to the secondary region asynchronously, meaning there is a delay between when data  written to the primary region is written to the secondary region. In the event of an outage, write operations to the primary endpoint that have not yet been copied to the secondary endpoint will be lost.

## Design for high availability

It's important to design your application for high availability from the start. Refer to these Azure resources for guidance in designing your application and planning for disaster recovery:

- [Designing resilient applications for Azure](/azure/architecture/framework/resiliency/app-design): An overview of the key concepts for architecting highly available applications in Azure.
- [Resiliency checklist](/azure/architecture/checklist/resiliency-per-service): A checklist for verifying that your application implements the best design practices for high availability.
- [Use geo-redundancy to design highly available applications](geo-redundant-design.md): Design guidance for building applications to take advantage of geo-redundant storage.
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md): A tutorial that shows how to build a highly available application that automatically switches between endpoints as failures and recoveries are simulated. 

Additionally, keep in mind these best practices for maintaining high availability for your Azure Storage data:

- **Disks:** Use [Azure Backup](https://azure.microsoft.com/services/backup/) to back up the VM disks used by your Azure virtual machines. Also consider using [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/) to protect your VMs in the event of a regional disaster.
- **Block blobs:** Turn on [soft delete](../blobs/storage-blob-soft-delete.md) to protect against object-level deletions and overwrites, or copy block blobs to another storage account in a different region using [AzCopy](storage-use-azcopy.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](storage-use-data-movement-library.md).
- **Files:** Use [AzCopy](storage-use-azcopy.md) or [Azure PowerShell](/powershell/module/az.storage/) to copy your files to another storage account in a different region.
- **Tables:** use [AzCopy](storage-use-azcopy.md) to export table data to another storage account in a different region.

## Track outages

Customers may subscribe to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/) to track the health and status of Azure Storage and other Azure services.

Microsoft also recommends that you design your application to prepare for the possibility of write failures. Your application should expose write failures in a way that alerts you to the possibility of an outage in the primary region.

## Understand the account failover process

Customer-managed account failover enables you to fail your entire storage account over to the secondary region if the primary becomes unavailable for any reason. When you force a failover to the secondary region, clients can begin writing data to the secondary endpoint after the failover is complete. The failover typically takes about an hour.

### How an account failover works

Under normal circumstances, a client writes data to an Azure Storage account in the primary region, and that data is copied asynchronously to the secondary region. The following image shows the scenario when the primary region is available:

![Clients write data to the storage account in the primary region](media/storage-disaster-recovery-guidance/primary-available.png)

If the primary endpoint becomes unavailable for any reason, the client is no longer able to write to the storage account. The following image shows the scenario where the primary has become unavailable, but no recovery has happened yet:

![The primary is unavailable, so clients cannot write data](media/storage-disaster-recovery-guidance/primary-unavailable-before-failover.png)

The customer initiates the account failover to the secondary endpoint. The failover process updates the DNS entry provided by Azure Storage so that the secondary endpoint becomes the new primary endpoint for your storage account, as shown in the following image:

![Customer initiates account failover to secondary endpoint](media/storage-disaster-recovery-guidance/failover-to-secondary.png)

Write access is restored for geo-redundant accounts once the DNS entry has been updated and requests are being directed to the new primary endpoint. Existing storage service endpoints for blobs, tables, queues, and files remain the same after the failover.

> [!IMPORTANT]
> After the failover is complete, the storage account is configured to be locally redundant in the new primary endpoint. To resume replication to the new secondary, configure the account for geo-redundancy again.
>
> Keep in mind that converting an LRS account to use geo-redundancy incurs a cost. This cost applies to updating the storage account in the new primary region after a failover.  

### Anticipate data loss

> [!CAUTION]
> An account failover usually involves some data loss. It's important to understand the implications of initiating an account failover.  

Because data is written asynchronously from the primary region to the secondary region, there is always a delay before a write to the primary region is copied to the secondary region. If the primary region becomes unavailable, the most recent writes may not yet have been copied to the secondary region.

When you force a failover, all data in the primary region is lost as the secondary region becomes the new primary region and the storage account is configured to be locally redundant. All data already copied to the secondary is maintained when the failover happens. However, any data written to the primary that has not also been copied to the secondary is lost permanently.

The **Last Sync Time** property indicates the most recent time that data from the primary region is guaranteed to have been written to the secondary region. All data written prior to the last sync time  is available on the secondary, while data written after the last sync time may not have been written to the secondary and may be lost. Use this property in the event of an outage to estimate the amount of data loss you may incur by initiating an account failover.

As a best practice, design your application so that you can use the last sync time to evaluate expected data loss. For example, if you are logging all write operations, then you can compare the time of your last write operations to the last sync time to determine which writes have not been synced to the secondary.

For more information about checking the **Last Sync Time** property, see [Check the Last Sync Time property for a storage account](last-sync-time-get.md).

### Use caution when failing back to the original primary

After you fail over from the primary to the secondary region, your storage account is configured to be locally redundant in the new primary region. You can then configure the account for geo-redundancy again. When the account is configured for geo-redundancy again after a failover, the new primary region immediately begins copying data to the new secondary region, which was the primary before the original failover. However, it may take some time before existing data in the primary is fully copied to the new secondary.

After the storage account is reconfigured for geo-redundancy, it's possible to initiate another failover from the new primary back to the new secondary. In this case, the original primary region prior to the failover becomes the primary region again, and is configured to be locally redundant. All data in the post-failover primary region (the original secondary) is then lost. If most of the data in the storage account has not been copied to the new secondary before you fail back, you could suffer a major data loss.

To avoid a major data loss, check the value of the **Last Sync Time** property before failing back. Compare the last sync time to the last times that data was written to the new primary to evaluate expected data loss. 

## Initiate an account failover

You can initiate an account failover from the Azure portal, PowerShell, Azure CLI, or the Azure Storage resource provider API. For more information on how to initiate a failover, see [Initiate an account failover](storage-initiate-account-failover.md).

## Additional considerations

Review the additional considerations described in this section to understand how your applications and services may be affected when you force a failover.

### Storage account containing archived blobs

Storage accounts containing archived blobs support account failover. After failover is complete, all archived blobs need to be rehydrated to an online tier before the account can be configured for geo-redundancy.

### Storage resource provider

After a failover is complete, clients can again read and write Azure Storage data in the new primary region. However, the Azure Storage resource provider does not fail over, so resource management operations must still take place in the primary region. If the primary region is unavailable, you will not be able to perform management operations on the storage account.

Because the Azure Storage resource provider does not fail over, the [Location](/dotnet/api/microsoft.azure.management.storage.models.trackedresource.location) property will return the original primary location after the failover is complete.

### Azure virtual machines

Azure virtual machines (VMs) do not fail over as part of an account failover. If the primary region becomes unavailable, and you fail over to the secondary region, then you will need to recreate any VMs after the failover. Also, there is a potential data loss associated with the account failover. Microsoft recommends the following [high availability](../../virtual-machines/windows/manage-availability.md) and [disaster recovery](../../virtual-machines/virtual-machines-disaster-recovery-guidance.md) guidance specific to virtual machines in Azure.

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

## Unsupported features and services

The following features and services are not supported for account failover:

- Azure File Sync does not support storage account failover. Storage accounts containing Azure file shares being used as cloud endpoints in Azure File Sync should not be failed over. Doing so will cause sync to stop working and may also cause unexpected data loss in the case of newly tiered files.
- ADLS Gen2 storage accounts (accounts that have hierarchical namespace enabled) are not supported at this time.
- A storage account containing premium block blobs cannot be failed over. Storage accounts that support premium block blobs do not currently support geo-redundancy.
- A storage account containing any [WORM immutability policy](../blobs/storage-blob-immutable-storage.md) enabled containers cannot be failed over. Unlocked/locked time-based retention or legal hold policies prevent failover in order to maintain compliance.

## Copying data as an alternative to failover

If your storage account is configured for read access to the secondary, then you can design your application to read from the secondary endpoint. If you prefer not to fail over in the event of an outage in the primary region, you can use tools such as [AzCopy](storage-use-azcopy.md), [Azure PowerShell](/powershell/module/az.storage/), or the [Azure Data Movement library](../common/storage-use-data-movement-library.md) to copy data from your storage account in the secondary region to another storage account in an unaffected region. You can then point your applications to that storage account for both read and write availability.

> [!CAUTION]
> An account failover should not be used as part of your data migration strategy.

## Microsoft-managed failover

In extreme circumstances where a region is lost due to a significant disaster, Microsoft may initiate a regional failover. In this case, no action on your part is required. Until the Microsoft-managed failover has completed, you won't have write access to your storage account. Your applications can read from the secondary region if your storage account is configured for RA-GRS or RA-GZRS.

## See also

- [Use geo-redundancy to design highly available applications](geo-redundant-design.md)
- [Initiate an account failover](storage-initiate-account-failover.md)
- [Check the Last Sync Time property for a storage account](last-sync-time-get.md)
- [Tutorial: Build a highly available application with Blob storage](../blobs/storage-create-geo-redundant-storage.md)
