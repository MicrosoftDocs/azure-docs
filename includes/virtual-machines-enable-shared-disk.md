---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/14/2020
 ms.author: rogarana
 ms.custom: include file
---

## Limitations

[!INCLUDE [virtual-machines-disks-shared-limitations](virtual-machines-disks-shared-limitations.md)]

## Supported operating systems

Shared disks support several operating systems. See the [Windows](../articles/virtual-machines/windows/disks-shared.md#windows) and [Linux](../articles/virtual-machines/linux/disks-shared.md#linux) sections of the conceptual article for the supported operating systems.

## Disk sizes

[!INCLUDE [virtual-machines-disks-shared-sizes](virtual-machines-disks-shared-sizes.md)]

## Deploy shared disks

### Deploy a premium SSD as a shared disk

To deploy a managed disk with the shared disk feature enabled, use the new property `maxShares` and define a value greater than 1. This makes the disk shareable across multiple VMs.

> [!IMPORTANT]
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

#### CLI
```azurecli

az disk create -g myResourceGroup -n mySharedDisk --size-gb 1024 -l westcentralus --sku PremiumSSD_LRS --max-shares 2

```

#### PowerShell
```azurepowershell-interactive

$dataDiskConfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType PremiumSSD_LRS -CreateOption Empty -MaxSharesCount 2

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $dataDiskConfig

```

### Deploy an ultra disk as a shared disk

To deploy a managed disk with the shared disk feature enabled, change the `maxShares` parameter to a value greater than 1. This makes the disk shareable across multiple VMs.

> [!IMPORTANT]
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

#### CLI

##### Regional disk example

```azurecli
#Creating an Ultra shared Disk 
az disk create -g rg1 -n clidisk --size-gb 1024 -l westus --sku UltraSSD_LRS --max-shares 5 --disk-iops-read-write 2000 --disk-mbps-read-write 200 --disk-iops-read-only 100 --disk-mbps-read-only 1

#Updating an Ultra shared Disk 
az disk update -g rg1 -n clidisk --disk-iops-read-write 3000 --disk-mbps-read-write 300 --set diskIopsReadOnly=100 --set diskMbpsReadOnly=1

#Show shared disk properties:
az disk show -g rg1 -n clidisk
```

##### Zonal disk example

This example is almost the same as the previous, except it creates a disk in availability zone 1.

```azurecli
#Creating an Ultra shared Disk 
az disk create -g rg1 -n clidisk --size-gb 1024 -l westus --sku UltraSSD_LRS --max-shares 5 --disk-iops-read-write 2000 --disk-mbps-read-write 200 --disk-iops-read-only 100 --disk-mbps-read-only 1 --zone 1

#Updating an Ultra shared Disk 
az disk update -g rg1 -n clidisk --disk-iops-read-write 3000 --disk-mbps-read-write 300 --set diskIopsReadOnly=100 --set diskMbpsReadOnly=1

#Show shared disk properties:
az disk show -g rg1 -n clidisk
```

#### PowerShell

##### Regional disk example

```azurepowershell-interactive
$datadiskconfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType UltraSSD_LRS -CreateOption Empty -DiskIOPSReadWrite 2000 -DiskMBpsReadWrite 200 -DiskIOPSReadOnly 100 -DiskMBpsReadOnly 1 -MaxSharesCount 5

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $datadiskconfig
```

##### Zonal disk example

This example is almost the same as the previous, except it creates a disk in availability zone 1.

```azurepowershell-interactive
$datadiskconfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType UltraSSD_LRS -CreateOption Empty -DiskIOPSReadWrite 2000 -DiskMBpsReadWrite 200 -DiskIOPSReadOnly 100 -DiskMBpsReadOnly 1 -MaxSharesCount 5 -Zone 1

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $datadiskconfig
```

### Using Azure shared disks with your VMs

Once you've deployed a shared disk with `maxShares>1`, you can mount the disk to one or more of your VMs.

```azurepowershell-interactive

$resourceGroup = "myResourceGroup"
$location = "WestCentralUS"

$vm = New-AzVm -ResourceGroupName $resourceGroup -Name "myVM" -Location $location -VirtualNetworkName "myVnet" -SubnetName "mySubnet" -SecurityGroupName "myNetworkSecurityGroup" -PublicIpAddressName "myPublicIpAddress"

$dataDisk = Get-AzDisk -ResourceGroupName $resourceGroup -DiskName "mySharedDisk"

$vm = Add-AzVMDataDisk -VM $vm -Name "mySharedDisk" -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 0

update-AzVm -VM $vm -ResourceGroupName $resourceGroup
```

## Supported SCSI PR commands

Once you've mounted the shared disk to your VMs in your cluster, you can establish quorum and read/write to the disk using SCSI PR. The following PR commands are available when using Azure shared disks:

To interact with the disk, start with the persistent-reservation-action list:

```
PR_REGISTER_KEY 

PR_REGISTER_AND_IGNORE 

PR_GET_CONFIGURATION 

PR_RESERVE 

PR_PREEMPT_RESERVATION 

PR_CLEAR_RESERVATION 

PR_RELEASE_RESERVATION 
```

When using PR_RESERVE, PR_PREEMPT_RESERVATION, or  PR_RELEASE_RESERVATION, provide one of the following persistent-reservation-type:

```
PR_NONE 

PR_WRITE_EXCLUSIVE 

PR_EXCLUSIVE_ACCESS 

PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY 

PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY 

PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS 

PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS 
```

You also need to provide a persistent-reservation-key when using PR_RESERVE, PR_REGISTER_AND_IGNORE, PR_REGISTER_KEY, PR_PREEMPT_RESERVATION, PR_CLEAR_RESERVATION, or PR_RELEASE-RESERVATION.


## Next steps

If you prefer to use Azure Resource Manager templates to deploy your disk, the following sample templates are available:
- [Premium SSD](https://aka.ms/SharedPremiumDiskARMtemplate)
- [Regional ultra disks](https://aka.ms/SharedUltraDiskARMtemplateRegional)
- [Zonal ultra disks](https://aka.ms/SharedUltraDiskARMtemplateZonal)