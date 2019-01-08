---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 12/04/2018
 ms.author: rogarana
 ms.custom: include file
---

## Benefits of managed disks

Let's take a look at some of the benefits you gain by using managed disks. The following Channel 9 video is a good introduction: [Better Azure VM Resiliency with Managed Disks](https://channel9.msdn.com/Blogs/Azure/Managed-Disks-for-Azure-Resiliency).
<br/>
> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Managed-Disks-for-Azure-Resiliency/player]

### Highly durable and available

Managed Disks are designed for 99.999% availability. It provides you with three replicas of your data, allowing for high durability. If one or even two replicas experience issues, the remaining replicas help ensure persistence of your data and high tolerance against failures. This architecture has helped Azure consistently deliver enterprise-grade durability for IaaS disks, with an industry-leading ZERO% Annualized Failure Rate.

### Simple and scalable VM deployment

Managed Disks allow you to create up to 50,000 VM **disks** of a type in a subscription per region, allowing you to create thousands of **VMs** in a single subscription. This feature also further increases the scalability of [Virtual Machine Scale Sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) by allowing you to create up to a thousand VMs in a virtual machine scale set using a Marketplace image.

### Integration with Availability Sets

Managed Disks are integrated with Availability Sets to ensure that the disks of [VMs in an Availability Set](../articles/virtual-machines/windows/manage-availability.md#use-managed-disks-for-vms-in-an-availability-set) are sufficiently isolated from each other to avoid a single point of failure. Disks are automatically placed in different storage scale units (stamps). If a stamp fails due to hardware or software failure, only the VM instances with disks on those stamps fail. For example, let's say you have an application running on five VMs, and the VMs are in an Availability Set. The disks for those VMs won't all be stored in the same stamp, so if one stamp goes down, the other instances of the application continue to run.

### Azure Backup support

To protect against regional disasters, [Azure Backup](../articles/backup/backup-introduction-to-azure-backup.md) can be used to create a backup job with time-based backups and backup retention policies. This allows you to perform easy VM restorations at will. Currently Azure Backup supports disk sizes up to 4 TiB disks. For more information, see [Using Azure Backup for VMs with Managed Disks](../articles/backup/backup-introduction-to-azure-backup.md#using-managed-disk-vms-with-azure-backup).

## More About Disks in Azure

### Data Disks

A data disk is a Managed Disk that's attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Each data disk has a maximum capacity of 4,095 GiB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

### OS Disks

Every virtual machine has one attached operating system disk. That OS disk has a pre-installed OS which was selected when the VM was created.

This disk has a maximum capacity of 2,048 GiB.

### Temporary disk

Every VM contains a temporary disk, which is not a Managed Disk. The temporary disk provides short-term storage for applications and processes and is intended to only store data such as page or swap files. Data on the temporary disk may be lost during a [maintenance event](../windows/manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#understand-vm-reboots---maintenance-vs-downtime) or when you [redeploy a VM](../windows/redeploy-to-new-node.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). During a standard reboot of the VM, the data on the temporary drive should persist. However, there are cases where the data may not persist, such as moving to a new host. Accordingly, any data on the temp drive should not be data that is critical to the system.

### Managed disk snapshots

A managed disk snapshot is a read-only full copy of a managed disk that is stored as a standard managed disk by default. With snapshots, you can back up your managed disks at any point in time. These snapshots exist independent of the source disk and can be used to create new Managed Disks. They are billed based on the used size. For example, if you create a snapshot of a managed disk with provisioned capacity of 64 GiB and actual used data size of 10 GiB, snapshot will be billed only for the used data size of 10 GiB.  

To learn more about how to create snapshots with Managed Disks, see the following resources:

* [Create copy of VHD stored as a Managed Disk using Snapshots in Windows](../articles/virtual-machines/windows/snapshot-copy-managed-disk.md)
* [Create copy of VHD stored as a Managed Disk using Snapshots in Linux](../articles/virtual-machines/linux/snapshot-copy-managed-disk.md)

### Images

Managed Disks also support creating a managed custom image. You can create an image from your custom VHD in a storage account or directly from a generalized (sys-prepped) VM. This process captures a single image which contains all managed disks associated with a VM, including both the OS and data disks. This managed custom image enables creating hundreds of VMs using your custom image without the need to copy or manage any storage accounts.

For information on creating images, see the following articles:

* [How to capture a managed image of a generalized VM in Azure](../articles/virtual-machines/windows/capture-image-resource.md)
* [How to generalize and capture a Linux virtual machine using the Azure CLI](../articles/virtual-machines/linux/capture-image.md)

#### Images versus snapshots

You often see the word "image" used with VMs, and now you see "snapshots" as well. It's important to understand the difference between these terms. With Managed Disks, you can take an image of a generalized VM that has been deallocated. This image will include all of the disks attached to the VM. You can use this image to create a new VM, and it will include all of the disks.

A snapshot is a copy of a disk at the point in time it is taken. It only applies to one disk. If you have a VM that only has one disk (the OS), you can take a snapshot or an image of it and create a VM from either the snapshot or the image.

What if a VM has five disks and they are striped? You could take a snapshot of each of the disks, but there is no awareness within the VM of the state of the disks – the snapshots only know about that one disk. In this case, the snapshots would need to be coordinated with each other, and that is not currently supported.

### What is managed about Managed Disks?

Disks in Azure are virtual hard disks (VHDs) stored as page blobs, which are a random IO storage object in Azure. We call a Managed Disk ‘managed’ because it provides an abstraction over page blobs, blob containers, and Azure storage accounts – you simply provision a Managed Disk, and don’t have to worry about the rest.

## Next steps

For more information about Managed Disks, please refer to the following articles.

### Get started with Managed Disks

* [Create a VM using Resource Manager and PowerShell](../articles/virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm.md)

* [Create a Linux VM using the Azure CLI](../articles/virtual-machines/linux/quick-create-cli.md)

* [Attach a managed data disk to a Windows VM using PowerShell](../articles/virtual-machines/windows/attach-disk-ps.md)

* [Add a managed disk to a Linux VM](../articles/virtual-machines/linux/add-disk.md)

* [Managed Disks PowerShell Sample Scripts](https://github.com/Azure-Samples/managed-disks-powershell-getting-started)

* [Use Managed Disks in Azure Resource Manager templates](../articles/virtual-machines/windows/using-managed-disks-template-deployments.md)

### Operational guidance

* [Migrate from AWS and other platforms to Managed Disks in Azure](../articles/virtual-machines/windows/on-prem-to-azure.md)

* [Convert Azure VMs to managed disks in Azure](../articles/virtual-machines/windows/migrate-to-managed-disks.md)