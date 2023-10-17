---
title: Using cross region copy VM Restore Points
description: Using cross region copy VM Restore Points
author: Aarthi-Vijaya-raghavan
ms.author: Aarthi-Vijaya-raghavan
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 10/17/2023
ms.custom: conceptual
---

# Overview of Cross-region copy VM restore points (in preview)

As an extension to VM Restore Points we are providing additional functionality within Azure platform to enable our partners to build BCDR solutions for Azure VMs. One such functionality is the ability to copy VM Restore Points from one region to another other region.

Scenarios where this API can be helpful:

- Extend multiple copies of backup to different regions
- Extend local backup solutions to support disaster recovery from region failures

> [!NOTE]
> For copying a RestorePoint across region, you need to pre-create a RestorePoint in the target region.

## Limitations

- API version for Cross Region Copy of VM Restore Point feature is : '2021-03-01' or later.
- Copy of copy is not supported. You cannot copy a restore point that is already copied from another region. For ex. if you have copied a RP1 from East US to West US as RRP1. You cannot copy RRP1 from West US to another region (or back to East US).
- Multiple copies of the same restore point in a single target region is not supported. A single Restore Point in the source region can only be copied once to a target region.
- Copying a Restore point which is CMK encrypted in the source will be encrypted using PMK in the target region. You need to use CMK when restoring the disks and VM from the restore point.
- Target Restore Point only shows the creation time when the target Restore Point was created. To get the creation time of the original restore point, you need to call GET on the original restore point. 
- Currently, the replication progress is updated every 10mins. Hence for disks that have low churn, there can be scenarios where only the initial (0) and the final replication progress (100) can be seen.
- Maximum copy time that is supported is 2 weeks. If there is huge amount data to be copied to the target region, depending on the bandwidth available between the regions, the copy time could be couple of days. If the copy time exceeds 2 weeks, the copy operation will be terminated automatically.
- No error details are provided when a Disk Restore Point copy fails.
- When a disk restore point copy fails,  intermediate completion percentage where the copy failed is not shown.
- Restoring of Disk from Restore point does not automatically check if the disk restore points replication is completed. You need to manually check the percentcompletion of replication status is 100%  and then start restoring the disk.
- Restore points that are copied to the target region do not have a reference to the source VM. They have reference to the source Restore points. So, If the source Restore point is deleted there is no way to identify the source VM using the target Restore points.
- Out of order copying of Restore Points is not supported. Meaning, if you have 3 restore points - RP1, RP2, RP3. If you have copied RP1 and RP3 to target region, you cannot copy RP2. 
- The full snapshot on source side should always exist and cannot be deleted to save cost. For example if RP1 (full snapshot), RP2 (incremental) and RP3 (incremental) exists in source and are successfully copied to target you can delete RP2 and RP3 on source side to save cost. Deleting the RP1 in the source side will result in creating a full snapshot say RRP1 the next time and copying will also result in a full snapshot. This is because our storage layer maintains the relationship with each pair of source and target snapshot which needs to be preserved.

## Troubleshoot VM restore points
Most common restore points failures are attributed to the communication with the VM agent and extension, and can be resolved by following the troubleshooting steps listed in the [troubleshooting](restore-point-troubleshooting.md) article.

## Next steps

- [Copy a VM restore point](virtual-machines-copy-restore-points-how-to.md).
- [Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
