---
title: Use virtual machine restore points
description: Learn how to use virtual machine restore points.
author: aarthiv
ms.author: aarthiv
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 11/06/2023
ms.custom: conceptual
---

# Overview of VM restore points

Business continuity and disaster recovery solutions are primarily designed to address sitewide data loss. Solutions that operate at this scale often manage and run across automated failovers and failbacks in multiple regions. You can use Azure virtual machine (VM) restore points to implement granular backup and retention policies.

You can protect your data and guard against extended downtime by creating VM restore points at regular intervals. There are several backup options available for VMs, depending on your use case. For more information, see [Backup and restore options for VMs in Azure](backup-recovery.md).

## About VM restore points

An individual VM restore point is a resource that stores VM configuration and point-in-time application-consistent snapshots of all the managed disks attached to the VM. You can use VM restore points to easily capture multidisk-consistent backups. VM restore points contain a disk restore point for each of the attached disks. A disk restore point consists of a snapshot of an individual managed disk.

VM restore points support both application consistency and crash consistency (in preview). Fill out this [form](https://forms.office.com/r/LjLBt6tJRL) if you want to try crash-consistent restore points in preview.

Application consistency is supported for VMs running Windows operating systems and support file system consistency for VMs running Linux operating systems. Application-consistent restore points use Volume Shadow Copy Service (VSS) writers (or pre- and postscripts for Linux) to ensure the consistency of the application data before a restore point is created. To get an application-consistent restore point, the application running in the VM needs to provide a VSS writer (for Windows) or pre- and postscripts (for Linux) to achieve application consistency.

A multidisk crash-consistent VM restore point stores the VM configuration and point-in-time write-order-consistent snapshots for all managed disks attached to a VM. This information is the same as the status of data in the VM after a power outage or a crash. The `consistencyMode` optional parameter has to be set to `crashConsistent` in the creation request. This feature is currently in preview.

> [!NOTE]
> For disks configured with read/write host caching, multidisk crash consistency can't be guaranteed because writes that occur while the snapshot is taken might not be acknowledged by Azure Storage. If maintaining consistency is crucial, we recommend that you use the application-consistency mode.

VM restore points are organized into restore point collections. A restore point collection is an Azure Resource Manager resource that contains the restore points for a specific VM. If you want to utilize Azure Resource Manager templates (ARM templates) for creating restore points and restore point collections, see the public [Virtual-Machine-Restore-Points](https://github.com/Azure/Virtual-Machine-Restore-Points) repository in GitHub.

The following image illustrates the relationship between restore point collections, VM restore points, and disk restore points.

:::image type="content" source="media/virtual-machines-create-restore-points-api/restore-point-hierarchy.png" alt-text="A diagram that shows the relationship between the restore point collection parent and the restore point child objects.":::

VM restore points are incremental. The first restore point stores a full copy of all disks attached to the VM. For each successive restore point for a VM, only the incremental changes to your disks are backed up. To reduce your costs, you can optionally exclude any disk when you create a restore point for your VM.

## Restore points for VMs inside virtual machine scale set and availability set (AvSet)

Currently, you can create restore points in only one VM at a time. You can't create a single restore point across multiple VMs. Because of this limitation, we currently support creating restore points for individual VMs with a virtual machine scale set in Flexible Orchestration mode or an availability set. If you want to back up instances within a virtual machine scale set instance or your availability set instance, you must individually create restore points for all the VMs that are part of the instance.

> [!NOTE]
> A virtual machine scale set with Uniform orchestration isn't supported by restore points. You can't create restore points of VMs inside a virtual machine scale set with Uniform orchestration.

## Limitations

- Restore points are supported only for managed disks.
- Ultra-disks, ephemeral OS disks, and shared disks aren't supported.
- The API version for an application-consistent restore point is March 1, 2021, or later.
- The API version for a crash-consistent restore point is July 1, 2021, or later (in preview).
- A maximum of 500 VM restore points can be retained at any time for a VM, irrespective of the number of restore point collections.
- Concurrent creation of restore points for a VM isn't supported.
- Restore points for virtual machine scale sets in Uniform orchestration mode aren't supported.
- Movement of VMs between resource groups or subscriptions isn't supported when the VM has restore points. Moving the VM between resource groups or subscriptions doesn't update the source VM reference in the restore point and causes a mismatch of Resource Manager IDs between the actual VM and the restore points.

 > [!NOTE]
 > Public preview of cross-region copying of VM restore points is available, with the following limitations:
 >
 > - Private links aren't supported when you copy restore points across regions or create restore points in a region other than the source VM.
 > - Customer-managed key encrypted restore points, when copied to a target region, are created as platform-managed key encrypted restore points.

## Troubleshoot VM restore points

Most common restore point failures are attributed to the communication with the VM agent and extension. To resolve failures, follow the steps in [Troubleshoot restore point failures](restore-point-troubleshooting.md).

## Next steps

- [Create a VM restore point](create-restore-points.md).
- [Learn more](backup-recovery.md) about backup and restore options for VMs in Azure.
- [Learn more](virtual-machines-restore-points-vm-snapshot-extension.md) about the extensions used with application consistency mode.
- [Learn more](virtual-machines-restore-points-copy.md) about how to copy VM restore points across regions.
