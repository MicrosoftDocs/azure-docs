<properties 
   pageTitle="Common PowerShell commands for VMs | Microsoft Azure"
   description="Common PowerShell commands to get you started creating and managing your VMs in Azure on Windows"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="davidmu1" 
   manager="timlt" 
   editor="tysonn" 
   tags="azure-resource-manager"/>
   
<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="06/07/2016"
   ms.author="davidmu" />

# Common PowerShell commands for creating and managing VMs

This article covers some of the Azure PowerShell commands that you can use to create and manage virtual machines in your Azure subscription.  For more detailed help with specific command line switches and options, you can use **Get-Help** *command*.

## Create resources using Azure PowerShell

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about how to install the latest version of Azure PowerShell, select the subscription that you want to use, and sign in to your Azure account.

Task | Command
-------------- | -------------------------
Create a VM configuration | $vm = [New-AzureRmVMConfig](https://msdn.microsoft.com/library/mt603727.aspx) -VMName "vm_name" -VMSize "vm_size"<BR></BR><BR></BR>The VM configuration is used to define or update settings for the VM. The configuration is initialized with the name of the VM and its [size](virtual-machines-windows-sizes.md).
Add configuration settings | $vm = [Set-AzureRmVMOperatingSystem](https://msdn.microsoft.com/library/mt603843.aspx) -VM $vm -Windows -ComputerName "computer_name" -Credential $cred -ProvisionVMAgent -EnableAutoUpdate<BR></BR><BR></BR>Operating system settings including [credentials](https://technet.microsoft.com/library/hh849815.aspx) are added to the configuration object that you previously created using New-AzureRmVMConfig.
Add a network interface | $vm = [Add-AzureRmVMNetworkInterface](https://msdn.microsoft.com/library/mt619351.aspx) -VM $vm -Id $nic.Id<BR></BR><BR></BR>A VM must have a [network interface](virtual-machines-windows-ps-create.md) to communicate in a virtual network. You can also use [Get-AzureRmNetworkInterface](https://msdn.microsoft.com/library/mt619434.aspx) to retrieve an existing network interface object.
Specify a platform image | $vm = [Set-AzureRmVMSourceImage](https://msdn.microsoft.com/library/mt619344.aspx) -VM $vm -PublisherName "publisher_name" -Offer "publisher_offer" -Skus "product_sku" -Version "latest"<BR></BR><BR></BR>[Image information](virtual-machines-windows-cli-ps-findimage.md) is added to the configuration object that you previously created using New-AzureRmVMConfig. The object returned from this command is only used when you set the OS disk to use a platform image.
Set OS disk to use a platform image | $vm = [Set-AzureRmVMOSDisk](https://msdn.microsoft.com/library/mt603746.aspx) -VM $vm -Name "disk_name" -VhdUri "http://mystore1.blob.core.windows.net/vhds/disk_name.vhd" -CreateOption FromImage<BR></BR><BR></BR>The name of the operating system disk and where it will be located in [storage](../storage/storage-powershell-guide-full.md) is added to the configuration object that you previously created.
Set OS disk to use a generalized image | $vm = Set-AzureRmVMOSDisk -VM $vm -Name "disk_name" -SourceImageUri "https://mystore1.blob.core.windows.net/system/Microsoft.Compute/Images/myimages/myprefix-osDisk.{guid}.vhd" -VhdUri "https://mystore1.blob.core.windows.net/vhds/disk_name.vhd" -CreateOption FromImage -Windows<BR></BR><BR></BR>The name of the operating system disk, the location of the source image, and where the disk will be located in [storage](../storage/storage-powershell-guide-full.md) is added to the configuration object that you previously created.
Set OS disk to use a specialized image | $vm = Set-AzureRmVMOSDisk -VM $vm -Name "name_of_disk" -VhdUri "http://mystore1.blob.core.windows.net/vhds/" -CreateOption Attach  -Windows
Create a VM | [New-AzureRmVM]() -ResourceGroupName "resource_group_name" -Location "location_name" -VM $vm<BR></BR><BR></BR>All resources are created in a [resource group](../powershell-azure-resource-manager.md). The VM must be created in the same [location](https://msdn.microsoft.com/library/azure/dn495177.aspx) as the resource group. Before you run this command, run New-AzureRmVMConfig, Set-AzureRmVMOperatingSystem, Set-AzureRmVMSourceImage, Add-AzureRmVMNetworkInterface, and Set-AzureRmVMOSDisk.
List VMs in a subscription| [Get-AzureRmVM](https://msdn.microsoft.com/library/mt603718.aspx)
List VMs in a resource group | Get-AzureRmVM -ResourceGroupName "resource_group_name"<BR></BR><BR></BR>To get a list of resource groups in your subscription, use [Get-AzureRmResourceGroup](https://msdn.microsoft.com/library/mt679016.aspx).
Get information about a VM | Get-AzureRmVM -ResourceGroupName "resource_group_name" -Name "vm_name"
Start a VM | [Start-AzureRmVM](https://msdn.microsoft.com/library/mt603453.aspx) -ResourceGroupName "resource_group_name" -Name "vm_name"
Stop a VM | [Stop-AzureRmVM](https://msdn.microsoft.com/library/mt603483.aspx) -ResourceGroupName "resource_group_name" -Name "vm_name"
Restart a running VM | [Restart-AzureRmVM](https://msdn.microsoft.com/library/mt603775.aspx) -ResourceGroupName "resource_group_name" -Name "vm_name"
Delete a VM | [Remove-AzureRmVM](https://msdn.microsoft.com/library/mt603641.aspx) -ResourceGroupName "resource_group_name" -Name "vm_name"
Generalize a VM | [Set-AzureRmVm](https://msdn.microsoft.com/library/mt603688.aspx) -ResourceGroupName YourResourceGroup -Name "vm_name" -Generalized<BR></BR><BR></BR>You must run this command before you run Save-AzureRmVMImage.
Capture a VM | [Save-AzureRmVMImage](https://msdn.microsoft.com/library/mt619423.aspx) -ResourceGroupName "resource_group_name" -VMName "vm_name" -DestinationContainerName "image_container" -VHDNamePrefix "image_name_prefix" -Path "C:\filepath\filename.json"<BR></BR><BR></BR>A virtual machine must be [shutdown and generalized](virtual-machines-windows-capture-image.md) to be used to create an image. Before you run this command, run Set-AzureRmVm.
Update a VM | [Update-AzureRmVM](https://msdn.microsoft.com/library/mt603662.aspx) -ResourceGroupName "resource_group_name" -VM $vm<BR></BR><BR></BR>Get the current VM configuration using Get-AzureRmVM, change configuration settings on the VM object, and then run this command.
Add a data disk to a VM | [Add-AzureRmVMDataDisk](https://msdn.microsoft.com/library/mt603673.aspx) -VM $vm -Name "disk_name" -VhdUri "https://mystore1.blob.core.windows.net/vhds/disk_name.vhd" -LUN # -Caching ReadWrite -DiskSizeinGB # -CreateOption Empty<BR></BR><BR></BR>Use Get-AzureRmVM to get the VM object. Specify the LUN number and the size of the disk. Run Update-AzureRmVM to apply the configuration changes to the VM. The disk that you add is not initialized, to do this, see [Manage Azure Virtual Machines using Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
Remove a data disk from a VM | [Remove-AzureRmVMDataDisk](https://msdn.microsoft.com/library/mt603614.aspx) -VM $vm -Name "disk_name"<BR></BR><BR></BR>Use Get-AzureRmVM to get the VM object. Run Update-AzureRmVM to apply the configuration changes to the VM.
Add an extension to a VM | [Set-AzureRmVMExtension](https://msdn.microsoft.com/library/mt603745.aspx) -ResourceGroupName "resource_group_name" -Location "azure_location" -VMName "vm_name" -Name "extension_name" -Publisher "publisher_name" -Type "extension_type" -TypeHandlerVersion "#.#" -Settings $Settings -ProtectedSettings $ProtectedSettings<BR></BR><BR></BR>Run this commmand with the appropriate [configuration information](virtual-machines-windows-extensions-configuration-samples.md) for the extension that you want to install.
Remove a VM extension | [Remove-AzureRmVMExtension](https://msdn.microsoft.com/library/mt603782.aspx) -ResourceGroupName "resource_group_name" -Name "extension_name" -VMName "vm_name"

## Next steps

- See the basic steps for creating a virtual machine in [Create a Windows VM using Resource Manager and PowerShell](virtual-machines-windows-ps-create.md).

