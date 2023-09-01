---
title: Swap OS disk for an Azure VM with PowerShell
description: Change the operating system disk used by an Azure virtual machine using PowerShell.
author: roygara
ms.service: azure-disk-storage
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 04/24/2018
ms.author: rogarana 
ms.custom: devx-track-azurepowershell
---
# Change the OS disk used by an Azure VM using PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

If you have an existing VM, but you want to swap the disk for a backup disk or another OS disk, you can use Azure PowerShell to swap the OS disks. You don't have to delete and recreate the VM. You can even use a managed disk in another resource group, as long as it isn't already in use.

The VM does not need to be stopped\deallocated. The resource ID of the managed disk can be replaced with the resource ID of a different managed disk.

Make sure that the VM size and storage type are compatible with the disk you want to attach. For example, if the disk you want to use is in Premium Storage, then the VM needs to be capable of Premium Storage (like a DS-series size). Both disks must also be the same size.
And ensure that you're not mixing an un-encrypted VM with an encrypted OS disk, this is not supported. If the VM doesn't use Azure Disk Encryption, then the OS disk being swapped in shouldn't be using Azure Disk Encryption. If disks are using Disk Encryption Sets, both disks should belong to same Disk Encryption set.

Get a list of disks in a resource group using [Get-AzDisk](/powershell/module/az.compute/get-azdisk)

```azurepowershell-interactive
Get-AzDisk -ResourceGroupName myResourceGroup | Format-Table -Property Name
```
 
When you have the name of the disk that you would like to use, set that as the OS disk for the VM. This example stop\deallocates the VM named *myVM* and assigns the disk named *newDisk* as the new OS disk. 
 
```azurepowershell-interactive 
# Get the VM 
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM 

# (Optional) Stop/ deallocate the VM
Stop-AzVM -ResourceGroupName myResourceGroup -Name $vm.Name -Force

# Get the new disk that you want to swap in
$disk = Get-AzDisk -ResourceGroupName myResourceGroup -Name newDisk

# Set the VM configuration to point to the new disk  
Set-AzVMOSDisk -VM $vm -ManagedDiskId $disk.Id -Name $disk.Name 

# Update the VM with the new OS disk
Update-AzVM -ResourceGroupName myResourceGroup -VM $vm 

# Start the VM
Start-AzVM -Name $vm.Name -ResourceGroupName myResourceGroup

```

**Next steps**

To create a copy of a disk, see [Snapshot a disk](snapshot-copy-managed-disk.md).
