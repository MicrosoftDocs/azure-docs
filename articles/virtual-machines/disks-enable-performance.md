---
title: Enable performance plus
description: Increase the performance of managed disks.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 02/28/2023
ms.author: rogarana
ms.subservice: disks
---

# Enable performance plus

Performance Plus allows users to increase their Azure Disks’ Input/Output Operations Per Second (IOPS) and throughput limits for Premium SSD, Standard SSD, and Standard HDD disks sized 1024 GB and larger. This feature is designed to provide enhanced performance for workloads that require high IOPS and throughput, such as database and transactional workloads. 

Performance Plus can be enabled on eligible disks through the Azure portal or via Azure Resource Manager templates. Once enabled, the IOPS and throughput limits for the disk will be increased to the higher maximum limits. To see the eligible disks and their new limitations, see [Scalability and performance targets for VM disks](disks-scalability-targets.md).

## Limitations

- Can only be enabled on Standard HDD, Standard SSD, and Premium SSD managed disks that are 1024 GiB or larger.
- Can only be enabled on new disks.
- Not supported for disks recovered with Azure Site Recovery or Azure Backup.
- Can't be enabled in the Azure portal.

## Enable

# [Azure CLI](#tab/azure-cli)

```azurecli
myRG=yourResourceGroupName
myDisk=yourDiskName
myVM=yourVMName
region=desiredRegion
# Valid values are Premium_LRS, Premium_ZRS, StandardSSD_LRS, StandardSSD_ZRS, or Standard_LRS
sku=desiredSKU

az disk create -g $myRG -n $myDisk --size-gb 1024 --sku $sku -l $region –performance-plus true 

az vm disk attach --vm-name $myVM --name $myDisk --resource-group $myRG 
```


The following is the command to create a new azure disk with performance plus enabled with data from another disk or snapshot: 
```azurecli
myRG=yourResourceGroupName
myDisk=yourDiskName
myVM=yourVMName
region=desiredRegion
# Valid values are Premium_LRS, Premium_ZRS, StandardSSD_LRS, StandardSSD_ZRS, or Standard_LRS
sku=desiredSKU
#Size must be 1024 or larger
size=1024

az disk create --name $myDisk --resource-group $myRG --size-gb $size -- --performance-plus true --sku $sku --source <<Another Disk or Snapshot>> --location $region
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$myRG=yourResourceGroupName
$myDisk=yourDiskName
$myVM=yourVMName
$region=desiredRegion
# Valid values are Premium_LRS, Premium_ZRS, StandardSSD_LRS, StandardSSD_ZRS, or Standard_LRS
$sku=desiredSKU
#Size must be 1024 or larger
$size=1024

Set-AzContext -SubscriptionName <yourSubscriptionName> 

$diskConfig = New-AzDiskConfig -Location $region -CreateOption Empty -DiskSizeGB $size -SkuName $sku -PerformancePlus $true 

$dataDisk = New-AzDisk -ResourceGroupName $myRG -DiskName $myDisk -Disk $diskConfig 
```

The following is the command to create a new azure disk with performance plus enabled with data from another disk or snapshot: 
```azurepowershell

$myDisk=yourDiskName
$myVM=yourVMName
$region=desiredRegion
# Valid values are Premium_LRS, Premium_ZRS, StandardSSD_LRS, StandardSSD_ZRS, or Standard_LRS
$sku=desiredSKU
#Size must be 1024 or larger
$size=1024

Set-AzContext -SubscriptionName <<yourSubscriptionName>> 

$diskConfig = New-AzDiskConfig -Location $region -CreateOption Empty -DiskSizeGB $size -SkuName $sku -PerfromancePlus $true 

$dataDisk = New-AzDisk -ResourceGroupName $myRG  -DiskName $myDisk 
```
---

## Next steps

- [Expand virtual hard disks on a Linux VM](linux/expand-disks.md)
- [How to expand virtual hard disks attached to a Windows virtual machine](windows/expand-os-disk.md)