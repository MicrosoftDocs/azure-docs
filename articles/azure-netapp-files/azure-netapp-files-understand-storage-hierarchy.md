---
title: Storage hierarchy of Azure NetApp Files
description: Describes the storage hierarchy, including Azure NetApp Files accounts, capacity pools, and volumes.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: overview
ms.date: 1/29/2026
ms.author: anfdocs
# Customer intent: "As a cloud architect, I want to understand the storage hierarchy of Azure NetApp Files, so that I can effectively set up and manage capacity pools and volumes to meet our storage needs."
---
# Storage hierarchy of Azure NetApp Files

Before creating a volume in Azure NetApp Files, you must purchase and set up a pool for provisioned capacity. To set up a capacity pool, you must have a NetApp account. Understanding the storage hierarchy helps you set up and manage your Azure NetApp Files resources.

> [!IMPORTANT] 
> Azure NetApp Files currently doesn't support resource migration between subscriptions.

## <a name="conceptual_diagram_of_storage_hierarchy"></a>Conceptual diagram of storage hierarchy 
The following example shows the relationships of the Azure subscription, NetApp accounts, capacity pools, and volumes.   

:::image type="content" source="./media/azure-netapp-files-understand-storage-hierarchy/azure-netapp-files-storage-hierarchy.png" alt-text="Conceptual diagram of storage hierarchy." lightbox="./media/azure-netapp-files-understand-storage-hierarchy/azure-netapp-files-storage-hierarchy.png":::

## <a name="azure_netapp_files_account"></a>NetApp accounts

- A NetApp account serves as an administrative grouping of the constituent capacity pools.  
- A NetApp account isn't the same as your general Azure storage account. 
- A NetApp account is regional in scope.   
- You can have multiple NetApp accounts in a region, but each NetApp account is tied to only a single region.
- NetApp accounts must be dedicated to a service level. [Confirm you understand the difference between Elastic zone-redundant storage and other service levels before creating your NetApp account.](azure-netapp-files-service-levels.md)

## <a name="capacity_pools"></a>Capacity pools

Understanding how capacity pools work helps you select the right capacity pool types for your storage needs. 

### General rules of regular capacity pools

