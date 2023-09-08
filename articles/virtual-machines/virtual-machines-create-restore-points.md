---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: mamccrea
ms.author: mamccrea
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 02/14/2022
ms.custom: conceptual
---

# Overview of VM restore points

Business continuity and disaster recovery (BCDR) solutions are primarily designed to address site-wide data loss. Solutions that operate at this scale will often manage and execute automated failovers and failbacks across multiple regions. Azure VM restore points can be used to implement granular backup and retention policies.

You can protect your data and guard against extended downtime by creating virtual machine (VM) restore points at regular intervals. There are several backup options available for virtual machines (VMs), depending on your use-case. For more information, see [Backup and restore options for virtual machines in Azure](backup-recovery.md).

## About VM restore points

An individual VM restore point is a resource that stores VM configuration and point-in-time application consistent snapshots of all the managed disks attached to the VM. You can use VM restore points to easily capture multi-disk consistent backups.  VM restore points contain a disk restore point for each of the attached disks and a disk restore point consists of a snapshot of an individual managed disk.

VM restore points supports both application consistency and crash consistency (in preview).
Application consistency is supported for VMs running Windows operating systems and support file system consistency for VMs running Linux operating system. Application consistent restore points use VSS writers (or pre/post scripts for Linux) to ensure the consistency of the application data before a restore point is created. To get an application consistent restore point, the application running in the VM needs to provide a VSS writer (for Windows), or pre and post scripts (for Linux) to achieve application consistency.

Crash consistent VM restore point stores the VM configuration and point-in-time write-order consistent snapshots for all managed disks attached to a Virtual Machine. This is same as the status of data in the VM after a power outage or a crash. "consistencyMode" optional parameter has to be set to "crashConsistent" in the creation request. This feature is currently in preview.

VM restore points are organized into restore point collections. A restore point collection is an Azure Resource Management resource that contains the restore points for a specific VM. If you want to utilize ARM templates for creating restore points and restore point collections, visit the public [Virtual-Machine-Restore-Points](https://github.com/Azure/Virtual-Machine-Restore-Points) repository on GitHub.

The following image illustrates the relationship between restore point collections, VM restore points, and disk restore points.

:::image type="content" source="media/virtual-machines-create-restore-points-api/restore-point-hierarchy.png" alt-text="A diagram illustrating the relationship between the restore point collection parent and the restore point child objects.":::

VM restore points are incremental. The first restore point stores a full copy of all disks attached to the VM. For each successive restore point for a VM, only the incremental changes to your disks are backed up. To reduce your costs, you can optionally exclude any disk when creating a restore point for your VM.

## Restore points for VMs inside Virtual Machine Scale Set and Availability Set (AvSet)

Currently, restore points can only be created in one VM at a time, that is, you cannot create a single restore point across multiple VMs. Due to this limitation, we currently support creating restore points for individual VMs with a Virtual Machine Scale Set in Flexible Orchestration mode, or Availability Set. If you want to back up instances within a Virtual Machine Scale Set instance or your Availability Set instance, you must individually create restore points for all the VMs that are part of the instance.

> [!Note]
> Virtual Machine Scale Set with Uniform orchestration is not supported by restore points. You cannot create restore points of VMs inside a Virtual Machine Scale Set with Uniform orchestration.


## Limitations

- Restore points are supported only for managed disks. 
- Ultra-disks, Ephemeral OS disks, and Shared disks are not supported. 
- API version for application consistent restore point is 2021-03-01 or later.
- API version for crash consistent restore point is 2021-07-01 or later. (in preview)
- A maximum of 500 VM restore points can be retained at any time for a VM, irrespective of the number of restore point collections. 
- Concurrent creation of restore points for a VM is not supported. 
- Restore points for Virtual Machine Scale Sets in Uniform orchestration mode are not supported. 
- Movement of Virtual Machines (VM) between Resource Groups (RG), or Subscriptions is not supported when the VM has restore points. Moving the VM between Resource Groups or Subscriptions will not update the source VM reference in the restore point and will cause a mismatch of ARM IDs between the actual VM and the restore points. 
 > [!Note]
 > Public preview of cross-region creation and copying of VM restore points is available, with the following limitations: 
 > - Private links are not supported when copying restore points across regions or creating restore points in a region other than the source VM. 
 > - Customer-managed key encrypted restore points, when copied to a target region or created directly in the target region are created as platform-managed key encrypted restore points.

## Troubleshoot VM restore points
Most common restore points failures are attributed to the communication with the VM agent and extension, and can be resolved by following the troubleshooting steps listed in the [troubleshooting](restore-point-troubleshooting.md) article.

## Next steps

- [Create a VM restore point](create-restore-points.md).
- [Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
