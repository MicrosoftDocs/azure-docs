---
title: Change the service level of an Azure NetApp Files cache volume
description: Learn about the benefits of changing the service level of an Azure NetApp Files cache volume within your NetApp account.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 04/10/2026
ms.author: anfdocs
ms.custom: sfi-image-nochange

---
# Change the service level of an Azure NetApp Files cache volume

You can change the service level of an existing cache volume by moving the cache volume to another capacity pool in the same NetApp account that uses the [service level](azure-netapp-files-service-levels.md) you want for the cache volume. This in-place service-level change for the volume doesn't require that you migrate data. It also doesn't affect access to the cache volume. 

This functionality enables you to meet your workload needs on demand. You can change an existing cache volume to use a higher service level for better performance, or to use a lower service level for cost optimization. For example, if the cache volume is in a capacity pool that uses the *Standard* service level and you want the cache volume to use the *Premium* service level, you can move the cache volume dynamically to a capacity pool that uses the *Premium* service level. 

The capacity pool that you want to move the cache volume to must already exist and have sufficient capacity and throughput. The capacity pool can contain other cache volumes and cache volumes. If you want to move the cache volume to a brand-new capacity pool, you need to [create the capacity pool](azure-netapp-files-set-up-capacity-pool.md) before you move the cache volume. 

## Considerations

* Dynamically changing the service level of a cache volume is supported within the same NetApp account. You can't move the cache volume to a capacity pool in a different NetApp Account.

* You can't convert a Flexible service level capacity pool to Standard, Premium, or Ultra. Standard, Premium, and Ultra service level capacity pools can't be converted to the Flexible service level.

* After the cache volume is moved to another capacity pool, you no longer have access to previous cache volume metrics. The cache volume starts with new metrics under the new capacity pool.

* The encryption type of the target pool must match the encryption type of the current pool.

* If you move a cache volume to a capacity pool of a higher service level (for example, moving from *Standard* to *Premium* or *Ultra* service level), you must wait at least 24 hours before you can move that cache volume *again* to a capacity pool of a lower service level (for example, moving from *Ultra* to *Premium* or *Standard*). You can always change to higher service level without wait time.

* If the target capacity pool is of the *manual* QoS type, the cache volume's throughput isn't changed with the cache volume move. You can [modify the allotted throughput](manage-manual-qos-capacity-pool.md#modify-the-allotted-throughput-of-a-manual-qos-volume) in the target manual capacity pool.

* Regardless of the source pool’s QoS type, when the target pool is of the *auto* QoS type, the cache volume's throughput is changed with the move to match the service level of the target capacity pool.

* If you're using a custom IAM role with an Azure NetApp Files datastore for Azure VMware Service, ensure you have the correct permissions to update the service level. For specific permissions, see [prerequisites](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md#prerequisites).
 
## Move a cache volume to another capacity pool

1. Run the following command to move a cache volume to another capacity pool:

    ```
    POST
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/caches/{cacheName}/poolChange?api-version=2026-01-01

    Body:
    {
    "newPoolResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupOfNewPool}/providers/Microsoft.NetApp/netAppAccounts/{accountNameOfNewPool}/capacityPools/{targetPool}"
    }
    
    ```

## Next steps  

* [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
* [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Manage the allotted throughput of a manual QoS volume](manage-manual-qos-capacity-pool.md#modify-the-allotted-throughput-of-a-manual-qos-volume)
* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
* [Troubleshoot issues for changing the capacity pool of a volume](troubleshoot-capacity-pools.md#issues-when-changing-the-capacity-pool-of-a-volume)
