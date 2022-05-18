---
title: Storage hierarchy of Azure NetApp Files | Microsoft Docs
description: Describes the storage hierarchy, including Azure NetApp Files accounts, capacity pools, and volumes.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: overview
ms.date: 06/14/2021
ms.author: anfdocs
---
# Storage hierarchy of Azure NetApp Files

Before creating a volume in Azure NetApp Files, you must purchase and set up a pool for provisioned capacity.  To set up a capacity pool, you must have a NetApp account. Understanding the storage hierarchy helps you set up and manage your Azure NetApp Files resources.

> [!IMPORTANT] 
> Azure NetApp Files currently does not support resource migration between subscriptions.

## <a name="azure_netapp_files_account"></a>NetApp accounts

- A NetApp account serves as an administrative grouping of the constituent capacity pools.  
- A NetApp account is not the same as your general Azure storage account. 
- A NetApp account is regional in scope.   
- You can have multiple NetApp accounts in a region, but each NetApp account is tied to only a single region.

## <a name="capacity_pools"></a>Capacity pools

Understanding how capacity pools work helps you select the right capacity pool types for your storage needs. 

### General rules of capacity pools

- A capacity pool is measured by its provisioned capacity.   
    See [QoS types](#qos_types) for additional information.  
- The capacity is provisioned by the fixed SKUs that you purchased (for example, a 4-TiB capacity).
- A capacity pool can have only one service level.  
- Each capacity pool can belong to only one NetApp account. However, you can have multiple capacity pools within a NetApp account.  
- A capacity pool cannot be moved across NetApp accounts.   
  For example, in the [Conceptual diagram of storage hierarchy](#conceptual_diagram_of_storage_hierarchy) below, Capacity Pool 1 cannot be moved from US East NetApp account to US West 2 NetApp account.  
- A capacity pool cannot be deleted until all volumes within the capacity pool have been deleted.

### <a name="qos_types"></a>Quality of Service (QoS) types for capacity pools

The QoS type is an attribute of a capacity pool. Azure NetApp Files provides two QoS types of capacity pools -- *auto (default)* and *manual*. 

#### *Automatic (or auto)* QoS type  

When you create a capacity pool, the default QoS type is auto.

In an auto QoS capacity pool, throughput is assigned automatically to the volumes in the pool, proportional to the size quota assigned to the volumes. 

The maximum throughput allocated to a volume depends on the service level of the capacity pool and the size quota of the volume. See [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md) for example calculation.

For performance considerations about QoS types, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

#### *Manual* QoS type  

When you [create a capacity pool](azure-netapp-files-set-up-capacity-pool.md), you can specify for the capacity pool to use the manual QoS type. You can also [change an existing capacity pool](manage-manual-qos-capacity-pool.md#change-to-qos) to use the manual QoS type. *Setting the capacity type to manual QoS is a permanent change.* You cannot convert a manual QoS type capacity tool to an auto QoS capacity pool. 

In a manual QoS capacity pool, you can assign the capacity and throughput for a volume independently. For minimum and maximum throughput levels, see [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits). The total throughput of all volumes created with a manual QoS capacity pool is limited by the total throughput of the pool.  It is determined by the combination of the pool size and the service-level throughput.  For instance, a 4-TiB capacity pool with the Ultra service level has a total throughput capacity of 512 MiB/s (4 TiB x 128 MiB/s/TiB) available for the volumes.

##### Example of using manual QoS

When you use a manual QoS capacity pool with, for example, an SAP HANA system, an Oracle database, or other workloads requiring multiple volumes, the capacity pool can be used to create these application volumes.  Each volume can provide the individual size and throughput to meet the application requirements.  See [Throughput limit examples of volumes in a manual QoS capacity pool](azure-netapp-files-service-levels.md#throughput-limit-examples-of-volumes-in-a-manual-qos-capacity-pool) for details about the benefits.  

## <a name="volumes"></a>Volumes

- A volume is measured by logical capacity consumption and is scalable. 
- A volume's capacity consumption counts against its pool's provisioned capacity.
- A volume’s throughput consumption counts against its pool’s available throughput. See [Manual QoS type](#manual-qos-type).
- Each volume belongs to only one pool, but a pool can contain multiple volumes. 

## <a name="conceptual_diagram_of_storage_hierarchy"></a>Conceptual diagram of storage hierarchy 
The following example shows the relationships of the Azure subscription, NetApp accounts, capacity pools,  and volumes.   

![Conceptual diagram of storage hierarchy](../media/azure-netapp-files/azure-netapp-files-storage-hierarchy.png)

## Next steps

- [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
- [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
- [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
