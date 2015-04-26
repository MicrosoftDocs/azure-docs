<properties 
	pageTitle="Create a virtual machine running Windows in Azure" 
	description="Learn to create Windows virtual machine (VM) in Azure, then log on and attach a data disk" 
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
	ms.date="04/13/2015" 
	ms.author="kathydav"/>



# Create a Virtual Machine Running Windows

> [AZURE.SELECTOR]
- [Azure Portal](virtual-machines-windows-tutorial.md)
- [Azure Preview Portal](virtual-machines-windows-tutorial-azure-preview.md)
- [PowerShell](virtual-machines-ps-create-preconfigure-windows-vms.md)

This tutorial shows you how easy it is to create an Azure virtual machine (VM). This tutorial uses a Windows Server image, but that's only one of the many images available through Azure. This includes Windows operating systems, Linux-based operating systems, and images with installed applications. The images you can choose from depend on the type of subscription you have. For example, desktop images may be available to MSDN subscribers.

You can also create Windows VMs using [your own images as templates](virtual-machines-create-upload-vhd-windows-server.md). To learn more about Azure VMs, see [Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx).

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

## <a id="createvirtualmachine"> </a>How to create the virtual machine

This section shows you how to use the **From Gallery** option in the Management Portal to create the virtual machine. This option provides more configuration choices than the **Quick Create** option. For example, if you want to join a virtual machine to a virtual network, you'll need to use the **From Gallery** option.

> [AZURE.NOTE] You can also try the richer, customizable [Azure Preview Portal](https://portal.azure.com) to create a virtual machine, automate the deployment of multi-VM application templates, use enhanced VM monitoring and diagnostics features, and more. The available VM configuration options in the two portals overlap substantially but aren't identical.  

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../includes/virtual-machines-create-WindowsVM.md)]

## Next Steps

Log on to the virtual machine. For instructions, see [How to Log on to a Virtual Machine Running Windows Server](virtual-machines-log-on-windows-server.md).

Attach a disk to store data. You can attach both empty disks and disks that contain data. For instructions, see the [Attach a Data Disk Tutorial](storage-windows-attach-disk.md).

## Additional Resources

To learn more about what you can configure for a VM and when you can do it, see [About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx).



