<properties
	pageTitle="Create a virtual machine running Linux in Azure"
	description="Learn to create Azure virtual machine (VM) running Linux by using an image from Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/03/2015"
	ms.author="kathydav"/>

# Create a Virtual Machine Running Linux

> [AZURE.SELECTOR]
- [Azure Portal](virtual-machines-linux-tutorial.md)
- [PowerShell](virtual-machines-ps-create-preconfigure-linux-vms.md)

Creating an Azure virtual machine (VM) that runs Linux is easy to do. This tutorial shows you how to use the Azure portal to create one quickly without installing any tools. You also can create VMs by using one of these tools:

- [Azure Cross-Platform Command-Line Interface (xplat-cli)](virtual-machines-command-line-tools.md)
- [Azure PowerShell](virtual-machines-ps-create-preconfigure-linux-vms.md)
- [Server Explorer in Visual Studio](https://msdn.microsoft.com/library/azure/dn569263.aspx)

You can also create Linux VMs using [your own images as templates](virtual-machines-linux-create-upload-vhd.md).
[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

## <a id="custommachine"> </a>How to create the virtual machine ##

This tutorial uses the **From Gallery** method to create a virtual machine because it gives you more options than the **Quick Create** method. You can choose connected resources, the DNS name, and the network connectivity if needed.

**Important**: This tutorial creates a virtual machine that's not connected to a virtual network. If you want your virtual machine to use a virtual network, you must specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

[AZURE.INCLUDE [virtual-machines-create-LinuxVM](../includes/virtual-machines-create-LinuxVM.md)]

[AZURE.INCLUDE [virtual-machines-Linux-tutorial-log-on-attach-disk](../includes/virtual-machines-Linux-tutorial-log-on-attach-disk.md)]

> [AZURE.NOTE] You can also connect to your Linux virtual machine using an SSH key for identification. For details, see [How to Use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md).

## Next Steps

To learn more about Linux on Azure, see:

- [Linux and Open-Source Computing on Azure](virtual-machines-linux-opensource.md)

- [How to use the Azure Command-Line Tools for Mac and Linux](virtual-machines-command-line-tools.md)

- [Deploy a LAMP app using the Azure CustomScript Extension for Linux](virtual-machines-linux-script-lamp.md)

- [About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx)

- [The Docker Virtual Machine Extension for Linux on Azure](virtual-machines-docker-vm-extension.md)
