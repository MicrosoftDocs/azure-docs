---
title: Creating Virtual Machine Restore Points using PowerShell
description: Creating Virtual Machine Restore Points using PowerShell
author: mamccrea
ms.author: mamccrea
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: tutorial
ms.date: 06/30/2022
ms.custom: template-tutorial
---


# Create virtual machine restore points using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can create Virtual Machine restore points using PowerShell scripts. 
The [Azure PowerShell Az](/powershell/azure/new-azureps-module-az) module is used to create and manage Azure resources from the command line or in scripts.

You can protect your data and guard against extended downtime by creating [VM restore points](virtual-machines-create-restore-points.md#about-vm-restore-points) at regular intervals. This article shows you how to create VM restore points, and [exclude disks](#exclude-disks-from-the-restore-point) from the restore point, using the [Az.Compute](/powershell/module/az.compute) module. Alternatively, you can create VM restore points using the [Azure CLI](virtual-machines-create-restore-points-cli.md) or in the [Azure portal](virtual-machines-create-restore-points-portal.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * [Create a VM restore point collection](#step-1-create-a-vm-restore-point-collection)
> * [Create a VM restore point](#step-2-create-a-vm-restore-point)
> * [Track the progress of Copy operation](#step-3-track-the-status-of-the-vm-restore-point-creation)
> * [Restore a VM](#restore-a-vm-from-vm-restore-point)

## Prerequisites

- Learn more about the [support requirements](concepts-restore-points.md) and [limitations](virtual-machines-create-restore-points.md#limitations) before creating a restore point.

## Step 1: Create a VM restore point collection
Use the [New-AzRestorePointCollection](/powershell/module/az.compute/new-azrestorepointcollection) cmdlet to create a VM restore point collection.

```
New-AzRestorePointCollection -ResourceGroupName ExampleRG -Name ExampleRPC -VmId “/subscriptions/{SubscriptionId}/resourcegroups/ ExampleRG/providers/microsoft.compute/virtualmachines/Example-vm-1” -Location “WestEurope”
```

## Step 2: Create a VM restore point
Create a VM restore point with the [New-AzRestorePoint](/powershell/module/az.compute/new-azrestorepoint) cmdlet as shown below:

```
New-AzRestorePoint -ResourceGroupName ExampleRG -RestorePointCollectionName ExampleRPC -Name ExampleRP
```
To create a crash consistent restore point set the optional parameter "ConsistencyMode" to "CrashConsistent". This feature is currently in preview.

### Exclude disks from the restore point
Exclude certain disks that you do not want to be a part of the restore point with the `-DisksToExclude` parameter, as follows:
```
New-AzRestorePoint -ResourceGroupName ExampleRG -RestorePointCollectionName ExampleRPC -Name ExampleRP -DisksToExclude “/subscriptions/{SubscriptionId}/resourcegroups/ ExampleRG/providers/Microsoft.Compute/disks/example-vm-1-data_disk_1”
```

## Step 3: Track the status of the VM restore point creation
You can track the progress of the VM restore point creation using the [Get-AzRestorePoint](/powershell/module/az.compute/get-azrestorepoint) cmdlet, as follows:
```
Get-AzRestorePoint -ResourceGroupName ExampleRG -RestorePointCollectionName ExampleRPC -Name ExampleRP
```
## Restore a VM from VM restore point
To restore a VM from a VM restore point, first restore individual disks from each disk restore point. You can also use the [ARM template](https://github.com/Azure/Virtual-Machine-Restore-Points/blob/main/RestoreVMFromRestorePoint.json) to restore a full VM along with all the disks.
```
# Create Disks from disk restore points 
$restorePoint = Get-AzRestorePoint -ResourceGroupName ExampleRG -RestorePointCollectionName ExampleRPC -Name ExampleRP 

$osDiskRestorePoint = $restorePoint.SourceMetadata.StorageProfile.OsDisk.DiskRestorePoint.Id
$dataDisk1RestorePoint = $restorePoint.sourceMetadata.storageProfile.dataDisks[0].diskRestorePoint.id
$dataDisk2RestorePoint = $restorePoint.sourceMetadata.storageProfile.dataDisks[1].diskRestorePoint.id
 
New-AzDisk -DiskName “ExampleOSDisk” (New-AzDiskConfig  -Location eastus -CreateOption Restore -SourceResourceId $osDiskRestorePoint) -ResourceGroupName ExampleRg

New-AzDisk -DiskName “ExampleDataDisk1” (New-AzDiskConfig  -Location eastus -CreateOption Restore -SourceResourceId $dataDisk1RestorePoint) -ResourceGroupName ExampleRg

New-AzDisk -DiskName “ExampleDataDisk2” (New-AzDiskConfig  -Location eastus -CreateOption Restore -SourceResourceId $dataDisk2RestorePoint) -ResourceGroupName ExampleRg

```
After you create the disks, [create a new VM](./windows/create-vm-specialized-portal.md) and [attach these restored disks](./windows/attach-disk-ps.md#using-managed-disks) to the newly created VM.

## Next steps
[Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.