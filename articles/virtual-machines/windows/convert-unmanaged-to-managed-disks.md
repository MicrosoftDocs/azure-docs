---
title: Convert a VM from unmanaged to managed disks - Azure | Microsoft Docs
description: Convert a VM from unmanaged disks to managed disks using PowerShell in the Resource Manager deployment model
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 06/05/2017
ms.author: cynthn

---
# Convert a VM from unmanaged disks to managed disks

If you have existing Linux VMs in Azure that use unmanaged disks in storage accounts and you want those VMs to be able to take advantage of [Managed Disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), you can convert the VMs. This process converts both the OS disk and any attached data disks. The conversion process requires a restart of the VM, so schedule the migration of your VMs during a pre-existing maintenance window. The migration process is not reversible. Be sure to test the migration process by migrating a test virtual machine before performing the migration in production. Before starting,  make sure that you review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks).


> [!IMPORTANT] 
> During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, use a reserved IP.

## Prepare availability set for conversion

> [!NOTE] 
> Skip this step if your VM is not in an availability set.

```powershell
$rgName = 'myResourceGroup'
$avSetName = 'myAvailabilitySet'

$avSet =  Get-AzureRmAvailabilitySet -ResourceGroupName $rgName -Name $avSetName
Update-AzureRmAvailabilitySet -AvailabilitySet $avSet -Managed
```

## Prepare VMs for conversion
This section contains steps that need to be undertaken before VM can be converted to Managed Disks or if converting between different storage types.

### Deallocate the VM
The conversion to Managed Disks is only supported after the VM is deallocated. In the steps show below, we use the `Stop-AzureRmVM` cmdlet to stop the VM.

### Converting from Standard to Premium storage
During the conversion to Managed Disks, you can also convert the VM to Premium storage. In order to use Premium Managed Disks, your VM must use a [VM size](sizes.md) that supports Premium storage. Once you've identified the right size, you can update the hardware profile of the VM as shown below.

## Convert VMs in an availability set to managed disks
Since our Availability Set is already converted to managed availability set in above steps, we can start the VM conversion.

```powershell
$avSet =  Get-AzureRmAvailabilitySet -ResourceGroupName $rgName -Name $avSetName

foreach($vmInfo in $avSet.VirtualMachinesReferences)
{
   $vm =  Get-AzureRmVM -ResourceGroupName $rgName | Where-Object {$_.Id -eq $vmInfo.id}
   Stop-AzureRmVM -ResourceGroupName $rgName -Name  $vm.Name -Force
   ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vm.Name
}
```

## Convert VMs not in an availability set
For a VM that is not in an availability set, you just need to deallocate the VM and then convert to managed disk.

```powershell
$rgName = "myResourceGroup"
$vmName = "myVM"
Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force
ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vmName
```

## Convert VMs using Standard managed disks to Premium managed disks
Once you've converted your VM to managed disks, now you can also switch between the storage types. In the example below, we'll show how to switch from Standard to Premium storage type. In order to use Premium Managed Disks, your VM must use a [VM size](sizes.md) that supports Premium storage. In the example below, we'll also switch to a size supporting Premium storage.

```powershell
$resourceGroupName = 'YourResourceGroupName'
$vmName = 'YourVMName'
$size = 'Standard_DS2_v2'
$vm = Get-AzureRmVM -Name $vmName -ResourceGroupName $resourceGroupName

# Stop deallocate the VM before changing the size
Stop-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName -Force

# Change VM size to a size supporting Premium storage
$vm.HardwareProfile.VmSize = $size
Update-AzureRmVM -VM $vm -ResourceGroupName $resourceGroupName

# Get all disks in the resource group of the VM
$vmDisks = Get-AzureRmDisk -ResourceGroupName $resourceGroupName 

# For disks that belong to the VM selected, convert to Premium storage
foreach ($disk in $vmDisks)
{
	if($disk.OwnerId -eq $vm.Id)
	{
		$diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType PremiumLRS
		Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $resourceGroupName `
		-DiskName $disk.Name
	}
}

Start-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName
```

> [!NOTE] 
> You can also have a mixture of disks that use standard and Premium storage.

> [!IMPORTANT] 
> The original VHDs and the storage account used by the VM before conversion are not deleted and hence billed. To avoid being billed for these artifacts, please delete the original VHD blobs once you've verified the conversion is complete.

### Troubleshooting
In case of an error during conversion - or if you have a Virtual Machine in a Failed state due to a previous conversion that faced issues, please retry it by running the ConvertTo-AzureRmVMManagedDisk cmdlet again.
A simple retry usually unblocks the situation.

## Managed Disks and Azure Storage Service Encryption (SSE)

You cannot convert an unmanaged disk into a managed disk if the unmanaged disk is in a storage account that is, or at any time has been, encrypted using [Azure Storage Service Encryption (SSE)](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). The following steps detail how to convert unmanaged disks that are, or have been, in an encrypted storage account:

- Copy the virtual hard disk (VHD) with use [AzCopy](../../storage/storage-use-azcopy.md) to a storage account that has never been enabled for Azure Storage Service Encryption.
- Create a VM that uses managed disks and specify that VHD file during creation with `New-AzureRmVm`, or
- Attach the copied VHD with `Add-AzureRmVmDataDisk` to a running VM with managed disks.

## Next steps

Take a read-only copy of a VM using [snapshots](snapshot-copy-managed-disk.md).

