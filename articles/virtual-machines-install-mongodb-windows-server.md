<properties 
	pageTitle="Install MongoDB on a Windows Server virtual machine" 
	description="Learn how to install MongoDB on an Azure VM running Windows Server." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/06/2015" 
	ms.author="kathydav"/>

#Install MongoDB on a virtual machine running Windows Server

[MongoDB][MongoDB] is a popular open source, high performance NoSQL database.  Using the [Azure Management Portal][AzureManagementPortal], you can create a virtual machine running Windows Server from the Image Gallery.  You can then install and configure a MongoDB database on the virtual machine.

This article covers how to:

- Use the Management Portal to create a Windows Server virtual machine from the gallery
- Connect to the virtual machine using Remote Desktop
- Attach a data disk to the virtual machine
- Install MongoDB on the virtual machine

## Create a virtual machine running Windows Server

Following are general instructions; you can modify them by creating an endpoint to allow MongoDB to be accessed remotely. (You also can create it later, described after instructions for installing MongoDB.) On the last page of the wizard, add an endpoint and configure it like this:

- Name it **Mongo**
- Use **TCP** as the protocol
- Set both the public and private ports to **27017**.
 
[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../includes/virtual-machines-create-WindowsVM.md)]

## Attach a data disk
To provide a storage for the virtual machine, attach a data disk and then initialize it so that Windows can use it. You can attach either an existing disk if you already have data you want to use, or attach an empty disk.

[AZURE.INCLUDE [howto-attach-disk-windows-linux](../includes/howto-attach-disk-windows-linux.md)]

For instructions on initalizing the disk, see "How to: Initialize a new data disk in Windows Server" in [How to Attach a Data Disk to a Windows Virtual Machine](storage-windows-attach-disk.md).

## Install and run MongoDB on the virtual machine 

[AZURE.INCLUDE [install-and-run-mongo-on-win2k8-vm](../includes/install-and-run-mongo-on-win2k8-vm.md)]

##Summary
In this tutorial you learned how to create a Windows Server virtual machine, remotely connect to it, and attach a data disk.  You also learned how to install and configure MongoDB on the Windows virtual machine. For more information on MongoDB, see the [MongoDB Documentation][MongoDocs].

[MongoDocs]: http://www.mongodb.org/display/DOCS/Home
[MongoDB]: http://www.mongodb.org/
[AzureManagementPortal]: http://manage.windowsazure.com
