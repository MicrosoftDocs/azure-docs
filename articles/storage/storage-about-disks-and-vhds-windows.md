---
title: About disks and VHDs for Microsoft Azure Windows VMs | Microsoft Docs
description: Learn about the basics of disks and VHDs for Windows virtual machines in Azure.
services: storage
documentationcenter: ''
author: robinsh
manager: timlt
editor: tysonn
tags: azure-resource-manager,azure-service-management

ms.assetid: 0142c64d-5e8c-4d62-aa6f-06d6261f485a
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: robinsh

---
# About disks and VHDs for Azure virtual machines
Just like any other computer, virtual machines in Azure use disks as a place to store an operating system, applications, and data. All Azure virtual machines have at least two disks – a Windows operating system disk and a temporary disk. The operating system disk is created from an image, and both the operating system disk and the image are virtual hard disks (VHDs) stored in an Azure storage account. Virtual machines also can have one or more data disks, that are also stored as VHDs. 

In this article, we will talk about the different uses for the disks, and then discuss the different types of disks you can create and use. This article is also available for [Linux virtual machines](../virtual-machines/virtual-machines-linux-about-disks-vhds.md).

[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

## Disks used by VMs

Let's take a look at how the disks are used by the VMs.

### Operating system disk
Every virtual machine has one attached operating system disk. It’s registered as a SATA drive and labeled as the C: drive by default. This disk has a maximum capacity of 1023 gigabytes (GB). 

### Temporary disk
The temporary disk is automatically created for you. The temporary disk is labeled as the D: drive by default and it used for storing pagefile.sys. 

The size of the temporary disk varies, based on the size of the virtual machine. For more information, see [Sizes for Windows virtual machines](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

> [!WARNING]
> Don’t store data on the temporary disk. It provides temporary storage for applications and processes and is intended to only store data such as page or swap files. To remap this disk to a different drive letter, see [Change the drive letter of the Windows temporary disk](../virtual-machines/virtual-machines-windows-classic-change-drive-letter.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).
> 
> 

For more information on how Azure uses the temporary disk, see [Understanding the temporary drive on Microsoft Azure Virtual Machines](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/)

### Data disk
A data disk is a VHD that’s attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose.  Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

> [!NOTE]
> For more information about virtual machines capacities, see [Sizes for Windows virtual machines](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
> 
> 

Azure creates an operating system disk when you create a virtual machine from an image. If you use an image that includes data disks, Azure also creates the data disks when it creates the virtual machine. Otherwise, you add data disks after you create the virtual machine.

You can add data disks to a virtual machine at any time, by **attaching** the disk to the virtual machine. You can use a VHD that you’ve uploaded or copied to your storage account, or one that Azure creates for you. Attaching a data disk associates the VHD file with the VM by placing a ‘lease’ on the VHD so it can’t be deleted from storage while it’s still attached.

## About VHDs
The VHDs used in Azure are .vhd files stored as page blobs in a standard or premium storage account in Azure. For more information about page blobs, see [Understanding block blobs and page blobs](https://msdn.microsoft.com/library/ee691964.aspx). For more information about premium storage, see [Premium storage: High-performance storage for Azure virtual machine workloads](../storage/storage-premium-storage.md).

Azure supports the fixed disk VHD format. The fixed-format lays the logical disk out linearly within the file, so that disk offset X is stored at blob offset X. A small footer at the end of the blob describes the properties of the VHD. Often, the fixed-format wastes space because most disks have large unused ranges in them. However, Azure stores .vhd files in a sparse format, so you receive the benefits of both the fixed and dynamic disks at the same time. For more information, see [Getting started with virtual hard disks](https://technet.microsoft.com/library/dd979539.aspx).

All .vhd files in Azure that you want to use as a source to create disks or images are read-only. When you create a disk or image, Azure makes copies of the .vhd files. These copies can be read-only or read-and-write, depending on how you use the VHD.

When you create a virtual machine from an image, Azure creates a disk for the virtual machine that is a copy of the source .vhd file. To protect against accidental deletion, Azure places a lease on any source .vhd file that’s used to create an image, an operating system disk, or a data disk.

Before you can delete a source .vhd file, you’ll need to remove the lease by deleting the disk or image. You can delete the virtual machine, the operating system disk, and the source .vhd file all at once by deleting the virtual machine and deleting all associated disks. However, deleting a .vhd file that’s a source for a data disk requires several steps in a set order. First you detach the disk from the virtual machine, then delete the disk, and then delete the .vhd file.

> [!WARNING]
> If you delete a source .vhd file from storage, or delete your storage account, Microsoft can't recover that data for you.
> 
> 

## Use TRIM with unmanaged standard disks 

If you use unmanaged standard disks (HDD), you should enable TRIM. TRIM discards unused blocks on the disk so you are only billed for storage that you are actually using. This can save on costs if you create large files and then delete them. 

You can run this command to check the TRIM setting. Open a command prompt on your Windows VM and type:

```
fsutil behavior query DisableDeleteNotify
```

If the command returns 0, TRIM is enabled correctly. If it returns 1, run the following command to enable TRIM:

```
fsutil behavior set DisableDeleteNotify 0
```

## Types of disks 

There are two performance tiers for storage that you can choose from when creating your disks -- Standard Storage and Premium Storage. Also, there are two types of disks -- unmanaged and managed -- and they can reside in either performance tier.  

### Standard storage 

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard storage can be replicated locally in one datacenter, or be geo-redundant with primary and secondary data centers. For more information about storage replication, please see [Azure Storage replication](storage-redundancy.md). 

<!--
For more information about using Standard Storage with VM disks, please see [Standard Storage and Disks](storage-standard-storage.md).
-->

### Premium storage 

Premium Storage is backed by SSDs, and delivers high-performance, low-latency disk support for VMs running I/O-intensive workloads. You can use Premium Storage with DS, DSv2, GS, or FS series Azure VMs. For more information, please see [Premium Storage](storage-premium-storage.md).

### Unmanaged disks

Unmanaged disks are the traditional type of disks that have been used by VMs. With these, you create your own storage account and specify that storage account when you create the disk. You have to make sure you don't put too many disks in the same storage account, because you could exceed the [scalability targets](storage-scalability-targets.md) of the storage account (20,000 IOPS, for example), resulting in the VMs being throttled. With unmanaged disks, you have to figure out how to maximize the use of  one or more storage accounts to get the best performance out of your VMs.

### Managed disks 

Managed Disks handles the storage account creation/management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You simply specify the disk size and the performance tier (Standard/Premium), and Azure creates and manages the disk for you. Even as you add disks or scale the VM up and down, you don't have to worry about the storage being used. 

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of VMs in the same subscription. For more information about Managed Disks, please see the [Managed Disks Overview](storage-managed-disks-overview.md).

We recommend that you use Azure Managed Disks for new VMs, and that you convert your previous unmanaged disks to managed disks, to take advantage of the many features available in Managed Disks.

### Disk comparison

The following table provides a comparison of Premium vs Standard for both unmanaged and managed disks to help you decide what to use.

|    | Azure Premium Disk | Azure Standard Disk |
|--- | ------------------ | ------------------- |
| Disk Type | Solid State Drives (SSD) | Hard Disk Drives (HDD)  |
| Overview  | SSD based high-performance, low-latency disk support for VMs running IO-intensive workloads or hosting mission critical production environment | HDD based cost effective disk support for Dev/Test VM scenarios |
| Scenario  | Production and performance sensitive workloads | Dev/Test, non-critical, <br>Infrequent access |
| Disk Size | P10: 128 GB<br>P20: 512 GB<br>P30: 1024 GB | Unmanaged Disks: 1 GB – 1TB <br><br>Managed Disks:<br> S4: 32 GB <br>S6: 64 GB <br>S10: 128 GB <br>S20: 512 GB <br>S30: 1024 GB |
| Max Throughput per Disk | 200 MB/s | 60 MB/s |
| Max IOPS per Disk | 5000 IOPS | 500 IOPS |

<!-- Might want to match next-steps from overview of managed disks -->
## Next steps
* [Attach a disk](../virtual-machines/virtual-machines-windows-attach-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to add additional storage for your VM.
* [Upload a Windows VM image to Azure](../virtual-machines/virtual-machines-windows-upload-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to use when creating a new VM.
* [Change the drive letter of the Windows temporary disk](../virtual-machines/virtual-machines-windows-classic-change-drive-letter.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json) so your application can use the D: drive for data.

