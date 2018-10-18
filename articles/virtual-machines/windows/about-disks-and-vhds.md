---
title: About unmanaged (page blobs) and managed disks storage for Microsoft Azure Windows VMs | Microsoft Docs
description: Learn about the basics of unmanaged (page blobs) and managed disks storage for Windows virtual machines in Azure.
services: "virtual-machines-windows,storage"
author: roygara
ms.service: virtual-machines-windows
ms.tgt_pltfrm: windows
ms.topic: article
ms.date: 11/15/2017
ms.author: rogarana
ms.component: disks
---

# About disks storage for Azure Windows VMs

Just like any other computer, virtual machines in Azure use disks as a place to store an operating system, applications, and data. All Azure virtual machines have at least two disks – a Windows operating system disk and a temporary disk. The operating system disk is created from an image, and both the operating system disk and the image are virtual hard disks (VHDs) stored in an Azure storage account. Virtual machines also can have one or more data disks, that are also stored as VHDs. 

In this article, we will talk about the different uses for the disks, and then discuss the different types of disks you can create and use. This article is also available for [Linux virtual machines](../linux/about-disks-and-vhds.md).

[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

## Disks used by VMs

Let's take a look at how the disks are used by the VMs.

### Operating system disk

Every virtual machine has one attached operating system disk. It's registered as a SATA drive and labeled as the C: drive by default. This disk has a maximum capacity of 2048 gigabytes (GB).

### Temporary disk

Each VM contains a temporary disk. The temporary disk provides short-term storage for applications and processes and is intended to only store data such as page or swap files. Data on the temporary disk may be lost during a [maintenance event](manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#understand-vm-reboots---maintenance-vs-downtime) or when you [redeploy a VM](redeploy-to-new-node.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). During a successful standard reboot of the VM, the data on the temporary drive will persist. 

The temporary disk is labeled as the D: drive by default and it used for storing pagefile.sys. To remap this disk to a different drive letter, see [Change the drive letter of the Windows temporary disk](change-drive-letter.md). The size of the temporary disk varies, based on the size of the virtual machine. For more information, see [Sizes for Windows virtual machines](sizes.md).

For more information on how Azure uses the temporary disk, see [Understanding the temporary drive on Microsoft Azure Virtual Machines](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/)

### Data disk

A data disk is a VHD that's attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose. Each data disk has a maximum capacity of 4,095 GB, managed disks have a maximum capacity of 32,767 TiB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

> [!NOTE]
> For more information about virtual machines capacities, see [Sizes for Windows virtual machines](sizes.md).

Azure creates an operating system disk when you create a virtual machine from an image. If you use an image that includes data disks, Azure also creates the data disks when it creates the virtual machine. Otherwise, you add data disks after you create the virtual machine.

You can add data disks to a virtual machine at any time, by **attaching** the disk to the virtual machine. You can use a VHD that you've uploaded or copied to your storage account, or use an empty VHD that Azure creates for you. Attaching a data disk associates the VHD file with the VM by placing a 'lease' on the VHD so it can't be deleted from storage while it's still attached.


[!INCLUDE [storage-about-vhds-and-disks-windows-and-linux](../../../includes/storage-about-vhds-and-disks-windows-and-linux.md)]

## One last recommendation: Use TRIM with unmanaged standard disks

If you use unmanaged standard disks (HDD), you should enable TRIM. TRIM discards unused blocks on the disk so you are only billed for storage that you are actually using. This can save on costs if you create large files and then delete them.

You can run this command to check the TRIM setting. Open a command prompt on your Windows VM and type:

```
fsutil behavior query DisableDeleteNotify
```

If the command returns 0, TRIM is enabled correctly. If it returns 1, run the following command to enable TRIM:

```
fsutil behavior set DisableDeleteNotify 0
```

> [!NOTE]
> Note: Trim support starts with Windows Server 2012 / Windows 8 and above, see [New API allows apps to send "TRIM and Unmap" hints to storage media](https://msdn.microsoft.com/windows/compatibility/new-api-allows-apps-to-send-trim-and-unmap-hints).
> 

<!-- Might want to match next-steps from overview of managed disks -->
## Next steps
* [Attach a disk](attach-disk-portal.md) to add additional storage for your VM.
* [Create a snapshot](snapshot-copy-managed-disk.md).
* [Convert to managed disks](convert-unmanaged-to-managed-disks.md).


