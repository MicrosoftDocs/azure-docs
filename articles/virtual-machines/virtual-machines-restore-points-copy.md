---
title: Use cross-region copy of virtual machine restore points
description: Learn how to use cross-region copy of virtual machine (VM) restore points.
author: aarthiv
ms.author: aarthiv
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 11/2/2023
ms.custom: conceptual
---

# Overview of cross-region copy of VM restore points (in preview)

Azure virtual machine (VM) restore point APIs are a lightweight option you can use to implement granular backup and retention policies. VM restore points support application consistency and crash consistency (in preview). You can copy a VM restore point from one region to another region. This capability can help you build business continuity and disaster recovery solutions for Azure VMs.

Scenarios where this API can be helpful:

* Extend multiple copies of restore points to different regions.
* Extend local restore point solutions to support disaster recovery from region failures.

> [!NOTE]
> To copy a restore point across a region, you need to precreate a `RestorePointCollection` resource in the target region.

## Limitations

* Private links aren't supported when you copy restore points across regions or create restore points in a region other than the source VM.
* Azure confidential VMs aren't supported.
* The API version for a cross-region copy of the VM restore point feature is 2021-03-01, or later.
* Copy of a copy isn't supported. You can't copy a restore point that was already copied from another region. For example, if you copied RP1 from East US to West US as RRP1, you can't copy RRP1 from West US to another region (or back to East US).
* Multiple copies of the same restore point in a single target region aren't supported. A single restore point in the source region can be copied only once to a target region.
* Copying a restore point that's CMK encrypted in the source is encrypted by using CMK in the target region. This feature is currently in preview.
* The target restore point only shows the creation time when the source restore point was created.
* Currently, the replication progress is updated every 10 minutes. For disks that have low churn, there can be scenarios where only the initial (0) and the final replication progress (100) appear.
* The maximum copy time supported is two weeks. For a huge amount of data to be copied to a target region, depending on the bandwidth available between the regions, the copy time could be a couple of days. If the copy time exceeds two weeks, the copy operation is terminated automatically.
* No error details are provided when a disk restore point copy fails.
* When a disk restore point copy fails, the intermediate completion percentage where the copy failed isn't shown.
* Restoring a disk from the restore point doesn't automatically check if the disk restore point replication is completed. You need to manually check the percent completion if the replication status is 100% and then start restoring the disk.
* Restore points that are copied to the target region don't have a reference to the source VM. They have a reference to the source restore points. So, if the source restore point is deleted, there's no way to identify the source VM by using the target restore points.
* Copying restore points in a nonsequential order isn't supported. For example, you might have the three restore points RP1, RP2, and RP3. If you already successfully copied RP1 and RP3, you aren't allowed to copy RP2.
* The full snapshot on the source side should always exist and can't be deleted to save cost. For example, if RP1 (full snapshot), RP2 (incremental), and RP3 (incremental) exist in the source and are successfully copied to the target, you can delete RP2 and RP3 on the source side to save cost. Deleting RP1 on the source side results in creating a full snapshot, say RRP1, the next time, and copying also results in a full snapshot. The storage layer maintains the relationship with each pair of source and target snapshot that needs to be preserved.

## Troubleshoot VM restore points

Most common restore point failures are attributed to the communication with the VM agent and extension. To resolve failures, follow the steps in [Troubleshoot restore point failures](restore-point-troubleshooting.md).

## Next steps

- [Copy a VM restore point](virtual-machines-copy-restore-points-how-to.md).
- [Learn more](backup-recovery.md) about backup and restore options for VMs in Azure.
