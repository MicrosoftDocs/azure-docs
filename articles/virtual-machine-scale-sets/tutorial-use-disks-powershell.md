---
title: Tutorial - Create and use disks for scale sets with Azure PowerShell
description: Learn how to use Azure PowerShell to create and use Managed Disks with Virtual Machine Scale Sets. Including how to add, prepare, list, and detach disks.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell

---
# Tutorial: Create and use disks with Virtual Machine Scale Set with Azure PowerShell
Virtual Machine Scale Sets use disks to store the VM instance's operating system, applications, and data. As you create and manage a scale set, it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers how to create and manage VM disks. In this tutorial you learn about:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attach and prepare data disks

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Default Azure disks
When a scale set is created or scaled, two disks are automatically attached to each VM instance. 

**Operating system disk** - Operating system disks can be sized up to 2 TB, and hosts the VM instance's operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** host applications or data. For applications and data, use data disks, which are detailed later in this article. 

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM instance. These are high-performance disks and can be used for operations such as temporary data processing. However, if the VM instance is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM instance size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

## Azure data disks
Additional data disks can be added if you need to install applications and store data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 4 TB. The size of the VM instance determines how many data disks can be attached. For each VM vCPU, two data disks can be attached.

## VM disk types

The following table provides a comparison of the five disk types to help you decide which to use.

|         | Ultra disk | Premium SSD v2 | Premium SSD | Standard SSD | <nobr>Standard HDD</nobr> |
| ------- | ---------- | ----------- | ------------ | ------------ | ------------ |
| **Disk type** | SSD | SSD |SSD | SSD | HDD |
| **Scenario**  | IO-intensive workloads such as SAP HANA, top tier databases (for example, SQL, Oracle), and other transaction-heavy workloads. | Production and performance-sensitive workloads that consistently require low latency and high IOPS and throughput | Production and performance sensitive workloads | Web servers, lightly used enterprise applications and dev/test | Backup, non-critical, infrequent access |
| **Max disk size** | 65,536 GiB | 65,536 GiB |32,767 GiB | 32,767 GiB | 32,767 GiB |
| **Max throughput** | 4,000 MB/s | 1,200 MB/s | 900 MB/s | 750 MB/s | 500 MB/s |
| **Max IOPS** | 160,000 | 80,000 | 20,000 | 6,000 | 2,000, 3,000* |
| **Usable as OS Disk?** | No | No | Yes | Yes | Yes |

*Only applies to disks with performance plus (preview) enabled.

