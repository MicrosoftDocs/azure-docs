---
title: Manage an Azure disk pool (preview)
description: Learn how to add managed disks to an Azure disk pool or disable iSCSI support on a disk.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/19/2021
ms.author: rogarana
ms.subservice: disks
---

# Manage an Azure disk pool (preview)

This article covers how to add a managed disk to an Azure disk pool (preview) and how to disable iSCSI support on a disk that has been added to a disk pool.

## Prerequisites

Install [version 6.1.0 or newer](/powershell/module/az.diskpool/?view=azps-6.1.0&preserve-view=true) of the Azure PowerShell module.

## Add a disk to a pool

Your disk must meet the following requirements in order to be added to the disk pool:
- Must be either a premium SSD or an ultra disk in the same region and availability zone as the disk pool.
    - Ultra disks must have a disk sector size of 512 bytes.
- Must be a shared disk, with a maxShares value of two or greater.
- You must [provide the StoragePool resource provider RBAC permissions to the disks that will be added to the disk pool](disks-pools-deploy.md#assign-storagepool-resource-provider-permissions).

The following script adds an additional disk to the disk pool and exposes it over iSCSI. It keeps the existing disks in the disk pool without any change.

```azurepowershell
#Initialize input parameters
$resourceGroupName ="<yourResourceGroupName>"
$diskPoolName = "<yourDiskPoolName>"
$iscsiTargetName = "<youriSCSITargetName>"
$diskName ="<yourDiskName>" #Provide the name of the disk you want to add
$lunName ='LunName>' #Provide the Lun name of the added disk
$diskIds = @()

#Add the disk to disk pool
$DiskPool = Get-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName
$DiskPoolDiskIDs = $DiskPool.Disk.Id
foreach ($Id in $DiskPoolDiskIDs)
{
$diskIds += ($Id)
}

$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName
$diskIds += ,($disk.Id)
Update-AzDiskPool -ResourceGroupName $resourceGroupName -Name $diskPoolName -DiskId $diskIds

#Get the existing iSCSI LUNs and add the new disk
$target = Get-AzDiskPoolIscsiTarget -name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName
$existingLuns = $target.Lun
$luns = @()
foreach ($lun in $existingLuns)
{
$tmpLunName = $lun.Name
$tmpId = $lun.ManagedDiskAzureResourceId
$tmplun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $tmpId -Name $tmpLunName
$luns += ,($tmplun)
}

$newlun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $disk.Id -Name $lunName
$luns += ,($newlun)
Update-AzDiskPoolIscsiTarget -Name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName -Lun $luns
```

## Disable iSCSI on a disk and remove it from the pool

Before you disable iSCSI support on a disk, confirm there is no outstanding iSCSI connections to the iSCSI LUN the disk is exposed as. When a disk is removed from the disk pool, it isn't automatically deleted. This prevents any data loss but you will still be billed for storing data. If you don't need the data stored in a disk, you can manually delete the disk. This will delete the disk and all data stored on it and will prevent further charges.

```azurepowershell
#Initialize input parameters
$resourceGroupName ="<yourResourceGroupName>"
$diskPoolName = "<yourDiskPoolName>"
$iscsiTargetName = "<youriSCSITargetName>"
$diskName ="<NameOfDiskYouWantToRemove>" #Provide the name of the disk you want to remove
$lunName ='<LUNForDiskYouWantToRemove>' #Provide the Lun name of the disk you want to remove
$diskIds = @()

#Get the existing iSCSI LUNs and remove it from iSCS target
$target = Get-AzDiskPoolIscsiTarget -name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName
$existingLuns = $target.Lun
$luns = @()
foreach ($lun in $existingLuns)
{
if ($lun.Name -notlike $lunName)
{
$tmpLunName = $lun.Name
$tmpId = $lun.ManagedDiskAzureResourceId
$tmplun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $tmpId -Name $tmpLunName
$luns += ,($tmplun)
}
}

Update-AzDiskPoolIscsiTarget -Name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName -Lun $luns

#Remove the disk from disk pool
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName
$DiskPool = Get-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName
$DiskPoolDiskIDs = $DiskPool.Disk.Id
foreach ($Id in $DiskPoolDiskIDs)
{
if ($Id -notlike $disk.Id)
{
$diskIds += ($Id)
}
}

Update-AzDiskPool -ResourceGroupName $resourceGroupName -Name $diskPoolName -DiskId $diskIds
```

## Next steps

- To learn how to move a disk pool to another subscription, see [Move a disk pool to a different subscription](disks-pools-move-resource.md).
- To learn how to deprovision a disk pool, see [Deprovision an Azure disk pool](disks-pools-deprovision.md).