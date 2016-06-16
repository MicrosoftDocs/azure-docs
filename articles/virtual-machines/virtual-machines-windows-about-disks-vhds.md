<properties
	pageTitle="About disks and VHDs for Windows VMs | Microsoft Azure"
	description="Learn about the basics of disks and VHDs for Windows virtual machines in Azure."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager,azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/16/2016"
	ms.author="cynthn"/>

# About disks and VHDs for Azure virtual machines

Just like any other computer, virtual machines in Azure use disks as a place to store an operating system, applications, and data. All Azure virtual machines have at least two disks – a Windows operating system disk (in the case of a Windows VM) and a temporary disk. The operating system disk is created from an image, and both the operating system disk and the image are actually virtual hard disks (VHDs) stored in an Azure storage account. Virtual machines also can have one or more data disks, that are also stored as VHDs. This article is also available for [Linux virtual machines](virtual-machines-linux-about-disks-vhds.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-about-disks-vhds](../../includes/virtual-machines-common-about-disks-vhds.md)]

## Next steps
-  [Capture a Windows virtual machine](virtual-machines-windows-capture-image.md) so you can scale-out your VM deployment.
-  [Upload a Windows VM image to Azure](virtual-machines-windows-upload-image.md) to use when creating a new VM.
-  [Change the drive letter of the Windows temporary disk](virtual-machines-windows-classic-change-drive-letter.md) so your application can use the D: drive for data.
