---
title: Common PowerShell commands for Azure Virtual Machines | Microsoft Docs
description: Common PowerShell commands to get you started creating and managing your Windows VMs in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: ba3839a2-f3d5-4e19-a5de-95bfb1c0e61e
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/01/2018
ms.author: cynthn

---
# Common PowerShell commands for creating and managing Azure Virtual Machines

This article covers some of the Azure PowerShell commands that you can use to create and manage virtual machines in your Azure subscription.  For more detailed help with specific command-line switches and options, you can use the **Get-Help** *command*.

See [How to install and configure Azure PowerShell](/powershell/azure/overview) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

These variables might be useful for you if running more than one of the commands in this article:

- $location - The location of the virtual machine. You can use [Get-AzureRmLocation](https://docs.microsoft.com/powershell/module/azurerm.resources/get-azurermlocation) to find a [geographical region](https://azure.microsoft.com/regions/) that works for you.
- $myResourceGroup - The name of the resource group that contains the virtual machine.
- $myVM - The name of the virtual machine.

## Create a VM - simplified

| Task | Command |
| ---- | ------- |
| Create a simple VM | [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) -Name $myVM <BR></BR><BR></BR> New-AzureRMVM has a set of *simplified* parameters, where all that is required is a single name. The value for -Name will be used as the name for all of the resources required for creating a new VM. You can specify more, but this is all that is required.|
| Create a VM from a custom image | New-AzureRmVm -ResourceGroupName $myResourceGroup -Name $myVM ImageName "myImage" -Location $location  <BR></BR><BR></BR>You need to have already created your own [managed image](capture-image-resource.md). You can use an image to make multiple, identical VMs. |



## Create a VM configuration

| Task | Command |
| ---- | ------- |
| Create a VM configuration |$vm = [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermvmconfig) -VMName $myVM -VMSize "Standard_D1_v1"<BR></BR><BR></BR>The VM configuration is used to define or update settings for the VM. The configuration is initialized with the name of the VM and its [size](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). |
| Add configuration settings |$vm = [Set-AzureRmVMOperatingSystem](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmoperatingsystem) -VM $vm -Windows -ComputerName $myVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate<BR></BR><BR></BR>Operating system settings including [credentials](https://technet.microsoft.com/library/hh849815.aspx) are added to the configuration object that you previously created using New-AzureRmVMConfig. |
| Add a network interface |$vm = [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/module/azurerm.compute/Add-AzureRmVMNetworkInterface) -VM $vm -Id $nic.Id<BR></BR><BR></BR>A VM must have a [network interface](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to communicate in a virtual network. You can also use [Get-AzureRmNetworkInterface](https://docs.microsoft.com/powershell/module/azurerm.compute/add-azurermvmnetworkinterface) to retrieve an existing network interface object. |
| Specify a platform image |$vm = [Set-AzureRmVMSourceImage](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmsourceimage) -VM $vm -PublisherName "publisher_name" -Offer "publisher_offer" -Skus "product_sku" -Version "latest"<BR></BR><BR></BR>[Image information](cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) is added to the configuration object that you previously created using New-AzureRmVMConfig. The object returned from this command is only used when you set the OS disk to use a platform image. |
| Create a VM |[New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm) -ResourceGroupName $myResourceGroup -Location $location -VM $vm<BR></BR><BR></BR>All resources are created in a [resource group](../../azure-resource-manager/powershell-azure-resource-manager.md). Before you run this command, run New-AzureRmVMConfig, Set-AzureRmVMOperatingSystem, Set-AzureRmVMSourceImage, Add-AzureRmVMNetworkInterface, and Set-AzureRmVMOSDisk. |
| Update a VM |[Update-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/update-azurermvm) -ResourceGroupName $myResourceGroup -VM $vm<BR></BR><BR></BR>Get the current VM configuration using Get-AzureRmVM, change configuration settings on the VM object, and then run this command. |

## Get information about VMs

| Task | Command |
| ---- | ------- |
| List VMs in a subscription |[Get-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvm) |
| List VMs in a resource group |Get-AzureRmVM -ResourceGroupName $myResourceGroup<BR></BR><BR></BR>To get a list of resource groups in your subscription, use [Get-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/get-azurermresourcegroup). |
| Get information about a VM |Get-AzureRmVM -ResourceGroupName $myResourceGroup -Name $myVM |

## Manage VMs
| Task | Command |
| --- | --- |
| Start a VM |[Start-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/start-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Stop a VM |[Stop-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/stop-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Restart a running VM |[Restart-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/restart-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Delete a VM |[Remove-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/remove-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |


## Next steps
* See the basic steps for creating a virtual machine in [Create a Windows VM using Resource Manager and PowerShell](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

