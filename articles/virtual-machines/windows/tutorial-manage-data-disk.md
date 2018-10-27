---
title: Tutorial - Manage Azure disks with Azure PowerShell | Microsoft Docs
description: In this tutorial, you learn how to use Azure PowerShell to create and manage Azure disks for virtual machines
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/09/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about Azure Managed Disks so that I can create and manage storage for Windows VMs in Azure.
---

# Tutorial - Manage Azure disks with Azure PowerShell

Azure virtual machines use disks to store the VMs operating system, applications, and data. When creating a VM it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers deploying and managing VM disks. You learn about:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine. 

**Operating system disk** - Operating system disks can be sized up to 4 terabyte, and hosts the VMs operating system.  The OS disk is assigned a drive letter of *c:* by default. The disk caching configuration of the OS disk is optimized for OS performance. The OS disk **should not** host applications or data. For applications and data, use a data disk, which is detailed later in this article.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temp disks are highly performant and may be used for operations such as temporary data processing. However, if the VM is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM size. Temporary disks are assigned a drive letter of *d:* by default.

### Temporary disk sizes

| Type | Common sizes | Max temp disk size (GiB) |
|----|----|----|
| [General purpose](sizes-general.md) | A, B, and D series | 1600 |
| [Compute optimized](sizes-compute.md) | F series | 576 |
| [Memory optimized](sizes-memory.md) | D, E, G, and M series | 6144 |
| [Storage optimized](sizes-storage.md) | L series | 5630 |
| [GPU](sizes-gpu.md) | N series | 1440 |
| [High performance](sizes-hpc.md) | A and H series | 2000 |

## Azure data disks

Additional data disks can be added for installing applications and storing data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 4 terabytes. The size of the virtual machine determines how many data disks can be attached to a VM. For each VM vCPU, two data disks can be attached. 

### Max data disks per VM

| Type | Common sizes | Max data disks per VM |
|----|----|----|
| [General purpose](sizes-general.md) | A, B, and D series | 64 |
| [Compute optimized](sizes-compute.md) | F series | 64 |
| [Memory optimized](sizes-memory.md) | D, E, G, and M series | 64 |
| [Storage optimized](sizes-storage.md) | L series | 64 |
| [GPU](sizes-gpu.md) | N series | 64 |
| [High performance](sizes-hpc.md) | A and H series | 64 |

## VM disk types

Azure provides two types of disk.

### Standard disk

Standard Storage is backed by HDDs, and delivers cost-effective storage while still being performant. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk

Premium disks are backed by SSD-based high-performance, low-latency disk. Perfect for VMs running production workload. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. Premium disks come in five types (P10, P20, P30, P40, P50), the size of the disk determines the disk type. When selecting, a disk size the value is rounded up to the next type. For example, if the size is below 128 GB the disk type is P10, or between 129 GB and 512 GB the disk is P20.

### Premium disk performance

|Premium storage disk type | P4 | P6 | P10 | P20 | P30 | P40 | P50 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Disk size (round up) | 32 GB | 64 GB | 128 GB | 512 GB | 1,024 GB (1 TB) | 2,048 GB (2 TB) | 4,095 GB (4 TB) |
| Max IOPS per disk | 120 | 240 | 500 | 2,300 | 5,000 | 7,500 | 7,500 |
Throughput per disk | 25 MB/s | 50 MB/s | 100 MB/s | 150 MB/s | 200 MB/s | 250 MB/s | 250 MB/s |

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, 64 data disks can be attached to Standard_GS5 VM. If each of these disks are sized as a P30, a maximum of 80,000 IOPS can be achieved. For detailed information on max IOPS per VM, see [VM types and sizes](./sizes.md).

## Create and attach disks

To complete the example in this tutorial, you must have an existing virtual machine. If needed, create a virtual machine with the following commands.

Set the username and password needed for the administrator account on the virtual machine with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Create the virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm).

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroupDisk" `
    -Name "myVM" `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -Credential $cred `
    -AsJob
```

The `-AsJob` parameter creates the VM as a background task, so the PowerShell prompts return to you. You can view details of background jobs with the `Job` cmdlet.

Create the initial configuration with [New-AzureRmDiskConfig](/powershell/module/azurerm.compute/new-azurermdiskconfig). The following example configures a disk that is 128 gigabytes in size.

```azurepowershell-interactive
$diskConfig = New-AzureRmDiskConfig `
    -Location "EastUS" `
    -CreateOption Empty `
    -DiskSizeGB 128
```

Create the data disk with the [New-AzureRmDisk](/powershell/module/azurerm.compute/new-azurermdisk) command.

```azurepowershell-interactive
$dataDisk = New-AzureRmDisk `
    -ResourceGroupName "myResourceGroupDisk" `
    -DiskName "myDataDisk" `
    -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with the [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) command.

```azurepowershell-interactive
$vm = Get-AzureRmVM -ResourceGroupName "myResourceGroupDisk" -Name "myVM"
```

Add the data disk to the virtual machine configuration with the [Add-AzureRmVMDataDisk](/powershell/module/azurerm.compute/add-azurermvmdatadisk) command.

```azurepowershell-interactive
$vm = Add-AzureRmVMDataDisk `
    -VM $vm `
    -Name "myDataDisk" `
    -CreateOption Attach `
    -ManagedDiskId $dataDisk.Id `
    -Lun 1
```

Update the virtual machine with the [Update-AzureRmVM](/powershell/module/azurerm.compute/add-azurermvmdatadisk) command.

```azurepowershell-interactive
Update-AzureRmVM -ResourceGroupName "myResourceGroupDisk" -VM $vm
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. This process can also be automated using the [custom script extension](./tutorial-automate-vm-deployment.md).

### Manual configuration

Create an RDP connection with the virtual machine. Open up PowerShell and run this script.

```azurepowershell
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
