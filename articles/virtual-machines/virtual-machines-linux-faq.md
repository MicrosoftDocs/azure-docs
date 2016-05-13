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
	ms.date="05/13/2016"
	ms.author="cynthn"/>

# Frequently asked question about Azure Virtual Machines created with the resource manager deployment model


This article addresses some common questions users ask about Azure virtual machines created with the Resource Manager deployment model.

## What can I run on an Azure VM?

All subscribers can run server software on an Azure virtual machine. For more information, see [Linux on Azure-Endorsed Distributions](http://go.microsoft.com/fwlink/p/?LinkId=393551)


## How much storage can I use with a virtual machine?

Each data disk can be up to 1 TB. The number of data disks you can use depends on the size of the virtual machine. For details, see [Sizes for Virtual Machines](virtual-machines-linux-sizes.md).

An Azure storage account provides storage for the operating system disk and any data disks. Each disk is a .vhd file stored as a page blob. For pricing details, see [Storage Pricing Details](https://azure.microsoft.com/pricing/details/storage/).



## How can I access my virtual machine?

You need to establish a remote connection to log on to the virtual machine, using Secure Shell (SSH). For instructions, see [How to Use SSH with Linux and Mac on Azure](virtual-machines-linux-use-ssh-key.md). By default, SSH allows a maximum of 10 concurrent connections. You can increase this number by editing the configuration file.


If you’re having problems with Remote Desktop or SSH, check out [Troubleshoot Secure Shell (SSH) connections](virtual-machines-linux-troubleshoot-ssh-connection.md).

## Can I use the temporary disk (/dev/sdb1) to store data?

You shouldn’t use the temporary disk (/dev/sdb1) to store data. It is only there for temporary storage, you would risk losing data that can’t be recovered. 



## Why am I not seeing Canada Central and Canada East regions as available locations for virtual machines through Azure Resource Manager?

A: The two new regions of Canada Central and Canada East are not automatically registered for virtual machine creation for existing Azure subscriptions. This registration will be done automatically when a virtual machine is deployed through the Azure portal to any other region using Azure Resource Manager. After a virtual machine is deployed to any other Azure region the new regions should be available for subsequent virtual machines.



