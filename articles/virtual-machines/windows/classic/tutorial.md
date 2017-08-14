---
title: Create a VM in the Azure portal | Microsoft Docs
description: Create a Windows virtual machine in the Azure portal.
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
ms.date: 05/30/2017
ms.author: cynthn

---
# Create a virtual machine running Windows in the Azure portal
> [!div class="op_single_selector"]
> * [Azure portal](tutorial.md)
> * [PowerShell: Classic deployment](create-powershell.md)
>
>

<br>

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. Learn how to [perform these steps using the Resource Manager deployment model](../../virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) using the **Azure portal**.

This tutorial shows you how to create an Azure virtual machine (VM) running Windows in the Azure portal. We'll use a Windows Server image as an example, but that's just one of the many images Azure offers. Note that your image choices depend on your subscription. For example, Windows desktop images may be available to MSDN subscribers.

This section shows you how to use the **Dashboard** in the Azure portal to select and then create the virtual machine.

You can also create VMs using [your own images](createupload-vhd.md). To learn about this and other methods, see [Different ways to create a Windows virtual machine](../../virtual-machines-windows-creation-choices.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

<!-- 02/27/2017 Video removed as it was based on the classic portal. -->

## <a id="createvirtualmachine"> </a>Create the virtual machine
[!INCLUDE [virtual-machines-create-WindowsVM](../../../../includes/virtual-machines-create-windowsvm.md)]

## Next steps
* Learn how to [create a VM using the Resource Manager deployment model](../../virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) in the Azure portal.
* Log on to the virtual machine. For instructions, see [Log on to a virtual machine running Windows Server](connect-logon.md).
* Attach a disk to store data. You can attach both empty disks and disks that contain data. For instructions, see the [Attach a data disk to a Windows virtual machine created with the classic deployment model](attach-disk.md).
