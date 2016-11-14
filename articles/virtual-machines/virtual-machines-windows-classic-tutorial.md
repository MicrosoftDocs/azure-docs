---
title: Create a VM in the classic portal | Microsoft Docs
description: Create a Windows virtual machine in the Azure classic portal.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 1871f823-ebd7-4eff-9a22-8e2411555595
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/18/2016
ms.author: cynthn

---
# Create a virtual machine running Windows in the Azure classic portal
> [!div class="op_single_selector"]
> * [Azure classic portal](virtual-machines-windows-classic-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
> * [PowerShell: Classic deployment](virtual-machines-windows-classic-create-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
> 
> 

<br>

[!INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

Learn how to [perform these steps using the Resource Manager deployment model](virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) using the **new Azure portal**. 

This tutorial shows you how to create an Azure virtual machine (VM) running Windows in the Azure classic portal. We'll use a Windows Server image as an example, but that's just one of the many images Azure offers. Note that your image choices depend on your subscription. For example, Windows desktop images may be available to MSDN subscribers.

This section shows you how to use the **From Gallery** option in the Azure classic portal to create the virtual machine. This option provides more configuration choices than the **Quick Create** option. For example, if you want to join a virtual machine to a virtual network, you'll need to use the **From Gallery** option.

You can also create VMs using [your own images](virtual-machines-windows-classic-createupload-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json). To learn about this and other methods, see [Different ways to create a Windows virtual machine](virtual-machines-windows-creation-choices.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Video walkthrough
Here's a walkthrough of this tutorial.

[!VIDEO https://channel9.msdn.com/Blogs/Azure-Documentation-Shorts/Creating-a-Windows-VM-on-Microsoft-Azure-GA-Portal/player]


## <a id="createvirtualmachine"> </a>Create the virtual machine
[!INCLUDE [virtual-machines-create-WindowsVM](../../includes/virtual-machines-create-windowsvm.md)]

## Next steps
* Learn how to [create a VM using the Resource Manager deployment model](virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) in the new Azure portal. 
* Log on to the virtual machine. For instructions, see [Log on to a virtual machine running Windows Server](virtual-machines-windows-classic-connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).
* Attach a disk to store data. You can attach both empty disks and disks that contain data. For instructions, see the [Attach a data disk to a Windows virtual machine created with the classic deployment model](virtual-machines-windows-classic-attach-disk.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

