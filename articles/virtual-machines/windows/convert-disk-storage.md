---
title: Convert Azure managed disks storage from standard to premium, and vice versa | Microsoft Docs
description: How to convert Azure managed disks from standard to premium, and vice versa, by using Azure PowerShell.
services: virtual-machines-windows
documentationcenter: ''
author: ramankum
manager: kavithag
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 08/07/2017
ms.author: ramankum
---

# Convert Azure managed disks storage from standard to premium, and vice versa

Managed disks offers two storage options: [Premium](../../storage/storage-premium-storage.md) (SSD-based) and [Standard](../../storage/storage-standard-storage.md) (HDD-based). It allows you to easily switch between the two options with minimal downtime based on your performance needs. This capability is not available for unmanaged disks. But you can easily [convert to managed disks](convert-unmanaged-to-managed-disks.md) to easily switch between the two options.

This article shows you how to convert managed disks from standard to premium, and vice versa by using Azure PowerShell. If you need to install or upgrade it, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps.md).

## Before you begin

* The conversion requires a restart of the VM, so schedule the migration of your disks storage during a pre-existing maintenance window. 
* If you are using unmanaged disks, first [convert to managed disks](convert-unmanaged-to-managed-disks.md) to use this article to switch between the two storage options. 


## Convert all the managed disks of a VM from standard to premium, and vice versa

In the following example, we show how to switch all the disks of a VM from standard to premium storage. To use premium managed disks, your VM must use a [VM size](sizes.md) that supports premium storage. This example also switches to a size that supports premium storage.

```powershell
# Name of the resource group that contains the VM
$rgName = 'yourResourceGroup'

# Name of the your virtual machine
$vmName = 'yourVM'

# Choose between StandardLRS and PremiumLRS based on your scenario
$storageType = 'PremiumLRS'

# Premium capable size
# Required only if converting storage from standard to premium
$size = 'Standard_DS2_v2'
$vm = Get-AzureRmVM -Name $vmName -resourceGroupName $rgName

# Stop and deallocate the VM before changing the size
Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force

# Change the VM size to a size that supports premium storage
# Skip this step if converting storage from premium to standard
$vm.HardwareProfile.VmSize = $size
Update-AzureRmVM -VM $vm -ResourceGroupName $rgName

# Get all disks in the resource group of the VM
$vmDisks = Get-AzureRmDisk -ResourceGroupName $rgName 

# For disks that belong to the selected VM, convert to premium storage
foreach ($disk in $vmDisks)
{
	if ($disk.OwnerId -eq $vm.Id)
	{
		$diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType $storageType
		Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $rgName `
		-DiskName $disk.Name
	}
}

Start-AzureRmVM -ResourceGroupName $rgName -Name $vmName
```
## Convert a managed disk from standard to premium, and vice versa

For your dev/test workload, you may want to have mixture of standard and premium disks to reduce your cost. You can accomplish it by upgrading to premium storage, only the disks that require better performance. In the following example, we show how to switch a single disk of a VM from standard to premium storage, and vice versa. To use premium managed disks, your VM must use a [VM size](sizes.md) that supports premium storage. This example also switches to a size that supports premium storage.

```powershell

$diskName = 'yourDiskName'
# resource group that contains the managed disk
$rgName = 'yourResourceGroupName'
# Choose between StandardLRS and PremiumLRS based on your scenario
$storageType = 'PremiumLRS'
# Premium capable size 
$size = 'Standard_DS2_v2'

$disk = Get-AzureRmDisk -DiskName $diskName -ResourceGroupName $rgName

# Get the ARM resource to get name and resource group of the VM
$vmResource = Get-AzureRmResource -ResourceId $disk.OwnerId
$vm = Get-AzureRmVM $vmResource.ResourceGroupName -Name $vmResource.ResourceName 

# Stop and deallocate the VM before changing the storage type
Stop-AzureRmVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name -Force

# Change the VM size to a size that supports premium storage
# Skip this step if converting storage from premium to standard
$vm.HardwareProfile.VmSize = $size
Update-AzureRmVM -VM $vm -ResourceGroupName $rgName

# Update the storage type
$diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType $storageType
Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $rgName `
-DiskName $disk.Name

Start-AzureRmVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name
```

## Next steps

Take a read-only copy of a VM by using [snapshots](snapshot-copy-managed-disk.md).

