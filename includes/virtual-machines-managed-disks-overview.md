---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/24/2020
 ms.author: rogarana
 ms.custom: include file
---

## Benefits of managed disks

Let's go over some of the benefits you gain by using managed disks.

### Highly durable and available

Managed disks are designed for 99.999% availability. Managed disks achieve this by providing you with three replicas of your data, allowing for high durability. If one or even two replicas experience issues, the remaining replicas help ensure persistence of your data and high tolerance against failures. This architecture has helped Azure consistently deliver enterprise-grade durability for infrastructure as a service (IaaS) disks, with an industry-leading ZERO% annualized failure rate.

### Simple and scalable VM deployment

Using managed disks, you can create up to 50,000 VM **disks** of a type in a subscription per region, allowing you to create thousands of **VMs** in a single subscription. This feature also further increases the scalability of [virtual machine scale sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) by allowing you to create up to 1,000 VMs in a virtual machine scale set using a Marketplace image.

### Integration with availability sets

Managed disks are integrated with availability sets to ensure that the disks of [VMs in an availability set](../articles/virtual-machines/windows/manage-availability.md#use-managed-disks-for-vms-in-an-availability-set) are sufficiently isolated from each other to avoid a single point of failure. Disks are automatically placed in different storage scale units (stamps). If a stamp fails due to hardware or software failure, only the VM instances with disks on those stamps fail. For example, let's say you have an application running on five VMs, and the VMs are in an Availability Set. The disks for those VMs won't all be stored in the same stamp, so if one stamp goes down, the other instances of the application continue to run.

### Integration with Availability Zones

Managed disks support [Availability Zones](../articles/availability-zones/az-overview.md), which is a high-availability offering that protects your applications from datacenter failures. Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. With Availability Zones, Azure offers industry best 99.99% VM uptime SLA.

### Azure Backup support

To protect against regional disasters, [Azure Backup](../articles/backup/backup-overview.md) can be used to create a backup job with time-based backups and backup retention policies. This allows you to perform VM or managed disk restorations at will. Currently Azure Backup supports disk sizes up to 32 tebibyte (TiB) disks. [Learn more](../articles/backup/backup-support-matrix-iaas.md) about Azure VM backup support.

### Granular access control

You can use [Azure role-based access control (RBAC)](../articles/role-based-access-control/overview.md) to assign specific permissions for a managed disk to one or more users. Managed disks expose a variety of operations, including read, write (create/update), delete, and retrieving a [shared access signature (SAS) URI](../articles/storage/common/storage-dotnet-shared-access-signature-part-1.md) for the disk. You can grant access to only the operations a person needs to perform their job. For example, if you don't want a person to copy a managed disk to a storage account, you can choose not to grant access to the export action for that managed disk. Similarly, if you don't want a person to use an SAS URI to copy a managed disk, you can choose not to grant that permission to the managed disk.

### Upload your vhd

 Direct upload makes it easy to transfer your vhd to an Azure managed disk. Previously, you had to follow a more involved process that included staging your data in a storage account. Now, there are fewer steps. It is easier to upload on premises VMs to Azure, upload to large managed disks, and the backup and restore process is simplified. It also reduces cost by allowing you to upload data to managed disks directly without attaching them to VMs. You can use direct upload to upload vhds up to 32 TiB in size.

 To learn how to transfer your vhd to Azure, see the [CLI](../articles/virtual-machines/linux/disks-upload-vhd-to-managed-disk-cli.md) or [PowerShell](../articles/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell.md) articles.

## Encryption

Managed disks offer two different kinds of encryption. The first is Server Side Encryption (SSE), which is performed by the storage service. The second one is Azure Disk Encryption (ADE), which you can enable on the OS and data disks for your VMs.

### Server-side encryption

[Azure Server-side Encryption](../articles/virtual-machines/windows/disk-encryption.md) provides encryption-at-rest and safeguards your data to meet your organizational security and compliance commitments. Server-side encryption is enabled by default for all managed disks, snapshots, and images, in all the regions where managed disks are available. (Temporary disks, on the other hand, are not encrypted by Storage Service Encryption; see [Disk Roles: temporary disks](#temporary-disk)).

You can either allow Azure to manage your keys for you, these are platform-managed keys, or you can manage the keys yourself, these are customer-managed keys. Visit the [Managed Disks FAQ page](../articles/virtual-machines/windows/faq-for-disks.md#managed-disks-and-storage-service-encryption) for more details.


### Azure Disk Encryption

Azure Disk Encryption allows you to encrypt the OS and Data disks used by an IaaS Virtual Machine. This encryption includes managed disks. For Windows, the drives are encrypted using industry-standard BitLocker encryption technology. For Linux, the disks are encrypted using the DM-Crypt technology. The encryption process is integrated with Azure Key Vault to allow you to control and manage the disk encryption keys. For more information, see [Azure Disk Encryption for Linux VMs](../articles/virtual-machines/linux/disk-encryption-overview.md) or [Azure Disk Encryption for Windows VMs](../articles/virtual-machines/windows/disk-encryption-overview.md).

## Disk roles

There are three main disk roles in Azure: the data disk, the OS disk, and the temporary disk. These roles map to disks that are attached to your virtual machine.

![Disk roles in action](media/virtual-machines-managed-disks-overview/disk-types.png)

### Data disk

A data disk is a managed disk that's attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Each data disk has a maximum capacity of 32,767 gibibytes (GiB). The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

### OS disk

Every virtual machine has one attached operating system disk. That OS disk has a pre-installed OS, which was selected when the VM was created. This disk contains the boot volume.

This disk has a maximum capacity of 2,048 GiB.

### Temporary disk

Every VM contains a temporary disk, which is not a managed disk. The temporary disk provides short-term storage for applications and processes and is intended to only store data such as page or swap files. Data on the temporary disk may be lost during a [maintenance event](../articles/virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#understand-vm-reboots---maintenance-vs-downtime) event or when you [redeploy a VM](../articles/virtual-machines/troubleshooting/redeploy-to-new-node-windows.md?toc=%2Fazure%2Fvirtual-machines%2Fwindows%2Ftoc.json). During a successful standard reboot of the VM, the data on the temporary disk will persist.  

On Azure Linux VMs, the temporary disk is typically /dev/sdb and on Windows VMs the temporary disk is D: by default. The temporary disk is not encrypted by Server Side Encryption (see [Encryption](#encryption)).

## Managed disk snapshots

A managed disk snapshot is a read-only crash-consistent full copy of a managed disk that is stored as a standard managed disk by default. With snapshots, you can back up your managed disks at any point in time. These snapshots exist independent of the source disk and can be used to create new managed disks. 

Snapshots are billed based on the used size. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GiB and actual used data size of 10 GiB, that snapshot is billed only for the used data size of 10 GiB. You can see the used size of your snapshots by looking at the [Azure usage report](https://docs.microsoft.com/azure/billing/billing-understand-your-bill). For example, if the used data size of a snapshot is 10 GiB, the **daily** usage report will show 10 GiB/(31 days) = 0.3226 as the consumed quantity.

To learn more about how to create snapshots for managed disks, see the following resources:

* [Create a snapshot of a managed disk in Windows](../articles/virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create a snapshot of a managed disk in Linux](../articles/virtual-machines/linux/snapshot-copy-managed-disk.md)

### Images

Managed disks also support creating a managed custom image. You can create an image from your custom VHD in a storage account or directly from a generalized (sysprepped) VM. This process captures a single image. This image contains all managed disks associated with a VM, including both the OS and data disks. This managed custom image enables creating hundreds of VMs using your custom image without the need to copy or manage any storage accounts.

For information on creating images, see the following articles:

* [How to capture a managed image of a generalized VM in Azure](../articles/virtual-machines/windows/capture-image-resource.md)
* [How to generalize and capture a Linux virtual machine using the Azure CLI](../articles/virtual-machines/linux/capture-image.md)

#### Images versus snapshots

It's important to understand the difference between images and snapshots. With managed disks, you can take an image of a generalized VM that has been deallocated. This image includes all of the disks attached to the VM. You can use this image to create a VM, and it includes all of the disks.

A snapshot is a copy of a disk at the point in time the snapshot is taken. It applies only to one disk. If you have a VM that has one disk (the OS disk), you can take a snapshot or an image of it and create a VM from either the snapshot or the image.

A snapshot doesn't have awareness of any disk except the one it contains. This makes it problematic to use in scenarios that require the coordination of multiple disks, such as striping. Snapshots would need to be able to coordinate with each other and this is currently not supported.

## Disk allocation and performance

The following diagram depicts real-time allocation of bandwidth and IOPS for disks, using a three-level provisioning system:

![Three level provisioning system showing bandwidth and IOPS allocation](media/virtual-machines-managed-disks-overview/real-time-disk-allocation.png)

The first level provisioning sets the per-disk IOPS and bandwidth assignment.  At the second level, compute server host implements SSD provisioning, applying it only to data that is stored on the server's SSD, which includes disks with caching (ReadWrite and ReadOnly) as well as local and temp disks. Finally, VM network provisioning takes place at the third level for any I/O that the compute host sends to Azure Storage's backend. With this scheme, the performance of a VM depends on a variety of factors, from how the VM uses the local SSD, to the number of disks attached, as well as the performance and caching type of the disks it has attached.

As an example of these limitations, a Standard_DS1v1 VM is prevented from achieving the 5,000 IOPS potential of a P30 disk, whether it is cached or not, because of limits at the SSD and network levels:

![Standard_DS1v1 example allocation](media/virtual-machines-managed-disks-overview/example-vm-allocation.png)

Azure uses prioritized network channel for disk traffic, which gets the precedence over other low priority of network traffic. This helps disks maintain their expected performance in case of network contentions. Similarly, Azure Storage handles resource contentions and other issues in the background with automatic load balancing. Azure Storage allocates required resources when you create a disk, and applies proactive and reactive balancing of resources to handle the traffic level. This further ensures disks can sustain their expected IOPS and throughput targets. You can use the VM-level and Disk-level metrics to track the performance and setup alerts as needed.

Refer to our [design for high performance](../articles/virtual-machines/windows/premium-storage-performance.md) article, to learn the best practices for optimizing VM + Disk configurations so that you can achieve your desired performance

## Next steps

If you'd like a video going into more detail on managed disks, check out: [Better Azure VM Resiliency with Managed Disks](https://channel9.msdn.com/Blogs/Azure/Managed-Disks-for-Azure-Resiliency).

Learn more about the individual disk types Azure offers, which type is a good fit for your needs, and learn about their performance targets in our article on disk types.
