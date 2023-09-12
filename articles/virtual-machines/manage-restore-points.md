---
title: Manage Virtual Machine restore points
description: Managing Virtual Machine Restore Points
author: mamccrea
ms.author: mamccrea
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: how-to
ms.date: 07/05/2022
ms.custom: template-how-to
---

# Manage VM restore points

This article explains how to copy and restore a VM from a VM restore point and track the progress of the copy operation. This article also explains how to create a disk from a disk restore point and to create a shared access signature for a disk.

## Copy a VM restore point between regions

The VM restore point APIs can be used to restore a VM in a different region than the source VM. 
Use the following steps:

### Step 1: Create a destination VM restore point collection

To copy an existing VM restore point from one region to another, your first step is to create a restore point collection in the target or destination region. To do this, reference the restore point collection from the source region as detailed in [Create a VM restore point collection](create-restore-points.md#step-1-create-a-vm-restore-point-collection).

```azurepowershell-interactive
New-AzRestorePointCollection `
    -ResourceGroupName 'myResourceGroup' `
    -Name 'myRPCollection' `
    -Location 'WestUS' `
    -RestorePointCollectionId '/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RG>/providers/Microsoft.Compute/restorePointCollections/<SOURCE RESTORE POINT COLLECTION>'
```

### Step 2: Create the destination VM restore point

After the restore point collection is created, trigger the creation of a restore point in the target restore point collection. Ensure that you've referenced the restore point in the source region that you want to copy and specified the source restore point's identifier in the request body. The source VM's location is inferred from the target restore point collection in which the restore point is being created.
See the [Restore Points - Create](/rest/api/compute/restore-points/create) API documentation to create a `RestorePoint`.

```azurepowershell-interactive
New-AzRestorePoint `
    -ResourceGroupName 'myResourceGroup' `
    -RestorePointCollectionName 'myRPCollection'
    -Name 'myRestorePoint'
```

### Step 3: Track copy status

To track the status of the copy operation, follow the guidance in the [Get restore point copy or replication status](#get-restore-point-copy-or-replication-status) section below. This is only applicable for scenarios where the restore points are copied to a different region than the source VM.

```azurepowershell-interactive
Get-AzRestorePoint `
    -ResourceGroupName 'myResourceGroup' `
    -RestorePointCollectionName 'myRPCollection'
    -Name 'myRestorePoint'
```

## Get restore point copy or replication status

Copying the first VM restore point to  another region is a long running operation. The VM restore point can be used to restore a VM only after the operation is completed for all disk restore points. To track the operation's status, call the [Restore Point - Get](/rest/api/compute/restore-points/get) API on the target VM restore point and include the `instanceView` parameter. The return will include the percentage of data that has been copied at the time of the request.

During restore point creation, the `ProvisioningState` will appear as `Creating` in the response. If creation fails, `ProvisioningState` is set to `Failed`.

## Create a disk using disk restore points

You can use the VM restore points APIs to restore a VM disk, which can then be used to create a new VM.
Use the following steps:

### Step 1: Retrieve disk restore point identifiers

Call the [Restore Point Collections - Get](/rest/api/compute/restore-point-collections/get) API on the restore point collection to get access to associated restore points and their IDs. Each VM restore point will in turn contain individual disk restore point identifiers.

### Step 2: Create a disk

After you have the list of disk restore point IDs, you can use the [Disks - Create Or Update](/rest/api/compute/disks/create-or-update) API to create a disk from the disk restore points. You can choose a zone while creating the disk. The zone can be different from zone in which the disk restore point exists.

## Restore a VM with a restore point

To restore a full VM from a VM restore point, you must restore individual disks from each disk restore point. This process is described in the [Create a disk](#create-a-disk-using-disk-restore-points) section. After you restore all the disks, create a new VM and attach the restored disks to the new VM.
You can also use the [ARM template](https://github.com/Azure/Virtual-Machine-Restore-Points/blob/main/RestoreVMFromRestorePoint.json) to restore a full VM along with all the disks.

## Get a shared access signature for a disk

To create a Shared Access Signature (SAS) for a disk within a VM restore point, pass the ID of the disk restore points via the `BeginGetAccess` API. If no active SAS exists on the restore point snapshot, a new SAS is created. The new SAS URL is returned in the response. If an active SAS already exists, the SAS duration is extended, and the pre-existing SAS URL is returned in the response.

For more information about granting access to snapshots, see the [Grant Access](/rest/api/compute/snapshots/grant-access) API documentation.

## Next steps

[Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
