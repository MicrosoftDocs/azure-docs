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

Managed Disks offers three storage options: [Premium SSD](../windows/premium-storage.md), Standard SSD(Preview), and [Standard HDD](../windows/standard-storage.md). It allows you to easily switch between the options with minimal downtime based on your performance needs. This is not supported for unmanaged disks. But you can easily [convert to managed disks](convert-unmanaged-to-managed-disks.md) to easily switch between the disk types.

This article shows you how to convert managed disks from standard to premium, and vice versa by using Azure PowerShell. If you need to install or upgrade it, see [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-6.8.1).

## Before you begin

* The conversion requires a restart of the VM, so schedule the migration of your disks storage during a pre-existing maintenance window. 
* If you are using unmanaged disks, first [convert to managed disks](convert-unmanaged-to-managed-disks.md) to use this article to switch between the storage options. 
* This article requires the Azure PowerShell module version 6.0.0 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). You also need to run `Connect-AzureRmAccount` to create a connection with Azure.


## Convert all the managed disks of a VM from standard to premium, and vice versa

The following example shows how to switch all the disks of a VM from standard to premium storage. To use premium managed disks, your VM must use a [VM size](sizes.md) that supports premium storage. This example also switches to a size that supports premium storage.

```azurepowershell-interactive
# Name of the resource group that contains the VM
$rgName = 'yourResourceGroup'

# Name of the your virtual machine
$vmName = 'yourVM'

# Choose between StandardLRS and PremiumLRS based on your scenario
$storageType = 'Premium_LRS'

# Premium capable size
# Required only if converting storage from standard to premium
$size = 'Standard_DS2_v2'

# Stop and deallocate the VM before changing the size
Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force

$vm = Get-AzureRmVM -Name $vmName -resourceGroupName $rgName

# Change the VM size to a size that supports premium storage
# Skip this step if converting storage from premium to standard
$vm.HardwareProfile.VmSize = $size
Update-AzureRmVM -VM $vm -ResourceGroupName $rgName

# Get all disks in the resource group of the VM
$vmDisks = Get-AzureRmDisk -ResourceGroupName $rgName 

# For disks that belong to the selected VM, convert to premium storage
foreach ($disk in $vmDisks)
{
	if ($disk.ManagedBy -eq $vm.Id)
	{
		$diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType $storageType
		Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $rgName `
		-DiskName $disk.Name
	}
}

Start-AzureRmVM -ResourceGroupName $rgName -Name $vmName
```
## Convert a managed disk from standard to premium, and vice versa

For your dev/test workload, you may want to have mixture of standard and premium disks to reduce your cost. You can accomplish it by upgrading to premium storage, only the disks that require better performance. The following example shows how to switch a single disk of a VM from standard to premium storage, and vice versa. To use premium managed disks, your VM must use a [VM size](sizes.md) that supports premium storage. This example also switches to a size that supports premium storage.

```azurepowershell-interactive

$diskName = 'yourDiskName'
# resource group that contains the managed disk
$rgName = 'yourResourceGroupName'
# Choose between StandardLRS and PremiumLRS based on your scenario
$storageType = 'Premium_LRS'
# Premium capable size 
$size = 'Standard_DS2_v2'

$disk = Get-AzureRmDisk -DiskName $diskName -ResourceGroupName $rgName

# Get parent VM resource
$vmResource = Get-AzureRmResource -ResourceId $disk.ManagedBy

# Stop and deallocate the VM before changing the storage type
Stop-AzureRmVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name -Force

$vm = Get-AzureRmVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name 

# Change the VM size to a size that supports premium storage
# Skip this step if converting storage from premium to standard
$vm.HardwareProfile.VmSize = $size
Update-AzureRmVM -VM $vm -ResourceGroupName $rgName

# Update the storage type
$diskUpdateConfig = New-AzureRmDiskUpdateConfig -AccountType $storageType -DiskSizeGB $disk.DiskSizeGB
Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $rgName `
-DiskName $disk.Name

Start-AzureRmVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name
```

## Convert a managed disk from standard HDD to standard SSD, and vice versa

The following example shows how to switch a single disk of a VM from standard HDD to standard SSD, and vice versa.

```azurepowershell-interactive

$diskName = 'yourDiskName'
# resource group that contains the managed disk
$rgName = 'yourResourceGroupName'
# Choose between Standard_LRS and StandardSSD_LRS based on your scenario
$storageType = 'StandardSSD_LRS'

$disk = Get-AzureRmDisk -DiskName $diskName -ResourceGroupName $rgName

# Get parent VM resource
$vmResource = Get-AzureRmResource -ResourceId $disk.ManagedBy

# Stop and deallocate the VM before changing the storage type
Stop-AzureRmVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name -Force

$vm = Get-AzureRmVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name 

# Update the storage type
$diskUpdateConfig = New-AzureRmDiskUpdateConfig -AccountType $storageType -DiskSizeGB $disk.DiskSizeGB
Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $rgName `
-DiskName $disk.Name

Start-AzureRmVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name
```

## Next steps

Take a read-only copy of a VM by using [snapshots](snapshot-copy-managed-disk.md).

