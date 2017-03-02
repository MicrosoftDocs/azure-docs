---
title: Expand a data disk attached to a Windows VM in Azure | Microsoft Docs
description: Expand the size of a data disk that is attached to a Windows virtual machine using either the portal or PowerShell.
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
ms.date: 03/01/2017
ms.author: cynthn

---

# Increase the size of a data disk attached to a Windows VM

If you need to increase the size of the data disk attached to your virtual machine, you can increase the size using the portal or PowerShell. After you increase the size of the data disk in the Azure VM settings, you also need to go into the VM and allocate the new disk space.

## Managed data disk

```powershell
# Select resource group
     
    $rg = Get-AzureRMReseourceGroup | Out-GridView `
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

## Unmanaged data disk in a storage account

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