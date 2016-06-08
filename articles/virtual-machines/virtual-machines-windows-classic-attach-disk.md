<properties
	pageTitle="Attach a disk to a VM | Microsoft Azure"
	description="Attach a data disk to a Windows virtual machine created with the classic deployment model and initialize it."
	services="virtual-machines-windows, storage"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/17/2016"
	ms.author="cynthn"/>

# Attach a data disk to a Windows virtual machine created with the classic deployment model

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Learn how to [perform these steps using the Resource Manager model](virtual-machines-windows-attach-disk-portal.md).

If you need an additional data disk, you can attach an empty disk or an existing disk with data to a VM. In both cases, the disks are .vhd files that reside in an Azure storage account. In the case of a new disk, after you attach the disk, you'll also need to initialize it so it's ready for use by a Windows VM.

For more details about disks, see [About Disks and VHDs for Virtual Machines](virtual-machines-windows-about-disks-vhds.md).

## Video walkthrough

Here's a [video walkthrough](https://azure.microsoft.com/documentation/videos/attaching-a-data-disk-to-a-windows-vm/) of the steps in this tutorial.


[AZURE.INCLUDE [howto-attach-disk-windows-linux](../../includes/howto-attach-disk-windows-linux.md)]

## Initialize the disk

1. Connect to the virtual machine. For instructions, see [How to log on to a virtual machine running Windows Server][logon].

2. After you log on to the virtual machine, open **Server Manager**. In the left pane, select **File and Storage Services**.

	![Open Server Manager](./media/virtual-machines-windows-classic-attach-disk/fileandstorageservices.png)

3. Expand the menu and select **Disks**.

4. The **Disks** section lists the disks. In most cases, it will have disk 0, disk 1, and disk 2. Disk 0 is the operating system disk, disk 1 is the temporary disk, and disk 2 is the data disk you just attached to the VM. The new data disk will list the Partition as **Unknown**. Right-click the disk and select **Initialize**.

5.	You're notified that all data will be erased when the disk is initialized. Click **Yes** to acknowledge the warning and initialize the disk. Once complete, the Partion will be listed as **GPT**. Right-click the disk again and select **New Volume**.

6.	Complete the wizard using the default values. When the wizard is done, the **Volumes** section lists the new volume. The disk is now online and ready to store data.

	![Volume successfully initialized](./media/virtual-machines-windows-classic-attach-disk/newvolumecreated.png)

> [AZURE.NOTE] The size of the VM determines how many disks you can attach to it. For details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

## Additional resources

[How to detach a disk from a Windows virtual machine](virtual-machines-windows-classic-detach-disk.md)

[About disks and VHDs for virtual machines](virtual-machines-linux-about-disks-vhds.md)

[logon]: virtual-machines-windows-classic-connect-logon.md
