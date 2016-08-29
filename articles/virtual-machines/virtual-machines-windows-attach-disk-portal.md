<properties
	pageTitle="Attach a data disk to a Windows VM | Microsoft Azure"
	description="How to attach new or existing data disk to a Windows VM in the Azure portal using the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="cynthn"/>

# How to attach a data disk to a Windows VM in the Azure portal

This article shows you how to attach both new and existing disks to a Windows virtual machine through the Azure portal. You can also [attach a data disk to a Linux VM in the Azure portal](virtual-machines-linux-attach-disk-portal.md). Before you do this, review these tips:

- The size of the virtual machine controls how many data disks you can attach. For details, see [Sizes for virtual machines](virtual-machines-windows-sizes.md).
- To use Premium storage, you'll need a DS-series or GS-series virtual machine. You can use disks from both Premium and Standard storage accounts with these virtual machines. Premium storage is available in certain regions. For details, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../storage/storage-premium-storage.md).
- Disks attached to virtual machines are actually .vhd files in an Azure storage account. For details, see [About disks and VHDs for virtual machines](virtual-machines-windows-about-disks-vhds.md).
- For a new disk, you don't need to create it first because Azure creates it when you attach it.
- For an existing disk, the .vhd file must be available in an Azure storage account. You can use a .vhd that's already there, if it's not attached to another virtual machine, or upload your own .vhd file to the storage account.

[AZURE.INCLUDE [virtual-machines-common-attach-disk-portal](../../includes/virtual-machines-common-attach-disk-portal.md)]

## <a id="initializeinWS"></a>How to: initialize a new data disk in Windows Server

1. Connect to the virtual machine. For instructions, see [How to connect and log on to an Azure virtual machine running Windows](virtual-machines-windows-connect-logon.md).

2. After you log on to the virtual machine, open **Server Manager**. In the left pane, select **File and Storage Services**.

	![Open Server Manager](./media/virtual-machines-windows-classic-attach-disk/fileandstorageservices.png)

3. Expand the menu and select **Disks**.

4. The **Disks** section lists the disks. In most cases, it will have disk 0, disk 1, and disk 2. Disk 0 is the operating system disk, disk 1 is the temporary disk, and disk 2 is the data disk you just attached to the VM. The new data disk will list the Partition as **Unknown**. Right-click the disk and select **Initialize**.

5.	You're notified that all data will be erased when the disk is initialized. Click **Yes** to acknowledge the warning and initialize the disk. Once complete, the Partion will be listed as **GPT**. Right-click the disk again and select **New Volume**.

6.	Complete the wizard using the default values. When the wizard is done, the **Volumes** section lists the new volume. The disk is now online and ready to store data.


	![Volume successfully initialized](./media/virtual-machines-windows-classic-attach-disk/newvolumecreated.png)

> [AZURE.NOTE] The size of the VM determines how many disks you can attach to it. For details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).


## Next steps

If you application needs to use the D: drive to store data, you can [change the drive letter of the Windows temporary disk](virtual-machines-windows-classic-change-drive-letter.md).