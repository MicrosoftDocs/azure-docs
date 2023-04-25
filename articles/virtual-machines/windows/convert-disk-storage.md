---
title: Convert managed disks storage between different disk types by using Azure PowerShell
description: How to convert Azure managed disks between the different disks types by using Azure PowerShell.
author: roygara
ms.service: storage
ms.subservice: disks
ms.topic: how-to
ms.date: 02/09/2023
ms.author: albecker 
ms.custom: devx-track-azurepowershell
---

# Change the disk type of an Azure managed disk - PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows 

There are four disk types of Azure managed disks: Azure ultra disks, premium SSD, standard SSD, and standard HDD. You can switch between premium SSD, standard SSD, and standard HDD based on your performance needs. You are not yet able to switch from or to an ultra disk, you must deploy a new one.

This functionality is not supported for unmanaged disks. But you can easily [convert an unmanaged disk to a managed disk](convert-unmanaged-to-managed-disks.md) to be able to switch between disk types.


## Before you begin

Because conversion requires a restart of the virtual machine (VM), schedule the migration of your disk during a pre-existing maintenance window.

## Restrictions

- You can only change disk type once per day.
- You can only change the disk type of managed disks. If your disk is unmanaged, [convert it to a managed disk](convert-unmanaged-to-managed-disks.md) to switch between disk types.

## Switch all managed disks of a VM between from one account to another

This example shows how to convert all of a VM's disks to premium storage. However, by changing the $storageType variable in this example, you can convert the VM's disks type to standard SSD or standard HDD. To use Premium managed disks, your VM must use a [VM size](../sizes.md) that supports Premium storage. This example also switches to a size that supports premium storage:

```azurepowershell-interactive
# Name of the resource group that contains the VM
$rgName = 'yourResourceGroup'

# Name of the your virtual machine
$vmName = 'yourVM'

# Choose between Standard_LRS, StandardSSD_LRS and Premium_LRS based on your scenario
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

For your dev/test workload, you might want a mix of Standard and Premium disks to reduce your costs. You can choose to upgrade only those disks that need better performance. This example shows how to convert a single VM disk from Standard to Premium storage. However, by changing the $storageType variable in this example, you can convert the VM's disks type to standard SSD or standard HDD. To use Premium managed disks, your VM must use a [VM size](../sizes.md) that supports Premium storage. This example also shows how to switch to a size that supports Premium storage:

```azurepowershell-interactive

$diskName = 'yourDiskName'
# resource group that contains the managed disk
$rgName = 'yourResourceGroupName'
# Choose between Standard_LRS, StandardSSD_LRS and Premium_LRS based on your scenario
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

## Switch managed disks from one disk type to another

Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the VM from the list of **Virtual machines**.
3. If the VM isn't stopped, select **Stop** at the top of the VM **Overview** pane, and wait for the VM to stop.
4. In the pane for the VM, select **Disks** from the menu.
5. Select the disk that you want to convert.
6. Select **Size + performance** from the menu.
7. Change the **Account type** from the original disk type to the desired disk type.
8. Select **Save**, and close the disk pane.

The disk type conversion is instantaneous. You can start your VM after the conversion.

## Next steps

Make a read-only copy of a VM by using a [snapshot](snapshot-copy-managed-disk.md).
