<properties
	pageTitle="Attach a disk to a virtual machine | Microsoft Azure"
	description="Learn how to attach a data disk to an Azure virtual machine and initialize it so it's ready for use."
	services="virtual-machines, storage"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/16/2015"
	ms.author="kathydav"/>

# How to attach a data disk to a Windows virtual machine

You can attach empty disks and disks with data. In both cases, the disks are actually .vhd files that reside in an Azure storage account. Also in both cases, after you attach the disk, you'll need to initialize it so it's ready for use.

> [AZURE.NOTE] It's a best practice to use one or more separate disks to store a virtual machine's data. When you create an Azure virtual machine, it has a disk for the operating system mapped to drive C and a temporary disk mapped to drive D. **Do not use drive D to store data.** As the name implies, drive D provides temporary storage only. It offers no redundancy or backup because it doesn't reside in Azure Storage.

## Video walkthrough

Here's a walkthrough of the steps in this tutorial.

[AZURE.VIDEO attaching-a-data-disk-to-a-windows-vm] 

[AZURE.INCLUDE [howto-attach-disk-windows-linux](../../includes/howto-attach-disk-windows-linux.md)]

## <a id="initializeinWS"></a>How to: initialize a new data disk in Windows Server

1. Connect to the virtual machine. For instructions, see [How to log on to a virtual machine running Windows Server][logon].

2. After you log on to the virtual machine, open **Server Manager**. In the left pane, select **File and Storage Services**.

	![Open Server Manager](./media/storage-windows-attach-disk/fileandstorageservices.png)

3. Expand the menu and select **Disks**.

4. The **Disks** section lists disk 0, disk 1, and disk 2. Disk 0 is the operating system disk, disk 1 is the temporary disk (which should not be used for data storage), and disk 2 is the data disk you attached to the virtual machine. The data disk has a capacity of 5 GB, based on what you specified when you attached the disk. Right-click disk 2 and  select **Initialize**.

5.	You're notified that all data will be erased when the disk is initialized. Click **Yes** to acknowledge the warning and initialize the disk. Then, right-click disk 2 again and select **New Volume**.

6.	Complete the wizard using the default values. When the wizard is done, the **Volumes** section lists the new volume. The disk is now online and ready to store data.

	![Volume successfully initialized](./media/storage-windows-attach-disk/newvolumecreated.png)

> [AZURE.NOTE] The size of the virtual machine determines how many disks you can attach to it. For details, see [Sizes for virtual machines](virtual-machines-size-specs.md).

## Additional resources

[How to detach a disk from a Windows virtual machine](storage-windows-detach-disk.md)

[About disks and VHDs for virtual machines](virtual-machines-disks-vhds.md)

[logon]: virtual-machines-log-on-windows-server.md
