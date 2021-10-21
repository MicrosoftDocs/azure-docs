---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: how-to
ms.date: 7/24/2021
ms.custom: template-how-to
---

<!--
How-to article for for virtual machine restore point collection (API)
-->

# Create VM restore points using REST APIs (Preview)

Business continuity and disaster recovery (BCDR) solutions are primarily designed to address site-wide data loss. Solutions that operate at this scale will often manage and execute automated failovers and failbacks across multiple regions. Azure VM restore point APIs are a lightweight option you can use to implement granular backup and retention policies.

## About VM restore points

You can protect your data and guard against extended downtime by creating virtual machine (VM) restore points at regular intervals. There are several backup options available for virtual machines (VMs), depending on your use-case. An individual VM restore point stores the VM configuration. A VM restore point may also include disk restore points. A disk restore point is a snapshot of an attached managed disk.

VM restore points are organized into restore point collections. A restore point collection is an Azure Resource Management (ARM) resource that contains the restore points for a specific VM. 

The following image illustrates the relationship between restore point collections, VM restore points, and disk restore points.

:::image type="content" source="media/virtual-machines-create-restore-points-api/restore-point-hierarchy.png" alt-text="A diagram illustrating the relationship between the restore point collection parent and the restore point child objects":::

You can use the APIs to create restore points for your source VM in either the same region, or in other regions. You can also copy existing VM restore points between regions.

VM restore points are incremental. The first restore point stores a full copy of all disks attached to the VM. For each successive restore point for a VM, only the incremental changes to your disks are backed up. To reduce your costs, you can optionally exclude any disk when creating a restore point for your VM.

Keep the following restrictions in mind when you work with VM restore points:

- The restore points APIs work with managed disks only.
- Ultra disks, Ephemeral OS Disks, and Shared Disks aren't supported.
- The restore points APIs require API version 2021-0301 or better.

## Create VM restore points

To protect a VM from data loss, data corruption, or regional outages, you'll use the VM restore points API to create restore points for specific VMs.

### Step 1: Create a VM restore point collection

Before you create VM restore points, you must create a restore point collection. A restore point collection holds all of the restore points for a specific VM. Depending on your needs, you can create VM restore points in the same region as the VM, or in a different region.

To create a restore point collection, call the restore point collection's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API. If you're creating restore point collection in the same region as the VM, then specify the VM's region in the `location` property of the request body. If you're creating the restore point collection in a different region than the VM, then specify the target region for the collection in the `location` property, but also specify the source VM in the request body.

Refer to the [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API documentation.

### Step 2: Create a VM restore point

After the restore point collection is created, create a VM restore point within the restore point collection. For more information about restore point creation, see the [create](/rest/api/compute/restore-points/create) API documentation.

### Step 3: Track the status of the VM restore point creation

Creation of a cross-region VM restore point is a long running operation. A creation request operation will initially return an HTTP 201 response, and the status will need to be polled. Both the `Location` and `Azure-AsyncOperation` headers are provided for this purpose.

During restore point creation, the `ProvisioningState` will appear as `Creating` in the response. If creation fails, `ProvisioningState` will be set to `Failed`.

## Exclude disks from VM restore points

You can exclude any disk from either local region or cross-region restore points. To exclude a disk, add its identifier to the `excludeDisks` property in the request body.

## Copy a VM restore point between regions

### Step 1: Create a destination VM restore point collection

Before you can copy an existing VM restore point between regions, ensure that an available restore point collection exists in the target region. 

If necessary, create a restore point collection in the target region. If you're creating restore point collection in the same region as the VM, then specify the VM's region in the `location` property of the request body. If you're creating the restore point collection in a different region than the VM, then specify the target region for the collection in the `location` property, but also specify the source VM in the request body.

Refer to the [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API documentation.

### Step 2: Create the destination VM restore point

After the restore point collection is created, trigger the creation of a restore point in the target restore point collection. Ensure that you've referenced the restore point in the source region that you want to copy. Ensure also that you've specified the source restore point's identifier in the request body. The source VM's location will be inferred from the target restore point collection in which the restore point is being created.

Refer to the [API documentation](/rest/api/compute/restore-points/create) to create a `RestorePoint`.

### Step 3: Track copy status

The VM restore point can be used to restore a VM only after the copy operation has successfully been completed for all disk restore points. To track the status of the copy operation, follow the guidance within the [Get copy or replication status](#get-restore-point-copy-or-replication-status) section below. 

## Get restore point copy or replication status

After you initiate a restore point create or copy operation within a target region, you can track its status. Call the restore point's [GET](/rest/api/compute/restore-points/get) API on the target VM restore point using the `instanceView` parameter. The return will include the percentage of data that has been copied at the time of the request.

## Create a disk using disk restore points

### Step 1: Retrieve disk restore point identifiers

Call the [GET](/rest/api/compute/restore-point-collections/get) API on the restore point collection to get access to associated restore points and their IDs. Each VM restore point will in turn contain individual disk restore point identifiers.

### Step 2: Create a disk

After you have the list of disk restore point IDs, you can use the disk's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API to create a disk from the disk restore points.

## Restore a VM with a restore point

To restore a full VM from a VM restore point, first restore individual disks from each disk restore point. This process is described in the ["Create a disk"](#create-a-disk-using-disk-restore-points) section. After all disks are restored, create a new VM and attach the restored disks to the new VM.

## Get a shared access signature for a disk

To create a shared access signature (SAS) for a disk within a VM restore point, pass the ID of the disk restore points via the `BeginGetAccess` API. If no active SAS exists on the restore point snapshot, a new SAS will be created. The new SAS URL will be returned in the response. If an active SAS already exists, the SAS duration will be extended and the pre-existing SAS URL will be returned in the response.

For more information about granting access to snapshots, see the [Grant Access](/rest/api/compute/snapshots/grant-access) API documentation.

## Next steps

Do something awesome.