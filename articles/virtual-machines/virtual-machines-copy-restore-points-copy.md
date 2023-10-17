---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: aarthiv
ms.author: aarthiv
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: conceptual
ms.date: 02/14/2022
ms.custom: conceptual
---

# Overview of Cross-region copy VM restore points (in preview)

As an extension to VM Restore Points we are providing additional functionality within Azure platform to enable our partners to build BCDR solutions for Azure VMs. One such functionality is the ability to copy VM Restore Points from one region to another other region.

Scenarios where this API can be helpful:

* Extend multiple copies of backup to different regions
* Extend local backup solutions to support disaster recovery from region failures

> [!NOTE]
> For copying a RestorePoint across region, you need to pre-create a RestorePoint in the local region.

## Cross region copy of VM restore points (in preview)

### Create Restore Point Collection in target region

First step in copying an existing VM Restore point from one region to another is to create a RestorePointCollection in the target region by referencing the RestorePointCollection from the source region.

#### URI Request

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/restorePointCollections/{restorePointCollectionName}&api-version={api-version}
```
#### Request Body
```
{
    "name": "name of the copy of restorePointCollection resource",
    "location": "location of the copy of the restorePointCollection resource",    
    "tags": {
        "department": "finance"
    },
    "properties": {
         "source": {
               "id": "/subscriptions/{subid}/resourceGroups/{resourceGroupName}/providers/microsoft.compute/restorePointCollections/{restorePointCollectionName}"
         }
    }
}
```



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

- [Copy a VM restore point](virtual-machines-copy-restore-points-how-to.md).
- [Learn more](backup-recovery.md) about Backup and restore options for virtual machines in Azure.
