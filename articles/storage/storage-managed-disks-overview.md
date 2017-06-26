---
title: Azure Premium and Standard Managed Disks Overview | Microsoft Docs
description: Overview of Azure Managed Disks, which handles the storage accounts for you when using Azure VMs
services: storage
documentationcenter: na
author: robinsh
manager: timlt 
editor: tysonn

ms.assetid: 272250b3-fd4e-41d2-8e34-fd8cc341ec87
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/23/2017
ms.author: robinsh

---

# Azure Managed Disks Overview

Azure Managed Disks simplifies disk management for Azure IaaS VMs by managing the [storage accounts](storage-introduction.md) associated with the VM disks. You only have to specify the type ([Premium](storage-premium-storage.md) or [Standard](storage-standard-storage.md)) and the size of disk you need, and Azure creates and manages the disk for you.

>[!NOTE]
>VMs with Managed Disks require outbound traffic on port 8443 to report the status of the installed [VM extensions](../virtual-machines/windows/extensions-features.md) to the Azure platform. Provisioning a VM with extensions will fail without the availability of this port. Also, the deployment status of an extension will be unknown if it is installed on a running VM. If you cannot unblock port 8443, you must use unmanaged disks. We are actively working to fix this issue. Please refer to the [FAQ for IaaS VM Disks](storage-faq-for-disks.md#managed-disks-and-port-8443) for more details. 
>
>

## Benefits of managed disks

Let's take a look at some of the benefits you gain by using managed disks.

### Simple and scalable VM deployment

Managed Disks handles storage for you behind the scenes. Previously, you had to create storage accounts to hold the disks (VHD files) for your Azure VMs. When scaling up, you had to make sure you created additional storage accounts so you didn't exceed the IOPS limit for storage with any of your disks. With Managed Disks handling storage, you are no longer limited by the storage account limits (such as 20,000 IOPS / account). You also no longer have to copy your custom images (VHD files) to multiple storage accounts. You can manage them in a central location – one storage account per Azure region – and use them to create hundreds of VMs in a subscription.

Managed Disks will allow you to create up to 10,000 VM **disks** in a subscription, which will enable you to create thousands of **VMs** in a single subscription. This feature also further increases the scalability of [Virtual Machine Scale Sets (VMSS)](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) by allowing you to create up to a thousand VMs in a VMSS using a Marketplace image.

### Better reliability for Availability Sets

Managed Disks provides better reliability for Availability Sets by ensuring that the disks of VMs in an Availability Set are sufficiently isolated from each other to avoid single points of failure. It does this by automatically placing the disks in different storage scale units (stamps). If a stamp fails due to hardware or software failure, only the VM instances with disks on those stamps fail. For example, let's say you have an application running on five VMs, and the VMs are in an Availability Set. The disks for those VMs won't all be stored in the same stamp, so if one stamp goes down, the other instances of the application continue to run.

### Granular access control

You can use [Azure Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-what-is.md) to assign specific permissions for a managed disk to one or more users. Managed Disks exposes a variety of operations, including read, write (create/update), delete, and retrieving a [shared access signature (SAS) URI](storage-dotnet-shared-access-signature-part-1.md) for the disk. You can grant access to only the operations a person needs to perform his job. For example, if you don't want a person to copy a managed disk to a storage account, you can choose not to grant access to the export action for that managed disk. Similarly, if you don't want a person to use an SAS URI to copy a managed disk, you can choose not to grant that permission to the managed disk.

### Azure Backup service support 
Use Azure Backup service with Managed Disks to create a backup job with time-based backups, easy VM restoration and backup retention policies. Managed Disks only support Locally Redundant Storage (LRS) as the replication option; this means it keeps three copies of the data within a single region. For regional disaster recovery, you must backup your VM disks in a different region using [Azure Backup service](../backup/backup-introduction-to-azure-backup.md) and a GRS storage account as backup vault. Read more about this at [Using Azure Backup service for VMs with Managed Disks](../backup/backup-introduction-to-azure-backup.md#using-managed-disk-vms-with-azure-backup). 

## Pricing and Billing 

When using Managed Disks, the following billing considerations apply:

* Storage Type

* Disk Size

* Number of transactions

* Outbound data transfers

* Managed Disk Snapshots (full disk copy)

Let's take a closer look at these.

**Storage Type:** Managed Disks offers 2 performance tiers:
[Premium](storage-premium-storage.md) (SSD-based) and [Standard](storage-standard-storage.md) (HDD-based). The billing of a managed disk depends on which type of storage you have selected for the disk.


**Disk Size**: Billing for managed disks depends on the provisioned size of the disk. Azure maps the provisioned size (rounded up) to the nearest Managed Disks option as specified in the tables below. Each managed disk maps to one of the supported provisioned sizes and is billed accordingly. For example, if you
create a standard managed disk and specify a provisioned size of 200 GB, you are billed as per the pricing of the S20 Disk type.

Here are the disk sizes available for a premium managed disk:

| **Premium Managed <br>Disk Type**  | **P10** | **P20** | **P30**        |
|------------------|---------|---------|----------------|
| Disk Size        | 128 GB  | 512 GB  | 1024 GB (1 TB) |

Here are the disk sizes available for a standard managed disk: 

| **Standard Managed <br>Disk Type** | **S4**  | **S6**  | **S10**        | **S20** | **S30**        |
|------------------|---------|---------|----------------|---------|----------------|
| Disk Size        | 32 GB   | 64 GB   | 128 GB  | 512 GB  | 1024 GB (1 TB) |

**Number of transactions**: You are billed for the number of transactions that you perform on a standard managed disk. There is no cost for transactions for a premium managed disk.

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage.

**Managed Disk Snapshots (full disk copy)**: A Managed Snapshot is a read-only copy of a managed disk which is stored as a standard managed disk. With snapshots, you can back up your managed disks at any point in time. These 
snapshots exist independent of the source disk and can be used to create new Managed Disks. The cost of a managed snapshot is the same as that for standard managed disk. For example, if you take a snapshot of a 128 GB premium managed disk, then the cost of the managed snapshot is equivalent to a 128 GB standard managed disk.

[Incremental snapshots](storage-incremental-snapshots.md) are currently not supported for Managed Disks, but will be supported in the future.

To learn more about how to create snapshots with Managed Disks, please check out these resources:

* [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../virtual-machines/linux/snapshot-copy-managed-disk.md)


For detailed information on pricing for Managed Disks, see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).

## Images

Managed Disks also support creating a managed custom image. You can create an image from your custom VHD in a storage account or directly from a generalized (sys-prepped) VM. This captures in a single image all managed disks associated with a VM, including both the OS and data disks. This enables creating hundreds of VMs using your custom image without the need to copy or manage any storage accounts.

For information on creating images, please check out the following articles:
* [How to capture a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md)
* [How to generalize and capture a Linux virtual machine using the Azure CLI 2.0](../virtual-machines/linux/capture-image.md)

## Images versus snapshots

You often see the word "image" used with VMs, and now you see "snapshots" as well. It's important to understand the difference between these. With Managed Disks, you can take an image of a generalized VM that has been deallocated. This image will include all of the disks attached to the VM. You can use this image to create a new VM, and it will include all of the disks.

A snapshot is a copy of a disk at the point in time it is taken. It only applies to one disk. If you have a VM that only has one disk (the OS), you can take a snapshot or an image of it and create a VM from either the snapshot or the image.

What if a VM has five disks and they are striped? You could take a snapshot of each of the disks, but there is no awareness within the VM of the state of the disks – the snapshots only know about that one disk. In this case, the snapshots would need to be coordinated with each other, and that is not currently supported.

## Managed Disks and Encryption

There are two kinds of encryption to discuss in reference to managed disks. The first one is Storage Service Encryption (SSE), which is performed by the storage service. The second one is Azure Disk Encryption, which you can enable on the OS and data disks for your VMs. 

### Storage Service Encryption (SSE)

Azure Storage supports automatically encrypting the data written to a storage account. For more details, please refer to [Azure Storage Service Encryption for Data at Rest](storage-service-encryption.md). What about the data on your managed disks? Currently, you can not enable Storage Service Encryption for Managed Disks. However, it will be released in the future. In the meantime, you need to be aware of how to use a VHD file that resides in an encrypted storage account and has itself been encrypted. 

SSE encrypts data as it is written to the storage account. If you have a VHD file that has ever been encrypted with SSE, you cannot use that VHD file to create a VM that uses Managed Disks. You also can't convert an encrypted unmanaged disk into a managed disk. And finally, if you disable encryption on that storage account, it does not go back and decrypt the VHD file. 

To use a disk that has been encrypted, you must first copy the VHD file to a storage account that has never been encrypted. Then you can create a VM with Managed Disks and specify that VHD file during creation, or attach the copied VHD file to a running VM with Managed Disks. 

### Azure Disk Encryption (ADE)

Azure Disk Encryption allows you to encrypt the OS and Data disks used by an IaaS Virtual Machine. This includes managed disks. For Windows, the drives are encrypted using industry-standard BitLocker encryption technology. For Linux, the disks are encrypted using the DM-Crypt technology. This is integrated with Azure Key Vault to allow you to control and manage the disk encryption keys. For more information, please see [Azure Disk Encryption for Windows and Linux IaaS VMs](../security/azure-security-disk-encryption.md).

## Next steps

For more information about Managed Disks, please refer to the following articles.

### Get started with Managed Disks 

* [Create a VM using Resource Manager and PowerShell](../virtual-machines/virtual-machines-windows-ps-create.md)

* [Create a Linux VM using the Azure CLI 2.0](../virtual-machines/linux/quick-create-cli.md)

* [Attach a managed data disk to a Windows VM using PowerShell](../virtual-machines/windows/attach-disk-ps.md)

* [Add a managed disk to a Linux VM](../virtual-machines/linux/add-disk.md)

* [Managed Disks PowerShell Sample Scripts](https://github.com/Azure-Samples/managed-disks-powershell-getting-started)

### Compare Managed Disks storage options 

* [Premium storage and disks](storage-premium-storage.md)

* [Standard storage and disks](storage-standard-storage.md)

### Operational guidance

* [Migrate from AWS and other platforms to Managed Disks in Azure](../virtual-machines/windows/on-prem-to-azure.md)

* [Convert Azure VMs to managed disks in Azure](../virtual-machines/windows/migrate-to-managed-disks.md)
