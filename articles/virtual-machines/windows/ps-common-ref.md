---
title: Common PowerShell commands for Azure Virtual Machines | Microsoft Docs
description: Common PowerShell commands to get you started creating and managing your Windows VMs in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: ba3839a2-f3d5-4e19-a5de-95bfb1c0e61e
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/02/2017
ms.author: davidmu

---
# Common PowerShell commands for creating and managing Azure Virtual Machines

This article covers some of the Azure PowerShell commands that you can use to create and manage virtual machines in your Azure subscription.  For more detailed help with specific command-line switches and options, you can use **Get-Help** *command*.

See [How to install and configure Azure PowerShell](/powershell/azure/overview) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

These variables might be useful for you if running more than one of the commands in this article:

- $location - The location of the virtual machine. You can use [Get-AzureRmLocation](https://docs.microsoft.com/powershell/resourcemanager/azurerm.resources/v3.5.0/get-azurermlocation) to find a [geographical region](https://azure.microsoft.com/regions/) that works for you.
- $myResourceGroup - The name of the resource group that contains the virtual machine.
- $myVM - The name of the virtual machine.

## Create a VM

| Task | Command |
| ---- | ------- |
| Create a VM configuration |$vm = [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/New-AzureRmVMConfig) -VMName $myVM -VMSize "Standard_D1_v1"<BR></BR><BR></BR>The VM configuration is used to define or update settings for the VM. The configuration is initialized with the name of the VM and its [size](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). |
| Add configuration settings |$vm = [Set-AzureRmVMOperatingSystem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Set-AzureRmVMOperatingSystem) -VM $vm -Windows -ComputerName $myVM -Credential $cred -ProvisionVMAgent -EnableAutoUpdate<BR></BR><BR></BR>Operating system settings including [credentials](https://technet.microsoft.com/library/hh849815.aspx) are added to the configuration object that you previously created using New-AzureRmVMConfig. |
| Add a network interface |$vm = [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Add-AzureRmVMNetworkInterface) -VM $vm -Id $nic.Id<BR></BR><BR></BR>A VM must have a [network interface](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to communicate in a virtual network. You can also use [Get-AzureRmNetworkInterface](/powershell/module/azurerm.network/get-azurermnetworkinterface) to retrieve an existing network interface object. |
| Specify a platform image |$vm = [Set-AzureRmVMSourceImage](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Set-AzureRmVMSourceImage) -VM $vm -PublisherName "publisher_name" -Offer "publisher_offer" -Skus "product_sku" -Version "latest"<BR></BR><BR></BR>[Image information](cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) is added to the configuration object that you previously created using New-AzureRmVMConfig. The object returned from this command is only used when you set the OS disk to use a platform image. |
| Set OS disk to use a platform image |$vm = [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Set-AzureRmVMOSDisk) -VM $vm -Name "myOSDisk" -VhdUri "http://mystore1.blob.core.windows.net/vhds/myOSDisk.vhd" -CreateOption FromImage<BR></BR><BR></BR>The name of the operating system disk and its location in [storage](../../storage/storage-powershell-guide-full.md) is added to the configuration object that you previously created. |
| Set OS disk to use a generalized image |$vm = Set-AzureRmVMOSDisk -VM $vm -Name "myOSDisk" -SourceImageUri "https://mystore1.blob.core.windows.net/system/Microsoft.Compute/Images/myimages/myprefix-osDisk.{guid}.vhd" -VhdUri "https://mystore1.blob.core.windows.net/vhds/disk_name.vhd" -CreateOption FromImage -Windows<BR></BR><BR></BR>The name of the operating system disk, the location of the source image, and the disk's location in [storage](../../storage/storage-powershell-guide-full.md) is added to the configuration object. |
| Set OS disk to use a specialized image |$vm = Set-AzureRmVMOSDisk -VM $vm -Name "myOSDisk" -VhdUri "http://mystore1.blob.core.windows.net/vhds/" -CreateOption Attach -Windows |
| Create a VM |[New-AzureRmVM]() -ResourceGroupName $myResourceGroup -Location $location -VM $vm<BR></BR><BR></BR>All resources are created in a [resource group](../../azure-resource-manager/powershell-azure-resource-manager.md). Before you run this command, run New-AzureRmVMConfig, Set-AzureRmVMOperatingSystem, Set-AzureRmVMSourceImage, Add-AzureRmVMNetworkInterface, and Set-AzureRmVMOSDisk. |

## Get information about VMs

| Task | Command |
| ---- | ------- |
| List VMs in a subscription |[Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) |
| List VMs in a resource group |Get-AzureRmVM -ResourceGroupName $myResourceGroup<BR></BR><BR></BR>To get a list of resource groups in your subscription, use [Get-AzureRmResourceGroup](/powershell/module/azurerm.resources/get-azurermresourcegroup). |
| Get information about a VM |Get-AzureRmVM -ResourceGroupName $myResourceGroup -Name $myVM |

## Manage VMs
| Task | Command |
| --- | --- |
| Start a VM |[Start-AzureRmVM](/powershell/module/azurerm.compute/start-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Stop a VM |[Stop-AzureRmVM](/powershell/module/azurerm.compute/stop-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Restart a running VM |[Restart-AzureRmVM](/powershell/module/azurerm.compute/restart-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Delete a VM |[Remove-AzureRmVM](/powershell/module/azurerm.compute/remove-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM |
| Generalize a VM |[Set-AzureRmVm](/powershell/module/azurerm.compute/set-azurermvm) -ResourceGroupName $myResourceGroup -Name $myVM -Generalized<BR></BR><BR></BR>Run this command before you run Save-AzureRmVMImage. |
| Capture a VM |[Save-AzureRmVMImage](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Save-AzureRmVMImage) -ResourceGroupName $myResourceGroup -VMName $myVM -DestinationContainerName "myImageContainer" -VHDNamePrefix "myImagePrefix" -Path "C:\filepath\filename.json"<BR></BR><BR></BR>A virtual machine must be [shut down and generalized](generalize-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to be used to create an image. Before you run this command, run Set-AzureRmVm. |
| Update a VM |[Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) -ResourceGroupName $myResourceGroup -VM $vm<BR></BR><BR></BR>Get the current VM configuration using Get-AzureRmVM, change configuration settings on the VM object, and then run this command. |
| Add a data disk to a VM |[Add-AzureRmVMDataDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Add-AzureRmVMDataDisk) -VM $vm -Name "myDataDisk" -VhdUri "https://mystore1.blob.core.windows.net/vhds/myDataDisk.vhd" -LUN # -Caching ReadWrite -DiskSizeinGB # -CreateOption Empty<BR></BR><BR></BR>Use Get-AzureRmVM to get the VM object. Specify the LUN number and the size of the disk. Run Update-AzureRmVM to apply the configuration changes to the VM. The disk that you add is not initialized. For information about initializing disks as they are added, see [Manage Azure Virtual Machines using Resource Manager and PowerShell](ps-manage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). |
| Remove a data disk from a VM |[Remove-AzureRmVMDataDisk](/powershell/module/azurerm.compute/remove-azurermvmdatadisk) -VM $vm -Name "myDataDisk"<BR></BR><BR></BR>Use Get-AzureRmVM to get the VM object. Run Update-AzureRmVM to apply the configuration changes to the VM. |
| Add an extension to a VM |[Set-AzureRmVMExtension](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.5.0/Set-AzureRmVMExtension) -ResourceGroupName $myResourceGroup -Location $location -VMName $myVM -Name "extensionName" -Publisher "publisherName" -Type "extensionType" -TypeHandlerVersion "#.#" -Settings $Settings -ProtectedSettings $ProtectedSettings<BR></BR><BR></BR>Run this command with the appropriate [configuration information](extensions-configuration-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for the extension that you want to install. |
| Remove a VM extension |[Remove-AzureRmVMExtension](/powershell/module/azurerm.compute/remove-azurermvmextension) -ResourceGroupName $myResourceGroup -Name "extensionName" -VMName $myVM |

## Next steps
* See the basic steps for creating a virtual machine in [Create a Windows VM using Resource Manager and PowerShell](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

