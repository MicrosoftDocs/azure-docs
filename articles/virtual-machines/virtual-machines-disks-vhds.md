<properties
	pageTitle="About disks and VHDs for virtual machines"
	description="Learn about the basics of disks and VHDs for virtual machines in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/30/2015"
	ms.author="kathydav"/>

# About disks and VHDs for virtual machines

All virtual machines in Azure are configured with at least two disks when you create the virtual machine – one is an operating system disk and the other is a temporary local disk, sometimes called a resource disk. The operating system disk is created from an image, and both the operating system disk and the image are actually virtual hard disks (VHDs) stored in an Azure storage account. Virtual machines also can have data disks, and they are also stored as VHDs.

>[AZURE.WARNING] Don’t store data on the temporary disk. It provides temporary storage for applications and processes and is intended to only store data such as page or swap files. To remap this disk for a Windows virtual machine, see [Change the drive letter of the Windows temporary disk](virtual-machines-windows-change-drive-letter.md).

## About disks

Just like any other computer, virtual machines in Azure use disks as a place to store an operating system, applications, and data. All Azure virtual machines have at least two disks – an operating system disk and a temporary disk. They also can have one or more data disks.

- The **operating system disk** - Every virtual machine has one attached operating system disk. It’s registered as a SATA drive and labeled as the C: drive. This disk has a maximum capacity of 1023 gigabytes (GB). When Azure creates an operating system disk, three copies of the disk are created for high durability. Additionally, if you configure the virtual machine for geo-replication, your VHD is also replicated to different sites more than 400 miles apart.
- The **temporary disk** is automatically created for you. On Windows virtual machines, this disk is labeled as the D: drive. On Linux virtual machines, the disk is typically /dev/sdb and is formatted and mounted to /mnt/resource by the Azure Linux Agent.
- A **data disk** is a VHD that’s attached to a virtual machine to store application data, or other data you need to keep. Data disks are registered as SCSI drives and are labeled with a letter that you choose.  Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

	For more details about virtual machines capacities, see [Sizes for virtual machines](virtual-machines-size-specs.md).

Azure creates an operating system disk when you create a virtual machine from an image. If you use an image that includes data disks, Azure also creates the data disks when it creates the virtual machine. (You can use an image from Azure or a partner, or one you provide.) Otherwise, you add data disks after you create the virtual machine.

You can add data disks to a virtual machine at any time, by ‘attaching’ the disk to the virtual machine. You can use a VHD that you’ve uploaded or copied to your storage account, or one that Azure creates for you. Attaching a data disk associates the VHD file from your storage account with the virtual machine, by placing a ‘lease’ on the VHD so it can’t be deleted from storage while it’s attached to a virtual machine.

## About VHDs

The VHDs used in Azure are .vhd files stored as page blobs in a standard or premium storage account in Azure. (Premium storage is available in certain regions.) For details about page blobs, see [Understanding block blobs and page blobs](https://msdn.microsoft.com/library/ee691964.aspx). For details about premium storage, see [Premium storage: High-performance storage for Azure virtual machine workloads](../storage-premium-storage-preview-portal.md).

Outside of Azure, virtual hard disks can use either a VHD or a VHDX format. They can also be fixed, dynamically expanding, or differencing. Azure supports VHD format, fixed disks. The fixed format lays the logical disk out linearly within the file, so that disk offset X is stored at blob offset X. A small footer at the end of the blob describes the properties of the VHD. Often, the fixed format wastes space because most disks have large unused ranges in them. However, Azure stores .vhd files in a sparse format, so you receive the benefits of both the fixed and dynamic disks at the same time. For more details, see [Getting started with virtual hard disks](https://technet.microsoft.com/library/dd979539.aspx).

All .vhd files in Azure that you want to use as a source to create disks or images are read-only. When you create a disk or image, Azure makes copies of the .vhd files. These copies can be read-only or read-and-write, depending on how you use the VHD.

 When you create a virtual machine from an image, Azure creates a disk for the virtual machine that is a copy of the source .vhd file. To protect against accidental deletion, Azure places a lease on any source .vhd file that’s used to create an image, an operating system disk, or a data disk.

Before you can delete a source .vhd file, you’ll need to remove the lease by deleting the disk or image. To delete a .vhd file that is being used by a virtual machine as an operating system disk, you can delete the virtual machine, the operating system disk, and the source .vhd file all at once by deleting the virtual machine and deleting all associated disks. However, deleting a .vhd file that’s a source for a data disk requires several steps in a set order -- detach the disk from the virtual machine, delete the disk, and then delete the .vhd file.

>[AZURE.WARNING] If you delete a source .vhd file from storage, or delete your storage account, Microsoft can't recover that data for you.

## Next steps

Linux virtual machines:

-  [Attach a disk and prep it for use](virtual-machines-linux-how-to-attach-disk.md)
-  [Capture a Linux virtual machine](virtual-machines-linux-capture-image.md)
-  [Detach a disk](virtual-machines-linux-how-to-detach-disk.md)

Windows virtual machines:

-  [Attach a disks and prep it for use](storage-windows-attach-disk.md)
-  [Capture a Windows virtual machine](virtual-machines-capture-image-windows-server.md)
-  [Detach a disk](storage-windows-detach-disk.md)