For a video that covers some high level differences for the different disk types, as well as some ways for determining what impacts your workload requirements, see [Block storage options with Azure Disk Storage and Elastic SAN](https://youtu.be/igfNfUvgaDw).


## Create and attach disks
You can create and attach disks when you create a scale set, or with an existing scale set.

As of API version `2019-07-01`, you can set the size of the OS disk in a Virtual Machine Scale Set with the [storageProfile.osDisk.diskSizeGb](/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosdisk) property. After provisioning, you might have to expand or repartition the disk to make use of the whole space. Learn more about how to expand the volume in your OS in either [Windows](../virtual-machines/windows/expand-os-disk.md#expand-the-volume-in-the-operating-system) or [Linux](../virtual-machines/linux/expand-disks.md#expand-a-disk-partition-and-filesystem).

### Attach disks at scale set creation
Create a Virtual Machine Scale Set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). When prompted, provide a username and password for the VM instances. To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985.

Two disks are created with the `-DataDiskSizeGb` parameter. The first disk is *64* GB in size, and the second disk is *128* GB. When prompted, provide your own desired administrative credentials for the VM instances in the scale set:

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "East US"
```

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -DataDiskSizeInGb 64,128
```

It takes a few minutes to create and configure all the scale set resources and VM instances.

### Attach a disk to existing scale set
You can also attach disks to an existing scale set. Use the scale set created in the previous step to add another disk with [Add-AzVmssDataDisk](/powershell/module/az.compute/add-azvmssdatadisk). The following example attaches an additional *128* GB disk to an existing scale set:

```azurepowershell-interactive
# Get scale set object
$vmss = Get-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet"

# Attach a 128 GB data disk to LUN 2
Add-AzVmssDataDisk `
  -VirtualMachineScaleSet $vmss `
  -CreateOption Empty `
  -Lun 2 `
  -DiskSizeGB 128

# Update the scale set to apply the change
Update-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -VirtualMachineScaleSet $vmss
```

Alternatively, if you want to add a data disk to an individual instance in a scale set, use [Add-AzVmssVMDataDisk](/powershell/module/az.compute/add-azvmssvmdatadisk).

```azurepowershell-interactive
$VirtualMachine = Get-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId 1
Add-AzVmssVMDataDisk -VirtualMachineScaleSetVM $VirtualMachine -LUN 2 -DiskSizeInGB 1 -CreateOption Empty -StorageAccountType Standard_LRS
Update-AzVmssVM -VirtualMachineScaleSetVM $VirtualMachine
```

## List attached disks
To view information about disks attached to a scale set, use [Get-AzVmss](/powershell/module/az.compute/get-azvmss) as follows:

```azurepowershell-interactive
Get-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet"
```

Under the *VirtualMachineProfile.StorageProfile* property, the list of *DataDisks* is shown. Information on the disk size, storage tier, and LUN (Logical Unit Number) is shown. The following example output details the three data disks attached to the scale set:

```output
DataDisks[0]                            :
  Lun                                   : 0
  Caching                               : None
  CreateOption                          : Empty
  DiskSizeGB                            : 64
  ManagedDisk                           :
    StorageAccountType                  : PremiumLRS
DataDisks[1]                            :
  Lun                                   : 1
  Caching                               : None
  CreateOption                          : Empty
  DiskSizeGB                            : 128
  ManagedDisk                           :
    StorageAccountType                  : PremiumLRS
DataDisks[2]                            :
  Lun                                   : 2
  Caching                               : None
  CreateOption                          : Empty
  DiskSizeGB                            : 128
  ManagedDisk                           :
    StorageAccountType                  : PremiumLRS
```

## Detach a disk
When you no longer need a given disk, you can detach it from the scale set. The disk is removed from all VM instances in the scale set. To detach a disk from a scale set, use [Remove-AzVmssDataDisk](/powershell/module/az.compute/remove-azvmssdatadisk) and specify the LUN of the disk. The LUNs are shown in the output from [Get-AzVmss](/powershell/module/az.compute/get-azvmss)  in the previous section. The following example detaches LUN *3* from the scale set:

```azurepowershell-interactive
# Get scale set object
$vmss = Get-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet"

# Detach a disk from the scale set
Remove-AzVmssDataDisk `
  -VirtualMachineScaleSet $vmss `
  -Lun 2

# Update the scale set and detach the disk from the VM instances
Update-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -VirtualMachineScaleSet $vmss
```

Alternatively, if you want to remove a data disk to an individual instance in a scale set, use [Remove-AzVmssVMDataDisk](/powershell/module/az.compute/remove-azvmssvmdatadisk).

```azurepowershell-interactive
$VirtualMachine = Get-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId "c91dfbd9"
Remove-AzVmssVMDataDisk -VirtualMachineScaleSetVM $VirtualMachine -Lun 2
Update-AzVmssVM -VirtualMachineScaleSetVM -VM $VirtualMachine
```

## Clean up resources
To remove your scale set and disks, delete the resource group and all its resources with [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup). The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup" -Force -AsJob
```

## Next steps
In this tutorial, you learned how to create and use disks with scale sets with Azure PowerShell:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attach and prepare data disks

Advance to the next tutorial to learn how to use a custom image for your scale set VM instances.

> [!div class="nextstepaction"]
> [Use a custom image for scale set VM instances](tutorial-use-custom-image-powershell.md)
