---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/03/2018
 ms.author: rogarana
 ms.custom: include file
---
# Azure Managed Disks Overview

Azure Managed Disks simplifies disk management for Azure IaaS VMs by managing the [storage accounts](../articles/storage/common/storage-introduction.md) associated with the VM disks. You only have to specify the type ([Standard HDD](../articles/virtual-machines/windows/standard-storage.md), [Standard SSD](../articles/virtual-machines/windows/disks-standard-ssd.md), or [Premium SSD](../articles/virtual-machines/windows/premium-storage.md)) and the size of disk you need, and Azure creates and manages the disk for you.

## Benefits of managed disks

Let's take a look at some of the benefits you gain by using managed disks, starting with this Channel 9 video, [Better Azure VM Resiliency with Managed Disks](https://channel9.msdn.com/Blogs/Azure/Managed-Disks-for-Azure-Resiliency).
<br/>
> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Managed-Disks-for-Azure-Resiliency/player]

### Simple and scalable VM deployment

Managed Disks handles storage for you behind the scenes. Previously, you had to create storage accounts to hold the disks (VHD files) for your Azure VMs. When scaling up, you had to make sure you created additional storage accounts so you didn't exceed the IOPS limit for storage with any of your disks. With Managed Disks handling storage, you are no longer limited by the storage account limits (such as 20,000 IOPS / account). You also no longer have to copy your custom images (VHD files) to multiple storage accounts. You can manage them in a central location – one storage account per Azure region – and use them to create hundreds of VMs in a subscription.

Managed Disks will allow you to create up to 50,000 VM **disks** of a type in a subscription per region, which will enable you to create thousands of **VMs** in a single subscription. This feature also further increases the scalability of [Virtual Machine Scale Sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) by allowing you to create up to a thousand VMs in a virtual machine scale set using a Marketplace image.

### Better reliability for Availability Sets

