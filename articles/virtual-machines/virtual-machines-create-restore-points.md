---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: how-to
ms.date: 10/22/2021
ms.custom: template-how-to
---

# Create VM restore points (Preview)

Business continuity and disaster recovery (BCDR) solutions are primarily designed to address site-wide data loss. Solutions that operate at this scale will often manage and execute automated failovers and failbacks across multiple regions. Azure VM restore point APIs are a lightweight option you can use to implement granular backup and retention policies.

You can protect your data and guard against extended downtime by creating virtual machine (VM) restore points at regular intervals. There are several backup options available for virtual machines (VMs), depending on your use-case. You can read about additional [Backup and restore options for virtual machines in Azure](backup-recovery.md).

## About VM restore points

 An individual VM restore point stores the VM configuration and a disk restore point for each attached disk. A disk restore point consists of a snapshot of an individual managed disk.

VM restore points are organized into restore point collections. A restore point collection is an Azure Resource Management resource that contains the restore points for a specific VM. If you want to utilize ARM templates for creating restore points and restore point collections, visit the public [Virtual-Machine-Restore-Points](https://github.com/Azure/Virtual-Machine-Restore-Points) repository on GitHub.

The following image illustrates the relationship between restore point collections, VM restore points, and disk restore points.

:::image type="content" source="media/virtual-machines-create-restore-points-api/restore-point-hierarchy.png" alt-text="A diagram illustrating the relationship between the restore point collection parent and the restore point child objects.":::

VM restore points are incremental. The first restore point stores a full copy of all disks attached to the VM. For each successive restore point for a VM, only the incremental changes to your disks are backed up. To reduce your costs, you can optionally exclude any disk when creating a restore point for your VM.

Keep the following restrictions in mind when you work with VM restore points:

- The restore points APIs work with managed disks only.
- Ultra disks, Ephemeral OS Disks, and Shared Disks aren't supported.
- The restore points APIs require API version 2021-03-01 or better.
- There is a limit of 200 VM restore points that can be created for a particular VM.
- Concurrent creation of restore points for a VM is not supported

## Create VM restore points

The following sections outline the steps you need to take to create VM restore points with the Azure Compute REST APIs.

You can find more information in the [Restore Points](/rest/api/compute/restore-points) and [Restore Point Collections](/rest/api/compute/restore-point-collections) API documentation.

### Step 1: Create a VM restore point collection

Before you create VM restore points, you must create a restore point collection. A restore point collection holds all of the restore points for a specific VM. 

To create a restore point collection, call the restore point collection's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API.

### Step 2: Create a VM restore point

After the restore point collection is created, create a VM restore point within the restore point collection. For more information about restore point creation, see the [Restore Points - Create](/rest/api/compute/restore-points/create) API documentation.

> [!TIP]
> To save space and costs, you can exclude any disk from your VM restore points. To exclude a disk, add its identifier to the `excludeDisks` property in the request body.

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