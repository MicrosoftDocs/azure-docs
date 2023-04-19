---
title: Convert managed disks storage between different disk types
description: How to convert Azure managed disks between the different disks types by using Azure PowerShell, Azure CLI, or the Azure portal.
author: roygara
ms.service: storage
ms.subservice: disks
ms.topic: how-to
ms.date: 02/09/2023
ms.author: albecker
---

# Change the disk type of an Azure managed disk

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows 

There are four disk types of Azure managed disks: Azure ultra disks, premium SSD, standard SSD, and standard HDD. You can switch between premium SSD, standard SSD, and standard HDD based on your performance needs. You are not yet able to switch from or to an ultra disk, you must deploy a new one.

This functionality is not supported for unmanaged disks. But you can easily convert an unmanaged disk to a managed disk with [CLI](linux/convert-unmanaged-to-managed-disks.md) or [PowerShell](windows/convert-unmanaged-to-managed-disks.md) to be able to switch between disk types.


## Before you begin

Because conversion requires a restart of the virtual machine (VM), schedule the migration of your disk during a pre-existing maintenance window.

## Restrictions

- You can only change disk type once per day.
- You can only change the disk type of managed disks. If your disk is unmanaged, convert it to a managed disk with [CLI](linux/convert-unmanaged-to-managed-disks.md) or [PowerShell](windows/convert-unmanaged-to-managed-disks.md) to switch between disk types.

## Switch all managed disks of a VM between from one account to another

This example shows how to convert all of a VM's disks to premium storage. However, by changing the $storageType variable in this example, you can convert the VM's disks type to standard SSD or standard HDD. To use Premium managed disks, your VM must use a [VM size](sizes.md) that supports Premium storage. This example also switches to a size that supports premium storage:

# [Azure PowerShell](#tab/azure-powershell)

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

# [Azure CLI](#tab/azure-cli)

 ```azurecli

#resource group that contains the virtual machine
$rgName='yourResourceGroup'

#Name of the virtual machine
vmName='yourVM'

#Premium capable size 
#Required only if converting from Standard to Premium
size='Standard_DS2_v2'

#Choose between Standard_LRS, StandardSSD_LRS and Premium_LRS based on your scenario
sku='Premium_LRS'

#Deallocate the VM before changing the size of the VM
az vm deallocate --name $vmName --resource-group $rgName

#Change the VM size to a size that supports Premium storage 
#Skip this step if converting storage from Premium to Standard
az vm resize --resource-group $rgName --name $vmName --size $size

#Update the SKU of all the data disks 
az vm show -n $vmName -g $rgName --query storageProfile.dataDisks[*].managedDisk -o tsv \
 | awk -v sku=$sku '{system("az disk update --sku "sku" --ids "$1)}'

#Update the SKU of the OS disk
az vm show -n $vmName -g $rgName --query storageProfile.osDisk.managedDisk -o tsv \
| awk -v sku=$sku '{system("az disk update --sku "sku" --ids "$1)}'

az vm start --name $vmName --resource-group $rgName
```

# [Portal](#tab/azure-portal)

Use either PowerShell or CLI.

---
## Switch individual managed disks between Standard and Premium

For your dev/test workload, you might want a mix of Standard and Premium disks to reduce your costs. You can choose to upgrade only those disks that need better performance. This example shows how to convert a single VM disk from Standard to Premium storage. However, by changing the $storageType variable in this example, you can convert the VM's disks type to standard SSD or standard HDD. To use Premium managed disks, your VM must use a [VM size](sizes.md) that supports Premium storage. This example also shows how to switch to a size that supports Premium storage:

# [Azure PowerShell](#tab/azure-powershell)

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

# [Azure CLI](#tab/azure-cli)


 ```azurecli

#resource group that contains the managed disk
$rgName='yourResourceGroup'

#Name of your managed disk
diskName='yourManagedDiskName'

#Premium capable size 
#Required only if converting from Standard to Premium
size='Standard_DS2_v2'

#Choose between Standard_LRS, StandardSSD_LRS and Premium_LRS based on your scenario
sku='Premium_LRS'

#Get the parent VM Id 
vmId=$(az disk show --name $diskName --resource-group $rgName --query managedBy --output tsv)

#Deallocate the VM before changing the size of the VM
az vm deallocate --ids $vmId 

#Change the VM size to a size that supports Premium storage 
#Skip this step if converting storage from Premium to Standard
az vm resize --ids $vmId --size $size

# Update the SKU
az disk update --sku $sku --name $diskName --resource-group $rgName 

az vm start --ids $vmId 
```

# [Portal](#tab/azure-portal)

Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the VM from the list of **Virtual machines**.
1. If the VM isn't stopped, select **Stop** at the top of the VM **Overview** pane, and wait for the VM to stop.
1. In the pane for the VM, select **Disks** from the menu.
1. Select the disk that you want to convert.
1. Select **Size + performance** from the menu.
1. Change the **Account type** from the original disk type to the desired disk type.
1. Select **Save**, and close the disk pane.

The disk type conversion is instantaneous. You can start your VM after the conversion.

# [Portal](#tab/azure-portal)

Use either PowerShell or CLI.

---

## Migrate to a Premium SSD v2


# [Azure PowerShell](#tab/azure-powershell)

```PowerShell
$diskName = "yourDiskNameHere"
$resourceGroupName = "yourResourceGroupNameHere"
$snapshotName = "yourDesiredSnapshotNameHere"

# Get the disk that you need to backup by creating an incremental snapshot
$yourDisk = Get-AzDisk -DiskName $diskName -ResourceGroupName $resourceGroupName

# Create an incremental snapshot by setting the SourceUri property with the value of the Id property of the disk
$snapshotConfig=New-AzSnapshotConfig -SourceUri $yourDisk.Id -Location $yourDisk.Location -CreateOption Copy -Incremental 
New-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $snapshotName -Snapshot $snapshotConfig 
```


# [Azure CLI](#tab/azure-cli)

```azurecli
# Declare variables
diskName="yourExistingDiskNameHere"
newDiskName="newDiskNameHere"
resourceGroupName="yourResourceGroupNameHere"
snapshotName="desiredSnapshotNameHere"

# Get the disk you need to backup
yourDiskID=$(az disk show -n $diskName -g $resourceGroupName --query "id" --output tsv)

# Create the snapshot
snapshot=$(az snapshot create -g $resourceGroupName -n $snapshotName --source $yourDiskID --incremental true)

az disk create -g resourceGroupName -n newDiskName --source $snapshot

```

# [Portal](#tab/azure-portal)

Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the VM from the list of **Virtual machines**.
1. If the VM isn't stopped, select **Stop** at the top of the VM **Overview** pane, and wait for the VM to stop.
1. In the pane for the VM, select **Disks** from the menu.
1. Select the disk that you want to convert.
1. Select the search bar at the top. Search for and select Disks.
1. Select Add New.
1. Select Premium SSD v2 for the disk type
1. Select snapshot for source type
1. Select the snapshot of the disk you just took.
1. Select save.
---

## Next steps

Make a read-only copy of a VM by using a [snapshot](snapshot-copy-managed-disk.md).
