<properties
	pageTitle="Attach a data disk | Microsoft Azure"
	description="How to attach new or existing data disk to a VM in the Azure preview portal using the Resource Manager deployment model."
	services="virtual-machines"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/14/2015"
	ms.author="cynthn"/>

# How to attach a data disk in the Azure preview portal

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers creating a resource with the Resource Manager deployment model. You can also create a resource with the [classic deployment model](storage-windows-attach-disk.md).

This article shows you how to attach both new and existing disks to a virtual machine through the Azure preview portal. Before you do this, review these tips:

- The size of the virtual machine controls how many data disks you can attach. For details, see [Sizes for virtual machines](virtual-machines-size-specs.md).
- To use Premium storage, you'll need a DS-series or GS-series virtual machine. You can use disks from both Premium and Standard storage accounts with these virtual machines. Premium storage is available in certain regions. For details, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../storage/storage-premium-storage-preview-portal.md).
- Disks attached to virtual machines are actually .vhd files in an Azure storage account. For details, see [About disks and VHDs for virtual machines](virtual-machines-disks-vhds.md).
- For a new disk, you don't need to create it first because Azure creates it when you attach it.
- For an existing disk, the .vhd file must be available in an Azure storage account. You can use one that's already there, if it's not attached to another virtual machine, or upload your own .vhd file to the storage account.

## Find the virtual machine

1. Sign in to the [Preview portal](https://portal.azure.com).

2. On the Hub menu, click **Browse**.

3. On the search blade, scroll down and click **Virtual Machines**.

	![Search for virtual machines](./media/virtual-machines-attach-disk-preview/search-blade-preview-portal.png)

4.	Select the virtual machine from the list.

5. To the right, under **Essentials**, click **All settings**, and then click **Disks**.

	![Open disk settings](./media/virtual-machines-attach-disk-preview/find-disk-settings.png)

Continue by following instructions for attaching either a new disk or an existing disk.

## Option 1: Attach a new disk

1.	On the **Disks** blade, click **Attach new**.

2.	Review the default settings, update as necessary, and then click **OK**.

 	![Review disk settings](./media/virtual-machines-attach-disk-preview/attach-new.png)

3.	After Azure creates the disk and attaches it to the virtual machine, the new disk is listed in the virtual machine's disk settings under **Data Disks**.

## Option 2: Attach an existing disk

1.	On the **Disks** blade, click **Attach existing**.

2.	Under **Attach existing disk**, click **VHD File**.

	![Attach existing disk](./media/virtual-machines-attach-disk-preview/attach-existing.png)

3.	Under **Storage accounts**, select the account and container that holds the .vhd file.

	![Find VHD location](./media/virtual-machines-attach-disk-preview/find-storage-container.png)

4.	Select the .vhd file.

5.	Under **Attach existing disk**, the file you just selected is listed under **VHD File**. Click **OK**.

6.	After Azure attaches the disk to the virtual machine, it's listed in the virtual machine's disk settings under **Data Disks**.

## Next steps

After the disk is added, you need to prepare it for use in the virtual machine's operating system:

- For Linux, see "How to: Initialize a new data disk in Linux" in this [article](virtual-machines-linux-how-to-attach-disk.md).
- For Windows, see "How to: initialize a new data disk in Windows Server" in this [article](storage-windows-attach-disk.md).

## Additional resources

[About Azure Storage Accounts]

<!--Link references-->

[About Azure Storage Accounts]: ../storage-whatis-account/
