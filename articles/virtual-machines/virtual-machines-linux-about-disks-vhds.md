<properties
	pageTitle="About disks and VHDs for Linux VMs | Microsoft Azure"
	description="Learn about the basics of disks and VHDs for Linux virtual machines in Azure."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/16/2016"
	ms.author="cynthn"/>

# About disks and VHDs for Azure virtual machines

Just like any other computer, virtual machines in Azure use disks as a place to store an operating system, applications, and data. All Azure virtual machines have at least two disks – a Linux operating system disk (in the case of a Linux VM) and a temporary disk. The operating system disk is created from an image, and both the operating system disk and the image are actually virtual hard disks (VHDs) stored in an Azure storage account. Virtual machines also can have one or more data disks, that are also stored as VHDs. This article is also available for [Windows virtual machines](virtual-machines-windows-about-disks-vhds.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-about-disks-vhds](../../includes/virtual-machines-common-about-disks-vhds.md)]

## Troubleshooting
[AZURE.INCLUDE [virtual-machines-linux-lunzero](../../includes/virtual-machines-linux-lunzero.md)]

## Next steps

-  [Attach a disk](virtual-machines-linux-attach-disk-portal.md) to add additional storage for your VM.
-  [Configure software RAID](virtual-machines-linux-configure-raid.md) for redundancy.
-  [Capture a Linux virtual machine](virtual-machines-linux-classic-capture-image.md) so you can quickly deploy additional VMs.


