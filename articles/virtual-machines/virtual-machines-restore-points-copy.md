---
title: Using cross-region copy of virtual machine restore points
description: Using cross-region copy of virtual machine restore points
author: aarthiv
ms.author: aarthiv
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 11/2/2023
ms.custom: conceptual
---

# Overview of Cross-region copy VM restore points (in preview)
Azure VM restore point APIs are a lightweight option you can use to implement granular backup and retention policies. VM restore points support application consistency and crash consistency (in preview). You can copy a VM restore point from one region to another region. This capability would help our partners to build BCDR solutions for Azure VMs.
Scenarios where this API can be helpful:
* Extend multiple copies of restore points to different regions
* Extend local restore point solutions to support disaster recovery from region failures

> [!NOTE]
> For copying a RestorePoint across region, you need to pre-create a RestorePointCollection in the target region.

## Limitations

* Private links aren't supported when copying restore points across regions or creating restore points in a region other than the source VM.
* Azure Confidential Virtual Machines 's not supported.
* API version for Cross Region Copy of VM Restore Point feature is: '2021-03-01' or later.
* Copy of copy isn't supported. You can't copy a restore point that is already copied from another region. For ex. If you copied RP1 from East US to West US as RRP1. You can't copy RRP1 from West US to another region (or back to East US).
* Multiple copies of the same restore point in a single target region aren't supported. A single Restore Point in the source region can only be copied once to a target region.
* Copying a restore point that is CMK encrypted in source will be encrypted using CMK in target region. This feature is currently in preview.
* Target Restore Point only shows the creation time when the source Restore Point was created.
* Currently, the replication progress is updated every 10 mins. Hence for disks that have low churn, there can be scenarios where only the initial (0) and the final replication progress (100) can be seen.
* Maximum copy time that is supported is two weeks. For huge amount of data to be copied to target region, depending on the bandwidth available between the regions, the copy time could be couple of days. If the copy time exceeds two weeks, the copy operation is terminated automatically.
* No error details are provided when a Disk Restore Point copy fails.
* When a disk restore point copy fails,  intermediate completion percentage where the copy failed isn't shown.
* Restoring of Disk from Restore point doesn't automatically check if the disk restore points replication is completed. You need to manually check the percentcompletion of replication status is 100%  and then start restoring the disk.
* Restore points that are copied to the target region don't have a reference to the source VM. They have reference to the source Restore points. So, If the source Restore point is deleted there's no way to identify the source VM using the target Restore points.
* Copying of restore points in a non-sequential order isn't supported. For example, if you have three restore points RP1, RP2 and RP3. If you have already successfully copied RP1 and RP3, you won't be allowed to copy RP2.
* The full snapshot on source side should always exist and can't be deleted to save cost. For example if RP1 (full snapshot), RP2 (incremental) and RP3 (incremental) exists in source and are successfully copied to target you can delete RP2 and RP3 on source side to save cost. Deleting the RP1 in the source side will result in creating a full snapshot say RRP1 the next time and copying will also result in a full snapshot. This is because our storage layer maintains the relationship with each pair of source and target snapshot that needs to be preserved.

## Troubleshoot VM restore points
Most common restore points failures are attributed to the communication with the VM agent and extension, and can be resolved by following the troubleshooting steps listed in the [troubleshooting](restore-point-troubleshooting.md) article.

## Next steps

- [Copy a VM restore point](virtual-machines-copy-restore-points-how-to.md).
- [Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
