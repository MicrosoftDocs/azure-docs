---
title: Convert Windows VM from unmanaged to managed disks - Azure | Microsoft Docs
description: How to convert a Windows VM from unmanaged disks to managed disks using PowerShell in the Resource Manager deployment model
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
ms.date: 06/23/2017
ms.author: cynthn
---

# Convert a Windows VM from unmanaged disks to managed disks

If you have existing Windows VMs in Azure that use unmanaged disks in storage accounts and you want those VMs to take advantage of [managed disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), you can convert the VMs. This process converts both the OS disk and any attached data disks. 

This article shows you how to convert VMs with Azure PowerShell. If you need to install or upgrade, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps.md).

## Planning considerations


* Before starting, review the [migration scenarios](migrate-to-managed-disks.md).

* You can't convert an unmanaged disk into a managed disk if the unmanaged disk is in a storage account previously encrypted using Azure Storage Service Encryption. For steps to copy and use these VHDs in managed disks, see [later in this article](#managed-disks-and-azure-storage-service-encryption).

* The conversion requires a restart of the VM, so schedule the migration of your VMs during a pre-existing maintenance window. 

* The conversion is not reversible. 

* Be sure to test the conversion. Migrate a test virtual machine before performing the migration in production.

* During the conversion, you deallocate the VM. The VM receives a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, use a reserved IP.


## Prepare availability set for conversion

> [!NOTE] 
> Skip this step if your VM is not in an availability set.

The following example updates the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

```powershell
$rgName = 'myResourceGroup'
$avSetName = 'myAvailabilitySet'

$avSet =  Get-AzureRmAvailabilitySet -ResourceGroupName $rgName -Name $avSetName
Update-AzureRmAvailabilitySet -AvailabilitySet $avSet -Sku Aligned 
```

### Troubleshooting

Error: The specified fault domain count 3 must fall in the range 1 to 2.

This error is thrown if the region where your availability set is located has only 2 managed fault domains but the number of unmanaged fault domains is 3. To resolve the error, update the fault domain to 2 and update `Sku` to `aligned` as follows:

```powershell
$avSet.PlatformFaultDomainCount = 2
Update-AzureRmAvailabilitySet -AvailabilitySet $avSet -Sku Aligned
```

## VM conversion steps
This section describes steps to convert a VM to managed disks or if converting between different storage types.

### Deallocate the VM
The conversion to managed disks is only supported after the VM is deallocated. The examples in the following sections use the [Stop-AzureRmVM](/powershell/module/azurerm.compute/stop-azurermvm) cmdlet to stop the VM.

### Convert the disks

The examples in the following sections use the [ConvertTo-AzureRmVMManagedDisk](/powershell/module/azurerm.compute/convertto-azurermvmmanageddisk) cmdlet to convert the VM disks to managed disks.


### Convert from standard to Premium storage
During the conversion to managed disks, you can also convert the VM to Premium storage. To use Premium managed disks, your VM must use a [VM size](sizes.md) that supports Premium storage. Once you've identified the right size, you can update the hardware profile of the VM as shown in the following sections.

### Restart the VM

After conversion completes, use the [Start-AzureRmVM](/powershell/module/azurerm.compute/start-azurermvm) cmdlet to restart the VM.

## Convert VMs in an availability set to managed disks
Since our availability set is already converted to a managed availability set in the preceding steps, we can start the VM conversion.

```powershell
$avSet = Get-AzureRmAvailabilitySet -ResourceGroupName $rgName -Name $avSetName

foreach($vmInfo in $avSet.VirtualMachinesReferences)
{
   $vm = Get-AzureRmVM -ResourceGroupName $rgName | Where-Object {$_.Id -eq $vmInfo.id}
   Stop-AzureRmVM -ResourceGroupName $rgName -Name $vm.Name -Force
   ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vm.Name
}
```

## Convert VMs not in an availability set
For a VM that is not in an availability set, you just need to deallocate the VM and then convert to managed disks. The following example deallocates and converts the VM named `myVM` in the resource group named `myResourceGroup`:

```powershell
$rgName = "myResourceGroup"
$vmName = "myVM"
Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force
ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vmName
```

## Convert VMs using standard managed disks to Premium managed disks
Once you've converted your VM to managed disks, you can also switch between the storage types. You can also have a mixture of disks that use standard and Premium storage. In the following example, we show how to switch from standard to Premium storage. To use Premium managed disks, your VM must use a [VM size](sizes.md) that supports Premium storage. This example also switches to a size supporting Premium storage.

```powershell
$resourceGroupName = 'myResourceGroup'
$vmName = 'YourVM'
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
	if ($disk.OwnerId -eq $vm.Id)
	{
		$diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType PremiumLRS
		Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $resourceGroupName `
		-DiskName $disk.Name
	}
}

Start-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName
```


> [!IMPORTANT] 
> The original VHDs and the storage account used by the VM before conversion are not deleted. They continue to incur charges. To avoid being billed for these artifacts, please delete the original VHD blobs after you verify the conversion is complete.

### Troubleshooting
In case of an error during conversion, or if a VM is in a Failed state because of issues in a previous conversion, run the `ConvertTo-AzureRmVMManagedDisk` cmdlet again.
A simple retry usually unblocks the situation.



## Managed disks and Azure Storage Service Encryption

You can't use the preceding steps to convert an unmanaged disk into a managed disk if the unmanaged disk is in a storage account that has ever been encrypted using [Azure Storage Service Encryption](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). The following steps detail how to copy and use unmanaged disks that have been in an encrypted storage account:

1. Copy the virtual hard disk (VHD) using [AzCopy](../../storage/storage-use-azcopy.md) to a storage account that has never been enabled for Azure Storage Service Encryption.

2. Use the copied VM in one of the following ways:

  * Create a VM that uses managed disks, and specify that VHD file during creation with `New-AzureRmVm`

  * Attach the copied VHD with `Add-AzureRmVmDataDisk` to a running VM with managed disks

## Next steps

Take a read-only copy of a VM using [snapshots](snapshot-copy-managed-disk.md).

