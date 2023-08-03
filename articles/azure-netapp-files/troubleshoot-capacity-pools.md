---
title: Troubleshoot capacity pool errors for Azure NetApp Files | Microsoft Docs
description: Describes potential issues you might have when managing capacity pools and provides solutions for the issues. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 04/18/2022
ms.author: anfdocs
---
# Troubleshoot capacity pool errors

This article describes resolutions to issues you might have when managing capacity pools, including the pool change operation. 

## Issues managing a capacity pool 

|     Error condition    |     Resolution    |
|-|-|
| Issues creating a capacity pool |  Make sure that the capacity pool count does not exceed the limit. See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md).  If the count is less than the limit and you still experience issues, file a support ticket and specify the capacity pool name. |
| Issues deleting a capacity pool  |  Make sure that you remove all Azure NetApp Files volumes and snapshots in the subscription where you're trying to delete the capacity pool. <br> If you already removed all volumes and snapshots and you still cannot delete the capacity pool, references to resources might still exist without showing in the portal. In this case, file a support ticket, and specify that you've performed the above recommended steps. |
| Volume creation or modification fails with `Requested throughput not available` error | Available throughput for a volume is determined by its capacity pool’s size and the service level. If you do not have sufficient throughput, you should increase the pool size or adjust the existing volume throughput. | 

## Issues when changing the capacity pool of a volume 

|     Error condition    |     Resolution    |
|-|-|
| The capacity pool size is too small for total volume size. |  The error is a result of the destination capacity pool not having the available capacity for the volume being moved.  <br> Increase the size of the destination pool, or choose another pool that is larger.  See [Resize a capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md).   |
|  The pool change cannot be completed because a volume called `'{source pool name}'` already exists in the target pool `'{target pool name}'` | This error occurs because the volume with same name already exists in the target capacity pool.  Select another capacity pool that does not have a volume with same name.   | 
| Error changing volume's pool. Pool: `'{target pool name}'` not available or does not exit | You cannot change a volume's capacity pool when the destination capacity pool is not healthy. Check the status of the destination capacity pool. If the pool is in a failed state (not "Succeeded"), try performing an update on the capacity pool by adding a tag name and value pair, then save. |
| Cannot change the volume's pool because the selected pool is the same as the existing pool: `'{Pool Name}'` | Confirm you're moving the volume to the correct destination capacity pool and try again. |
| Cannot change a volume from a Double Encrypted Pool to a Single Encrypted Pool or from a Single Encrypted Pool to a Double Encrypted Pool | The destination pool must be of the same encryption type as the source pool. |

## Issues for double-encryption capacity pools  

|     Error condition    |     Resolution    |
|-|-|
| Out of storage capacity when creating or resizing volumes under double-encryption capacity pools: `There are currently insufficient resources available to create [or extend] a volume in this region. Please retry the operation. If the problem persists, contact Support.` |  The error indicates insufficient resources in the region to support hardware-level data encryption. Retry the operation after some time. Resources may have been freed in the cluster, region, or zone in the interim.  |

## Next steps  

* [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
* [Dynamically change the service level of a volume](dynamic-change-volume-service-level.md)
* [Resize a capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md)
