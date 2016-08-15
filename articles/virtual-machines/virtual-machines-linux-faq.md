<properties
	pageTitle="FAQ for Linux VMs | Microsoft Azure"
	description="Provides answers to some of the common questions about Linux virtual machines created with the Resource Manager model."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="cynthn"/>

# Frequently asked question about Linux Virtual Machines 


This article addresses some common questions users ask about Linux virtual machines created in Azure using the Resource Manager deployment model. For the Windows version of this topic, see [Frequently asked question about Windows Virtual Machines](virtual-machines-windows-faq.md)

## What can I run on an Azure VM?

All subscribers can run server software on an Azure virtual machine. For more information, see [Linux on Azure-Endorsed Distributions](virtual-machines-linux-endorsed-distros.md)


## How much storage can I use with a virtual machine?

Each data disk can be up to 1 TB. The number of data disks you can use depends on the size of the virtual machine. For details, see [Sizes for Virtual Machines](virtual-machines-linux-sizes.md).

An Azure storage account provides storage for the operating system disk and any data disks. Each disk is a .vhd file stored as a page blob. For pricing details, see [Storage Pricing Details](https://azure.microsoft.com/pricing/details/storage/).



## How can I access my virtual machine?

You need to establish a remote connection to log on to the virtual machine, using Secure Shell (SSH). See the instructions on how to connect [from Windows](virtual-machines-linux-ssh-from-windows.md) or 
[from Linux and Mac](virtual-machines-linux-ssh-from-linux.md). By default, SSH allows a maximum of 10 concurrent connections. You can increase this number by editing the configuration file.


If you’re having problems, check out [Troubleshoot Secure Shell (SSH) connections](virtual-machines-linux-troubleshoot-ssh-connection.md).

## Can I use the temporary disk (/dev/sdb1) to store data?

You shouldn’t use the temporary disk (/dev/sdb1) to store data. It is only there for temporary storage, you would risk losing data that can’t be recovered. 

## Can I copy or clone an existing Azure VM?

Yes. For instructions, see [How to create a copy of a Linux virtual machine in the Resource Manager deployment model](virtual-machines-linux-copy-vm.md).

## Why am I not seeing Canada Central and Canada East regions through Azure Resource Manager?

The two new regions of Canada Central and Canada East are not automatically registered for virtual machine creation for existing Azure subscriptions. This registration will be done automatically when a virtual machine is deployed through the Azure portal to any other region using Azure Resource Manager. After a virtual machine is deployed to any other Azure region the new regions should be available for subsequent virtual machines.

## Can I add a NIC to my VM after it's created?

No. This can currently be done only at creation time.