Managed Disks provides better reliability for Availability Sets by ensuring that the disks of [VMs in an Availability Set](../articles/virtual-machines/windows/manage-availability.md#use-managed-disks-for-vms-in-an-availability-set) are sufficiently isolated from each other to avoid single points of failure. Disks are automatically placed in different storage scale units (stamps). If a stamp fails due to hardware or software failure, only the VM instances with disks on those stamps fail. For example, let's say you have an application running on five VMs, and the VMs are in an Availability Set. The disks for those VMs won't all be stored in the same stamp, so if one stamp goes down, the other instances of the application continue to run.

### Highly durable and available

Azure Disks are designed for 99.999% availability. Rest easier knowing that you have three replicas of your data that enables high durability. If one or even two replicas experience issues, the remaining replicas help ensure persistence of your data and high tolerance against failures. This architecture has helped Azure consistently deliver enterprise-grade durability for IaaS disks, with an industry-leading ZERO% Annualized Failure Rate. 

### Granular access control

You can use [Azure Role-Based Access Control (RBAC)](../articles/role-based-access-control/overview.md) to assign specific permissions for a managed disk to one or more users. Managed Disks exposes a variety of operations, including read, write (create/update), delete, and retrieving a [shared access signature (SAS) URI](../articles/storage/common/storage-dotnet-shared-access-signature-part-1.md) for the disk. You can grant access to only the operations a person needs to perform their job. For example, if you don't want a person to copy a managed disk to a storage account, you can choose not to grant access to the export action for that managed disk. Similarly, if you don't want a person to use an SAS URI to copy a managed disk, you can choose not to grant that permission to the managed disk.

### Azure Backup service support

Use Azure Backup service with Managed Disks to create a backup job with time-based backups, easy VM restoration, and backup retention policies. Managed Disks only support Locally Redundant Storage (LRS) as the replication option. Three copies of the data are kept within a single region. For regional disaster recovery, you must back up your VM disks in a different region using [Azure Backup service](../articles/backup/backup-introduction-to-azure-backup.md) and a GRS storage account as backup vault. Currently Azure Backup supports the disk sizes up to 4TB disks. You need to [upgrade VM backup stack to V2](../articles/backup/backup-upgrade-to-vm-backup-stack-v2.md) for support of 4TB disks. For more information, see [Using Azure Backup service for VMs with Managed Disks](../articles/backup/backup-introduction-to-azure-backup.md#using-managed-disk-vms-with-azure-backup).

## Pricing and Billing

When using Managed Disks, the following billing considerations apply:

* Storage Type

* Disk Size

* Number of transactions

* Outbound data transfers

* Managed Disk Snapshots (full disk copy)

Let's take a closer look at these options.

**Storage Type:** Managed Disks offers 3 performance tiers: [Standard HDD](../articles/virtual-machines/windows/standard-storage.md), [Standard SSD](../articles/virtual-machines/windows/disks-standard-ssd.md), and [Premium](../articles/virtual-machines/windows/premium-storage.md). The billing of a managed disk depends on which type of storage you have selected for the disk.

**Disk Size**: Billing for managed disks depends on the provisioned size of the disk. Azure maps the provisioned size (rounded up) to the nearest Managed Disks option as specified in the tables below. Each managed disk maps to one of the supported provisioned sizes and is billed accordingly. For example, if you
create a standard managed disk and specify a provisioned size of 200 GB, you are billed as per the pricing of the S15 Disk type.

Here are the disk sizes available for a premium managed disk:

| **Premium HDD Managed <br>Disk Type** | **P4** | **P6** | **P10** | **P15** | **P20** | **P30** | **P40** | **P50** | **P60** | **P70** | **P80** |
|------------------|---------|---------|--------|--------|--------|----------------|----------------|----------------|----------------|----------------|----------------|
| Disk Size        | 32 GiB  | 64 GiB  | 128 GiB | 256 GiB | 512 GiB | 1,024 GiB (1 TiB) | 2,048 GiB (2 TiB) | 4,095 GiB (4 TiB) | 8,192 GiB (8 TiB) | 16,384 GiB (16 TiB) | 32,767 GiB (TiB) |

Here are the disk sizes available for a standard SSD managed disk:

| **Standard SSD Managed <br>Disk Type** | **E10** | **E15** | **E20** | **E30** | **E40** | **E50** | **E60** | **E70** | **E80** |
|------------------|--------|--------|--------|----------------|----------------|----------------|----------------|----------------|----------------|
| Disk Size        | 128 GiB | 256 GiB | 512 GiB | 1,024 GiB (1 TiB) | 2,048 GiB (2 TiB) | 4,095 GiB (4 TiB) | 8,192 GiB (8 TiB) | 16,384 GiB (16 TiB) | 32,767 GiB (TiB) |

Here are the disk sizes available for a standard HDD managed disk:

| **Standard HDD Managed <br>Disk Type** | **S4** | **S6** | **S10** | **S15** | **S20** | **S30** | **S40** | **S50** | **S60** | **S70** | **S80** |
|------------------|---------|---------|--------|--------|--------|----------------|----------------|----------------|----------------|----------------|----------------|
| Disk Size        | 32 GiB  | 64 GiB  | 128 GiB | 256 GiB | 512 GiB | 1,024 GiB (1 TiB) | 2,048 GiB (2 TiB) | 4,095 GiB (4 TiB) | 8,192 GiB (8 TiB) | 16,384 GiB (16 TiB) | 32,767 GiB (TiB) |

**Number of transactions**: You are billed for the number of transactions that you perform on a standard managed disk.

Standard SSD Disks use IO Unit size of 256KB. If the data being transferred is less than 256 KB, it is considered 1 I/O unit. Larger I/O sizes are counted as multiple I/Os of size 256 KB. For example, a 1,100 KB I/O is counted as five I/O units.

There is no cost for transactions for a premium managed disk.

**Outbound data transfers**: [Outbound data transfers](https://azure.microsoft.com/pricing/details/data-transfers/) (data going out of Azure data centers) incur billing for bandwidth usage.

For detailed information on pricing for Managed Disks, see [Managed Disks Pricing](https://azure.microsoft.com/pricing/details/managed-disks).


## Managed Disk Snapshots

A Managed Snapshot is a read-only full copy of a managed disk that is stored as a standard managed disk by default. With snapshots, you can back up your managed disks at any point in time. These snapshots exist independent of the source disk and can be used to create new Managed Disks. They are billed based on the used size. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GiB and actual used data size of 10 GiB, snapshot will be billed only for the used data size of 10 GiB.  

[Incremental snapshots](../articles/virtual-machines/windows/incremental-snapshots.md) are currently not supported for Managed Disks.

To learn more about how to create snapshots with Managed Disks, see the following resources:

* [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../articles/virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../articles/virtual-machines/linux/snapshot-copy-managed-disk.md)

## Images

Managed Disks also support creating a managed custom image. You can create an image from your custom VHD in a storage account or directly from a generalized (sys-prepped) VM. This process captures in a single image all managed disks associated with a VM, including both the OS and data disks. This managed custom image enables creating hundreds of VMs using your custom image without the need to copy or manage any storage accounts.

For information on creating images, see the following articles:

* [How to capture a managed image of a generalized VM in Azure](../articles/virtual-machines/windows/capture-image-resource.md)
* [How to generalize and capture a Linux virtual machine using the Azure CLI](../articles/virtual-machines/linux/capture-image.md)

## Images versus snapshots

You often see the word "image" used with VMs, and now you see "snapshots" as well. It's important to understand the difference between these terms. With Managed Disks, you can take an image of a generalized VM that has been deallocated. This image will include all of the disks attached to the VM. You can use this image to create a new VM, and it will include all of the disks.

A snapshot is a copy of a disk at the point in time it is taken. It only applies to one disk. If you have a VM that only has one disk (the OS), you can take a snapshot or an image of it and create a VM from either the snapshot or the image.

What if a VM has five disks and they are striped? You could take a snapshot of each of the disks, but there is no awareness within the VM of the state of the disks – the snapshots only know about that one disk. In this case, the snapshots would need to be coordinated with each other, and that is not currently supported.

## Managed Disks and Encryption

There are two kinds of encryption to discuss in reference to managed disks. The first one is Storage Service Encryption (SSE), which is performed by the storage service. The second one is Azure Disk Encryption, which you can enable on the OS and data disks for your VMs.

### Storage Service Encryption (SSE)

[Azure Storage Service Encryption](../articles/storage/common/storage-service-encryption.md) provides encryption-at-rest and safeguard your data to meet your organizational security and compliance commitments. SSE is enabled by default for all Managed Disks, Snapshots, and Images in all the regions where managed disks are available. Starting June 10th, 2017, all new managed disks/snapshots/images and new data written to existing managed disks are automatically encrypted-at-rest with keys managed by Microsoft by default. Visit the [Managed Disks FAQ page](../articles/virtual-machines/windows/faq-for-disks.md#managed-disks-and-storage-service-encryption) for more details.

### Azure Disk Encryption (ADE)

Azure Disk Encryption allows you to encrypt the OS and Data disks used by an IaaS Virtual Machine. This encryption includes managed disks. For Windows, the drives are encrypted using industry-standard BitLocker encryption technology. For Linux, the disks are encrypted using the DM-Crypt technology. The encryption process is integrated with Azure Key Vault to allow you to control and manage the disk encryption keys. For more information, see [Azure Disk Encryption for Windows and Linux IaaS VMs](../articles/security/azure-security-disk-encryption.md).

## Next steps

For more information about Managed Disks, please refer to the following articles.

### Get started with Managed Disks

* [Create a VM using Resource Manager and PowerShell](../articles/virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm.md)

* [Create a Linux VM using the Azure CLI](../articles/virtual-machines/linux/quick-create-cli.md)

* [Attach a managed data disk to a Windows VM using PowerShell](../articles/virtual-machines/windows/attach-disk-ps.md)

* [Add a managed disk to a Linux VM](../articles/virtual-machines/linux/add-disk.md)

* [Managed Disks PowerShell Sample Scripts](https://github.com/Azure-Samples/managed-disks-powershell-getting-started)

* [Use Managed Disks in Azure Resource Manager templates](../articles/virtual-machines/windows/using-managed-disks-template-deployments.md)

### Compare Managed Disks storage options

* [Premium SSD disks](../articles/virtual-machines/windows/premium-storage.md)

* [Standard SSD and HDD disks](../articles/virtual-machines/windows/standard-storage.md)

### Operational guidance

* [Migrate from AWS and other platforms to Managed Disks in Azure](../articles/virtual-machines/windows/on-prem-to-azure.md)

* [Convert Azure VMs to managed disks in Azure](../articles/virtual-machines/windows/migrate-to-managed-disks.md)
