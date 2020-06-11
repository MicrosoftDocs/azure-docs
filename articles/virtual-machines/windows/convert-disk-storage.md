---
title: Convert managed disks storage between standard and premium SSD
description: How to convert Azure managed disks from Standard to Premium or Premium to Standard by using Azure PowerShell.
author: roygara
ms.service: virtual-machines-windows
ms.topic: how-to
ms.date: 02/22/2019
ms.author: rogarana
ms.subservice: disks
---

# Update the storage type of a managed disk

There are four disk types of Azure managed disks: Azure ultra SSDs (preview), premium SSD, standard SSD, and standard HDD. You can switch between the three GA disk types (premium SSD, standard SSD, and standard HDD) based on your performance needs. You are not yet able to switch from or to an ultra SSD, you must deploy a new one.

This functionality is not supported for unmanaged disks. But you can easily [convert an unmanaged disk to a managed disk](convert-unmanaged-to-managed-disks.md) to be able to switch between disk types.

 

## Prerequisites

* Because conversion requires a restart of the virtual machine (VM), you should schedule the migration of your disk storage during a pre-existing maintenance window.
* If your disk is unmanaged, first [convert it to a managed disk](convert-unmanaged-to-managed-disks.md) so you can switch between storage options.

## Switch all managed disks of a VM between Premium and Standard

This example shows how to convert all of a VM's disks from Standard to Premium storage or from Premium to Standard storage. To use Premium managed disks, your VM must use a [VM size](sizes.md) that supports Premium storage. This example also switches to a size that supports premium storage:

```azurepowershell-interactive
# Name of the resource group that contains the VM
$rgName = 'yourResourceGroup'

# Name of the your virtual machine
$vmName = 'yourVM'

# Choose between Standard_LRS and Premium_LRS based on your scenario
$storageType = 'Premium_LRS'

# Premium capable size
# Required only if converting storage from Standard to Premium
$size = 'Standard_DS2_v2'

# Stop and deallocate the VM before changing the size
Stop-AzVM -ResourceGroupName $rgName -Name $vmName -Force

$vm = Get-AzVM -Name $vmName -resourceGroupName $rgName

# Change the VM size to a size that supports Premium storage
# Skip this step if converting storage from Premium to Standard
$vm.HardwareProfile.VmSize = $size
Update-AzVM -VM $vm -ResourceGroupName $rgName

# Get all disks in the resource group of the VM
$vmDisks = Get-AzDisk -ResourceGroupName $rgName 

# For disks that belong to the selected VM, convert to Premium storage
foreach ($disk in $vmDisks)
{
	if ($disk.ManagedBy -eq $vm.Id)
	{
		$disk.Sku = [Microsoft.Azure.Management.Compute.Models.DiskSku]::new($storageType)
		$disk | Update-AzDisk
	}
}

Start-AzVM -ResourceGroupName $rgName -Name $vmName
```

## Switch individual managed disks between Standard and Premium

For your dev/test workload, you might want a mix of Standard and Premium disks to reduce your costs. You can choose to upgrade only those disks that need better performance. This example shows how to convert a single VM disk from Standard to Premium storage or from Premium to Standard storage. To use Premium managed disks, your VM must use a [VM size](sizes.md) that supports Premium storage. This example also shows how to switch to a size that supports Premium storage:

```azurepowershell-interactive

$diskName = 'yourDiskName'
# resource group that contains the managed disk
$rgName = 'yourResourceGroupName'
# Choose between Standard_LRS and Premium_LRS based on your scenario
$storageType = 'Premium_LRS'
# Premium capable size 
$size = 'Standard_DS2_v2'

$disk = Get-AzDisk -DiskName $diskName -ResourceGroupName $rgName

# Get parent VM resource
$vmResource = Get-AzResource -ResourceId $disk.ManagedBy

# Stop and deallocate the VM before changing the storage type
Stop-AzVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name -Force

$vm = Get-AzVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name 

# Change the VM size to a size that supports Premium storage
# Skip this step if converting storage from Premium to Standard
$vm.HardwareProfile.VmSize = $size
Update-AzVM -VM $vm -ResourceGroupName $rgName

# Update the storage type
$disk.Sku = [Microsoft.Azure.Management.Compute.Models.DiskSku]::new($storageType)
$disk | Update-AzDisk

Start-AzVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name
```

## Convert managed disks from Standard to Premium in the Azure portal

Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the VM from the list of **Virtual machines** in the portal.
3. If the VM isn't stopped, select **Stop** at the top of VM **Overview** pane, and wait for the VM to stop.
3. In the pane for the VM, select **Disks** from the menu.
4. Select the disk that you want to convert.
5. Select **Configuration** from the menu.
6. Change the **Account type** from **Standard HDD** to **Premium SSD**.
7. Click **Save**, and close the disk pane.

The disk type conversion is instantaneous. You can start your VM after the conversion.

## Switch managed disks between Standard HDD and Standard SSD 

This example shows how to convert a single VM disk from Standard HDD to Standard SSD or from Standard SSD to Standard HDD:

```azurepowershell-interactive

$diskName = 'yourDiskName'
# resource group that contains the managed disk
$rgName = 'yourResourceGroupName'
# Choose between Standard_LRS and StandardSSD_LRS based on your scenario
$storageType = 'StandardSSD_LRS'

$disk = Get-AzDisk -DiskName $diskName -ResourceGroupName $rgName

# Get parent VM resource
$vmResource = Get-AzResource -ResourceId $disk.ManagedBy

# Stop and deallocate the VM before changing the storage type
Stop-AzVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name -Force

$vm = Get-AzVM -ResourceGroupName $vmResource.ResourceGroupName -Name $vmResource.Name 

# Update the storage type
$disk.Sku = [Microsoft.Azure.Management.Compute.Models.DiskSku]::new($storageType)
$disk | Update-AzDisk

Start-AzVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name
```

## Next steps

Make a read-only copy of a VM by using a [snapshot](snapshot-copy-managed-disk.md).
