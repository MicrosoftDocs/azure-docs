---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: how-to
ms.date: 02/14/2022
ms.custom: template-how-to
---

# Create VM restore points (Preview)

Business continuity and disaster recovery (BCDR) solutions are primarily designed to address site-wide data loss. Solutions that operate at this scale will often manage and execute automated failovers and failbacks across multiple regions. Azure VM restore point APIs are a lightweight option you can use to implement granular backup and retention policies.

You can protect your data and guard against extended downtime by creating virtual machine (VM) restore points at regular intervals. There are several backup options available for virtual machines (VMs), depending on your use-case. You can read about additional [Backup and restore options for virtual machines in Azure](backup-recovery.md).

## About VM restore points

An individual VM restore point is a resource that stores VM configuration and point-in-time application consistent snapshots of all the managed disks attached to the VM. VM restore points can be leveraged to easily capture multi-disk consistent backups.  VM restore points contains a disk restore point for each of the attached disks. A disk restore point consists of a snapshot of an individual managed disk.

VM restore points support application consistency for VMs running Windows operating systems and support file system consistency for VMs running Linux operating system. Application consistent restore points use VSS writers (or pre/post scripts for Linux) to ensure the consistency of the application data before a restore point is created. To get an application consistent restore point the application running in the VM needs to provide a VSS writer (for Windows) or pre and post scripts (for Linux) to achieve application consistency.

