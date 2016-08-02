<properties
	pageTitle="Install MongoDB on a Windows VM | Microsoft Azure"
	description="Learn how to install MongoDB on an Azure VM created with the classic deployment model running Windows Server."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/20/2016"
	ms.author="iainfou"/>

#Install MongoDB on a Windows VM

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

[MongoDB][MongoDB] is a popular open-source, high-performance NoSQL database.  This article guides you through creating a new Windows Server virtual machine (VM) using the [Azure classic portal][AzurePortal], creating and attaching a data disk to the VM, and then installing and configuring MongoDB. If have an existing VM in Azure that you would like to use, you can jump straight to [installing and configuring MongoDB](#install-and-run-mongo-on-win2k8-vm).


## Create a virtual machine running Windows Server

Follow these instructions to create a virtual machine.

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../../includes/virtual-machines-create-windowsvm.md)]

> [AZURE.NOTE] You can add an endpoint for MongoDB while creating the virtual machine, and configure it as follows: name it as **Mongo**, use **TCP** as the protocol, and set both the public and private ports to **27017**.

## Attach a data disk
To provide storage for the virtual machine, attach a data disk and then initialize it so that Windows can use it. You can either attach an existing disk if you already have data you want to use, or attach an empty disk.

[AZURE.INCLUDE [howto-attach-disk-windows-linux](../../includes/howto-attach-disk-windows-linux.md)]

For instructions on initializing the disk, see "How to: Initialize a new data disk in Windows Server" in [How to attach a data disk to a Windows virtual machine](virtual-machines-windows-classic-attach-disk.md).

## Install and run MongoDB on the virtual machine

[AZURE.INCLUDE [install-and-run-mongo-on-win2k8-vm](../../includes/install-and-run-mongo-on-win2k8-vm.md)]

## Summary
In this tutorial, you learned how to create a virtual machine running Windows Server, remotely connect to it, and attach a data disk.  You also learned how to install and configure MongoDB on the Windows-based virtual machine. You can now access MongoDB on the Windows-based virtual machine, by following the advanced topics in the [MongoDB documentation][MongoDocs].

[MongoDocs]: http://docs.mongodb.org/manual/
[MongoDB]: http://www.mongodb.org/
[AzurePortal]: http://manage.windowsazure.com
