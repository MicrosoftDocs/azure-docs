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

In this tutorial, you learn about the different types of VM disks, how to select a disk configuration, and how to create and attach disks to Azure VMs. This tutorial also covers taking disk snapshots.  

The steps in this tutorial can be completed using the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/) module.

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine. 

**Operating system disk** - Operating system disk are 1023 gigabytes in size and host the operating system. The OS disk is assigned a drive letter of `c:` by default. For optimal VM performance, the operating system disk should not host applications or data.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temp disks are highly performant and may be used for operations such as temporary data processing. However, if the VM is moved to a new host, any data stored on a temporary disk will be removed. The size of the temporary disk is determined by the VM size. Temporary disks are assigned a drive letter of `d:` by default.

### Temporary disk sizes

| Type | VM Size | Max temp disk size |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 800 |
| [Compute optimized](sizes-compute.md) | F series | 800 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 6144 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 5630 |
| [GPU](sizes-gpu.md) | N series | 1440 |
| [High performance](sizes-hpc.md) | A and H series | 2000 |

## Azure data disks

Additional data disks can be added for installing applications and storing data. Each data disk has a maximum capacity of 1023 GB. The size of the virtual machine determines how many data disks can be attached to a VM. For each VM core, two data disks can be attached. 

### Max data disks

| Type | VM Size | Max data disks |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 32 |
| [Compute optimized](sizes-compute.md) | F series | 32 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 64 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | 48 |
| [High performance](sizes-hpc.md) | A and H series | 32 |

## Disk types

Azure provides two types of disk. Each type can be used as an operating system or data disk. 

### Standard disk

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk

SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and Fs-series VMs. Premium disks come in three types (P10, P20, P30), the size of the disk determines the disk type.

### Premium disk performance

|Premium storage disk type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk size (round up) | 128 GB | 512 GB | 1,024 GB (1 TB) |
| IOPS per disk | 500 | 2,300 | 5,000 |
Throughput per disk | 100 MB/s | 150 MB/s | 200 MB/s |

## Create and attach disks

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

Create the initial configuration with [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig). The following example configures a disk that is 50 gigabytes in size.

```powershell
$diskConfig = New-AzureRmDiskConfig -Location westus -CreateOption Empty -DiskSizeGB 50
```

Create the data disk with the [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk) command.

```powershell
$dataDisk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myDataDisk -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with the [Get-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermvm) command.

```powershell
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

Add the data disk to the virtual machine configuration with the [Add-AzureRmVMDataDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmdatadisk) command.

```powershell
$vm = Add-AzureRmVMDataDisk -VM $vm -Name myDataDisk -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 1
```

Update the virtual machine with the [Update-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/update-azurermvm) command.

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. This process can also be automated using the [custom script extension](./extensions-customscript.md).

### Manual configuration

Create an RDP connection with the virtual machine. Open up PowerShell and run this commands.

```powershell
Get-Disk | Where partitionstyle -eq 'raw' | `
Initialize-Disk -PartitionStyle MBR -PassThru | `
New-Partition -AssignDriveLetter -UseMaximumSize | `
Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
```

## Snapshot Azure disks

Taking a disk snapshot creates a read only, point-in-time copy of the disk. Azure VM snapshots are useful for quickly saving the state of a VM before making configuration changes. In the event the configuration changes prove to be undesired, VM state can be restored using the snapshot. When a VM has more than one disk, a snapshot is taken of each disk independently of the others. For taking application consistent backups, use the [Azure Backup service]( /azure/backup/). 

### Create snapshot

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

Before creating a virtual machine disk snapshot, Get the operating system disk with the [Get-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/get-azurermdisk) command.

```powershell
$vmOSDisk = Get-AzureRmDisk -ResourceGroupName myResourceGroup -Name myOSDisk
```

Create the configuration of the snapshot with the [New-AzureRmSnapshotConfig](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermsnapshotconfig?view=azurermps-3.8.0) command.

```powershell
$snapshotConfig = New-AzureRmSnapshotConfig -Location westus -CreateOption Copy -SourceResourceId $vmOSDisk.id
```

Create the snapshot with the [New-AzureRmSnapshot](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermsnapshot?view=azurermps-3.8.0) command.

```powershell
$snapshot = New-AzureRmSnapshot -ResourceGroupName myResourceGroup -SnapshotName mySnapshot -Snapshot $snapshotConfig
```

### Create disk from snapshot

This snapshot can then be converted into a disk, which can be used to recreate the virtual machine.

Create the configuration of the disk with the [New-AzureRmDiskConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdiskconfig) command.

```powershell
$diskConfig = New-AzureRmDiskConfig -Location westus -CreateOption Copy -SourceResourceId $snapshot.id
```

Create the disk with the [New-AzureRmDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermdisk) command.

```powershell
$disk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myOSDiskFromSnapshot -Disk $diskConfig
```

### Create virtual machine from snapshot

To revert a VM to the state of the snapshot, delete the VM and create a new VM from the snapshot. 

To create a VM from a snapshot, first create the initial configuration for the virtual machine with the[New-AzureRmVMConfig](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvmconfig) command. 

```powershell
$vm = New-AzureRmVMConfig -VMName myVM -VMSize Standard_D1
```

Add the operating system disk with the [Set-AzureRmVMOSDisk](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/set-azurermvmosdisk) command. The `-ManageedDiskId` is the ID of the disk ID created from the snapshot.

```powershell
$vm = Set-AzureRmVMOSDisk -VM $vm -CreateOption Attach -ManagedDiskId $disk.Id -Windows
```

Add the network interface card with the [Add-AzureRmVMNetworkInterface](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/add-azurermvmnetworkinterface) command.

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Create the virtual machine with the [New-AzureRmVM](https://docs.microsoft.com/powershell/resourcemanager/azurerm.compute/v2.8.0/new-azurermvm) command.

```powershell
New-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -Location westus
```

## Next steps

Tutorial - [Automate VM configuration](./tutorial-automate-vm-deployment.md)