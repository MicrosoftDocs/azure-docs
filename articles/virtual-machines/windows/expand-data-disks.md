---
title: Expand a data disk attached to a Windows VM in Azure | Microsoft Docs
description: Expand the size of a data disk that is attached to a Windows virtual machine using PowerShell.
services: virtual-machines-windows
documentationcenter: na
author: cynthn
manager: timlt
editor: ''
tags: ''

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/02/2017
ms.author: cynthn

---

# Increase the size of a data disk attached to a Windows VM

If you need to increase the size of the data disk attached to your virtual machine, you can increase the size using PowerShell. After you increase the size of the data disk in the Azure VM settings, you also need to allocate the new disk space within the VM.


## Use Powershell to increase the size of a managed data disk

To increase the size of a managed data disk, use the following PowerShell cmdlets:

|                                                                    |                                                            |
|--------------------------------------------------------------------|------------------------------------------------------------|
| [Get-AzureRMReseourceGroup](/powershell/module/azurerm.resources/get-azurermresourcegroup) | [Get-AzureRMVM](/powershell/module/azurerm.compute/get-azurermvm)                 |
| [Stop-AzureRMVM](/powershell/module/azurerm.compute/stop-azurermvm)                        | [Set-AzureRmVMDataDisk](/powershell/module/azurerm.compute/set-azurermvmdatadisk) |
| [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm)                    | [Start-AzureRmVM](/powershell/module/azurerm.compute/start-azurermvm)             |
<br>

The following script will walk you through getting the VM information, selecting the data disk and specifying the new size.

```powershell
# Select resource group

    $rg = Get-AzureRMResourceGroup | Out-GridView `
        -Title "Select the resource group" `
        -PassThru

    $rgName = $rg.ResourceGroupName

# Select the VM

    $vm = Get-AzureRMVM -ResourceGroupName $rgName `
        | Out-GridView `
            -Title "Select a VM" `
             -PassThru

# Select data disk

    $disk = $vm.dataDiskNames | Out-GridView `
        -Title "Select a data disk" `
        -PassThru

# Specify a larger size for the data disk

    $size =  Read-Host `
        -Prompt "New size in GB"

# Stop and Deallocate VM prior to resizing data disk

    $vm | Stop-AzureRMVM -Force

# Set the new disk size

	Set-AzureRmVMDataDisk -VM $vm -Name "$disk" -DiskSizeInGB $size

# View the new size of the data disk(s)

	$vm.StorageProfile.DataDisks

# Update the configuration in Azure

	Update-AzureRmVM -VM $vm -ResourceGroupName $rgName

# Start the VM

	Start-AzureRmVM -ResourceGroupName $rgName -VMName $vm.name

```

## Use PowerShell to increase the size of an unmanaged data disk

To increase the size of unmanaged data disks in a storage account, use the following PowerShell cmdlets:

|                                                                    |                                                            |
|--------------------------------------------------------------------|------------------------------------------------------------|
| [Get-AzureRMStorageAccount](/powershell/module/azurerm.storage/get-azurermstorageaccount) | [Get-AzureRMVM](/powershell/module/azurerm.compute/get-azurermvm)                 |
| [Stop-AzureRMVM](/powershell/module/azurerm.compute/stop-azurermvm)                       | [Set-AzureRmVMDataDisk](/powershell/module/azurerm.compute/set-azurermvmdatadisk) |
| [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm)                   | [Start-AzureRmVM](/powershell/module/azurerm.compute/start-azurermvm)             |

<br>

The following script will walk you through getting the VM and storage account information, selecting the data disk and specifying the new size.

```powershell

# Select Azure Storage Account

    $storageAccount =
        Get-AzureRMStorageAccount | Out-GridView `
            -Title "Select Azure Storage Account" `
            -PassThru

    $rgName = $storageAccount.ResourceGroupName

# Select the VM

    $vm = Get-AzureRMVM `
	-ResourceGroupName $rgName | Out-GridView `
			-Title "Select a VM …" `
			-PassThru

# Select Data Disk to resize

    $disk =
        $vm.DataDiskNames | Out-GridView `
            -Title "Select a data disk to resize" `
            -PassThru


# Specify a larger data disk size

    $size =  Read-Host `
        -Prompt "New size in GB"

# Stop and Deallocate VM prior to resizing data disk

    $vm | Stop-AzureRMVM -Force

# Set the new disk size

	Set-AzureRmVMDataDisk -VM $vm -Name "$disk" `
		-DiskSizeInGB $size

# Update the configuration in Azure

	Update-AzureRmVM -VM $vm -ResourceGroupName $rgName

# Start the VM
	Start-AzureRmVM -ResourceGroupName $rgName `
	-VMName $vm.name

```

## Allocate the unallocated disk space

Once you have made the drive larger, you need to allocate the new unallocated space from within the VM. To allocate the space, you can connect to the VM use Disk Management (diskmgmt.msc). Or, if you enabled WinRM and a certificate on the VM when you created it, you can use remote PowerShell to initialize the disk. You can also use a custom script extension:

```powershell
    $location = "location-name"
    $scriptName = "script-name"
    $fileName = "script-file-name"
    Set-AzureRmVMCustomScriptExtension -ResourceGroupName $rgName -Location $locName -VMName $vmName -Name $scriptName -TypeHandlerVersion "1.4" -StorageAccountName "mystore1" -StorageAccountKey "primary-key" -FileName $fileName -ContainerName "scripts"
```

The script file can contain something like this code to increase the drive allocation to the maximum size the disks:

```powershell
$driveLetter= "F"

$MaxSize = (Get-PartitionSupportedSize -DriveLetter $driveLetter).sizeMax

Resize-Partition -DriveLetter $driveLetter -Size $MaxSize
```

## Next Steps
- [Learn more about disks and VHDs](../../storage/storage-about-disks-and-vhds-windows.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
