<properties
	pageTitle="Create a custom virtual machine running Windows in Azure"
	description="Learn to create a custom virtual machine running Windows in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor=""/>


<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/29/2015"
	ms.author="kathydav"/>

#Create a custom virtual machine running Windows in Azure

A *custom* virtual machine (VM) simply means a VM you create using the **From Gallery** option because it gives you more configuration choices than the **Quick Create** option. These choices include:

- Connecting the VM to a virtual network.
- Installing the VM Agent and extensions, such as for antimalware.
- Adding the VM to an existing cloud service.
- Adding the VM to an existing storage account.
- Adding the VM to an availability set.

> [AZURE.IMPORTANT] If you want your VM to use a virtual network so you can connect to it directly by hostname or set up cross-premises connections, make sure you specify the virtual network when you create the VM. A VM can be configured to join a virtual network only when you create the VM. For details on virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

##To create the VM

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../../includes/virtual-machines-create-WindowsVM.md)]
