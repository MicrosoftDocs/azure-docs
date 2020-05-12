---
title: Tutorial - Create and use disks for scale sets with Azure PowerShell
description: Learn how to use Azure PowerShell to create and use Managed Disks with virtual machine scale sets, including how to add, prepare, list, and detach disks.
author: ju-shim
ms.author: jushiman
ms.topic: tutorial
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 03/27/2018
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Tutorial: Create and use disks with virtual machine scale set with Azure PowerShell

Virtual machine scale sets use disks to store the VM instance's operating system, applications, and data. As you create and manage a scale set, it is important to choose a disk size and configuration appropriate to the expected workload. This tutorial covers how to create and manage VM disks. In this tutorial you learn how to:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attach and prepare data disks

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az.md](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]


## Default Azure disks
When a scale set is created or scaled, two disks are automatically attached to each VM instance. 

**Operating system disk** - Operating system disks can be sized up to 2 TB, and hosts the VM instance's operating system. The OS disk is labeled */dev/sda* by default. The disk caching configuration of the OS disk is optimized for OS performance. Because of this configuration, the OS disk **should not** host applications or data. For applications and data, use data disks, which are detailed later in this article. 

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM instance. These are high-performance disks and may be used for operations such as temporary data processing. However, if the VM instance is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the VM instance size. Temporary disks are labeled */dev/sdb* and have a mountpoint of */mnt*.

### Temporary disk sizes
| Type | Common sizes | Max temp disk size (GiB) |
|----|----|----|
| [General purpose](../virtual-machines/windows/sizes-general.md) | A, B, and D series | 1600 |
| [Compute optimized](../virtual-machines/windows/sizes-compute.md) | F series | 576 |
| [Memory optimized](../virtual-machines/windows/sizes-memory.md) | D, E, G, and M series | 6144 |
| [Storage optimized](../virtual-machines/windows/sizes-storage.md) | L series | 5630 |
| [GPU](../virtual-machines/windows/sizes-gpu.md) | N series | 1440 |
| [High performance](../virtual-machines/windows/sizes-hpc.md) | A and H series | 2000 |


## Azure data disks
Additional data disks can be added if you need to install applications and store data. Data disks should be used in any situation where durable and responsive data storage is desired. Each data disk has a maximum capacity of 4 TB. The size of the VM instance determines how many data disks can be attached. For each VM vCPU, two data disks can be attached.

### Max data disks per VM
| Type | Common sizes | Max data disks per VM |
|----|----|----|
| [General purpose](../virtual-machines/windows/sizes-general.md) | A, B, and D series | 64 |
| [Compute optimized](../virtual-machines/windows/sizes-compute.md) | F series | 64 |
| [Memory optimized](../virtual-machines/windows/sizes-memory.md) | D, E, G, and M series | 64 |
| [Storage optimized](../virtual-machines/windows/sizes-storage.md) | L series | 64 |
| [GPU](../virtual-machines/windows/sizes-gpu.md) | N series | 64 |
| [High performance](../virtual-machines/windows/sizes-hpc.md) | A and H series | 64 |


## VM disk types
Azure provides two types of disk.

### Standard disk
Standard Storage is backed by HDDs, and delivers cost-effective storage and performance. Standard disks are ideal for a cost effective dev and test workload.

### Premium disk
Premium disks are backed by SSD-based high-performance, low-latency disks. These disks are recommended for VMs that run production workloads. Premium Storage supports DS-series, DSv2-series, GS-series, and FS-series VMs. When you select a disk size, the value is rounded up to the next type. For example, if the disk size is less than 128 GB, the disk type is P10. If the disk size is between 129 GB and 512 GB, the size is a P20. Over 512 GB, the size is a P30.

### Premium disk performance
|Premium storage disk type | P4 | P6 | P10 | P20 | P30 | P40 | P50 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Disk size (round up) | 32 GB | 64 GB | 128 GB | 512 GB | 1,024 GB (1 TB) | 2,048 GB (2 TB) | 4,095 GB (4 TB) |
| Max IOPS per disk | 120 | 240 | 500 | 2,300 | 5,000 | 7,500 | 7,500 |
Throughput per disk | 25 MB/s | 50 MB/s | 100 MB/s | 150 MB/s | 200 MB/s | 250 MB/s | 250 MB/s |

While the above table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, a Standard_GS5 VM can achieve a maximum of 80,000 IOPS. For detailed information on max IOPS per VM, see [Windows VM sizes](../virtual-machines/windows/sizes.md).


## Create and attach disks
You can create and attach disks when you create a scale set, or with an existing scale set.

### Attach disks at scale set creation
Create a virtual machine scale set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). When prompted, provide a username and password for the VM instances. To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985.

Two disks are created with the `-DataDiskSizeGb` parameter. The first disk is *64* GB in size, and the second disk is *128* GB. When prompted, provide your own desired administrative credentials for the VM instances in the scale set:

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic" `
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
  -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmss
