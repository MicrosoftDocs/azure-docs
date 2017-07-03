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
ms.date: 05/02/2017
ms.author: nepeters
---

# Manage Azure disks with PowerShell

Azure virtual machines use disks to store the VMs operating system, applications, and data. When creating a VM it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers deploying and managing VM disks. You learn about:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

This tutorial requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine. 

**Operating system disk** - Operating system disks can be sized up to 1 terabyte, and hosts the VMs operating system.  The OS disk is assigned a drive letter of *c:* by default. The disk caching configuration of the OS disk is optimized for OS performance. The OS disk **should not** host applications or data. For applications and data, use a data disk, which is detailed later in this article.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temp disks are highly performant and may be used for operations such as temporary data processing. However, if the VM is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM size. Temporary disks are assigned a drive letter of *d:* by default.

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

Additional data disks can be added for installing applications and storing data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 1 terabyte. The size of the virtual machine determines how many data disks can be attached to a VM. For each VM core, two data disks can be attached. 

### Max data disks per VM

| Type | VM Size | Max data disks per VM |
|----|----|----|
| [General purpose](sizes-general.md) | A and D series | 32 |
| [Compute optimized](sizes-compute.md) | F series | 32 |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md) | D and G series | 64 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | 48 |
| [High performance](sizes-hpc.md) | A and H series | 32 |

## VM disk types

Azure provides two types of disk.

### Standard disk

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk

Premium disks are backed by SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. Premium disks come in three types (P10, P20, P30), the size of the disk determines the disk type. When selecting, a disk size the value is rounded up to the next type. For example, if the size is below 128 GB the disk type will be P10, between 129 and 512 P20, and over 512 P30. 

### Premium disk performance

|Premium storage disk type | P10 | P20 | P30 |
| --- | --- | --- | --- |
| Disk size (round up) | 128 GB | 512 GB | 1,024 GB (1 TB) |
| IOPS per disk | 500 | 2,300 | 5,000 |
Throughput per disk | 100 MB/s | 150 MB/s | 200 MB/s |

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, 64 data disks can be attached to Standard_GS5 VM. If each of these disks are sized as a P30, a maximum of 80,000 IOPS can be achieved. For detailed information on max IOPS per VM, see [Linux VM sizes](./sizes.md).

## Create and attach disks

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

Create the initial configuration with [New-AzureRmDiskConfig](/powershell/module/azurerm.compute/new-azurermdiskconfig). The following example configures a disk that is 128 gigabytes in size.

```powershell
$diskConfig = New-AzureRmDiskConfig -Location EastUS -CreateOption Empty -DiskSizeGB 128
```

Create the data disk with the [New-AzureRmDisk](/powershell/module/azurerm.compute/new-azurermdisk) command.

```powershell
$dataDisk = New-AzureRmDisk -ResourceGroupName myResourceGroup -DiskName myDataDisk -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with the [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) command.

```powershell
$vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
```

Add the data disk to the virtual machine configuration with the [Add-AzureRmVMDataDisk](/powershell/module/azurerm.compute/add-azurermvmdatadisk) command.

```powershell
$vm = Add-AzureRmVMDataDisk -VM $vm -Name myDataDisk -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 1
```

Update the virtual machine with the [Update-AzureRmVM](/powershell/module/azurerm.compute/add-azurermvmdatadisk) command.

```powershell
Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. This process can also be automated using the [custom script extension](./tutorial-automate-vm-deployment.md).

### Manual configuration

Create an RDP connection with the virtual machine. Open up PowerShell and run this script.

```powershell
Get-Disk | Where partitionstyle -eq 'raw' | `
Initialize-Disk -PartitionStyle MBR -PassThru | `
New-Partition -AssignDriveLetter -UseMaximumSize | `
Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
```

## Next steps

In this tutorial, you learned about VM disks topics such as:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

Advance to the next tutorial to learn about automating VM configuration.

> [!div class="nextstepaction"]
> [Automate VM configuration](./tutorial-automate-vm-deployment.md)
