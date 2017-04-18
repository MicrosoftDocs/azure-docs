---
title: Manage Azure disks with the Azure PowerShell | Microsoft Docs
description: Tutorial - Manage Azure disks with the Azure PowerShell 
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 04/21/2017
ms.author: nepeters
---

# Manage Azure disks with PowerShell

In this tutorial, you will learn about the different types of VM disks, how to select a disk configuration, and how to create and attach data disks to Azure virtual machines. This tutorial will also cover taking disk snapshots. 

The steps demonstrated in this tutorial can be completed using the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/) module.

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically created and attached to the virtual machine. 

- **Operating system disk** - Registered as a SATA drive and is labeled /dev/sda by default. This disk should only be used to host the VM operating system.
- **Temporary disk** - Provides short-term / temporary storage for data. Any data stored on a temporary disk may be lost. 

> [!Note]
> Operating system disks are configured for Read/write caching and should not be used to host applications that require performant disk read and write operations. A data disk can be attached to the VM and configured with an application appropriate I/O and cache configuration. 

## Azure data disks

Additional 'data disks' can be added for task such as installing applications and storing data. Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks you can attach to it and the type of storage you can use to host the disks.

The following table categorizes sizes into use cases, select each type for more detailed information.

| Type | Max data disks | Max SSD size in GiB | Max IOPS / MBps |
|----|----|----|----|----|
| [General purpose](sizes-general.md) | 32 | 800 | 32 / 32x500 |
| [Compute optimized](sizes-compute.md) | 32 | 800 | 32 / 32x500 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | 64 | 6144 | 64 / 64 x 500 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | 64 | 5630 |
| [GPU](sizes-gpu.md) | | 1,440 |
| [High performance compute](sizes-hpc.md) | 32 | 2000 | 32 x 500 |

### Disk types

Azure provides two types of disk. Each type can be used as an operating system or data disk. 

- **Standard disk** - Cost effective disk for Dev/Test scenarios.
- **Premium disk** - SSD-based high-performance, low-latency disk. Perfect for VMs running production workload.

## Create and attach disks

Additional disks can be created and attached at VM creation time or to an existing VM. Each of these operations is detailed in this step.

### Attach disk at VM creation

### Attach disk to existing VM

### Create disk

Create the initial configuration of the data disk with [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig). The following example creates a disk named `myDataDisk` that is 50 gigabytes in size:

```powershell
$diskConfig = New-AzureRmDiskConfig -Location westeurope -CreateOption Empty -DiskSizeGB 50
```

Create the data disk with [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk):

```powershell
$dataDisk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myDataDisk -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with [Get-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermvm):

```powershell
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

Add the data disk to the virtual machine configuration with [Add-AzureRmVMDataDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmdatadisk):

```powershell
$vm = Add-AzureRmVMDataDisk -VM $vm -Name myDataDisk -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 1
```

Update the virtual machine with [Update-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/update-azurermvm):

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. This process can also be automated using the custom script extension.

Note, this example only shows configuring the first disk created in the previous step. The process would be similar for the second disk.

### Manual configuration

Create an RDP connection with the virtual machine. Open up PowerShell and run this commands.

```powershell
Get-Disk | Where partitionstyle -eq 'raw' | `
Initialize-Disk -PartitionStyle MBR -PassThru | `
New-Partition -AssignDriveLetter -UseMaximumSize | `
Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
```

## Snapshot Azure disks

Taking a disk snapshot creates a read only, point-in-time copy of the disk. For this example, a snapshot of the operating system disk is taken. Azure VM snapshots are useful for quickly saving the state of a VM before making configuration changes. In the event the configuration changes prove to be undesired, VM state can be restored using the snapshot. For taking application consistent backups, use the [Azure Backup service]( /azure/backup/). 

### Create snapshot

Before creating a virtual machine disk snapshot, the Id of the operating system disk for the virtual machine is needed.

Get the operating system disk with [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk):

```powershell
$vmOSDisk = Get-AzureRmDisk -ResourceGroupName myResourceGroup -Name myOSDisk
```

Create the configuration of the snapshot with New-AzureRmSnapshotConfig:

```powershell
$snapshotConfig = New-AzureRmSnapshotConfig -Location westeurope -CreateOption Copy -SourceResourceId $vmOSDisk.id
```

Create the snapshot with New-AzureRmSnapshot:

```powershell
$snapshot = New-AzureRmSnapshot -ResourceGroupName myResourceGroup -SnapshotName mySnapshot -Snapshot $snapshotConfig
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

Create the configuration of the disk with [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig):

```powershell
$diskConfig = New-AzureRmDiskConfig -Location westeurope -CreateOption Copy -SourceResourceId $snapshot.id
```

Create the disk with [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk):

```powershell
$disk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myOSDiskFromSnapshot -Disk $diskConfig
```

### Restore virtual machine from snapshot

To demonstrate virtual machine recovery, delete the existing virtual machine.

```powershell
Remove-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Force
```

Create a new virtual machine from the snapshot disk. In this example, the existing network interface is being specified. This configuration applies all previously created NSG rules to the new virtual machine.

Create the initial configuration for the virtual machine with [New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig):

```powershell
$vm = New-AzureRmVMConfig -VMName myVM -VMSize Standard_D1
```

Add the operating system disk with [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk):

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -CreateOption Attach -ManagedDiskId $disk.Id -Windows
```

Add the network interface card with [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface):

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Create the virtual machine with [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm):

```powershell
New-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -Location westeurope
```

## Next steps

Tutorial - [Automate VM configuration](./tutorial-automate-vm-deployment.md)

Further reading - [Optimize Azure data disks](./optimization.md)