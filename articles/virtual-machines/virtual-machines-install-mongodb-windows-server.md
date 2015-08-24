<properties
	pageTitle="Install MongoDB on a Windows Server virtual machine"
	description="Learn how to install MongoDB on an Azure VM running Windows Server."
	services="virtual-machines"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor="tysonn"
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2015"
	ms.author="dkshir"/>

#Install MongoDB on a virtual machine running Windows Server

[MongoDB][MongoDB] is a popular open-source, high-performance NoSQL database.  Using the [Azure portal][AzureManagementPortal], you can create a virtual machine running Windows Server from the Image Gallery, using the classic deployment model. You can then install and configure a MongoDB database on the virtual machine.


## Create a virtual machine running Windows Server

Follow these instructions to create a virtual machine.

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../../includes/virtual-machines-create-windowsvm.md)]

> [AZURE.NOTE] You can add an endpoint for MongoDB while creating the virtual machine, and configure it as follows: name it as **Mongo**, use **TCP** as the protocol, and set both the public and private ports to **27017**.

## Attach a data disk
To provide storage for the virtual machine, attach a data disk and then initialize it so that Windows can use it. You can either attach an existing disk if you already have data you want to use, or attach an empty disk.

[AZURE.INCLUDE [howto-attach-disk-windows-linux](../../includes/howto-attach-disk-windows-linux.md)]

For instructions on initializing the disk, see "How to: Initialize a new data disk in Windows Server" in [How to attach a data disk to a Windows virtual machine](storage-windows-attach-disk.md).

## Install and run MongoDB on the virtual machine

[AZURE.INCLUDE [install-and-run-mongo-on-win2k8-vm](../../includes/install-and-run-mongo-on-win2k8-vm.md)]

##Summary
In this tutorial, you learned how to create a virtual machine running Windows Server, remotely connect to it, and attach a data disk.  You also learned how to install and configure MongoDB on the Windows-based virtual machine. You can now access MongoDB on the Windows-based virtual machine, by following the advanced topics in the [MongoDB documentation][MongoDocs].

[MongoDocs]: http://docs.mongodb.org/manual/
[MongoDB]: http://www.mongodb.org/
[AzureManagementPortal]: http://manage.windowsazure.com