```


## Prepare the data disks
The disks that are created and attached to your scale set VM instances are raw disks. Before you can use them with your data and applications, the disks must be prepared. To prepare the disks, you create a partition, create a filesystem, and mount them.

To automate the process across multiple VM instances in a scale set, you can use the Azure Custom Script Extension. This extension can execute scripts locally on each VM instance, such as to prepare attached data disks. For more information, see the [Custom Script Extension overview](../virtual-machines/windows/extensions-customscript.md).


The following example executes a script from a GitHub sample repo on each VM instance with [Add-AzVmssExtension](/powershell/module/az.compute/Add-AzVmssExtension) that prepares all the raw attached data disks:


```azurepowershell-interactive
# Get scale set object
$vmss = Get-AzVmss `
          -ResourceGroupName "myResourceGroup" `
          -VMScaleSetName "myScaleSet"

# Define the script for your Custom Script Extension to run
$publicSettings = @{
  "fileUris" = (,"https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/prepare_vm_disks.ps1");
  "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File prepare_vm_disks.ps1"
}

# Use Custom Script Extension to prepare the attached data disks
Add-AzVmssExtension -VirtualMachineScaleSet $vmss `
  -Name "customScript" `
  -Publisher "Microsoft.Compute" `
  -Type "CustomScriptExtension" `
  -TypeHandlerVersion 1.8 `
  -Setting $publicSettings

# Update the scale set and apply the Custom Script Extension to the VM instances
Update-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmss
```

To confirm that the disks have been prepared correctly, RDP to one of the VM instances. 

First, get the load balancer object with [Get-AzLoadBalancer](/powershell/module/az.network/Get-AzLoadBalancer). Then, view the inbound NAT rules with [Get-AzLoadBalancerInboundNatRuleConfig](/powershell/module/az.network/Get-AzLoadBalancerInboundNatRuleConfig). The NAT rules list the *FrontendPort* for each VM instance that RDP listens on. Finally, get the public IP address of the load balancer with [Get-AzPublicIpAddress](/powershell/module/az.network/Get-AzPublicIpAddress):


```azurepowershell-interactive
# Get the load balancer object
$lb = Get-AzLoadBalancer -ResourceGroupName "myResourceGroup" -Name "myLoadBalancer"

# View the list of inbound NAT rules
Get-AzLoadBalancerInboundNatRuleConfig -LoadBalancer $lb | Select-Object Name,Protocol,FrontEndPort,BackEndPort

# View the public IP address of the load balancer
Get-AzPublicIpAddress -ResourceGroupName "myResourceGroup" -Name myPublicIPAddress | Select IpAddress
```

To connect to your VM, specify your own public IP address and port number of the required VM instance, as shown from the preceding commands. When prompted, enter the credentials used when you created the scale set. If you use the Azure Cloud Shell, perform this step from a local PowerShell prompt or Remote Desktop Client. The following example connects to VM instance *1*:

```powershell
mstsc /v 52.168.121.216:50001
```

Open a local PowerShell session on the VM instance and look at the connected disks with [Get-Disk](/powershell/module/storage/get-disk):

```powershell
Get-Disk
```

The following example output shows that the three data disks are attached to the VM instance.

```powershell
Number  Friendly Name      HealthStatus  OperationalStatus  Total Size  Partition Style
------  -------------      ------------  -----------------  ----------  ---------------
0       Virtual HD         Healthy       Online                 127 GB  MBR
1       Virtual HD         Healthy       Online                  14 GB  MBR
2       Msft Virtual Disk  Healthy       Online                  64 GB  MBR
3       Msft Virtual Disk  Healthy       Online                 128 GB  MBR
4       Msft Virtual Disk  Healthy       Online                 128 GB  MBR
```

Examine the filesystems and mount points on the VM instance as follows:

```powershell
Get-Partition
```

The following example output shows that the three data disks are assigned drive letters:

```powershell
   DiskPath: \\?\scsi#disk&ven_msft&prod_virtual_disk#000001

PartitionNumber  DriveLetter  Offset   Size  Type
---------------  -----------  ------   ----  ----
1                F            1048576  64 GB  IFS

   DiskPath: \\?\scsi#disk&ven_msft&prod_virtual_disk#000002

PartitionNumber  DriveLetter  Offset   Size   Type
---------------  -----------  ------   ----   ----
1                G            1048576  128 GB  IFS

   DiskPath: \\?\scsi#disk&ven_msft&prod_virtual_disk#000003

PartitionNumber  DriveLetter  Offset   Size   Type
---------------  -----------  ------   ----   ----
1                H            1048576  128 GB  IFS
```

The disks on each VM instance in your scale are automatically prepared in the same way. As your scale set would scale up, the required data disks are attached to the new VM instances. The Custom Script Extension also runs to automatically prepare the disks.

Close the remote desktop connection session with the VM instance.


## List attached disks
To view information about disks attached to a scale set, use [Get-AzVmss](/powershell/module/az.compute/get-azvmss) as follows:

```azurepowershell-interactive
Get-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet"
```

Under the *VirtualMachineProfile.StorageProfile* property, the list of *DataDisks* is shown. Information on the disk size, storage tier, and LUN (Logical Unit Number) is shown. The following example output details the three data disks attached to the scale set:

```powershell
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
  -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmss
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
