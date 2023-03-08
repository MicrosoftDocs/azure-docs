---
title: Increase performance of Premium SSDs and Standard SSD/HDDs
description: Increase the performance of Azure Premium SSDs and Standard SSD/HDDs using performance plus.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 03/14/2023
ms.author: rogarana
ms.subservice: disks
---

# Increase IOPS and throughput limits for Azure Premium SSDs and Standard SSD/HDDs

The Input/Output Operations Per Second (IOPS) and throughput limits for Azure Premium solid-state drives (SSD), Standard SSDs, and Standard hard disk drives (HDD) that are 1024 GB and larger can be increased by enabling performance plus. Enabling performance plus improves the experience for workloads that require high IOPS and throughput, such as database and transactional workloads. There's no extra charge for enabling performance plus on a disk.

Once enabled, the IOPS and throughput limits for an eligible disk increase to the higher maximum limits. To see the new IOPS and throughput limits for eligible disks, consult the columns that begin with "*Expanded" in the [Scalability and performance targets for VM disks](disks-scalability-targets.md) article.

## Limitations

- Can only be enabled on Standard HDD, Standard SSD, and Premium SSD managed disks that are 1024 GiB or larger.
- Can only be enabled on new disks.
    - To work around this, create a snapshot of your disk, then create a new disk from the snapshot.
- Not supported for disks recovered with Azure Site Recovery or Azure Backup.
- Can't be enabled in the Azure portal.

## Prerequisites

Either use the Azure Cloud Shell to run your commands or install the latest [Azure PowerShell module](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli) locally.


## Enable performance plus

You'll need to create a new disk to use performance plus. The following script will create a disk that has performance plus enabled and attach it to a VM:

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

To migrate data from an existing disk or snapshot to a new disk with performance plus enabled, use the following script:

```azurecli
myRG=yourResourceGroupName
myDisk=yourDiskName
myVM=yourVMName
region=desiredRegion
# Valid values are Premium_LRS, Premium_ZRS, StandardSSD_LRS, StandardSSD_ZRS, or Standard_LRS
sku=desiredSKU
#Size must be 1024 or larger
size=1024
sourceURI=yourDiskOrSnapshotURI

az disk create --name $myDisk --resource-group $myRG --size-gb $size -- --performance-plus true --sku $sku --source $sourceURI --location $region
```

# [Azure PowerShell](#tab/azure-powershell)

You'll need to create a new disk to use performance plus. The following script will create a disk that has performance plus enabled and attach it to a VM:

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

To migrate data from an existing disk or snapshot to a new disk with performance plus enabled, use the following script:

```azurepowershell
$myDisk=yourDiskOrSnapshotName
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

- [Create an incremental snapshot for managed disks](disks-incremental-snapshots.md)
- [Expand virtual hard disks on a Linux VM](linux/expand-disks.md)
- [How to expand virtual hard disks attached to a Windows virtual machine](windows/expand-os-disk.md)