VM restore points are organized into restore point collections. A restore point collection is an Azure Resource Management resource that contains the restore points for a specific VM. If you want to utilize ARM templates for creating restore points and restore point collections, visit the public [Virtual-Machine-Restore-Points](https://github.com/Azure/Virtual-Machine-Restore-Points) repository on GitHub.

The following image illustrates the relationship between restore point collections, VM restore points, and disk restore points.

:::image type="content" source="media/virtual-machines-create-restore-points-api/restore-point-hierarchy.png" alt-text="A diagram illustrating the relationship between the restore point collection parent and the restore point child objects.":::

You can use the APIs to create restore points for your source VM in either the same region, or in other regions. You can also copy existing VM restore points between regions.

VM restore points are incremental. The first restore point stores a full copy of all disks attached to the VM. For each successive restore point for a VM, only the incremental changes to your disks are backed up. To reduce your costs, you can optionally exclude any disk when creating a restore point for your VM.

Keep the following restrictions in mind when you work with VM restore points:

- The restore points APIs work with managed disks only.
- Ultra disks, Ephemeral OS Disks, and Shared Disks aren't supported.
- The restore points APIs require API version 2021-03-01 or better.
- There is a limit of 200 VM restore points that can be created for a particular VM.
- Concurrent creation of restore points for a VM is not supported.
- Private links are not supported when:
    - Copying restore points across regions.
    - Creating restore points in a region other than the source VM.
- Currently, cross-region creation and copy of VM restore points are only available in the following regions:

  | Area            | Regions    |
  |-----------------|----------------------------------------------|
  |**Americas**     | East US, East US 2, Central US, North Central US, <br/>South Central US, West Central US, West US, West US 2 |
  |**Asia Pacific** | Central India, South India |
  |**Europe**       | Germany West central, North Europe, West Europe |

## Create VM restore points

The following sections outline the steps you need to take to create VM restore points with the Azure Compute REST APIs.

You can find more information in the [Restore Points](/rest/api/compute/restore-points), [PowerShell](/powershell/module/az.compute/new-azrestorepoint), and [Restore Point Collections](/rest/api/compute/restore-point-collections) API documentation.

### Step 1: Create a VM restore point collection

Before you create VM restore points, you must create a restore point collection. A restore point collection holds all of the restore points for a specific VM. Depending on your needs, you can create VM restore points in the same region as the VM, or in a different region.
To create a restore point collection, call the restore point collection's Create or Update API. If you're creating restore point collection in the same region as the VM, then specify the VM's region in the location property of the request body. If you're creating the restore point collection in a different region than the VM, specify the target region for the collection in the location property, but also specify the source restore point collection ARM resource ID in the request body.
 
To create a restore point collection, call the restore point collection's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API.

### Step 2: Create a VM restore point

After the restore point collection is created, create a VM restore point within the restore point collection. For more information about restore point creation, see the [Restore Points - Create](/rest/api/compute/restore-points/create) API documentation.

> [!TIP]
> To save space and costs, you can exclude any disk from either local region or cross-region VM restore points. To exclude a disk, add its identifier to the `excludeDisks` property in the request body.

### Step 3: Track the status of the VM restore point creation

Restore point creation in your local region will be completed within a few seconds. Scenarios which involve the creation of cross-region restore points will take considerably longer. To track the status of the creation operation, follow the guidance within the [Get restore point copy or replication status](#get-restore-point-copy-or-replication-status) section below. This is only applicable for scenarios where the restore points are created in a different region than the source VM.

## Copy a VM restore point between regions

The VM restore point APIs can be used to restore a VM in a different region than the source VM.

### Step 1: Create a destination VM restore point collection

To copy an existing VM restore point from one region to another, your first step is to create a restore point collection in the target or destination region. To do this, reference the restore point collection from the source region. Follow the guidance within the [Step 1: Create a VM restore point collection](#step-1-create-a-vm-restore-point-collection) section above.

### Step 2: Create the destination VM restore point

After the restore point collection is created, trigger the creation of a restore point in the target restore point collection. Ensure that you've referenced the restore point in the source region that you want to copy. Ensure also that you've specified the source restore point's identifier in the request body. The source VM's location will be inferred from the target restore point collection in which the restore point is being created.
Refer to the [Restore Points - Create](/rest/api/compute/restore-points/create) API documentation to create a `RestorePoint`.

### Step 3: Track copy status

To track the status of the copy operation, follow the guidance within the [Get restore point copy or replication status](#get-restore-point-copy-or-replication-status) section below. This is only applicable for scenarios where the restore points are copied to a different region than the source VM.

## Get restore point copy or replication status

Creation of a cross-region VM restore point is a long running operation. The VM restore point can be used to restore a VM only after the operation is completed for all disk restore points. To track the operation's status, call the [Restore Point - Get](/rest/api/compute/restore-points/get) API on the target VM restore point and include the `instanceView` parameter. The return will include the percentage of data that has been copied at the time of the request.

During restore point creation, the `ProvisioningState` will appear as `Creating` in the response. If creation fails, `ProvisioningState` will be set to `Failed`.

## Create a disk using disk restore points

You can use the VM restore points APIs to restore a VM disk, which can then be used to create a new VM.

### Step 1: Retrieve disk restore point identifiers

Call the [Restore Point Collections - Get](/rest/api/compute/restore-point-collections/get) API on the restore point collection to get access to associated restore points and their IDs. Each VM restore point will in turn contain individual disk restore point identifiers.

### Step 2: Create a disk

After you have the list of disk restore point IDs, you can use the [Disks - Create Or Update](/rest/api/compute/disks/create-or-update) API to create a disk from the disk restore points.

## Restore a VM with a restore point

To restore a full VM from a VM restore point, first restore individual disks from each disk restore point. This process is described in the [Create a disk](#create-a-disk-using-disk-restore-points) section. After all disks are restored, create a new VM and attach the restored disks to the new VM.

## Get a shared access signature for a disk

To create a shared access signature (SAS) for a disk within a VM restore point, pass the ID of the disk restore points via the `BeginGetAccess` API. If no active SAS exists on the restore point snapshot, a new SAS will be created. The new SAS URL will be returned in the response. If an active SAS already exists, the SAS duration will be extended and the pre-existing SAS URL will be returned in the response.

For more information about granting access to snapshots, see the [Grant Access](/rest/api/compute/snapshots/grant-access) API documentation.

## Next steps

Read more about [Backup and restore options for virtual machines in Azure](backup-recovery.md).