- A capacity pool is measured by its provisioned capacity.   
    For more information, see [QoS types](#qos_types).  
- The capacity is provisioned by the fixed SKUs that you purchased (for example, a 4-TiB capacity).
- A capacity pool can have only one service level.  
- Each capacity pool can belong to only one NetApp account. However, you can have multiple capacity pools within a NetApp account.  
- You can't move a capacity pool across NetApp accounts.   
  For example, in the [Conceptual diagram of storage hierarchy](#conceptual_diagram_of_storage_hierarchy), you can't move Capacity Pool 1 US East NetApp account to US West 2 NetApp account.  
- You can't delete a capacity pool until you delete all volumes within the capacity pool. 
- [Azure NetApp Files storage with cool access](cool-access-introduction.md) is supported in Flexible, Standard, Premium, and Ultra service-level capacity pools. For more information about service levels, including the Flexible service level, see [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md).


### General rules of Elastic capacity pools 

- You must have a NetApp account designated for use with Elastic zone-redundant storage.
- A capacity pool is measured by its provisioned capacity.
- The capacity is provisioned by the fixed SKUs that you purchased (for example, a 4-TiB capacity).
- A capacity pool can have only one service level.
- Each capacity pool can belong to only one NetApp Elastic account. You can have multiple capacity pools within a NetApp Elastic account.
- You can't move a capacity pool across NetApp Elastic accounts.

  For example, in the storage hierarchy diagram, you can't move Capacity Pool 1 in the US East 2 NetApp Elastic account to the US West 2 NetApp Elastic account.
- You can't delete a capacity pool until you delete all volumes within the capacity pool.
- If you're using customer-managed keys, [ensure you've configured encryption before creating the capacity pool.](elastic-customer-managed-keys.md).
- Elastic capacity pools enable you to create a failover preference order of availability zones. Some regions that support the Elastic service level only offer two availability zones. Query the region for availability zone with the REST API before creating the capacity pool:

```
GET  https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.NetApp/locations/{location}/elasticRegionInfo?api-version=2025-09-01-preview.
```

### <a name="qos_types"></a>Quality of Service (QoS) types for capacity pools

The QoS type is an attribute of a capacity pool. Azure NetApp Files provides two QoS types of capacity pools: *auto* (default regular capacity pools), *manual* (for regular capacity pools) and *shared* (default for Elastic capacity pools).

#### *Automatic (or auto)* QoS type  

When you create a capacity pool, the default QoS type is auto.

In an auto QoS capacity pool, throughput is assigned automatically to the volumes in the pool, proportional to the size quota assigned to the volumes. 

The maximum throughput allocated to a volume depends on the service level of the capacity pool and the size quota of the volume. See [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md) for an example calculation.

For performance considerations about QoS types, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

#### *Manual* QoS type  

When you [create a capacity pool](azure-netapp-files-set-up-capacity-pool.md), you can specify for the capacity pool to use the manual QoS type. You can also [change an existing capacity pool](manage-manual-qos-capacity-pool.md#change-to-qos) to use the manual QoS type. *Setting the capacity type to manual QoS is a permanent change.* You can't convert a manual QoS type capacity pool to an auto QoS capacity pool. (However, you can move volumes from a manual QoS capacity pool to an auto QoS capacity pool. See [Dynamically change the service level of a volume](dynamic-change-volume-service-level.md).)

In a manual QoS capacity pool, you can assign the capacity and throughput for a volume independently. For minimum and maximum throughput levels, see [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits). The total throughput of all volumes created with a manual QoS capacity pool is limited by the total throughput of the pool. It's determined by the combination of the pool size and the service-level throughput. For instance, a 4-TiB capacity pool with the Ultra service level has a total throughput capacity of 512 MiB/s (4 TiB x 128 MiB/s/TiB) available for the volumes.

Manual QoS capacity pools are required for the [**Flexible** service level](azure-netapp-files-service-levels.md#Flexible), enabling you to adjust throughput and size limits independently for capacity pools using manual QoS. This service level is designed for demanding applications such as Oracle or SAP HANA. For throughput information, see [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md#Flexible).

##### Example of using manual QoS

When you use a manual QoS capacity pool with, for example, an SAP HANA system, an Oracle database, or other workloads requiring multiple volumes, the capacity pool can be used to create these application volumes.  Each volume can provide the individual size and throughput to meet the application requirements. See [Throughput limit examples of volumes in a manual QoS capacity pool](azure-netapp-files-service-levels.md#throughput-limit-examples-of-volumes-in-a-manual-qos-capacity-pool) for details about the benefits.  

#### *Shared* QoS type

When you create a capacity pool in the Elastic zone-redundant storage service level, the default QoS type is shared.

In a shared QoS capacity pool, throughput is not allocated per volume. Instead all volumes share the pool's total throughput. The pool's performance budget is determined by its size and service level (for example, roughly 32 MiB/s of throughput per 1 TiB of capacity in the zone-redundant storage service level). Unlike auto QoS (which ties throughput to volume size) or manual QoS (which requires setting each volume’s throughput), a shared QoS pool has no fixed per-volume limits. The system dynamically distributes I/O so that each volume can reach its needed throughput as long as the pool hasn't exceeded its limit. 

>[!NOTE]
>The total throughput in shared QoS is still finite (capped by pool size × service-level throughput), so plan capacity accordingly. For exact throughput limits, see [Resource limits Elastic zone-redundant storage](azure-netapp-files-resource-limits.md).

## <a name="volumes"></a>Volumes

- A volume is measured by logical capacity consumption and is scalable. 
- A volume's capacity consumption counts against its pool's provisioned capacity.
- A volume's throughput consumption counts against its pool’s available throughput. See [Manual QoS type](#manual-qos-type).
- Each volume belongs to only one pool, but a pool can contain multiple volumes. 
- Volumes contain a capacity of between 50 GiB and 100 TiB. You can create a [large volume](#large-volumes) with a size of between 50 GiB and 1 PiB.

## Elastic volumes 

- A volume is measured by logical capacity consumption and is scalable.
- A volume's capacity consumption counts against its pool's provisioned capacity.
- A volume's throughput consumption contributes to the overall pool’s throughput usage, which is dynamically distributed across all volumes based on demand and availability.
- Each volume belongs to only one pool, but a pool can contain multiple volumes.
- Volumes capacity is between 1 GiB and 16 TiB. You cannot create a large volume currently.

## Large volumes

Azure NetApp Files allows you to create [large volumes](large-volumes.md) up to 1 PiB. In contrast, regular Azure NetApp Files volumes are offered between 50 GiB and 102,400 GiB. 

Large volumes begin at a capacity of 50 TiB and scale up to 1 PiB (or [2 PiB as special requests](large-volumes-requirements-considerations.md#requirements-and-considerations-for-breakthrough-mode-preview)). With cool access enabled, large volumes can grow to 7.2 PiB. 

For more information, see [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md).

## Next steps

- [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
- [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
- [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
- [Understand large volumes](large-volumes.md)
- [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
