---
title: Dynamically change the service level of an Azure NetApp Files volume
description: Learn about the benefits of changing the service level of an Azure NetApp Files volume within your NetApp account.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 09/27/2024
ms.author: anfdocs
---
# Dynamically change the service level of an Azure NetApp Files volume

You can change the service level of an existing volume by moving the volume to another capacity pool in the same NetApp account that uses the [service level](azure-netapp-files-service-levels.md) you want for the volume. This in-place service-level change for the volume doesn't require that you migrate data. It also doesn't affect access to the volume. 

This functionality enables you to meet your workload needs on demand. You can change an existing volume to use a higher service level for better performance, or to use a lower service level for cost optimization. For example, if the volume is in a capacity pool that uses the *Standard* service level and you want the volume to use the *Premium* service level, you can move the volume dynamically to a capacity pool that uses the *Premium* service level. 

The capacity pool that you want to move the volume to must already exist. The capacity pool can contain other volumes. If you want to move the volume to a brand-new capacity pool, you need to [create the capacity pool](azure-netapp-files-set-up-capacity-pool.md) before you move the volume. 

## Considerations

* Dynamically changing the service level of a volume is supported within the same NetApp account. You can't move the volume to a capacity pool in a different NetApp Account.

* After the volume is moved to another capacity pool, you no longer have access to the previous volume activity logs and volume metrics. The volume starts with new activity logs and metrics under the new capacity pool.

* If you move a volume to a capacity pool of a higher service level (for example, moving from *Standard* to *Premium* or *Ultra* service level), you must wait at least 24 hours before you can move that volume *again* to a capacity pool of a lower service level (for example, moving from *Ultra* to *Premium* or *Standard*). You can always change to higher service level without wait time.

* If the target capacity pool is of the *manual* QoS type, the volume's throughput isn't changed with the volume move. You can [modify the allotted throughput](manage-manual-qos-capacity-pool.md#modify-the-allotted-throughput-of-a-manual-qos-volume) in the target manual capacity pool.

* Regardless of the source pool’s QoS type, when the target pool is of the *auto* QoS type, the volume's throughput is changed with the move to match the service level of the target capacity pool.

* If you use cool access, see [Manage Azure NetApp Files storage with cool access](manage-cool-access.md#considerations) for more considerations. 
 
## Move a volume to another capacity pool

1.	On the Volumes page, right-click the volume whose service level you want to change. Select **Change Pool**.

    ![Right-click volume](./media/dynamic-change-volume-service-level/right-click-volume.png)

2. In the Change pool window, select the capacity pool you want to move the volume to. 

    ![Change pool](./media/dynamic-change-volume-service-level/change-pool.png)

3.	Select **OK**.

## Next steps  

* [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
* [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Manage the allotted throughput of a manual QoS volume](manage-manual-qos-capacity-pool.md#modify-the-allotted-throughput-of-a-manual-qos-volume)
* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
* [Troubleshoot issues for changing the capacity pool of a volume](troubleshoot-capacity-pools.md#issues-when-changing-the-capacity-pool-of-a-volume)
