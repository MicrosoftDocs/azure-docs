---
title: Create Virtual Machine restore points
description: Creating Virtual Machine Restore Points with API
author: mamccrea
ms.author: mamccrea
ms.service: virtual-machines
ms.subservice: recovery
ms.date: 02/14/2022
ms.topic: quickstart 
ms.custom: template-quickstart 
---

# Quickstart: Create VM restore points using APIs

You can protect your data by taking backups at regular intervals. Azure VM restore point APIs are a lightweight option you can use to implement granular backup and retention policies. VM restore points support application consistency for VMs running Windows operating systems and support file system consistency for VMs running Linux operating system. 

You can use the APIs to create restore points for your source VM in either the same region, or in other regions. You can also copy existing VM restore points between regions.

## Prerequisites

- [Learn more](concepts-restore-points.md) about the requirements for a VM restore point.
- Consider the [limitations](virtual-machines-create-restore-points.md#limitations) before creating a restore point.

## Create VM restore points

The following sections outline the steps you need to take to create VM restore points with the Azure Compute REST APIs.

You can find more information in the [Restore Points](/rest/api/compute/restore-points), [PowerShell](/powershell/module/az.compute/new-azrestorepoint), and [Restore Point Collections](/rest/api/compute/restore-point-collections) API documentation.

### Step 1: Create a VM restore point collection

Before you create VM restore points, you must create a restore point collection. A restore point collection holds all the restore points for a specific VM. Depending on your needs, you can create VM restore points in the same region as the VM, or in a different region.
To create a restore point collection, call the restore point collection's Create or Update API. 
- If you're creating restore point collection in the same region as the VM, then specify the VM's region in the location property of the request body. 
- If you're creating the restore point collection in a different region than the VM, specify the target region for the collection in the location property, but also specify the source restore point collection ARM resource ID in the request body.
 
To create a restore point collection, call the restore point collection's [Create or Update](/rest/api/compute/restore-point-collections/create-or-update) API.

### Step 2: Create a VM restore point

After you create the restore point collection, the next step is to create a VM restore point within the restore point collection. For more information about restore point creation, see the [Restore Points - Create](/rest/api/compute/restore-points/create) API documentation. For creating crash consistent restore points (in preview) "consistencyMode" property has to be set to "CrashConsistent" in the creation request. 

> [!TIP]
> To save space and costs, you can exclude any disk from either local region or cross-region VM restore points. To exclude a disk, add its identifier to the `excludeDisks` property in the request body.

### Step 3: Track the status of the VM restore point creation

Restore point creation in your local region will be completed within a few seconds. Scenarios, which involve the creation of cross-region restore points will take considerably longer. To track the status of the creation operation, follow the guidance in [Get restore point copy or replication status](#get-restore-point-copy-or-replication-status). This is only applicable for scenarios where the restore points are created in a different region than the source VM.

## Get restore point copy or replication status

Copying the first VM restore point to another region is a long running operation. The VM restore point can be used to restore a VM only after the operation is completed for all disk restore points. To track the operation's status, call the [Restore Point - Get](/rest/api/compute/restore-points/get) API on the target VM restore point and include the `instanceView` parameter. The return will include the percentage of data that has been copied at the time of the request.

During restore point creation, the `ProvisioningState` will appear as `Creating` in the response. If creation fails, `ProvisioningState` is set to `Failed`.

## Next steps
- [Learn more](manage-restore-points.md) about managing restore points.
- Create restore points using the [Azure portal](virtual-machines-create-restore-points-portal.md), [CLI](virtual-machines-create-restore-points-cli.md), or [PowerShell](virtual-machines-create-restore-points-powershell.md).
- [Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.